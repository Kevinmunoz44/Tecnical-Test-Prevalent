import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const authService = {
  generateToken: (userId: number, role: string) => {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '1h' });
  },

  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      throw new Error('Token inválido o expirado');
    }
  },
};
