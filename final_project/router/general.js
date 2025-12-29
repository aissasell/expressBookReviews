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
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

  try {
    const response = await axios.get('http://localhost:3000/books');
    const books = response.data;

    res.json(books[isbn]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  if (!author) {
    return res.status(400).json({ message: "Invalid author" });
  }

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    const filteredBooks = books.filter(book => book.author.toLowerCase() === author.toLowerCase());
    res.json(filteredBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data" });
  }
});
  
// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  if (!title) {
    return res.status(400).json({ message: "Invalid title" });
  }

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    const filteredBooks = books.filter(book => book.title.toLowerCase() === title.toLowerCase());
    res.json(filteredBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(400).json({message: "Invalid ISBN"});
  }
  return res.send(JSON.stringify(book.reviews,null,4));
});

module.exports.general = public_users;
