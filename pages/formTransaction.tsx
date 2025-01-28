import Sidebar from "./sidebar";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutationTransaction";
import { AuthContext } from "./AuthContext"; // Importamos el AuthContext

const FormTransaction = () => {
  const { user } = useContext(AuthContext); // Obtenemos el usuario autenticado desde el contexto
  const [formData, setFormData] = useState({
    amount: "",
    concept: "",
    date: "",
    transactionType: "Ingreso", // Valor inicial para el tipo de transacción
  });

  // Hook para ejecutar la mutación de creación
  const [createTransaction, { loading: creating, error: createError }] =
    useMutation(CREATE_TRANSACTION);

  // Manejar los cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      const response = await createTransaction({
        variables: {
          concept: formData.concept,
          amount: parseFloat(formData.amount),
          date: formData.date,
          transactionType: formData.transactionType,
          userId: user.id, // Tomamos el userId del usuario autenticado
        },
      });

      if (response.data) {
        alert("Transacción creada exitosamente");
        // Reiniciar el formulario
        setFormData({
          amount: "",
          concept: "",
          date: "",
          transactionType: "Ingreso",
        });
      }
    } catch (err) {
      console.error("Error al crear transacción:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Nuevo Movimiento de Dinero</h1>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
              Monto
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="concept" className="block text-gray-700 font-semibold mb-2">
              Concepto
            </label>
            <input
              type="text"
              id="concept"
              name="concept"
              value={formData.concept}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="transactionType" className="block text-gray-700 font-semibold mb-2">
              Tipo de Transacción
            </label>
            <select
              id="transactionType"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            disabled={creating}
          >
            {creating ? "Creando..." : "Ingresar"}
          </button>

          {createError && (
            <p className="mt-4 text-red-500">
              Error al crear la transacción: {createError.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormTransaction;
