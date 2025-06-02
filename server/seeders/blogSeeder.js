const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Blog = require("../model/Blog");
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
        console.log("Database Connected for seeding");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

// Sample users data
const usersData = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123"
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123"
    },
    {
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        password: "password123"
    },
    {
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        password: "password123"
    },
    {
        name: "David Brown",
        email: "david.brown@example.com",
        password: "password123"
    }
];

// Sample blog data
const blogsData = [
    {
        title: "Getting Started with React",
        content: "React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we'll explore the fundamentals of React, including components, state management, and props. Whether you're a beginner or looking to refresh your knowledge, this post will help you understand the core concepts that make React so popular among developers worldwide.",
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
        tags: ["react", "javascript", "frontend", "web development"]
    },
    {
        title: "Node.js Best Practices",
        content: "Node.js has revolutionized server-side development with its event-driven, non-blocking I/O model. This article covers essential best practices for Node.js development, including error handling, security considerations, performance optimization, and code organization. Learn how to build scalable and maintainable Node.js applications.",
        img: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
        tags: ["nodejs", "javascript", "backend", "best practices", "server"]
    },
    {
        title: "MongoDB Database Design",
        content: "Effective database design is crucial for any application's success. This post explores MongoDB's document-based approach, schema design patterns, indexing strategies, and performance optimization techniques. Discover how to structure your data for maximum efficiency and scalability in modern web applications.",
        img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
        tags: ["mongodb", "database", "nosql", "design patterns"]
    },
    {
        title: "CSS Grid vs Flexbox",
        content: "Understanding when to use CSS Grid versus Flexbox can significantly improve your web layouts. This detailed comparison explores the strengths and use cases of both layout systems, providing practical examples and real-world scenarios where each excels. Master modern CSS layout techniques.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        tags: ["css", "grid", "flexbox", "layout", "frontend"]
    },
    {
        title: "JavaScript ES6+ Features",
        content: "Modern JavaScript has evolved tremendously with ES6 and beyond. Explore the most important features including arrow functions, destructuring, async/await, modules, and more. This comprehensive guide will help you write cleaner, more efficient JavaScript code using the latest language features.",
        img: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop",
        tags: ["javascript", "es6", "modern js", "programming"]
    },
    {
        title: "Building RESTful APIs",
        content: "REST APIs are the backbone of modern web applications. Learn how to design and implement robust, scalable RESTful APIs using industry best practices. This guide covers HTTP methods, status codes, authentication, error handling, and API documentation strategies.",
        img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        tags: ["api", "rest", "backend", "web services"]
    },
    {
        title: "Docker for Developers",
        desc: "Containerization has transformed how we develop and deploy applications. This beginner-friendly guide to Docker covers container concepts, Dockerfile creation, image management, and orchestration basics. Learn how Docker can streamline your development workflow and ensure consistent deployments.",
        img: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop"
    },
    {
        title: "Git Version Control Mastery",
        desc: "Version control is essential for any developer. Master Git with this comprehensive guide covering branching strategies, merge conflicts, rebasing, and collaborative workflows. Learn advanced Git techniques that will make you more productive and confident in team environments.",
        img: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop"
    },
    {
        title: "Web Security Fundamentals",
        desc: "Security should never be an afterthought in web development. This post covers essential security practices including HTTPS, authentication, authorization, input validation, and common vulnerabilities like XSS and CSRF. Protect your applications and users with these proven security strategies.",
        img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop"
    },
    {
        title: "Performance Optimization Tips",
        desc: "Website performance directly impacts user experience and SEO rankings. Discover proven techniques for optimizing web applications including code splitting, lazy loading, caching strategies, image optimization, and performance monitoring. Make your websites lightning fast.",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    },
    {
        title: "Testing JavaScript Applications",
        desc: "Quality assurance through testing is crucial for reliable software. Learn about different testing approaches including unit tests, integration tests, and end-to-end testing. Explore popular testing frameworks like Jest, Mocha, and Cypress to ensure your code works as expected.",
        img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
    },
    {
        title: "Responsive Web Design",
        desc: "Creating websites that work seamlessly across all devices is essential in today's mobile-first world. This guide covers responsive design principles, mobile-first approach, flexible grids, media queries, and progressive enhancement techniques for optimal user experiences.",
        img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop"
    },
    {
        title: "State Management in React",
        desc: "Managing application state effectively is crucial for complex React applications. Compare different state management solutions including useState, useContext, Redux, and Zustand. Learn when and how to implement each approach for optimal application architecture.",
        img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop"
    },
    {
        title: "GraphQL vs REST APIs",
        desc: "Choosing the right API architecture can significantly impact your application's performance and developer experience. This comprehensive comparison explores GraphQL and REST, their strengths, weaknesses, and ideal use cases to help you make informed architectural decisions.",
        img: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop"
    },
    {
        title: "Microservices Architecture",
        desc: "Microservices have become a popular architectural pattern for building scalable applications. Understand the benefits and challenges of microservices, service communication patterns, data management strategies, and when to choose microservices over monolithic architectures.",
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"
    },
    {
        title: "Cloud Computing Basics",
        desc: "Cloud computing has revolutionized how we build and deploy applications. Explore different cloud service models (IaaS, PaaS, SaaS), major cloud providers, deployment strategies, and cost optimization techniques. Start your journey into cloud-native development.",
        img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop"
    },
    {
        title: "Machine Learning for Web Developers",
        desc: "Artificial intelligence is becoming increasingly accessible to web developers. Learn how to integrate machine learning into web applications using TensorFlow.js, pre-trained models, and cloud ML services. Discover practical AI applications for modern web development.",
        img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop"
    },
    {
        title: "Progressive Web Apps (PWAs)",
        desc: "Progressive Web Apps combine the best of web and mobile applications. Learn how to build PWAs with service workers, offline functionality, push notifications, and app-like experiences. Create web applications that feel native on any device.",
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop"
    },
    {
        title: "DevOps for Developers",
        desc: "DevOps practices bridge the gap between development and operations. Understand CI/CD pipelines, infrastructure as code, monitoring, and automation tools. Learn how DevOps principles can improve your development workflow and application reliability.",
        img: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=400&fit=crop"
    },
    {
        title: "Future of Web Development",
        desc: "The web development landscape is constantly evolving. Explore emerging technologies like WebAssembly, serverless computing, edge computing, and new JavaScript frameworks. Stay ahead of the curve and prepare for the future of web development.",
        img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop"
    }
];

