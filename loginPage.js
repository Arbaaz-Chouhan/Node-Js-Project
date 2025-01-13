const express = require("express");
const connection = require("./conifg/connection"); // Ensure connection file is correct
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");

const app = express();
const port = 3003;

app.use(express.static(path.resolve("./public")))

// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve the form HTML file
app.get("/", (req, res) => {
  res.sendFile('/public/index.html');
});

// Handle POST request and log form data
app.post("/", (req, res) => {
  const { name, address, Phone_NO } = req.body;

  const sql = "INSERT INTO employes (name, address, Phone_NO) VALUES (?, ?, ?)";
  connection.query(sql, [name, address, Phone_NO], (err, result) => {
    if (err) {
      console.error("Error executing query: " + err);
      return res.status(500).send("Error inserting data");
    }
    res.send("Student Register successful! ID: " + result.insertId);
  });
});

// Route to fetch and display all employees
app.get("/employes", (req, res) => {
  const sql = "SELECT * FROM employes";
  connection.query(sql, (error, result) => {
    if (error) throw error;
    res.render("employes", { employes: result });
  });
});

// Delete data
app.get("/delete-employes", (req, res) => {
  const sql = "DELETE FROM employes WHERE id=?";
  const { id } = req.query;
  connection.query(sql, [id], (error, result) => {
    if (error) throw error;
    res.redirect("/employes");
  });
});

// Update data
app.get("/update-employes", (req, res) => {
  const sql = "SELECT * FROM employes WHERE id=?";
  const { id } = req.query;
  connection.query(sql, [id], (error, result) => {
    if (error) throw error;
    res.render("update-data", { update: result });
  });
});

// Handle update data form submission
app.post("/update-employes", (req, res) => {
  const { id } = req.query;
  const { name, address, Phone_NO } = req.body;

  const sql = "UPDATE employes SET name = ?, address = ?, Phone_NO = ? WHERE id = ?";
  connection.query(sql, [name, address, Phone_NO, id], (error, result) => {
    if (error) throw error;
    res.redirect("/employes");
  });
});

// Search employees
app.get("/search-employes", (req, res) => {
  const { name = "", address = "", Phone_NO = "" } = req.query;

  const sql =
    "SELECT * FROM employes WHERE name LIKE ? AND address LIKE ? AND Phone_NO LIKE ?";
  connection.query(
    sql,
    [`%${name}%`, `%${address}%`, `%${Phone_NO}%`],
    (error, result) => {
      if (error) {
        res.send("Error during search operation.");
      } else {
        res.render("search-employes", { employes: result });
      }
    }
  );
});

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
