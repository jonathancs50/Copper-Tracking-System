const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const purchaseRoutes = require("./routes/purchaseRoutes");
const path = require('path');
const readCsvFile = require('./copperList');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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

// Use the articleRoutes for the /articles route
app.use("/", purchaseRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const filePath = path.join(__dirname, 'assets', 'Copper Price Apr2024.csv');
readCsvFile(filePath)
    .then((dataArray) => {
        console.log(dataArray);
        test(dataArray);
    })
    .catch((error) => {
        console.error('Error reading CSV file:', error);
    });


// Function to access the first piece of data
function test(dataArray) {
  // Check if dataArray is not empty and contains elements
  if (dataArray && dataArray.length > 0) {
      // Access the first element of the array
      const firstData = dataArray[0];
      // Directly access the Description property from firstData
      const description = Object.values(firstData)[0];
      console.log('Description:', description);
      const randsPerMeter = firstData['Rands/m'];
      
      // Print the first piece of data
      console.log('First piece of data:', description, randsPerMeter);
  } else {
      console.log('No data found in the array.');
  }
}










