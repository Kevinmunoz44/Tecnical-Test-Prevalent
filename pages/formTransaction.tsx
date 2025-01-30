import Sidebar from "./sidebar";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutationTransaction";
import { GET_TRANSACTIONS } from "../graphql/queriesTransaction"; // 🔥 Importamos la query de transacciones
import { AuthContext } from "./AuthContext"; 
import { useRouter } from "next/router";

const FormTransaction = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: "",
    concept: "",
    date: "",
    transactionType: "Ingreso",
  });

  // Hook para ejecutar la mutación con actualización de caché
  const [createTransaction, { loading: creating, error: createError }] =
    useMutation(CREATE_TRANSACTION, {
      refetchQueries: [{ query: GET_TRANSACTIONS }], // 🔥 Actualiza la tabla al instante
      update: (cache, { data }) => {
        if (data?.createTransaction) {
          const newTransaction = data.createTransaction;

          // 🔥 Actualizar la caché manualmente sin recargar la página
          cache.modify({
            fields: {
              transactions(existingTransactions = []) {
                return [newTransaction, ...existingTransactions];
              }
            }
          });
        }
      }
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      const amountValue = parseFloat(formData.amount);
      const formattedAmount = formData.transactionType === "Egreso" ? -Math.abs(amountValue) : Math.abs(amountValue);

      const response = await createTransaction({
        variables: {
          concept: formData.concept,
          amount: formattedAmount,
          date: formData.date,
          transactionType: formData.transactionType,
          userId: Number(user.id),
        },
      });

      if (response.data) {
        router.push("/tableTransaction");
      }
    } catch (err) {
      console.error("Error al crear transacción:", err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Nuevo Movimiento de Dinero</h1>
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Monto</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Concepto</label>
            <input
              type="text"
              name="concept"
              value={formData.concept}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Tipo de Transacción</label>
            <select
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
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" disabled={creating}>
            {creating ? "Creando..." : "Ingresar"}
          </button>
          {createError && <p className="mt-4 text-red-500">Error al crear la transacción: {createError.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default FormTransaction;
