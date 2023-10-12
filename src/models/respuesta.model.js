import mongoose from "mongoose";

const respuestaSchema = new mongoose.Schema(
  {
    contenido: {
      type: String,
    },
    estado: {
      type: String,
    },
    puntos: {
      type: Number,
    },
    refUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    refPregunta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pregunta",
      required: true,
    },
  },
  { timestamps: true }
);

// Define un índice único para la combinación de refUsuario y refPregunta
respuestaSchema.index({ refUsuario: 1, refPregunta: 1 }, { unique: true });

export default mongoose.model("Respuesta", respuestaSchema);
