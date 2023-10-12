import { Router } from "express";
import {
  login,
  register,
  generateCode,
  verifyCode,
  logout,
  profile,
  recoverPassword,
  recoverPasswordSend,
  // generate_code_sms,
} from "../controllers/auth.controller.js";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.post("/generateCode/:correo", generateCode);
router.post("/verifyCode/:correo", verifyCode);
router.post("/recoverPassword/:correo", recoverPassword);
router.post("/recoverPasswordSend", recoverPasswordSend);

router.get(
  "/profile",
  // authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  auth,
  profile
);
// router.post("/generate_code_sms", generate_code_sms);

export default router;
