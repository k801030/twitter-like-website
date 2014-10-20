(function(){
	$(document).on("click",".topic-header",function(){
		//var commentDiv = $('.topic').find('comment');
		//moveOut(commentDiv,1000);
		var element = $(this).parent().find('.commentAll')
		if(!element.is(':animated')){
			if(element.is(':hidden'))
				moveOut(element);
			else
				moveIn(element);
		}
	});

	function moveOut(element,duration){
		var from = 0;
		var to = element.height();
		element.css('height',from);
		element.show().animate({
			height:to,
		},duration||800);
	}
	function moveIn(element,duration){
		var from = element.height();
		var to =0;
		element.show().animate({
			height:to,
		},duration||800,function complete(){
			element.hide();
			element.css('height',from);
		});
		

	}
})();