const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateInventoryInput(data) {
    let errors = [];

    data.bookId = !isEmpty(data.bookId)
        ? data.bookId
        : "";
    data.location = !isEmpty(data.location) ? data.location : "";
    data.inventory = !isEmpty(data.inventory) ? data.inventory : "";

    if (data.bookId === "") {
        errors.push("Book field is required");
    }

    if (Validator.isEmpty(data.location)) {
        errors.push("Location field is required");
    }
    
    if (data.inventory === "") {
        errors.push("Inventory field is required");
    }

    if (data.inventory === 0) {
        errors.push("Inventory should not be 0");
    }

    return {
        errors,
        isValid: (errors.length === 0)
    };
};
