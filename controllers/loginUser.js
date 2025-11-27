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

        req.session.userId = user._id;
        req.session.save(err => {
            if (err) {
                req.flash('loginError', 'Something went wrong');
                return res.redirect('/auth/login');
            }
            return res.redirect('/');
        });

    } catch (err) {
        console.error(err);
        req.flash('loginError', 'Something went wrong');
        return res.redirect('/auth/login');
    }
};
