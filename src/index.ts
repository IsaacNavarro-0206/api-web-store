import express from "express";
import { connectDB } from "./config/db.ts";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const app = express();
const PORT = process.env.PORT || 4000;

connectDB(); // Conexión a la base de datos

app.use(express.json()); // middleware que transforma la req.body en un json

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
