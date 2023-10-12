import nodemailer from "nodemailer";
import { PASSWORD_SEND_EMAILS, USER_SEND_EMAILS } from "../config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // host: "smtp.office365.com",
  // port: 587,
  // secure: false,
  auth: {
    user: USER_SEND_EMAILS,
    pass: PASSWORD_SEND_EMAILS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await transporter.sendMail({
      from: `Company <${USER_SEND_EMAILS}>`,
      to,
      subject,
      html,
    });
    console.log({ result });
    // return { ok: true, message: "Mail enviado con exito" };
    return { ok: true, message: "Mail enviado con exito" };
  } catch (error) {
    console.log({ error });
    return {
      ok: false,
      message: "Hubo un error al enviar el email",
      err: error,
    };
  }
};

export default sendEmail;
