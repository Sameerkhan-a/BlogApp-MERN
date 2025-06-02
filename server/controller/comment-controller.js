const Comment = require("../model/Comment");
const Blog = require("../model/Blog");
const User = require("../model/User");
const mongoose = require("mongoose");

// Get all comments for a specific blog post
const getCommentsByBlogId = async (req, res, next) => {
    const { blogId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        // Validate blog ID
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        // Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get comments with author details
        const comments = await Comment.find({ blogPost: blogId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalComments = await Comment.countDocuments({ blogPost: blogId });
        const totalPages = Math.ceil(totalComments / parseInt(limit));

        return res.status(200).json({
            comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalComments,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
};

// Add a new comment to a blog post
const addComment = async (req, res, next) => {
    const { blogId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // From auth middleware

    try {
        // Validate blog ID
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        // Validate content
        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Comment content is required" });
        }

        if (content.trim().length > 1000) {
            return res.status(400).json({ message: "Comment cannot exceed 1000 characters" });
        }

        // Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create new comment
        const comment = new Comment({
            content: content.trim(),
            author: userId,
            blogPost: blogId
        });

        // Save comment
        const savedComment = await comment.save();

        // Populate author details for response
        const populatedComment = await Comment.findById(savedComment._id)
            .populate('author', 'name email');

        return res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json({ message: "Failed to add comment" });
    }
};

// Delete a comment (only by comment author)
const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.userId; // From auth middleware

    try {
        // Validate comment ID
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Invalid comment ID" });
        }

        // Find comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }

        // Delete comment
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json({ message: "Failed to delete comment" });
    }
};

// Update a comment (only by comment author)
const updateComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // From auth middleware

    try {
        // Validate comment ID
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Invalid comment ID" });
        }

        // Validate content
        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Comment content is required" });
        }

        if (content.trim().length > 1000) {
            return res.status(400).json({ message: "Comment cannot exceed 1000 characters" });
        }

        // Find comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== userId) {
            return res.status(403).json({ message: "You can only edit your own comments" });
        }

        // Update comment
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content: content.trim() },
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        return res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment
        });
    } catch (err) {
        console.error("Error updating comment:", err);
        return res.status(500).json({ message: "Failed to update comment" });
    }
};

// Get comment statistics for a blog
const getCommentStats = async (req, res, next) => {
    const { blogId } = req.params;

    try {
        // Validate blog ID
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        // Get comment count
        const commentCount = await Comment.countDocuments({ blogPost: blogId });

        return res.status(200).json({
            blogId,
            commentCount
        });
    } catch (err) {
        console.error("Error fetching comment stats:", err);
        return res.status(500).json({ message: "Failed to fetch comment statistics" });
    }
};

module.exports = {
    getCommentsByBlogId,
    addComment,
    deleteComment,
    updateComment,
    getCommentStats
};
