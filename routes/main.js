const express = require("express");
const router = express.Router();

// Sample route to fetch data from the database
router.get("/data", (req, res) => {
  // Query the database to fetch some data
  req.db.query("SELECT * FROM tblPurchase", (error, result, fields) => {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("Error querying the database");
    } else {
      // Send the fetched data as JSON response

      console.log("Fetched data:", result);
      res.json(result);
    }
  });
});


module.exports = router;
