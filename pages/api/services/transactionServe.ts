import { PrismaClient } from "@prisma/client";

// Instancia de Prisma Client para interactuar con la base de datos
const prisma = new PrismaClient();

/*
 * Servicio para la gestión de transacciones.
 * 
 * - `getAllTransactions`: Obtiene todas las transacciones de un usuario.
 * - `getTransactionById`: Obtiene una transacción específica del usuario.
 * - `createTransaction`: Crea una nueva transacción y actualiza el saldo del usuario.
 * - `updateTransaction`: Modifica una transacción y ajusta el saldo del usuario.
 * - `deleteTransaction`: Elimina una transacción y revierte su efecto en el saldo.
 */
export const transactionService = {
  
  /*
   * Obtener todas las transacciones de un usuario autenticado.
   * - `userId`: Identificador único del usuario.
   * - Retorna un array de transacciones asociadas al usuario.
   */
  getAllTransactions: async (userId: number) => {
    return await prisma.transaction.findMany({
      where: { userId },
      include: { user: true },
    });
  },

  /*
   * Obtener una transacción específica del usuario autenticado.
   * - `id`: Identificador de la transacción.
   * - `userId`: Verifica que la transacción pertenece al usuario autenticado.
   * - Retorna la transacción si existe.
   */
  getTransactionById: async (id: number, userId: number) => {
    return await prisma.transaction.findFirst({
      where: { id, userId },
      include: { user: true },
    });
  },

  /*
   * Crear una nueva transacción y actualizar el saldo del usuario.
   * - `concept`: Descripción de la transacción.
   * - `amount`: Monto de la transacción.
   * - `date`: Fecha de la transacción.
   * - `transactionType`: Tipo de transacción ("Ingreso" o "Egreso").
   * - `userId`: ID del usuario que realiza la transacción.
   * - Valida saldo suficiente antes de registrar un egreso.
   * - Ajusta el saldo del usuario después de la transacción.
   * - Retorna la transacción creada.
   */
  createTransaction: async (
    concept: string,
    amount: number,
    date: string,
    transactionType: string,
    userId: number
  ) => {
    const transactionAmount =
      transactionType === "Egreso" ? -Math.abs(amount) : Math.abs(amount);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (transactionType === "Egreso" && user.amount < Math.abs(amount)) {
      throw new Error("Saldo insuficiente para realizar el egreso");
    }

    const transaction = await prisma.transaction.create({
      data: {
        concept,
        amount: transactionAmount,
        date,
        transactionType,
        user: {
          connect: { id: userId },
        },
      },
      include: { user: true },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        amount: user.amount + transactionAmount,
      },
    });

    return transaction;
  },

  /*
   * Actualizar una transacción existente y ajustar el saldo del usuario.
   * - `id`: Identificador de la transacción.
   * - `concept`, `amount`, `date`, `transactionType`: Datos opcionales para actualizar.
   * - Recalcula el saldo del usuario con base en la nueva información.
   * - Verifica que el saldo no sea negativo tras la actualización.
   * - Retorna la transacción actualizada.
   */
  updateTransaction: async (
    id: number,
    concept?: string,
    amount?: number,
    date?: string,
    transactionType?: string
  ) => {
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

    const previousAmountAdjustment =
      existingTransaction.transactionType === "Ingreso"
        ? existingTransaction.amount
        : -existingTransaction.amount;

    const newAmountAdjustment =
      transactionType === "Ingreso"
        ? Math.abs(amount ?? existingTransaction.amount)
        : -Math.abs(amount ?? existingTransaction.amount);

    const newUserBalance =
      user.amount - previousAmountAdjustment + newAmountAdjustment;

    if (newUserBalance < 0) {
      throw new Error("Saldo insuficiente para actualizar la transacción");
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        concept,
        amount: newAmountAdjustment,
        date,
        transactionType,
      },
      include: { user: true },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        amount: newUserBalance,
      },
    });

    return transaction;
  },

  /*
   * Eliminar una transacción y revertir su efecto en el saldo del usuario.
   * - `id`: Identificador de la transacción a eliminar.
   * - Recalcula el saldo del usuario tras eliminar la transacción.
   * - Retorna la transacción eliminada.
   */
  deleteTransaction: async (id: number) => {
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

    const adjustment =
      existingTransaction.transactionType === "Ingreso"
        ? -existingTransaction.amount
        : existingTransaction.amount;

    const transaction = await prisma.transaction.delete({
      where: { id: transactionId },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        amount: user.amount + adjustment,
      },
    });

    return transaction;
  },
};
