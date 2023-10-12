import { Router } from "express";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";
import {
  createRespuesta,
  getRespuesta,
  getRespuestas,
  getRespuestasChallengue,
} from "../controllers/respuesta.controller.js";

const router = Router();

router.post(
  "/respuesta",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  createRespuesta
);
router.get(
  "/respuesta",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getRespuesta
);
router.get(
  "/respuestas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getRespuestas
);
router.get(
  "/respuestaschallengue",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getRespuestasChallengue
);

export default router;
