import mongoose from "mongoose";

const lecturaCompletaAlSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
    },
    porcentaje: {
      type: Number,
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
    refObservaciones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Observacion",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("LecturaCompletaAl", lecturaCompletaAlSchema);
