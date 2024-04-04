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

// Route handler for form submission
router.post("/purchases/:deliveryUpdate", (req, res, next) => {
  let date = new Date().toLocaleDateString();
  const {
    contractNumber,
    descriptionDropdown,
    height,
    width,
    length,
    orderQuantity,
    input,
    kgPerLength,
    pricePerLength,
  } = req.body;
  // console.log('Received form data:', req.body);

  const values = [
    contractNumber,
    descriptionDropdown,
    height,
    width,
    length,
    orderQuantity,
    input,
    date,
    kgPerLength,
    pricePerLength,
  ];
  const query =
    "INSERT INTO tblPurchase (ContractNumber, Description, Height, Width, Length, OrderQty,QtyRecieved,DateReceived, KgPerLength, PricePerLength) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)";

  global.db.run(query, values, function (err) {
    if (err) {
      next(err);
    } else {
      res.json({ message: "Form submitted successfully" }); // Send JSON response
    }
  });
});

module.exports = router;
