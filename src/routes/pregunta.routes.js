import { Router } from "express";
import {
  createPregunta,
  createPreguntas,
  deletePregunta,
  getPregunta,
  getMyPreguntas,
  updatePregunta,
  getMyPreguntasLec,
  getMyPreguntasChallengue,
  getMyPreguntasChallengueUser,
} from "../controllers/preguntas.controller.js";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";

const router = Router();

router.post(
  "/preguntasyalternativas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  createPreguntas
);
router.post(
  "/pregunta",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  createPregunta
);
router.get(
  "/mypreguntas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getMyPreguntas
);
router.get(
  "/preguntas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getMyPreguntasLec
);
router.get(
  "/preguntaschallengue",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getMyPreguntasChallengue
);
router.get(
  "/preguntaschallengueuser",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getMyPreguntasChallengueUser
);

router.get(
  "/pregunta/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getPregunta
);
router.put(
  "/pregunta/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  updatePregunta
);
router.delete(
  "/pregunta/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  deletePregunta
);

export default router;
