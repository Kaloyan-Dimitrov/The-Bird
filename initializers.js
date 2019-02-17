/*jshint esversion: 6*/
let forest, earth, sky, bird;
let scene, camera, fieldOfView, aspectRatio, nearPlane,
    farPlane, HEIGHT, WIDTH, renderer, container, particles, particlesAngle = 0;
let hemisphereLight, shadowLight;
let init = () => {
    createScene();
    createForest();
    createLights();
    createBird();
    createEarth();
    createSky();
    createParticles();
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    loop();
};

const updateBird = (frameC) => {
    const targetX = normalize(mousePos.x, -1, 1, -50, 50);
    const targetY = normalize(mousePos.y, -1, 1, 50, 150);
    bird.mesh.position.y += (targetY - bird.mesh.position.y) * 0.1;
    bird.mesh.position.x += (targetX - bird.mesh.position.x) * 0.1;
    bird.mesh.rotation.z = (targetY - bird.mesh.position.y) * 0.0128;
    bird.mesh.rotation.x = (bird.mesh.position.y - targetY) * 0.0064;
    const a = Math.PI / 4;
    bird.wings[0].rotation.x = Math.sin(frameC / (17 - speed / 0.0015 * 17)) * a + Math.PI;
    bird.wings[1].rotation.x = Math.sin(-frameC / (17 - speed / 0.0015 * 17)) * a;
};
// TODO: REMAKE THE BIRD'S GEOMETRY

const updateParticles = () => {
    particles.mesh.children.forEach(p => {
        p.name += speed;
        p.position.x = Math.cos(p.name) * -700;
        p.position.y = Math.sin(p.name) * -700 -50 + Math.random() * 100;
    }); 
    for (let i = 0; i < particles.mesh.children.length; i++) {
        const p = particles.mesh.children[i];
        var dist = (new THREE.Vector2(bird.mesh.position.x, bird.mesh.position.y))
            .distanceTo(new THREE.Vector2(p.position.x, p.position.y - 600)); // TODO: GetWorldPosition - global position getter
        if(dist < 43) {       
            particles.mesh.children.splice(i, 1);
        }
    }
};
const normalize = (v, vmin, vmax, tmin, tmax) => {
    const nv = Math.max(Math.min(v, vmax), vmin);
    const dv = vmax - vmin;
    const pc = (nv - vmin) / dv;
    const dt = tmax - tmin;
    const tv = tmin + (pc * dt);
    return tv;
};

const distance = (ax, ay, bx, by) => {
    const a = Math.abs(ax - bx);
    const b = Math.abs(ay - by);
    const c = Math.sqrt(a * a + b * b);
    return c;
}
let createLights = () => {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
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
};
const createForest = () => {
    forest = new Forest();
    forest.mesh.position.y = -600;
    scene.add(forest.mesh);
};

const createEarth = () => {
    earth = new Earth();
    earth.mesh.position.y = -600;
    scene.add(earth.mesh);
};

const createParticles = () => {
    particles = new Particles();
    particles.mesh.position.y = -600;
    scene.add(particles.mesh);
}

const createSky = () => {
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
};

const createBird = () => {
    bird = new Bird();
    bird.mesh.scale.set(0.25, 0.25, 0.25);
    bird.mesh.position.y = 100;
    scene.add(bird.mesh);
};

const createScene = () => {
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
};