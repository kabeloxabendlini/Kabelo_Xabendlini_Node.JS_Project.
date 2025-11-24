require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Controllers
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

// Middleware
const validateMiddleware = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

const app = express();
global.loggedIn = null;

// --------------------
// Cloudinary Config
// --------------------
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --------------------
// MongoDB Connection
// --------------------
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// --------------------
// Middleware
// --------------------
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

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

// --------------------
// View Engine
// --------------------
app.set('view engine', 'ejs');

// --------------------
// Routes
// --------------------
app.get('/', homeController);
app.get('/post/:id', getPostController);
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, validateMiddleware, storePostController);

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/auth/logout', logoutController);

// 404 Page
app.use((req, res) => {
    res.render('notfound');
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
