import mongoose from "mongoose";

const alternativaSchema = new mongoose.Schema(
  {
    contenido: {
      type: String,
      // required: true,
    },
    estado: {
      type: String,
      default: "Incorrecto",
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alternativa", alternativaSchema);
