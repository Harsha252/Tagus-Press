const dbConn = require("../services/db");
const db = dbConn.connection;

const getAllInventory = () => {
    return db.query(`SELECT i.id, b.name as book, b.author, c.name as location, i.count FROM "Inventory" i LEFT OUTER JOIN "Book" b ON i.book_id = b.id LEFT OUTER JOIN "Center" c ON i.location_id = c.id ORDER BY i.updated_at DESC`);
}

const getInventoryByLocationAndBook = (bookId, locationId) => {
    return db.oneOrNone(`SELECT * FROM "Inventory" WHERE book_id = $1 AND location_id = $2;`, [bookId, locationId]);
}

const updateInventory = (inventory, bookId, locationId) => {
    return db.query(`UPDATE "Inventory" SET count = count + $1, updated_at = now() WHERE book_id = $2 AND location_id = $3`, [inventory, bookId, locationId]);
}

const updateInventoryById = (inventory, inventoryId) => {
    return db.query(`UPDATE "Inventory" SET count = $1, updated_at = now() WHERE id = $2;`, [inventory, inventoryId]);
}

const addInventory = (inventory, bookId, locationId) => {
    return db.query(`INSERT INTO "Inventory" (book_id, location_id, count) VALUES ($1, $2, $3)`, [bookId, locationId, inventory]);
}


module.exports = {
    getAllInventory,
    getInventoryByLocationAndBook,
    updateInventory,
    updateInventoryById,
    addInventory
};
