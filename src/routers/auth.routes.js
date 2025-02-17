import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { testToken } from '../helpers/generateToken.js';

const router = express.Router();

//Dejo comentado el metodo verify token ya que es para verificar y asegurar las rutas y esta no es necesario asegurarla ni login
router.post('/register',/*verifyToken,*/ register);
router.post('/login', login);
router.get('/prueba', testToken);

export default router;