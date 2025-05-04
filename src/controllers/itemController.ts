import { Request, Response } from "express";
import { Item } from "../models/itemModel.js";
import cloudinary from "../config/cloudinary.js";
// @ts-ignore - Se ignora el error de tipo ya que streamifier puede no tener tipos definidos.
import streamifier from "streamifier";

/**
 * Sube un array de archivos a Cloudinary y devuelve un array con las URLs seguras de las imágenes subidas.
 * @param files Array de archivos (Express.Multer.File) a subir.
 * @returns Una promesa que resuelve a un array de strings con las URLs seguras de las imágenes subidas.
 */
const uploadImagesToCloudinary = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  // Mapea cada archivo a una promesa que representa su proceso de subida.
  const uploadPromises = files.map((file) => {
    // Retorna una nueva promesa para manejar la operación asíncrona de subida.
    return new Promise<string>((resolve, reject) => {
      // Crea un stream de subida a Cloudinary, especificando la carpeta de destino.
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "store-items" }, // Define la carpeta en Cloudinary donde se guardarán las imágenes.
        (error, result) => {
          // Callback que se ejecuta al finalizar la subida.
          // Si ocurre un error durante la subida, lo registra y rechaza la promesa.
          if (error) {
            console.error("Error subiendo a Cloudinary:", error);
            return reject(error);
          }

          // Si la subida es exitosa y se recibe un resultado, resuelve la promesa con la URL segura de la imagen.
          if (result) {
            resolve(result.secure_url);
          } else {
            // Si no se recibe un resultado (caso improbable si no hay error), rechaza la promesa con un error.
            reject(new Error("No se recibió resultado de Cloudinary"));
          }
        }
      );

      // Utiliza streamifier para crear un stream legible a partir del buffer del archivo
      // y lo redirige (pipe) al stream de subida de Cloudinary.
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  });

  // Espera a que todas las promesas de subida se completen y devuelve un array con todas las URLs.
  return Promise.all(uploadPromises);
};

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

// Crea un nuevo item a partir de los datos recibidos en el cuerpo de la petición y sube imágenes
export const createItem = async (req: Request, res: Response) => {
  try {
    // Extrae los datos del cuerpo de la solicitud.
    const { title, description, price, brand, stock, category } = req.body;
    // Obtiene los archivos subidos por Multer.
    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];

    // Verifica si se subieron archivos y los sube a Cloudinary.
    if (files && files.length > 0) {
      imageUrls = await uploadImagesToCloudinary(files);
    }

    // Crea el objeto del nuevo item con los datos del cuerpo y las URLs de las imágenes.
    const newItemData = {
      title,
      description,
      price,
      brand,
      stock,
      category,
      images: imageUrls, // Asigna el array de URLs de imágenes.
    };

    // Crea una nueva instancia del modelo Item con los datos preparados.
    const item = new Item(newItemData);
    // Guarda el nuevo item en la base de datos MongoDB.
    await item.save();

    // Responde con el item creado y un estado 201 (Creado).
    res.status(201).json(item);
  } catch (error: any) {
    // Manejo de errores durante la creación del item o la subida de archivos.
    console.error("Error creando item:", error);
    res
      .status(500)
      .json({ message: "Server error mientras se creaba el item" });
  }
};
