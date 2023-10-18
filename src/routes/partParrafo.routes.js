import { Router } from "express";
import upload from "../middlewares/uploadFiles.js";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";

import {
  createPartParrafo,
  getPartParrafo,
} from "../controllers/partParrafo.controller.js";
const router = Router();

router.post(
  "/partParrafo",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  upload.fields([
    { name: "resumenOral" },
    { name: "fraseOral" },
    { name: "leeOral" },
    { name: "explicaOral" },
  ]),
  createPartParrafo
);
router.get(
  "/partParrafo",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getPartParrafo
);

export default router;
