import mongoose from "mongoose";
import { DB_CONNECTION, PASSWORD_DB, USER_DB } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION, {
      auth: {
        username: USER_DB,
        password: PASSWORD_DB,
      },
      // authSource: "admin",
    });
    console.log(">> DB is connected");
  } catch (error) {
    console.log(error);
  }
};
