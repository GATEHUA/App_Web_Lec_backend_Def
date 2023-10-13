import { Router } from "express";
import upload from "../middlewares/uploadFiles.js";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";

import {
  createProductFinal,
  getProductFinal,
} from "../controllers/productFinal.controller.js";
const router = Router();

router.post(
  "/productoFinal",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  upload.fields([{ name: "audio" }, { name: "archivo" }]),
  createProductFinal
);
router.get(
  "/productoFinal",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getProductFinal
);

export default router;
