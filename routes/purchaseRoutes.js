const express = require("express");
const router = express.Router();



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

// Route handler for inserting a purchase
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
    // console.log('Received form data:', req.body);

    const values = [contractNumber, descriptionDropdown, height, width, length, orderQuantity, kgPerLength, pricePerLength];
    const query = "INSERT INTO tblPurchase (ContractNumber, Description, Height, Width, Length, OrderQty, KgPerLength, PricePerLength) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    

    global.db.run(query, values, function(err) {
        if (err) {
            next(err);
        } else {
            res.json({ message: 'Form submitted successfully' }); // Send JSON response
        }
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

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = router;
