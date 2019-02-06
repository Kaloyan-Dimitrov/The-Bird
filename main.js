/*jshint esversion: 6 */
let frameC = 0;
const loop = () => {
	earth.mesh.rotation.z += 0.005;
	sky.mesh.rotation.z += 0.001;
	forest.mesh.rotation.z += 0.005;	
	renderer.render(scene, camera);
	updateBird(frameC);
	requestAnimationFrame(loop);
	frameC ++;
	
};


window.addEventListener('load', init(), false);
