// Controlador para operaciones relacionadas con los items/productos
import { Request, Response } from "express";
import { Item } from "../models/itemModel.js";

// Busca items según un término de búsqueda y/o categoría
export const searchItems = async (req: Request, res: Response) => {
  try {
    // Extrae parámetros de consulta: 'search' para búsqueda por título, 'category' para filtrar por categoría
    const { search = "", category } = req.query as Record<string, string>;
    const filter: any = {};

    if (search) filter.title = new RegExp(search, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (category) filter.category = category;

    // Busca los items que coincidan con el filtro
    const items = await Item.find(filter);

    res.json({ count: items.length, results: items });
  } catch (error: any) {
    // Manejo de errores en la búsqueda
    console.error("Error buscando items:", error.message);
    res
      .status(500)
      .json({ message: "Server error mientras se buscaba los items" });
  }
};

// Obtiene un item específico por su ID
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    // Busca el item por su ID recibido en los parámetros de la ruta
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404).json({ message: "Item no encontrado" });
      return;
    }

    res.json(item);
  } catch (error: any) {
    // Manejo de errores al obtener el item
    console.error("Error obteniendo item:", error.message);
    res
      .status(500)
      .json({ message: "Server error mientras se obtenía el item" });
  }
};

// Crea un nuevo item a partir de los datos recibidos en el cuerpo de la petición
export const createItem = async (req: Request, res: Response) => {
  try {
    // Extrae los campos necesarios del body
    const { title, description, price, brand, stock, category, images } =
      req.body;
    const obj = { title, description, price, brand, stock, category, images };

    // Crea y guarda el nuevo item en la base de datos
    const item = new Item(obj);
    await item.save();

    res.status(201).json(item);
  } catch (error: any) {
    // Manejo de errores al crear el item
    console.error("Error creando item:", error.message);
    res
      .status(500)
      .json({ message: "Server error mientras se creaba el item" });
  }
};
