const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Create the user
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        // 3. Registration successful → redirect to login
        return res.redirect('/auth/login');

    } catch (error) {
        console.error(error);

        let validationErrors = [];

        // Mongoose validation errors
        if (error.name === 'ValidationError') {
            validationErrors = Object.keys(error.errors).map(
                key => error.errors[key].message
            );
        }

        // Duplicate key (username/email already exists)
        if (error.code === 11000) {
            validationErrors.push('Username or Email already exists.');
        }

        // Preserve submitted data in flash
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);

        return res.redirect('/auth/register');
    }
};
