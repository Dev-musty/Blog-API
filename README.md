# Blog API

A RESTful Blog API Featuring user authentication and CRUD operations.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete blog posts
- Post filtering by search, tags, author, and status
- Pagination support
- Input validation 
- Rate limiting for API protection
- Soft delete for posts 

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Hashing:** bcrypt

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dev-musty/Blog-API.git
   cd Blog-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see below)

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Environment Variables

```env
PORT=3000
MONGO_DB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/blog_api
JWT_SECRET=your_super_secret_jwt_key
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

---

## Authentication Endpoints

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "679a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-07T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "679a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Post Endpoints

### Create Post (Auth Required)
```
POST /api/posts
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "tags": ["nodejs", "express", "mongodb"],
  "status": "published"
}
```

**Response (201 Created):**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "679b2c3d4e5f67890123456a",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is the content of my blog post...",
    "author": "679a1b2c3d4e5f6789012345",
    "status": "published",
    "tags": ["nodejs", "express", "mongodb"],
    "createdAt": "2026-02-07T11:00:00.000Z"
  }
}
```

---

### Get All Posts (Public)
```
GET /api/posts
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Search in title/content |
| `tag` | string | Filter by tag |
| `author` | string | Filter by author ID |
| `status` | string | Filter by status (auth required for "draft") |

**Example Request:**
```
GET /api/posts?page=1&limit=10&search=content&tag=nodejs&author=679a1b2c3d4e5f6789012345&status=published
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "679b2c3d4e5f67890123456a",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": "This is the content of my blog post...",
      "author": {
        "_id": "679a1b2c3d4e5f6789012345",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "published",
      "tags": ["nodejs", "express", "mongodb"],
      "createdAt": "2026-02-07T11:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Get Single Post by Slug (Public)
```
GET /api/posts/:slug
```

**Example Request:**
```
GET /api/posts/my-first-blog-post
```

**Response (200 OK):**
```json
{
  "_id": "679b2c3d4e5f67890123456a",
  "title": "My First Blog Post",
  "slug": "my-first-blog-post",
  "content": "This is the content of my blog post...",
  "author": {
    "_id": "679a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "status": "published",
  "tags": ["nodejs", "express", "mongodb"],
  "createdAt": "2026-02-07T11:00:00.000Z"
}
```

---

### Update Post (Auth Required - Author Only)
```
PUT /api/posts/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Blog Post Title",
  "content": "Updated content...",
  "tags": ["nodejs", "typescript"],
  "status": "published"
}
```

**Response (200 OK):**
```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": "679b2c3d4e5f67890123456a",
    "title": "Updated Blog Post Title",
    "slug": "updated-blog-post-title",
    "content": "Updated content...",
    "author": "679a1b2c3d4e5f6789012345",
    "status": "published",
    "tags": ["nodejs", "typescript"],
    "createdAt": "2026-02-07T11:00:00.000Z",
    "updatedAt": "2026-02-07T12:00:00.000Z"
  }
}
```

---

### Delete Post - Soft Delete (Auth Required - Author Only)
```
DELETE /api/posts/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

---

## Error Responses

### Validation Error
```json
{
    "errors": {
        "name": "ZodError",
        "message": "[\n  {\n    \"origin\": \"string\",\n    \"code\": \"invalid_format\",\n    \"format\": \"email\",\n    \"pattern\": \"/^(?!\\\\.)(?!.*\\\\.\\\\.)([A-Za-z0-9_'+\\\\-\\\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\\\-]*\\\\.)+[A-Za-z]{2,}$/\",\n    \"path\": [\n      \"email\"\n    ],\n    \"message\": \"Invalid email address\"\n  }\n]"
    }
}
```

### Unauthorized (401)
```json
{
  "message": "No token provided"
}
```

### Forbidden (403)
```json
{
  "message": "Only accessible by the author"
}
```

### Not Found (404)
```json
{
  "message": "Post not found"
}
```

### Conflict (409)
```json
{
  "message": "User already exists, proceed to login"
}
```

### Rate Limit Exceeded (429)
```json
{
  "message": "Too many requests, please try again later"
}
```


---

## Project Structure

```
Blog-API/
├── controller/
│   ├── authController.ts
│   └── postController.ts
├── database/
│   └── dbConnection.ts
├── middleware/
│   ├── protect.ts
│   ├── validateAuth.ts
│   └── ValidatePost.ts
├── models/
│   ├── postModel.ts
│   └── userModel.ts
├── routes/
│   ├── authRoutes.ts
│   └── postRoutes.ts
├── services/
│   ├── auth/
│   │   ├── authInterface.ts
│   │   └── authService.ts
│   ├── post/
│   │   ├── postInterface.ts
│   │   └── postService.ts
│   └── jwtService.ts
├── index.ts
├── package.json
└── README.md
```
