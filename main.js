
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry();
//const material = new THREE.MeshPhongMaterial({ color: 0x90ff90 });
var material = new THREE.ShaderMaterial({
    uniforms: {
        size: {
            value: new THREE.Vector3(geometry.parameters.width, geometry.parameters.height, geometry.parameters.depth).multiplyScalar(0.5)
        },
        thickness: {
            value: 0.05
        },
        smoothness: {
            value: 0.05
        }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight(0x00ffff, 25);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x00ff00, 25);
scene.add(ambientLight);


console.log(directionalLight.position)



let now = 0
let deltaTime = 0

function calculateDeltaTime() {
    deltaTime = (Date.now() - now) / 1000
    now = Date.now()
}

function animate() {
    requestAnimationFrame(animate);

    calculateDeltaTime();

    cube.rotateY(1 * deltaTime)
    cube.rotateZ(1 * deltaTime)

    renderer.render(scene, camera);
}

animate();