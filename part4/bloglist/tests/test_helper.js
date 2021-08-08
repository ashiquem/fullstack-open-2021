const User = require('../models/user');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const createUser = async (user) => {
  return new User({
    username: user.username,
    name: user.name,
    passwordHash: await bcrypt.hash(user.password, 10),
  });
};

const createBlog = (blog, user) => {
  return new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: user._id,
  });
};

const createAuthToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  return jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
};

module.exports = {
  usersInDb,
  createUser,
  createBlog,
  createAuthToken,
};
