import path from "path";
import { fileURLToPath } from "url";

const dirActual = fileURLToPath(import.meta.url);
export const UPLOADS_FOLDER = path.join(dirActual, "../../uploads");
