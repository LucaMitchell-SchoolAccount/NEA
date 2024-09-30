

// SETUP

const canvas = document.getElementById('map');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0);
camera.lookAt(0, 0, 1)

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.02;
controls.movementSpeed = 0;
controls.activeLook = false;

canvas.addEventListener("mouseover", () => {
    canvas.addEventListener("mousedown", () => {
        controls.activeLook = true
    })
})

canvas.addEventListener("mouseout", () => {
    controls.activeLook = false
})

canvas.addEventListener("mouseup", () => {
    controls.activeLook = false
})

canvas.addEventListener("wheel", (event) => {
    if (event.deltaY < 0) {
        camera.fov = Math.max(1, camera.fov - 1);
    } else {
        camera.fov = Math.min(120, camera.fov + 1);
    }
    camera.updateProjectionMatrix();
});




// GEOMETRY

const textureLoader = new THREE.TextureLoader();
const starSprite = textureLoader.load('star.png');
scene.background = textureLoader.load('sky.jpg')

const equatorGeometry = new THREE.CircleGeometry(100, 4);
const equatorMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    depthTest: false,
    wireframe: true
});
const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
equator.rotation.x = Math.PI / 2;
scene.add(equator);

const refGeometry = new THREE.SphereGeometry(2, 20);
const refMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
const ref = new THREE.Mesh(refGeometry, refMaterial);
ref.position.set(0, 0, 100)
scene.add(ref);

function createStar(d, ra, de, sf) {

    const phi = THREE.MathUtils.degToRad(90 - de);
    const theta = THREE.MathUtils.degToRad(-ra);

    x = d*Math.sin(phi)*Math.sin(theta)
    y = d*Math.cos(phi)
    z = d*Math.sin(phi)*Math.cos(theta)

    const starMaterial = new THREE.SpriteMaterial({
        map: starSprite
    });
    const star = new THREE.Sprite(starMaterial);
    star.position.set(x, y, z)
    star.scale.set(sf, sf, 1)
    scene.add(star);
}

for (let i=0; i<1000; i++) {
    d = Math.max(Math.random() * 500, 100)
    ra = Math.random() * 360
    de = Math.random() * 360
    sf = 5
    createStar(d, ra, de, sf)
}



// ESSENTIALS

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate() {
    requestAnimationFrame(animate);
    controls.update(0.1);
    renderer.render(scene, camera);
}

animate();
