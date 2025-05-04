import multer from "multer";

// Configuración de Multer para almacenar archivos temporalmente en la memoria RAM del servidor.
// Esto es útil para procesar archivos (como subirlos a un servicio en la nube) sin guardarlos en el disco local.
const storage = multer.memoryStorage();

// Crea una instancia de Multer con la configuración de almacenamiento definida.
// También se establecen límites para los archivos subidos.
const upload = multer({
  storage: storage, // Usa el almacenamiento en memoria.
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de tamaño por archivo: 5 Megabytes (MB).
    files: 5, // Límite máximo de archivos que se pueden subir en una sola petición.
  },
});

export default upload;
