const express = require("express");
const router = express.Router();

router.get("/insert", (req, res, next) => {
  const purchaseQueryInsert = "INSERT INTO tblPurchase (ContractNumber,Description,Height,Width,Length,OrderQty,KgPerLength,PricePerLength)VALUES ('C2402','10 x 10','10','10','4000','5','3.7','710.40');";

  global.db.all(purchaseQueryInsert, (err, rows) => {
    if (err) {
      next(err);
    } else {
      // Render HTML using EJS template
      res.render("purchase", { purchases: rows });
    }
  });
});


router.get("/update", (req, res, next) => {
  console.log(dat)
  const purchaseQueryInsert = "UPDATE tblPurchase SET ContractNumber = 'C2403' WHERE ContractNumber = 'C2402';";

  global.db.all(purchaseQueryInsert, (err, rows) => {
    if (err) {
      next(err);
    } else {
      // Render HTML using EJS template
      res.render("purchase", { purchases: rows });
    }
  });
});


router.get("/purchase", (req, res, next) => {
  const purchaseQuery = "SELECT * FROM tblPurchase";

  global.db.all(purchaseQuery, (err, rows) => {
    if (err) {
      next(err);
    } else {
      // Render HTML using EJS template
      res.render("purchase", { purchases: rows });
    }
  });
});



router.get("/", (req, res, next) => {
      // Render HTML using EJS template
      res.render("index.ejs");

});

module.exports = router;
