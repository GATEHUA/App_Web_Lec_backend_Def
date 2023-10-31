import { Router } from "express";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";
import {
  createRespuesta,
  deleteRespuesta,
  getRespuesta,
  getRespuestas,
  getRespuestasChallengue,
  updateRespuesta,
  // getRespuestasXReading
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
router.put(
  "/respuesta/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  updateRespuesta
);
router.delete(
  "/respuesta/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  deleteRespuesta
);
// router.get(
//   "/respuestaschallengue",
//   authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
//   getRespuestasXReading
// );

export default router;
