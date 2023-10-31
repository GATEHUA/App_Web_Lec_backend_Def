import mongoose from "mongoose";

const preguntaSchema = new mongoose.Schema(
  {
    esquema: {
      type: String,
    },
    criterio: {
      type: String,
    },
    contenido: {
      type: String,
      // default: "Pregunta no Establecida",
      // required: true,
    },
    nivel: {
      type: String,
      default: "Literal",
    },
    tipo: {
      type: String,
      //   enum: ["eleccion_multiple", "abierta"],
    },
    estadoAceptacion: {
      type: String,
      enum: ["Si", "No"],
    },
    estado: {
      type: String,
      enum: ["logrado", "proceso", "al inicio"],
    },
    orden: {
      type: Number,
    },
    puntobaserespuesta: {
      type: Number,
      default: 10,
    },
    puntajepregunta: {
      type: Number,
      default: 5,
    },
    disabled: {
      type: String,
    },
    refLectura: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lectura",
      required: true,
    },
    refUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    refAlternativas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alternativa",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Pregunta", preguntaSchema);
