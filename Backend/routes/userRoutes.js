import express from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/userModel.js';
import TempUser from '../models/tempUserModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/signup', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const tempUserExists = await TempUser.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    let tempUser;

    if (tempUserExists) {
        tempUser = tempUserExists;
        tempUser.name = name;
        tempUser.password = password;
        tempUser.otp = otp;
        tempUser.otpExpires = otpExpires;
        await tempUser.save();
    } else {
        tempUser = await TempUser.create({
            name,
            email,
            password,
            otp,
            otpExpires,
        });
    }

    const message = `
    <h1>Email Verification</h1>
    <p>Your OTP for email verification is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  `;

    try {
        await sendEmail({
            email: tempUser.email,
            subject: 'Avaya Jewelry - Email Verification OTP',
            message,
        });

        res.status(201).json({
            message: 'OTP sent to email successfully',
            email: tempUser.email,
        });
    } catch (error) {
        res.status(500);
        throw new Error('Email could not be sent');
    }
}));


router.post('/verify-otp', asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User already registered');
    }

    const tempUser = await TempUser.findOne({
        email,
        otp,
        otpExpires: { $gt: Date.now() }
    });

    if (!tempUser) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    const user = await User.create({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
        isVerified: true,
    });

    if (user) {
        await tempUser.deleteOne();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            res.status(401);
            throw new Error('Please verify your email first');
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));

router.post('/forgot-password', asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
        <h1>Password Reset Request</h1>
        <p>Please go to this link to reset your password:</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Avaya Jewelry - Password Reset Token',
            message,
        });

        res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500);
        throw new Error('Email could not be sent');
    }
}));

router.put('/reset-password/:resetToken', asyncHandler(async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid Token');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
        success: true,
        data: 'Password Reset Success',
        token: generateToken(user._id),
    });
}));

router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (user.isAdmin) {
        res.status(400);
        throw new Error('Cannot delete an admin user');
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
}));

router.get('/:id', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;
    const updated = await user.save();
    res.json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        isAdmin: updated.isAdmin,
        isVerified: updated.isVerified,
    });
}));

export default router;
