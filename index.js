// ===================== IMPORT MODULES =====================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

// Custom middleware & controllers
const validateMiddleWare = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

const homeController = require('./controllers/home');
const newPostController = require('./controllers/newPost');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');
const multer = require('multer');
const { storage } = require('./config/cloudinary');
const upload = multer({ storage });

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

// Make flash messages available in all templates
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});


// Make current user available in all views
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.userId || null;
    res.locals.flashMessages = req.flash();
    next();
});

// Apply validation middleware only to post storage
app.use('/posts/store', validateMiddleWare);

// ===================== DATABASE =====================
// === MONGODB CONNECTION ===
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // exit if DB fails
});
    
// Start server only after DB is connected
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

// ===================== CLOUDINARY =====================
// === CLOUDINARY CONFIG ===
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ===================== ROUTES =====================
// Home page
app.get('/', homeController);

// Single post page
app.get('/post/:id', getPostController);

// Create post page (protected)
app.get('/posts/new', authMiddleware, newPostController);

// Store post (protected)
app.post('/posts/store', authMiddleware, storePostController);

app.post('/posts/store', upload.single('image'), storePostController);

// Registration routes
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

// Login routes
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

// Logout
app.get('/auth/logout', logoutController);

// 404 Page
app.use((req, res) => res.status(404).render('notfound'));
