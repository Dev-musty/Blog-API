import pino from "pino";
import JWTService from "../jwtService.ts";
import env from "dotenv";
import type { Register, Login } from "./authInterface.ts";
import type { Request, Response } from "express";
import { User } from "../../models/userModel.ts";
import bcrypt from "bcrypt";

class AuthService {
  logger = pino();
  private jwtService: JWTService;

  constructor(jwtService: JWTService) {
    this.jwtService = jwtService;
    env.config();
  }

  // Sign up
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body as Register;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User already exists, proceed to login" });
      }

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = this.jwtService.generateJWT(newUser.id);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
        accessToken: token,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Sign in
  async login(req: Request, res: Response) {
    const { email, password } = req.body as Login;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = this.jwtService.generateJWT(user.id);

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken: token,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default AuthService;
