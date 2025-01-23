// import jwt from 'jsonwebtoken';

// const SECRET_KEY = "tu_clave_secreta";

// export const authenticate = (context: any) => {
//     const authHeader = context.req.headers.authorization;
//     if (!authHeader) {
//         throw new Error("No se proporcionó el token de autenticación");
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//         throw new Error("Token inválido");
//     }

//     try {
//         const user = jwt.verify(token, SECRET_KEY);
//         return user;
//     } catch (err) {
//         throw new Error("Token inválido o expirado");
//     }
// };
