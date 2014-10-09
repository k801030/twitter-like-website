(function(){
	var app = angular.module('forum',[]);
	var _data;
	app.controller('ContentCtrl',function(){
		this.data = _data;
		this.update = function(){
			this.data = _data;
		}
	});

	var socket = io.connect('http://localhost:3005');;
	var my_id = 'a123';
	socket.emit('init',my_id);
	
	socket.on(my_id,function(data){
		for(var i=0; i<data.length; i++){
			console.log(data[i].Topic_Content);
			
			for(var j=0; j<data[i].comments.length; j++)
				console.log("--- "+data[i].comments[j].Comment_Content);
		}
		_data = data;

	});

	$('form').submit(function(){
		socket.emit('new_topic', $('#m').val());
		$('#m').val('');
		return false;
	});

	socket.on('update',function(data){
		$('#messages').append($('<li>').text(data));
	});

	

})();