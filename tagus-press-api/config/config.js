module.exports = {
  // Server side port
  port: process.env.NODE_PORT || 5000,

  // environment
  environment: process.env.NODE_ENV || "development",

  // db auth
  db: {
    host: process.env.DB_HOST || "suleiman.db.elephantsql.com",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "uhtjfdgk",
    user: process.env.DB_USER || "uhtjfdgk",
    password: process.env.DB_PASSWORD || "P46rqYvnlf-kPQIPxxma69TjHJk2DqMF"
  },

  jwt: {
    secret: process.env.JWT_SECRET || "aaa84ac6-3360-42fb-a79f-f22642f8e2c0",
    expiresIn: 3600 // Expires in one hour // TODO Change this accordingly
  }
};
