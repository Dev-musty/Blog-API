import express from "express";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middleware/validateAuth.ts";
import AuthController from "../controller/authController.ts";
import AuthService from "../services/auth/authService.ts";
import JWTService from "../services/jwtService.ts";

const router = express.Router();
const jwtService = new JWTService();
const authService = new AuthService(jwtService);
const authController = new AuthController(authService);

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export default router;
