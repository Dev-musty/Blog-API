import pino from "pino";
import jwt from "jsonwebtoken";
import env from "dotenv";

class JWTService {
  logger = pino();
  secret: string;

  constructor() {
    env.config();
    this.secret = process.env.JWT_SECRET || "";
    if (!this.secret) {
      throw new Error("JWT_SECRET not defined");
    }
  }

  // sign jwt
  generateJWT(id: string) {
    return jwt.sign({ data: id }, this.secret, { expiresIn: "1d" });
  }

  // verify jwt
  verifyJWT(token: string) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}

export default JWTService;
