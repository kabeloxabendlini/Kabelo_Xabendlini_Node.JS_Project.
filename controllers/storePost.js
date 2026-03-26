const cloudinary = require('../config/cloudinary');
const Post = require('../models/Post');

module.exports = async (req, res) => {
  try {
    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog_posts', // optional: organize uploads in a folder
        resource_type: 'image',
      });
      imageUrl = result.secure_url;
    }

    // Create new post in database
    await Post.create({
      title: req.body.title,
      content: req.body.content,
      image: imageUrl,
      author: req.session.userId // optional: track author
    });

    req.flash('success', 'Post created successfully!');
    res.redirect('/');
  } catch (err) {
    console.error('Error creating post:', err);
    req.flash('error', 'Could not create post. Please try again.');
    res.redirect('/posts/new');
  }
};
