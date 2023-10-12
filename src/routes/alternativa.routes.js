import { Router } from "express";
import {
  createAlternativa,
  deleteAlternativa,
  getAlternativa,
  getAlternativas,
  updateAlternativa,
} from "../controllers/alternativas.controller.js";

const router = Router();
router.post("/alternativa", createAlternativa);
router.get("/alternativa/:id", getAlternativa);
router.get("/alternativas", getAlternativas);
router.put("/alternativa/:id", updateAlternativa);
router.delete("/alternativa/:id", deleteAlternativa);

export default router;
