const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to get book details by ISBN asynchronously
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching book:", error.message);
        // Handle or rethrow error as needed
        throw error;
    }
    };

// Example usage: call the function and log the book details
getBookByISBN('1')  // Replace number with a valid ISBN
    .then(book => {
        console.log("Book details:", book);
    })
    .catch(err => {
        console.error("Failed to get book details:", err);
    });





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

// Function to get the list of books from the server asynchronously
const getBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;  // Assuming the server returns the list of books as JSON
    } catch (error) {
        console.error("Error fetching books:", error.message);
        throw error;
    }
};

// Example usage: call the function and log the books
getBooks()
    .then(books => {
        console.log("List of books:", books);
    })
    .catch(err => {
        console.error("Failed to get books:", err);
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
const axios = require('axios');

// Function to get book details by author asynchronously
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;  // Books by the author returned as JSON
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
        throw error;
    }
};

// Example usage: call the function and log the books
getBooksByAuthor('J.K. Rowling')  // Replace with a valid author name
    .then(books => {
        console.log("Books by author:", books);
    })
    .catch(err => {
        console.error("Failed to get books by author:", err);
    });

// Get all books based on title
// Function to get book details by title asynchronously
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;  // Books with the given title returned as JSON
    } catch (error) {
        console.error("Error fetching books by title:", error.message);
        throw error;
    }
};

// Example usage: call the function and log the books
getBooksByTitle('The Great Gatsby')  // Replace with a valid book title
    .then(books => {
        console.log("Books with title:", books);
    })
    .catch(err => {
        console.error("Failed to get books by title:", err);
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
