import { Router } from "express";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";
import {
  createSepNivPregunta,
  getSepNivPreguntas,
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

export default router;
