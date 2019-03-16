/*jshint esversion: 6 */
let frameC = 0;
let speed = 0.003;
const loop = () => {
	earth.mesh.rotation.z += speed;
	sky.mesh.rotation.z += speed * 0.2;
	forest.mesh.rotation.z += speed;
	particles.mesh.rotation.z += speed;	
	mparticles.mesh.rotation.z += speed;		
	renderer.render(scene, camera);
	updateBird(frameC);
	updateDist();
	updateParticles();
	frameC ++;
	speed += 0.0000002;
    if(lp == true) requestAnimationFrame(loop);
};


window.addEventListener('load', init(), false);