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
    res.render("delivery", {
      contractNumbers: contractNumbers,
    });
  });
});

// Route handler for fetching purchases based on contract number
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

router.post("/updateDelivery", (req, res, next) => {
    const { updateData } = req.body;
    const currentDate = new Date().toLocaleDateString(); // Get current date
  
    // Loop through updateData and update delivery quantities in the database
    updateData.forEach(({ id, contractNumber, deliveryQty }) => {
      const query = "UPDATE tblPurchase SET QtyReceived = ?, DateReceived = ? WHERE ID = ? AND ContractNumber = ?";
      const values = [deliveryQty, currentDate, id, contractNumber];
  
      global.db.run(query, values, function(err) {
        if (err) {
          console.error("Error updating delivery:", err);
        }
      });
    });
  
    res.json({ message: "Delivery quantities updated successfully" });
  });
  

module.exports = router;
