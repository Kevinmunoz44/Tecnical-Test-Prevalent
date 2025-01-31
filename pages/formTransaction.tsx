import Sidebar from "./sidebar";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutationTransaction";
import { GET_TRANSACTIONS } from "../graphql/queriesTransaction"; 
import { AuthContext } from "../context/AuthContext"; 
import { useRouter } from "next/router";

/*
 * Componente para crear una nueva transacción.
 * 
 * - Permite a los usuarios autenticados registrar ingresos o egresos.
 * - Usa Apollo Client para enviar la mutación `CREATE_TRANSACTION`.
 * - Actualiza la caché local para reflejar los cambios sin recargar la página.
 */

const FormTransaction = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  //  Estado del formulario
  const [formData, setFormData] = useState({
    amount: "",
    concept: "",
    date: "",
    transactionType: "Ingreso",
  });

  //  Hook para ejecutar la mutación de creación de transacción
  const [createTransaction, { loading: creating, error: createError }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }], // 🔹 Refresca la tabla de transacciones
    update: (cache, { data }) => {
      if (data?.createTransaction) {
        cache.modify({
          fields: {
            transactions(existingTransactions = []) {
              return [data.createTransaction, ...existingTransactions];
            }
          }
        });
      }
    }
  });

  //  Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //  Manejo del envío del formulario
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
          concept: formData.concept.trim(),
          amount: formattedAmount,
          date: formData.date,
          transactionType: formData.transactionType,
          userId: Number(user.id),
        },
      });

      if (response.data) {
        router.push("/tableTransaction"); // 🔹 Redirige tras la creación
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
          
          {/*  Campo de Monto */}
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

          {/*  Campo de Concepto */}
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

          {/*  Campo de Fecha */}
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

          {/*  Select para Tipo de Transacción */}
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

          {/*  Botón de Enviar */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" disabled={creating}>
            {creating ? "Creando..." : "Ingresar"}
          </button>

          {/*  Mensaje de error si ocurre */}
          {createError && <p className="mt-4 text-red-500">Error al crear la transacción: {createError.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default FormTransaction;
