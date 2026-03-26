const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            req.flash('loginError', 'Invalid username or password');
            req.flash('data', { username }); // keep username in form
            return res.redirect('/auth/login');
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            req.flash('loginError', 'Invalid username or password');
            req.flash('data', { username });
            return res.redirect('/auth/login');
        }

        // Login successful
        req.session.userId = user._id;

        req.session.save(err => {
            if (err) {
                console.error(err);
                req.flash('loginError', 'Something went wrong. Please try again.');
                return res.redirect('/auth/login');
            }

            // redirect to home page after successful login
            return res.redirect('/');
        });

    } catch (error) {
        console.error(error);
        req.flash('loginError', 'Something went wrong. Please try again.');
        return res.redirect('/auth/login');
    }
};
