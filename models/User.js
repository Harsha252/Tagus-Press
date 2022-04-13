const dbConn = require("../services/db");
const db = dbConn.connection;

// Get user from email or phone number
const getUser = email => {
  let query = 'SELECT * FROM "User" WHERE email = $1;';
  return db.oneOrNone(query, [email]);
};

// Get user by id
const getUserById = id => {
  let query = 'SELECT * FROM "User" WHERE id = $1;';
  return db.one(query, [id]);
};

// Add new user
const addUser = (firstName, lastName, email, password, isAdmin) => {
  return db.query(`INSERT INTO "User" (first_name, last_name, email, username, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`, [firstName, lastName, email, email, password, isAdmin]).catch(console.log);
};

// Update user password
const updateUserPassword = (password, id) => {
  return db.query(`UPDATE "User" SET password = $1, updated_at = now() WHERE id = $2;`, [password, id]);
}

module.exports = {
  getUser,
  getUserById,
  addUser,
  updateUserPassword
};
