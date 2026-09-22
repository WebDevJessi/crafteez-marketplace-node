import mysql from 'mysql2';

// Create the connection configuration
export const connection = mysql.createConnection({
  host: 'localhost',         // Your database host (usually localhost)
  user: 'root',              // Your MySQL default username
  password: 'URc{]dimn#CQ8r*', // Replace with your actual MySQL root password
  database: 'crafteezmarketplace_db'     // The exact schema name you created in Step 1
});

// Open the MySQL connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database successfully!');
});

// Example Query: Run this to test everything is working
connection.query('SELECT 1 + 1 AS solution', (error, results) => {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
  
  // Close the connection when done
  connection.end();
});
