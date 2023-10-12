import Usuario from "../models/usuario.model.js";

export const authorizeRoles = (allowedRoles) => {
  return async (req, res, next) => {
    const userFound = await Usuario.findById(req.user.id);
    if (!userFound || !userFound.rol) {
      return res
        .status(403)
        .json({ message: "Acceso no autorizado. Usuario no encontrado" });
    }
    if (!userFound.estaVerificado) {
      return res
        .status(403)
        .json({ message: "Acceso no autorizado. Correo no verificado." });
    }
    if (allowedRoles.includes(userFound.rol)) {
      req.user = userFound;
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Acceso no autorizado para este rol." });
    }
  };
};

// export const authorizeRoles = (allowedRoles) => async (req, res, next) => {
//   const userFound = await Usuario.findById(req.user.id);
//   if (!userFound || !userFound.rol) {
//     return res
//       .status(403)
//       .json({ message: "Acceso no autorizado. Usuario no encontrado" });
//   }
//   if (!userFound.estaVerificado) {
//     return res
//       .status(403)
//       .json({ message: "Acceso no autorizado. Correo no verificado." });
//   }
//   if (allowedRoles.includes(userFound.rol)) {
//     req.user = userFound;
//     next();
//   } else {
//     return res
//       .status(403)
//       .json({ message: "Acceso no autorizado para este rol." });
//   }
// };
