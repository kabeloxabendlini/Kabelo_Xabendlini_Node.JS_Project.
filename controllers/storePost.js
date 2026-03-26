const cloudinary = require('../config/cloudinary');
const Post = require('../models/Post');

module.exports = async (req, res) => {
  try {
    let imageUrl = null;

    // Upload image to Cloudinary if provided (using express-fileupload)
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Upload directly from buffer
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'blog_posts', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.data);
      });

      imageUrl = result.secure_url;
    }

    // Create new post in database
    await Post.create({
      title: req.body.title,
      body: req.body.body,
      image: imageUrl,
      userid: req.session.userId
    });

    req.flash('success', 'Post created successfully!');
    res.redirect('/');
  } catch (err) {
    console.error('Error creating post:', err);
    req.flash('error', 'Could not create post. Please try again.');
    res.redirect('/posts/new');
  }
};