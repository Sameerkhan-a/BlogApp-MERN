const jwt = require("jsonwebtoken");
const User = require("../model/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: "Access denied. No token provided or invalid format." 
            });
        }

        // Extract token from "Bearer TOKEN"
        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({ 
                message: "Access denied. No token provided." 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user from database (optional - for fresh user data)
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid token. User not found." 
            });
        }

        // Add user info to request object
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            name: user.name
        };

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: "Invalid token." 
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: "Token expired. Please login again." 
            });
        } else {
            return res.status(500).json({ 
                message: "Token verification failed." 
            });
        }
    }
};

// Optional middleware - checks token but doesn't require it
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            
            if (token) {
                const decoded = jwt.verify(token, JWT_SECRET);
                const user = await User.findById(decoded.userId).select('-password');
                
                if (user) {
                    req.user = {
                        userId: decoded.userId,
                        email: decoded.email,
                        name: user.name
                    };
                }
            }
        }
        
        next();
    } catch (error) {
        // If token is invalid, just continue without user info
        next();
    }
};

// Generate JWT token
const generateToken = (userId, email) => {
    return jwt.sign(
        { 
            userId, 
            email 
        },
        JWT_SECRET,
        { 
            expiresIn: '7d' // Token expires in 7 days
        }
    );
};

module.exports = {
    verifyToken,
    optionalAuth,
    generateToken,
    JWT_SECRET
};
