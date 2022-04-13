const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBookSeriesInput(data) {
    let errors = [];

    data.bookSeries = !isEmpty(data.bookSeries)
        ? data.bookSeries
        : "";

    if (data.bookSeries === "") {
        errors.push("Book Series field is required");
    }

    return {
        errors,
        isValid: (errors.length === 0)
    };
};
