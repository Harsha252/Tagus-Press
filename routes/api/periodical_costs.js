const express = require("express");
const router = express.Router();

const passport = require("passport");

// Periodical Costs model
const PeriodicalCosts = require("../../models/PeriodicalCosts");


// @route   GET api/periodical-costs/test
// @desc    Tests periodical costs route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Periodical Costs route works" }));

// @route   GET api/periodical-costs
// @desc    Get all periodical costs
// @access  Private
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};
        return PeriodicalCosts.getAllPeriodicalCosts()
            .then(data => {
                if (!data && data.length == 0) {
                    errors.nobooks = "There are no periodical costs";
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

// @route   POST api/periodical-costs
// @desc    Add periodical costs for a book
// @access  Private
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = [];

        const bookId = req.body.bookId;
        const firstEdition = req.body.first_edition;
        const published = req.body.published;
        const royalty = req.body.royalty;
        const authorTranslatorLiterary = req.body.author_translator_literary;

        return PeriodicalCosts.getPeriodicalCostByBook(bookId).then(existingCost => {
            if (existingCost !== null) {
                errors.push("Periodical Costs for this book already exists! Please update the existing Periodical costs!");
                return res.status(404).json({errors});
            }
            return PeriodicalCosts.addPeriodicalCosts(firstEdition, published, royalty, authorTranslatorLiterary, bookId).then(() => {
                return res.json({
                    success: true
                });
            })
        })
    }
);

// @route   POST api/periodical-costs/modify
// @desc    Update periodical costs for a book
// @access  Private
router.post(
    "/modify",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const costId = req.body.key;
        const firstEdition = req.body.first_edition;
        const published = req.body.published;
        const royalty = req.body.royalty;
        const authorTranslatorLiterary = req.body.author_translator_literary;

        return PeriodicalCosts.updatePeriodicalCosts(firstEdition, published, royalty, authorTranslatorLiterary, costId).then(() => {
            return res.json({
                success: true
            });
        })
    }
);

module.exports = router;
