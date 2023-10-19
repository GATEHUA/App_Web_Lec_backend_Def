import eliminarArchivo from "../libs/deleteFile.js";
import path from "path";
import { UPLOADS_FOLDER } from "../libs/rutaUpload.js";
import Usuario from "../models/usuario.model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";

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
    const usuarios = await Usuario.find({ rol: "Usuario" });
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
