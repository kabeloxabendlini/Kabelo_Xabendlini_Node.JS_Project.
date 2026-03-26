const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
    try {
        // Fetch all blog posts and populate the user info
        const blogposts = await BlogPost.find({}).populate('userid');

        // Optional: log the current session for debugging
        console.log('Current session:', req.session);

        // Render the homepage with the posts
        res.render('index', {
            blogposts,
            loggedIn: req.session.userId || null, // send session info to template
            flashMessages: req.flash() // optional: flash messages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
