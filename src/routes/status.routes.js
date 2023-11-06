import { Router } from "express";
import { authAndAuthorize } from "../middlewares/authAndAuthorize.middleware.js";

import {
  createStatus,
  getStatus,
  getStatusAll,
  getStatusAllmyLecs,
  getStatusQuery,
  deleteStatus,
  getRespuestasQuery,
  getPartParrafosQuery,
  getSepnivPreguntasQuery,
  getYouPreguntasQuery,
  getProductoFinalQuery,
  getLecturaCompStatQuery,
  updateStatus,
} from "../controllers/status.controller.js";
const router = Router();
router.get(
  "/status",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getStatus
);

router.delete(
  "/status/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  deleteStatus
);

router.post(
  "/status",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  createStatus
);

router.get(
  "/statusall",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getStatusAll
);

router.get(
  "/statusallmylects",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getStatusAllmyLecs
);

router.get(
  "/statusquery",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getStatusQuery
);

router.get(
  "/statusrespuestasqu",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getRespuestasQuery
);

router.get(
  "/statuspartparrafosqu",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getPartParrafosQuery
);

router.get(
  "/statussepnivpreguntasqu",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getSepnivPreguntasQuery
);

router.get(
  "/statusyoupreguntasqu",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getYouPreguntasQuery
);

router.get(
  "/statusproductofinalqu",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getProductoFinalQuery
);

router.get(
  "/statuslectcompqu",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  getLecturaCompStatQuery
);

router.put(
  "/status/:id",
  authAndAuthorize(["Usuario", "Profesor", "Administrador"]),
  updateStatus
);

export default router;
