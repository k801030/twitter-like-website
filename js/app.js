(function(){
	var app = angular.module('forum',[]);
	var _data = [];
	var _dataLength = 0;
	var serverUrl = 'http://ntufakebook.herokuapp.com:3000/';
	var _timestamp = 0;
	app.controller('ContentCtrl',function($scope,$timeout){
		$scope.data = [];
		$scope.topic = '';
		$scope.comment = [];
		$scope.post_topic = function(topic){
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
						//console.log('post sucessful:'+obj.timestamp);
					}	
				});
			}
			$scope.topic = '';
		}

		$scope.post_comment = function(id,comment){
			$scope.comment[id] = comment;
			if($scope.comment[id]){
				$.ajax({
					url: serverUrl+'post',
					type: 'post',
					cache: false,
					dataType: 'json',
					data: {
						type: 'comment',
						topic_id: id,
						text: $scope.comment[id]
					},
					error: function(jqxhr, textStatus, errorThrown){
						console.log('error:'+textStatus);
					},
					success: function(data){
						var obj = JSON.parse(data);
						//console.log('post sucessful:'+obj.timestamp);
					}	
				});
			}

			$scope.comment[id] = '';
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
					url: serverUrl+'autoUpdate/topic',
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
							insertData('topic',data.data);
							
						}
						//console.log("最後一次更新時間:"+new Date(timestamp));
						//console.log("最後一PO:"+data.data);
						
					}
			});

			$.ajax({
					url: serverUrl+'autoUpdate/comment',
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
							insertData('comment',data.data);
										
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
			$timeout(autoUpdate,5000);
		}

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

		var insertData = function(type,data){
			console.log("insert "+type);
			if(type == 'topic'){
				for(var i=0; i<data.length; i++){
					var matchFlag = 0;
					for(var j=0;j<$scope.data.length; j++){
						if($scope.data[j].Topic_ID == data[i].Topic_ID){	
							$scope.data[j] = data[i];
							matchFlag = 1;
							break;
						}
					}
					if(!matchFlag){
						$scope.data.unshift(data[i]);
					}
				}
			}



			if(type =='comment'){
				// may get muti-data;
				for(var i=0; i<data.length; i++){
					var matchFlag = 0;
					// check if this topic exists
					for(var j=0;j<$scope.data.length; j++){
						if($scope.data[j].Topic_ID == data[i].Topic_ID){
							//check if this comment exists
							if($scope.data[j].comments == null)
								$scope.data[j].comments = [];
							for(var k=0; k<$scope.data[j].comments.length; k++){
								if($scope.data[j].comments[k].Comment_ID == data[i].Comment_ID){
									$scope.data[j].comments[k] = data[i];
									matchFlag = 1;
									break;
								}
							}
						}
						break;
					}

					if(!matchFlag){
						if($scope.data[j].comments == null)
							$scope.data[j].comments = [];
						$scope.data[j].comments.push(data[i]);
					}
				}
			}

		}

		// execution
		init();
		autoUpdate();
		
	});


	
	

})();