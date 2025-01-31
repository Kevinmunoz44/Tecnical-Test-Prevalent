import { authService } from "../services/authService";
import { PrismaClient } from "@prisma/client";

// Instancia de Prisma Client para interactuar con la base de datos
const prisma = new PrismaClient();

/*
 * Función para crear el contexto de autenticación en Apollo Server.
 * - Extrae el token del encabezado de autorización de la solicitud (`req.headers.authorization`).
 * - Verifica y decodifica el token utilizando `authService.verifyToken`.
 * - Si la verificación es exitosa, devuelve un objeto `user` con `userId` y `role`.
 * - Si falla la verificación o no hay token, devuelve `{ user: null }`.
 */
export const createContext = ({ req }: any) => {
  const authHeader = req.headers.authorization;

  // Si no hay token en el header, retorna un usuario no autenticado
  if (!authHeader) {
    return { user: null };
  }

  // Extraer el token del encabezado Authorization: "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = authService.verifyToken(token);

    // Validar que el token decodificado contenga un userId válido
    if (!decoded.userId) {
      console.error("El token no contiene userId");
      return { user: null };
    }

    // Retornar el usuario autenticado con su rol
    return { user: { userId: decoded.userId, role: decoded.role } };
  } catch (err) {
    console.error("Error al verificar el token:", err.message);
    return { user: null };
  }
};
