import { roleService } from '../services/roleService'

export const rolesResolvers = {
    Query: {
        // Obtener todos los roles
        roles: async () => {
            return await roleService.getAllRoles();
        },
        // Obtener un rol por ID
        role: async (_: unknown, { id }: { id: number }) => {
            return await roleService.getRoleById(id);
        },
    },

    Mutation: {
        // Crear un nuevo rol
        createRole: async (_: unknown, { name }: { name: string }) => {
            try {
                return await roleService.createRole(name);
            } catch (error) {
                console.error('Error creating role:', error);
                throw error;
            }
        },
        // Actualizar un rol
        updateRole: async (_: unknown, { id, name }: { id: number, name: string }) => {
            try {
                return await roleService.updateRole(id, name);
            } catch (err) {
                console.error("Error updating role", err);
                return err;
            }
        },
        // Eliminar un rol
        deleteRole: async (_: unknown, { id }: { id: number }) => {
            try {
                return await roleService.deleteRole(id);
            } catch (err) {
                console.error("Error deleting role", err)
                return err;
            }
        }
    }
}