const dbConn = require("../services/db");
const db = dbConn.connection;
const _ = require('lodash');

const getAllProductionCosts = () => {
    return db.query(`SELECT p.*, b.name, b.author as author_name FROM "ProductionCosts" p LEFT OUTER JOIN "Book" b ON p.book_id = b.id;`).then(allProductionCosts => {
        return allProductionCosts.map(productionCosts => {
            let totalCost = 0;
            totalCost += _.get(productionCosts, 'translation', 0);
            totalCost += _.get(productionCosts, 'copy_editing', 0);
            totalCost += _.get(productionCosts, 'type_setting', 0);
            totalCost += _.get(productionCosts, 'design_production', 0);
            totalCost += _.get(productionCosts, 'cover', 0);
            totalCost += _.get(productionCosts, 'printing', 0);
            totalCost += _.get(productionCosts, 'publishing_fees', 0);
            totalCost += _.get(productionCosts, 'shipping', 0);
            totalCost += _.get(productionCosts, 'promotion', 0);
            totalCost += _.get(productionCosts, 'events', 0);
            totalCost += _.get(productionCosts, 'mailing', 0);
            totalCost += _.get(productionCosts, 'author', 0);
            totalCost += _.get(productionCosts, 'image_rights', 0);
            totalCost += _.get(productionCosts, 'free_copies_umass', 0);
            totalCost += _.get(productionCosts, 'free_copies_center', 0);
            totalCost += _.get(productionCosts, 'other', 0);
            totalCost += _.get(productionCosts, 'book_price_entry_fee', 0);
            totalCost += _.get(productionCosts, 'copyright_registration_fee', 0);
            productionCosts.totalCost = totalCost;
            return productionCosts;
        })
    });
}


module.exports = {
    getAllProductionCosts
};
