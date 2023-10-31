import { Router } from "express";
import upload from "../middlewares/uploadFiles.js";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";

import {
  createProductFinal,
  deleteProductoFinalQuery,
  getProductFinal,
  updateProductoFinalPuntosQuery,
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
router.put(
  "/productoFinal/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  updateProductoFinalPuntosQuery
);
router.delete(
  "/productoFinal/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  deleteProductoFinalQuery
);

export default router;
