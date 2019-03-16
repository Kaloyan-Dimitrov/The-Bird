/*jshint esversion: 6*/ 
let mousePos = {
	x: 0,
	y: 0
};
const handleWindowResize = () => {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	var vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
    SHEIGHT = 2 * Math.tan( vFOV / 2 ) * 200; // visible height
    SWIDTH = SHEIGHT * camera.aspect;
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

const handleTouchMove = (event) => {
	event.preventDefault();
    const tx = -1 + (event.touches[0].clientX / WIDTH) * 2;
    const ty = -1 + (event.touches[0].clientY / HEIGHT) * 2;
    mousePos = {
        x: tx,
        y: -ty
    };
};

const handleClick = (event) => {
	const mx = normalize(mousePos.x, -1, 1, -235, 235);	
	const my = -normalize(mousePos.y, -1, 1, 107, -107) + 105;
	// bird.mesh.position.x = mx;
	// bird.mesh.position.y = my;

	mparticles.mesh.children.forEach(p => {
		const p_pos = new THREE.Vector3();
		p.getWorldPosition(p_pos);
		const px = p_pos.x;
		const py = p_pos.y;
		if(Math.sqrt((mx - px) * (mx - px) + (my - py) * (my - py)) <= 22) p.material.color.g = 1;
	});
	// console.log(mx, my);
}

const handleKeyPress = (event) => {
	if(event.key == 'Escape') {
		toggleGameOver();
	}
}