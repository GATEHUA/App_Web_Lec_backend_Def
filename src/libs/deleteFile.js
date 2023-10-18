// LOCAL

import fs from "fs/promises";

const eliminarArchivo = async (ruta) => {
  try {
    await fs.unlink(ruta);
    // console.log("Archivlo elimnado :", ruta);
  } catch (error) {
    console.log(error);
  }
};

export default eliminarArchivo;

//S3

// import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { AWS_BUCKET_NAME } from "../config.js";
// import { s3Client } from "../helpers/s3.js";

// const eliminarArchivoS3 = async (ruta) => {
//   const key = ruta.replace(/\\/g, "/");
//   const params = {
//     Bucket: AWS_BUCKET_NAME,
//     Key: key,
//   };

//   try {
//     const command = new DeleteObjectCommand(params);
//     await s3Client.send(command);
//     console.log("Archivo eliminado de S3:", key);
//   } catch (error) {
//     console.error("Error al eliminar archivo de S3:", error);
//   }
// };

// export default eliminarArchivoS3;
