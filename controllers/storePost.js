const BlogPost = require('../models/BlogPost.js');
const cloudinary = require('../config/cloudinary');

module.exports = async (req, res) => {
    try {
        // No file uploaded?
        if (!req.files || !req.files.image) {
            return res.status(400).send('No image uploaded');
        }

        const imageFile = req.files.image;
        const userId = req.session.userId;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            folder: "blog_images"
        });

        // Create blog post with Cloudinary image URL
        await BlogPost.create({
            ...req.body,
            image: result.secure_url,  // ⭐ IMPORTANT — store Cloudinary URL
            userid: userId
        });

        res.redirect('/');
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).send('Internal Server Error');
    }
};
