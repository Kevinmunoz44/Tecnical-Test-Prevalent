import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/*
 * Componente de barra lateral (Sidebar).
 *
 * - Muestra la información del usuario autenticado.
 * - Proporciona enlaces de navegación a diferentes secciones de la aplicación.
 * - Incluye un botón para cerrar sesión llamando al método `logout` del contexto.
 */

const Sidebar = () => {
  const auth = useContext(AuthContext); // Accede al contexto de autenticación

  return (
    <div className="w-64 h-screen bg-gray-200 flex flex-col shadow-md">
      {/* Información del usuario */}
      <div className="p-4 border-b border-gray-300">
        {auth?.user ? (
          <div>
            <p className="text-lg font-bold text-gray-800">{auth.user.name}</p>
            <p className="text-sm text-gray-500">{auth.user.email}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay usuario autenticado</p>
        )}
      </div>

      {/* Menú de navegación */}
      <nav className="mt-4">
        <ul>
          <li>
            <Link
              href="/dashboard"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-300 hover:text-black"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/tableTransaction"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-300 hover:text-black"
            >
              Ingresos y egresos
            </Link>
          </li>
          <li>
            <Link
              href="/tableUser"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-300 hover:text-black"
            >
              Usuarios
            </Link>
          </li>
          <li>
            {/* Botón de Cerrar Sesión */}
            <button
              onClick={auth?.logout} // Llama al método logout del contexto
              className="block py-2 px-4 text-red-500 hover:bg-red-600 hover:text-white w-full text-left"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
