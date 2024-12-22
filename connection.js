let mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2208",
    database: "data",
});

// Connect to MySQL
con.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return; // Agar error hai to return karein
    }
    console.log("Connected to MySQL!");
});

// Corrected from `module.export` to `module.exports`
module.exports = con;
