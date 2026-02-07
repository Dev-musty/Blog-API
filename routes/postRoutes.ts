import express from "express";
import JWTService from "../services/jwtService.ts";
import ProtectRoute from "../middleware/protect.ts";
import PostService from "../services/post/postService.ts";
import PostController from "../controller/postController.ts";
import {
  validate,
  validateQuery,
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
} from "../middleware/ValidatePost.ts";

const jwtService = new JWTService();
const protectRoute = new ProtectRoute(jwtService);
const postService = new PostService();
const postController = new PostController(postService);

const router = express.Router();

router.post(
  "/",
  protectRoute.protect,
  validate(createPostSchema),
  postController.createPost,
);

router.get("/", validateQuery(getPostsQuerySchema), postController.getPost);

router.get(
  "/:slug",
  validateQuery(getPostsQuerySchema),
  postController.getPostBySlug,
);

router.put(
  "/:id",
  protectRoute.protect,
  validate(updatePostSchema),
  postController.updatePost,
);

router.delete("/:id", protectRoute.protect, postController.delPost);

export default router;
