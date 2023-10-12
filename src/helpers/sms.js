//Codigo funcional con texflow pero no money
import textflow from "textflow.js";
import { YOUR_API_KEY_SMS } from "../config.js";
textflow.useKey(YOUR_API_KEY_SMS);

const sendSms = async (phone_number, code) => {
  try {
    let result = await textflow.sendSMS(
      phone_number,
      `App de Comprension Lectora CNI3:
        su codigo para registarse es: ${code}`
    );
    return result;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      status: result.status,
      message: result.message,
      err: error,
    };
  }
};
export default sendSms;
