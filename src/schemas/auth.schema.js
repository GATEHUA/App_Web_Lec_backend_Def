import { z } from "zod";

export const loginSchema = z.object({
  correo: z
    .string({ required_error: "Campo requerido" })
    .nonempty({ message: "Campo requerido" })
    .email("Correo invalido"),

  // .nonempty({ required_error: "Campo requerido" }),
  // .string({ required_error: "Campo requerido" })
  // .email("Correo invalido"),

  contrasenia: z
    .string({ required_error: "Campo requerido" })
    .nonempty({ message: "Campo requerido" })
    .min(8, { message: "La contraseña debe tener como minimo 8 caracters" }),
});

// correo
// contrasenia
// apellidoPaterno
// apellidoMaterno
// nombres
// fechaNacimiento
// dni
// numeroTelefonicoPersonal
// generoSexo
export const registerSchema = z.object({
  apellidoPaterno: z
    .string({ required_error: "Campo requerido" })
    .nonempty({ message: "Campo requerido" }),
  apellidoMaterno: z
    .string({ required_error: "Campo requerido" })
    .nonempty({ message: "Campo requerido" }),
  nombres: z
    .string({ required_error: "Campo requerido" })
    .nonempty({ message: "Campo requerido" }),
  fechaNacimiento: z
    .string()
    .nonempty({ message: "Campo requerido" })
    .refine((date) => new Date(date).toString() !== "Invalid Date", {
      message: "Fecha invalida",
    })
    .transform((date) => new Date(date)),
  // .nullable()
  // .refine((date) => !!date, { message: "Requerido" }), // Al final
  // dni: z
  //   .number({
  //     invalid_type_error: "Campo requerido",
  //     required_error: "Campo requerido",
  //   })
  //   .positive("El campo no puede tener numeros negativos")
  //   .gte(10000000, { message: "Debe tener como minimo 8 caracters" }),
  dni: z
    .string({
      invalid_type_error: "Campo requerido",
      required_error: "Campo requerido",
    })
    .length(8, { message: "Debe tener como mínimo 8 digitos" }),
  numeroTelefonicoPersonal: z
    .number({
      invalid_type_error: "Campo requerido",
      required_error: "Campo requerido",
    })
    .positive("El campo no puede tener numeros negativos")
    .gte(100000000, { message: "Debe tener como minimo 9 caracters" }),
  generoSexo: z
    .string({ required_error: "Campo requerido" })
    .nonempty({ message: "Campo requerido" }),
  correo: z
    .string({ required_error: "Campo requerido" })
    .email("Correo invalido"),
  contrasenia: z
    .string({ required_error: "Campo requerido" })
    .min(8, { message: "Debe tener como minimo 8 caracters" })
    .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
    .regex(/[a-z]/, { message: "Debe contener al menos una minúscula" })
    .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
});
