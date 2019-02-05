/*jshint esversion: 6 */
const Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0,
	green: 0x2eb107
};
Earth = function () {
	const geometry = new THREE.CylinderGeometry(600, 600, 1000, 40, 10);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	const material = new THREE.MeshPhongMaterial({
		color: Colors.green,
		transparent: true,
		opacity: 6,
		flatShading: THREE.FlatShading
	});
	this.mesh = new THREE.Mesh(geometry, material);
	this.mesh.receiveShadow = true;
};

Cloud = function () {
	this.mesh = new THREE.Object3D();
	let geometry = new THREE.BoxGeometry(20, 20, 20);
	let material = new THREE.MeshPhongMaterial({
		color: Colors.white
	});
	let nBlocks = 3 + Math.floor(Math.random() * 3);
	for (var i = 0; i < nBlocks; i++) {
		var m = new THREE.Mesh(geometry, material);
		m.position.x = i * 15;
		m.position.y = Math.random() * 10;
		m.position.z = Math.random() * 10;
		m.rotation.z = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;
		var scale = 0.1 + Math.random() * 0.9;
		m.scale.set(scale, scale, scale);

		m.castShadow = true;
		m.receiveShadow = true;

		this.mesh.add(m);
	}

};

Sky = function () {
	this.mesh = new THREE.Object3D();

	const nClouds = 20;

	const stepAngle = Math.PI * 2 / nClouds;
	for (let i = 0; i < nClouds; i++) {
		const c = new Cloud();

		const ang = stepAngle * i;
		const h = 750 + Math.random() * 200;
		c.mesh.position.y = Math.sin(ang) * h;
		c.mesh.position.x = Math.cos(ang) * h;
		c.mesh.rotation.z = ang + Math.PI / 2;
		c.mesh.position.z = -400 - Math.random() * 400;
		var sc = 1 + Math.random() * 2;
		c.mesh.scale.set(sc, sc, sc);
		this.mesh.add(c.mesh);
	}
};

Box = function (w, h, d, c, x, y, z) {
	this.mesh = new THREE.Mesh(
		new THREE.BoxGeometry(w, h, d),
		new THREE.MeshPhongMaterial({
			color: c,
			flatShading: THREE.FlatShading
		})
	);
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	this.mesh.position.set(
		x === undefined ? 0 : x,
		y === undefined ? 0 : y,
		z === undefined ? 0 : z
	);
};

Bird = function () {
	this.mesh = new THREE.Object3D();
	this.body = new Box(60, 50, 50, Colors.red).mesh;
	this.head = new Box(27, 25, 25, Colors.pink, 35, 25).mesh;
	this.tail = new Box(15, 20, 5, Colors.pink, -35, 25, 0).mesh;
	this.wings = new Box(40, 8, 150, Colors.pink).mesh;
	this.neb = new Box(25, 5, 10, Colors.brown, 47.5, 25).mesh;
	this.mesh.add(this.body);
	this.mesh.add(this.head);
	this.mesh.add(this.tail);
	this.mesh.add(this.wings);
	this.mesh.add(this.neb);
};

Crown = function () {
	this.mesh = new THREE.Object3D();
	const nParts = 4 + Math.floor(Math.random() * 2);
	for (let i = 0; i < nParts; i++) {
		const l = new Box(
			20,
			20,
			20,
			Colors.green,
			-5 + Math.random() * 10,
			-5 + Math.random() * 10,
			-5 + Math.random() * 10
		);
		l.mesh.rotation.z = Math.random() * Math.PI * 2;
		l.mesh.rotation.y = Math.random() * Math.PI * 2;
		const s = 0.6 + Math.random() * 0.4;
		l.mesh.scale.set(s, s, s);
		this.mesh.add(l.mesh);
	}
};

Tree = function () {
	this.mesh = new THREE.Object3D();
	this.height = 30 + Math.random() * 70;
	this.size = this.height / 100;
	this.crown = new Crown();
	this.crown.mesh.scale.set(this.size, this.size, this.size);
	this.crown.mesh.position.z = this.height + 10;
	this.trunk = new Box(
		this.size * 15,
		this.height,
		this.size * 15,
		Colors.brownDark,
		0,
		this.height / 2
	);
	this.mesh.add(this.trunk.mesh);
	this.mesh.add(this.crown.mesh);
};

Forest = function () {
	this.mesh = new THREE.Object3D();
	this.nTrees = 30;

	const stepAngle = Math.PI / this.nTrees;

	for (let i = 0; i < this.nTrees; i++) {
		const t = new Tree();
		const a = stepAngle * i;
		const h = -600;
		t.mesh.position.x = Math.cos(a) * h;
		t.mesh.position.y = Math.sin(a) * h;
		t.mesh.rotation.z = a + Math.PI / 2;
		t.mesh.position.z = -400 - Math.random() * 400;
		this.mesh.add(t.mesh);

	}
};
