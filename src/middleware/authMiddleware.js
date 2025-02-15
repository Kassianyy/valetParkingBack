import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};


export default { verifyToken };