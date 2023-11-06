import { Router } from "express";
import {
  createObservacion,
  deleteObservacion,
  getObservacion,
  getObservaciones,
  updateObservacion,
} from "../controllers/observaciones.controller.js";

const router = Router();
router.post("/observacion", createObservacion);
router.get("/observacion/:id", getObservacion);
router.get("/observaciones", getObservaciones);
router.put("/observacion/:id", updateObservacion);
router.delete("/observacion/:id", deleteObservacion);

export default router;
