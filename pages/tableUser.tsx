import React from "react";
import { useRouter } from "next/router";
import Sidebar from "./sidebar";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/queriesUser";

const TableUser = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const router = useRouter();

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar los usuarios: {error.message}</p>;

  const users = data.users;

  // 🔥 Redirigir al formulario de edición
  const handleEdit = (id: number) => {
    router.push(`/formEditUser?id=${id}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Sistema de gestión de Usuarios</h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 py-2 px-4 text-left">Nombre</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Correo</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Teléfono</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Rol</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 py-2 px-4">{user.name}</td>
                  <td className="border border-gray-300 py-2 px-4">{user.email}</td>
                  <td className="border border-gray-300 py-2 px-4">{user.phone}</td>
                  <td className="border border-gray-300 py-2 px-4">{user.role.name}</td>
                  <td className="border border-gray-300 py-2 px-4">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 mr-2"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableUser;
