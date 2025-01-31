import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

// Mutación para iniciar sesión
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = useContext(AuthContext);

  // Hook para ejecutar la mutación de login
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login?.token) {
        auth?.login(data.login.token, data.login.user);
        router.push("/dashboard");
      }
    },
    onError: (err) => {
      setError(err.message || "Error desconocido");
    },
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores anteriores

    await loginMutation({ variables: { email: form.email, password: form.password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Campo de Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>

        {/* Enlace para registrarse */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
