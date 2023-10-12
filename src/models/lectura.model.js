import mongoose from "mongoose";

const lecturaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    contenido: {
      type: String,
      required: true,
    },
    // description: { type: String },
    fuente: {
      type: String,
    },
    // portadaUrl: {
    //   type: String,
    // },
    grado: {
      type: String,
      // required: true,
    },
    nivelDificultad: {
      type: Number,
      default: 1,
    },
    numpreguntasal: {
      type: Number,
      default: 5,
    },
    genero: {
      type: String,
    },
    texto: {
      type: String,
    },
    refUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lectura", lecturaSchema);
