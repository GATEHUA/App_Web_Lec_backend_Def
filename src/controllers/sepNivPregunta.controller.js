import sepNivPregunta from "../models/sepNivPregunta.model.js";

// export const createSepNivPregunta = async (req, res) => {
//   const { user } = req;

//   try {
//     console.log(req.body);
//     const promises = req.body.map(async (content) => {
//       await sepNivPregunta.create({ ...content, refUsuario: user._id });
//     });
//     await Promise.all(promises);
//     res.sendStatus(201);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const createSepNivPregunta = async (req, res) => {
  const { user } = req;
  try {
    const promises = req.body.map(async (content) => {
      const sepNivPreguntafound = await sepNivPregunta.find({
        refUsuario: user._id,
        refPregunta: content.refPregunta,
      });
      if (sepNivPreguntafound.length > 0) {
        return false;
      }
      return sepNivPregunta.create({ ...content, refUsuario: user._id });
    });

    const results = await Promise.all(promises);

    console.log(results);

    if (results.some((result) => result === false)) {
      res.status(400).json({
        message: "Los niveles de cada pregunta ya fueron definidos",
      });
    } else {
      res.sendStatus(201);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSepNivPreguntas = async (req, res) => {
  const { user } = req;
  const { idLectura } = req.query;
  try {
    const sepNivPreguntas = await sepNivPregunta
      .find({
        refUsuario: user._id,
      })
      .populate({
        path: "refPregunta",
        match: { refLectura: idLectura },
      });
    const filteredSepNivPreguntas = sepNivPreguntas.filter(
      (sepNivPregunta) => sepNivPregunta.refPregunta !== null
    );
    res.status(200).json(filteredSepNivPreguntas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSepNivPregunta = async (req, res) => {
  try {
    const sepNivPregunt = await sepNivPregunta.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!sepNivPregunt) {
      return res
        .status(404)
        .json({ message: "Pregunta no encontrada para actualizar" });
    }
    res.json(sepNivPregunt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const deleteSepNivPregunta = async (req, res) => {
//   try {
//     const sepNivPregunt = await sepNivPregunta.findByIdAndDelete(req.params.id);
//     if (!sepNivPregunt) {
//       return res
//         .status(404)
//         .json({ message: "Pregunta no encontrada para eliminar" });
//     }
//   } catch (error) {}
// };

export const deleteFilteredSepNivPreguntas = async (req, res) => {
  const { refUsuario, refLectura } = req.query;

  try {
    const sepNivPreguntas = await sepNivPregunta.find({ refUsuario }).populate({
      path: "refPregunta",
      match: { refLectura },
    });

    const filteredSepNivPreguntas = sepNivPreguntas.filter(
      (sepNivPregunta) => sepNivPregunta.refPregunta !== null
    );

    // Obtén los IDs de los documentos a eliminar
    const idsToDelete = filteredSepNivPreguntas.map(
      (sepNivPregunta) => sepNivPregunta._id
    );

    // Elimina los documentos por sus IDs
    const deleteResult = await sepNivPregunta.deleteMany({
      _id: { $in: idsToDelete },
    });

    if (deleteResult.deletedCount > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).json({
        message: "No se encontraron datos para eliminar.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
