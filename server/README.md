# Blog App Backend

A full-featured blog application backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication**: JWT-based user authentication
- 📝 **Blog Management**: CRUD operations for blog posts
- 💬 **Comments System**: Users can comment on blog posts
- 🖼️ **Image Upload**: Cloudinary integration for image storage
- 🏷️ **Tags System**: Categorize blogs with tags
- 🔍 **Search & Filter**: Search blogs by title, content, tags, and author
- 📄 **Pagination**: Efficient data loading
- 🛡️ **Security**: Input validation, authentication middleware
- 🌐 **CORS**: Configured for cross-origin requests

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users (protected)

### Blogs
- `GET /api/blogs` - Get all blogs (with pagination, search, filters)
- `GET /api/blogs/:id` - Get single blog by ID
- `POST /api/blogs/add` - Create new blog (protected)
- `PUT /api/blogs/update/:id` - Update blog (protected, owner only)
- `DELETE /api/blogs/:id` - Delete blog (protected, owner only)
- `GET /api/blogs/user/:id` - Get blogs by user ID (protected)
- `GET /api/blogs/tags` - Get all unique tags
- `GET /api/blogs/stats` - Get blog statistics

### Comments
- `GET /api/comments/blog/:blogId` - Get comments for a blog
- `POST /api/comments/blog/:blogId` - Add comment (protected)
- `PUT /api/comments/:commentId` - Update comment (protected, author only)
- `DELETE /api/comments/:commentId` - Delete comment (protected, author only)
- `GET /api/comments/blog/:blogId/stats` - Get comment statistics

### File Upload
- `POST /api/upload/image` - Upload image to Cloudinary (protected)

### Utility
- `GET /` - API information
- `GET /api/health` - Health check

## Environment Variables

Create a `.env` file in the server directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blogapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=5001

# Client Configuration
CLIENT_URL=http://localhost:3000
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Production Environment
NODE_ENV=development
```

## Local Development

1. **Install Dependencies**:
```bash
npm install
```

2. **Set up Environment Variables**:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Start Development Server**:
```bash
npm run dev
```

4. **Seed Database** (optional):
```bash
npm run seed
```

## Production Deployment

See [BACKEND_DEPLOYMENT_GUIDE.md](../BACKEND_DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Project Structure

```
server/
├── config/
│   ├── db.js              # Database connection
│   └── cloudinary.js      # Cloudinary configuration
├── controller/
│   ├── blog-controller.js # Blog CRUD operations
│   ├── user-controller.js # User authentication
│   └── comment-controller.js # Comment operations
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── model/
│   ├── User.js            # User schema
│   ├── Blog.js            # Blog schema
│   └── Comment.js         # Comment schema
├── routes/
│   ├── user-routes.js     # User routes
│   ├── blog-routes.js     # Blog routes
│   ├── comment-routes.js  # Comment routes
│   └── upload-routes.js   # File upload routes
├── seeders/
│   └── blogSeeder.js      # Database seeding
├── scripts/
│   └── getUsers.js        # Utility scripts
├── server.js              # Main application file
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel deployment config
└── .env                   # Environment variables
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured allowed origins
- **Rate Limiting**: Built-in Express security
- **Error Handling**: Secure error responses

## Database Schema

### User
- `name`: String (required, max 50 chars)
- `email`: String (required, unique, validated)
- `password`: String (required, min 6 chars, hashed)
- `blogs`: Array of Blog references

### Blog
- `title`: String (required, max 200 chars)
- `content`: String (required)
- `img`: String (optional, image URL)
- `tags`: Array of strings (max 10 tags)
- `user`: User reference (required)
- `viewCount`: Number (default 0)
- `date`: Date (default now)

### Comment
- `content`: String (required, max 1000 chars)
- `author`: User reference (required)
- `blogPost`: Blog reference (required)
- `createdAt`: Date (default now)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
