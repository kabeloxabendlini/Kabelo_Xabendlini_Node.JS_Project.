const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            req.flash('loginError', 'Invalid username or password');
            return res.redirect('/auth/login');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            req.flash('loginError', 'Invalid username or password');
            return res.redirect('/auth/login');
        }

        // ✅ Save user ID in session
        req.session.userId = user._id;

        // Optional: log the session to debug
        console.log('Logged in userId:', req.session.userId);

        return res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('loginError', 'Something went wrong.');
        return res.redirect('/auth/login');
    }
};
