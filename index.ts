import express from "express";
import env from "dotenv";
import pino from "pino";
import bodyParser from "body-parser";
import { connectDB } from "./database/dbConnection.ts";
import cors from "cors";
import authRoute from "./routes/authRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";
import dns from 'dns';

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

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
app.use("/api/posts", postRoutes);


app.get("/", (req, res) => {
  res.send("HELL.");
});
app.listen(port, async () => {
  connectDB();
  logger.info(`App listening on port ${port}`);
});
