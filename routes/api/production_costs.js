const express = require("express");
const router = express.Router();

const passport = require("passport");

// Production Costs model
const ProductionCosts = require("../../models/ProductionCosts");


// @route   GET api/production-costs/test
// @desc    Tests production costs route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Production Costs route works" }));

// @route   GET api/production-costs
// @desc    Get all production costs
// @access  Private
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};
        return ProductionCosts.getAllProductionCosts()
            .then(data => {
                if (!data && data.length == 0) {
                    errors.nobooks = "There are no production costs";
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

module.exports = router;
