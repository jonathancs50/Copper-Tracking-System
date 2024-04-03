const express = require("express");
const router = express.Router();

// Import the readCsvFile function
const readCsvFile = require('../copperList');

// Read the CSV file and process its data
const path = require('path');
const filePath = path.join(__dirname, '..', 'assets', 'Copper Price Apr2024.csv');

readCsvFile(filePath)
    .then((dataArray) => {
        // Route handler for rendering the purchase page
        router.get("/purchase", (req, res, next) => {
            const purchaseQuery = "SELECT * FROM tblPurchase";
        
            global.db.all(purchaseQuery, (err, rows) => {
                if (err) {
                    next(err);
                } else {
                    // Render HTML using EJS template
                    res.render("purchase", { purchases: rows, dataArray: dataArray });
                }
            });
        });
    })
    .catch((error) => {
        console.error('Error reading CSV file:', error);
    });

// Route handler for inserting a purchase
router.get("/insert", (req, res, next) => {
    const purchaseQueryInsert = "INSERT INTO tblPurchase (ContractNumber,Description,Height,Width,Length,OrderQty,KgPerLength,PricePerLength)VALUES ('C2402','10 x 10','10','10','4000','5','3.7','710.40');";

    global.db.all(purchaseQueryInsert, (err, rows) => {
        if (err) {
            next(err);
        } else {
            // Render HTML using EJS template
            res.render("purchase", { purchases: rows });
        }
    });
});

// Route handler for updating a purchase
router.get("/update", (req, res, next) => {
    const purchaseQueryInsert = "UPDATE tblPurchase SET ContractNumber = 'C2403' WHERE ContractNumber = 'C2402';";

    global.db.all(purchaseQueryInsert, (err, rows) => {
        if (err) {
            next(err);
        } else {
            // Render HTML using EJS template
            res.render("purchase", { purchases: rows });
        }
    });
});

router.get("/", (req, res, next) => {

          // Render HTML using EJS template
          res.render("index.ejs");

});

module.exports = router;
