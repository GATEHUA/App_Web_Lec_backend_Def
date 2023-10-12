import fs from "fs/promises";

const eliminarArchivo = async (ruta) => {
  try {
    await fs.unlink(ruta);
    // console.log("Archivlo elimnado :", ruta);
  } catch (error) {
    console.log(error);
  }
};

export default eliminarArchivo;
