import { roleService } from '../services/roleService';

/*
 * Definición de los resolvers de GraphQL para la gestión de roles.
 * 
 * - `Query`: Consultas para obtener roles.
 * - `Mutation`: Operaciones para crear, actualizar y eliminar roles.
 */
export const rolesResolvers = {
    Query: {
        /*
         * Obtener todos los roles disponibles en la base de datos.
         * Retorna una lista de roles.
         */
        roles: async () => {
            return await roleService.getAllRoles();
        },

        /*
         * Obtener un rol específico por su ID.
         * - `id`: Identificador único del rol.
         * Retorna un objeto con los datos del rol.
         */
        role: async (_: unknown, { id }: { id: number }) => {
            return await roleService.getRoleById(id);
        },
    },

    Mutation: {
        /*
         * Crear un nuevo rol en la base de datos.
         * - `name`: Nombre del nuevo rol.
         * Retorna el rol creado si la operación es exitosa.
         */
        createRole: async (_: unknown, { name }: { name: string }, context: any) => {
            try {
                return await roleService.createRole(name);
            } catch (error) {
                console.error('Error creating role:', error);
                throw error;
            }
        },

        /*
         * Actualizar un rol existente en la base de datos.
         * - `id`: Identificador único del rol.
         * - `name`: Nuevo nombre del rol.
         * Retorna el rol actualizado si la operación es exitosa.
         */
        updateRole: async (_: unknown, { id, name }: { id: number, name: string }, context: any) => {
            try {
                return await roleService.updateRole(id, name);
            } catch (err) {
                console.error("Error updating role:", err);
                return err;
            }
        },

        /*
         * Eliminar un rol de la base de datos.
         * - `id`: Identificador único del rol a eliminar.
         * Retorna una confirmación o un error si la operación falla.
         */
        deleteRole: async (_: unknown, { id }: { id: number }, context: any) => {
            try {
                return await roleService.deleteRole(id);
            } catch (err) {
                console.error("Error deleting role:", err);
                return err;
            }
        }
    }
};
