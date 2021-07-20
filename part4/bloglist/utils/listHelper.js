const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (sum, currentBlog) => sum + currentBlog.likes

  return blogs.reduce(reducer,0)
}

const sumReducer = (array) => {
  const reducer = (sum, current) => sum + current

  return array.reduce(reducer)
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}