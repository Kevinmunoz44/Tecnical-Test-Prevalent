import { authService } from "../services/authService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createContext = ({ req }: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { user: null };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = authService.verifyToken(token);
    
    if (!decoded.userId) {
      console.error("El token no contiene userId");
      return { user: null };
    }

    return { user: { userId: decoded.userId, role: decoded.role } };
  } catch (err) {
    console.error("Error al verificar el token:", err.message);
    return { user: null };
  }
};
