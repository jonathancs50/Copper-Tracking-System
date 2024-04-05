const express = require("express");
const router = express.Router();

// Route handler for rendering the delivery page with purchases and descriptions
router.get("/", (req, res, next) => {
    const contractNumberSelect =
      "SELECT DISTINCT ContractNumber FROM tblTransactionHistory";
  
    // Fetch purchases
    global.db.all(contractNumberSelect, (err, contractNumbers) => {
      if (err) {
        next(err);
        return;
      }
  
      // Render HTML using EJS template with purchases and descriptions passed to it
      res.render("return", {
        contractNumbers: contractNumbers,
      });
    });
  });

  // Route handler for fetching purchases based on contract number
router.get("/transactions/:contractNumber", (req, res, next) => {
  const contractNumber = req.params.contractNumber;
  const purchaseQuery = "SELECT * FROM tblTransactionHistory WHERE ContractNumber = ? AND Draw = 1";

  // Fetch purchases for the specified contract number
  global.db.all(purchaseQuery, [contractNumber], (err, purchases) => {
    if (err) {
      next(err);
      return;
    }

    // Send the fetched purchases as JSON response
    res.json(purchases);
    // console.log(purchases);
  });
});

router.get("/id/:selectedValue", (req, res, next) => {
  const id = req.params.selectedValue;
  const purchaseQuery = "SELECT * FROM tblTransactionHistory WHERE ID = ? AND Draw = 1";

  // Fetch purchases for the specified contract number
  global.db.all(purchaseQuery, [id], (err, row) => {
    if (err) {
      next(err);
      return;
    }

    // Send the fetched purchases as JSON response
    res.json(row);
  });
});

router.post("/insertReturnTransaction", (req, res, next) => {
  const { sendingData } = req.body;
  const currentDate = new Date().toLocaleDateString();
  console.log(sendingData);

  // Prepare the SQL queries
  const query1 = "INSERT INTO tblTransactionHistory (ContractNumber, Panel, Description, Height, Width, Length, Qty, Return, DateOfTransaction) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)";
  const query2 = "INSERT INTO tblReturns (Description, Height, Width, Length, QtyReturned, DateReturned) VALUES ( ?, ?, ?, ?, ?, ?)";


  // Array to store any errors that occur during insertion
  const insertionErrors = [];

  // Loop through sendingData and insert/update records
  sendingData.forEach(({ contractNumber, panelNumber, description, height, width, length, qty }) => {
      // Validate the data before insertion
      if (contractNumber && panelNumber && description && height && width && length && qty) {
          const values1 = [contractNumber, panelNumber, description, height, width, length, qty, currentDate];
          const values2 = [description, height,width,length,qty,currentDate];

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
  } 
  // else {
  //     res.json({ message: "Data inserted successfully into tblTransactionHistory and tblStock" });
  // }
});

  module.exports = router;
