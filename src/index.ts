import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.ts";

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json()); // middleware que transforma la req.body en un json

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
