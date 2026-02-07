import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// registration validation
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// login validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});


// middleware
export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error});
  }
  req.body = result.data;
  next();
};

