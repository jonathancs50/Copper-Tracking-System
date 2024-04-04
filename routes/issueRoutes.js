const express = require("express");
const router = express.Router();

// Route handler for rendering the delivery page with purchases and descriptions
router.get("/", (req, res, next) => {
    const contractNumberSelect =
      "SELECT DISTINCT ContractNumber FROM tblStock";
  
    // Fetch purchases
    global.db.all(contractNumberSelect, (err, contractNumbers) => {
      if (err) {
        next(err);
        return;
      }
  
      // Render HTML using EJS template with purchases and descriptions passed to it
      res.render("issue", {
        contractNumbers: contractNumbers,
      });
    });
  });


router.get("/purchases/:contractNumber", (req, res, next) => {
    const contractNumber = req.params.contractNumber;
    const purchaseQuery = "SELECT * FROM tblStock WHERE ContractNumber = ?";
  
    // Fetch purchases for the specified contract number
    global.db.all(purchaseQuery, [contractNumber], (err, purchases) => {
      if (err) {
        next(err);
        return;
      }
  
      // Send the fetched purchases as JSON response

      res.json(purchases);
    });
  });


  router.post("/insertIssueTransaction", (req, res, next) => {
    const { insertData } = req.body;
    const currentDate = new Date().toLocaleDateString();

    // Prepare the SQL queries
    const query1 = "INSERT INTO tblTransactionHistory (ContractNumber, Panel, Description, Height, Width, Length, Qty, Draw, DateOfTransaction) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)";
    const query2 = "UPDATE tblStock SET QtyReceived = QtyReceived - ? WHERE ContractNumber = ? AND Description = ?";

    // Array to store any errors that occur during insertion
    const insertionErrors = [];

    // Loop through insertData and insert/update records
    insertData.forEach(({ contractNumber, panelNumber, description, height, width, length, qty }) => {
        // Validate the data before insertion
        if (contractNumber && panelNumber && description && height && width && length && qty) {
            const values1 = [contractNumber, panelNumber, description, height, width, length, qty, currentDate];
            const values2 = [qty, contractNumber, description];

            // Execute the SQL queries
            global.db.run(query1, values1, function(err) {
                if (err) {
                    insertionErrors.push(err.message);
                    console.error("Error inserting data into tblTransactionHistory:", err.message);
                }
            });

            global.db.run(query2, values2, function(err) {
                if (err) {
                    insertionErrors.push(err.message);
                    console.error("Error updating QtyReceived in tblStock:", err.message);
                }
            });
        } else {
            insertionErrors.push("Missing data for insertion");
            console.error("Missing data for insertion");
        }
    });

    // Send response based on insertion status
    if (insertionErrors.length > 0) {
        console.error("Insertion errors:", insertionErrors);
        res.status(500).json({ error: "Error inserting data", details: insertionErrors });
    } else {
        res.json({ message: "Data inserted successfully into tblTransactionHistory and tblStock" });
    }
});


// Define the route to fetch quantity in stock
router.get('/qtyInStock', (req, res, next) => {
    const { contractNumber, description } = req.query;
    const values = [contractNumber, description];
    console.log(values);
    const purchaseQuery = "SELECT QtyReceived FROM tblStock WHERE ContractNumber = ? AND Description = ?;";
  
    // Fetch quantity in stock for the specified contract number and description
    global.db.all(purchaseQuery, values, function(err, rows) {
        if (err) {
            next(err);
            return;
        }
        res.json(rows);
        console.log(rows); // Send the quantity in stock as JSON response
    });
});


module.exports = router;

