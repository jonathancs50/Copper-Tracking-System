const express = require("express");
const router = express.Router();

// Route handler for fetching purchases and descriptions for form
router.get("/", (req, res, next) => {
    const purchaseQuerySelect = "SELECT * FROM tblCount";
    const descriptionQuerySelect = "SELECT Description FROM tblPriceList";
    const contractNumberSelect ="SELECT DISTINCT ContractNumber FROM tblTransactionHistory";
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

            global.db.all(contractNumberSelect, (err, contractNumbers) => {
                if (err) {
                  next(err);
                  return;
                }
            
            // Render HTML using EJS template with purchases and descriptions passed to it
            res.render("count", { purchases: purchases, descriptions: descriptions,contractNumbers: contractNumbers });
        });
    });
});
});


//populates the table with contract number
router.get("/purchases/:contractNumber", (req, res, next) => {
    const contractNumber = req.params.contractNumber;
    const purchaseQuery = "SELECT * FROM tblCount WHERE ContractNumber = ?";
  
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

// Route handler for form submission
router.post("/", (req, res, next) => {
  const { contractNumberDropDown:contractNumber,panel, descriptionDropdown, height, width, length,notes } = req.body;

  const values = [contractNumber, panel,descriptionDropdown, height, width, length, notes];
  const query1 = "INSERT INTO tblCount (ContractNumber, Panel,Description, Height, Width, Length,Notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
  // Promise to execute both queries sequentially
  new Promise((resolve, reject) => {
      global.db.run(query1, values, function(err) {
          if (err) {
              reject(err);
          } else {
              resolve(); // Resolve the promise if the first query is successful
          }
      });
  }).then(() => {
      res.json({ message: 'Form submitted successfully' }); // Send JSON response if both queries are successful
  })
  .catch(err => {
      next(err); // Forward any errors to the error handler middleware
  });
});

  module.exports = router;