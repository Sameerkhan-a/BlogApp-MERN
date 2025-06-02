const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    img: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, 'User is required']
    },
    viewCount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

// Add indexes for better search performance
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ tags: 1 });
blogSchema.index({ user: 1 });
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);
