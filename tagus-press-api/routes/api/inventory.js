const express = require("express");
const router = express.Router();

const passport = require("passport");

// Inventory model
const Inventory = require("../../models/Inventory");
// Location model
const Location = require("../../models/Location");

// Input Validation
const validateInventoryInput = require("../../validations/inventory");

// @route   GET api/inventory/test
// @desc    Tests Inventory route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Inventory route works" }));

// @route   GET api/inventory
// @desc    Get all Inventory
// @access  Private
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};
        return Inventory.getAllInventory()
            .then(data => {
                if (!data) {
                    errors.noinventory = "There are no inventory";
                    return res.status(404).json(errors);
                }
                return res.json(data);
            })
            .catch(err => {
                console.log(err);
                return res.status(404).json(err);
            });
    }
);

// @route   POST api/inventory
// @desc    Add/Update Inventory
// @access  Private
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateInventoryInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json({errors})
        }

        const bookId = req.body.bookId;
        const location = req.body.location;
        const inventory = req.body.inventory;

        // Get Location
        return Location.getLocationByName(location).then(location => {
            if (location == null) {
                errors.push("Cannot find center with given name");
                return res.status(404).json({errors});
            }

            return Inventory.getInventoryByLocationAndBook(bookId, location.id).then(existingInventory => {
                if (existingInventory == null) {
                    // Add Inventory
                    return Inventory.addInventory(inventory, bookId, location.id).then(() => {
                        return res.json({
                            success: true
                        })
                    })
                }
                // Update Inventory
                return Inventory.updateInventory(inventory, bookId, location.id).then(() => {
                    return res.json({
                        success: true
                    })
                })
            })
        })
    }
);

// @route   POST api/inventory/modify
// @desc    Update Inventory
// @access  Private
router.post(
    "/modify",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = [];

        const inventory = req.body.count;
        const inventoryId = req.body.key;

        // Update inventory
        return Inventory.updateInventoryById(inventory, inventoryId).then(() => {
            return res.json({
                success: true
            });
        });
    }
);

module.exports = router;
