import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Instancia de Prisma Client para interactuar con la base de datos
const prisma = new PrismaClient();

/*
 * Servicio para la gestión de usuarios.
 * 
 * - `getAllUsers`: Obtiene todos los usuarios junto con sus roles y transacciones.
 * - `getUserById`: Obtiene un usuario por su ID.
 * - `createUsers`: Crea un nuevo usuario con contraseña cifrada.
 * - `verifyPassword`: Compara una contraseña en texto plano con su versión cifrada.
 * - `getUserByEmail`: Obtiene un usuario por su correo electrónico.
 * - `updateUsers`: Actualiza los datos de un usuario.
 * - `deleteUsers`: Elimina un usuario de la base de datos.
 */
export const userService = {

    /*
     * Obtener todos los usuarios registrados en la base de datos.
     * - Incluye la información del rol y las transacciones de cada usuario.
     * Retorna un array de usuarios.
     */
    getAllUsers: async () => {
        return await prisma.user.findMany({
            include: {
                role: true,
                transactions: true,
            },
        });
    },

    /*
     * Obtener un usuario específico por su ID.
     * - `id`: Identificador único del usuario.
     * - Convierte el ID a número por seguridad.
     * - Incluye la información del rol y las transacciones del usuario.
     * Retorna el usuario si existe.
     */
    getUserById: async (id: number) => {
        const userId = Number(id);
        return await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true, transactions: true },
        });
    },

    /*
     * Crear un nuevo usuario en la base de datos.
     * - `name`, `email`, `password`, `phone`, `roleId`: Datos requeridos.
     * - `amount`: Opcional, por defecto es 0.
     * - La contraseña se cifra antes de guardarse.
     * - Se conecta el usuario con un rol existente.
     * Retorna el usuario creado si la operación es exitosa.
     */
    createUsers: async (name: string, email: string, password: string, phone: string, roleId: number, amount: number = 0) => {
        const hashedPassword = await bcrypt.hash(password, 10); // Cifrado de contraseña
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                amount,
                role: {
                    connect: { id: roleId },
                },
            },
        });
        return user;
    },

    /*
     * Verifica si una contraseña en texto plano coincide con la versión cifrada.
     * - `plainPassword`: Contraseña ingresada por el usuario.
     * - `hashedPassword`: Contraseña almacenada en la base de datos.
     * Retorna `true` si las contraseñas coinciden, `false` si no.
     */
    verifyPassword: async (plainPassword: string, hashedPassword: string) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    },

    /*
     * Obtener un usuario por su correo electrónico.
     * - `email`: Dirección de correo del usuario.
     * - Incluye la información del rol del usuario.
     * Retorna el usuario si existe.
     */
    getUserByEmail: async (email: string) => {
        return await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });
    },

    /*
     * Actualizar un usuario en la base de datos.
     * - `id`: Identificador único del usuario.
     * - `name`, `email`, `password`, `phone`, `roleId`, `amount`: Datos opcionales para actualizar.
     * - La contraseña solo se actualiza si se proporciona una nueva.
     * - Se actualiza el rol si se proporciona `roleId`.
     * - Se actualiza la cantidad (`amount`) si se proporciona un nuevo valor.
     * Retorna el usuario actualizado.
     */
    updateUsers: async (id: number, name?: string, email?: string, password?: string, phone?: string, roleId?: number, amount?: number) => {
        const userId = Number(id);
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                password: password ? password : undefined, // Solo actualiza si se proporciona una nueva contraseña
                phone,
                amount: amount !== undefined ? amount : undefined, // Solo actualiza si hay un nuevo monto
                role: roleId ? { connect: { id: roleId } } : undefined, // Actualiza el rol si se proporciona un nuevo
            },
            include: {
                role: true,
                transactions: true,
            }
        });
        return user;
    },

    /*
     * Eliminar un usuario de la base de datos.
     * - `id`: Identificador único del usuario.
     * - Convierte el ID a número y valida que sea válido.
     * - Si el usuario no existe, lanza un error.
     * Retorna el usuario eliminado si la operación es exitosa.
     */
    deleteUsers: async (id: number) => {
        const userId = Number(id);
        if (isNaN(userId)) {
            throw new Error("El ID del usuario no es un número válido");
        }
        const user = await prisma.user.delete({
            where: {
                id: userId
            }
        });
        return user;
    }
};
