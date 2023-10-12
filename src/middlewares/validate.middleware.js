export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // const mensajesDeError = {};
    // error.errors.map(
    //   (error) => (mensajesDeError[error.path[0]] = error.message)
    // );
    // return res.status(400).json({ error: mensajesDeError });

    // return res
    //   .status(400)
    //   .json({ error: error.errors.map((error) => error.message) });

    // return res.status(400).json({ error: error.errors });
    const mensajesDeError = {};
    error.errors.map((error) => {
      const path = error.path[0];
      const message = error.message;

      if (!mensajesDeError[path]) {
        mensajesDeError[path] = [message];
      } else {
        mensajesDeError[path].push(message);
      }
    });
    return res.status(400).json(mensajesDeError);
  }
};
