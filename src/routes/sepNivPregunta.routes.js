import { Router } from "express";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";
import {
  createSepNivPregunta,
  deleteFilteredSepNivPreguntas,
  getSepNivPreguntas,
  updateSepNivPregunta,
} from "../controllers/sepNivPregunta.controller.js";

const router = Router();

router.post(
  "/sepNivPregunta",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  createSepNivPregunta
);

router.get(
  "/sepNivPreguntas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getSepNivPreguntas
);
router.delete(
  "/sepNivPreguntas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  deleteFilteredSepNivPreguntas
);
router.put(
  "/sepNivPregunta/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  updateSepNivPregunta
);

export default router;
