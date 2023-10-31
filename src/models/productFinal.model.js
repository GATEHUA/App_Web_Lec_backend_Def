import mongoose from "mongoose";

const productFinalSchema = new mongoose.Schema(
  {
    texto: { type: String },
    audio: { type: String },
    archivo: { type: String },
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
    puntos: {
      type: Number, // Aquí almacenarás el token o código único
      default: 25, // Puedes establecer esto como nulo inicialmente
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProductFinal", productFinalSchema);
