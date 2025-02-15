import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { generateAccessToken, generateRefreshToken } from '../helpers/generateToken.js';

const register = async (req, res) => {
    const { nombres, apellidos, numero_identificacion, correo, password } = req.body;
    if (!nombres || !apellidos || !numero_identificacion || !correo || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    let letraNombre = nombres.split(" ")[0].charAt(0);
    let letraApellido = apellidos.split(" ")[0].charAt(0);
    let numbersId = numero_identificacion.toString().slice(0, 4);
    const username = `${letraNombre}${letraApellido}${numbersId}`;
    console.log(username, nombres, apellidos, numero_identificacion, correo, hashedPassword, id);
    
        try {
            
    
            const [result] = await pool.execute(
                'INSERT INTO usuarios (id_usuario, usuario, nombres, apellidos, numero_identificacion, correo, password, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [id, username, nombres, apellidos, numero_identificacion, correo, hashedPassword, "c87ab889-74d7-4d0e-9717-dc54f88da0a3"]
            );
    
            const user = { id: result.insertId, correo };
            console.log(user);
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
    
            return res.status(201).json({
                status: 201,
                message: 'Usuario registrado con éxito',
                id,
                nombres,
                apellidos,
                correo,
                username,
                accessToken,
                refreshToken
            });
    
        } catch (error) {
            console.error('Error al registrar usuario:', error);
    
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    status: 400,
                    message: 'El correo o número de identificación ya están registrados'
                });
            }
    
            // Error de servidor
            return res.status(500).json({
                status: 500,
                message: 'Error en el servidor. Intente nuevamente más tarde'
            });
        }
};

export default register; 