import PartParrafo from "../models/partParrafo.model.js";
// import eliminarArchivo from "../libs/deleteFile.js";
// import { UPLOADS_FOLDER } from "../libs/rutaUpload.js";
// import path from "path";

export const createPartParrafo = async (req, res) => {
  const { user } = req;
  const { resumenEscrito, frase } = req.body;
  const { refParrafo } = req.query;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json(["Error: audios requeridos."]);
  }

  const leeOralFile = req.files["leeOral"];
  const explicaOralFile = req.files["explicaOral"];
  let leeOral = leeOralFile && leeOralFile[0] ? leeOralFile[0].filename : null;
  let explicaOral =
    explicaOralFile && explicaOralFile[0] ? explicaOralFile[0].filename : null;

  // if (!req.files["leeOral"] || !req.files["leeOral"][0]) {
  //   if (explicaOral) {
  //     await eliminarArchivo(
  //       path.join(UPLOADS_FOLDER, "/lectura/explicaOral", explicaOral)
  //     );
  //   }
  //   return res.status(400).json(["El audio de lectura es obligatorio"]);
  // }
  // if (!req.files["explicaOral"] || !req.files["explicaOral"][0]) {
  //   if (leeOral) {
  //     await eliminarArchivo(
  //       path.join(UPLOADS_FOLDER, "/lectura/leeOral", leeOral)
  //     );
  //   }
  //   return res.status(400).json(["El audio de explicacion es obligatorio"]);
  // }
  // if (!resumenEscrito) {
  //   if (leeOral) {
  //     await eliminarArchivo(
  //       path.join(UPLOADS_FOLDER, "/lectura/leeOral", leeOral)
  //     );
  //   }
  //   if (explicaOral) {
  //     await eliminarArchivo(
  //       path.join(UPLOADS_FOLDER, "/lectura/explicaOral", explicaOral)
  //     );
  //   }
  //   return res.status(400).json(["El campo resumen  es obligatorio"]);
  // }
  // if (!frase) {
  //   if (leeOral) {
  //     await eliminarArchivo(
  //       path.join(UPLOADS_FOLDER, "/lectura/leeOral", leeOral)
  //     );
  //   }
  //   if (explicaOral) {
  //     await eliminarArchivo(
  //       path.join(UPLOADS_FOLDER, "/lectura/explicaOral", explicaOral)
  //     );
  //   }
  //   return res.status(400).json(["El campo frase  es obligatorio"]);
  // }
  try {
    const newPartParrafo = new PartParrafo({
      refUsuario: user._id,
      refParrafo,
      resumenEscrito,
      frase,
      leeOral,
      explicaOral,
    });
    await newPartParrafo.save();
    res.status(200).json({ message: "Creacion exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPartParrafo = async (req, res) => {
  const { user } = req;
  const { refParrafo } = req.query;
  try {
    const partParrafo = await PartParrafo.find({
      refParrafo,
      refUsuario: user._id.toJSON(),
    });
    if (!partParrafo) {
      return res.sendStatus(404);
    }
    res.status(200).json(partParrafo[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
