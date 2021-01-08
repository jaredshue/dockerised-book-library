const cors = require("cors");
const express = require("express");
const moment = require("moment");
const users = require("./users.json");
const books = require("./books.json");

const app = express();

const DEFAULT_LISTEN_PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/books", (req, res) => {
    res.json(books);
});

app.get("/api/books/:bookID", (req, res) => {
    res.json(books[Number(req.params.bookID)]);
});

app.get("/api/books/:bookID/checkout/:userID", (req, res) => {
    var book = books[req.params.bookID];

    if (book.isCheckedOut) {
        if (Number(req.params.userID) === book.checkedOutBy) {
            res.json({ "message": "You have already checked out this book" });
            return;
        }
        else {
            res.json({ "message": "Someone else has already checked out this book" });
            return;
        }
    }

    books[req.params.bookID].isCheckedOut = true;
    books[req.params.bookID].checkedOutBy = Number(req.params.userID);
    books[req.params.bookID].dateDue = moment().add(2, "weeks").calendar();

    res.json({ "success": true });
});

app.get("/api/books/:bookID/return", (req, res) => {
  books[req.params.bookID].isCheckedOut = false;
  res.json({ "success": true});
});

app.listen(DEFAULT_LISTEN_PORT, () => {
    console.log(`Server listening on port ${DEFAULT_LISTEN_PORT}!`)
});

module.exports = app;
