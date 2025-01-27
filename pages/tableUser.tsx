import React from "react";
import Sidebar from "./sidebar";

const TableUser = () => {
  // Ejemplo de datos de usuarios
  const users = [
    { nombre: "John Doe", correo: "test@test.com", telefono: "3245432", id: 1 },
    { nombre: "Jane Smith", correo: "jane@smith.com", telefono: "9876543", id: 2 },
  ];

  // Función para manejar la edición
  const handleEdit = (id: number) => {
    console.log(`Editar usuario con ID: ${id}`);
    // Aquí puedes redirigir al formulario de edición o realizar otra acción
  };

  // Función para manejar la eliminación
  const handleDelete = (id: number) => {
    console.log(`Eliminar usuario con ID: ${id}`);
    // Aquí puedes agregar lógica para eliminar el usuario
    alert(`Usuario con ID ${id} eliminado.`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Sistema de gestión de Ingresos y Gastos</h1>

        {/* Título */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold underline">Usuarios</h2>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 py-2 px-4 text-left">Nombre</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Correo</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Teléfono</th>
                <th className="border border-gray-300 py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 py-2 px-4">{user.nombre}</td>
                  <td className="border border-gray-300 py-2 px-4">{user.correo}</td>
                  <td className="border border-gray-300 py-2 px-4">{user.telefono}</td>
                  <td className="border border-gray-300 py-2 px-4">
                    {/* Botón Editar */}
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 mr-2"
                    >
                      Editar
                    </button>
                    {/* Botón Eliminar */}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                    >
                      Eliminar
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
