
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry();
//const material = new THREE.MeshPhongMaterial({ color: 0x90ff90 });
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
    vertexColors: true,
    shininess: 0
});

/*new THREE.ShaderMaterial({
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
});*/

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight(0x00ffff, 25);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x00ff00, 25);
scene.add(ambientLight);


console.log(directionalLight.position)

init();

function init() {
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    console.log(planeGeometry.parameters.width)
    let drunkLevel = 1.0; //0.5 = drunk; 6 = good
    let drunk = true;

    var planeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            size: {
                value: new THREE.Vector3(planeGeometry.parameters.width, planeGeometry.parameters.height, planeGeometry.parameters.depth).multiplyScalar(0.5)
            },
            u_resolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            length_center_to_corner: {

                value: new THREE.Vector2(window.innerWidth, window.innerHeight).length()
            },
            drunkStage: {
                value: drunkLevel
            },
            drunk: {
                value: drunk
            }
        },
        vertexShader: vertexShader,
        fragmentShader: [
            "uniform vec3 size;",
            "uniform vec2 u_resolution;",
            "uniform float length_center_to_corner;",
            "uniform float drunkStage;",
            "uniform bool drunk;",
            "void main()",
            "{",
            "if(drunk) {",
            "float rad = (size.x/0.9) * length_center_to_corner;",
            "vec2 pos = vec2((u_resolution.x/2.0), (u_resolution.y/2.0));",
            "float relPosX = abs(gl_FragCoord.x - pos.x);",
            "float relPosY = abs(gl_FragCoord.y - pos.y);",
            "float fragDist = sqrt((relPosX * relPosX) + (relPosY * relPosY));",
            "float circleInfo = (rad - fragDist)/rad;",
            "float value = smoothstep(1.0, 0.0, sqrt(circleInfo * drunkStage));",
            "gl_FragColor = vec4(1,1,1,value);",
            "} else {",
            "gl_FragColor = vec4(0.0,0.0,0.0,0 );",
            "}",
            "}"
        ].join("\n"),
        transparent: true,
        opacity: 0.0
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "drunkFilter";
    plane.position.set(0.0, 0.0, 4.9);
    scene.add(plane);
}

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