// controllers/createPost.js
module.exports = (req, res) => {
    // Render the create post page
    res.render('createPost', {
        loggedIn: req.session.userId || null,
        flashMessages: req.flash()
    });
};
