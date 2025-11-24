const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        req.flash('success', 'Registration successful! You can log in now.');
        return res.redirect('/auth/login');
    } catch (err) {
        console.error(err);

        let validationErrors = [];

        if (err.name === 'ValidationError') {
            validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
        }

        if (err.code === 11000) { // duplicate username/email
            validationErrors.push('Username or Email already exists.');
        }

        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);

        return res.redirect('/auth/register');
    }
};
