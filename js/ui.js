(function(){

	// animation in comments
	$(document).on("click",".topic-header",function(){
		//var commentDiv = $('.topic').find('comment');
		//moveOut(commentDiv,1000);
		var element = $(this).parent().find('.comment-header')
		var topic = $(this).parent();
		if(!element.is(':animated')){
			if(element.is(':hidden')){
				moveOut(element,400);
				topic.addClass('unfold');
			}else{
				moveIn(element,400);
				topic.removeClass('unfold');
			}
		}
	});

	// change in fold-button
	$(document).on("click",".topic-header",function(){
		var ele_show = $(this).find('.to-show');
		var ele_hide = $(this).find('.to-hide');
		console.log(ele_show.is(':hidden'));
		if(!ele_show.is(':hidden')){
			ele_show.hide();
			ele_hide.show();
		}else{
			ele_show.show();
			ele_hide.hide();
		}
	});


	function moveOut(element,duration){
		var from = 0;
		var to = element.height();
		element.css('height',from);
		element.show().animate({
			height:to,
		},duration||800,function complete(){
			element.css('height','');
		}); //default 800
	}
	function moveIn(element,duration){
		var from = element.height();
		var to =0;
		element.show().animate({
			height:to,
		},duration||800,function complete(){
			element.hide();
			element.css('height','');
		});
	}


})();