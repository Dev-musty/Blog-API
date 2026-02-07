import express from "express";
import env from "dotenv";
import pino from "pino";
import bodyParser from "body-parser";
import { connectDB } from "./database/dbConnection.ts";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoute from "./routes/authRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";
import dns from "dns";


dns.setServers(["8.8.8.8", "8.8.4.4"]);

// configuration
const app = express();
env.config();
const port = process.env.PORT;
const logger = pino();
app.use(cors());

// Rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

//Middleware
app.use(rateLimiter);
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
