import Lectura from "../models/lectura.model.js";
import Parrafo from "../models/parrafo.model.js";
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
export const getLecturaMain = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id).populate(
      "refUsuario"
    );
    const parrafos = await Parrafo.find({ refLectura: req.params.id }).sort({
      orden: 1,
    });
    if (!lectura) {
      return res.status(404).json({ message: "Lectura no encontrada" });
    }
    res.json({ lectura, parrafos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLecturas = async (req, res) => {
  try {
    const lecturas = await Lectura.find({});

    // if (lecturas.length === 0) {
    //   res.status(404).json({ message: "No se encontraron lecturas." });
    // } else {
    res.json(lecturas);
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getLecturasMain = async (req, res) => {
  try {
    const lecturas = await Lectura.find({}).sort({
      createdAt: 1,
    });
    const lecturasJson = lecturas.map((lectura) => lectura.toJSON());

    const nivel = { 1: [], 2: [], 3: [] };
    lecturasJson.forEach((l) => {
      nivel[l.nivelDificultad].push(l);
    });
    res.json(nivel);
    // function filterByDifficulty(difficulty) {
    //   return lecturasJson.filter((l) => l.nivelDificultad === difficulty);
    // }
    // const lBasic = filterByDifficulty(1);
    // const lIntermediate = filterByDifficulty(2);
    // const lAdvanced = filterByDifficulty(3);
    // res.json({
    //   lBasic,
    //   lIntermediate,
    //   lAdvanced,
    // });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLecturas = async (req, res) => {
  const { user } = req;
  try {
    const lecturas = await Lectura.find({ refUsuario: user._id }).sort({
      createdAt: -1,
    });
    // if (lecturas.length === 0) {
    //   res.status(404).json({ message: "No se encontraron lecturas" });
    // } else {
    res.json(lecturas);
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLectura = async (req, res) => {
  // console.log("req.body");
  // console.log(req.body);
  // res.sendStatus(200);
  const { user } = req;
  let contenido;
  if (!req.file) {
    return res.status(400).json(["El campo contenido es obligatario"]);
  }
  contenido = req.file.filename;
  const {
    titulo,
    grado,
    nivelDificultad,
    genero,
    fuente,
    texto,
    numpreguntasal,
  } = req.body;
  if (!titulo) {
    await eliminarArchivo(
      path.join(UPLOADS_FOLDER, "/lectura/contenido", contenido)
    );
    return res.status(400).json(["El campo titulo es obligatario"]);
  }
  // if (!grado) {
  //   await eliminarArchivo(
  //     path.join(UPLOADS_FOLDER, "/lectura/contenido", contenido)
  //   );
  //   return res.status(400).json(["El campo grado es obligatario"]);
  // }

  try {
    const lecturaFound = await Lectura.findOne({ titulo });
    if (lecturaFound) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/contenido", contenido)
      );
      return res.status(400).json(["El titulo ya existe"]);
    }

    const newLectura = new Lectura({
      titulo,
      grado,
      nivelDificultad,
      genero,
      contenido,
      fuente,
      texto,
      numpreguntasal,
      refUsuario: user._id,
    });
    const savedLectura = await newLectura.save();
    res.status(200).json(savedLectura);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const updateLectura = async (req, res) => {
  const {
    titulo,
    fuente,
    grado,
    nivelDificultad,
    genero,
    texto,
    numpreguntasal,
  } = req.body;
  console.log(req.body);
  let contenido = null;
  if (req.file) {
    contenido = req.file.filename;
  }

  try {
    const lecturaFound = await Lectura.findOne({ titulo });
    if (lecturaFound && titulo) {
      if (contenido) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/lectura/contenido", contenido)
        );
      }
      return res.status(400).json(["El titulo ya existe"]);
    }

    const lectura = await Lectura.findById(req.params.id);
    if (!lectura) {
      return res.status(404).json(["Lectura no encontrada para actualizar"]);
      // .json({ message: "Lectura no encontrada para actualizar" });
    }
    let contenidoAntiguo = lectura.contenido;
    if (titulo) {
      lectura.titulo = titulo;
    }
    lectura.fuente = fuente;
    lectura.grado = grado;
    lectura.texto = texto;
    lectura.numpreguntasal = numpreguntasal;
    lectura.nivelDificultad = nivelDificultad;
    lectura.genero = genero;

    if (contenido) {
      lectura.contenido = contenido;
    }

    if (contenido && contenidoAntiguo && contenidoAntiguo !== contenido) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/contenido", contenidoAntiguo)
      );
    }

    const saveupdate = await lectura.save();
    res.status(200).json(saveupdate);
  } catch (error) {
    // res.status(500).json({ message: error.message });
    res.status(500).json([error.message]);
  }
};

export const deleteLectura = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id);
    if (!lectura) {
      return res.status(400).json(["Lectura no encontrada para eliminar"]);
    }
    if (lectura.contenido) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/lectura/contenido", lectura.contenido)
      );
    }

    await lectura.deleteOne();
    // res.json({ message: "Lectura eliminada" });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
