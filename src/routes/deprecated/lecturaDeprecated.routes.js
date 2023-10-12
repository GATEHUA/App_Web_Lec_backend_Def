import { Router } from "express";
import {
  createLectura,
  getLecturas,
  getLectura,
  updateLectura,
  deleteLectura,
  getMyLecturas,
} from "../controllers/lecturas.controller.js";
import upload from "../middlewares/uploadFiles.js";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";

const router = Router();

router.get(
  "/lecturas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getLecturas
);
router.get(
  "/myLecturas",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getMyLecturas
);
router.get(
  "/lectura/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getLectura
);
router.post(
  "/lectura",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  upload.fields([{ name: "contenido" }, { name: "portada" }]),
  createLectura
);
router.put(
  "/lectura/:id",
  authAndAuthorize(["Profesor", "Administrador"]),
  upload.fields([{ name: "contenido" }, { name: "portada" }]),
  updateLectura
);
router.delete(
  "/lectura/:id",
  authAndAuthorize(["Profesor", "Administrador"]),
  deleteLectura
);

export default router;
