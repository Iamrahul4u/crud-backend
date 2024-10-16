import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export async function ConnectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    throw new Error("Error While Connecting to the DB", error);
  }
}
