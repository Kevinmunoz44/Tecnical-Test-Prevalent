import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/graphql", {
        query: `
          mutation {
            login(email: "${form.email}", password: "${form.password}") {
              token
              user {
                id
                name
                email
              }
            }
          }
        `,
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const { token } = response.data.data.login;

      // Guardar el token en localStorage
      localStorage.setItem("token", token);

      alert("Inicio de sesión exitoso.");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
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
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
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
        >
          Iniciar Sesión
        </button>
        <p className="text-center text-gray-600 mt-4">
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
