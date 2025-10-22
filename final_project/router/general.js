const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Assuming 'books' is an object containing all book details
    res.send(JSON.stringify(books, null, 4)); // Neatly formatted JSON output
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Retrieve ISBN from request parameters
    const book = books[isbn];      // Assuming 'books' is an object with ISBN as keys

    if (book) {
        res.send(JSON.stringify(book, null, 4)); // Send book details formatted as JSON
    } else {
        res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;  // Get author name from URL parameter
    const booksByAuthor = [];

    // Get all ISBN keys from the books object
    const bookKeys = Object.keys(books);

    // Iterate through each book and check if author matches
    bookKeys.forEach((isbn) => {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    });

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4)); // Send matched books as formatted JSON
    } else {
        res.status(404).json({ message: "No books found by the given author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;  // Get title from URL parameter
    const booksByTitle = [];

    // Get all ISBN keys from the books object
    const bookKeys = Object.keys(books);

    // Iterate through each book and check if title matches
    bookKeys.forEach((isbn) => {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    });

    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle, null, 4)); // Send matched books as formatted JSON
    } else {
        res.status(404).json({ message: "No books found with the given title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get ISBN from request parameters
    const book = books[isbn];      // Retrieve the book object using ISBN

    if (book && book.reviews) {
        res.send(JSON.stringify(book.reviews, null, 4)); // Send reviews formatted as JSON
    } else if (book) {
        res.send(JSON.stringify({ message: "No reviews found for this book" }, null, 4));
    } else {
        res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

module.exports.general = public_users;
