import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { PrismaClient } from "@prisma/client";

// Instancia de Prisma Client para interactuar con la base de datos
const prisma = new PrismaClient();

/*
 * Definición de los resolvers de GraphQL para la gestión de usuarios.
 * 
 * - `Query`: Consultas para obtener información de usuarios.
 * - `Mutation`: Operaciones para registrar, actualizar, eliminar usuarios y autenticación.
 */
export const usersResolvers = {
    Query: {
        /*
         * Obtener todos los usuarios registrados en la base de datos.
         * Retorna una lista con todos los usuarios.
         */
        users: async () => {
           return await userService.getAllUsers();
        },

        /*
         * Obtener un usuario específico por su ID.
         * - `id`: Identificador único del usuario.
         * Retorna los datos del usuario si existe.
         */
        user: async (_: unknown, { id }: { id: number }) => {
            return await userService.getUserById(id);
        },

        /*
         * Obtener la información del usuario autenticado.
         * - El usuario se obtiene del contexto proporcionado por Apollo Server.
         * - Verifica que el usuario esté autenticado antes de consultar en la base de datos.
         * Retorna los datos del usuario autenticado.
         */
        currentUser: async (_: unknown, __: unknown, context: any) => {
            const { user } = context;
            if (!user) {
              throw new Error("Usuario no autenticado");
            }
        
            const currentUser = await prisma.user.findUnique({
              where: { id: user.userId },
            });
        
            if (!currentUser) {
              throw new Error("Usuario no encontrado");
            }
        
            return currentUser;
        },
    },
    
    Mutation: {
        /*
         * Crear un nuevo usuario en la base de datos.
         * - `name`, `email`, `password`, `phone`, `roleId`: Datos requeridos para la creación.
         * - La contraseña es cifrada antes de guardarse.
         * Retorna el usuario creado si la operación es exitosa.
         */
        createUser: async (_: unknown, { name, email, password, phone, roleId }: 
        { name: string, email: string, password: string, phone: string, roleId: number }) => {
            try {
                return await userService.createUsers(
                    name, email, password, phone, roleId
                );
            } catch (err) {
                throw new Error("Error al registrar usuario: " + err);
            }
        },

        /*
         * Iniciar sesión con email y contraseña.
         * - `email`, `password`: Credenciales del usuario.
         * - Verifica si el usuario existe en la base de datos.
         * - Comprueba que la contraseña sea correcta usando bcrypt.
         * - Genera un token JWT si la autenticación es exitosa.
         * Retorna el token y los datos del usuario autenticado.
         */
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

        /*
         * Actualizar un usuario existente en la base de datos.
         * - `id`: Identificador único del usuario.
         * - `name`, `email`, `password`, `phone`, `roleId`: Datos opcionales para actualizar.
         * Retorna el usuario actualizado si la operación es exitosa.
         */
        updateUser: async (_: unknown, { id, name, email, password, phone, roleId }: 
        { id: number, name?: string, email?: string, password?: string, phone?: string, roleId?: number }) => {
            try {
                return await userService.updateUsers(
                    id, name, email, password, phone, roleId
                );
            } catch (err) {
                console.error("Error al actualizar usuario:", err);
                return err;
            }
        },

        /*
         * Eliminar un usuario de la base de datos.
         * - `id`: Identificador único del usuario a eliminar.
         * Retorna un mensaje de éxito si la eliminación es exitosa.
         */
        deleteUser: async (_: unknown, { id }: { id: number }) => {
            try {
                await userService.deleteUsers(id);
                return "Usuario eliminado con éxito";
            } catch (err) {
                console.error("Error al eliminar usuario:", err);
                return err;
            }
        },
    }
};
