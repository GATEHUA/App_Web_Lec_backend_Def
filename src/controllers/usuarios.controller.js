import eliminarArchivo from "../libs/deleteFile.js";
import path from "path";
import { UPLOADS_FOLDER } from "../libs/rutaUpload.js";
import Usuario from "../models/usuario.model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import Respuesta from "../models/respuesta.model.js";
import sepNivPregunta from "../models/sepNivPregunta.model.js";
import ProductFinal from "../models/productFinal.model.js";
import Pregunta from "../models/pregunta.model.js";
import PartParrafo from "../models/partParrafo.model.js";
import Lectura from "../models/lectura.model.js";

// export const getUsuarios = async (req, res) => {
//   try {
//     const usuarios = await Usuario.find({});
//     // const page = parseInt(req.query.page) || 1;
//     // const usuarios = await Usuario.paginate({}, { limit: 2, page });

//     if (usuarios.length === 0) {
//       res.status(404).json({ message: "No se encontraron usuarios." });
//     } else {
//       res.json(usuarios);
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}).sort({ createdAt: -1 });
    // if (usuarios.length === 0) {
    //   res.status(404).json({ message: "No se encontraron usuarios." });
    // } else {
    res.json(usuarios);
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUsuariosEstudiantes = async (req, res) => {
  try {
    const usuarios = await Usuario.find({
      rol: "Usuario",
      estaVerificado: true,
    }).sort({ createdAt: -1 });
    // if (usuarios.length === 0) {
    //   res
    //     .status(404)
    //     .json({ message: "No se encontraron usuarios(estudiantes)" });
    // } else {
    res.json(usuarios);
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUsuariosEstudiantesRank = async (req, res) => {
  try {
    const usuarios = await Usuario.find({
      rol: "Usuario",
      estaVerificado: true,
    }).sort({
      puntajeTotal: -1,
    });
    const responese = usuarios.map((v) => {
      const {
        _id,
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        puntajeTotal,
        fotoPerfil,
        rol,
      } = v.toJSON();
      return {
        _id,
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        puntajeTotal,
        fotoPerfil,
        rol,
      };
    });

    res.json(responese);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrada" });
    }
    res.json(usuario);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Usuario no encontrado_Error" });
    }
    res.status(500).json({ message: error.message });
  }
};

// export const getPerfilUsuario = async (req, res) => {
//   try {
//     const usuario = await Usuario.findById(req.params.id);
//     if (!usuario) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     const [
//       respuestasSum,
//       sepNivPreguntaSum,
//       productFinalSum,
//       preguntaSum,
//       partParrafoSum,
//     ] = await Promise.all([
//       Respuesta.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//       sepNivPregunta.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntosSep" } } },
//       ]),
//       ProductFinal.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//       Pregunta.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntajepregunta" } } },
//       ]),
//       PartParrafo.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//     ]);

//     console.log(preguntaSum);

//     const puntajeTotalSum =
//       respuestasSum[0]?.total +
//       sepNivPreguntaSum[0]?.total +
//       productFinalSum[0]?.total +
//       preguntaSum[0]?.total +
//       partParrafoSum[0]?.total;

//     const {
//       apellidoPaterno,
//       apellidoMaterno,
//       nombres,
//       correo,
//       puntajeTotal,
//       fotoPerfil,
//       numeroTelefonicoPersonal,
//       createdAt,
//     } = usuario.toJSON();

//     const response = {
//       apellidoPaterno,
//       apellidoMaterno,
//       nombres,
//       correo,
//       puntajeTotal,
//       fotoPerfil,
//       numeroTelefonicoPersonal,
//       createdAt,
//       puntosRespuestas: respuestasSum[0]?.total || 0,
//       puntosSepNivPregunta: sepNivPreguntaSum[0]?.total || 0,
//       puntosProductoFinal: productFinalSum[0]?.total || 0,
//       puntosPregunta: preguntaSum[0]?.total || 0,
//       puntosPartParrafo: partParrafoSum[0]?.total || 0,
//       puntajeTotalSum,
//     };

//     res.json(response);
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(404).json({ message: "Usuario no encontrado_Error" });
//     }
//     res.status(500).json({ message: error.message });
//   }
// };

