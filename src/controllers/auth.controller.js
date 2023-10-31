import sendEmail from "../helpers/mailer.js";
import otpGenerator from "otp-generator";

import { createAccessToken } from "../libs/jwt.js";
import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const {
      // nombreUsuario,
      correo,
      contrasenia,
      // codigoVerificacion,
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      fechaNacimiento,
      dni,
      numeroTelefonicoPersonal,
      generoSexo,
      nivel,
      grado,
      seccion,
    } = req.body;
    console.log("desde register");
    console.log(req.body);

    const userFound = await Usuario.findOne({ $or: [{ correo }, { dni }] });

    if (userFound) {
      if (userFound.correo === correo && userFound.dni === dni) {
        // return res.status(400).json({ correo: "El correo ya está en uso" });
        return res
          .status(400)
          .json(["El correo ya está en uso", "El N° de DNI ya existe"]);
      } else if (userFound.correo === correo) {
        // return res.status(400).json({ correo: "El correo ya está en uso" });
        return res.status(400).json(["El correo ya está en uso"]);
      } else if (userFound.dni === dni) {
        // return res.status(400).json({ dni: "El N° de DNI ya existe" });
        return res.status(400).json(["El N° de DNI ya existe"]);
      }
    }

    const code = otpGenerator.generate(7, {
      specialChars: false,
    });

    const contraseniaHash = await bcrypt.hash(contrasenia, 10);
    const newUsuario = new Usuario({
      correo,
      contrasenia: contraseniaHash,
      codigoVerificacion: code,
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      numeroTelefonicoPersonal,
      fechaNacimiento,
      dni,
      generoSexo,
      nivel,
      grado,
      seccion,
    });
    const usuarioSaved = await newUsuario.save();
    const token = await createAccessToken({ id: usuarioSaved._id });
    res.cookie("token", token, {
      // httpOnly: true,
    });
    const resultEmail = await sendEmail({
      to: correo,
      subject: `Código de confirmación: ${code}`,
      html: `<p>Su codigo de verificacion es: <strong>${code}</strong></p>`,
    });

    const userJson = usuarioSaved.toObject();
    userJson["SendEmail"] = resultEmail;
    const { codigoVerificacion, ...rest } = userJson;
    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyCode = async (req, res) => {
  const { correo } = req.params;
  const { codigoVerificacion } = req.body;
  // const estaVerificado=true
  try {
    const user = await Usuario.findOne({ correo, codigoVerificacion });
    if (!user) {
      // return res.status(400).json({ message: "Codigo incorrecto" });
      return res.status(400).json(["Codigo incorrecto"]);
    }
    if (user.estaVerificado === true) {
      return res.status(200).json(["El codigo ya fue verificado"]);
    }
    user.estaVerificado = true;
    const userBD = await user.save();
    // const token = await createAccessToken({ id: user._id }, rememberAccount);
    // res.cookie("token", token, {
    //   httpOnly: true,
    // });
    return res.status(202).json(userBD);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const generateCode = async (req, res) => {
  const { correo } = req.params;
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) {
      // return res
      //   .status(400)
      //   .json({ ok: false, message: "Usuario inexistente" });
      return res.status(400).json(["Usuario inexistente"]);
    }
    const code = otpGenerator.generate(7, {
      specialChars: false,
    });
    user.codigoVerificacion = code;
    await user.save();
    const resultEmail = await sendEmail({
      to: correo,
      subject: `Código de confirmación: ${code}`,
      html: `<p>Su codigo de verificacion nueva es: <strong>${code}</strong></p>`,
    });
    if (!resultEmail.ok) {
      res.status(500).json(["Hubo un error al enviar el email"]);
    }
    res
      .status(200)
      .json({ message: "Codigo generado", SendEmail: resultEmail });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { correo, contrasenia, rememberAccount = false } = req.body;
  // console.log(req.body);
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) {
      // return res.status(400).json({ message: "Usuario no encontrado" });
      return res.status(400).json(["Usuario no encontrado"]);
    }
    const isMatch = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!isMatch) {
      return res.status(400).json(["Contraseña incorrecta"]);
    }

    // if (!user.estaVerificado) {
    //   return res.status(403).json(["Correo no verificado"]);
    // }
    const token = await createAccessToken({ id: user._id }, rememberAccount);
    res.cookie("token", token, {
      // httpOnly: false,
      // secure: true,
      // sameSite: "none",
    });

    // res.json({
    //   id: user._id,
    //   nombreUsuario: user.nombreUsuario,
    //   correo: user.correo,
    // });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const recoverPassword = async (req, res) => {
  const { correo } = req.params;
  const { codigoVerificacion, rememberAccount = false } = req.body;
  try {
    const user = await Usuario.findOne({ codigoVerificacion, correo });
    if (!user) {
      return res.status(400).json(["Codigo Incorrecto"]);
    }
    const token = await createAccessToken({ id: user._id }, rememberAccount);
    res.cookie("token", token, {
      // httpOnly: false,
      // secure: true,
      // sameSite: "none",
    });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const recoverPasswordSend = async (req, res) => {
  const { correo } = req.body;
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) {
      return res.status(400).json(["Usuario no encontrado"]);
    }
    console.log(user.estaVerificado);
    if (!user.estaVerificado) {
      return res.status(400).json(["Su cuenta nunca fue Verificada"]);
    }
    const code = otpGenerator.generate(7, {
      specialChars: false,
    });
    user.codigoVerificacion = code;
    await user.save();
    const resultEmail = await sendEmail({
      to: correo,
      subject: `Inicie Sesion de Manera Segura`,
      html: `<p>Su codigo nuevo es: <strong>${code}</strong></p>`,
    });
    if (!resultEmail.ok) {
      res.status(500).json(["Hubo un error al enviar el email"]);
    }
    res.status(200).json({ message: "Codigo Enviado", SendEmail: resultEmail });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const profile = async (req, res) => {
  const { user } = req;
  // Crear una copia del objeto de usuario   //toObject()<- ES DE MONGOOSE
  // const userObject = { ...user.toObject() };
  // const { contrasenia, ...rest } = userObject;
  // return res.json(rest);
  try {
    const userdb = await Usuario.findById(user.id);
    if (!userdb) {
      return res.status(400).json(["Usuario no encontrado"]);
    }

    const { codigoVerificacion, ...rest } = userdb.toObject();
    return res.json(rest);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  // Ó
  // delete userObject.contrasenia;
  // return res.json(userObject);
};

// import axios from "axios";
// import sendSms from "../helpers/sms.js";

// import textflow from "textflow.js";
// import { YOUR_API_KEY_SMS } from "../config.js";
// textflow.useKey(YOUR_API_KEY_SMS);

// export const generate_code_sms = async (req, res) => {
//   const code = otpGenerator.generate(7, {
//     upperCaseAlphabets: true,
//     specialChars: false,
//     lowerCaseAlphabets: true,
//     digits: true,
//   });
//   res.status(200).json({ code });
// };

// export const generate_code_sms = async (req, res) => {
//   try {
//     const { phone_number, code } = req.body;
//     const result = await sendSms(phone_number, code);
//     return res.status(result.status).json(result.message);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// };

// export const generate_code_sms = async (req, res) => {
//   const { phone_number, code } = req.body;
//   const apiKey =
//     "ClpWrLWbfZBiN3IJUHi8di4oeTHIwbxXMkXPPIDfpdOgWE2YxfufkZax0O61YuFV"; // Reemplaza 'YOUR_API_KEY' con tu clave de API

//   const sms = {
//     phone_number,
//     text: `App de Comprension Lectora CNI3:
//     su codigo para registarse es: ${code}`,
//   };

//   const url = "https://textflow.me/api/send-sms";

//   axios
//     .post(url, sms, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//     })
//     .then((response) => {
//       console.log(response.data);
//       res.sendStatus(200);
//     })
//     .catch((error) => {
//       console.error(error);
//       res.sendStatus(500);
//     });
// };
