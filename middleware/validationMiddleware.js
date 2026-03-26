// middleware/validationMiddleware.js
module.exports = (req, res, next) => {
    if (!req.files || !req.body.title || req.body.title.trim() === "") {
        req.flash('error', 'Please provide a title and an image for the post.');
        return res.redirect('/posts/new');
    }
    next();
};
