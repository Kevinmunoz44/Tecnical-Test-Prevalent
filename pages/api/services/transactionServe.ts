import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const transactionService = {

    getAllTransactions: async () => {
        return await prisma.transaction.findMany({
            include: { user: true },
        });
    },

    getTransactionById: async (id: number) => {
        const transactionId = Number(id);
        return await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true }, 
        });
    },

    createTransaction: async (concept: string, amount: number, transactionType: string, userId: number) => {
        const transactionAmount = transactionType === "Ingreso" ? amount : -amount;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (transactionType === "Egreso" && user.amount < amount) {
            throw new Error("Saldo insuficiente para realizar el egreso");
        }

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
                user: true,
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                amount: user.amount + transactionAmount,
            },
        });

        return transaction;
    },

    updateTransaction: async (id: number, concept?: string, amount?: number, transactionType?: string) => {
        const transactionId = Number(id);

        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!existingTransaction) {
            throw new Error("Transacción no encontrada");
        }

        const user = await prisma.user.findUnique({
            where: { id: existingTransaction.userId },
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        // Revertir el efecto de la transacción anterior en el saldo
        const previousAmountAdjustment = existingTransaction.transactionType === "Ingreso"
            ? existingTransaction.amount
            : -existingTransaction.amount;

        const newAmountAdjustment = transactionType === "Ingreso"
            ? amount ?? existingTransaction.amount
            : -(amount ?? existingTransaction.amount);

        const newUserBalance = user.amount - previousAmountAdjustment + newAmountAdjustment;

        if (newUserBalance < 0) {
            throw new Error("Saldo insuficiente para actualizar la transacción");
        }

        // Actualizar la transacción
        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                concept,
                amount,
                transactionType,
            },
            include: {
                user: true,
            },
        });

        // Actualizar el saldo del usuario
        await prisma.user.update({
            where: { id: user.id },
            data: {
                amount: newUserBalance,
            },
        });

        return transaction;
    },

    deleteTransaction: async (id: number) => {
        const transactionId = Number(id);

        // Obtener la transacción existente
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!existingTransaction) {
            throw new Error("Transacción no encontrada");
        }

        // Ajustar el saldo del usuario
        const user = await prisma.user.findUnique({
            where: { id: existingTransaction.userId },
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const adjustment = existingTransaction.transactionType === "Ingreso"
            ? -existingTransaction.amount
            : existingTransaction.amount;

        // Eliminar la transacción
        const transaction = await prisma.transaction.delete({
            where: { id: transactionId },
        });

        // Actualizar el saldo del usuario
        await prisma.user.update({
            where: { id: user.id },
            data: {
                amount: user.amount + adjustment,
            },
        });

        return transaction;
    },
};
