const dbConn = require("../services/db");
const db = dbConn.connection;

const getAllBooks = () => {
    return db.query(`SELECT b.id, b.name as name, isbn, author, bs.name as series FROM "Book" b LEFT OUTER JOIN "BookSeries" bs ON b.book_series_id = bs.id ORDER BY b.id;`);
}

const addBook = (name, isbn, author, seriesId) => {
    return db.query(`INSERT INTO "Book" (name, isbn, author, book_series_id) VALUES ($1, $2, $3, $4) RETURNING id;`, [name, isbn, author, seriesId]);
    
}

const getAllBookSeries = () => {
    return db.query(`SELECT id, name FROM "BookSeries" ORDER BY id;`);
}

const addBookSeries = (name) => {
    return db.query(`INSERT INTO "BookSeries" (name) VALUES ($1) RETURNING id;`, [name]);
}

const updateBookById = (book, isbn, author, bookId) => {
    return db.query(`UPDATE "Book" SET name = $1, author = $2, isbn = $3, updated_at = now() WHERE id = $4;`, [book, author, isbn, bookId]);
}

module.exports = {
    getAllBooks,
    addBook,
    getAllBookSeries,
    addBookSeries,
    updateBookById
};
