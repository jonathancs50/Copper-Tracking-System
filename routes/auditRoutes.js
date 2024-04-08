const express = require("express");
const router = express.Router();

// Route handler for rendering the delivery page with purchases and descriptions
router.get("/", (req, res, next) => {
    const contractNumberSelect =
      "SELECT DISTINCT ContractNumber FROM tblCount";
  
    // Fetch purchases
    global.db.all(contractNumberSelect, (err, contractNumbers) => {
      if (err) {
        next(err);
        return;
      }
  
      // Render HTML using EJS template with purchases and descriptions passed to it
      res.render("audit", {
        contractNumbers: contractNumbers,
      });
    });
  });


  // Route handler for fetching purchases based on contract number
router.get("/purchases/:contractNumber", (req, res, next) => {
    const contractNumber = req.params.contractNumber;
    const purchaseQuery = "SELECT TH.ContractNumber, TH.Panel, TH.Description, TH.Height, TH.Width, ((SUM(CASE WHEN TH.Draw = 1 THEN TH.Qty * TH.length ELSE 0 END) - SUM(CASE WHEN TH.Return = 1 THEN TH.Qty * TH.length ELSE 0 END))) AS Transaction_Length, COALESCE(CI.Length, 0) AS Count_Length, (((SUM(CASE WHEN TH.Draw = 1 THEN TH.Qty * TH.length ELSE 0 END) - SUM(CASE WHEN TH.Return = 1 THEN TH.Qty * TH.length ELSE 0 END))) - COALESCE(CI.Length, 0)) AS Length_Difference FROM tblTransactionHistory TH LEFT JOIN (SELECT Panel, Description, SUM(Length) AS Length FROM tblCount WHERE ContractNumber = ? GROUP BY Panel, Description) AS CI ON TH.Panel = CI.Panel AND TH.Description = CI.Description WHERE TH.ContractNumber IN (?) GROUP BY TH.Panel, TH.Description, TH.Height, TH.Width, CI.Length;";
  
    // Fetch purchases for the specified contract number
    global.db.all(purchaseQuery, [contractNumber,contractNumber], (err, purchases) => {
      if (err) {
        next(err);
        return;
      }
  
      // Send the fetched purchases as JSON response
      res.json(purchases);
    });
  });

  module.exports = router;


