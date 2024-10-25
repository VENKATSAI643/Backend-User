const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure path matches your project structure

mongoose.connect('mongodb://localhost:27017/Backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleUsers = [
  {
    username: "alice",
    email: "alice@example.com",
    password: "hashedpassword1", // Replace with a hashed password
    bio: "Loves photography and coding.",
    avatar: "http://example.com/alice.jpg",
    isPrivate: false,
    followers: [],
    following: [],
  },
  {
    username: "bob",
    email: "bob@example.com",
    password: "hashedpassword2",
    bio: "Enjoys hiking and cooking.",
    avatar: "http://example.com/bob.jpg",
    isPrivate: true,
    followers: [],
    following: [],
  },
];

async function seedUsers() {
  try {
    await User.insertMany(sampleUsers);
    console.log('Sample users inserted');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
  }
}

seedUsers();
