import { transactionService } from '../services/transactionServe';

export const transactionsResolvers = {
  Query: {
    // Obtener todas las transacciones del usuario autenticado
    transactions: async (_: unknown, __: unknown) => {
    //   const { user } = context; // Obtenemos el usuario autenticado del contexto
    //   if (!user) {
    //     throw new Error("Usuario no autenticado");
    //   }

      return await transactionService.getAllTransactions();
    },

    // Obtener una transacción específica del usuario autenticado
    transaction: async (_: unknown, { id }: { id: number }) => {
    //   const { user } = context; // Obtenemos el usuario autenticado del contexto
    //   if (!user) {
    //     throw new Error("Usuario no autenticado");
    //   }

      return await transactionService.getTransactionById(id);
    },
  },

  Mutation: {
    // Crear una nueva transacción
    createTransaction: async (
      _: unknown,
      { concept, amount, date, transactionType, userId }: { concept: string; amount: number; date: string; transactionType: string; userId: number }) => {
    //   const { user } = context; // Obtenemos el usuario autenticado del contexto
    //   if (!user) {
    //     throw new Error("Usuario no autenticado");
    //   }
    //   if (user.userId !== userId) {
    //     throw new Error("No tienes permiso para crear transacciones para otro usuario");
    //   }
      return await transactionService.createTransaction(
        concept,
        amount,
        date,
        transactionType,
        userId
      );
    },

    // Actualizar una transacción
    updateTransaction: async (
      _: unknown,
      { id, concept, amount, date, transactionType }: { id: number; concept?: string; amount?: number; date?: string; transactionType?: string },
      context: any
    ) => {
      const { user } = context; // Obtenemos el usuario autenticado del contexto
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const transaction = await transactionService.getTransactionById(id);

      if (!transaction) {
        throw new Error("Transacción no encontrada o no autorizada");
      }

      return await transactionService.updateTransaction(id, concept, amount, date, transactionType);
    },

    // Eliminar una transacción
    deleteTransaction: async (_: unknown, { id }: { id: number }, context: any) => {
      const { user } = context; // Obtenemos el usuario autenticado del contexto
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const transaction = await transactionService.getTransactionById(id);

      if (!transaction) {
        throw new Error("Transacción no encontrada o no autorizada");
      }

      return await transactionService.deleteTransaction(id);
    },
  },
};
