import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso no autorizado. Token no proporcionado." });
    }
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ message: "Acceso no autorizado. Token inválido." });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
