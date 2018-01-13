
var mysql = require('mysql')

module.exports = (onErrorCallback) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'dzbrasno',
        database : 'mop'
      });
    connection.connect();
    connection.on("error", onErrorCallback);
    return connection;
};