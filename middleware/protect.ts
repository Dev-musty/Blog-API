import type { Request, Response, NextFunction } from "express";
import JWTService from "../services/jwtService.ts";
import pino from "pino";
import { User } from "../models/userModel.ts";

class ProtectRoute {
  private logger = pino();
  private jwtService: JWTService;

  constructor(jwtService: JWTService) {
    this.jwtService = jwtService;
  }

  protect = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = this.jwtService.verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      const user = await User.findById((decoded as any).data).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      (req as any).user = user;
      next();
    } catch (error) {
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}

export default ProtectRoute;
