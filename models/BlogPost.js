const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now   // FIXED
    },
    image: {
        type: String,        // Cloudinary URL
        required: true
    }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
