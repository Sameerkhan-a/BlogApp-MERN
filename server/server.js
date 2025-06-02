require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");
const uploadRouter = require("./routes/upload-routes");
const commentRouter = require("./routes/comment-routes");
require("./config/db");
const cors = require("cors");

const app = express();

// CORS configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set("view engine", "ejs");
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Blog App Backend API",
        version: "1.0.0",
        status: "running",
        timestamp: new Date(),
        endpoints: {
            health: "/api/health",
            users: "/api/users",
            blogs: "/api/blogs",
            comments: "/api/comments",
            upload: "/api/upload"
        }
    });
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/comments", commentRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is running", timestamp: new Date() });
});

// Catch-all route for undefined endpoints
app.use("/api/*", (req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Define port
const PORT = process.env.PORT || 5001;

// For Vercel, we need to export the app
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
}

module.exports = app;
