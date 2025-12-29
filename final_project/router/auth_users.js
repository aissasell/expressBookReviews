const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
users.forEach((user)=>{
    if (user.username === username) {
        return false;
    }
})
return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
user = users.filter((user)=>{
    return user.username === username && user.password === password;
})
return user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if username and password are provided
  if (!username || !password) {
    return res.status(404).json({message: "Invalid username or password."});
  }

  // check if user exists
  if (authenticatedUser(username,password)) {
    // generate access token
    let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({message: "User successfully logged in."});
  } else {
    return res.status(404).json({message: "Invalid username or password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(400).json({message: "Invalid ISBN"});
  }
  book.reviews[req.session.authorization.username] = req.body.review;
  return res.send(JSON.stringify(book,null,4));
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(400).json({message: "Invalid ISBN"});
  }
  delete book.reviews[req.session.authorization.username];
  return res.send(JSON.stringify(book,null,4));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
