(function() {
	$(document).ready(function () {
		// Create WebGL background animations inside of #main_background
		var background = new Background3D('main_background');

		// Slide header up and down on scroll
		var prevScroll = $(this).scrollTop();
		$(window).scroll(function(event) {
			var scrollTop = $(this).scrollTop();
			if (scrollTop > 65) {
				hitTop = false;
				if (scrollTop > prevScroll) {
					$('#header').css({
						'top': '-66px'
					});
				} 
				else if (scrollTop < prevScroll) {
					$('#header').css({
						'top': ''
					});
				}
			}
			prevScroll = scrollTop;
		});
	});
}());