const mysql = require('mysql');
const dotenv = require('dotenv');


const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'notesapp'
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  console.log('Connected to MySQL database');

  
  connection.release();
});

module.exports = pool;
