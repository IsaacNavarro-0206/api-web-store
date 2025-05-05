/**
 * Utilidades para testing con Jest
 * Este archivo contiene funciones helpers para simular requests y responses de Express
 */

import { jest } from "@jest/globals";

/**
 * Crea un mock de objeto Request de Express
 * @param {Object} data - Datos parciales para simular en el request
 * @returns {Object} Un objeto que simula un Request de Express
 */
export function mockRequest(data = {}) {
  return { ...data };
}

/**
 * Crea un mock de objeto Response de Express con métodos comunes
 * Los métodos status() y json() son spy functions de Jest que permiten
 * verificar si fueron llamados y con qué argumentos
 * @returns {Object} Un objeto que simula un Response de Express con métodos mockeados
 */
export function mockResponse() {
  const res = {};
  // Mockea el método status y hace que retorne el mismo res para permitir encadenamiento
  res.status = jest.fn().mockReturnValue(res);
  // Mockea el método json y hace que retorne el mismo res para permitir encadenamiento
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
