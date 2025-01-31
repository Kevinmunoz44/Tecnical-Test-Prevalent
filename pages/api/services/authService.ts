import jwt from 'jsonwebtoken';

// Clave secreta utilizada para firmar y verificar los tokens JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

/*
 * Servicio de autenticación utilizando JWT.
 * 
 * - `generateToken`: Genera un token JWT para un usuario autenticado.
 * - `verifyToken`: Verifica y decodifica un token JWT.
 */
export const authService = {
  /*
   * Genera un token JWT para un usuario autenticado.
   * - `userId`: Identificador único del usuario.
   * - `role`: Rol del usuario en la aplicación.
   * - El token tiene una expiración de 1 hora.
   * Retorna el token generado.
   */
  generateToken: (userId: number, role: string) => {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '1h' });
  },

  /*
   * Verifica y decodifica un token JWT.
   * - `token`: Token a validar.
   * - Si el token es válido, retorna su contenido decodificado.
   * - Si el token es inválido o ha expirado, lanza un error.
   */
  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      throw new Error('Token inválido o expirado');
    }
  },
};
