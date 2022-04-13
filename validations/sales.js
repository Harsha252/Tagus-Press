const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateInventoryInput(data) {
    let errors = [];

    data.bookId = !isEmpty(data.bookId)
        ? data.bookId
        : "";
    data.location = !isEmpty(data.location) ? data.location : "";
    data.price = !isEmpty(data.price) ? data.price : "";
    data.quantity = !isEmpty(data.quantity) ? data.quantity : "";
    data.total = !isEmpty(data.total) ? data.total : "";

    if (data.bookId === "") {
        errors.push("Book field is required");
    }

    if (Validator.isEmpty(data.location)) {
        errors.push("Location field is required");
    }

    if (data.price === "") {
        errors.push("Price field is required");
    }

    if (data.quantity === "") {
        errors.push("Quantity field is required");
    }

    if (data.quantity === 0) {
        errors.push("Quantity should not be 0");
    }

    if (data.total === "") {
        errors.push("Total Amount field is required");
    }

    return {
        errors,
        isValid: (errors.length === 0)
    };
};
