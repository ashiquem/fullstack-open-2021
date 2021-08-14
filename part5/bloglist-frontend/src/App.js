import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({ message: "", style: "" });
  const [newAuthor, setNewAuthor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    console.log("logging out user");
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      displayNotification("wrong username or password", "error");
    }
  };

  const displayNotification = (message, style) => {
    console.log(`${message} ${style}`);
    setNotification({
      message: message,
      style: style,
    });
    setTimeout(() => {
      setNotification({
        message: "",
        style: "",
      });
    }, 5000);
  };

  const addBlog = (event) => {
    event.preventDefault();

    const newBlog = {
      author: newAuthor,
      title: newTitle,
      url: newUrl,
    };

    blogService.createBlog(newBlog).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      displayNotification(
        `a new blog ${newTitle} by ${newAuthor} added`,
        "success"
      );
      setNewUrl("");
      setNewAuthor("");
      setNewTitle("");
    });
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type="text"
          name="Title"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          name="Author"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          name="Url"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );

  return (
    <div>
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          <Notification
            message={notification.message}
            status={notification.style}
          ></Notification>
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification
            message={notification.message}
            status={notification.style}
          ></Notification>
          <p>
            {user.name} logged in
            <button onClick={handleLogout} type="submit">
              logout
            </button>
          </p>

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
          <h2>create new blog</h2>
          {blogForm()}
        </div>
      )}
    </div>
  );
};

export default App;
