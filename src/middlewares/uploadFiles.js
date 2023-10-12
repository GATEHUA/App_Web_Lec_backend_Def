import multer from "multer";
// import { fileURLToPath } from "url";
import path from "path";
import { UPLOADS_FOLDER } from "../libs/rutaUpload.js";

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "contenido") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/contenido"));
    } else if (file.fieldname === "portada") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/portada"));
    } else if (file.fieldname === "fotoPerfil") {
      cb(null, path.join(UPLOADS_FOLDER, "usuario/foto"));
    } else if (file.fieldname === "leeOral") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/leeOral"));
    } else if (file.fieldname === "explicaOral") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/explicaOral"));
    } else {
      cb(null, path.join(UPLOADS_FOLDER));
    }
  },
  filename: (req, file, cb) => {
    // console.log(req.body);
    // console.log(req.user);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5, // Tamaño máximo del archivo (5MB)
  // },
});

export default upload;

// import fs from "fs/promises"; // Importa fs.promises en lugar de fs

// Ruta de la carpeta de uploads
// const dirnameA = fileURLToPath(import.meta.url);
// const UPLOADS_FOLDER = path.join(dirnameA, "../../uploads");

// Verifica y crea la carpeta si no existe de forma asíncrona
// (async () => {
//   try {
//     await fs.access(UPLOADS_FOLDER); // Verifica si la carpeta existe
//   } catch (error) {
//     if (error.code === "ENOENT") {
//       // La carpeta no existe, crea la carpeta principal
//       await fs.mkdir(UPLOADS_FOLDER);
//       // Crea las subcarpetas 'lectura/contenido' y 'lectura/portada'
//       await fs.mkdir(path.join(UPLOADS_FOLDER, "lectura/contenido"), {
//         recursive: true,
//       });
//       await fs.mkdir(path.join(UPLOADS_FOLDER, "lectura/portada"), {
//         recursive: true,
//       });
//     } else {
//       // Ocurrió otro error, manejar según sea necesario
//       console.error("Error al verificar/crear la carpeta:", error);
//     }
//   }
// })();
