var sql = require('mysql');

var mysql_connection = sql.createConnection({
	host:'localhost',
	user:'zeus',
	password:'$Vicky8056',
	database:'users'
});

mysql_connection.connect(function(err){
	if(!err)
		console.log('database ready');
	else
		console.log('error in connection'+err);
})

module.exports = mysql_connection ;