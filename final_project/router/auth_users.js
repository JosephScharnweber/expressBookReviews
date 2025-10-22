const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = "access"; // Secret key for JWT signing (may vary in your lab)

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate user credentials
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // User authenticated, create JWT token
    const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });

    // Save token and username in session authorization
    req.session.authorization = {
        accessToken: token,
        username: username
    };

    return res.status(200).json({ message: "User successfully logged in", token: token });
});

// Add a book review
regd_users.put('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required as a query parameter" });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if it doesn't exist
    if (!book.reviews) {
        book.reviews = {};
    }

    // Add or update the review for the user
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "Review by user not found" });
    }

    // Delete the review of the logged-in user only
    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports.regd_users = regd_users;
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
