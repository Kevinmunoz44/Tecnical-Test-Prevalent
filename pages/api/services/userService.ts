import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const userService = {

    getAllUsers: async () => {
        return await prisma.user.findMany({
            include: {
                role: true,
                transactions: true,
            },
        });
    },

    getUserById: async (id: number) => {
        const userId = Number(id);
        return await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true, transactions: true },
        });
    },

    createUsers: async (name: string, email: string, password: string, phone: string, roleId: number, amount: number = 0) => {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password : hashedPassword,
                phone,
                amount,
                role: {
                    connect: { id: roleId },
                },
            },
        });
        return user;
    },

    verifyPassword: async (plainPassword: string, hashedPassword: string) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    },

    getUserByEmail: async (email: string) => {
        return await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });
      },

    updateUsers: async (id: number, name?: string, email?: string, password?: string, phone?: string, roleId?: number, amount?: number) => {
        const userId = Number(id);
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                password: password ? password : undefined,
                phone,
                amount: amount !== undefined ? amount : undefined,
                role: roleId ? { connect: { id: roleId } } : undefined,
            },
            include: {
                role: true,
                transactions: true,
            }
        });
        return user;
    },

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
}
