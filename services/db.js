const pgp = require("pg-promise")();
const db = require("../config/config").db;

const connection = pgp(db);

module.exports = { connection, pgp };
