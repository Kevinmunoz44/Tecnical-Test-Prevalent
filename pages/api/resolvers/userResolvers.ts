import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

        currentUser: async (_: unknown, __: unknown, context: any) => {
            const { user } = context; // Usuario obtenido del contexto
            if (!user) {
              throw new Error("Usuario no autenticado");
            }
        
            const currentUser = await prisma.user.findUnique({
              where: { id: user.userId }, // Buscar el usuario por su ID
            });
        
            if (!currentUser) {
              throw new Error("Usuario no encontrado");
            }
        
            return currentUser;
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
                throw new Error("Error al registrar usuario" + err);
            }
        },

        login: async (_: unknown, { email, password }: { email: string; password: string }) => {
            // Busca al usuario por email
            const user = await userService.getUserByEmail(email);
      
            if (!user) {
              throw new Error('Usuario no encontrado');
            }
      
            // Verifica la contraseña usando bcrypt
            const isValidPassword = await userService.verifyPassword(password, user.password);
      
            if (!isValidPassword) {
              throw new Error('Credenciales incorrectas');
            }
      
            // Verifica si el usuario tiene un rol asignado
            if (!user.role) {
              throw new Error('El usuario no tiene un rol asignado');
            }
      
            // Genera el token JWT
            const token = authService.generateToken(user.id, user.role.name);
      
            return { token, user };
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