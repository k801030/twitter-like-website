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

	socket.on('new_topic',function(data){
		console.log('message:'+data);
		new_topic(data,"id");
		io.emit('update',data);
	});

	socket.on('new_comment',function(data){
		console.log('message:'+data);
		new_topic(data,"id");
		io.emit('update',data);
	});

});

http.listen(3005, function(){
	console.log('listening on *.3005');
});

/* 
 * db function
 *
 */
function new_topic(content,member){
	conn.query('INSERT INTO Topic(Topic_Content, Member_ID) values("'+content+'","'+member+'")');
}

function new_comment(topic_id, content,member){
	conn.query('INSERT INTO Comment(Topic_ID, Comment_Content, Member_ID) values("'+topic_id+'","'+content+'","'+member+'")');
}

function get_bundle_of_data(ready_to_send){

	conn.query('SELECT * FROM Topic',function(error, rows, fields){
		if(error){
			throw error;
		}
		topics = rows;

		var dataReceived = new DataReceived();
		dataReceived.total = topics.length;

		for(var i=0; i<topics.length; i++){
			conn.query('SELECT * FROM Comment where Topic_ID = '+ topics[i].Topic_ID+' ORDER BY Comment_PostTime', function(error, rows, fields){
				if(error){
					throw error;
				}
				comments = rows;
				if(comments.length == 0){
					return;
				}
				id = comments[0].Topic_ID;
				topics[id].comments = [];

				for(var j=0; j<comments.length; j++)
					topics[id].comments.push(comments[j]);

				dataReceived.get();
				if(dataReceived.check)
					ready_to_send(topics);
			});
		};
		
	});

}

function DataReceived(){
	this.total =  0;
	this.received = 0;
	this.get =  function(){
		this.received++;
	};
	this.check = function(){
		if (this.total == this.received)
			return true;
	};
}

function get_part_of_data(){

}

function ready_to_send(topics){
	console.log(topics);

}

var topics;
get_bundle_of_data(function(){
	ready_to_send(topics);
});

