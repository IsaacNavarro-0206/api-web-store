import { Router } from "express";
import {
  searchItems,
  getItem,
  createItem,
} from "../controllers/itemController";

const itemRoutes = Router();

itemRoutes.get("/api/items", searchItems);
itemRoutes.get("/api/items/:id", getItem);
itemRoutes.post("/api/create", createItem);

export default itemRoutes;
