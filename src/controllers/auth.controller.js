import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { generateAccessToken, generateRefreshToken } from '../helpers/generateToken.js';

export const register = async (req, res) => {
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

export const login = async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: 'Usuario o contraseña son obligatorios' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id_usuario, usuario, nombres, apellidos, correo, password FROM usuarios WHERE usuario = ? OR correo = ?',
            [usuario, usuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = rows[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Generar tokens
        const accessToken = generateAccessToken({ id: user.id_usuario, correo: user.correo });
        const refreshToken = generateRefreshToken({ id: user.id_usuario, correo: user.correo });

        return res.status(200).json({
            status: 200,
            message: 'Inicio de sesión exitoso',
            id: user.id_usuario,
            nombres: user.nombres,
            apellidos: user.apellidos,
            correo: user.correo,
            usuario: user.usuario,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error en el servidor. Intente nuevamente más tarde' });
    }
};


