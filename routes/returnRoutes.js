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

  module.exports = router;
