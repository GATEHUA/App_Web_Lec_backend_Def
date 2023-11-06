import Observacion from "../models/obeservacions.js";
import LecturaCompletaAl from "../models/lecturacompletal.model.js";

export const createObservacion = async (req, res) => {
  const { refStatus } = req.query;
  try {
    const statusL = await LecturaCompletaAl.findById(refStatus);
    if (!statusL) {
      return res.status(404).json({
        message:
          "Estado de la lectura no encontrada para asociar la observacion",
      });
    }
    const observacion = await Observacion.create(req.body);
    LecturaCompletaAl.refObservaciones.push(observacion);
    await LecturaCompletaAl.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    if (!observacion) {
      return res.sendStatus(404);
    }
    res.status(200).json(observacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getObservaciones = async (req, res) => {
  const { refStatus } = req.query;
  try {
    const statusL = await LecturaCompletaAl.findById(refStatus).populate(
      "refObservaciones"
    );
    if (!statusL) {
      return res.sendStatus(404);
    }
    res.status(200).json(statusL.refObservaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteObservacion = async (req, res) => {
  const { refStatus } = req.query;
  try {
    const statusL = await LecturaCompletaAl.findById(refStatus);
    if (!statusL) {
      return res.status(404).json({
        message:
          "Estado de la lectura no encontrada para asociar la observacion",
      });
    }
    const observacion = await Observacion.findByIdAndDelete(req.params.id);
    if (!observacion) {
      return res
        .status(404)
        .json({ message: "Observacion no encontrado para eliminar" });
    }
    LecturaCompletaAl.refObservaciones.pull(alternativa._id);
    await LecturaCompletaAl.save();
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!observacion) {
      return res
        .status(404)
        .json({ message: "Observacion no encontrado para actualizar" });
    }
    res.status(200).json(observacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
