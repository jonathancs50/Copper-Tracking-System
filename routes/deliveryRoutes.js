const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  // Render HTML using EJS template
  res.render("delivery.ejs");
});
// Route handler for inserting a purchase
// Route handler for fetching purchases and descriptions
router.get("/delivery", (req, res, next) => {
  const purchaseQuerySelect = "SELECT * FROM tblPurchase";
  const descriptionQuerySelect = "SELECT Description FROM tblPriceList";

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

      // Render HTML using EJS template with purchases and descriptions passed to it
      res.render("delivery", {
        purchases: purchases,
        descriptions: descriptions,
      });
    });
  });
});
module.exports = router;
