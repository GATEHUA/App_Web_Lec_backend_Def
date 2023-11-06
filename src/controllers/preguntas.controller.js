import { contenidoPrAndRe } from "../helpers/createMany.js";
import Pregunta from "../models/pregunta.model.js";
import Alternativa from "../models/alternativa.model.js";
import Lectura from "../models/lectura.model.js";

export const createPregunta = async (req, res) => {
  const { user } = req;
  const { refLectura } = req.query;
  try {
    const lectura = await Lectura.findById(refLectura);
    const preguntasCant = await Pregunta.find({
      refLectura,
      refUsuario: user._id,
    });
    if (
      user.rol === "Usuario" &&
      preguntasCant.length >= lectura.numpreguntasal
    ) {
      return res.status(400).json({
        message: `No puede crear mas que ${lectura.numpreguntasal} en esta lectura`,
      });
    }
    const newPregunta = new Pregunta({
      refLectura,
      refUsuario: user._id,
      estadoAceptacion: user.rol === "Usuario" ? "No" : "Si",
      orden: preguntasCant.length + 1,
      ...req.body,
    });
    await newPregunta.save();
    res.status(200).json({ message: "Creacion exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPreguntas = async (req, res) => {
  const { contenido } = req.body;
  const { user } = req;
  const { refLectura } = req.query;
  if (!contenido) {
    return res.status(400).json({ message: "No Envio ningun dato" });
  }

  const data = contenidoPrAndRe(contenido);
  // console.log(data.pregunta);
  // res.sendStatus(200);
  console.log(data.length);
  try {
    const preguntasCant = await Pregunta.find({
      refLectura,
      refUsuario: user._id,
    });

    const lectura = await Lectura.findById(refLectura);

    if (
      user.rol === "Usuario" &&
      (preguntasCant.length >= lectura.numpreguntasal ||
        data.length > lectura.numpreguntasal)
    ) {
      return res.status(400).json({
        message: `No puede crear más de ${lectura.numpreguntasal} preguntas en esta lectura`,
      });
    }

    const promises = data.map(async (value, index) => {
      const newPregunta = new Pregunta({
        // contenido: value.pregunta ? value.pregunta : "Pregunta no Definida",
        contenido: value.pregunta || "Pregunta no Definida",
        refLectura,
        refUsuario: user._id,
        orden: preguntasCant.length + index + 1,
        estadoAceptacion: user.rol === "Usuario" ? "No" : "Si",
        puntobaserespuesta: user.rol === "Usuario" ? 5 : 10,
      });
      if (value.alternativas.length === 0) {
        newPregunta.tipo = "Abierta";
      } else {
        newPregunta.tipo = "Eleccion Multiple";
        const alternativasPromises = value.alternativas.map(
          async (contenido) => {
            const newAlternativa = new Alternativa({
              contenido,
            });
            await newAlternativa.save();
            newPregunta.refAlternativas.push(newAlternativa);
          }
        );
        await Promise.all(alternativasPromises);
      }
      await newPregunta.save();
    });
    await Promise.all(promises);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPreguntas = async (req, res) => {
  const { refLectura } = req.query;
  const { user } = req;
  try {
    const preguntas = await Pregunta.find({ refLectura, refUsuario: user._id })
      .sort({ orden: 1 })
      .populate("refAlternativas");
    res.status(200).json(preguntas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getMyPreguntasLec = async (req, res) => {
//   const { refLectura } = req.query;
//   try {
//     const preguntas = await Pregunta.find({
//       refLectura,
//       "refUsuario.rol": { $ne: "Usuario" },
//     })
//       .sort({ orden: 1 })
//       .populate([{ path: "refUsuario" }, { path: "refAlternativas" }]);

//     // console.log(preguntas);
//     res.status(200).json(preguntas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getMyPreguntasLec = async (req, res) => {
  const { refLectura } = req.query;
  try {
    const preguntas = await Pregunta.find({ refLectura })
      .sort({ orden: 1 })
      .populate([{ path: "refUsuario" }, { path: "refAlternativas" }]);
    const filteredPreguntas = preguntas.filter(
      (pregunta) => pregunta.refUsuario.rol !== "Usuario"
    );
    const filteredData = filteredPreguntas.map((pregunta) => {
      const { refUsuario, ...rest } = pregunta.toObject(); // Copia todas las propiedades excepto refUsuario
      return rest;
    });
    console.log(filteredData);
    res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPreguntasChallengueUser = async (req, res) => {
  const { refLectura, refUsuario } = req.query;
  try {
    const preguntas = await Pregunta.find({ refLectura, refUsuario })
      .sort({ orden: 1 })
      .populate("refAlternativas");

    const todasAceptadas = preguntas.every(
      (pregunta) => pregunta.estadoAceptacion === "Si"
    );

    if (todasAceptadas) {
      res.status(200).json(preguntas);
    } else {
      res.status(200).json([]);
    }
    // const filteredPreguntas = preguntas.filter(
    //   (pregunta) => pregunta.estadoAceptacion === "Si"
    // );

    // res.status(200).json(filteredPreguntas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyPreguntasChallengue = async (req, res) => {
  const { refLectura } = req.query;
  try {
    const preguntas = await Pregunta.find({ refLectura })
      .sort({ orden: 1 })
      .populate("refUsuario");

    const usuariosSet = new Set(); // Conjunto para almacenar usuarios únicos

    preguntas.forEach((pregunta) => {
      if (pregunta.refUsuario.rol === "Usuario") {
        usuariosSet.add(pregunta.refUsuario); // Agrega el usuario al conjunto
      }
    });

    const usuariosUnicos = Array.from(usuariosSet); // Convierte el conjunto a un array

    console.log(usuariosUnicos);
    res.status(200).json(usuariosUnicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getMyPreguntasLec = async (req, res) => {
//   const { refLectura } = req.query;
//   try {
//     const preguntas = await Pregunta.find({ refLectura })
//       .sort({ orden: 1 })
//       .populate({ path: "refUsuario", match: { rol: { $ne: "Usuario" } } })
//       .populate("refAlternativas")
//       .exec();

//     // Filtra las preguntas donde refUsuario.rol sea diferente de "Usuario"
//     console.log(preguntas);
//     const filteredPreguntas = preguntas.filter(
//       (pregunta) => pregunta.refUsuario
//     );

//     res.status(200).json(filteredPreguntas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMyPreguntasLecRes = async (req, res) => {
//   const { refLectura } = req.query;
//   try {
//     const preguntas = await Pregunta.find({
//       refLectura,
//       "refUsuario.rol": { $ne: "Usuario" },
//     }).sort({ orden: 1 });
//     // res.status(200).json(preguntas);
//     const respuestas = await Respuesta.find({
//       refUsuario: user._id,
//     }).populate({
//       path: "refPregunta",
//       match: { refLectura },
//     });
//     const filteredRespuestas = respuestas.filter(
//       (respuesta) => respuesta.refPregunta !== null
//     );

//     // res.status(200).json(filteredRespuestas);

//     let preguntasCRes = preguntas.map((eP) => {
//       const respuestaCorrespondiente = filteredRespuestas.find(
//         (eR) => eP._id === eR.refPregunta._id
//       );

//       if (respuestaCorrespondiente) {
//         eP["contenidoRes"] = respuestaCorrespondiente.contenido;
//         eP["estadoRes"] = respuestaCorrespondiente.estado;
//         eP["puntosRes"] = respuestaCorrespondiente.puntos;
//       }

//       return eP;
//     });
//     res.status(200).json(preguntasCRes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getPregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.findById(req.params.id).populate(
      "refAlternativas"
    );
    if (!pregunta) {
      return res.sendStatus(404);
    }
    res.status(200).json(pregunta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.findById(req.params.id);
    if (!pregunta) {
      return res
        .status(404)
        .json({ message: "Pregunta no encontrada para eliminar" });
    }
    const alternativasIds = pregunta.refAlternativas;
    await Alternativa.deleteMany({ _id: { $in: alternativasIds } });
    await pregunta.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pregunta) {
      return res
        .status(404)
        .json({ message: "Pregunta no encontrada para actualizar" });
    }
    res.status(200).json(pregunta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
