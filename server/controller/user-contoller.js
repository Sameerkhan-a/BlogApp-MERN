const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");

const getAllUser = async(req,res,next) =>{
    let users;

    try{
        users = await User.find().select('-password'); // Don't return passwords
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
    
    if(!users || users.length === 0){
        return res.status(404).json({ message: "No users found"});
    }

    return res.status(200).json({users});
}

const signUp = async(req,res,next) =>{
    const { name, email, password } = req.body;

    // Validate required fields
    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message: "Invalid email format"});
    }

    // Validate password length
    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters long"});
    }

    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }

    if(existingUser){
        return res.status(400).json({message: "User already exists!"});
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    });

    try{
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id, user.email);

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            blogs: user.blogs
        };

        return res.status(201).json({
            user: userResponse,
            token: token,
            message: "User created successfully"
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message: "Failed to create user"});
    }
}

const logIn = async(req,res,next) => {
    const {email, password} = req.body;
    
    // Validate required fields
    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }

    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
    
    if(!existingUser){
        return res.status(404).json({message: "User not found"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if(!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect password!"});
    }

    // Generate JWT token
    const token = generateToken(existingUser._id, existingUser.email);

    const userResponse = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        blogs: existingUser.blogs
    };

    return res.status(200).json({
        user: userResponse,
        token: token,
        message: "Login successful"
    });
}

module.exports = { getAllUser, signUp, logIn };
