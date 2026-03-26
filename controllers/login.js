module.exports = (req, res) => {
    // Retrieve previously entered username from flash (optional)
    let username = "";
    const data = req.flash('data')[0];
    if (typeof data !== "undefined") {
        username = data.username;
    }

    res.render('login', {
        errors: req.flash('loginError'), // any login errors
        username: username
    });
};