export const createUsuario = async (req, res) => {
  let fotoPerfil = null;
  if (req.file) {
    fotoPerfil = req.file.filename;
  }
  const {
    apellidoPaterno,
    apellidoMaterno,
    nombres,
    fechaNacimiento,
    numeroTelefonicoPersonal,
    generoSexo,
    correo,
    rol,
    contrasenia,
    puntajeTotal,
    dni,
    estaVerificado = false,
    nivel,
    grado,
    seccion,
  } = req.body;
  // let { dni } = req.body;
  // dni = parseInt(dni, 10);

  try {
    const userFound = await Usuario.findOne({
      $or: [{ correo }, { dni }],
    });
    if (userFound) {
      if (fotoPerfil) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/usuario/foto", fotoPerfil)
        );
      }
      if (userFound.correo === correo && userFound.dni === dni) {
        return res
          .status(400)
          .json(["El correo ya está en uso", "El N° de DNI ya existe"]);
      } else if (userFound.correo === correo) {
        return res.status(400).json(["El correo ya está en uso"]);
      } else if (userFound.dni === dni) {
        return res.status(400).json(["El N° de DNI ya existe"]);
      }
    }
    const codigoVerificacion = otpGenerator.generate(7, {
      specialChars: false,
    });
    const contraseniaHash = await bcrypt.hash(contrasenia, 10);
    const newUsuario = new Usuario({
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      fechaNacimiento,
      dni,
      numeroTelefonicoPersonal,
      generoSexo,
      correo,
      rol,
      contrasenia: contraseniaHash,
      puntajeTotal,
      estaVerificado,
      codigoVerificacion,
      nivel,
      grado,
      seccion,
      fotoPerfil,
    });
    // console.log(newUsuario);
    const savedUsuario = await newUsuario.save();
    res.json(savedUsuario);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};

export const updateUsuario = async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  let fotoPerfil = null;
  if (req.file) {
    fotoPerfil = req.file.filename;
  }
  const {
    apellidoPaterno,
    apellidoMaterno,
    nombres,
    fechaNacimiento,
    numeroTelefonicoPersonal,
    generoSexo,
    correo,
    rol,
    contrasenia,
    dni,
    estaVerificado = false,
    nivel,
    grado,
    seccion,
  } = req.body;
  let { deleteFotoPerfil = false } = req.body;

  if (deleteFotoPerfil) {
    deleteFotoPerfil = JSON.parse(deleteFotoPerfil);
  }

  try {
    const userFound = await Usuario.findOne({
      $or: [{ correo }, { dni }],
    });
    if (userFound && (correo || dni)) {
      console.log("entras aca??");
      if (fotoPerfil) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/usuario/foto", fotoPerfil)
        );
      }
      if (correo && userFound.correo === correo) {
        return res.status(400).json(["El correo ya está en uso"]);
      } else if (dni && userFound.dni === dni) {
        return res.status(400).json(["El N° de DNI ya existe"]);
      }
    }
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json(["Usuario no encontrada para actualizar"]);

      // .json({ message: "Usuario no encontrada para actualizar" });
    }
    let fotoPerfilAntiguo = usuario.fotoPerfil;

    usuario.apellidoPaterno = apellidoPaterno;
    usuario.apellidoMaterno = apellidoMaterno;
    usuario.nombres = nombres;
    usuario.fechaNacimiento = fechaNacimiento;
    usuario.nivel = nivel;
    usuario.grado = grado;
    usuario.seccion = seccion;
    if (dni) {
      usuario.dni = dni;
    }
    usuario.numeroTelefonicoPersonal = numeroTelefonicoPersonal;
    usuario.generoSexo = generoSexo;
    if (correo) {
      usuario.correo = correo;
    }
    usuario.rol = rol;
    if (contrasenia) {
      const contraseniaHash = await bcrypt.hash(contrasenia, 10);
      usuario.contrasenia = contraseniaHash;
    }
    // usuario.puntajeTotal = puntajeTotal;
    usuario.estaVerificado = estaVerificado;
    // usuario.codigoVerificacion = codigoVerificacion;

    if (fotoPerfil) {
      usuario.fotoPerfil = fotoPerfil;
      deleteFotoPerfil = false;
    }
    if (
      (fotoPerfilAntiguo && fotoPerfil && fotoPerfil !== fotoPerfilAntiguo) ||
      deleteFotoPerfil
    ) {
      if (usuario.fotoPerfil) {
        await eliminarArchivo(
          path.join(UPLOADS_FOLDER, "/usuario/foto", fotoPerfilAntiguo)
        );
      }
      if (deleteFotoPerfil && !fotoPerfil) {
        usuario.fotoPerfil = null;
      }
    }
    const savedUpdateUsuario = await usuario.save();
    res.json(savedUpdateUsuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(400).json(["Usuario no encontrada para eliminar"]);
      // .json({ message: "Usuario no encontrada para eliminar" });
    }
    const fotoPerfil = usuario.fotoPerfil;
    if (fotoPerfil) {
      await eliminarArchivo(
        path.join(UPLOADS_FOLDER, "/usuario/foto", fotoPerfil)
      );
    }
    await usuario.deleteOne();
    // res.json({ message: "Usuario eliminado" });
    res.sendStatus(204);
  } catch (error) {
    // res.status(500).json({ message: error.message });
    res.status(500).json([error.message]);
  }
};

