// newPostController.js

module.exports = (req, res) => {
    if (!req.session.userId) {
        // Redirect non-logged-in users to login
        return res.redirect('/auth/login');
    }

    // Render the "create" page for logged-in users
    res.render('create', {
        userId: req.session.userId,
        createPost: true,
        pageTitle: 'Create New Post', // Optional: send a title to use in the template
        errors: [] // Empty array for validation errors if using flash messages
    });
};
