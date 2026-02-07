import pino from "pino";
import mongoose from "mongoose";
import type {
  CreatePost,
  GetPosts,
  PaginatedResponse,
  UpdatePost,
} from "./postInterface.ts";
import type { Request, Response } from "express";
import { Post } from "../../models/postModel.ts";

interface AuthRequest extends Request {
  user?: { id: string; name: string; email: string };
}

class PostService {
  logger = pino();
  constructor() {}

  // create post
  createPost = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content, tags, status } = req.body as CreatePost;

    try {
      const newPost = await Post.create({
        title,
        content,
        author: userId,
        tags: tags || [],
        status: status || "draft",
      });

      return res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  getPosts = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { page, limit, search, tag, author, status } = req.query as GetPosts;

    const pageNum = Number(page || "1");
    const limitNum = Number(limit || "10");
    const skip = (pageNum - 1) * limitNum;

    try {
      // Build query filter
      const filter: Record<string, unknown> = {};

      if (status && userId) {
        // accesible for authenticated user
        filter.status = status;
      } else {
        // accessible for public user
        filter.status = "published";
      }

      // filter by title or content search
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ];
      }

      // filter by tags
      if (tag) {
        filter.tags = { $in: [tag] };
      }

      // filter by post author
      if (author?.toString()) {
        filter.author = author;
      }

      // exclude soft-deleted posts
      filter.deletedAt = null;

      const totalItems = await Post.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limitNum);

      const posts = await Post.find(filter)
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        data: posts,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  getPostBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
      const post = await Post.findOne({
        slug,
        status: "published",
        deletedAt: null,
      }).populate("author", "name email");

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  updatePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const post = await Post.findById(id).session(session);

      if (!post) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user is the author
      if (post.author?.toString() !== userId) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(403)
          .json({ message: "Only accessible by the author" });
      }

      const { title, content, tags, status } = req.body as UpdatePost;

      // Update fields if provided
      if (title) post.title = title;
      if (content) post.content = content;
      if (tags) post.tags = tags;
      if (status) post.status = status;
      post.updatedAt = new Date();

      await post.save({ session });
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Post updated successfully",
        post,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // DELETE soft delete post (author only)
  deletePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.author?.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Only accessible by the author" });
      }

      if (post.deletedAt) {
        return res.status(400).json({ message: "Post already deleted" });
      }

      post.deletedAt = new Date();
      await post.save();

      return res.status(200).json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}

export default PostService;
