import mongoose from "mongoose";

const parrafoSchema = new mongoose.Schema(
  {
    contenido: {
      type: String,
      required: true,
    },
    orden: {
      type: Number,
      required: true,
      //   unique: true,
    },
    refLectura: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lectura",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Parrafo", parrafoSchema);
