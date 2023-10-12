import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT;
export const DB_CONNECTION = process.env.DB_CONNECTION;
export const USER_DB = process.env.USER_DB;
export const PASSWORD_DB = process.env.PASSWORD_DB;
export const FRONT_URL = process.env.FRONT_URL;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const USER_SEND_EMAILS = process.env.USER_SEND_EMAILS;
export const PASSWORD_SEND_EMAILS = process.env.PASSWORD_SEND_EMAILS;
export const YOUR_API_KEY_SMS = process.env.YOUR_API_KEY_SMS;
