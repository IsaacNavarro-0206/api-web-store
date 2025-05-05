/**
 * Tests para el controlador de items
 * Prueba las diferentes respuestas del endpoint GET /api/items/:id
 */

import { jest } from "@jest/globals";
import { getItem } from "../controllers/itemController.js";
import { Item } from "../models/itemModel.js";
import { mockRequest, mockResponse } from "./utils.js";

describe("Controlador getItem", () => {
  // Limpia todos los mocks después de cada prueba para evitar efectos secundarios
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Prueba el caso exitoso donde el item existe en la base de datos
   * Debe retornar el item con status 200
   */
  it("debe responder 200 y devolver el ítem cuando existe", async () => {
    // Prepara los datos de prueba
    const fakeItem = { _id: "123", title: "Test Item" };
    // Configura el mock de findById para que retorne el item fake
    Item.findById = jest.fn().mockResolvedValue(fakeItem);

    // Simula el request con ID 123 y crea un response mock
    const req = mockRequest({ params: { id: "123" } });
    const res = mockResponse();

    // Ejecuta el controlador con los mocks
    await getItem(req, res);

    // Verifica que findById fue llamado con el ID correcto
    expect(Item.findById).toHaveBeenCalledWith("123");
    // Verifica que el response contiene el item esperado
    expect(res.json).toHaveBeenCalledWith(fakeItem);
  });

  /**
   * Prueba el caso donde el item no existe en la base de datos
   * Debe retornar un mensaje de error con status 404
   */
  it("debe responder 404 cuando el ítem no existe", async () => {
    // Configura findById para que retorne null (item no encontrado)
    Item.findById = jest.fn().mockResolvedValue(null);

    const req = mockRequest({ params: { id: "nonexistent" } });
    const res = mockResponse();

    await getItem(req, res);

    // Verifica que se retorna status 404
    expect(res.status).toHaveBeenCalledWith(404);
    // Verifica el mensaje de error
    expect(res.json).toHaveBeenCalledWith({ message: "Item no encontrado" });
  });

  /**
   * Prueba el caso donde ocurre un error en la base de datos
   * Debe retornar un mensaje de error genérico con status 500
   */
  it("debe responder 500 si ocurre un error en la consulta", async () => {
    // Simula un error en la base de datos
    Item.findById = jest.fn().mockRejectedValue(new Error("DB falldown"));

    const req = mockRequest({ params: { id: "error" } });
    const res = mockResponse();

    await getItem(req, res);

    // Verifica que se retorna status 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Verifica el mensaje de error genérico
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error mientras se obtenía el item",
    });
  });
});
