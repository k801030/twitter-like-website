(function(){
	var app = angular.module('forum',[]);
	var _data = [];
	var _dataLength = 0;
	var serverUrl = 'http://localhost:3000/';
	var _timestamp = 0;
	app.controller('ContentCtrl',function($scope,$timeout){
		$scope.data = [];
		$scope.topic = '';
		$scope.last;
		$scope.test = [{'tp':'4','cc':'3'}];
		$scope.test.push({'cc':'6'});
		$scope.post_topic = function(){
			if($scope.topic){
				$.ajax({
					url: serverUrl+'post',
					type: 'post',
					cache: false,
					dataType: 'json',
					data: {
						type: 'topic',
						text: $scope.topic
					},
					error: function(jqxhr, textStatus, errorThrown){
						console.log('error:'+textStatus);
					},
					success: function(data){
						var obj = JSON.parse(data);
						console.log('post sucessful:'+obj.timestamp);
					}	
				});
			}
			$scope.topic = '';
		}
		var init = function(){
			$.ajax({
					url: serverUrl+'init',
					type: 'POST',
					cache: false,
					dataType: 'json',
					
					crossDomain: true, //
					data: {},
					error: function(jqxhr, textStatus, errorThrown){
						console.log('error:'+textStatus);
					},
					success: function(data){
						$timeout(function(){
							$scope.data = data.data;
							_timestamp = data.timestamp;
						},100);   // need delay
						
					}
			});
		}

		var autoUpdate = function(){
			
			$.ajax({
					url: serverUrl+'autoUpdate',
					type: 'POST',
					cache: false,
					dataType: 'json',
					crossDomain: true, //
					data: { timestamp: _timestamp },
					error: function(jqxhr, textStatus, errorThrown){
						console.log('error:'+textStatus);
					},
					success: function(data){
						if(data.data){
							_timestamp = data.timestamp;
							console.log(data.data[0]);
							$scope.data.unshift(data.data[0]);
						}
						//console.log("最後一次更新時間:"+new Date(timestamp));
						//console.log("最後一PO:"+data.data);
						
					}
			});

			/*if(_dataLength != _data.length){
				//new_data[i].comments = []; // notice:  server.js:87 
				//_data.push(new_data[i]);
				$scope.data = _data;
				_dataLength = _data.length;
			}
			new_data = [];
			console.log('auto:'+$scope.data);*/
			$timeout(autoUpdate,2000);
		}


		var go = function(){
		
				$scope.data = _data;
				$scope.length = _dataLength;
				console.log(_data);

			
			$scope.shit += "2";
			console.log('go');
			//$timeout(go,200);
		}

		init();
		autoUpdate();

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
		if(_data == null)
			_data = [];
		_data.unshift(data);  // insert to top
	});

	

})();