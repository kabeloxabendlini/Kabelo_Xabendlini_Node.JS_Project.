const Post = require('../models/Post');
const { cloudinary } = require('../config/cloudinary');

module.exports = async (req, res) => {
    try {
        const imageUrl = req.file?.path || null;

        await Post.create({
            ...req.body,
            image: imageUrl,
            author: req.session.userId
        });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not upload post.");
        res.redirect('/posts/new');
    }
};
