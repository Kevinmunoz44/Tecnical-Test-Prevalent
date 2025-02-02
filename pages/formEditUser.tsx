import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Sidebar from "./sidebar";
import { UPDATE_USER } from "../graphql/mutationUser";
import { gql } from "@apollo/client";

//  Query para obtener el usuario por ID
const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      phone
      role {
        id
        name
      }
    }
  }
`;

//  Query para obtener todos los roles disponibles
const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
    }
  }
`;

const FormEditUser = () => {
  const router = useRouter();
  const userId = router.query.id ? String(router.query.id) : "";

  //  Obtener datos del usuario
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  });

  //  Obtener lista de roles
  const { data: rolesData, loading: rolesLoading } = useQuery(GET_ROLES);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    roleId: "",
  });

  const [updateUser, { loading: updating, error: updateError }] = useMutation(UPDATE_USER, {
    onCompleted: () => router.push("/tableUser"), // 🔹 Redirige tras la actualización
    refetchQueries: [{ query: GET_USER_BY_ID, variables: { id: userId } }],
  });

  // Cargar datos del usuario en el formulario
  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        roleId: data.user.role?.id || "",
      });
    }
  }, [data]);

  //  Manejo de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert("ID de usuario inválido.");

    try {
      await updateUser({
        variables: {
          id: Number(userId),
          name: formData.name,
          phone: formData.phone,
          roleId: Number(formData.roleId),
        },
      });
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
  };

  // Mostrar carga o errores si ocurren
  if (loading || rolesLoading) return <p>Cargando datos...</p>;
  if (error) return <p className="text-red-500">Error al obtener usuario: {error.message}</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto">
          {/* 🔹 Campo de Nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* 🔹 Campo de Teléfono */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* 🔹 Select para elegir el rol */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Rol</label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Seleccione un rol</option>
              {rolesData.roles.map((role: { id: string; name: string }) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/*  Botón de actualización */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            disabled={updating}
          >
            {updating ? "Actualizando..." : "Actualizar"}
          </button>

          {/*  Mostrar error si ocurre */}
          {updateError && <p className="mt-4 text-red-500">Error: {updateError.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default FormEditUser;
