const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');
const User = require('./models/User');

mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true });

const id = "605d16b1b0e8f94779dacaea";

BlogPost.findByIdAndDelete(id)
  .then(result => {
    console.log("Deleted Post:", result);

    return User.find();
  })
  .then(users => {
    console.log("Users:", users);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
