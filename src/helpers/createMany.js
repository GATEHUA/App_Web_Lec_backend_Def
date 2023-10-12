// export function contenidoPrAndRe(texto) {
//   const seccionesPrincipales = texto
//     .split(/\d+\./)
//     .filter((seccion) => seccion.trim() !== "");
//   let preguntasAndAlternativas = [];
//   seccionesPrincipales.map((value) => {
//     const arrayData = value.split(/[a-z]\)/);
//     const pAQ = {
//       Pregunta: arrayData[0].trim(),
//       Alternativa: arrayData.slice(1).map((v) => v.trim()),
//     };
//     preguntasAndAlternativas.push(pAQ);
//   });
//   return preguntasAndAlternativas;
// }

export function contenidoPrAndRe(texto) {
  const seccionesPrincipales = texto
    .split(/\d+\./)
    .filter((seccion) => seccion.trim() !== "");
  const preguntasAndAlternativas = seccionesPrincipales.map((seccion) => {
    const [pregunta, ...alternativas] = seccion
      .split(/[a-z]\)/)
      .map((texto) => texto.trim());
    return {
      pregunta,
      alternativas,
    };
  });
  return preguntasAndAlternativas;
}

export function contenidoParrafos(contenido) {
  return contenido
    .split(/\n\n+/)
    .filter((parrafo) => parrafo.trim() !== "")
    .map((parrafo) => parrafo.trim());
}
