const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1️⃣ Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            req.flash('loginError', 'Invalid username or password');
            return res.redirect('/auth/login');
        }

        // 2️⃣ Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.flash('loginError', 'Invalid username or password');
            return res.redirect('/auth/login');
        }

        // 3️⃣ Login successful — save session
        req.session.userId = user._id;

        req.session.save(err => {
            if (err) {
                console.error(err);
                req.flash('loginError', 'Something went wrong. Please try again.');
                return res.redirect('/auth/login');
            }
            return res.redirect('/'); 
        });

    } catch (error) {
        console.error(error);
        req.flash('loginError', 'Something went wrong. Please try again.');
        return res.redirect('/auth/login');
    }
};