// Seeder function
const seedDatabase = async () => {
    try {
        console.log("🌱 Starting database seeding...");

        // Clear existing data
        await Blog.deleteMany({});
        await User.deleteMany({});
        console.log("✅ Cleared existing data");

        // Create users
        const createdUsers = [];
        for (let userData of usersData) {
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            const savedUser = await user.save();
            createdUsers.push(savedUser);
        }
        console.log(`✅ Created ${createdUsers.length} users`);

        // Create blogs
        const createdBlogs = [];
        for (let i = 0; i < blogsData.length; i++) {
            const blogData = blogsData[i];
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            
            const blog = new Blog({
                title: blogData.title,
                content: blogData.content || blogData.desc, // Handle both content and desc
                img: blogData.img,
                tags: blogData.tags || [],
                user: randomUser._id,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
            });
            
            const savedBlog = await blog.save();
            
            // Add blog to user's blogs array
            randomUser.blogs.push(savedBlog._id);
            await randomUser.save();
            
            createdBlogs.push(savedBlog);
        }
        console.log(`✅ Created ${createdBlogs.length} blogs`);

        console.log("🎉 Database seeding completed successfully!");
        console.log(`📊 Summary: ${createdUsers.length} users, ${createdBlogs.length} blogs`);
        
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
        process.exit(0);
    }
};

// Run seeder
const runSeeder = async () => {
    await connectDB();
    await seedDatabase();
};

runSeeder();
