import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const transactionService = {

    getAllTransactions: async () => {
        return await prisma.transaction.findMany({
            include: {user: true},
        });
    },

    getTransactionById: async (id: number) => {
        const transactionId = Number(id);
        return await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true }, 
        });
    },

    createTransaction: async (concept: string, amount: number, transactionType: string, userId: number) =>{
        const transaction = await prisma.transaction.create({
            data: {
                concept,
                amount,
                transactionType,
                user: {
                    connect: { id: userId },  
                },
            },
            include: {
                user: true
            }
        });
        return transaction
    },

    updateTransaction: async (id: number, concept?: string, amount?: number, transactionType?: string) => {
        const transactionId = Number(id);
        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                concept,
                amount,
                transactionType,
            },
            include: {
                user: true,
            }
        });
        return transaction;
    },

    deleteTransaction: async (id: number) => {
        const transactionId = Number(id);
        const transaction = await prisma.transaction.delete({
            where: { id: transactionId },
        });
        return transaction;
    }
}