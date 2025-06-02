const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`Database Connected`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();

module.exports = connectDB;
