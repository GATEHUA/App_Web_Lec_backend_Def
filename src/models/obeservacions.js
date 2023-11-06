import mongoose from "mongoose";

const observacionSchema = new mongoose.Schema(
  {
    contenidoD: {
      type: String,
    },
    seccion: {
      type: String,
    },
    estado: {
      type: String,
    },
    comentarioAl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Observacion", observacionSchema);
