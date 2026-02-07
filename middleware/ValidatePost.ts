import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// post creation input validation
export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

// post update validation
export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

// posts query validation
export const getPostsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  slug: z.string().optional(),
});

// body validation middleware
export const validate =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }
    req.body = result.data;
    next();
  };

// query validation middleware
export const validateQuery =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }
    next();
  };
