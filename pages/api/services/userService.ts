import { PrismaClient } from "@prisma/client";

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
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                phone,
                amount,
                role: {
                    connect: { id: roleId },
                },
            },
            include: {
                role: true,
                transactions: true,
            }
        });
        return user;
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
