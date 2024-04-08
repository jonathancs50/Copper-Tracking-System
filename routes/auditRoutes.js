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
      res.render("audit", {
        contractNumbers: contractNumbers,
      });
    });
  });

  module.exports = router;