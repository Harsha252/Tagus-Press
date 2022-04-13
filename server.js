const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

// Routes
const auth = require("./routes/api/auth");
const users = require("./routes/api/users");
const books = require("./routes/api/books");
const inventory = require("./routes/api/inventory");
const sales = require("./routes/api/sales");
const productionCosts = require("./routes/api/production_costs");
const periodicalCosts = require("./routes/api/periodical_costs");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport.js")(passport);

// Use Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/books", books);
app.use("/api/inventory", inventory);
app.use("/api/sales", sales);
app.use("/api/production-costs", productionCosts);
app.use("/api/periodical-costs", periodicalCosts);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.NODE_PORT   || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
