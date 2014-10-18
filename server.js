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


/* 
 * db function
 *
 */
function insert_topic(content,member){
	conn.query('INSERT INTO Topic(Topic_Content, Member_ID, Topic_PostTime) values("'+content+'","'+member+'","'+getFormatTimestamp(new Date())+'")',function(error, rows, fields){
		if(error){
			console.log(error);
			throw error;
		}
	});
}

function insert_comment(topic_id, content,member){
	conn.query('INSERT INTO Comment(Topic_ID, Comment_Content, Member_ID, Comment_PostTime) values("'+topic_id+'","'+content+'","'+member+'","'+getFormatTimestamp(new Date())+'")',function(error, rows, fields){
		if(error){
			console.log(error);
			throw error;
		}
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
		return false;
	};
}



/////
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,      Accept");
  next();
};


function getTimestamp(){
	return new Date().getTime();
}
function getFormatTimestamp(timestamp){
		var d = new Date(timestamp);
		var year = d.getFullYear();
		var month = d.getMonth()+1;
		var date = d.getDate();
		var hour = d.getHours();
		var min = d.getMinutes();
		var sec = d.getSeconds();
		return year+"-"+month+"-"+date+" "+hour+":"+min+":"+sec;
}

var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser());  // get req.body
app.use(allowCrossDomain); // enable cross domain

app.post('/init',function(req, res){
	conn.query('SELECT * FROM Topic ORDER BY Topic_PostTime DESC',function(error, rows, fields){
				if(error){
					throw error;
				}
				topics = rows;
				var dataReceived = new DataReceived();
				dataReceived.total = topics.length;
				for(var i=0; i<topics.length; i++){
					topics[i].comments = [];
					conn.query('SELECT * FROM Comment where Topic_ID = '+ topics[i].Topic_ID+' ORDER BY Comment_PostTime', function(error, rows, fields){
						if(error){
							throw error;
						}

						comments = rows;
						if(comments.length == 0){
							dataReceived.get(); // finished this data
							if(dataReceived.check()){
								var topicsString = JSON.stringify(topics, null, 2);
								res.send({data:topics,timestamp: getTimestamp()});
							}	
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
						if(dataReceived.check()){
							var topicsString = JSON.stringify(topics, null, 2);
							res.send({data:topics,timestamp: getTimestamp()});
						}
					});
				};
				
			});
});

app.post('/post',function(req, res){
	var data = req.body;
	switch(data.type){
		case 'topic':
			insert_topic(data.content,data.member);
			break;
		case 'comment':
			insert_comment(data.topic_id,data.content,data.member);
			break;
	}
	res.send(null);
});

app.post('/autoUpdate/topic',function(req, res){
	var data = req.body;
	var sendData = null;
	var time = getFormatTimestamp(parseInt(data.timestamp));

	conn.query('SELECT * FROM Topic where Topic_PostTime  >= "'+time+'" ' , function(error, rows, fields){
		if(error)	throw error;
		if(rows.length)	sendData = rows;

		res.send({data:sendData ,timestamp: getTimestamp()});
	});
	
});

app.post('/autoUpdate/comment',function(req, res){
	var data = req.body;
	var sendData = null;
	var time = getFormatTimestamp(parseInt(data.timestamp));
	conn.query('SELECT * FROM Comment where Comment_PostTime  >= "'+time+'" ' , function(error, rows, fields){
		if(error)	throw error;
		if(rows.length)	sendData = rows;
		
		res.send({data:sendData ,timestamp: getTimestamp()});
	});
	
});

app.post('/login',function(req, res){
	var profile = req.body;
	console.log(profile.id);
	conn.query('SELECT * FROM MEMBER where Member_ID  = '+profile.id+' ' , function(error, rows, fields){
		if(error)	throw error;
		if(rows.length == 0){
			console.log(profile.id);
			conn.query('INSERT INTO MEMBER(Member_ID,MEMBER_FIRSTNAME,MEMBER_LASTNAME) values("'+profile.id+'","'+profile.first_name+'","'+profile.last_name+'")', function(error, rows, fields){
				if(error)	throw error;

			});
		}
		// behavior as session
		res.send(profile);
	});

});

// for heroku's
var fs = require('fs');

app.get('/',function(req, res){
	 
	fs.readFile('./index.html',function(err,html){
		if(err){
			throw err;
		}
		res.writeHeader(200, {"Content-Type": "text/html"});
		res.write(html);
		res.end();
	})

});

app.get('/css/bootstrap.css',function(req, res){
	fs.readFile('./public/css/bootstrap.css',function(err,html){
		if(err){
			throw err;
		}
		res.writeHeader(200, {"Content-Type": "text/css"});
		res.write(html);
		res.end();
	})
});

app.get('/css/bootstrap.css.map',function(req, res){
	fs.readFile('./public/css/bootstrap.css.map',function(err,html){
		if(err){
			throw err;
		}
		res.writeHeader(200, {"Content-Type": "text/css"});
		res.write(html);
		res.end();
	})
});

app.get('/css/main.css',function(req, res){
	fs.readFile('./public/css/main.css',function(err,html){
		if(err){
			throw err;
		}
		res.writeHeader(200, {"Content-Type": "text/css"});
		res.write(html);
		res.end();
	})
});



app.get('/js/app.js',function(req, res){
	fs.readFile('./public/js/app.js',function(err,html){
		if(err){
			throw err;
		}
		res.writeHeader(200, {"Content-Type": "text/javascript"});
		res.write(html);
		res.end();
	})
});

app.listen(process.env.PORT || 3000);




