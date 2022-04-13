const dbConn = require("../services/db");
const db = dbConn.connection;

const getAllSales = () => {
    return db.query(`SELECT s.id, b.id as book_id, b.name as book, c.name as location, s.amount, s.quantity, s.total_amount, to_char(sale_date, 'MM/DD/YYYY') as sale_date, is_ebook FROM "Sales" s LEFT OUTER JOIN "Book" b ON s.book_id = b.id LEFT OUTER JOIN "Center" c ON s.location_id = c.id ORDER BY s.sale_date DESC, s.updated_at DESC;`);
}

const addSale = (bookId, locationId, quantity, amount, totalAmount, saleDate, isEBook) => {
    return db.query(`INSERT INTO "Sales" (book_id, location_id, quantity, amount, total_amount, sale_date, is_ebook) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [bookId, locationId, quantity, amount, totalAmount, saleDate, isEBook]);
}

const getSaleById = (saleId) => {
    return db.oneOrNone(`SELECT amount, quantity, total_amount FROM "Sales" WHERE id = $1`, [saleId]);
}

const updateSaleById = (amount, quantity, total, saleId) => {
    return db.query(`UPDATE "Sales" SET amount = $1, quantity = $2, total_amount = $3, updated_at = now() WHERE id = $4;`, [amount, quantity, total, saleId]);
}

module.exports = {
    getAllSales,
    addSale,
    getSaleById,
    updateSaleById
};
