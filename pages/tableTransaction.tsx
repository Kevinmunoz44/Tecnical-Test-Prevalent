import React from "react";
import Sidebar from "./sidebar";
import Link from "next/link";

const TableTransaction = () => {
  const transactions = [
    { concepto: "Pago de renta", monto: 500, fecha: "2025-01-01", usuario: "Juan" },
    { concepto: "Salario", monto: 2000, fecha: "2025-01-15", usuario: "Juan" },
    { concepto: "Compra de alimentos", monto: -150, fecha: "2025-01-20", usuario: "Juan" },
  ];

  // Calcular el total de ingresos y egresos
  const total = transactions.reduce((acc, transaction) => acc + transaction.monto, 0);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Sistema de gestión de Ingresos y Gastos</h1>

        {/* Botón "Nuevo" */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold underline">Ingresos y egresos</h2>
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
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 py-2 px-4">{transaction.concepto}</td>
                  <td
                    className={`border border-gray-300 py-2 px-4 ${
                      transaction.monto < 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    ${transaction.monto}
                  </td>
                  <td className="border border-gray-300 py-2 px-4">{transaction.fecha}</td>
                  <td className="border border-gray-300 py-2 px-4">{transaction.usuario}</td>
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
