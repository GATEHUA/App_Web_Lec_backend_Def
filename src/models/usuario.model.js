import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

const usuarioSchema = new mongoose.Schema(
  {
    // nombreUsuario: {
    //   type: String,
    //   trim: true,
    //   required: true,
    // },
    apellidoPaterno: {
      type: String,
      // required: true,
      trim: true,
    },
    apellidoMaterno: {
      type: String,
      trim: true,
    },
    nombres: {
      type: String,
      // required: true,
      trim: true,
    },
    fechaNacimiento: {
      type: Date,
    },
    dni: {
      type: String,
      unique: true,
      trim: true,
    },
    // dni: {
    //   type: Number,
    //   unique: true,
    //   trim: true,
    // },
    numeroTelefonicoPersonal: {
      type: Number,
      trim: true,
    },
    generoSexo: {
      type: String,
      enum: ["Hombre", "Mujer", "Otro"],
    },
    fotoPerfil: {
      type: String,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
    },
    rol: {
      type: String,
      // enum: ["Usuario", "Administrador"], // Define los roles que necesites.
      default: "Usuario",
    },
    contrasenia: {
      type: String,
      required: true,
    },
    puntajeTotal: {
      type: Number,
      default: 0, // Puedes establecer un valor inicial si es necesario.
    },
    estaVerificado: {
      type: Boolean,
      default: false, // Inicialmente, el usuario no está verificado
    },
    nivel: {
      type: String,
      default: "No definido",
    },
    grado: {
      type: String,
      default: "No definido",
    },
    seccion: {
      type: String,
      default: "No definido",
    },
    codigoVerificacion: {
      type: String, // Aquí almacenarás el token o código único
      default: null, // Puedes establecer esto como nulo inicialmente
    },
    //   googleId: String, // Almacena el ID único de Google
    //   googleAccessToken: String, // Almacena el token de acceso de Google
    //   googleRefreshToken: String, // Almacena el token de actualización de Google

    //   // Campos para autenticación con Facebook
    //   facebookId: String, // Almacena el ID único de Facebook
    //   facebookAccessToken: String, // Almacena el token de acceso de Facebook
    //   facebookRefreshToken: String,
  },
  { timestamps: true }
);

// usuarioSchema.index({ codigoVerificacion: 1 }, { expireAfterSeconds: 600 });

// usuarioSchema.plugin(mongoosePaginate);

export default mongoose.model("Usuario", usuarioSchema);

// apellidoPaterno,
// apellidoMaterno,
// nombres,
// fechaNacimiento,
// dni,
// numeroTelefonicoPersonal,
// generoSexo,
// fotoPerfil,
// rol,
// puntajeTotal,
