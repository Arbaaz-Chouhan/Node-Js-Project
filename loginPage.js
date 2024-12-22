const express = require("express");
const con = require('./connection')
const path = require("path");
const bodyParser = require("body-parser"); // body-parser ko require kiya
const { render } = require("ejs");
const app = express();
const port = 3003;

// Middleware for parsing form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // `extended` ki spelling thik ki


// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

// Serve the form HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "form.html"));
});

/// Handle POST request and log form data
app.post("/", (req, res) => {
  let name = req.body.name;
  let address = req.body.address;
  let PhoneNO = req.body.Phone_NO; // Ensure this matches your form input name

  let sql = "INSERT INTO employes (name, address, Phone_NO) VALUES (?, ?, ?)";

  // Execute the SQL query
  con.query(sql, [name, address, PhoneNO], (err, result) => {
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

  // Execute the query to fetch employee data
  con.query(sql, (error, result) => {
    if (error) throw error;
    res.render("employes", { employes: result });

  })

})

// delete data 
app.get("/delete-employes", (req, res) => {
  const sql = "DELETE FROM employes WHERE id=?";
  let id = req.query.id;

  con.query(sql, [id], (error, result) => {
    if (error) throw error;

    res.redirect('/employes');
  });
});


// Update data
app.get("/update-employes", (req, res) => {
  const sql = " SELECT * FROM employes WHERE id=?";
  let id = req.query.id;

  con.query(sql, id, (error, result) => {
    if (error) throw error;
    res.render("update-data", { update: result });
  });
});

//  update data post 
app.post('/update-employes', (req, res) => {
  let id = req.query.id; // id ko query se le rahe hain
  let name = req.body.name;
  let address = req.body.address;
  let PhoneNO = req.body.Phone_NO;

  const sql = "UPDATE employes SET name = ?, address = ?, Phone_NO = ? WHERE id = ?";

  con.query(sql, [name, address, PhoneNO, id], (error, result) => {
    if (error) throw error;
    res.redirect("/employes"); // Update ke baad employes page pe redirect
  });
});

// Route to search employees based on form input
app.get('/search-employes', (req, res) => {
  let name = req.query.name || '';
  let address = req.query.address || '';
  let PhoneNO = req.query.Phone_NO || '';

  let sql = "SELECT * FROM employes WHERE name LIKE '%" + name + "%' AND address LIKE '%" + address + "%' AND Phone_NO LIKE '%" + PhoneNO + "%'";

  con.query(sql, (error, result) => {
    if (error) {
      res.send("Error during search operation.");
    }    else {
      // console.log(result); // Log the result
      res.render("search-employes", { employes: result });

    }
  });
});
app.listen(port, () => console.log(`Server started on port ${port}`));

