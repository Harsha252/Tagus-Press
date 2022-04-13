const express = require("express");
const router = express.Router();

const passport = require("passport");

// Books model
const Book = require("../../models/Book");

// Book Series Input Validation
const validateBookSeriesInput = require("../../validations/book-series");
// Book Input Validation
const validateBookInput = require("../../validations/book");

// @route   GET api/books/test
// @desc    Tests books route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Books route works" }));

// @route   GET api/books
// @desc    Get all books
// @access  Private
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};
        return Book.getAllBooks()
            .then(data => {
                if (!data) {
                    errors.nobooks = "There are no books";
                    return res.status(404).json(errors);
                }
                return res.json(data);
            })
            .catch(err => {
                console.log(err);
                return res.status(404).json(err);
            });
    }
);

// @route   GET api/books/series
// @desc    Get all book series
// @access  Private
router.get(
    "/series",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};
        return Book.getAllBookSeries()
            .then(data => {
                if (!data) {
                    errors.nobooks = "There are no book series";
                    return res.status(404).json(errors);
                }
                return res.json(data);
            })
            .catch(err => {
                console.log(err);
                return res.status(404).json(err);
            });
    }
);

// @route   POST api/books/series
// @desc    Add a new book series
// @access  Private
router.post(
    "/series",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateBookSeriesInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json({ errors })
        }

        const series = req.body.bookSeries;
        // Add Book Series
        return Book.addBookSeries(series).then(() => {
            return res.json({
                success: true
            })
        })
    }
);

// @route   POST api/books
// @desc    Add a new Book
// @access  Private
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateBookInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json({ errors })
        }

        const book = req.body.book;
        const seriesId = req.body.seriesId;
        const author = req.body.author;
        const isbn = req.body.isbn;

        // Add book
        return Book.addBook(book, isbn, author, seriesId).then(() => {
            return res.json({
                success: true
            })
        })
    }
);

// @route   POST api/books/modify
// @desc    Update Book
// @access  Private
router.post(
    "/modify",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = [];
        const bookId = req.body.key;
        const book = req.body.name;
        const author = req.body.author;
        const isbn = req.body.isbn;

        // Add book
        return Book.updateBookById(book, isbn, author, bookId).then(() => {
            return res.json({
                success: true
            })
        })
    }
);


module.exports = router;
