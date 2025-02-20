import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./src/routers/auth.routes.js";
import vehiculosRoutes from "./src/routers/vehiculos.routes.js";

const app = express();
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/vehiculos', vehiculosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
