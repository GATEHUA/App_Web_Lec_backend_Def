import eliminarArchivo from "../libs/deleteFile.js";
import ProductFinal from "../models/productFinal.model.js";
import path from "path";
import { UPLOADS_FOLDER } from "../libs/rutaUpload.js";

export const createProductFinal = async (req, res) => {
  const { user } = req;
  const { refLectura } = req.query;
  const { texto } = req.body;
  const audioFile = req.files["audio"];
  const archivoFile = req.files["archivo"];
  let audio = audioFile && audioFile[0] ? audioFile[0].filename : null;
  let archivo = archivoFile && archivoFile[0] ? archivoFile[0].filename : null;
  try {
    const productFinalFound = await ProductFinal.findOne({
      refLectura,
      refUsuario: user._id.toJSON(),
    });
    if (productFinalFound) {
      if (audioFile) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/audio", audio)
        );
      }
      if (archivoFile) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/archivo", archivo)
        );
      }
      return res.status(400).json({ message: "ya creo su producto final" });
    }
    const newProductFinal = new ProductFinal({
      archivo,
      audio,
      texto,
      refLectura,
      refUsuario: user._id,
    });
    await newProductFinal.save();
    res.status(200).json({ message: "Creacion exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProductFinal = async (req, res) => {
  const { user } = req;
  const { refLectura } = req.query;
  try {
    const productFinal = await ProductFinal.find({
      refLectura,
      refUsuario: user._id.toJSON(),
    });
    if (!productFinal) {
      return res.sendStatus(404);
    }
    res.status(200).json(productFinal[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
