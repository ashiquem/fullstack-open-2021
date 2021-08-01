const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;

  try {
    const user = request.user;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'invalid user' });
    }

    await blog.delete();
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body;
    const user = request.user;

    const blogToUpdate = await Blog.findById(request.params.id);

    if (blogToUpdate.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'invalid user' });
    }

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
    });
    response.json(result);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
