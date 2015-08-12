(function() {
	$(document).ready(function () {
		var prevScroll = $(this).scrollTop();

		$(window).scroll(function(event) {
			var scrollTop = $(this).scrollTop();
			if (scrollTop > prevScroll) {
				$('#header').css({
					'height': '35px',
					'line-height': '35px'
				});
				$('#header_logo').css({
					'top': '-35px',
					'opacity': '0',
					'cursor': 'default'
				});
				$('.nav_item').css({
					'line-height': '35px'
				});
			} 
			else if (scrollTop < prevScroll) {
				$('#header').css({
					'height': '',
					'line-height': ''
				});
				$('#header_logo').css({
					'top': '',
					'opacity': '',
					'width': '',
					'cursor': ''
				});
				$('.nav_item').css({
					'line-height': ''
				});
			}
			prevScroll = scrollTop;
		});
	});
}());