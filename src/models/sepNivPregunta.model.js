import mongoose from "mongoose";

const sepNivPreguntaSchema = new mongoose.Schema(
  {
    estadoSep: {
      type: String,
    },
    nivelSep: {
      type: String,
    },
    puntosSep: {
      type: Number,
      default: 10,
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
sepNivPreguntaSchema.index({ refUsuario: 1, refPregunta: 1 }, { unique: true });

export default mongoose.model("SepNivPregunta", sepNivPreguntaSchema);
