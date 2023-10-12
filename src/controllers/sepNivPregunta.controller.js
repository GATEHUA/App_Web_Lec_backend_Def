import sepNivPregunta from "../models/sepNivPregunta.model";

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
