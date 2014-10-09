(function(){
	var app = angular.module('forum',[]);
	var _data = null;
	app.controller('ContentCtrl',function($scope,$timeout){
		$scope.data = 0;
		$scope.update = function(){
			//this.data = _data;
		}
		var getData = function(obj){
			if(_data == null){
				$timeout(getData,100);
				return;
			}

			$scope.data = _data;
			
		}
		
		$timeout(getData,200);

		$scope.formattedTime = function(timestamp){
			var d = new Date(timestamp);

			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var year = d.getFullYear();
			var month = months[d.getMonth()-1];
			var date = d.getDate();
			var hour = d.getHours();
			var noon = (hour < 12) ? 'am' : 'pm' ;
			hour = (hour < 12) ? hour : hour - 12;
			hour = (hour < 10 ) ? '0'+hour : hour;
			var min = d.getMinutes();
			min = (min < 10) ? '0'+min : hour;
			var sec = d.getSeconds();

			// sample format: 8, Sep, 2014 at 10:07pm
			var time = date + ", " + month + ", " + year + " at " + hour + ":" + min + noon;
			return time;
		}
		
	});


	var socket = io.connect('http://localhost:3005');;
	var my_id = 'a123';
	socket.emit('init',my_id);
	
	socket.on(my_id,function(data){
		_data = data;
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