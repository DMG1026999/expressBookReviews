const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if username already exists in the users array
    return !users.some(user => user.username === username);
  };
  
  const authenticatedUser = (username, password) => {
    // Check if username and password match an existing user
    return users.some(user => user.username === username && user.password === password);
  };
  
  // Register a new user
  regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  
  // User login
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    // Generate JWT token
    const accessToken = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
  
    return res.status(200).json({ message: "Login successful", token: accessToken });
  });
  
  // Add or modify a book review
  regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(403).json({ message: "Unauthorized: No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, "secret_key");
      const username = decoded.username;
  
      if (!books[isbn]) {
        books[isbn] = { reviews: {} };
      }
  
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  });
  
  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(403).json({ message: "Unauthorized: No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, "secret_key");
      const username = decoded.username;
  
      if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  });
