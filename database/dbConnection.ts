import mongoose from "mongoose";
import env from "dotenv";
import pino from "pino";

// configuration
env.config();
const mongoDBUrl = process.env.MONGO_DB_URI;
const logger = pino();

export const connectDB = async () => {
  if (!mongoDBUrl) {
    throw new Error("MONGO_DB_URI not defined");
  }
  await mongoose
    .connect(mongoDBUrl)
    .then(() => {
      logger.info("Database connection successful");
    })
    .catch((e) => {
      logger.info(e.message);
    });
};
