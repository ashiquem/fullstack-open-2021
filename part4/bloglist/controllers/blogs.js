const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try{
    const result = await blog.save()
    response.status(201).json(result)
  }
  catch(exception)
  {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response) => {

  try{
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  catch(exception)
  {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response) => {

  try{
    const body = request.body

    const blog = {
      title: body.title ,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true, runValidators: true })
    response.json(result)
  }
  catch(exception)
  {
    next(exception)
  }
})

module.exports = blogsRouter