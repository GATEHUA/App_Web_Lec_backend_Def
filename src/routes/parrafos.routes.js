import { Router } from "express";
import {
  createParrafo,
  deleteParrafo,
  getParrafos,
  getParrrafo,
  updateParrafo,
  createParrafos,
} from "../controllers/parrafos.controller.js";

const router = Router();

router.get("/parrafos", getParrafos);
router.get("/parrafo/:id", getParrrafo);
router.post("/parrafos", createParrafos);
router.post("/parrafo", createParrafo);
router.put("/parrafo/:id", updateParrafo);
router.delete("/parrafo/:id", deleteParrafo);

export default router;
