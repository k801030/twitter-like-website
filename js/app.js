(function(){
	var app = angular.module('forum',[]);
	var _data = null;
	app.controller('ContentCtrl',function($scope,$timeout){
		$scope.data = 0;
		$scope.update = function(){
			//this.data = _data;
		}
		var getData = function(obj){
			if(_data < 10){
				$timeout(getData,100);
				$scope.data ++;
				return;
			}

			$scope.data = _data;
			console.log(_data);
		}
		
		$timeout(getData,1000);
		
	});

	function get_data(obj){
		if(_data === null){
			setTimeout(get_data, 50);
			return;
		}
		return _data;
	}
	var socket = io.connect('http://localhost:3005');;
	var my_id = 'a123';
	socket.emit('init',my_id);
	
	socket.on(my_id,function(data){
		_data = data;
		console.log('get');
		console.log(ContentCtrl);
		ContentCtrl.data = _data;
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