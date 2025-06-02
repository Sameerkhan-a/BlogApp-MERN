const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        minlength: [1, 'Comment must have at least 1 character']
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, 'Comment author is required']
    },
    blogPost: {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
        required: [true, 'Blog post reference is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

// Index for better query performance
commentSchema.index({ blogPost: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

module.exports = mongoose.model("Comment", commentSchema);
