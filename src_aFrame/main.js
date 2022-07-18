import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { Ball } from './Ball.js'
import { Cup } from './Cup.js'
import { Marker } from './Marker.js';
import { Camera } from './Camera.js';
import { Scene } from './Scene.js';
import { ScaleEntity } from './ScaleEntity.js';


///////////////////////////////////////////////////////////////////////
/*///////////////////////////// Global Variables//////////////////// */
///////////////////////////////////////////////////////////////////////
let ball;
let renderer;
let camera;
let controls;
const loader = new GLTFLoader();

let orbitControls = false;
let ballThrow = true;


let scale = 4.5; // fitting for our Model to get realistic sizes 

if (ballThrow) {
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
}

let startTime = Date.now() // used for the shader to get the time since start
let drunk = true;
let drunkStage = 0.9;


let gravity = new THREE.Vector3(0, -9.81, 0);
let pCups = [
    // yours
    // 1. row
    {
        x: 0,
        y: 0.67,
        z: 0.85,
        id: "red1"
    },
    // 2. row
    {
        x: 0.045,
        y: 0.67,
        z: 0.93,
        id: "red3"
    },
    {
        x: -0.045,
        y: 0.67,
        z: 0.93,
        id: "red2"
    },
    // 3. row
    {
        x: -0.09,
        y: 0.67,
        z: 1.01,
        id: "red4"
    },
    {
        x: 0,
        y: 0.67,
        z: 1.01,
        id: "red5"
    },
    {
        x: 0.09,
        y: 0.67,
        z: 1.01,
        id: "red6"
    },
    // 4. row
    {
        x: 0.135,
        y: 0.67,
        z: 1.09,
        id: "red10"
    },
    {
        x: 0.045,
        y: 0.67,
        z: 1.09,
        id: "red9"
    },
    {
        x: -0.135,
        y: 0.67,
        z: 1.09,
        id: "red8"
    },
    {
        x: -0.045,
        y: 0.67,
        z: 1.09,
        id: "red7"
    },
    // water cup
    {
        x: 0.21,
        y: 0.67,
        z: 0.75,
        id: "red11"
    },

    // enemies
    //1. row
    {
        x: 0,
        y: 0.67,
        z: -0.85,
        id: "blue1"
    },
    // 2. row
    {
        x: 0.045,
        y: 0.67,
        z: -0.93,
        id: "blue2"
    },
    {
        x: -0.045,
        y: 0.67,
        z: -0.93,
        id: "blue3"
    },
    // 3. row
    {
        x: -0.09,
        y: 0.67,
        z: -1.01,
        id: "blue6"
    },
    {
        x: 0,
        y: 0.67,
        z: -1.01,
        id: "blue5"
    },
    {
        x: 0.09,
        y: 0.67,
        z: -1.01,
        id: "blue4"
    },
    // 4. row
    {
        x: 0.135,
        y: 0.67,
        z: -1.09,
        id: "blue7"
    },
    {
        x: 0.045,
        y: 0.67,
        z: -1.09,
        id: "blue8"
    },
    {
        x: -0.135,
        y: 0.67,
        z: -1.09,
        id: "blue9"
    },
    {
        x: -0.045,
        y: 0.67,
        z: -1.09,
        id: "blue10"
    },
    // water cup
    {
        x: -0.21,
        y: 0.67,
        z: -0.75,
        id: "blue11"
    }
] // Positions which we tested with the orbit controlls ui

let now = Date.now();
let deltaTime = 0.018; //fixed assumend framerate

let mouseDownPos = new THREE.Vector2();
let mouseUpPos = new THREE.Vector2();

let cups = [];

///////////////////////////////////////////////////////////////////////
/*///////////////////////////// Functions ////////////////////////// */
///////////////////////////////////////////////////////////////////////
 
///////////// functions to set up the scene

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

function installOrbitControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
}

