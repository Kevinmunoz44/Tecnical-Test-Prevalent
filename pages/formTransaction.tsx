import Sidebar from "./sidebar";
import { useState } from "react";

const NewTransaction = () => {
  const [formData, setFormData] = useState({
    monto: "",
    concepto: "",
    fecha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nueva transacción:", formData);

    // Aquí puedes llamar a tu backend para crear la transacción
    // Ejemplo:
    // await fetch("/api/transactions", { method: "POST", body: JSON.stringify(formData) });

    alert("Transacción creada exitosamente");
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
            <label htmlFor="monto" className="block text-gray-700 font-semibold mb-2">
              Monto
            </label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="concepto" className="block text-gray-700 font-semibold mb-2">
              Concepto
            </label>
            <input
              type="text"
              id="concepto"
              name="concepto"
              value={formData.concepto}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fecha" className="block text-gray-700 font-semibold mb-2">
              Fecha
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTransaction;
