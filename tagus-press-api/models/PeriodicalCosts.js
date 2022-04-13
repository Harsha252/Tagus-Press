const dbConn = require("../services/db");
const db = dbConn.connection;
const _ = require('lodash');

const getAllPeriodicalCosts = () => {
    return db.query(`SELECT p.*, b.name, b.author as author_name FROM "PeriodicalCosts" p LEFT OUTER JOIN "Book" b ON p.book_id = b.id;`).then(allPeriodicalCosts => {
        return allPeriodicalCosts.map(periodicalCosts => {
            let totalCost = 0;
            totalCost += _.get(periodicalCosts, 'first_edition', 0);
            totalCost += _.get(periodicalCosts, 'published', 0);
            totalCost += _.get(periodicalCosts, 'royalty', 0);
            totalCost += _.get(periodicalCosts, 'author_translator_literary', 0);
            periodicalCosts.totalCost = totalCost;
            return periodicalCosts;
        })
    });
}

const getPeriodicalCostByBook = (bookId) => {
    return db.oneOrNone(`SELECT * FROM "PeriodicalCosts" WHERE book_id = $1;`, [bookId]);
}

const addPeriodicalCosts = (firstEdition, published, royalty, authorTranslatorLiterary, bookId) => {
    return db.query(`INSERT INTO "PeriodicalCosts" (book_id, first_edition, published, royalty, author_translator_literary) VALUES ($1, $2, $3, $4, $5);`, [bookId, firstEdition, published, royalty, authorTranslatorLiterary]);
}

const updatePeriodicalCosts = (firstEdition, published, royalty, authorTranslatorLiterary, costId) => {
    return db.query(`UPDATE "PeriodicalCosts" SET first_edition = $1, published = $2, royalty = $3, author_translator_literary = $4, updated_at = now() WHERE id = $5`, [firstEdition, published, royalty, authorTranslatorLiterary, costId]);
}

module.exports = {
    getAllPeriodicalCosts,
    getPeriodicalCostByBook,
    addPeriodicalCosts,
    updatePeriodicalCosts
};
