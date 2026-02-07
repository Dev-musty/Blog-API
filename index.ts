import express from "express";
import env from "dotenv";
import pino from "pino";
import bodyParser from "body-parser";
import { connectDB } from "./database/dbConnection.ts";
import cors from "cors";
import authRoute from "./routes/authRoutes.ts";

// configuration
const app = express();
env.config();
const port = process.env.PORT;
const logger = pino();
app.use(cors());

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// services
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send('HELLLO...')
});
app.listen(port, async () => {
  connectDB();
  logger.info(`App listening on port ${port}`);
});
