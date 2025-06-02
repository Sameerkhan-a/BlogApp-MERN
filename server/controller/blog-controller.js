const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");

const getAllBlogs = async(req,res,next) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build search query
        let searchQuery = {};

        // Search by text (title, content, tags)
        if (req.query.search) {
            searchQuery.$text = { $search: req.query.search };
        }

        // Filter by tags
        if (req.query.tags) {
            const tags = req.query.tags.split(',').map(tag => tag.trim().toLowerCase());
            searchQuery.tags = { $in: tags };
        }

        // Filter by author
        if (req.query.author) {
            searchQuery.user = req.query.author;
        }

        // Get total count for pagination
        const totalBlogs = await Blog.countDocuments(searchQuery);

        // Get blogs with pagination and sorting
        const blogs = await Blog.find(searchQuery)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalBlogs / limit);

        return res.status(200).json({
            blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const addBlog = async(req,res,next) =>{
    const { title, content, img, tags } = req.body;
    const user = req.user.userId; // Get user from authenticated token

    // Validate required fields with specific messages
    if(!title || title.trim() === ""){
        return res.status(400).json({message: "Title is required"});
    }
    if(!content || content.trim() === ""){
        return res.status(400).json({message: "Content is required"});
    }

    // Process tags
    let processedTags = [];
    if (tags && Array.isArray(tags)) {
        processedTags = tags
            .filter(tag => tag && tag.trim())
            .map(tag => tag.trim().toLowerCase())
            .slice(0, 10); // Limit to 10 tags
    }

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (e) {
        console.log("Error finding user:", e);
        return res.status(400).json({message: "Invalid user ID"});
    }

    if(!existingUser){
        return res.status(400).json({message: "User not found. Please log in again."});
    }

    const blogData = {
        title: title.trim(),
        content: content.trim(),
        tags: processedTags,
        user,
        date: new Date()
    };

    // Only add image if provided
    if (img && img.trim()) {
        blogData.img = img.trim();
    }

    const blog = new Blog(blogData);

    try {
        // Save the blog first
        const savedBlog = await blog.save();

        // Add blog to user's blogs array
        existingUser.blogs.push(savedBlog._id);
        await existingUser.save();

        // Populate user data for response
        const populatedBlog = await Blog.findById(savedBlog._id).populate('user', 'name email');

        return res.status(201).json({blog: populatedBlog});
    } catch (e) {
        console.log("Error creating blog:", e);
        return res.status(500).json({message: "Failed to create blog"});
    }
}

const updateBlog = async(req,res,next) => {
    const blogId = req.params.id;
    const { title, content, img, tags } = req.body;
    const userId = req.user.userId; // Get user from authenticated token

    // Validate ObjectId
    if(!mongoose.Types.ObjectId.isValid(blogId)){
        return res.status(400).json({message: "Invalid blog ID"});
    }

    // Validate required fields
    if(!title || title.trim() === ""){
        return res.status(400).json({message: "Title is required"});
    }
    if(!content || content.trim() === ""){
        return res.status(400).json({message: "Content is required"});
    }

    // Process tags
    let processedTags = [];
    if (tags && Array.isArray(tags)) {
        processedTags = tags
            .filter(tag => tag && tag.trim())
            .map(tag => tag.trim().toLowerCase())
            .slice(0, 10); // Limit to 10 tags
    }

    try {
        // First, find the blog to check ownership
        const existingBlog = await Blog.findById(blogId);

        if(!existingBlog){
            return res.status(404).json({message: "Blog not found"});
        }

        // Check if the user owns this blog (CRITICAL SECURITY CHECK)
        if(existingBlog.user.toString() !== userId){
            return res.status(403).json({message: "Unauthorized: You can only edit your own blogs"});
        }

        // Update the blog
        const updateData = {
            title: title.trim(),
            content: content.trim(),
            tags: processedTags
        };

        // Only update image if provided
        if(img && img.trim()){
            updateData.img = img.trim();
        }

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        return res.status(200).json({blog});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getById = async (req,res,next) =>{
    const id = req.params.id;

    // Validate ObjectId
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "Invalid blog ID"});
    }

    try{
        // Increment view count and get blog
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        ).populate('user', 'name email');

        if(!blog){
            return res.status(404).json({message: "Blog not found"});
        }

        return res.status(200).json({blog});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.userId; // Get user from authenticated token

    // Validate ObjectId
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "Invalid blog ID"});
    }

    try {
        // First, find the blog to check ownership
        const existingBlog = await Blog.findById(id).populate('user');

        if (!existingBlog) {
            return res.status(404).json({message: "Blog not found"});
        }

        // Check if the user owns this blog (CRITICAL SECURITY CHECK)
        if(existingBlog.user._id.toString() !== userId){
            return res.status(403).json({message: "Unauthorized: You can only delete your own blogs"});
        }

        // Delete the blog
        await Blog.findByIdAndDelete(id);

        // Remove blog from user's blogs array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { blogs: id } }
        );

        return res.status(200).json({message: "Blog deleted successfully"});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    
    // Validate ObjectId
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({message: "Invalid user ID"});
    }

    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
    
    if (!userBlogs) {
        return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ user: userBlogs });
};

// Get all unique tags
const getAllTags = async (req, res, next) => {
    try {
        const tags = await Blog.distinct('tags');
        const tagCounts = await Blog.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return res.status(200).json({ tags, tagCounts });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get blog statistics
const getBlogStats = async (req, res, next) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const totalViews = await Blog.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
        ]);

        const topBlogs = await Blog.find()
            .sort({ viewCount: -1 })
            .limit(5)
            .populate('user', 'name')
            .select('title viewCount createdAt');

        const recentBlogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .select('title createdAt');

        return res.status(200).json({
            totalBlogs,
            totalViews: totalViews[0]?.totalViews || 0,
            topBlogs,
            recentBlogs
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAllBlogs,
    addBlog,
    updateBlog,
    getById,
    deleteBlog,
    getByUserId,
    getAllTags,
    getBlogStats
};
