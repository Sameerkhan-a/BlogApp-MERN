const express = require('express');
const { upload } = require('../config/cloudinary');
const { verifyToken } = require('../middleware/auth');

const uploadRouter = express.Router();

// Upload single image
uploadRouter.post('/image', verifyToken, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Return the uploaded image URL
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
});

// Handle upload errors
uploadRouter.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 5MB.'
        });
    }
    
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed!'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: error.message
    });
});

module.exports = uploadRouter;
