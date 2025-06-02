const mongoose = require("mongoose");
const User = require("../model/User");

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://localhost:27017/blogapp",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Database Connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

// Get all users
const getUsers = async () => {
    try {
        const users = await User.find({}, 'name email _id');
        console.log("\n📋 Available Users:");
        console.log("==================");
        users.forEach((user, index) => {
            console.log(`${index + 1}. Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   ID: ${user._id}`);
            console.log("   ---");
        });
        console.log(`\nTotal users: ${users.length}`);
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
        process.exit(0);
    }
};

// Run script
const runScript = async () => {
    await connectDB();
    await getUsers();
};

runScript();
