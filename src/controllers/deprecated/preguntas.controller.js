import Pregunta from "../models/pregunta.model.js";

export const getPreguntas = async (req, res) => {
  const { refLectura } = req.query;
  try {
    const preguntas = await Pregunta.find({ refLectura });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.findById(req.params.id).populate(
      "refLectura"
    );
    if (!pregunta) {
      return res.status(400).json({ message: "Lectura no encontrada" });
    }
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createPregunta = async (req, res) => {
  const { refLectura } = req.query;
  const { esquema, criterio, contenido, tipo } = req.body;
  try {
    const newPregunta = new Pregunta({
      esquema,
      criterio,
      contenido,
      tipo,
      refLectura,
    });
    const savedPregunta = await newPregunta.save();
    res.json(savedPregunta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deletePregunta = async (req, res) => {
  try {
    const pregunta = await Pregunta.findByIdAndDelete(req.params.id);
    if (!pregunta) {
      return res
        .status(404)
        .json({ message: "Pregunta no encontrada para eliminar" });
    }
    return res.sendStatus(204);
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
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
