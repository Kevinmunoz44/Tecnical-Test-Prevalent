import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

/*
 * Componente de registro de usuario.
 *
 * - Permite a los usuarios registrarse con nombre, email, contraseña y teléfono.
 * - Usa Axios para enviar una mutación GraphQL al backend.
 * - Redirige al usuario a la página de login tras un registro exitoso.
 */

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/graphql", {
        query: `
          mutation CreateUser($name: String!, $email: String!, $password: String!, $phone: String!, $roleId: Int!, $amount: Float!) {
            createUser(
              name: $name,
              email: $email,
              password: $password,
              phone: $phone,
              roleId: $roleId,
              amount: $amount
            ) {
              id
              email
            }
          }
        `,
        variables: {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          roleId: 2,
          amount: 0,
        },
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Campo de Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Campo de Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Campo de Teléfono */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Botón de Registro */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Register;
