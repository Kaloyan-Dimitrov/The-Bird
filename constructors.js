<<<<<<< HEAD
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
    const geometry = new THREE.CylinderGeometry(600, 600, 2000, 40, 10);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geometry.mergeVertices();
    for (const v of geometry.vertices) {
        v.x += Math.cos(Math.random() * Math.PI * 2) * (5 + Math.random() * 15);
        v.y += Math.sin(Math.random() * Math.PI * 2) * (5 + Math.random() * 15);

    }
    const material = new THREE.MeshPhongMaterial({
        color: Colors.green,
        transparent: true,
        opacity: 6,
        flatShading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.geometry.verticesNeedUpdate = true;
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
// TODO: ADD COLLIDERS


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
    this.body = new THREE.Mesh(
        new THREE.CylinderGeometry(25, 25, 60, 9),
        new THREE.MeshPhongMaterial({
            color: Colors.red,
            flatShading: THREE.FlatShading
        })
    );
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.body.rotation.z += Math.PI / 2;
    this.head = new THREE.Mesh(
        new THREE.IcosahedronGeometry(20, 1),
        new THREE.MeshPhongMaterial({
            color: Colors.pink,
            flatShading: THREE.FlatShading
        })
    );
    this.head.position.set(35, 25, 0);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.tail = new THREE.Mesh(
        new THREE.ConeGeometry(25, 50),
        new THREE.MeshPhongMaterial({
            color: Colors.red,
            flatShading: THREE.FlatShading
        })
    );
    this.tail.position.set(-this.body.geometry.parameters.height / 2 - this.tail.geometry.parameters.height / 2, 0, 0);
    this.tail.castShadow = true;
    this.tail.receiveShadow = true;
    this.tail.rotation.z += Math.PI / 2;
    this.tail.geometry.vertices[0].x = 30;
    this.wings = [new THREE.Object3D(), new THREE.Object3D()];
    this.wingLenght = 48;
    this.wingShape = new THREE.Shape();
    this.wingShape.moveTo(20, 0);
    this.wingShape.lineTo(-20, 0);
    this.wingShape.lineTo(-15, this.wingLenght);
    this.wingShape.lineTo(15, this.wingLenght);
    this.wingShape.lineTo(20, 0);
    const extrudeSettings = {
        steps: 2,
        depth: 8,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
    };
    this.wings[0].add(new THREE.Mesh(
        new THREE.ExtrudeGeometry(this.wingShape, extrudeSettings),
        new THREE.MeshPhongMaterial({
            color: Colors.pink,
            flatShading: THREE.FlatShading
        })
    ));
    this.wings[0].children[0].castShadow = true;
    this.wings[0].children[0].recieveShadow = true;
    this.wings[0].children[0].rotation.x = Math.PI / 2;
    this.wings[0].position.set(0, 0, -this.body.geometry.parameters.radiusTop);
    this.wings[1].add(new THREE.Mesh(
        new THREE.ExtrudeGeometry(this.wingShape, extrudeSettings),
        new THREE.MeshPhongMaterial({
            color: Colors.pink,
            flatShading: THREE.FlatShading
        })
    ));
    this.wings[1].children[0].castShadow = true;
    this.wings[1].children[0].recieveShadow = true;
    this.wings[1].children[0].rotation.x = Math.PI / 2 + Math.PI * 2;
    this.wings[1].position.set(0, 0, this.body.geometry.parameters.radiusTop);
    this.neb = new Box(25, 5, 10, Colors.brown, 47.5, 25).mesh;
    this.mesh.add(this.body);
    this.mesh.add(this.head);
    this.mesh.add(this.tail);
    this.mesh.add(this.wings[0]);
    this.mesh.add(this.wings[1]);
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
    this.crown.mesh.scale.set(this.size * 6, this.size * 6, this.size * 6);
    this.crown.mesh.position.y = this.height + 10;
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

    const stepAngle = Math.PI * 2 / this.nTrees;

    for (let i = 0; i < this.nTrees; i++) {
        const t = new Tree();
        const a = stepAngle * i;
        const h = -600;
        t.mesh.position.x = Math.cos(a) * h;
        t.mesh.position.y = Math.sin(a) * h;
        t.mesh.rotation.z = a + Math.PI / 2;
        t.mesh.position.z = -200 - Math.random() * 400;
        this.mesh.add(t.mesh);
    }
};
Particle = function (d, x, y, z) {
    this.mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(d, 1),
        new THREE.MeshPhongMaterial({
            color: Colors.blue,
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

Particles = function () {
    this.mesh = new THREE.Object3D();
    this.nCandies = 50;
    const stepAngle = Math.PI * 2 / this.nCandies;
    for (let i = 0; i < this.nCandies; i++) {
        const a = stepAngle * i - Math.PI / this.nCandies + Math.random() * (Math.PI * 2 / this.nCandies);
        const h = -700;
        const p = new Particle(5, Math.cos(a) * h, Math.sin(a) * h -50 + Math.random() * 100);
        p.mesh.rotation.z = a + Math.PI / 2;
        this.mesh.add(p.mesh);
        p.mesh.name = a;
    }
=======
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
    const geometry = new THREE.CylinderGeometry(600, 600, 2000, 40, 10);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geometry.mergeVertices();
    for (const v of geometry.vertices) {
        v.x += Math.cos(Math.random() * Math.PI * 2) * (5 + Math.random() * 15);
        v.y += Math.sin(Math.random() * Math.PI * 2) * (5 + Math.random() * 15);

    }
    const material = new THREE.MeshPhongMaterial({
        color: Colors.green,
        transparent: true,
        opacity: 6,
        flatShading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.geometry.verticesNeedUpdate = true;
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
// TODO: ADD COLLIDERS


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
    this.body = new THREE.Mesh(
        new THREE.CylinderGeometry(25, 25, 60, 9),
        new THREE.MeshPhongMaterial({
            color: Colors.red,
            flatShading: THREE.FlatShading
        })
    );
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.body.rotation.z += Math.PI / 2;
    this.head = new THREE.Mesh(
        new THREE.IcosahedronGeometry(20, 1),
        new THREE.MeshPhongMaterial({
            color: Colors.pink,
            flatShading: THREE.FlatShading
        })
    );
    this.head.position.set(35, 25, 0);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.tail = new THREE.Mesh(
        new THREE.ConeGeometry(25, 50),
        new THREE.MeshPhongMaterial({
            color: Colors.red,
            flatShading: THREE.FlatShading
        })
    );
    this.tail.position.set(-this.body.geometry.parameters.height / 2 - this.tail.geometry.parameters.height / 2, 0, 0);
    this.tail.castShadow = true;
    this.tail.receiveShadow = true;
    this.tail.rotation.z += Math.PI / 2;
    this.tail.geometry.vertices[0].x = 30;
    this.wings = [new THREE.Object3D(), new THREE.Object3D()];
    this.wingLenght = 48;
    this.wingShape = new THREE.Shape();
    this.wingShape.moveTo(20, 0);
    this.wingShape.lineTo(-20, 0);
    this.wingShape.lineTo(-15, this.wingLenght);
    this.wingShape.lineTo(15, this.wingLenght);
    this.wingShape.lineTo(20, 0);
    const extrudeSettings = {
        steps: 2,
        depth: 8,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
    };
    this.wings[0].add(new THREE.Mesh(
        new THREE.ExtrudeGeometry(this.wingShape, extrudeSettings),
        new THREE.MeshPhongMaterial({
            color: Colors.pink,
            flatShading: THREE.FlatShading
        })
    ));
    this.wings[0].children[0].castShadow = true;
    this.wings[0].children[0].recieveShadow = true;
    this.wings[0].children[0].rotation.x = Math.PI / 2;
    this.wings[0].position.set(0, 0, -this.body.geometry.parameters.radiusTop);
    this.wings[1].add(new THREE.Mesh(
        new THREE.ExtrudeGeometry(this.wingShape, extrudeSettings),
        new THREE.MeshPhongMaterial({
            color: Colors.pink,
            flatShading: THREE.FlatShading
        })
    ));
    this.wings[1].children[0].castShadow = true;
    this.wings[1].children[0].recieveShadow = true;
    this.wings[1].children[0].rotation.x = Math.PI / 2 + Math.PI * 2;
    this.wings[1].position.set(0, 0, this.body.geometry.parameters.radiusTop);
    this.neb = new Box(25, 5, 10, Colors.brown, 47.5, 25).mesh;
    this.mesh.add(this.body);
    this.mesh.add(this.head);
    this.mesh.add(this.tail);
    this.mesh.add(this.wings[0]);
    this.mesh.add(this.wings[1]);
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
    this.crown.mesh.scale.set(this.size * 6, this.size * 6, this.size * 6);
    this.crown.mesh.position.y = this.height + 10;
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

    const stepAngle = Math.PI * 2 / this.nTrees;

    for (let i = 0; i < this.nTrees; i++) {
        const t = new Tree();
        const a = stepAngle * i;
        const h = -600;
        t.mesh.position.x = Math.cos(a) * h;
        t.mesh.position.y = Math.sin(a) * h;
        t.mesh.rotation.z = a + Math.PI / 2;
        t.mesh.position.z = -200 - Math.random() * 400;
        this.mesh.add(t.mesh);
    }
};
Particle = function (d, x, y, z) {
    this.mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(d, 1),
        new THREE.MeshPhongMaterial({
            color: Colors.blue,
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

Particles = function () {
    this.mesh = new THREE.Object3D();
    this.nCandies = 50;
    const stepAngle = Math.PI * 2 / this.nCandies;
    for (let i = 0; i < this.nCandies; i++) {
        const a = stepAngle * i - Math.PI / this.nCandies + Math.random() * (Math.PI * 2 / this.nCandies);
        const h = -700;
        const p = new Particle(5, Math.cos(a) * h, Math.sin(a) * h -50 + Math.random() * 100);
        p.mesh.rotation.z = a + Math.PI / 2;
        this.mesh.add(p.mesh);
        p.mesh.name = a;
    }
>>>>>>> a6f383b153d6e032897d0dac2eec540fd628da02
}