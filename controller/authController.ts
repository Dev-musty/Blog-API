import type { Request, Response } from "express";
import pino from "pino";
import AuthService from "../services/auth/authService.ts";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response) => {
    return this.authService.register(req, res);
  };

  login = async (req: Request, res: Response) => {
    return this.authService.login(req, res);
  };
}

export default AuthController;
