const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list using Promise-based approach
public_users.get('/', function (req, res) {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: "No books found" });
        }
    })
    .then((bookList) => res.status(200).json({ books: bookList }))
    .catch((err) => res.status(500).json(err));
});

// Get book list using Async-Await with Axios
public_users.get('/async-books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/'); 
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN using Promise-based approach
public_users.get('/isbn/:isbn', function (req, res) {
    return new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === req.params.isbn);
        book ? resolve(book) : reject({ message: "Book not found" });
    })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on ISBN using Async-Await with Axios
public_users.get('/async-isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found or error fetching data" });
    }
});

// Get book details based on Author using Promise-based approach
public_users.get('/author/:author', function (req, res) {
    return new Promise((resolve, reject) => {
        const filteredBooks = books.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
        filteredBooks.length > 0 ? resolve(filteredBooks) : reject({ message: "No books found for this author" });
    })
    .then((books) => res.status(200).json({ books }))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on Author using Async-Await with Axios
public_users.get('/async-author/:author', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get book details based on Title using Promise-based approach
public_users.get('/title/:title', function (req, res) {
    return new Promise((resolve, reject) => {
        const filteredBooks = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
        filteredBooks.length > 0 ? resolve(filteredBooks) : reject({ message: "No books found with this title" });
    })
    .then((books) => res.status(200).json({ books }))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on Title using Async-Await with Axios
public_users.get('/async-title/:title', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book reviews based on ISBN using async-await
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const book = books.find(b => b.isbn === req.params.isbn);
        if (book) {
            return res.status(200).json({ reviews: book.reviews });
        } else {
            throw new Error("Book not found");
        }
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

module.exports.general = public_users;
