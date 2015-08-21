var Background3D = function(container) {
	// Load Stats
	var stats = new Stats();
	stats.setMode(2);
	stats.domElement.style.position = 'fixed';
	stats.domElement.style.left = '0px';
	stats.domElement.style.bottom = '0px';

	document.body.appendChild( stats.domElement );

	// Canvas And Performance Variables
	var width, height, aspect, scene, renderer, camera;
	var originalWidth = window.innerWidth;
	var originalHeight = window.innerHeight;
	var originalAspect = originalWidth / originalHeight;
	var fps = 60;
	var fpsDelay = 1000.0 / fps;
	var startTime, endTime;

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		precision: "lowp",
		alpha: false,
		canvas: document.getElementById(container)
	});
	renderer.setPixelRatio(window.devicePixelRatio?window.devicePixelRatio:1);
	renderer.setClearColor( 0xffffff, 1);
	renderer.setSize(width, height);

	camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.01, 1000);
	camera.position.set(0, 0, 100);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	scene = new THREE.Scene();
	scene.add(camera);

	// Generate scene
	generateNightGradient(-3);
	generateStars(70, 4, 10, 100, -2);
	generateConstellationMesh(150, 0.75, -1);

	requestAnimationFrame(render);
	renderer.render(scene, camera);

	function render() {
		startTime = Date.now();
		stats.begin();
		if(width !== window.innerWidth || height !== window.innerHeight) {
			resizeCamera();
		}
		endTime = Date.now();
		console.log(fpsDelay);
		setTimeout(function() {
			requestAnimationFrame(render);
			renderer.render(scene, camera);
			stats.end();
		}, fpsDelay + startTime - endTime);
	}

	function resizeCamera() {
		width = window.innerWidth;
		height = window.innerHeight;
		aspect = width / height;

		camera.left = width / -2;
		camera.right = width / 2;
		camera.top = height / 2;
		camera.bottom = height / -2;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}

	// -------------------- FIRST PANE: CONSTELLATION --------------------

	// Create the background gradient for the night sky
	function generateNightGradient(z) {
		var geometry = new THREE.Geometry();
		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			vertexColors: THREE.VertexColors,
			fog: false,
			shading: THREE.NoShading,
		});

		geometry.vertices.push(
			new THREE.Vector3(-originalWidth / 2, originalHeight / 2, z),
			new THREE.Vector3(originalWidth / 2, originalHeight / 2, z),
			new THREE.Vector3(originalWidth / 2, -originalHeight / 2, z),
			new THREE.Vector3(-originalWidth / 2, -originalHeight / 2, z));
		// Render faces CCW
		geometry.faces.push(new THREE.Face3(1, 0, 2));
		geometry.faces.push(new THREE.Face3(0, 3, 2));

		var dark = new THREE.Color(0x05101C);
		var light = new THREE.Color(0x0E3763);

		geometry.faces[0].vertexColors[0] = dark;
		geometry.faces[0].vertexColors[1] = dark;
		geometry.faces[0].vertexColors[2] = light;
		geometry.faces[1].vertexColors[0] = dark;
		geometry.faces[1].vertexColors[1] = light;
		geometry.faces[1].vertexColors[2] = light;

		var gradient = new THREE.Mesh(geometry, material);
		scene.add(gradient);
	}

	// Create individual points to represent stars
	function generateStars(cellSize, clusters, clusterMin, clusterMax, z) {
		var geometry = new THREE.Geometry();
		var points = new THREE.PointCloudMaterial({
			color: '#c4e4e7',
			size: 1.5,
			sizeAttenuation: false
		});

		// How many cells there are on each axis
		var cellsX = Math.floor((originalWidth + 4 * cellSize) / cellSize);
		var cellsY = Math.floor((originalHeight + 4 * cellSize) / cellSize);

		// Scale variance to the size of cells
		var variance = cellSize * 2;

		// Generate points
		for (var j = 0; j < originalHeight; j += cellSize) {
			for (var i = 0; i < originalWidth; i += cellSize) {
				var x = i + cellSize / 2 + offset(Math.random(), [0, 1], [-variance, variance]) - originalWidth / 2;
				var y = j + cellSize / 2 + offset(Math.random(), [0, 1], [-variance, variance]) - originalHeight / 2;
				geometry.vertices.push(new THREE.Vector3(x, y, z));
			}
		}

		for (var i = 0; i < clusters; i++) {
			var x = (Math.random() - 0.5) * originalWidth;
			var y = (Math.random() - 0.5) * originalHeight;
			var clusterSize = Math.random() * (clusterMax - clusterMin) + clusterMin;

			for (var j = 0; j < cellsX * clusterSize / 100; j++) {
				var clusterX = x + (Math.random() - 0.5) * clusterSize;
				var clusterY = y + (Math.random() - 0.5) * clusterSize;
				geometry.vertices.push(new THREE.Vector3(clusterX, clusterY, z));
			}
		}

		var stars = new THREE.PointCloud(geometry, points);
		scene.add(stars);
	}

	// Generate a mesh to represent a constellation in the night sky
	function generateConstellationMesh(cellSize, variance, z) {
		var geometry = new THREE.Geometry();
		var points = new THREE.PointCloudMaterial({
			color: '#c4e4e7',
			size: 3.0,
			sizeAttenuation: false
		});
		var vShader = $('#testVertShader');
		var fShader = $('#testFragShader');
		var wireframe = new THREE.ShaderMaterial({
			uniforms: {
				mousePosition: {
					type: 'v2',
					value: new THREE.Vector2(originalWidth / 2, originalHeight / 2)
				},
				color: {
					type: 'c',
					value: new THREE.Color(0xc4e4e7)
				},
				
				texture: {
					type: 't',
					value: THREE.ImageUtils.loadTexture('/assets/images/star.png')
				}
			},
			vertexShader:   vShader.text(),
			fragmentShader: fShader.text(),
			wireframe: true, 
			transparent: true
		});
		$(window).on('mousemove', function(event) {
			wireframe.uniforms.mousePosition.value = new THREE.Vector2(event.pageX, -(event.pageY - $(window).scrollTop() - height));
		});

		// How many cells there are on each axis
		var cellsX = Math.floor((originalWidth + 4 * cellSize) / cellSize);
		var cellsY = Math.floor((originalHeight + 4 * cellSize) / cellSize);
		
		// Amount of excess geometry off the edges to create an artifact free pattern
		var bleedX = ((cellsX * cellSize) - originalWidth) / 2;
		var bleedY = ((cellsY * cellSize) - originalHeight) / 2;

		// Scale variance to the size of cells
		var variance = cellSize * variance / 2;

		// Generate points
		for (var j = -bleedY; j < originalHeight + bleedY; j += cellSize) {
			for (var i = -bleedX; i < originalWidth + bleedX; i += cellSize) {
				var x = i + cellSize / 2 + offset(Math.random(), [0, 1], [-variance, variance]) - originalWidth / 2;
				var y = j + cellSize / 2 + offset(Math.random(), [0, 1], [-variance, variance]) - originalHeight / 2;
				geometry.vertices.push(new THREE.Vector3(x, y, z));
			}
		}
		
		// Generate faces
		for (var j = 0; j < cellsY - 1; j++) {
			var yOffset = j * cellsX;

			for (var i = 0; i < cellsX - 1; i++) {
				var splitDirection = Math.random() < 0.5 ? true : false;
				var a = i + yOffset;
				var b = i + yOffset + 1;
				var c = i + yOffset + cellsX + 1;
				var d = i + yOffset + cellsX;

				// Randomize the direction that this square faces, render them CCW
				if (splitDirection) {
					geometry.faces.push(new THREE.Face3(a, b, c));
					geometry.faces.push(new THREE.Face3(a, c, d));
				}
				else {
					geometry.faces.push(new THREE.Face3(a, b, d));
					geometry.faces.push(new THREE.Face3(b, c, d));
				}
			}
		}

		// Create and add the new mesh
		var geometry2 = geometry.clone();
		geometry2.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -0.1) );
		var mesh1 = new THREE.PointCloud(geometry, points);
		var mesh2 = new THREE.Mesh(geometry2, wireframe);
		scene.add(mesh1);
		scene.add(mesh2);
	}

	function offset(num, in_range, out_range ) {
		return (num - in_range[0]) * (out_range[1] - out_range[0]) / (in_range[1] - in_range[0]) + out_range[0];
	}
}