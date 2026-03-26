const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1️⃣ Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            req.flash('loginError', 'Invalid username or password');
            req.flash('data', { username }); // preserve entered username
            return res.redirect('/auth/login');
        }

        // 2️⃣ Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            req.flash('loginError', 'Invalid username or password');
            req.flash('data', { username });
            return res.redirect('/auth/login');
        }

        // 3️⃣ Successful login — save session
        req.session.userId = user._id;
        req.session.save(err => {
            if (err) {
                console.error(err);
                req.flash('loginError', 'Something went wrong. Please try again.');
                return res.redirect('/auth/login');
            }
            return res.redirect('/'); // redirect to homepage
        });

    } catch (err) {
        console.error(err);
        req.flash('loginError', 'Something went wrong. Please try again.');
        return res.redirect('/auth/login');
    }
};
// const bcrypt = require('bcrypt');
// const User = require('../models/User');

// module.exports = (req, res) => {
//     const {user: username, password: password} = req.body;

//     User.findOne({username:username})
//     .then((user) => {
//         if (user) {
//             bcrypt.compare(password, user.password, (error, same) => {
//                 if(same) {
//                     console.log("User logged in successfully!");
//                     req.session.userId = user._id 
//                     res.redirect('/');
//                 } else { 
//                     console.log("Invalid User login...")
//                     res.redirect('/auth/login');
//                 };
//             });
//         } 
//     })
//     .catch((error) => {
//        res.redirect('/auth/login');
//         console.log("User not found...", error);
        
//     });
//     };