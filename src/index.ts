import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import itemRoutes from "./routes/item.route.js";
import cors from "cors";

dotenv.config(); // Cargar variables de entorno desde el archivo .env

export const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

connectDB(); // Conexión a la base de datos

app.use(express.json()); // middleware que transforma la req.body en un json
app.use(itemRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
