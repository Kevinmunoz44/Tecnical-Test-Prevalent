import React from "react";
import Sidebar from "./sidebar";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queriesTransaction";

const TableTransaction = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);

  if (loading) return <p>Cargando transacciones...</p>;
  if (error) return <p>Error al cargar las transacciones: {error.message}</p>;

  const transactions = data.transactions;

  // Calcular el monto total del usuario
  const total = transactions.reduce(
    (acc: number, transaction: any) => acc + transaction.amount,
    0
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Sistema de gestión de Ingresos y Gastos</h1>

        {/* Encabezado con botón "Nuevo" */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold underline">Transacciones</h2>
          <Link
            href="/formTransaction"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Nuevo
          </Link>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 py-2 px-4 text-left">Concepto</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Monto</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Fecha</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: any) => (
                <tr key={transaction.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 py-2 px-4">{transaction.concept}</td>
                  <td
                    className={`border border-gray-300 py-2 px-4 ${
                      transaction.amount < 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    ${transaction.amount}
                  </td>
                  <td className="border border-gray-300 py-2 px-4">{transaction.date}</td>
                  <td className="border border-gray-300 py-2 px-4">{transaction.user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total en la parte inferior derecha */}
        <div className="flex justify-end mt-4">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <span className="font-bold text-gray-700">Total:</span>
            <span className="ml-2 text-green-500 font-semibold">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableTransaction;
