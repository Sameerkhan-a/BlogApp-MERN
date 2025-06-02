const express = require("express")
const blogRouter = express.Router();
const { getAllBlogs , addBlog ,
     updateBlog ,getById ,
    deleteBlog , getByUserId, getAllTags, getBlogStats} = require("../controller/blog-controller");
const { verifyToken, optionalAuth } = require("../middleware/auth");

// Public routes
blogRouter.get("/", getAllBlogs);
blogRouter.get("/tags", getAllTags);
blogRouter.get("/stats", getBlogStats);
blogRouter.get("/:id", getById);

// Protected routes (require authentication)
blogRouter.post('/add', verifyToken, addBlog);
blogRouter.put("/update/:id", verifyToken, updateBlog);
blogRouter.delete("/:id", verifyToken, deleteBlog);
blogRouter.get("/user/:id", verifyToken, getByUserId);
module.exports = blogRouter;