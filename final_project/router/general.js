const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({username: username, password: password});
      return res.status(200).json({message: "User successfully registered. Please login."});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } else {
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  })
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const bookList = Object.values(books);
    const filteredBooks = bookList.filter((book) => book.author === author);
    resolve(filteredBooks);
  })
    .then((filteredBooks) => res.send(JSON.stringify(filteredBooks, null, 4)));
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const bookList = Object.values(books);
    const filteredBooks = bookList.filter((book) => book.title === title);
    resolve(filteredBooks);
  })
    .then((filteredBooks) => res.send(JSON.stringify(filteredBooks, null, 4)));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(400).json({message: "Invalid ISBN"});
  }
  return res.send(JSON.stringify(book.reviews,null,4));
});

module.exports.general = public_users;
