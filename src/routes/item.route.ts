import { Router } from "express";
import {
  searchItems,
  getItem,
  createItem,
} from "../controllers/itemController.js";
import upload from "../middleware/multer.js";

const itemRoutes = Router();

itemRoutes.get("/api/items", searchItems);
itemRoutes.get("/api/items/:id", getItem);
// Se utiliza el middleware 'upload.array("images", 5)' antes del controlador 'createItem'.
// - 'upload.array' indica que se esperan múltiples archivos.
// - '"images"' es el nombre del campo en el formulario que contendrá los archivos.
// - '5' es el número máximo de archivos permitidos en esa subida.
itemRoutes.post("/api/create", upload.array("images", 5), createItem);

export default itemRoutes;
