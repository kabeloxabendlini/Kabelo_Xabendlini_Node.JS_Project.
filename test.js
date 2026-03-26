const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const deletePostAndListUsers = async () => {
  try {
    const id = "605d16b1b0e8f94779dacaea";

    // Delete the blog post by ID
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    console.log('Deleted Post:', deletedPost);

    // Fetch all users
    const users = await User.find();
    console.log('Users:', users);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    mongoose.connection.close(); // Ensure the connection is closed
  }
};

deletePostAndListUsers();
