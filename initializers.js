/*jshint esversion: 6*/
let forest, earth, sky, bird;
let scene, camera, fieldOfView, aspectRatio, nearPlane,
    farPlane, HEIGHT, WIDTH, SWIDTH, SHEIGHT, renderer, container, mparticles, particles, particlesAngle = 0;
let hemisphereLight, shadowLight;
let dist = 0;
let offset = 10;
let lp = true;
let init = () => {
    if(scene) { 
        console.log(scene.children);
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]);
        }
    }
    particlesAngle = 0; 
    lp = true;
    speed = 0.003;
    frameC = 0;
    dist = 0;
    createScene();
    createForest();
    createLights();
    createBird();
    createEarth();
    createSky();
    createParticles();
    createMParticles();
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('click', handleClick, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('keydown', handleKeyPress, false);
    document.getElementById('gameover').style.display = 'none';
    document.getElementById('meters').style.display = 'block';  
    loop();
};

const toggleGameOver = () => {
    lp = false;
    document.getElementById('meters').style.display = 'none';
    document.getElementById('gameover').style.display = 'block';
}

const updateDist = () => {
    dist += speed * 1000 / 25;
    const el = document.getElementById('mtxt');
    el.innerHTML = `${Math.floor(dist)} m`
};

const updateBird = (frameC) => {
    const targetX = normalize(mousePos.x, -1, 1, -50, 50);
    const targetY = normalize(mousePos.y, -1, 1, 50, 150);
    bird.mesh.position.y += (targetY - bird.mesh.position.y) * 0.1;
    bird.mesh.position.x += (targetX - bird.mesh.position.x) * 0.1;
    bird.mesh.rotation.z = (targetY - bird.mesh.position.y) * 0.0128;
    bird.mesh.rotation.x = (bird.mesh.position.y - targetY) * 0.0064;
    const a = Math.PI / 4;
    bird.wings[0].rotation.x = Math.sin(frameC / (0.0015 * 17 / speed)) * a + Math.PI;
    bird.wings[1].rotation.x = Math.sin(-frameC / (0.0015 * 17 / speed)) * a;
};
// TODO: REMAKE THE BIRD'S GEOMETRY

const updateParticles = () => {
    for (let i = 0; i < particles.mesh.children.length; i++) {
        const p = particles.mesh.children[i];
        let bird_pos = new THREE.Vector3();
        bird.mesh.getWorldPosition(bird_pos);
        let p_pos = new THREE.Vector3();
        p.getWorldPosition(p_pos);
        var dist = (p_pos).distanceTo(bird_pos);
        if (dist < 12) {
            //  console.log(bird_pos, p_pos)
            particles.mesh.children.splice(i, 1);
            initX = bird.mesh.position.x;
            let isBack = false,
                current = 0;
            let moveBack = setInterval(function () {
                if (Math.sin((current / 400) * (Math.PI)) == 1) isBack = true;
                bird.mesh.position.x = initX +
                    isBack ?
                    -1 + Math.sin((current / 400) * (Math.PI)) * offset :
                    Math.sin((current / 400) * (Math.PI)) * offset;
                //console.log(Math.sin((current / 40) * (Math.PI)))
                if(current >= 39) clearInterval(moveBack);
                current += 1;
            }, 1);
            particles.respawn(Math.random() * 2 * Math.PI);
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

const createMParticles = () => {
    mparticles = new MParticles();
    mparticles.mesh.position.y = -600;
    scene.add(mparticles.mesh);
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

    var vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
    SHEIGHT = 2 * Math.tan( vFOV / 2 ) * 200; // visible height
    SWIDTH = SHEIGHT * camera.aspect;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    if(document.getElementById('world').children.length > 0) document.getElementById('world').removeChild(document.getElementById('world').childNodes[0])
    document.getElementById('world').appendChild(renderer.domElement);
    window.addEventListener('resize', handleWindowResize, false);
}