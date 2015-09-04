(function() {
	$(document).ready(function () {
		// Create WebGL background animations inside of #main_background
		// var background = new Background3D('main_background');

		// -----------------GENERAL-----------------
		document.onscroll = function() {
			updateNavSlider();
		}

		// -----------------HEADER-----------------
		var navHeight = 70;
		var navSlider = document.getElementById('nav_slider');
		var intro = document.getElementById('nav_logo');
		var skills = document.getElementById('nav_skills');
		var lab = document.getElementById('nav_lab');
		var photo = document.getElementById('nav_photo');
		var contact = document.getElementById('nav_contact');
		var offsetX, introOffset, skillsOffset, labOffset, photoOffset, contactOffset;

		function updateNavSlider() {
			var scroll = $(document).scrollTop();
			offsetX = intro.getBoundingClientRect().left;
			introOffset = 0;
			skillsOffset = $('#skills').offset().top - 70;
			labOffset = $('#lab').offset().top - 70;
			photoOffset = $('#photo').offset().top - 70;
			contactOffset = Math.min($('#contact').offset().top - 70, $(document).height() - window.innerHeight);

			if (scroll >= introOffset && scroll < skillsOffset) {
				calcNavSlider(scroll, introOffset, skillsOffset, intro, skills);
			}
			else if (scroll >= skillsOffset && scroll < labOffset) {
				calcNavSlider(scroll, skillsOffset, labOffset, skills, lab);
			}
			else if (scroll >= labOffset && scroll < photoOffset) {
				calcNavSlider(scroll, labOffset, photoOffset, lab, photo);
			}
			else if (scroll >= photoOffset && scroll <= contactOffset) {
				calcNavSlider(scroll, photoOffset, contactOffset, photo, contact);
			}
			else if (scroll > contactOffset) {
				navSlider.style.width = contact.clientWidth + 'px';
				navSlider.style.left = contact.getBoundingClientRect().left - offsetX + 'px';
			}
		}

		function calcNavSlider(pos, startPos, endPos, startElement, endElement) {
			var percent = (pos - startPos) / (endPos - startPos);
			navSlider.style.width = startElement.clientWidth * (1 - percent) + endElement.clientWidth * percent + 'px';
			navSlider.style.left = startElement.getBoundingClientRect().left * (1 - percent)
								 + endElement.getBoundingClientRect().left * percent - offsetX + 'px';
		}
		
		// Initialize offsets for click
		updateNavSlider(); 

		// Navbar scroll on click
		$('#nav_logo').on('click', function() {
			$("html, body").animate({ scrollTop: introOffset + 'px' });
		});
		$('#nav_skills').on('click', function() {
			$("html, body").animate({ scrollTop: skillsOffset + 'px' });
		});
		$('#nav_lab').on('click', function() {
			$("html, body").animate({ scrollTop: labOffset + 'px' });
		});
		$('#nav_photo').on('click', function() {
			$("html, body").animate({ scrollTop: photoOffset + 'px' });
		});
		$('#nav_contact').on('click', function() {
			$("html, body").animate({ scrollTop: contactOffset + 'px' });
		});

		// -----------------INTRO-----------------

		var introCanvas = document.getElementById('intro_canvas');
		var introCanvasTimeout = setTimeout(updateIntroPattern, 0);

		window.onresize = function() {
			//window.clearTimeout(introCanvasTimeout);
			//introCanvasTimeout = setTimeout(updateIntroPattern, 1000);
		}
		
		function updateIntroPattern() {
			introCanvas.width = window.innerWidth;
			introCanvas.height = window.innerHeight;
			var pattern = Trianglify({
				width: window.innerWidth,
				height: window.innerHeight,
				variance: 0.75,
				cell_size: 175,
				x_colors: ['#ecdefe', '#41a4ff', '#005ca8'],
				y_colors: 'match_x'
			});
			pattern.canvas(introCanvas);
		}
	});
}());