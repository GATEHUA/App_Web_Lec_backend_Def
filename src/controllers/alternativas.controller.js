import Alternativa from "../models/alternativa.model.js";
import Pregunta from "../models/pregunta.model.js";

export const createAlternativa = async (req, res) => {
  const { idPregunta } = req.query;
  try {
    const pregunta = await Pregunta.findById(idPregunta);
    if (!pregunta) {
      return res.status(404).json({
        message: "Pregunta no encontrada para asociar la alternativa",
      });
    }
    const alternativa = await Alternativa.create(req.body);
    pregunta.refAlternativas.push(alternativa);
    await pregunta.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAlternativa = async (req, res) => {
  try {
    const alternativa = await Alternativa.findById(req.params.id);
    if (!alternativa) {
      return res.sendStatus(404);
    }
    res.status(200).json(alternativa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAlternativas = async (req, res) => {
  const { idPregunta } = req.query;
  try {
    const pregunta = await Pregunta.findById(idPregunta).populate(
      "refAlternativas"
    );
    if (!pregunta) {
      return res.sendStatus(404);
    }
    res.status(200).json(pregunta.refAlternativas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAlternativa = async (req, res) => {
  const { idPregunta } = req.query;
  try {
    const pregunta = await Pregunta.findById(idPregunta);
    if (!pregunta) {
      return res.status(404).json({
        message: "Pregunta no encontrada para asociar la alternativa",
      });
    }
    const alternativa = await Alternativa.findByIdAndDelete(req.params.id);
    if (!alternativa) {
      return res
        .status(404)
        .json({ message: "Alternativa no encontrado para eliminar" });
    }
    pregunta.refAlternativas.pull(alternativa._id);
    await pregunta.save();
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateAlternativa = async (req, res) => {
  try {
    const alternativa = await Alternativa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!alternativa) {
      return res
        .status(404)
        .json({ message: "Alternativa no encontrado para actualizar" });
    }
    res.status(200).json(alternativa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
