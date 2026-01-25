const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');

// @desc    Request OTP
// @route   POST /auth/request-otp
// @access  Public
const requestOtp = async (req, res) => {
    const { name, email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Please provide an email' });
        }

        // Create user if not exists
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP (TTL index will handle expiry in 5 mins)
        await Otp.create({ email, otp });

        // Log OTP to console
        console.log(`OTP for ${email}: ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully' });
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

        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark user as verified
        await User.findOneAndUpdate({ email }, { isVerified: true });

        // Delete OTP
        await Otp.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete profile and get token
// @route   POST /auth/complete-profile
// @access  Public
const completeProfile = async (req, res) => {
    const { email, firstName, lastName, age } = req.body;

    try {
        if (!email || !firstName || !lastName || !age) {
            return res.status(400).json({ message: 'Please provide all fields (email, firstName, lastName, age)' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified' });
        }

        // Update profile
        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        await user.save();

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({
            message: 'Profile completed',
            token,
            user: {
                id: user._id,
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

module.exports = {
    requestOtp,
    verifyOtp,
    completeProfile,
};
