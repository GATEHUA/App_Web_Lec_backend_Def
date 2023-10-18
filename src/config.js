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
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
