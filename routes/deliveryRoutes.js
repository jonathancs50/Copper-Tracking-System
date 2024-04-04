const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {

    // Render HTML using EJS template
    res.render("delivery.ejs");

});

module.exports = router;