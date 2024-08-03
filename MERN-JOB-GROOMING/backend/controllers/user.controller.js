const User = require('../models/user.model.js');
const getDataUri = require('../utils/datauri.js');
const cloudinary = require('../utils/cloudinary.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Debugging request body and file
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        // const file = req.file;
        // if (!file) {
        //     return res.status(400).json({
        //         message: "File is missing",
        //         success: false
        //     });
        // }

        // const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            // profile: {
            //     profilePhoto: cloudResponse.secure_url,
            // }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
}

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
}

const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        // Debugging request body and file
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        // const file = req.file;
        // if (file) {
        //     const fileUri = getDataUri(file);
        //     const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

            // Updating user profile
            const userId = req.id; // Middleware authentication
            let user = await User.findById(userId);

            if (!user) {
                return res.status(400).json({
                    message: "User not found.",
                    success: false
                });
            }

            if (fullname) user.fullname = fullname;
            if (email) user.email = email;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio) user.profile.bio = bio;
            if (skills) user.profile.skills = skills.split(",");

            // user.profile.resume = cloudResponse.secure_url; // Save Cloudinary URL
            // user.profile.resumeOriginalName = file.originalname; // Save the original file name

            await user.save();

            return res.status(200).json({
                message: "Profile updated successfully.",
                user,
                success: true
            });
        // } else {
            return res.status(400).json({
                message: "File is missing",
                success: false
            });
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
}

module.exports = {
    register,
    login,
    logout,
    updateProfile
};
