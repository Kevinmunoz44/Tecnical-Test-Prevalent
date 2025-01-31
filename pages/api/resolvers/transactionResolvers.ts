import { transactionService } from '../services/transactionServe';

/*
 * Definición de los resolvers de GraphQL para la gestión de transacciones.
 * 
 * - `Query`: Consultas para obtener transacciones del usuario autenticado.
 * - `Mutation`: Operaciones para crear, actualizar y eliminar transacciones.
 */
export const transactionsResolvers = {
  Query: {
    /*
     * Obtener todas las transacciones del usuario autenticado.
     * - Verifica que el usuario esté autenticado antes de realizar la consulta.
     * - Devuelve un array con las transacciones del usuario.
     */
    transactions: async (_: unknown, __: unknown, context: any) => {
      const { user } = context;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      return await transactionService.getAllTransactions(user.userId);
    },

    /*
     * Obtener una transacción específica del usuario autenticado.
     * - `id`: Identificador único de la transacción.
     * - Verifica que el usuario esté autenticado y tenga acceso a la transacción.
     * - Devuelve la transacción si existe y pertenece al usuario.
     */
    transaction: async (_: unknown, { id }: { id: number }, context: any) => {
      const { user } = context;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      return await transactionService.getTransactionById(id, user.userId);
    },
  },

  Mutation: {
    /*
     * Crear una nueva transacción en la base de datos.
     * - `concept`: Concepto de la transacción.
     * - `amount`: Monto de la transacción.
     * - `date`: Fecha de la transacción.
     * - `transactionType`: Tipo de transacción (ingreso/gasto).
     * - `userId`: ID del usuario al que pertenece la transacción.
     * Retorna la transacción creada si la operación es exitosa.
     */
    createTransaction: async (
      _: unknown,
      { concept, amount, date, transactionType, userId }: 
      { concept: string; amount: number; date: string; transactionType: string; userId: number }
    ) => {
      return await transactionService.createTransaction(
        concept,
        amount,
        date,
        transactionType,
        userId
      );
    },

    /*
     * Actualizar una transacción existente.
     * - `id`: Identificador único de la transacción.
     * - `concept`, `amount`, `date`, `transactionType`: Datos a actualizar (opcionales).
     * - Verifica que el usuario esté autenticado y sea dueño de la transacción antes de actualizar.
     * Retorna la transacción actualizada si la operación es exitosa.
     */
    updateTransaction: async (
      _: unknown,
      { id, concept, amount, date, transactionType }: 
      { id: number; concept?: string; amount?: number; date?: string; transactionType?: string },
      context: any
    ) => {
      const { user } = context; // Obtenemos el usuario autenticado del contexto
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const transaction = await transactionService.getTransactionById(id, { userId: user.userId });

      if (!transaction) {
        throw new Error("Transacción no encontrada o no autorizada");
      }

      return await transactionService.updateTransaction(id, concept, amount, date, transactionType);
    },

    /*
     * Eliminar una transacción.
     * - `id`: Identificador único de la transacción.
     * - Verifica que el usuario esté autenticado y sea dueño de la transacción antes de eliminar.
     * Retorna una confirmación de eliminación si la operación es exitosa.
     */
    deleteTransaction: async (_: unknown, { id }: { id: number }, context: any) => {
      const { user } = context; // Obtenemos el usuario autenticado del contexto
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const transaction = await transactionService.getTransactionById(id, { userId: user.userId });

      if (!transaction) {
        throw new Error("Transacción no encontrada o no autorizada");
      }

      return await transactionService.deleteTransaction(id);
    },
  },
};
