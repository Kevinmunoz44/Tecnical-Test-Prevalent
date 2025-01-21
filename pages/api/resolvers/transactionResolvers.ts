import { transactionService } from '../services/transactionServe'

export const transactionsResolvers = {
    Query: {
        // Obtener todas las transacciones
        transactions: async () => {
            return await transactionService.getAllTransactions();
        },
        // Obtener una transacción por ID
        transaction: async (_: unknown, { id }: { id: number }) => {
            return await transactionService.getTransactionById(id);
        },
    },
    Mutation: {
        // Crear una nueva transacción
        createTransaction: async (_: unknown, { concept, amount, transactionType, userId }: { concept: string, amount: number, transactionType: string, userId: number }) => {
            try {
                return await transactionService.createTransaction(
                    concept, amount, transactionType, userId
                )
            } catch (err) {
                console.error("No se pudo crear la transacción", err);
                return err;
            }
        },
        // Actualizar una transacción
        updateTransaction: async (_: unknown, { id, concept, amount, transactionType }: { id: number, concept?: string, amount?: number, transactionType?: string }) => {
            try {
                return await transactionService.updateTransaction(
                    id, concept, amount, transactionType
                )
            } catch (err) {
                console.error("Error update transaction", err);
                return err;
            }
        },
        // Eliminar una transacción
        deleteTransaction: async (_: unknown, { id }: { id: number }) => {
            try {
                return await transactionService.deleteTransaction(id);
            } catch (err) {
                console.error("Error deleting transaction", err);
                return err;
            }
            
        },
    },
}