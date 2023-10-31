import express from "express";
import cors from "cors";
import lecturaRoutes from "./routes/lectura.routes.js";
import authRoutes from "./routes/auth.routes.js";
import parrafoRoutes from "./routes/parrafos.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import preguntaRoutes from "./routes/pregunta.routes.js";
import partParrafoRoutes from "./routes/partParrafo.routes.js";
import respuesRoutes from "./routes/respuesta.routes.js";
import alternativaRoutes from "./routes/alternativa.routes.js";
import sepNivPreguntasRoutes from "./routes/sepNivPregunta.routes.js";
import productFinalRoutes from "./routes/productFinal.routes.js";
import statusRoutes from "./routes/status.routes.js";

import path from "path";
import { fileURLToPath } from "url";

import { FRONT_URL } from "./config.js";
import { UPLOADS_FOLDER } from "./libs/rutaUpload.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
const dirActual = fileURLToPath(import.meta.url);
export const dirFront = path.join(dirActual, "../../dist");
// export const dirFront = path.join(dirActual, "../../../frontend/dist");
app.use(
  cors({
    credentials: true,
    origin: FRONT_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/public", express.static(UPLOADS_FOLDER));
app.use("/api/auth/", authRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", lecturaRoutes);
app.use("/api", parrafoRoutes);
app.use("/api", partParrafoRoutes);
app.use("/api", preguntaRoutes);
app.use("/api", alternativaRoutes);
app.use("/api", respuesRoutes);
app.use("/api", sepNivPreguntasRoutes);
app.use("/api", productFinalRoutes);
app.use("/api", statusRoutes);

app.use(express.static(dirFront));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(dirFront, "index.html"));
});

export default app;
