// ---------------------- IMPORT MODULES ----------------------
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');

// ---------------------- MIDDLEWARE ----------------------
const validateMiddleWare = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticatedMiddleware');

// ---------------------- CONTROLLERS ----------------------
const homeController = require('./controllers/home');
const newPostController = require('./controllers/newPost');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

// ---------------------- APP SETUP ----------------------
const app = express();
app.set('view engine', 'ejs');
global.loggedIn = null;

// ---------------------- DATABASE ----------------------
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ---------------------- MIDDLEWARE ----------------------
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Session
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'keyboardcat',
    resave: false,
    saveUninitialized: false
}));

// Flash
app.use(flash());

// Make loggedIn and flash messages available to all views
app.use((req, res, next) => {
    global.loggedIn = req.session.userId || null;
    res.locals.flashMessages = req.flash();
    next();
});

// ---------------------- ROUTES ----------------------

// Home page (requires auth)
app.get('/', authMiddleware, homeController);

// Single post page (public)
app.get('/post/:id', getPostController);

// Create post page (requires auth)
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, validateMiddleWare, storePostController);

// Auth routes for guests only
app.get('/auth/register', redirectIfAuthenticated, newUserController);
app.post('/users/register', redirectIfAuthenticated, storeUserController);

app.get('/auth/login', redirectIfAuthenticated, loginController);
app.post('/users/login', redirectIfAuthenticated, loginUserController);

// Logout (requires auth)
app.get('/auth/logout', authMiddleware, logoutController);

// 404 catch-all
app.use((req, res) => res.status(404).render('notfound'));

// ---------------------- SERVER ----------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ App listening on port ${PORT}`));

