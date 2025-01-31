/*
 * Función utilitaria para ejecutar middleware en Next.js de manera compatible con promesas.
 * 
 * - `req`: Objeto de solicitud (Request) de Next.js.
 * - `res`: Objeto de respuesta (Response) de Next.js.
 * - `fn`: Middleware que se ejecutará en la petición.
 * 
 * La función envuelve la ejecución del middleware en una `Promise`, 
 * permitiendo el uso de `async/await` en las API routes de Next.js.
 */
export const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};
