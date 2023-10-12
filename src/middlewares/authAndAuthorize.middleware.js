import { auth } from "./auth.middleware.js";
import { authorizeRoles } from "./authRol.middleware.js";

export function authAndAuthorize(allowedRoles) {
  return [auth, authorizeRoles(allowedRoles)];
}
