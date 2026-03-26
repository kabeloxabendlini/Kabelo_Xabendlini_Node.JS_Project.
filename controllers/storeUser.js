const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Success feedback
        req.flash('success', 'Registration successful! You can log in now.');
        return res.redirect('/auth/login');
    } catch (err) {
        console.error(err);

        let validationErrors = [];

        // Mongoose validation errors
        if (err.name === 'ValidationError') {
            validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
        }

        // Duplicate key error (username/email already exists)
        if (err.code === 11000) {
            validationErrors.push('Username or Email already exists.');
        }

        // Store errors and previous form data in flash
        req.flash('validationErrors', validationErrors);
        req.flash('data', { username: req.body.username, email: req.body.email });

        return res.redirect('/auth/register');
    }
};
