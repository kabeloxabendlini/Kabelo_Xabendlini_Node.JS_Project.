const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/login');
        }

        // Use await instead of callback
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect('/login');
        }

        // Attach user to request object if needed
        req.user = user;

        next();
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};