export const updatePoints = async (req, res) => {
  try {
    if (req.user._id.toString() == req.params.id) {
      req.user.puntajeTotal = req.body.points;
      req.user.save();
      res.sendStatus(201);
    } else {
      return res.status(403).json({ message: "Accion no permitida" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const getPerfilUsuario = async (req, res) => {
//   try {
//     const usuario = await Usuario.findById(req.params.id);
//     if (!usuario) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     const [
//       respuestasTotal,
//       respuestasPreTotal,
//       respuestasDesTotal,
//       sepNivPreguntasTotal,
//       productFinalsTotal,
//       preguntasTotal,
//       partParrafosTotal,
//     ] = await Promise.all([
//       Respuesta.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//       Respuesta.aggregate([
//         {
//           $match: {
//             refUsuario: usuario._id,
//             "refPregunta.refUsuario.rol": "Usuario",
//           },
//         },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//       Respuesta.aggregate([
//         {
//           $match: {
//             refUsuario: usuario._id,
//             "refPregunta.refUsuario.rol": { $ne: "Usuario" },
//           },
//         },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//       sepNivPregunta.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntosSep" } } },
//       ]),
//       ProductFinal.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//       Pregunta.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntajepregunta" } } },
//       ]),
//       PartParrafo.aggregate([
//         { $match: { refUsuario: usuario._id } },
//         { $group: { _id: null, total: { $sum: "$puntos" } } },
//       ]),
//     ]);

//     const response = {
//       ...usuario.toJSON(),
//       puntosRespuestas: respuestasTotal[0]?.total || 0,
//       puntosRespuestasPre: respuestasPreTotal[0]?.total || 0,
//       puntosRespuestasDes: respuestasDesTotal[0]?.total || 0,
//       puntosSepNivPregunta: sepNivPreguntasTotal[0]?.total || 0,
//       puntosProductoFinal: productFinalsTotal[0]?.total || 0,
//       puntosPregunta: preguntasTotal[0]?.total || 0,
//       puntosPartParrafo: partParrafosTotal[0]?.total || 0,
//     };

//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getPerfilUsuario = async (req, res) => {
  try {
    let puntosRespuestas = 0;
    let puntosRespuestasPre = 0;
    let puntosRespuestasDes = 0;
    let puntosSepNivPregunta = 0;
    let puntosProductoFinal = 0;
    let puntosPregunta = 0;
    let puntosPartParrafo = 0;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no econtrado" });
    }
    const {
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      correo,
      rol,
      puntajeTotal,
      fotoPerfil,
      numeroTelefonicoPersonal,
      createdAt,
    } = usuario.toJSON();
    if (usuario.rol == "Usuario") {
      const respuestas = await Respuesta.find({
        refUsuario: req.params.id,
      }).populate({ path: "refPregunta", populate: { path: "refUsuario" } });
      const sepNivPreguntas = await sepNivPregunta.find({
        refUsuario: req.params.id,
      });
      const productFinals = await ProductFinal.find({
        refUsuario: req.params.id,
      });
      const preguntas = await Pregunta.find({ refUsuario: req.params.id });
      const partParrafos = await PartParrafo.find({
        refUsuario: req.params.id,
      });
      respuestas.forEach((e) => {
        puntosRespuestas += e.puntos;
        console.log(e.puntos);
        if (
          e.refPregunta &&
          e.refPregunta.refUsuario &&
          e.refPregunta.refUsuario.rol == "Usuario"
        ) {
          puntosRespuestasDes += e.puntos;
        } else {
          puntosRespuestasPre += e.puntos;
        }
      });
      sepNivPreguntas.forEach((e) => {
        puntosSepNivPregunta += e.puntosSep;
      });
      productFinals.forEach((e) => {
        puntosProductoFinal += e.puntos;
      });
      preguntas.forEach((e) => {
        puntosPregunta += e.puntajepregunta;
      });
      console.log(preguntas.length);
      partParrafos.forEach((e) => {
        puntosPartParrafo += e.puntos;
      });

      const puntajeTotalSum =
        puntosRespuestas +
        puntosSepNivPregunta +
        puntosProductoFinal +
        puntosPregunta +
        puntosPartParrafo;

      const response = {
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        correo,
        rol,
        puntajeTotal,
        fotoPerfil,
        numeroTelefonicoPersonal,
        createdAt,
        puntosRespuestas,
        puntosSepNivPregunta,
        puntosProductoFinal,
        puntosPregunta,
        puntosPartParrafo,
        puntajeTotalSum,

        puntosRespuestasPre,
        puntosRespuestasDes,
      };
      res.json(response);
    } else {
      const lecturas = await Lectura.find({ refUsuario: req.params.id });

      const response = {
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        correo,
        rol,
        puntajeTotal,
        fotoPerfil,
        numeroTelefonicoPersonal,
        createdAt,
        lecturas,
      };
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Usuario no encontrado_Error" });
    }
    res.status(500).json({ message: error.message });
  }
};
