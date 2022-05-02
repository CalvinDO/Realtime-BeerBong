
let scene;
let ball;
let materials = {};
let shading = 'flat';
let renderer;
let gltf




let now = Date.now();
let deltaTime = 0


init();



function init() {

    //setupGui();

    setupSceneCamRenderer();

    addLights();

    instantiateMaterials();

    addBall();


    loadModels();

    addDrunkEffect();


    animate();
}


function loadModels() {
    // loader = THREE.GLTFLoader(); 
    //let loader = new THREE.GLTFLoader();
}

function setupSceneCamRenderer() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0;
    camera.position.z = 5;


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function addLights() {

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.1);
    scene.add(ambientLight);
}


function instantiateMaterials() {

    materials['wireframe'] = new THREE.MeshBasicMaterial({ wireframe: true });
    materials['flat'] = new THREE.MeshPhongMaterial({ specular: 0x000000, flatShading: true, side: THREE.DoubleSide });
    materials['smooth'] = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
    materials['glossy'] = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
}

function addBall() {

    const geometry = new THREE.SphereGeometry(1, 32, 16);

    ball = new Ball(geometry, materials[shading]);

    scene.add(ball);
    //ball.position.copy(currentPosition)
    ball.updatePhysics();
    console.log(ball.position);
}



function addDrunkEffect() {

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    console.log(planeGeometry.parameters.width);
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



function calculateDeltaTime() {
    ball.calculateDeltaTime();

    deltaTime = (Date.now() - now) / 1000
    now = Date.now()
}

function animate() {

    requestAnimationFrame(animate);

    calculateDeltaTime();

    ball.rotateY(1 * deltaTime)
    ball.rotateZ(1 * deltaTime)

    ball.updatePhysics();

    //shading = effectController.newShading;

    renderer.render(scene, camera);
}



/*
function setupGui() {

    effectController = {
        newShading: 'glossy'
    };

    const gui = new GUI();
    gui.add(effectController, 'newShading', ['wireframe', 'flat', 'smooth', 'glossy']).name('Shading').onChange(render);
}
*/