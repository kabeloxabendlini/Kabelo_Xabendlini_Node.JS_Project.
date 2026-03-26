// middleware/redirectIfAuthenticated.js
module.exports = (req, res, next) => {
    // If user is logged in (session has userId), redirect to home page
    if (req.session && req.session.userId) {
        return res.redirect('/'); // home page
    }
    next(); // allow access if not logged in
};
