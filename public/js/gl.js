var Background3D = function(container) {
	var width, height, aspect, scene, renderer, camera;
	var originalWidth = window.innerWidth;
	var originalHeight = window.innerHeight;
	var originalAspect = originalWidth / originalHeight;

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: false,
		canvas: document.getElementById(container)
	});
	renderer.setPixelRatio(window.devicePixelRatio?window.devicePixelRatio:1);
	renderer.setClearColor( 0xffffff, 1);
	renderer.setSize(width, height);

	camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.01, 1000);
	camera.position.set(0, 100, 0);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	scene = new THREE.Scene();
	scene.add(camera);
	scene.add(generateConstellationMesh(100));

	requestAnimationFrame(render);
	renderer.render(scene, camera);

	function render() {
		if(width !== window.innerWidth || height !== window.innerHeight) {
			resizeCamera();
		}
		requestAnimationFrame(render);
		renderer.render(scene, camera);
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

	function generateSkyGradient() {

	}

	function generateConstellationMesh(size) {
		var numX = width / size + 1;
		var numY = height / size + 1;
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({'color': 'black'});

		for (var i = -size; i <= size; i+=1) {
			geometry.vertices.push(new THREE.Vector3(-size, -0.04, i));
			geometry.vertices.push(new THREE.Vector3(size, -0.04, i));

			geometry.vertices.push(new THREE.Vector3(i, -0.04, -size));
			geometry.vertices.push(new THREE.Vector3(i, -0.04, size));
		}

		var line = new THREE.Line(geometry, material, THREE.LinePieces);
		return line;
	}
}