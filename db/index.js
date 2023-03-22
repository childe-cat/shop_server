const mysql = require('mysql')
const db = mysql.createPool(
    {
        host: '124.223.184.132',
        user: 'shopping',
        password: 'cFp6WetmyzpPY2cj',
        database: 'shopping'
    }
)

module.exports = db