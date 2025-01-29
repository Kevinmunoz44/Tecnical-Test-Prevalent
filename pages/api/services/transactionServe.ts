import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const transactionService = {
  getAllTransactions: async (userId: number) => {
    return await prisma.transaction.findMany({
      where: { userId: userId }, // Solo traer transacciones del usuario autenticado
      include: { user: true },
    });
  },

  getTransactionById: async (id: number, userId: number) => {
    return await prisma.transaction.findFirst({
      where: { id, userId }, // Asegurar que la transacción pertenece al usuario autenticado
      include: { user: true },
    });
  },

  createTransaction: async (
    concept: string,
    amount: number,
    date: string,
    transactionType: string,
    userId: number
  ) => {
    // 🔥 Asegurar que el monto es positivo antes de procesarlo
    const transactionAmount =
      transactionType === "Egreso" ? -Math.abs(amount) : Math.abs(amount);

    // 🔥 Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // 🔥 Validar saldo suficiente antes de registrar un egreso
    if (transactionType === "Egreso" && user.amount < Math.abs(amount)) {
      throw new Error("Saldo insuficiente para realizar el egreso");
    }

    // 🔥 Crear la transacción con el monto ajustado
    const transaction = await prisma.transaction.create({
      data: {
        concept,
        amount: transactionAmount, // Asegurar que los egresos sean negativos
        date,
        transactionType,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: true,
      },
    });

    // 🔥 Actualizar el saldo del usuario
    await prisma.user.update({
      where: { id: userId },
      data: {
        amount: user.amount + transactionAmount, // Suma ingresos, resta egresos
      },
    });

    return transaction;
  },

  updateTransaction: async (
    id: number,
    concept?: string,
    amount?: number,
    date?: string,
    transactionType?: string
  ) => {
    const transactionId = Number(id);

    // 🔥 Obtener la transacción existente
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      throw new Error("Transacción no encontrada");
    }

    // 🔥 Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: existingTransaction.userId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // 🔥 Revertir el efecto de la transacción anterior en el saldo
    const previousAmountAdjustment =
      existingTransaction.transactionType === "Ingreso"
        ? existingTransaction.amount
        : -existingTransaction.amount;

    // 🔥 Determinar el nuevo monto y ajuste
    const newAmountAdjustment =
      transactionType === "Ingreso"
        ? Math.abs(amount ?? existingTransaction.amount)
        : -Math.abs(amount ?? existingTransaction.amount);

    const newUserBalance =
      user.amount - previousAmountAdjustment + newAmountAdjustment;

    if (newUserBalance < 0) {
      throw new Error("Saldo insuficiente para actualizar la transacción");
    }

    // 🔥 Actualizar la transacción en la base de datos
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        concept,
        amount: newAmountAdjustment,
        date,
        transactionType,
      },
      include: {
        user: true,
      },
    });

    // 🔥 Actualizar el saldo del usuario
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

    // 🔥 Obtener la transacción existente
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      throw new Error("Transacción no encontrada");
    }

    // 🔥 Obtener al usuario
    const user = await prisma.user.findUnique({
      where: { id: existingTransaction.userId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // 🔥 Ajustar el saldo del usuario
    const adjustment =
      existingTransaction.transactionType === "Ingreso"
        ? -existingTransaction.amount
        : existingTransaction.amount;

    // 🔥 Eliminar la transacción
    const transaction = await prisma.transaction.delete({
      where: { id: transactionId },
    });

    // 🔥 Actualizar el saldo del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        amount: user.amount + adjustment,
      },
    });

    return transaction;
  },
};
