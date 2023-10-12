import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export async function createAccessToken(payload, rememberAccount) {
  const expires = rememberAccount ? {} : { expiresIn: "1d" };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, expires, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}
