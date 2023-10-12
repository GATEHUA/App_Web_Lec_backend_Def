import { contenidoParrafos } from "../helpers/createMany.js";
import Parrafo from "../models/parrafo.model.js";

export const getParrafos = async (req, res) => {
  const { refLectura } = req.query;
  try {
    const parrafos = await Parrafo.find({ refLectura }).sort({ orden: 1 });
    // if (parrafos.length === 0) {
    //   res.status(400).json({ message: "No hay parrafos" });
    // } else {
    res.status(200).json(parrafos);
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getParrrafo = async (req, res) => {
  try {
    const parrafo = await Parrafo.findById(req.params.id).populate(
      "refLectura"
    );
    if (!parrafo) {
      return res.sendStatus(404);
    }
    res.status(200).json(parrafo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createParrafo = async (req, res) => {
  const { refLectura } = req.query;
  const { contenido } = req.body;
  try {
    const lecturas = await Parrafo.find({ refLectura });
    const orden = lecturas.length + 1;

    const newParrafo = new Parrafo({
      contenido,
      refLectura,
      orden,
    });
    const savedParrafo = await newParrafo.save();
    res.status(201).json(savedParrafo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateParrafo = async (req, res) => {
  try {
    const parrafo = await Parrafo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!parrafo) {
      return res
        .status(404)
        .json({ message: "Parrrafo no encontrado para actualizar" });
    }
    res.status(200).json(parrafo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteParrafo = async (req, res) => {
  try {
    const parrafo = await Parrafo.findByIdAndDelete(req.params.id);
    if (!parrafo) {
      return res
        .status(404)
        .json({ message: "Parrafo no encontrado para eliminar" });
    }
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createParrafos = async (req, res) => {
  const { refLectura } = req.query;
  const { contenido } = req.body;
  if (!contenido) {
    return res.status(400).json(["No Envio ningun dato"]);
  }

  try {
    const parrafos = contenidoParrafos(contenido);
    const parrafosCant = await Parrafo.find({ refLectura });
    const promises = parrafos.map(async (parrafo, index) => {
      const newParrafo = new Parrafo({
        contenido: parrafo,
        orden: parrafosCant.length + index + 1,
        refLectura,
      });
      await newParrafo.save();
    });
    await Promise.all(promises);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
