import Pregunta from "../models/pregunta.model.js";
import Respuesta from "../models/respuesta.model.js";

export const createRespuesta = async (req, res) => {
  const { user } = req;
  const { refPregunta } = req.query;
  try {
    const newRespuesta = new Respuesta({
      refUsuario: user._id,
      refPregunta,
      ...req.body,
    });
    await newRespuesta.save();
    res.status(200).json({ message: "Creacion exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRespuestas = async (req, res) => {
  const { user } = req;
  const { idLectura } = req.query;
  try {
    const respuestas = await Respuesta.find({
      refUsuario: user._id,
    }).populate({
      path: "refPregunta",
      populate: {
        path: "refUsuario",
        match: { rol: { $ne: "Usuario" } },
      },
      match: { refLectura: idLectura },
    });
    const filteredRespuestas = respuestas.filter(
      (respuesta) =>
        respuesta.refPregunta !== null &&
        respuesta.refPregunta.refUsuario !== null
    );

    res.status(200).json(filteredRespuestas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getRespuestas = async (req, res) => {
//   const { user } = req;
//   const { idLectura } = req.query;
//   try {
//     const respuestas = await Respuesta.find({
//       refUsuario: user._id,
//     }).populate({
//       path: "refPregunta",
//       match: { refLectura: idLectura },
//     });
//     const filteredRespuestas = respuestas.filter(
//       (respuesta) => respuesta.refPregunta !== null
//     );
//     res.status(200).json(filteredRespuestas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getRespuestasChallengue = async (req, res) => {
  const { user } = req;
  const { idLectura } = req.query;
  const { refUsuario } = req.query;

  try {
    const respuestas = await Respuesta.find({
      refUsuario: user._id,
    }).populate({
      path: "refPregunta",
      match: { refLectura: idLectura, refUsuario },
    });
    const filteredRespuestas = respuestas.filter(
      (respuesta) => respuesta.refPregunta !== null
    );
    res.status(200).json(filteredRespuestas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getRespuestas = async (req, res) => {
//   const { user } = req;
//   const { idLectura } = req.query;
//   try {
//     const filteredRespuestas = await Respuesta.aggregate([
//       {
//         $match: {
//           refUsuario: user._id,
//         },
//       },
//       {
//         $lookup: {
//           from: "preguntas",
//           localField: "refPregunta",
//           foreignField: "_id",
//           as: "pregunta",
//         },
//       },
//       {
//         $match: {
//           "pregunta.refLectura": new mongoose.Types.ObjectId(idLectura),
//         },
//       },
//       {
//         $match: {
//           "pregunta._id": { $ne: null },
//         },
//       },
//       {
//         $unwind: "$pregunta", // Deshace el array "pregunta"
//       },
//     ]);
//     res.status(200).json(filteredRespuestas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getRespuesta = async (req, res) => {
  const { user } = req;
  const { refPregunta } = req.query;
  try {
    const respuesta = await Respuesta.find({
      refPregunta,
      refUsuario: user._id.toJSON(),
    });
    if (!respuesta) {
      return res.sendStatus(404);
    }
    res.status(200).json(respuesta[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
