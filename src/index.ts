import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); // middleware que transforma la req.body en un json

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
