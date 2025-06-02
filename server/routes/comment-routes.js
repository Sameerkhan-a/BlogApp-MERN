const express = require("express");
const commentRouter = express.Router();
const {
    getCommentsByBlogId,
    addComment,
    deleteComment,
    updateComment,
    getCommentStats
} = require("../controller/comment-controller");
const { verifyToken } = require("../middleware/auth");

// Public routes
commentRouter.get("/blog/:blogId", getCommentsByBlogId); // Get all comments for a blog
commentRouter.get("/blog/:blogId/stats", getCommentStats); // Get comment statistics

// Protected routes (require authentication)
commentRouter.post("/blog/:blogId", verifyToken, addComment); // Add comment to blog
commentRouter.put("/:commentId", verifyToken, updateComment); // Update comment (author only)
commentRouter.delete("/:commentId", verifyToken, deleteComment); // Delete comment (author only)

module.exports = commentRouter;
