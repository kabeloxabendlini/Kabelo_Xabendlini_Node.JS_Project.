const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;