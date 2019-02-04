const Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0,
	green: 0x2eb107
};
let scene, camera, fieldOfView, aspectRatio, nearPlane,
	farPlane, HEIGHT, WIDTH, renderer, container;


Earth = function () {
	const geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
	//geometry.rotateX(-Math.PI / 2);
	const material = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: 6,
		flatShading: THREE.FlatShading
	});
	this.mesh = new THREE.Mesh(geometry, material);
	this.mesh.receiveShadow = true;
}

let earth;

let createEarth = () => {
	earth = new Earth();
	earth.mesh.position.y = -600;
	scene.add(earth.mesh);
}

let createScene = () => {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	var controls = new THREE.OrbitControls( camera );
	controls.enableDamping = true;

	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	document.getElementById('world').appendChild(renderer.domElement);

	window.addEventListener('resize', handleWindowResize, false);
}

let handleWindowResize = () => {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

let hemisphereLight, shadowLight;

let createLights = () => {
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

	shadowLight = new THREE.DirectionalLight(0xffffff, .9);
	shadowLight.position.set(150, 350, 350);
	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(hemisphereLight);
	scene.add(shadowLight);
}


let init = () => {
	createScene();
	createLights();
	// createBird();
	createEarth();
	// createSky();
	// loop();
}


window.addEventListener('load', init(), false);
