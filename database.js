// load mysql module
var mysql = require('mysql');

// create connection
var conn = mysql.createConnection({
	host: 'sdm2.im.ntu.edu.tw',
	user: 'r03725043',
	password: 'CdOdkUXt',
	database: 'r03725043',
	port: 3306
});

var db_client = conn.connect(function(){
	console.log('db connected.');
});

conn.query('INSERT INTO Topic(Topic_Content,Member_ID) values("test","a123")');