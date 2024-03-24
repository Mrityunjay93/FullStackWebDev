// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123', // Change this to your MySQL password
    database: 'mydatabase'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Signup route
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, location, username } = req.body;
    const sql = 'INSERT INTO users (first_name, last_name, email, password, location, username) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, email, password, location, username], (err, result) => {
        if (err) {
            res.send('Error signing up');
            throw err;
        }
        res.redirect(302,'/login');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.send('Error logging in');
            throw err;
        }
        if (result.length > 0) {
            res.send('Login Successful');
        } else {
            res.send('Invalid username or password');
        }
    });
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signupnew.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
