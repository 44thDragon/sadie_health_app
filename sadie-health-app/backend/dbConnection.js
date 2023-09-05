const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'sadie_user',
  password: 'Juiced909!',
  database: 'sadivcly_sadie_health_data',
});

dbConnection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = dbConnection;