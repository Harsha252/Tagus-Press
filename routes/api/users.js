const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const jwtConfig = require("../../config/config").jwt;

// User model
const User = require("../../models/User");
// Auth Service
const AuthService = require("../../services/auth");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users route works" }));


// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('first_name', 'First Name is required').not().isEmpty(),
    check('last_name', 'Last Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { first_name, last_name, email, password, is_admin } = req.body;
    is_admin = is_admin || false;

    try {
      return User.getUser({ email }).then(user => {
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }

        return AuthService.generatePasswordHash(password).then(passwordHash => {
          return User.addUser(first_name, last_name, email, passwordHash, is_admin).then((newUser) => {
            const payload = {
              id: newUser[0].id,
              email: email,
              first_name: first_name,
              last_name: last_name,
              is_admin: is_admin
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
          })
        })
      })
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/users/update-password
// @desc    Update password of the user
// @access  Public
router.post(
  "/update-password",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
  const errors = [];

  const userId = req.body.user_id;
  const currentPassword = req.body.current_password;
  const newPassword = req.body.new_password;

  // Find user by email or phone
    User.getUserById(userId).then(user => {
    if (user === null) {
      errors.push("User not found");
      return res.status(404).json({errors});
    }

    // Check password
    AuthService.comparePasswordHash(currentPassword, user.password).then(isMatch => {
      if (isMatch) {
        return AuthService.generatePasswordHash(newPassword).then(passwordHash => {
          return User.updateUserPassword(passwordHash, userId).then(() => {
            return res.json({
              success: true
            })
          })
        })
      } else {
        errors.push("Incorrect password");
        return res.status(400).json({errors});
      }
    });
  });
});

module.exports = router;
