const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBookInput(data) {
    let errors = [];

    data.book = !isEmpty(data.book)
        ? data.book
        : "";

    if (data.book === "") {
        errors.push("Book field is required");
    }

    return {
        errors,
        isValid: (errors.length === 0)
    };
};
