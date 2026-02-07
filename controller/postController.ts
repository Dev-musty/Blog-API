import type { Request, Response } from "express";
import PostService from "../services/post/postService.ts";


class PostController {
  private postService: PostService;

  constructor(postService: PostService) {
    this.postService = postService;
  }

  createPost = async (req: Request, res: Response) => {
    return this.postService.createPost(req, res);
  };

  getPost = async (req: Request, res: Response) => {
    return this.postService.getPosts(req, res);
  };

  getPostBySlug = async (req: Request, res: Response) => {
    return this.postService.getPostBySlug(req, res);
  };

  updatePost = async (req: Request, res: Response) => {
    return this.postService.updatePost(req, res);
  };

  delPost = async (req: Request, res: Response) => {
    return this.postService.deletePost(req, res);
  };
}

export default PostController;
