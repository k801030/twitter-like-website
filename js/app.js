(function(){
	var app = angular.module('forum',[]);
	var _data = [];
	var _dataLength = 0;
	var serverUrl = 'http://localhost:3000/';
	var _timestamp = 0;
	app.controller('ContentCtrl',function($scope,$timeout){
		$scope.profile = {
			id: sessionStorage.getItem("profile.id"),
			first_name: sessionStorage.getItem("profile.first_name"),
			last_name: sessionStorage.getItem("profile.last_name")
		}
		$scope.data = [];
		$scope.topic = '';
		$scope.comment = [];
		$scope.post_topic = function(topic){
			if($scope.topic){
				$.ajax({
					url: serverUrl+'post',
					type: 'post',
					cache: false,
					data: {
						"type": "topic",
						"content": $scope.topic,
						"member": $scope.profile.id
					},
					error: function(jqxhr, textStatus, errorThrown){
						console.log('error:'+textStatus);
					},
					success: function(data){
						//var obj = JSON.parse(data);
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
					data: {
						"type": "comment",
						"topic_id": id,
						"content": $scope.comment[id],
						"member": $scope.profile.id
					},
					error: function(jqxhr, textStatus, errorThrown){
						console.log('error:'+textStatus);
					},
					success: function(data){
						//var obj = JSON.parse(data);
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

		var autoUpdate_topic = function(){

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
					complete: function (XHR, TS) { 
						XHR = null;
					},
					success: function(data){
						if(data.data){
							_timestamp = data.timestamp;
							insertData('topic',data.data);
							
						}
						$timeout(autoUpdate_topic,2000);
					}
			});
		}

		var timer = 0;
		var autoUpdate_comment = function(){
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
					complete: function (XHR, TS) { 
						XHR = null;
					},
					success: function(data){

						if(data.data){
							_timestamp = data.timestamp;
							insertData('comment',data.data);
						}
						$timeout(autoUpdate_comment,2000);
					}
			});


		}
		$scope.formattedTime = function(timestamp){
			var d = new Date(timestamp);

			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var year = d.getFullYear();
			var month = months[d.getMonth()];
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
							// if find correspond topic, break;
							break;							
						}
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
		autoUpdate_topic();
		autoUpdate_comment();
	});


	
	

})();