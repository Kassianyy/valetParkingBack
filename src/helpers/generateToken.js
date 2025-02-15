import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const testToken = (req, res) => {
    const testUser = { id: 1, email: "test@example.com" }; 
    const accessToken = generateAccessToken(testUser);

    res.json({ message: "Token de prueba generado", token: accessToken });
};

export default { generateAccessToken, generateRefreshToken, testToken };