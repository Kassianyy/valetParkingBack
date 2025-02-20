import express from 'express';
import { createVehiculo, getVehiculos } from '../controllers/vehiculos.controller.js';

const router = express.Router();

router.post('/vehiculos', createVehiculo);
router.get('/vehiculos', getVehiculos);

export default router;
