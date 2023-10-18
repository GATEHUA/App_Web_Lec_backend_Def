// LOCAL

import multer from "multer";
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
    } else if (file.fieldname === "resumenOral") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/resumenOral"));
    } else if (file.fieldname === "fraseOral") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/fraseOral"));
    } else if (file.fieldname === "audio") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/audio"));
    } else if (file.fieldname === "archivo") {
      cb(null, path.join(UPLOADS_FOLDER, "lectura/archivo"));
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

//S3:

// import multer from "multer";
// import { s3Client } from "../helpers/s3.js";
// import multerS3 from "multer-s3";
// import { AWS_BUCKET_NAME } from "../config.js";

// const getFolder = (fieldname) => {
//   let folder = "";
//   if (fieldname === "contenido") {
//     folder = "public/lectura/contenido";
//   } else if (fieldname === "portada") {
//     folder = "public/lectura/portada";
//   } else if (fieldname === "fotoPerfil") {
//     folder = "public/usuario/foto";
//   } else if (fieldname === "leeOral") {
//     folder = "public/lectura/leeOral";
//   } else if (fieldname === "explicaOral") {
//     folder = "public/lectura/explicaOral";
//   } else if (fieldname === "audio") {
//     folder = "public/lectura/audio";
//   } else if (fieldname === "archivo") {
//     folder = "public/lectura/archivo";
//   } else {
//     folder = "";
//   }
//   return folder;
// };

// const uploadS3 = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: AWS_BUCKET_NAME,
//     contentDisposition: "inline",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     // metadata: function (req, file, cb) {
//     //   cb(null, {
//     //     fieldName: file.fieldname,
//     //   });
//     // },
//     key: function (req, file, cb) {
//       const folder = getFolder(file.fieldname);
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       if (folder) {
//         const destination =
//           folder + "/" + uniqueSuffix + "-" + file.originalname;
//         file.filename = uniqueSuffix + "-" + file.originalname;
//         cb(null, destination);
//       } else {
//         cb(new Error("Invalid destination"), null);
//       }
//     },
//   }),
//   // limits: {
//   //   fileSize: 1024 * 1024 * 5, // Tamaño máximo del archivo (5MB)
//   // },
// });

// export default uploadS3;
