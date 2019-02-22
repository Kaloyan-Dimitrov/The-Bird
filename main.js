/*jshint esversion: 6 */
let frameC = 0;
let speed = 0.003;
const loop = () => {
	earth.mesh.rotation.z += speed;
	sky.mesh.rotation.z += speed * 0.2;
	forest.mesh.rotation.z += speed;
	//particles.mesh.rotation.z += speed;
	//particlesAngle += speed;	
	renderer.render(scene, camera);
	updateBird(frameC);
	updateParticles();
	requestAnimationFrame(loop);
	frameC ++;
	speed += 0.0000002;
};


window.addEventListener('load', init(), false);
