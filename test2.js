const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Function to create a new blog post
const createBlogPost = async () => {
  try {
    const blogpost = await BlogPost.create({
      title: 'The Mythbuster’s Guide to Saving Money on Energy Bills',
      desc: 'Once you get past the beginner-level energy-saving stuff, a whole new world of thrifty nerdery opens up. Here are some secrets to copping a load of money off your utilities bills.',
      // author: 'someUserId', // optionally include an ObjectId for the author
    });
    console.log('✅ Blog post created:', blogpost);
  } catch (error) {
    console.error('❌ Error creating blog post:', error);
  } finally {
    mongoose.connection.close(); // Close connection after operation
  }
};

// Call the function
createBlogPost();
