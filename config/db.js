const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }
);

db.getConnection((err) =>
    {
        if(err)
        {
            console.error('Database connection failed:', err.message);
        }
        else
        {
            console.log(`Connected to ${process.env.DB_NAME} database.`);
        }
    });
    

module.exports = db.promise();