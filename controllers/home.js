const BlogPost = require('../models/blogPost');

module.exports = async (req, res) => {
    try {
        // Fetch all blog posts and populate the user info
        const blogposts = await BlogPost.find({}).populate('userid').sort({ datePosted: -1 });

        // Render the homepage with the posts
        res.render('index', {
            blogposts,
            loggedIn: req.session.userId || null,
            flashMessages: req.flash()
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};