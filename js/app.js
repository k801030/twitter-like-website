(function(){
	var app = angular.module('forum',[]);
	var _data = null;
	var _dataLength = 0;
	app.controller('ContentCtrl',function($scope,$timeout){
		$scope.data = [];
		$scope.topic = '';
		$scope.last;
		$scope.test = [{'tp':'4','cc':'3'}];
		$scope.test.push({'cc':'6'});
		$scope.new_topic = function(){
			if(!!$scope.topic)
				socket.emit('new_topic', $scope.topic);
			$scope.topic = '';
		}
		var init = function(){
			if(_data == null){
				$timeout(init,100);
				return;
			}
			$scope.data = _data;
			_dataLength = _data.length;
			$timeout(autoUpdate,2000);
		}
		var autoUpdate = function(){
			if(_dataLength != _data.length){
				//new_data[i].comments = []; // notice:  server.js:87 
				//_data.push(new_data[i]);
				$scope.data = _data;
				_dataLength = _data.length;
			}
			new_data = [];
			$timeout(autoUpdate,2000);
		}

		$timeout(init,200);
		

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
			min = (min < 10) ? '0'+min : min;
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
	});

	socket.on('update:topic',function(data){
		
		_data.unshift(data);  // insert to top
	});

	

})();