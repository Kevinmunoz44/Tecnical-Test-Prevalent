import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import Link from "next/link";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Bienvenido</h1>
        <p className="text-gray-600 mb-6">
          ¡Bienvenido a nuestra aplicación! Por favor, inicia sesión o regístrate para comenzar.
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-center"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 text-center"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
