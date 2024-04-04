// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Import routes
const purchaseRoutes = require("./routes/purchaseRoutes");

// Initialize express app
const app = express();

// Set default port or use environment variable
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For JSON data

// Set EJS as the view engine for rendering views
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));

// Database setup
global.db = new sqlite3.Database("./mainDB.db", function (err) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); // Enable foreign key constraints
  }
});

// Use purchaseRoutes for handling routes starting with "/"
app.use("/", purchaseRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
