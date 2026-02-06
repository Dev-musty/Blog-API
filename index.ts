import express from "express";
import env from "dotenv";
import pino from 'pino'
// configuration
const app = express();
env.config();
const port = process.env.PORT;
const logger = pino();

app.listen(port, async () => {
  logger.info(`App listening on port ${port}`);
});
