import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { Ball } from './Ball.js'
import { Cup } from './Cup.js'
import { ARButton } from './ARButton.js'


document.addEventListener("keydown", onKeyDown)

let scene;
let ball;
let materials = {};
let shading = 'smooth';
let renderer;
let camera;
let controls;
const loader = new GLTFLoader();

let orbitControls = false;
let ballThrow = true;

var renderingScene;
var bufferTexture;

if (ballThrow) {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);

}


let gravity = new THREE.Vector3(0, -9.81, 0);

let pCups = [
    // yours
    // 1. row
    {
        x: 0,
        y: 0.67,
        z: 0.85
    },
    // 2. row
    {
        x: 0.045,
        y: 0.67,
        z: 0.93
    },
    {
        x: -0.045,
        y: 0.67,
        z: 0.93
    },
    // 3. row
    {
        x: -0.09,
        y: 0.67,
        z: 1.01
    },
    {
        x: 0,
        y: 0.67,
        z: 1.01
    },
    {
        x: 0.09,
        y: 0.67,
        z: 1.01
    },
    // 4. row
    {
        x: 0.135,
        y: 0.67,
        z: 1.09
    },
    {
        x: 0.045,
        y: 0.67,
        z: 1.09
    },
    {
        x: -0.135,
        y: 0.67,
        z: 1.09
    },
    {
        x: -0.045,
        y: 0.67,
        z: 1.09
    },
    // water cup
    {
        x: 0.21,
        y: 0.67,
        z: 0.75
    },

    // enemies
    //1. row
    {
        x: 0,
        y: 0.67,
        z: -0.85
    },
    // 2. row
    {
        x: 0.045,
        y: 0.67,
        z: -0.93
    },
    {
        x: -0.045,
        y: 0.67,
        z: -0.93
    },
    // 3. row
    {
        x: -0.09,
        y: 0.67,
        z: -1.01
    },
    {
        x: 0,
        y: 0.67,
        z: -1.01
    },
    {
        x: 0.09,
        y: 0.67,
        z: -1.01
    },
    // 4. row
    {
        x: 0.135,
        y: 0.67,
        z: -1.09
    },
    {
        x: 0.045,
        y: 0.67,
        z: -1.09
    },
    {
        x: -0.135,
        y: 0.67,
        z: -1.09
    },
    {
        x: -0.045,
        y: 0.67,
        z: -1.09
    },
    // water cup
    {
        x: -0.21,
        y: 0.67,
        z: -0.75
    }
]

let pTable = {
    x: 0,
    y: 0,
    z: 0
}

let now = Date.now();
let deltaTime = 0.018;

let mouseDownPos = new THREE.Vector2();
let mouseUpPos = new THREE.Vector2();


let cups = [];

init();


function init() {

    //setupGui();

    setupSceneCamRenderer();

    addLights();

    instantiateMaterials();

    addBall();

    addCups();

    loadModel('Table.glb', pTable)

    addDrunkEffect();

    if (orbitControls) {
        installOrbitControls();
    }



    animate();
}



function addCups() {
    let i = 0
    for (let pCup of pCups) {
        let src = ''
        if (i <= 10) {
            src = 'RedCup.glb'
        } else {
            src = 'BlueCup.glb'
        }
        loadModel(src, pCup)
        i++
    }
    // loadModel('Cup.glb', pCups[0])
}

function installOrbitControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
}

function loadModel(model, position) {
    loader.load('../Assets/' + model, function (glb) {
        // console.log(glb)
        const root = glb.scene
        // root.scale.set(1.5, 1.5, 1.5)

        if (model == 'RedCup.glb' || model == 'BlueCup.glb') {

            let newCup = new Cup(root);
            newCup.position.set(position.x, position.y, position.z)

            cups.push(newCup);
            scene.add(newCup);

            //console.log("own Cup Object: ", newCup);

        } else {
            root.position.set(position.x, position.y, position.z)
            scene.add(root);
        }

    }, function (xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, function (error) {
        // console.log('ERROR: ', error)
    })
}


// async function loadModels() {
//
//     // loader = THREE.GLTFLoader();
//     //let loader = new THREE.GLTFLoader();
//     let table = await Importer.import("Assets/Table.obj");
//     scene.add(table);
//
//     let cup = await Importer.import("Assets/Cup.obj");
//     scene.add(cup);
// }

function setupSceneCamRenderer() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xdddddd)

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.3;
    camera.position.z = 1.6;
    camera.rotation.x = -0.5;


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer));
    renderer.xr.enabled = true;

    //// This is where we create our off-screen render target ////
 
    // Create a different scene to hold our buffer objects
    renderingScene = new THREE.Scene();
    // Create the texture that will store our result
    bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
    var boxMaterial = new THREE.MeshBasicMaterial({map:bufferTexture});
    var boxGeometry2 = new THREE.BoxGeometry( 5, 5, 5 );
    var mainBoxObject = new THREE.Mesh(boxGeometry2,boxMaterial);

    // Move it back so we can see it
    mainBoxObject.position.z = -10;
    // Add it to the main scene
    renderingScene.add(mainBoxObject);
}

function addLights() {

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0)
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const spotLight1 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight1.position.set(0, 300, 500)
    scene.add(spotLight1)

    const spotLight2 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight2.position.set(500, 100, 0)
    scene.add(spotLight2)

    const spotLight3 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight3.position.set(0, 100, -500)
    scene.add(spotLight3)

    const spotLight4 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight4.position.set(-500, 300, 0)
    scene.add(spotLight4)
}


function instantiateMaterials() {

    materials['wireframe'] = new THREE.MeshBasicMaterial({ wireframe: true });
    materials['flat'] = new THREE.MeshPhongMaterial({ specular: 0x000000, flatShading: true, side: THREE.DoubleSide });
    materials['smooth'] = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
    materials['glossy'] = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
}

function addBall() {

    ball = new Ball(materials[shading], gravity);

    scene.add(ball);
    //ball.position.copy(currentPosition)
    ball.updatePosition();
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
    deltaTime = (Date.now() - now) / 1000;
    now = Date.now();
}

function animate() {

    calculateDeltaTime();

    if (ball) {
        ball.rotateY(1 * deltaTime)
        ball.rotateZ(1 * deltaTime)

        ball.updatePhysics(deltaTime);
    }


    cups.forEach(cup => cup.update());

    //shading = effectController.newShading;

    if (controls) {
        controls.update()
    }

    requestAnimationFrame(animate);

    renderer.render(scene,camera,bufferTexture);

    //Finally, draw to the screen
    renderer.render( renderingScene, camera );

    

}



function onTouchStart(_event){
    mouseDownPos = new THREE.Vector2(_event.touches[0].clientX, _event.touches[0].clientY);
}

function onTouchEnd(_event){
    mouseUpPos = new THREE.Vector2(_event.changedTouches[0].clientX, _event.changedTouches[0].clientY);

    let swipe = mouseUpPos.sub(mouseDownPos);
    // console.log(swipe);
    //console.log(ball.position);
    ball.toss(swipe);
}

function onMouseDown(_event) {
    mouseDownPos = new THREE.Vector2(_event.clientX, _event.clientY);
}

function onMouseUp(_event) {
    mouseUpPos = new THREE.Vector2(_event.clientX, _event.clientY);

    let swipe = mouseUpPos.sub(mouseDownPos);
    // console.log(swipe);
    //console.log(ball.position);
    ball.toss(swipe);
}

function onKeyDown(_event) {
    // console.log(_event)
    if (_event.code === 'Space') {
        ball.setBack()
    }
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