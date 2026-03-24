const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Create account for the user automatically with a dummy account number
        const account = await Account.create({
            user: user._id,
            accountNumber: `BNK-${Math.floor(Math.random() * 1000000000)}`,
            balance: 1000, // Starting balance bonus
        });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                accountNumber: account.accountNumber,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    try {
        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ success: false, error: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = generateAccessToken(decoded.id);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (err) {
        res.status(403).json({ success: false, error: 'Invalid refresh token' });
    }
};