function loadModel(model, position) {
    loader.load('Assets/' + model, function (glb) {

        const root = glb.scene;

        if (model == 'RedCup.glb' || model == 'BlueCup.glb') {

            let newCupaFrame = document.createElement("a-entity");
            newCupaFrame.setAttribute("position", position.x + " " + position.y + " " + position.z);
            newCupaFrame.setAttribute("scale", "1.0 1.0 1.0");
            newCupaFrame.setAttribute("gltf-model", './Assets/' + model);

            ScaleEntity.instance.appendChild(newCupaFrame);

            let newCup;
            if (position.id == "red11" || position.id == "blue11") {
                
                newCup = new Cup(newCupaFrame, position.id, position, true);
            } else {
                newCup = new Cup(newCupaFrame, position.id, position, false);
            }

            cups.push(newCup);
        } else {
            root.position.set(position.x, position.y, position.z)
        }

    }, function (xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, function (error) {
        // console.log('ERROR: ', error)
    })
}

function addBall() {
    ball = new Ball(gravity);
    ball.updatePosition();
}

function rotate(e) {
    let el = document.querySelector('.cups.' + this)
    let currentRotation = el.getAttribute('rotation')

    if (currentRotation == '0') {
        el.style.transform = 'rotate(180deg)'
        el.setAttribute('rotation', '180')
    } else {
        el.style.transform = 'rotate(0deg)'
        el.setAttribute('rotation', '0')
    }
}

// Adding Drunk Shader Effekt on the Ball. Adding fluctuate with Vertex Shader and color-Effekt with Fragement Shader. Based on how many cups were hit.
function drunkShaderMaterial() {
    document.getElementById("ball").object3D.children[0].material = new THREE.ShaderMaterial( {
	        uniforms: {
	        	tDiffuse: { value: null },
                drunkStage: {type: 'float', value: drunkStage },
                drunk: { type: 'bool', value: drunk },
                u_Time: { value: 0.0},
	        },
        
	        vertexShader: `
            uniform bool drunk;
            uniform float drunkStage;
            uniform float u_Time;

            varying vec2 vUv;

            void main() {
                float time = u_Time / 1000.0;
                vUv = uv;
                if(drunk) {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position[0] + sin(time) * drunkStage, position[1], position[2]), 1.0 );
                } else {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            }`,
	        fragmentShader: 
            `
                uniform float u_Time;
                uniform bool drunk;
                uniform float drunkStage;

                varying vec2 vUv;
                
                void main()
                {
                    if(drunk) {
                        float time = u_Time/1000.0;
                        vec3 col = vec3(1.0 - abs(drunkStage * sin(time * (4.0 * drunkStage * 10.0))), 1.0 - abs(drunkStage * sin(2.0 * time * (drunkStage * 10.0)) + 0.25), 1.0 - abs(drunkStage * sin(time * (drunkStage * 10.0)) + 0.5));

                        //vec3 col = 0.5 + 0.5*cos(time*(drunkStage*10.0)+vUv.xyx+vec3(0,2,4));
                        gl_FragColor = vec4(col,1.0);
                    } else {
                        gl_FragColor = vec4(1.0, 1.0, 1.0 ,1.0);
                    }
                }
        
            `
        }
        );
}


///////////// functions to controll Runtime

function calculateDeltaTime() {
    deltaTime = (Date.now() - now) / 1000;
    now = Date.now();
}

function onTouchStart(_event) {
    mouseDownPos = new THREE.Vector2(_event.touches[0].clientX, _event.touches[0].clientY);
}

function onTouchEnd(_event) {
    mouseUpPos = new THREE.Vector2(_event.changedTouches[0].clientX, _event.changedTouches[0].clientY);
    let swipe = mouseUpPos.sub(mouseDownPos);
    ball.tossFromCam(swipe);
}


function calculateCameraPosition() {
    let markerPosition = Marker.instance.getAttribute("position");

    let x = markerPosition.x;
    let y = markerPosition.y;
    let z = markerPosition.z;

    let position = new THREE.Vector3(x, y, z);

    position.multiplyScalar(1 / scale);

    let rotation = Marker.instance.object3D.getWorldQuaternion(new THREE.Quaternion());

    position.applyQuaternion(rotation.inverse());

    let zeroPos = new THREE.Vector3();
    let camPos = zeroPos.clone().sub(position);

    Camera.instance.position = camPos;
}

///////////// Game Loop

function animate() {
    calculateDeltaTime();
    calculateCameraPosition();

    if (ball) {
        ball.updatePhysics(deltaTime);
    }

    cups.forEach(cup => cup.update());

    if (controls) {
        controls.update()
    }

    ScaleEntity.instance.setAttribute("scale", "" + scale + " " + scale + " " + scale);

    document.getElementById("ball").object3D.children[0].material.uniforms.u_Time.value = now - startTime;
    //TODO: Update drunk value of Shader 
    //TODO: Update drunkStage of Shader

    requestAnimationFrame(animate);
}


///////////// UI Functions

function toggleSettings() {
    let settings = document.querySelector('.settings')
    settings.classList.toggle('active')
}

function onSizeToggleChanged(change) {
    scale = this.checked ? 4.5 : 1;
}


///////////// Instantiate everything

init();
function init() {
    Camera.instance = document.querySelector("a-entity[camera]");
    Camera.instance.setAttribute("rotation-position-reader");
    Marker.instance = document.getElementById("a_Marker");
    Scene.instance = document.getElementById("a_Scene");
    ScaleEntity.instance = document.getElementById("a_ScaleEntity");

    addBall();

    addCups();

    drunkShaderMaterial()

    document.querySelector('.openClose').addEventListener('click', toggleSettings)
    document.querySelector('.cups.blue').addEventListener('click', rotate.bind('blue'))
    document.querySelector('.cups.red').addEventListener('click', rotate.bind('red'))

    let sizeToggle = document.querySelector("#sizeToggle");
    sizeToggle.addEventListener("change", onSizeToggleChanged);


    if (orbitControls) {
        installOrbitControls();
    }

    animate();
}