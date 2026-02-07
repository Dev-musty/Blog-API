export interface CreatePost {
  title: string;
  content: string;
  tags?: string[];
  status?: "draft" | "published";
}

export interface GetPosts {
  page?: string;
  limit?: string;
  search?: string;
  tag?: string;
  author?: string;
  status?: "draft" | "published";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UpdatePost {
  title?: string;
  content?: string;
  tags?: string[];
  status?: "draft" | "published";
}
