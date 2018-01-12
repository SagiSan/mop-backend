
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dzbrasno',
  database : 'mop'
});

connection.connect();

module.exports = connection;