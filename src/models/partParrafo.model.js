import mongoose from "mongoose";

const partParrafoSchema = new mongoose.Schema(
  {
    leeOral: { type: String, required: true },
    explicaOral: { type: String, required: true },
    resumenOral: { type: String, required: true },
    fraseOral: { type: String, required: true },
    resumenEscrito: { type: String, required: true },
    frase: { type: String, required: true },
    refParrafo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parrafo",
      required: true,
    },
    refUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    puntos: {
      type: Number, // Aquí almacenarás el token o código único
      default: 10, // Puedes establecer esto como nulo inicialmente
    },
  },
  { timestamps: true }
);

export default mongoose.model("PartParrafo", partParrafoSchema);
