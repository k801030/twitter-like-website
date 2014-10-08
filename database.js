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
// db connection
var db_client = conn.connect(function(){
	console.log('db connected.');
});


// socket.io
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

io.on('connection', function(socket){
	console.log('a user connected.');
	socket.on('post_topic',function(data){
		console.log('message:'+data);
		io.emit('update',data);
	});
});

http.listen(3005, function(){
	console.log('listening on *.3005');
});

function post_topic(content,member){
	conn.query('INSERT INTO Topic(Topic_Content,Member_ID) values("'+content+'","'+member+'")');
}

