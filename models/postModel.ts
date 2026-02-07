import { Schema, model, Types } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
  },
  author: {
    type: Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  tags: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

// Generate slug from title
postSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export const Post = model("Post", postSchema);
