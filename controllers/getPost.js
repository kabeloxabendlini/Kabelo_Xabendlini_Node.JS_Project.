const BlogPost = require('../models/blogPost');

module.exports = async (req, res) => {
    try {
        // Fetch the post by ID and populate the user info
        const blogpost = await BlogPost.findById(req.params.id).populate('userid');

        if (!blogpost) {
            req.flash('error', 'Blog post not found.');
            return res.redirect('/');
        }

        console.log('Fetched post:', blogpost);

        // Render the post page with post data
        res.render('post', {
            blogpost,
            loggedIn: req.session.userId || null,
            flashMessages: req.flash()
        });
    } catch (err) {
        console.error('Error fetching blog post:', err);
        req.flash('error', 'Something went wrong.');
        return res.redirect('/');
    }
};
