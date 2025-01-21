import { userService } from '../services/userService';

export const usersResolvers = {
    Query: {
        // Obtener todos los usuarios
        users: async () => {
           return await userService.getAllUsers();
        },
        // Obtener un usuario por ID
        user: async (_: unknown, { id }: { id: number }) => {
            return await userService.getUserById(id);
        },
    },
    
    Mutation: {
        // Crear un nuevo usuario
        createUser: async (_: unknown, { name, email, password, phone, roleId }: { name: string, email: string, password: string, phone: string, roleId: number }) => {
            try {
                return await userService.createUsers(
                    name, email, password, phone, roleId
                );
            } catch (err) {
                if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                    throw new Error("El correo ingresado ya esta registrado");
                }
                throw err;
            }
        },

        // Actualizar un usuario
        updateUser: async (_: unknown, { id, name, email, password, phone, roleId }: { id: number, name?: string, email?: string, password?: string, phone?: string, roleId?: number }) => {
            try {
                return await userService.updateUsers(
                    id, name, email, password, phone, roleId
                );
            } catch (err) {
                console.error("Error update user", err);
                return err;
            }
        },
        // Eliminar un usuario
        deleteUser: async (_: unknown, { id }: { id: number }) => {
            try {
             await userService.deleteUsers(id);
             return "success delete user"; 
            } catch (err) {
                console.error("Error deleted user", err);
                return err;
            }
            
        },
    }
}