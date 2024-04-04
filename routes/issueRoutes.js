const express = require("express");
const router = express.Router();

// Route handler for rendering the delivery page with purchases and descriptions
router.get("/", (req, res, next) => {
    const contractNumberSelect =
      "SELECT DISTINCT ContractNumber FROM tblPurchase";
  
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
    const purchaseQuery = "SELECT * FROM tblPurchase WHERE ContractNumber = ?";
  
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
    console.log("Received POST request to insertIssueTransaction");
    
    const { insertData } = req.body;
    console.log("Received data for insertion:", insertData);

    const currentDate = new Date().toLocaleDateString(); // Get current date
    console.log("Current date:", currentDate);

    // Prepare the SQL query
    const query = "INSERT INTO tblTransactionHistory (ContractNumber, Panel, Description, Height, Width, Length, Qty, Draw, DateOfTransaction) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)";
    console.log("SQL query:", query);

    // Array to store any errors that occur during insertion
    const insertionErrors = [];

    // Loop through insertData and insert each record into the database
    insertData.forEach(({ contractNumber, panelNumber, description, height, width, length, qty }) => {
        // Validate the data before insertion
        if (contractNumber && panelNumber && description && height && width && length && qty) {
            const values = [contractNumber, panelNumber, description, height, width, length, qty, currentDate];
            console.log("Inserting values:", values);

            // Execute the SQL query
            global.db.run(query, values, function(err) {
                if (err) {
                    insertionErrors.push(err.message); // Store the error message
                    console.error("Error inserting data:", err.message);
                }
            });
        } else {
            insertionErrors.push("Missing data for insertion"); // Store the error message
            console.error("Missing data for insertion");
        }
    });

    if (insertionErrors.length > 0) {
        // If there are any insertion errors, send an error response
        console.error("Insertion errors:", insertionErrors);
        res.status(500).json({ error: "Error inserting data into tblTransactionHistory", details: insertionErrors });
    } else {
        // If insertion is successful, send a success response
        console.log("Data inserted successfully into tblTransactionHistory");
        res.json({ message: "Data inserted successfully into tblTransactionHistory" });
    }
});

module.exports = router;

