const mysql = require('mysql2');
require('dotenv').config()

const conexao = mysql.createConnection({
  host: process.env.HOST,
  port:process.env.PORT,
  user: process.env.USER_DB,
  password: process.env.CONNECTION_BANCO_PASSWORD,
  database: process.env.DATABASE
})

module.exports = conexao