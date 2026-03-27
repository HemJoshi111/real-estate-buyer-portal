import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user/buyer
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {

    // Destructure name, email, and password from request body
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    try {
        // Check if user already exists with the same email or not.
        const userExists = await User.findOne({ email });

        // If user exists, return error
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user if not exists
        const user = await User.create({
            name,
            email,
            password,
        });

        // If user created successfully, return user data and token.
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Default role is "Buyer"
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please include email and password' });
    }

    try {
        // Find user by email and include password field for comparison
        const user = await User.findOne({ email }).select('+password');

        // If user exists and password matches, return user data and token
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    // req.user was attached by the 'protect' middleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};