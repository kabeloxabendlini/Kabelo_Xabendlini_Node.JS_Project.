// ===================== IMPORT MODULES =====================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const path = require('path');

// ===================== MODELS =====================
const User = require('./models/User');
const Post = require('./models/Post');

// ===================== MIDDLEWARE =====================
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticatedMiddleware');
const validatePostMiddleware = require('./middleware/validationMiddleware');

// ===================== CONTROLLERS =====================
const homeController = require('./controllers/home');
const newPostController = require('./controllers/newPost');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

// ===================== APP SETUP =====================
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// ===================== SESSION =====================
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboardcat',
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

// Make session + flash available in all templates
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.userId || null;
    res.locals.flashMessages = req.flash();
    next();
});

// ===================== ROUTES =====================

// Home page
app.get('/', homeController);

// View single post
app.get('/post/:id', getPostController);

// Create new post (protected)
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, validatePostMiddleware, storePostController);

// Registration
app.get('/auth/register', redirectIfAuthenticated, newUserController);
app.post('/users/register', storeUserController); // POST should NOT use redirectIfAuthenticated

// Login
app.get('/auth/login', redirectIfAuthenticated, loginController);
app.post('/users/login', loginUserController); // POST should NOT use redirectIfAuthenticated

// Logout
app.get('/auth/logout', logoutController);

// Test session route (temporary for debugging)
app.get('/test-session', (req, res) => {
    res.send(req.session);
});

// 404 Page
app.use((req, res) => res.status(404).render('notfound'));

// ===================== DATABASE =====================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ===================== SERVER =====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ App listening on port ${PORT}`));
