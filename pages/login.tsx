import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link"; // 🔥 Importar Link para redirección
import { AuthContext } from "../context/AuthContext";
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

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

  const [loginMutation, { loading, error: mutationError }] = useMutation(LOGIN_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation({
        variables: { email: form.email, password: form.password },
      });

      const { token, user } = data.login;
      auth?.login(token, user);

      router.push("/dashboard");
    } catch (err: any) {
      setError(mutationError?.message || "Error desconocido");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg mt-1"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>

        {/* 🔥 Enlace para registrarse */}
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
