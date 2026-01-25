const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');

// @desc    Request OTP
// @route   POST /auth/request-otp
// @access  Public
const requestOtp = async (req, res) => {
    const { name, email } = req.body;

    try {
        if (!name || !email) {
            return res.status(400).json({ message: 'Please provide name and email' });
        }

        // Create user if not exists
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
            });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP with expiry (5 minutes)
        await Otp.create({
            email,
            otp,
        });

        // Log OTP to console (for development)
        console.log(`OTP for ${email}: ${otp}`);

        res.status(200).json({
            message: 'OTP sent successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and OTP' });
        }

        // Find OTP
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await Otp.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Mark user as verified
        await User.findOneAndUpdate({ email }, { isVerified: true });

        // Delete used OTP
        await Otp.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            message: 'OTP verified successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete profile
// @route   POST /auth/complete-profile
// @access  Public
const completeProfile = async (req, res) => {
    const { email, firstName, lastName, age } = req.body;

    try {
        if (!email || !firstName || !lastName || !age) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Update user profile
        const user = await User.findOneAndUpdate(
            { email },
            { firstName, lastName, age },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        // Generate JWT
        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    requestOtp,
    verifyOtp,
    completeProfile,
};
