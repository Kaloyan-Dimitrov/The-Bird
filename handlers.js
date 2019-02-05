/*jshint esversion: 6*/ 
let mousePos = {
	x: 0,
	y: 0
};
const handleWindowResize = () => {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
};

const handleMouseMove = (event) => {
	const tx = -1 + (event.clientX / WIDTH) * 2;
	const ty = -1 + (event.clientY / HEIGHT) * 2;
	mousePos = {
		x: tx,
		y: -ty
	};
};