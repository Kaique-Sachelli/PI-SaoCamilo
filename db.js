const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          //usuário MySQL
    password: 'mysqlGuz',          //senha MySQL
    database: 'nutri_esportiva',
    waitForConnections: true,
    connectionLimit: 10,
    typeCast(field, next) {
        if (field.type === 'DECIMAL' || field.type === 'NEWDECIMAL') {
            const value = field.string();
            return value === null ? null : parseFloat(value);
        }
        return next();
    },
});

module.exports = pool;