import { PrismaClient } from "@prisma/client";

// Instancia de Prisma Client para interactuar con la base de datos
const prisma = new PrismaClient();

/*
 * Servicio para la gestión de roles.
 *
 * - `getAllRoles`: Obtiene todos los roles.
 * - `getRoleById`: Obtiene un rol por su ID.
 * - `createRole`: Crea un nuevo rol con validación de nombre.
 * - `updateRole`: Modifica el nombre de un rol existente.
 * - `deleteRole`: Elimina un rol de la base de datos.
 */
export const roleService = {
  
  /*
   * Obtener todos los roles disponibles en la base de datos.
   * Retorna un array de roles.
   */
  getAllRoles: async () => {
    try {
      return await prisma.role.findMany();
    } catch (error) {
      throw new Error("Error al obtener roles: " + error.message);
    }
  },

  /*
   * Obtener un rol específico por su ID.
   * - `id`: Identificador único del rol.
   * - Si el rol no existe, lanza un error.
   * Retorna el rol encontrado.
   */
  getRoleById: async (id: number) => {
    try {
      if (!id) {
        throw new Error("El ID del rol es obligatorio");
      }

      const role = await prisma.role.findUnique({
        where: { id },
      });

      if (!role) {
        throw new Error("Rol no encontrado");
      }

      return role;
    } catch (error) {
      throw new Error("Error al obtener el rol: " + error.message);
    }
  },

  /*
   * Crear un nuevo rol en la base de datos.
   * - `name`: Nombre del rol.
   * - Valida que el nombre no esté vacío.
   * - Retorna el rol creado.
   */
  createRole: async (name: string) => {
    try {
      if (!name || name.trim() === "") {
        throw new Error("El nombre del rol no puede estar vacío");
      }

      console.log("Creando rol con nombre:", name.trim());

      const newRole = await prisma.role.create({
        data: { name: name.trim() },
      });

      return newRole;
    } catch (error) {
      throw new Error("Error al crear el rol: " + error.message);
    }
  },

  /*
   * Actualizar un rol existente en la base de datos.
   * - `id`: Identificador único del rol.
   * - `name`: Nuevo nombre del rol.
   * - Valida que el ID y el nombre sean correctos.
   * - Retorna el rol actualizado.
   */
  updateRole: async (id: number, name: string) => {
    try {
      if (!id) {
        throw new Error("El ID del rol es obligatorio");
      }

      if (!name || name.trim() === "") {
        throw new Error("El nombre del rol no puede estar vacío");
      }

      const updatedRole = await prisma.role.update({
        where: { id },
        data: { name: name.trim() },
      });

      return updatedRole;
    } catch (error) {
      throw new Error("Error al actualizar el rol: " + error.message);
    }
  },

  /*
   * Eliminar un rol de la base de datos.
   * - `id`: Identificador único del rol a eliminar.
   * - Valida que el ID sea un número válido.
   * - Retorna el rol eliminado.
   */
  deleteRole: async (id: number) => {
    try {
      if (!id) {
        throw new Error("El ID del rol es obligatorio");
      }

      const deletedRole = await prisma.role.delete({
        where: { id },
      });

      return deletedRole;
    } catch (error) {
      throw new Error("Error al eliminar el rol: " + error.message);
    }
  },
};
