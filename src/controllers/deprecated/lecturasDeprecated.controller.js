import Lectura from "../models/lectura.model.js";
import eliminarArchivo from "../libs/deleteFile.js";
import path from "path";
import { UPLOADS_FOLDER } from "../libs/rutaUpload.js";

export const getLectura = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id).populate(
      "refUsuario"
    );
    if (!lectura) {
      return res.status(404).json({ message: "Lectura no encontrada" });
    }
    res.json(lectura);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLecturas = async (req, res) => {
  try {
    const lecturas = await Lectura.find({});

    if (lecturas.length === 0) {
      res.status(404).json({ message: "No se encontraron lecturas." });
    } else {
      res.json(lecturas);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLecturas = async (req, res) => {
  const { user } = req;
  try {
    const lecturas = await Lectura.find({ refUsuario: user._id });
    if (lecturas.length === 0) {
      res.status(404).json({ message: "No se encontraron lecturas" });
    } else {
      res.json(lecturas);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLectura = async (req, res) => {
  const { user } = req;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json(["Error: audios requeridos."]);
  }

  const { titulo, fuente, grado, description, nivelDificultad, genero } =
    req.body;
  const contenidoFile = req.files["contenido"];
  const portadaFile = req.files["portada"];

  let portadaUrl =
    portadaFile && portadaFile[0] ? portadaFile[0].filename : null;
  if (!req.files["contenido"] || !req.files["contenido"][0]) {
    if (portadaUrl) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/portada", portadaUrl)
      );
    }
    return res
      .status(400)
      .json({ message: "El archivo de contenido es obligatorio" });
  }
  let contenidoUrl = contenidoFile[0].filename;

  try {
    const nuevaLectura = new Lectura({
      titulo,
      nivelDificultad,
      genero,
      contenidoUrl,
      description,
      portadaUrl,
      fuente,
      grado,
      refUsuario: user._id,
    });
    const savedLectura = await nuevaLectura.save();
    res.json(savedLectura);
  } catch (error) {
    if (contenidoUrl) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/contenido", contenidoUrl)
      );
    }
    if (portadaUrl) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/portada", portadaUrl)
      );
    }
    res
      .status(500)
      .json({ message: "Error al crear una Lectura", mError: error.message });
  }
};

export const updateLectura = async (req, res) => {
  const { titulo, fuente, grado, description, nivelDificultad, genero } =
    req.body;
  let { deletePortada = false } = req.body;
  const contenidoFile = req.files["contenido"];
  const portadaFile = req.files["portada"];

  let contenidoUrl =
    contenidoFile && contenidoFile[0] ? contenidoFile[0].filename : null;
  let portadaUrl =
    portadaFile && portadaFile[0] ? portadaFile[0].filename : null;
  try {
    if (!titulo) {
      if (contenidoUrl) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/contenido", contenidoUrl)
        );
      }
      if (portadaUrl) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/portada", portadaUrl)
        );
      }
      return res
        .status(500)
        .json({ message: "El campo titulo es obligatorio" });
    }
    if (!grado) {
      if (contenidoUrl) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/contenido", contenidoUrl)
        );
      }
      if (portadaUrl) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/portada", portadaUrl)
        );
      }
      return res.status(500).json({ message: "El campo grado es obligatorio" });
    }
    const lectura = await Lectura.findById(req.params.id);
    if (!lectura) {
      return res
        .status(404)
        .json({ message: "Lectura no encontrada para actualizar" });
    }
    let contenidoUrlAntiguo = lectura.contenidoUrl;
    let portadaUrlAntiguo = lectura.portadaUrl;
    lectura.titulo = titulo;
    lectura.fuente = fuente;
    lectura.grado = grado;
    lectura.nivelDificultad = nivelDificultad;
    lectura.genero = genero;
    lectura.description = description;

    if (contenidoUrl) {
      lectura.contenidoUrl = contenidoUrl;
    }

    if (portadaUrl) {
      lectura.portadaUrl = portadaUrl;
    }
    if (
      contenidoUrl &&
      contenidoUrlAntiguo &&
      contenidoUrlAntiguo !== contenidoUrl
    ) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/contenido", contenidoUrlAntiguo)
      );
    }
    if (portadaUrl) {
      deletePortada = false;
    }
    if (
      (portadaUrlAntiguo && portadaUrl && portadaUrlAntiguo !== portadaUrl) ||
      deletePortada
    ) {
      if (lectura.portadaUrl) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/portada", portadaUrlAntiguo)
        );
      }
      if (deletePortada && !portadaUrl) {
        lectura.portadaUrl = null;
      }
    }
    // await lectura.save();
    // res.json(lectura);
    const saveupdate = await lectura.save();
    res.json(saveupdate);
  } catch (error) {
    // if (contenidoUrl) {
    //   await eliminarArchivo(
    //     path.join(UPLOADS_FOLDER, "/lectura/contenido", contenidoUrl)
    //   );
    // }
    // if (portadaUrl) {
    //   await eliminarArchivo(
    //     path.join(UPLOADS_FOLDER, "/lectura/portada", portadaUrl)
    //   );
    // }
    res.status(500).json({ message: error.message });
  }
};

export const deleteLectura = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id);
    if (!lectura) {
      return res
        .status(400)
        .json({ message: "Lectura no encontrada para eliminar" });
    }
    const contenidoUrl = lectura.contenidoUrl;
    const portadaUrl = lectura.portadaUrl;
    if (contenidoUrl) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/contenido", contenidoUrl)
      );
    }
    if (portadaUrl) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/portada", portadaUrl)
      );
    }
    await lectura.deleteOne();
    res.json({ message: "Lectura eliminada" });
    // res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
