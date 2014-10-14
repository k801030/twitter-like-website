// load mysql module
var mysql = require('mysql');

var db_config = {
	host: 'sdm2.im.ntu.edu.tw',
	user: 'r03725043',
	password: 'CdOdkUXt',
	database: 'r03725043',
	port: 3306
};

var conn;
function handleDisconnect(){
	// create connection
	conn = mysql.createConnection(db_config);
	// db connection
	var db_client = conn.connect(function(err){
		if(err){
			console.log('error when connecting to db:', err);
			setTimeout();
		}
		console.log('db connected.');

		conn.on('error', function(err) {
		    console.log('db error', err);
		    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
		      handleDisconnect();                         // lost due to either server restart, or a
		    } else {                                      // connnection idle timeout (the wait_timeout
		      throw err;                                  // server variable configures this)
		    }
		});
	});
}

handleDisconnect();

// socket.io
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

io.on('connection', function(socket){
	console.log('a user connected.');

	socket.on('new_topic',function(data){
		console.log('message:'+data);
		new_topic(data,"id");
		get_topic();
	});

	socket.on('new_comment',function(data){
		console.log('message:'+data);
		
		io.emit('update',"");
	});

	socket.on('init',function(data){
		var member_id = data;
				
		get_bundle_of_data(member_id,get_bundle_of_data_Completed);
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

function get_topic(){
	conn.query('SELECT * FROM Topic ORDER BY Topic_PostTime DESC LIMIT 1',function(error, rows, fields){
		if(error){
			throw error;
		}
		get_topic_completed(rows[0]);
	});
}

function get_topic_completed(data){
	io.emit('update:topic',data);
}


function get_bundle_of_data(member_id,get_bundle_of_data_Completed){
	conn.query('SELECT * FROM Topic ORDER BY Topic_PostTime DESC',function(error, rows, fields){
		if(error){
			throw error;
		}
		topics = rows;
		var dataReceived = new DataReceived();
		dataReceived.total = topics.length;
		console.log(dataReceived.total);
		console.log(dataReceived.received);
		for(var i=0; i<topics.length; i++){
			topics[i].comments = [];
			conn.query('SELECT * FROM Comment where Topic_ID = '+ topics[i].Topic_ID+' ORDER BY Comment_PostTime', function(error, rows, fields){
				if(error){
					throw error;
				}
				comments = rows;
				if(comments.length == 0){
					dataReceived.get(); // finished this data
					return;
				}

				// find correspond id and append its comments.
				var id;
				for(var j=0; j<topics.length; j++)
					if(comments[0].Topic_ID == topics[j].Topic_ID){
						id = j;
						break;
					}

				for(var j=0; j<comments.length; j++)
					topics[id].comments.push(comments[j]);

				// callback when data received completely.
				dataReceived.get(); // finished this data
				
			});
			if(dataReceived.check)
					get_bundle_of_data_Completed(member_id,topics);
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


function get_bundle_of_data_Completed(id,data){
	io.emit(id,data);
}

////////     HTTP      //////////

var http = require('http');
var url = require('url');
var queryString = require('querystring');
http.createServer(processRequest).listen(8888);

function processRequest(req, res){
	var myUrl = url.parse( req.url );
	var obj = queryString.parse( myUrl.query);
	
	switch(obj.type){
		case 'post_topic':
			new_topic(obj.content,"");
			break;

	}

	res.writeHead(200, {'Content-Type': 'text/javascript'});
	res.end('_testcb(\'{"timestamp": "'+new Date().getime()+'"}\')');
}


