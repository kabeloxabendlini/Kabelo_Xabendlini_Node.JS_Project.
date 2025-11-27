// ===================== IMPORT MODULES =====================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');

// Cloudinary & Multer Upload
const upload = require('./config/multer');

// Middleware
const validateMiddleWare = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

// Controllers
const homeController = require('./controllers/home');
const newPostController = require('./controllers/newPost');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

// Models
const Post = require('./models/Post');


// ===================== APP SETUP =====================
const app = express();
app.set('view engine', 'ejs');


// ===================== MIDDLEWARE =====================
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Make flash + user available everywhere
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.userId || null;
    res.locals.flashMessages = req.flash();
    next();
});

// Apply validation only for storing posts
app.use('/posts/store', validateMiddleWare);


// ===================== CLOUDINARY CONFIG =====================
const cloudinary = require('./config/cloudinary');


// ===================== ROUTES =====================

// Home page
app.get('/', homeController);

// View single post
app.get('/post/:id', getPostController);

// Create post (protected)
app.get('/posts/new', authMiddleware, newPostController);

// ✅ Store post WITH IMAGE UPLOAD (protected)
app.post(
    '/posts/store',
    authMiddleware,
    upload.single('image'),
    storePostController
);

// Registration
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

// Login
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

// Logout
app.get('/auth/logout', logoutController);

// 404 Page
app.use((req, res) => res.status(404).render('notfound'));


// ===================== DATABASE =====================
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ App listening on port ${PORT}`));
