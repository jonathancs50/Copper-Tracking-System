const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const purchaseRoutes = require("./routes/purchaseRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());

const sqlite3 = require("sqlite3").verbose();
global.db = new sqlite3.Database("./mainDB.db", function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON");
  }
});


// Use the purchaseRoutes for the / route
app.use("/", purchaseRoutes);

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

