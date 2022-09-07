const mysql = require('mysql')
const db = mysql.createPool(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'Ll030401',
        database: 'shopping'
    }
)

module.exports = db