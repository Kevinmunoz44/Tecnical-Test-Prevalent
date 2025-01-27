// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import Sidebar from "./sidebar";

// const FormEditUser = () => {
//   const router = useRouter();
//   const { id } = router.query; // Captura el ID del usuario desde la URL

//   // Estado para almacenar los datos del usuario
//   const [userData, setUserData] = useState({
//     nombre: "",
//     rol: "",
//   });

//   // Simulación: Carga de datos del usuario basado en el ID (aquí puedes conectar con tu backend)
//   useEffect(() => {
//     if (id) {
//       // Simulación de datos del usuario basado en el ID
//       const mockUser = { nombre: "John Doe", rol: "Admin" };
//       setUserData(mockUser);
//     }
//   }, [id]);

//   // Manejar los cambios en los campos del formulario
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserData({
//       ...userData,
//       [name]: value,
//     });
//   };

//   // Manejar el envío del formulario
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Usuario actualizado:", userData);

//     // Aquí puedes enviar los datos al backend para actualizar el usuario
//     alert("Usuario actualizado correctamente.");
//     router.push("/dashboard/tableUser"); // Redirigir de vuelta a la tabla de usuarios
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Contenido principal */}
//       <div className="flex-1 p-8">
//         <h1 className="text-2xl font-bold mb-6">Editar usuario</h1>

//         {/* Formulario */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto"
//         >
//           <div className="mb-4">
//             <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">
//               Nombre
//             </label>
//             <input
//               type="text"
//               id="nombre"
//               name="nombre"
//               value={userData.nombre}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="rol" className="block text-gray-700 font-semibold mb-2">
//               Rol
//             </label>
//             <input
//               type="text"
//               id="rol"
//               name="rol"
//               value={userData.rol}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
//           >
//             Guardar
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormEditUser;
