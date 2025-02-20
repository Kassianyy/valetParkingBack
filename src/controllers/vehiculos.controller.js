import pool from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();  
        req.id_vehiculo = uniqueId;  
        cb(null, uniqueId + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export const getVehiculos = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM coches');
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        return res.status(500).json({
            status: 500,
            message: 'Error en el servidor. Intente nuevamente más tarde'
        });
    }
};


export const createVehiculo = async (req, res) => {
    upload.single('foto')(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al subir la imagen', error: err });
        }

        const { placa, marca, color, consecutivo, tipoUsuario } = req.body;
        if (!placa || !marca || !color || !consecutivo || !tipoUsuario) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const foto = req.file ? `/uploads/${req.file.filename}` : null;
        if (!foto) {
            return res.status(400).json({ message: 'Error al guardar la imagen' });
        }

        try {
            await pool.execute(
                'INSERT INTO coches (id_coche, foto, placa, marca, color, consecutivo, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [req.id_vehiculo, foto, placa, marca, color, consecutivo, tipoUsuario]
            );

            return res.status(201).json({
                status: 201,
                message: 'Vehículo registrado con éxito',
                id: req.id_vehiculo,
                foto
            });
        } catch (error) {
            console.error('Error al registrar vehículo:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error en el servidor. Intente nuevamente más tarde'
            });
        }
    });
};
