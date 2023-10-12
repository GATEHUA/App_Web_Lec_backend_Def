import { Router } from "express";
import {
  deletePregunta,
  getPregunta,
  getPreguntas,
  createPregunta,
  updatePregunta,
} from "../controllers/preguntas.controller.js";
const router = Router();

router.get("/preguntas", getPreguntas);
router.get("/pregunta/:id", getPregunta);
router.post("/pregunta", createPregunta);
router.put("/pregunta/:id", updatePregunta);
router.delete("/pregunta/:id", deletePregunta);

export default router;
