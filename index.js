// ===================== IMPORT MODULES =====================
require('dotenv').config();           // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// -------------------- MIDDLEWARE --------------------
const validateMiddleWare = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

// -------------------- CONTROLLERS --------------------
const homeController = require('./controllers/home');
const newPostController = require('./controllers/newPost');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

// -------------------- APP SETUP --------------------
const app = express();
app.set('view engine', 'ejs');
global.loggedIn = null;

// -------------------- DATABASE --------------------
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// -------------------- CLOUDINARY --------------------
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// -------------------- MIDDLEWARE --------------------
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/posts/store', validateMiddleWare);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Track logged-in user globally
app.use('*', (req, res, next) => {
    loggedIn = req.session.userId || null;
    next();
});

// -------------------- ROUTES --------------------
// Home page
app.get('/', homeController);

// Single post page
app.get('/post/:id', getPostController);

// Create post page (protected)
app.get('/posts/new', authMiddleware, newPostController);

// Store post (protected)
app.post('/posts/store', authMiddleware, storePostController);

// Registration routes
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

// Login routes
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

// Logout
app.get('/auth/logout', logoutController);

// 404 Page
app.use((req, res) => res.render('notfound'));

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 4000;   // Use Render-assigned port or 4000 locally
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
