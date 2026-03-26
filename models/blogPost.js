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
        required: false
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: false // not required so posts without images still work
    }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
