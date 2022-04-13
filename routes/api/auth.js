const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/config").jwt;
const passport = require("passport");

// User model
const User = require("../../models/User");
// Auth Service
const AuthService = require("../../services/auth");

// Load input validation
const validateLoginInput = require("../../validations/login");

// @route   GET api/auth/test
// @desc    Tests auth route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Auth works" }));

// @route   POST api/auth/login
// @desc    Login user / Returning JWT
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    console.log("Not valid", errors);
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email or phone
  User.getUser(email).then(user => {
    if (user === null) {
      errors.email = "User not found with given email";
      return res.status(404).json(errors);
    }

    // Check password
    AuthService.comparePasswordHash(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT
        const payload = {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_admin: user.is_admin
        };
        // Sign Token
        return jwt.sign(
          payload,
          jwtConfig.secret,
          { expiresIn: jwtConfig.expiresIn },
          (err, token) => {
            return res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.password = "Incorrect password";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/auth/auth-test
// @desc    Return current user
// @access  Private
router.get(
  "/auth-test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
