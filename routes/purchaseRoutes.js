const express = require("express");
const router = express.Router();


// Route handler for fetching purchases and descriptions
router.get("/purchase", (req, res, next) => {
    const purchaseQuerySelect = "SELECT * FROM tblPurchase";
    const descriptionQuerySelect = "SELECT Description FROM tblPriceList";

    // Fetch purchases
    global.db.all(purchaseQuerySelect, (err, purchases) => {
        if (err) {
            next(err);
            return;
        }
        
        // Fetch descriptions
        global.db.all(descriptionQuerySelect, (err, descriptions) => {
            if (err) {
                next(err);
                return;
            }
            
            // Render HTML using EJS template with purchases and descriptions passed to it
            res.render("purchase", { purchases: purchases, descriptions: descriptions });
        });
    });
});

// Route handler for form submission
router.post("/purchase", (req, res, next) => {
    const { contractNumber, descriptionDropdown, height, width, length, orderQuantity, kgPerLength, pricePerLength } = req.body;

    const values = [contractNumber, descriptionDropdown, height, width, length, orderQuantity, kgPerLength, pricePerLength];
    const query1 = "INSERT INTO tblPurchase (ContractNumber, Description, Height, Width, Length, OrderQty, KgPerLength, PricePerLength) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const query2 = "INSERT INTO tblStock (ContractNumber, Description, Height, Width, Length, OrderQty, KgPerLength, PricePerLength) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const query3 = "INSERT INTO tbStock (PurchaseID) VALUES (SELECT ID FROM tblPurchases WHERE "
    // Promise to execute both queries sequentially
    new Promise((resolve, reject) => {
        global.db.run(query1, values, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(); // Resolve the promise if the first query is successful
            }
        });
    })
    .then(() => {
        // Execute the second query after the first one succeeds
        return new Promise((resolve, reject) => {
            global.db.run(query2, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(); // Resolve the promise if the second query is successful
                }
            });
        });
    })
    .then(() => {
        res.json({ message: 'Form submitted successfully' }); // Send JSON response if both queries are successful
    })
    .catch(err => {
        next(err); // Forward any errors to the error handler middleware
    });
});

router.get("/", (req, res, next) => {

          // Render HTML using EJS template
          res.render("index.ejs");

});

router.get("/details/:description", (req, res, next) => {
    const description = req.params.description;
    const query = "SELECT Height, Width, Length, KgPerLength, PricePerLength FROM tblPriceList WHERE Description = ?";

    global.db.get(query, [description], (err, row) => {
        if (err) {
            next(err);
        } else {
            // console.log(row); // Log the retrieved row
            res.json(row);
        }
    });
});

// Route handler for deleting a row
router.delete('/delete/:id', (req, res, next) => {
    const idToDelete = req.params.id;
    const query1 = "DELETE FROM tblPurchase WHERE ID = ?";
    const query2 = "DELETE FROM tblStock WHERE ID = ?";

    // Promise to execute both queries sequentially
    new Promise((resolve, reject) => {
        global.db.run(query1, [idToDelete], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(); // Resolve the promise if the first query is successful
            }
        });
    })
    .then(() => {
        // Execute the second query after the first one succeeds
        return new Promise((resolve, reject) => {
            global.db.run(query2, [idToDelete], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(); // Resolve the promise if the second query is successful
                }
            });
        });
    })
    .then(() => {
        res.json({ message: 'Row deleted successfully' }); // Send JSON response if both queries are successful
    })
    .catch(err => {
        next(err); // Forward any errors to the error handler middleware
    });
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = router;
