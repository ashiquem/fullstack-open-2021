const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (sum, currentBlog) => sum + currentBlog.likes

  return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
  blogs.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes))
  const topBlog = blogs[0]

  const blog = {
    title: topBlog.title,
    author: topBlog.author,
    likes: topBlog.likes
  }

  return blog
}

const mostBlogs = (blogs) => {

  const grouped = _.groupBy(blogs,'author')

  const topAuthorBlogs = _.orderBy(grouped,'length',['desc'])[0]

  const result = {
    author: topAuthorBlogs[0].author,
    blogs: topAuthorBlogs.length
  }

  return result
}

const mostLikes = (blogs) => {
  const grouped = _.groupBy(blogs,'author')

  const reducer = (sum, currentBlog) => sum + currentBlog.likes

  const authorLikes = []

  _.forEach(grouped,(value,key) => {
    authorLikes.push({ 'author':key,'likes':value.reduce(reducer,0) })
  })

  return _.orderBy(authorLikes,'likes',['desc'])[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}