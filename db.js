const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          //usuário MySQL
<<<<<<< HEAD
    password: '1234',          //senha MySQL
=======
    password: 'Pm120696#',          //senha MySQL
>>>>>>> Funcao-Adm
    database: 'nutri_esportiva',
    waitForConnections: true,
    connectionLimit: 10,
})

module.exports = pool;