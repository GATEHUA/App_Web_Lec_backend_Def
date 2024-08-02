import Pregunta from "../models/pregunta.model.js";
import Respuesta from "../models/respuesta.model.js";
import Parrafo from "../models/parrafo.model.js";
import PartParrafo from "../models/partParrafo.model.js";
import sepNivPregunta from "../models/sepNivPregunta.model.js";
import Lectura from "../models/lectura.model.js";
import ProductFinal from "../models/productFinal.model.js";
import LecturaCompletaAl from "../models/lecturacompletal.model.js";
import Observacion from "../models/obeservacions.js";

export const getStatus = async (req, res) => {
  const { user } = req;
  const { refLectura } = req.query;
  try {
    const lecturacompletal = await LecturaCompletaAl.find({
      refLectura,
      refUsuario: user._id,
    }).populate("refObservaciones");
    const lectura = await Lectura.findById(refLectura);
    const mispreguntas = await Pregunta.find({
      refLectura,
      refUsuario: user._id,
    });
    const productFinalFound = await ProductFinal.findOne({
      refLectura,
      refUsuario: user._id,
    });

    const respuestas = await Respuesta.find({
      refUsuario: user._id,
    }).populate({
      path: "refPregunta",
      populate: {
        path: "refUsuario",
        match: { rol: { $ne: "Usuario" } },
      },
      match: { refLectura },
    });
    const filteredRespuestas = respuestas.filter(
      (respuesta) =>
        respuesta.refPregunta !== null &&
        respuesta.refPregunta.refUsuario !== null
    );

    const partParrafos = await PartParrafo.find({
      refUsuario: user._id,
    }).populate({
      path: "refParrafo",
      match: { refLectura },
    });
    const filteredPartParrafos = partParrafos.filter(
      (partParrafo) => partParrafo.refParrafo !== null
    );

    const sepNivPreguntas = await sepNivPregunta
      .find({
        refUsuario: user._id,
      })
      .populate({
        path: "refPregunta",
        match: { refLectura },
      });
    const filteredSepNivPreguntas = sepNivPreguntas.filter(
      (sepNivPregunta) => sepNivPregunta.refPregunta !== null
    );

    // console.log(partParrafos);

    const preguntas = await Pregunta.find({ refLectura })
      .sort({ orden: 1 })
      .populate({ path: "refUsuario" });
    const filteredPreguntas = preguntas.filter(
      (pregunta) => pregunta.refUsuario.rol !== "Usuario"
    );
    const filteredData = filteredPreguntas.map((pregunta) => {
      const { refUsuario, ...rest } = pregunta.toObject(); // Copia todas las propiedades excepto refUsuario
      return rest;
    });

    const parrafos = await Parrafo.find({ refLectura }).sort({ orden: 1 });
    res.status(200).json({
      preguntas: filteredData,
      respuestas: filteredRespuestas,
      nparrafos: parrafos,
      respartParrafos: filteredPartParrafos,
      resSepNivPreguntas: filteredSepNivPreguntas,
      limitpreguser: lectura,
      mispreguntasuser: mispreguntas,
      productFinalFound,
      lecturacompletal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStatus = async (req, res) => {
  const { user } = req;
  const { refLectura } = req.query;
  const { porcentaje, estado } = req.body;
  try {
    const newData = new LecturaCompletaAl({
      refUsuario: user._id,
      refLectura,
      porcentaje,
      estado,
    });
    await newData.save();
    res.status(200).json({ message: "Creacion exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getStatusAll = async (req, res) => {
//   try {
//     const status = await LecturaCompletaAl.find({}).populate([
//       { path: "refUsuario" },
//       { path: "refLectura" },
//     ]);
//     let data = [];
//     status.map((e) => {
//       const existData = data.find(
//         (x) => x.refUsuario?._id === e.refUsuario._id
//       );
//       if (existData) {
//         existData.refLecturas.push({
//           // ...e.refLectura,
//           titulo: e.refLectura.titulo,
//           _id: e.refLectura._id,
//           idS: e._id,
//           nivelDificultad: e.refLectura.nivelDificultad,
//           estado: e.estado,
//           porcentaje: e.porcentaje,
//         });
//       } else {
//         data.push({
//           refUsuario: e.refUsuario,
//           refLecturas: [
//             {
//               titulo: e.refLectura.titulo,
//               _id: e.refLectura._id,
//               idS: e._id,
//               nivelDificultad: e.refLectura.nivelDificultad,
//               estado: e.estado,
//               porcentaje: e.porcentaje,
//             },
//           ],
//         });
//       }
//     });
//     res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };
export const getStatusAll = async (req, res) => {
  try {
    const status = await LecturaCompletaAl.find({}).populate([
      { path: "refUsuario" },
      { path: "refLectura" },
    ]);

    let data = [];

    status.map((e) => {
      // Verificar si e.refLectura no es null o undefined
      if (e.refLectura) {
        const existData = data.find(
          (x) => x.refUsuario?._id === e.refUsuario._id
        );
        if (existData) {
          existData.refLecturas.push({
            titulo: e.refLectura.titulo,
            _id: e.refLectura._id,
            idS: e._id,
            nivelDificultad: e.refLectura.nivelDificultad,
            estado: e.estado,
            porcentaje: e.porcentaje,
          });
        } else {
          data.push({
            refUsuario: e.refUsuario,
            refLecturas: [
              {
                titulo: e.refLectura.titulo,
                _id: e.refLectura._id,
                idS: e._id,
                nivelDificultad: e.refLectura.nivelDificultad,
                estado: e.estado,
                porcentaje: e.porcentaje,
              },
            ],
          });
        }
      } else {
        // Manejar el caso cuando e.refLectura es null o undefined
        console.warn(`La lectura con el ID ${e._id} no tiene refLectura.`);
      }
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// CODIGO mas antiguo
// export const getStatusAllmyLecs = async (req, res) => {
//   const { user } = req;
//   try {
//     const status = await LecturaCompletaAl.find({}).populate([
//       { path: "refUsuario" },
//       { path: "refLectura" },
//     ]);
//     const mislecturas = await Lectura.find({ refUsuario: user._id });

//     const idsMyLecturas = mislecturas.map((e) => e._id.toJSON());
//     console.log("idsMyLecturas");

//     console.log(idsMyLecturas);

//     let data = [];

//     status.map((e) => {
//       const existData = data.find(
//         (x) => x.refUsuario?._id === e.refUsuario._id
//       );
//       console.log("bucle");

//       console.log(e.refLectura._id.toJSON());
//       let lect;
//       if (idsMyLecturas.includes(e.refLectura._id.toJSON())) {
//         lect = e.refLectura;
//       }
//       if (existData) {
//         existData.refLecturas.push(lect);
//       } else {
//         data.push({
//           refUsuario: e.refUsuario,
//           estado: e.estado,
//           porcentaje: e.porcentaje,
//           refLecturas: [lect],
//         });
//       }
//     });
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// CODIGO ANTIGUO SIN MANEJO DE NULLS EL MAS ANTIGUS ES ESO ...
// export const getStatusAllmyLecs = async (req, res) => {
//   const { user } = req;
//   try {
//     // Obtener todas las lecturas que creó el usuario
//     const mislecturas = await Lectura.find({ refUsuario: user._id });

//     // Obtener los IDs de las lecturas del usuario
//     const idsMyLecturas = mislecturas.map((e) => e._id.toJSON());

//     // Obtener todos los status, independientemente del usuario
//     const allStatus = await LecturaCompletaAl.find({}).populate([
//       { path: "refUsuario" },
//       { path: "refLectura" },
//     ]);

//     // Filtrar los status para incluir solo las lecturas del usuario
//     const data = allStatus.reduce((result, e) => {
//       if (idsMyLecturas.includes(e.refLectura._id.toString())) {
//         const existData = result.find((x) =>
//           x.refUsuario?._id.equals(e.refUsuario._id)
//         );

//         let lect;
//         if (e.refLectura) {
//           lect = {
//             titulo: e.refLectura.titulo,
//             _id: e.refLectura._id,
//             idS: e._id,
//             nivelDificultad: e.refLectura.nivelDificultad,
//             estado: e.estado,
//             porcentaje: e.porcentaje,
//           };
//         }

//         if (lect) {
//           if (existData) {
//             existData.refLecturas.push(lect);
//           } else {
//             result.push({
//               refUsuario: e.refUsuario,
//               estado: e.estado,
//               porcentaje: e.porcentaje,
//               refLecturas: [lect],
//             });
//           }
//         }
//       }
//       return result;
//     }, []);

//     res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getStatusAllmyLecs = async (req, res) => {
  const { user } = req;
  try {
    // Obtener todas las lecturas que creó el usuario
    const mislecturas = await Lectura.find({ refUsuario: user._id });

    // Obtener los IDs de las lecturas del usuario
    const idsMyLecturas = mislecturas.map((e) => e._id.toJSON());

    // Obtener todos los status, independientemente del usuario
    const allStatus = await LecturaCompletaAl.find({}).populate([
      { path: "refUsuario" },
      { path: "refLectura" },
    ]);

    // Filtrar los status para incluir solo las lecturas del usuario
    const data = allStatus.reduce((result, e) => {
      if (e.refLectura && idsMyLecturas.includes(e.refLectura._id.toString())) {
        const existData = result.find((x) =>
          x.refUsuario?._id.equals(e.refUsuario._id)
        );

        let lect;
        if (e.refLectura) {
          lect = {
            titulo: e.refLectura.titulo,
            _id: e.refLectura._id,
            idS: e._id,
            nivelDificultad: e.refLectura.nivelDificultad,
            estado: e.estado,
            porcentaje: e.porcentaje,
          };
        }

        if (lect) {
          if (existData) {
            existData.refLecturas.push(lect);
          } else {
            result.push({
              refUsuario: e.refUsuario,
              estado: e.estado,
              porcentaje: e.porcentaje,
              refLecturas: [lect],
            });
          }
        }
      }
      return result;
    }, []);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const status = await LecturaCompletaAl.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!status) {
      return res
        .status(404)
        .json({ message: "Estado de lectura no encontrado para actualizar" });
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const status = await LecturaCompletaAl.findByIdAndDelete(req.params.id);
    if (!status) {
      return res
        .status(404)
        .json({ message: "Estado de lectura no encontrado para eliminar" });
    }
    const observacionesIds = status.refObservaciones;
    await Observacion.deleteMany({ _id: { $in: observacionesIds } });
    await status.deleteOne();
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRespuestasQuery = async (req, res) => {
  const { refLectura, refUsuario } = req.query;
  const user = {};
  user._id = refUsuario;
  try {
    const respuestas = await Respuesta.find({
      refUsuario: user._id,
    }).populate({
      path: "refPregunta",
      populate: {
        path: "refUsuario",
        match: { rol: { $ne: "Usuario" } },
      },
      match: { refLectura },
    });
    const filteredRespuestas = respuestas.filter(
      (respuesta) =>
        respuesta.refPregunta !== null &&
        respuesta.refPregunta.refUsuario !== null
    );
    const ordenData = filteredRespuestas.sort(
      (a, b) => a.refPregunta.orden - b.refPregunta.orden
    );
    res.status(200).json(ordenData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPartParrafosQuery = async (req, res) => {
  const { refLectura, refUsuario } = req.query;
  const user = {};
  user._id = refUsuario;
  try {
    const partParrafos = await PartParrafo.find({
      refUsuario: user._id,
    }).populate({
      path: "refParrafo",
      match: { refLectura },
    });
    const filteredPartParrafos = partParrafos.filter(
      (partParrafo) => partParrafo.refParrafo !== null
    );
    const ordenData = filteredPartParrafos.sort(
      (a, b) => a.refParrafo.orden - b.refParrafo.orden
    );
    res.status(200).json(ordenData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSepnivPreguntasQuery = async (req, res) => {
  const { refLectura, refUsuario } = req.query;
  const user = {};
  user._id = refUsuario;
  try {
    const sepNivPreguntas = await sepNivPregunta
      .find({
        refUsuario: user._id,
      })
      .populate({
        path: "refPregunta",
        match: { refLectura },
      });
    const filteredSepNivPreguntas = sepNivPreguntas.filter(
      (sepNivPregunta) => sepNivPregunta.refPregunta !== null
    );
    const ordenData = filteredSepNivPreguntas.sort(
      (a, b) => a.refPregunta.orden - b.refPregunta.orden
    );
    res.status(200).json(ordenData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getYouPreguntasQuery = async (req, res) => {
  const { refLectura, refUsuario } = req.query;
  const user = {};
  user._id = refUsuario;
  try {
    const mispreguntas = await Pregunta.find({
      refLectura,
      refUsuario: user._id,
    })
      .sort({ orden: 1 })
      .populate("refAlternativas");

    res.status(200).json(mispreguntas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductoFinalQuery = async (req, res) => {
  const { refLectura, refUsuario } = req.query;
  const user = {};
  user._id = refUsuario;
  try {
    const productFinalFound = await ProductFinal.findOne({
      refLectura,
      refUsuario: user._id,
    });
    if (!productFinalFound) {
      return res.status(404).json({ message: "producto final no encontrado" });
    }
    res.status(200).json(productFinalFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLecturaCompStatQuery = async (req, res) => {
  const { refLectura, refUsuario } = req.query;
  const user = {};
  user._id = refUsuario;
  try {
    const lecturacompletal = await LecturaCompletaAl.findOne({
      refLectura,
      refUsuario: user._id,
    }).populate("refObservaciones");
    res.status(200).json(lecturacompletal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatusQuery = async (req, res) => {
  // const { user } = req;
  const { refLectura, refUsuario } = req.query;
  const user = {};
  user._id = refUsuario;
  try {
    const lecturacompletal = await LecturaCompletaAl.find({
      refLectura,
      refUsuario: user._id,
    }).populate("refObservaciones");
    const lectura = await Lectura.findById(refLectura);
    const mispreguntas = await Pregunta.find({
      refLectura,
      refUsuario: user._id,
    });
    const productFinalFound = await ProductFinal.findOne({
      refLectura,
      refUsuario: user._id,
    });

    const respuestas = await Respuesta.find({
      refUsuario: user._id,
    }).populate({
      path: "refPregunta",
      populate: {
        path: "refUsuario",
        match: { rol: { $ne: "Usuario" } },
      },
      match: { refLectura },
    });
    const filteredRespuestas = respuestas.filter(
      (respuesta) =>
        respuesta.refPregunta !== null &&
        respuesta.refPregunta.refUsuario !== null
    );

    const partParrafos = await PartParrafo.find({
      refUsuario: user._id,
    }).populate({
      path: "refParrafo",
      match: { refLectura },
    });
    const filteredPartParrafos = partParrafos.filter(
      (partParrafo) => partParrafo.refParrafo !== null
    );

    const sepNivPreguntas = await sepNivPregunta
      .find({
        refUsuario: user._id,
      })
      .populate({
        path: "refPregunta",
        match: { refLectura },
      });
    const filteredSepNivPreguntas = sepNivPreguntas.filter(
      (sepNivPregunta) => sepNivPregunta.refPregunta !== null
    );

    // console.log(partParrafos);

    const preguntas = await Pregunta.find({ refLectura })
      .sort({ orden: 1 })
      .populate({ path: "refUsuario" });
    const filteredPreguntas = preguntas.filter(
      (pregunta) => pregunta.refUsuario.rol !== "Usuario"
    );
    const filteredData = filteredPreguntas.map((pregunta) => {
      const { refUsuario, ...rest } = pregunta.toObject(); // Copia todas las propiedades excepto refUsuario
      return rest;
    });

    const parrafos = await Parrafo.find({ refLectura }).sort({ orden: 1 });
    res.status(200).json({
      preguntas: filteredData,
      respuestas: filteredRespuestas,
      nparrafos: parrafos,
      respartParrafos: filteredPartParrafos,
      resSepNivPreguntas: filteredSepNivPreguntas,
      limitpreguser: lectura,
      mispreguntasuser: mispreguntas,
      productFinalFound,
      lecturacompletal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
