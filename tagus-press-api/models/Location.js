const dbConn = require("../services/db");
const db = dbConn.connection;

const getAllLocations = () => {
    return db.query(`SELECT * FROM "Center";`);
}

const getLocationByName = (name) => {
    return db.oneOrNone(`SELECT * FROM "Center" WHERE name = $1`, [name]);
}

module.exports = {
    getAllLocations,
    getLocationByName
};
