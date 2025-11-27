const cloudinary = require('../config/cloudinary');
const Post = require('../models/Post');

module.exports = async (req, res) => {
    try {
        let imageUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        await Post.create({
            title: req.body.title,
            content: req.body.content,
            image: imageUrl
        });

        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.redirect('/posts/new');
    }
};
