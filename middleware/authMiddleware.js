// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    // If user is NOT logged in, redirect to login page
    if (!req.session || !req.session.userId) {
        return res.redirect('/auth/login');
    }
    next(); // user is logged in, allow access
};