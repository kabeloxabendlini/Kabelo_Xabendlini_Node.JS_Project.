module.exports = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/'); // redirect logged-in users to home
    }
    next();
};

