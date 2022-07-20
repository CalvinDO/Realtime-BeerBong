import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/ShaderPass.js';
import { SwayAndTunnelShader, GaussFilterShader, DrunkMultiplierShader } from './customShader.js';
import { Ball } from './Ball.js'
import {ARButton} from './ARButton.js'


document.addEventListener("keydown", onKeyDown)

///////////////////////////////////////////////////////////////////////
/*///////////////////////////// Global Variables//////////////////// */
///////////////////////////////////////////////////////////////////////

let scene;
let ball;
let materials = {};
let shading = 'flat';
let renderer;
let composer;
let camera;
let controls;
const loader = new GLTFLoader();

let orbitControls = false;
let ballThrow = true;

let swayAndTunnelShader;
let gaussFilterShader;
let drunkMultiplierShader;

if (ballThrow) {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
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
] // Positions which we tested with the orbit controlls ui

let pTable = {
    x: 0,
    y: 0,
    z: 0
} 

let now = Date.now();
let deltaTime = 0.018;

let mouseDownPos = new THREE.Vector2();
let mouseUpPos = new THREE.Vector2();


///////////////////////////////////////////////////////////////////////
/*///////////////////////////// Functions ////////////////////////// */
///////////////////////////////////////////////////////////////////////


///////////// Instantiate everything

init();


function init() {

    setupSceneCamRenderer();

    addLights();

    instantiateMaterials();

    addBall();

    addCups();

    loadModel('Table.glb', pTable)

    if (orbitControls) {
        installOrbitControls();
    }

    animate();
}


///////////// functions to set up the scene

function installOrbitControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
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
}

// used for the table and the cups
function loadModel(model, position) {
    loader.load('Assets/' + model, function (glb) {
        const root = glb.scene
        root.position.set(position.x, position.y, position.z)
        scene.add(root)
    }, function (xhr) {
        // 
    }, function (error) {
        // 
    })
}

function setupSceneCamRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.3;
    camera.position.z = 2.3;
    camera.rotation.x = -0.5


    document.body.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer));

    composer = new EffectComposer( renderer );

    //Adding all the Passes to create the Post Processing
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass ); 

    swayAndTunnelShader = new ShaderPass( SwayAndTunnelShader ); 
    composer.addPass( swayAndTunnelShader );

    gaussFilterShader = new ShaderPass( GaussFilterShader ); 
    composer.addPass( gaussFilterShader );

    drunkMultiplierShader = new ShaderPass( DrunkMultiplierShader ); 
    composer.addPass( drunkMultiplierShader );
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
    const geometry = new THREE.SphereGeometry(0.02, 32, 16);
    ball = new Ball(geometry, materials[shading], gravity);
    scene.add(ball);
    ball.updatePosition();
}


///////////// functions to controll Runtime

function calculateDeltaTime() {
    deltaTime = (Date.now() - now) / 1000;
    now = Date.now();
}

function onMouseDown(_event) {
    mouseDownPos = new THREE.Vector2(_event.clientX, _event.clientY);
}

function onMouseUp(_event) {
    mouseUpPos = new THREE.Vector2(_event.clientX, _event.clientY);

    let swipe = mouseUpPos.sub(mouseDownPos);
    ball.toss(swipe);
}

function onKeyDown(_event) {
    if (_event.code === 'Space') {
        ball.setBack()
    }
}

///////////// Game Loop

function animate(time) {
    swayAndTunnelShader.uniforms.amount.value = time/1000;
    drunkMultiplierShader.uniforms.amount.value = time/1000;
    requestAnimationFrame(animate);
    
    calculateDeltaTime()
    if (ball) {
        ball.rotateY(1 * deltaTime)
        ball.rotateZ(1 * deltaTime)
        ball.updatePhysics(deltaTime);
    }

    if (controls) {
        controls.update()
    }
    composer.render(deltaTime);
}