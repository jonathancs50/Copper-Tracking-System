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

    // Loop through updateData and execute each update query sequentially
    updateData.forEach(({ id, contractNumber, receivedQty }, index) => {
        const query1 = "UPDATE tblPurchase SET QtyReceived = ?, DateReceived = ? WHERE ID = ? AND ContractNumber = ?";
        const query2 = "UPDATE tblStock SET QtyReceived = ?, DateReceived = ? WHERE ID = ? AND ContractNumber = ?";
        const values1 = [receivedQty, currentDate, id, contractNumber];

        // Execute the first update query
        global.db.run(query1, values1, function(err) {
            if (err) {
                console.error("Error updating delivery:", err);
                next(err); // Forward error to error handler
            } else {
                // Execute the second update query after the first one completes
                global.db.run(query2, values1, function(err) {
                    if (err) {
                        console.error("Error updating delivery:", err);
                        next(err); // Forward error to error handler
                    } else {
                        // If this is the last iteration, send success response
                        if (index === updateData.length - 1) {
                            res.json({ message: "Delivery quantities updated successfully" });
                        }
                    }
                });
            }
        });
    });
});

  

module.exports = router;
