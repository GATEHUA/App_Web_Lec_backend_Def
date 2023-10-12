import { Router } from "express";
import {
  createLectura,
  getLecturas,
  getLectura,
  updateLectura,
  deleteLectura,
  getMyLecturas,
  getLecturasMain,
  getLecturaMain,
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
  "/lecturasmain",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getLecturasMain
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
router.get(
  "/lecturamain/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getLecturaMain
);
router.post(
  "/lectura",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  upload.single("contenido"),
  createLectura
);
router.put(
  "/lectura/:id",
  authAndAuthorize(["Profesor", "Administrador"]),
  upload.single("contenido"),
  updateLectura
);
router.delete(
  "/lectura/:id",
  authAndAuthorize(["Profesor", "Administrador"]),
  deleteLectura
);

export default router;
