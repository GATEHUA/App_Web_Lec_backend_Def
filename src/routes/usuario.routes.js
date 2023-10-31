import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getPerfilUsuario,
  getUsuario,
  getUsuarios,
  getUsuariosEstudiantes,
  getUsuariosEstudiantesRank,
  updatePoints,
  updateUsuario,
} from "../controllers/usuarios.controller.js";
import upload from "../middlewares/uploadFiles.js";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";

const router = Router();

router.get("/usuarios", getUsuarios);
router.get("/usuariosEstudiantes", getUsuariosEstudiantes);
router.get("/usuariosEstudiantesRank", getUsuariosEstudiantesRank);

router.get("/usuario/:id", getUsuario);
router.get("/perfilusuario/:id", getPerfilUsuario);
router.post(
  "/usuario",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  upload.single("fotoPerfil"),
  createUsuario
);
router.put("/usuario/:id", upload.single("fotoPerfil"), updateUsuario);
router.put(
  "/usuarioputpoints/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  updatePoints
);
router.delete("/usuario/:id", deleteUsuario);

export default router;
