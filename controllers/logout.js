module.exports = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error:', err);
            // Optionally, redirect with an error flash message
            req.flash('error', 'Could not log you out. Please try again.');
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/auth/login'); // Redirect to login page after logout
    });
};
