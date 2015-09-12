(function() {
	$(document).ready(function () {
		// Create WebGL background animations inside of #main_background
		// var background = new Background3D('main_background');

		// -----------------GENERAL-----------------
		document.onscroll = function() {
			updateNavSlider();
			updateIntroScroll();
			updateSkills();
		}

		window.onresize = function() {
			updateNavHeight();
			updateNavSlider();
			updateIntroResize();
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

		function updateNavHeight() {
			if (window.innerWidth <= 450) {
				navHeight = 60;
			}
			else {
				navHeight = 70;
			}
		}

		function updateNavSlider() {
			var scroll = $(document).scrollTop();
			offsetX = intro.getBoundingClientRect().left;
			introOffset = 0;
			skillsOffset = $('#skills_wrapper').offset().top - navHeight;
			labOffset = $('#lab_wrapper').offset().top - navHeight;
			photoOffset = $('#photo_wrapper').offset().top - navHeight;
			contactOffset = Math.min($('#contact_wrapper').offset().top - navHeight, $(document).height() - window.innerHeight);

			// Determine where the bar should be and interpolate its position between sections
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

		// Navbar scroll on click
		$('#nav_logo').on('click', function() {
			scrollToPosition(introOffset);
		});
		$('#nav_skills').on('click', function() {
			scrollToPosition(skillsOffset);
		});
		$('#nav_lab').on('click', function() {
			scrollToPosition(labOffset);
		});
		$('#nav_photo').on('click', function() {
			scrollToPosition(photoOffset);
		});
		$('#nav_contact').on('click', function() {
			scrollToPosition(contactOffset);
		});

		/*
		// Bind navbar to stop animating on user interrupt
		$('html, body').bind('scroll mousedown DOMMouseScroll mousewheel keyup', function () {
			$('html, body').stop();
		});
		*/

		function scrollToPosition(offset) {
			var delta = Math.abs($(document).scrollTop() - offset);
			var duration = 400 + delta / 6; // Scale the duration depending on distance
			$('html, body').stop().animate({ scrollTop: offset + 'px' }, duration);
		}

		// -----------------INTRO-----------------

		var introCanvas = document.getElementById('intro_canvas');
		var introCanvasTimeout = setTimeout(updateIntroPattern, 0);
		
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

		var introMoveHeight = 100;
		var introClassAdded = false;

		function updateIntroResize() {
			introMoveLength = skillsOffset * 2 / 3;
		}

		function updateIntroScroll() {
			var scroll = $(document).scrollTop();

			if (scroll < skillsOffset) {
				if (!introClassAdded && scroll > introMoveHeight) {
					$('#intro').addClass('slide_up_hidden');
					introClassAdded = true;
				}
				else if (introClassAdded && scroll <= introMoveHeight) {
					$('#intro').removeClass('slide_up_hidden');	
					introClassAdded = false;
				}
			}
		}

		// -----------------SKILLS-----------------
		var skillsToggled = false;
		var skillsMessageToggled = false;

		function updateSkills() {
			var scroll = $(document).scrollTop();

			if (scroll < labOffset) {
				var skillsHeight = labOffset - skillsOffset;
				var skills = $('#skills_bars ul');
				var more = $('#skills_more ul');
				
				if (!skillsToggled && scroll >= skillsOffset - 100 
					&& scroll <= skillsOffset + skillsHeight - 100) {
					for (var i = 0; i < skills[0].children.length; i++) {
						var current = skills[0].children[i].children[0];
						timeoutSkillsBars(current, i * 100);
					}
					for (var i = 0; i < more[0].children.length; i++) {
						var current = more[0].children[i].children[0];
						console.log(current);
						timeoutSkillsMore(current, i * 50 + skills[0].children.length * 100 + 400);
					}

					skillsToggled = true;
				}

				if (!skillsMessageToggled && scroll >= skillsOffset - 400) {
					$('#skills_wrapper .section_statement').removeClass('slide_down_hidden');
					skillsMessageToggled = true;
				}
			}
		}

		function timeoutSkillsBars(element, time) {
			setTimeout(function() {
				$(element).css({
					'-webkit-transform': 'translateX(0%)',
					'-moz-transform': 'translateX(0%)',
					'-o-transform': 'translateX(0%)',
					'transform': 'translateX(0%)'
				});
			}, time);
		}

		function timeoutSkillsMore(element, time) {
			setTimeout(function() {
				$(element).css({
					'opacity': '1'
				});
			}, time);
		}

		// -----------------LAB-----------------
		var projectList = $('#lab_nav')[0].children;
		var currentIndex = 0;
		var labProjects = $('#lab_projects')[0].children;
		var duration = 500;
		var animating = false;
		var animateTimeout = setTimeout(function() {}, 0);;
		$(projectList[currentIndex]).addClass('lab_nav_selected');


		$('#lab_nav').children().each(function(index, element) {
			$(element).click(function() {
				if (currentIndex !== index && !animating) {
					console.log('asdasd');
					moveLabSlider(index);
				}
			});
		});

		function moveLabSlider(index) {
			$(projectList[currentIndex]).removeClass('lab_nav_selected');
			$(projectList[index]).addClass('lab_nav_selected');
			var current = labProjects[currentIndex];
			var target = labProjects[index];

			updateLabSlider(index);
			setTranslateX(target, 0);

			$(current).css({
				'opacity': '0.0001',
				'z-index': '2'
			});
			$(target).css({
				'opacity': '1',
				'z-index': '3'
			});

			//animating = true;
			clearTimeout(animateTimeout);
			animateTimeout = setTimeout(function() {
				animating = false;
			}, duration);
			currentIndex = index;
		}

		function updateLabSlider(targetIndex) {
			for (var i = 0; i < labProjects.length; i++) {
				if (i < targetIndex) {
					// Move left
					setTranslateX(labProjects[i], -20);
				}
				else if (i > targetIndex) {
					// Move right
					setTranslateX(labProjects[i], 20);
				}
			}
		}

		function setTranslateX(element, num) {
			$(element).css({
				'-webkit-transform': 'translateX(' + num + '%)',
				'-moz-transform': 'translateX(' + num + '%)',
				'-ms-transform': 'translateX(' + num + '%)',
				'-o-transform': 'translateX(' + num + '%)',
				'transform': 'translateX(' + num + '%)'
			});
		}

		// Initialize everything, making sure the dom is fully updated with queries
		setTimeout(function() {
			updateNavHeight();
			updateNavSlider(); 
			updateSkills();
			updateLabSlider(currentIndex);
		}, 50)
	});
}());