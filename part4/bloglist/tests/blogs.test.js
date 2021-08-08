const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];
let authToken;
beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const testUser = await helper.createUser({
    username: 'testuser',
    name: 'test user',
    password: 'testpassword',
  });
  testUser.save();

  const blogs = initialBlogs.map((blog) => helper.createBlog(blog, testUser));
  const blogsPromises = blogs.map((blog) => blog.save());

  await Promise.all(blogsPromises);
  authToken = {
    Authorization: `bearer ${helper.createAuthToken(testUser)}`,
  };
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set(authToken)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('correct number of blogs are returned', async () => {
  const response = await api.get('/api/blogs').set(authToken);

  expect(response.body).toHaveLength(initialBlogs.length);
});

test('blog has id', async () => {
  const response = await api.get('/api/blogs').set(authToken);

  expect(response.body[0].id).toBeDefined();
});

test('a new blog can be created', async () => {
  const testBlog = {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    url: 'https://www.manning.com/books/grokking-algorithms',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .set(authToken)
    .send(testBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs').set(authToken);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
}, 100000);

test('missing like defaults to zero', async () => {
  const testBlog = {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    url: 'https://www.manning.com/books/grokking-algorithms',
  };

  const response = await api.post('/api/blogs').set(authToken).send(testBlog);

  expect(response.body.likes).toBeDefined();
  expect(response.body.likes).toEqual(0);
}, 100000);

test('missing title and url returns bad request', async () => {
  const testBlog = {
    author: 'Aditya Bhargava',
  };

  await api.post('/api/blogs').set(authToken).send(testBlog).expect(400);
}, 100000);

test('new blog creation fails without auth token', async () => {
  const testBlog = {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    url: 'https://www.manning.com/books/grokking-algorithms',
    likes: 10,
  };

  await api.post('/api/blogs').send(testBlog).expect(401);
});

afterAll(() => {
  mongoose.connection.close();
});
