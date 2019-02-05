/*jshint esversion: 6 */
const loop = () => {
	earth.mesh.rotation.z += 0.005;
	sky.mesh.rotation.z += 0.001;
	forest.mesh.rotation.z += 0.005;	
	renderer.render(scene, camera);
	updatePlane();
	requestAnimationFrame(loop);
};


window.addEventListener('load', init(), false);
