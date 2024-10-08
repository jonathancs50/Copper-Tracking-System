const express = require("express");
const router = express.Router();

// Route handler for rendering the delivery page with purchases and descriptions
router.get("/", (req, res, next) => {
  const contractNumberSelect =
    "SELECT DISTINCT ContractNumber FROM tblStock ORDER BY ContractNumber DESC;";

  // Fetch purchases
  global.db.all(contractNumberSelect, (err, contractNumbers) => {
    if (err) {
      next(err);
      return;
    }

    // Render HTML using EJS template with purchases and descriptions passed to it
    res.render("issue", {
      contractNumbers: contractNumbers,
    });
  });
});

router.get("/purchases/:contractNumber", (req, res, next) => {
  const contractNumber = req.params.contractNumber;
  const purchaseQuery = "SELECT * FROM tblStock WHERE ContractNumber = ?";

  // "SELECT s.ID, s.ContractNumber, s.Description, s.Height, s.Width, s.Length, s.OrderQty - COALESCE(th.TotalDrawnQty, 0) AS RemainingQty, s.QtyReceived, s.DateReceived, s.KgPerLength, s.PricePerLength, s.PricePerKg, s.TotalLengthOrdered FROM tblStock s LEFT JOIN (SELECT ContractNumber,Description,SUM(Qty) AS TotalDrawnQty FROM tblTransactionHistory WHERE Draw = 1 GROUP BY ContractNumber, Description) AS th ON s.ContractNumber = th.ContractNumber AND s.Description = th.Description WHERE s.ID = '19';"

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

router.get("/purchasesStores", (req, res, next) => {
  const purchaseQuery = "SELECT * FROM tblReturns WHERE QtyReturned > 0 AND ContractNumber = 'Stores';";

  // Fetch purchases for the specified contract number
  global.db.all(purchaseQuery, (err, purchases) => {
    if (err) {
      next(err);
      return;
    }

    // Send the fetched purchases as JSON response

    res.json(purchases);
  });
});

router.get("/purchasesOffcuts", (req, res, next) => {
  const purchaseQuery = "SELECT * FROM tblReturns WHERE QtyReturned > 0 AND ContractNumber = 'Offcuts';";

  // Fetch purchases for the specified contract number
  global.db.all(purchaseQuery, (err, purchases) => {
    if (err) {
      next(err);
      return;
    }

    // Send the fetched purchases as JSON response

    res.json(purchases);
  });
});

router.get("/purchasesUsed", (req, res, next) => {
  const purchaseQuery = "SELECT * FROM tblReturns WHERE QtyReturned > 0 AND ContractNumber = 'Used';";

  // Fetch purchases for the specified contract number
  global.db.all(purchaseQuery, (err, purchases) => {
    if (err) {
      next(err);
      return;
    }

    // Send the fetched purchases as JSON response

    res.json(purchases);
  });
});

router.get("/correctedQty/:id", (req, res, next) => {
  const id = req.params.id;
  const purchaseQuery = "SELECT s.ID, s.ContractNumber, s.Description, s.Height, s.Width, s.Length, (SELECT COALESCE(SUM(p.QtyReceived), 0) FROM tblPurchase p WHERE p.ContractNumber = s.ContractNumber AND p.Description = s.Description AND p.Length = s.Length) AS TotalQtyReceived, (SELECT COALESCE(SUM(th.Qty), 0) FROM tblTransactionHistory th WHERE th.ContractNumber = s.ContractNumber AND th.Description = s.Description AND th.Length = s.Length AND th.Draw = 1 AND th.DrawnFrom <> 'Stores') AS TotalTransactions, COALESCE((SELECT SUM(p.QtyReceived) FROM tblPurchase p WHERE p.ContractNumber = s.ContractNumber AND p.Description = s.Description AND p.Length = s.Length), 0) - COALESCE((SELECT SUM(th.Qty) FROM tblTransactionHistory th WHERE th.ContractNumber = s.ContractNumber AND th.Description = s.Description AND th.Length = s.Length AND th.Draw = 1 AND th.DrawnFrom <> 'Stores'), 0) AS RemainingQty, (SELECT COALESCE(SUM(p.QtyReceived), 0) FROM tblPurchase p WHERE p.ContractNumber = s.ContractNumber AND p.Description = s.Description AND p.Length = s.Length) * s.Length AS TotalLengthOrdered FROM tblStock s WHERE s.ID = ?;";



// "SELECT s.ID, s.ContractNumber, s.Description, s.Height, s.Width, s.Length, s.OrderQty, p.QtyReceived, s.DateReceived, s.KgPerLength, s.PricePerLength, s.PricePerKg, s.TotalLengthOrdered, (p.QtyReceived - COALESCE((SELECT SUM(th.Qty) FROM tblTransactionHistory th WHERE th.ContractNumber = s.ContractNumber AND th.Length = s.Length AND th.Description = s.Description AND th.Draw = 1 AND th.DrawnFrom<>'Stores'), 0)) AS RemainingQty FROM tblStock s JOIN tblPurchase p ON s.ID = p.ID WHERE s.ID = ?;"

  //SELECT s.ID, s.ContractNumber, s.Description, s.Height, s.Width, s.Length, s.OrderQty, p.QtyReceived, s.DateReceived, s.KgPerLength, s.PricePerLength, s.PricePerKg, s.TotalLengthOrdered, (p.QtyReceived - COALESCE((SELECT SUM(th.Qty) FROM tblTransactionHistory th WHERE th.ContractNumber = s.ContractNumber AND th.Length = s.Length AND th.Description = s.Description AND th.Draw = 1), 0)) AS RemainingQty FROM tblStock s JOIN tblPurchase p ON s.ID = p.ID WHERE s.ID = ?;

// "SELECT s.ID,s.ContractNumber,s.Description,s.Height,s.Width,s.Length,COALESCE(s.OrderQty - COALESCE(th.TotalDrawnQty, s.QtyReceived), s.QtyReceived) AS RemainingQty,s.QtyReceived,s.DateReceived,s.KgPerLength,s.PricePerLength,s.PricePerKg,s.TotalLengthOrdered FROM tblStock s LEFT JOIN (SELECT ContractNumber,Description,SUM(Qty) AS TotalDrawnQty FROM     tblTransactionHistory WHERE Draw = 1 GROUP BY ContractNumber, Description) AS th ON s.ContractNumber = th.ContractNumber AND s.Description = th.Description WHERE s.ID = '31';"

// "SELECT ID,ContractNumber,Description,Height,Width,Length,OrderQty,QtyReceived,DateReceived,KgPerLength,PricePerLength,PricePerKg,TotalLengthOrdered,(QtyReceived - COALESCE((SELECT SUM(th.ty) FROM tblTransactionHistory th WHERE th.ContractNumber = s.ContractNumber AND th.Description = s.Description), 0)) AS RemainingQty FROM tblStock s WHERE ID = ?;"

// "SELECT ID,ContractNumber,Description,Height,Width,Length,OrderQty,p.QtyReceived,DateReceived,KgPerLength,PricePerLength,PricePerKg,TotalLengthOrdered,(p.QtyReceived - COALESCE((SELECT SUM(th.Qty) FROM tblTransactionHistory th WHERE th.ContractNumber = s.ContractNumber AND th.Description = s.Description), 0)) AS RemainingQty FROM tblStock s JOIN tblPurchase p ON s.ID = p.ID WHERE s.ID = '31';"

// "SELECT s.ID, s.ContractNumber, s.Description, s.Height, s.Width, s.Length, s.OrderQty, p.QtyReceived, s.DateReceived, s.KgPerLength, s.PricePerLength, s.PricePerKg, s.TotalLengthOrdered, (p.QtyReceived - COALESCE((SELECT SUM(th.Qty) FROM tblTransactionHistory th WHERE th.ContractNumber = s.ContractNumber AND th.Description = s.Description AND th.Draw = 1), 0)) AS RemainingQty FROM tblStock s JOIN tblPurchase p ON s.ID = p.ID WHERE s.ID = ?;"

  // Fetch purchases for the specified contract number
  global.db.all(purchaseQuery, [id], (err, purchases) => {
    if (err) {
      next(err);
      return;
    }

    // Send the fetched purchases as JSON response
    res.json(purchases);
  });
});

router.post("/insertIssueTransaction", (req, res, next) => {
  const { insertData } = req.body;
  const currentDate = new Date().toLocaleDateString();
console.log(insertData);
  // Prepare the SQL queries
  const query1 =
    "INSERT INTO tblTransactionHistory (ContractNumber, Panel, Description, Height, Width, Length, Qty, Draw, DateOfTransaction,DrawnFrom) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?,?)";
  const query2 =
    "UPDATE tblStock SET QtyReceived = QtyReceived - ? WHERE ContractNumber = ? AND Description = ?";
  const query3 =
    "UPDATE tblReturns SET QtyReturned = QtyReturned - ? WHERE ID=?";

  // Array to store any errors that occur during insertion
  const insertionErrors = [];

  // Loop through insertData and insert/update records
  insertData.forEach(
    ({
      selectedContractNumber,
      contractNumber,
      panelNumber,
      description,
      height,
      width,
      length,
      qty,
      id,
    }) => {
      // Validate the data before insertion
      if (
        selectedContractNumber&&
        contractNumber &&
        panelNumber &&
        description &&
        height &&
        width &&
        length &&
        qty
      ) {
        const values1 = [
          contractNumber,
          panelNumber,
          description,
          height,
          width,
          length,
          qty,
          currentDate,
          selectedContractNumber,
        ];
        const values2 = [qty, contractNumber, description];
        const values3 = [qty, id];

        // Execute the SQL queries
        global.db.run(query1, values1, function (err) {
          if (err) {
            insertionErrors.push(err.message);
            console.error(
              "Error inserting data into tblTransactionHistory:",
              err.message
            );
          }
        });

        global.db.run(query2, values2, function (err) {
          if (err) {
            insertionErrors.push(err.message);
            console.error(
              "Error updating QtyReceived in tblStock:",
              err.message
            );
          }
        });

        if (selectedContractNumber === "Stores" || selectedContractNumber === "Used" || selectedContractNumber === "Offcuts") {
          global.db.run(query3, values3, function (err) {
            if (err) {
              insertionErrors.push(err.message);
              console.error(
                "Error updating QtyReturns in tblReturns:",
                err.message
              );
            }
          });
        }
      } else {
        insertionErrors.push("Missing data for insertion");
        console.error("Missing data for insertion");
      }
    }
  );

  // Send response based on insertion status
  if (insertionErrors.length > 0) {
    console.error("Insertion errors:", insertionErrors);
    res
      .status(500)
      .json({ error: "Error inserting data", details: insertionErrors });
  } else {
    res.json({
      message:
        "Data inserted successfully into tblTransactionHistory and tblStock",
    });
  }
});

// Define the route to fetch quantity in stock
// router.get('/qtyInStock', (req, res, next) => {
//     const { contractNumber, description } = req.query;
//     const values = [contractNumber, description];
//     // console.log(values);
//     const purchaseQuery = "SELECT QtyReceived FROM tblStock WHERE ContractNumber = ? AND Description = ?;";

//     // Fetch quantity in stock for the specified contract number and description
//     global.db.all(purchaseQuery, values, function(err, rows) {
//         if (err) {
//             next(err);
//             return;
//         }
//         res.json(rows);
//         // console.log(rows); // Send the quantity in stock as JSON response
//     });
// });

// // Define the route to fetch quantity in stock
// router.get('/returnQty', (req, res, next) => {
//   // console.log(values);
//   const purchaseQuery = "SELECT QtyReturned FROM tblReturns;";

//   // Fetch quantity in stock for the specified contract number and description
//   global.db.all(purchaseQuery, function(err, rows) {
//       if (err) {
//           next(err);
//           return;
//       }
//       res.json(rows);
//       // console.log(rows); // Send the quantity in stock as JSON response
//   });
// });

module.exports = router;
