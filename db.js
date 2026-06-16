const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          //usuário MySQL
    password: '2207',          //senha MySQL

    database: 'nutri_esportiva',
    waitForConnections: true,
    connectionLimit: 10,
})

module.exports = pool;