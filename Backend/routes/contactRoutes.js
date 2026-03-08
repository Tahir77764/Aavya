import express from 'express';
import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';
import Contact from '../models/contactModel.js';

const router = express.Router();

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please provide name, email and message');
    }

    // Save to database
    const contactMessage = await Contact.create({
        name,
        email,
        subject,
        message
    });

    const emailContent = `
        <h1>New Contact Message</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>This message has been saved to the database with ID: ${contactMessage._id}</p>
    `;

    try {
        await sendEmail({
            email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin
            subject: `Contact Form: ${subject || 'New Message'}`,
            message: emailContent,
        });

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        // We don't throw error here because it's already saved in DB
        res.status(200).json({
            success: true,
            message: 'Message received and saved, but notification email failed to send.'
        });
    }
}));

export default router;
