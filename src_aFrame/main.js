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

let cupsTotalAmount = 20


let sceneScale = 1; // fitting for our Models to get semi-realistic sizes, this value is the result of testing combined with the mathematically correct value, which should be higher
//The scale variable is used as scale on the a-entity that scales the scene, and in calculations beeing effected by change of this scale


//adding Listeners to capture TouchStart and TouchEnd
if (ballThrow) {
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
}

let startTime = Date.now() // used for the shader to get the time since start
let drunk = false;
let drunkStage = 0.0;

let gravityConstant = 9.81; //Earth-acceleration
let gravity = new THREE.Vector3(0, -gravityConstant, 0);
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
] // Positions that we tested with the orbit controlls ui

let now = Date.now();
let deltaTime = 0.018; //fixed assumend framerat. This value is only used for initial calculations at the beginning, when no real deltaTime has been calculated

//Initial 
let touchDownPos = new THREE.Vector2();
let touchUpPos = new THREE.Vector2();

let cups = [];

///////////////////////////////////////////////////////////////////////
/*///////////////////////////// Functions ////////////////////////// */
///////////////////////////////////////////////////////////////////////

///////////// functions to set up the scene

//Iterating through every cup position in pCups, deciding its color with the existence in either the first or second half of the array
function addCups() {
    let i = 0
    for (let pCup of pCups) {
        let src = ''
        if (i <= cupsTotalAmount / 2) {
            src = 'RedCup.glb'
        } else {
            src = 'BlueCup.glb'
        }
        loadModel(src, pCup)
        i++
    }
}

//Installing Orbit Controls for earlier testing
function installOrbitControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
}


//Load Models...
function loadModel(model, position) {
    loader.load('Assets/' + model, function (glb) {

        const root = glb.scene;

        //Make it a new Cup if the name is RedCup or BlueCup
        if (model == 'RedCup.glb' || model == 'BlueCup.glb') {

            //Instantiate a Cup with an a-entity as Mesh and some Data. Both are stored in the Cup Object
            let newCupaFrame = document.createElement("a-entity");
            newCupaFrame.setAttribute("position", position.x + " " + position.y + " " + position.z);
            newCupaFrame.setAttribute("scale", "1.0 1.0 1.0");
            newCupaFrame.setAttribute("gltf-model", './Assets/' + model);

            ScaleEntity.instance.appendChild(newCupaFrame);

            let newCup;
            //If is the water cup, it is the last cup with index 11, and is not hitable according to official beer pong rules
            if (position.id == "red11" || position.id == "blue11") {

                newCup = new Cup(newCupaFrame, position.id, position, true);
            } else {
                newCup = new Cup(newCupaFrame, position.id, position, false);
            }

            cups.push(newCup);
        } else { //if not, just set the position, because it is the Table
            root.position.set(position.x, position.y, position.z)
        }

    }, function (xhr) {
    }, function (error) {
    })
}

//The Ball doesn't need to load a model because it selects the already existing a-sphere in the Ball constructor
function addBall() {
    ball = new Ball(gravity);
    ball.updatePosition();
}

//Rotate Cup-Display 180 degrees each time method is executed, ignoring it's preview rotation
function rotateCupdisplay(e) {
    let cupElement = document.querySelector('.cups.' + this)
    let currentRotation = cupElement.getAttribute('rotation')

    if (currentRotation == '0') {
        cupElement.style.transform = 'rotate(180deg)'
        cupElement.setAttribute('rotation', '180')
    } else {
        cupElement.style.transform = 'rotate(0deg)'
        cupElement.setAttribute('rotation', '0')
    }
}

// Adding Drunk Shader Effekt on the Ball. Adding fluctuate with Vertex Shader and color-Effekt with Fragement Shader. Based on how many cups were hit.
function addDrunkShaderMaterial() {
    document.getElementById("ball").object3D.children[0].material = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse: { value: null },
            drunkStage: { type: 'float', value: drunkStage },
            drunk: { type: 'bool', value: drunk },
            u_Time: { value: 0.0 },
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
    touchDownPos = new THREE.Vector2(_event.touches[0].clientX, _event.touches[0].clientY);
}

function onTouchEnd(_event) {
    touchUpPos = new THREE.Vector2(_event.changedTouches[0].clientX, _event.changedTouches[0].clientY);
    let swipe = touchUpPos.sub(touchDownPos);
    ball.tossFromCam(swipe);
}


function calculateCameraPosition() {
    let markerPosition = Marker.instance.getAttribute("position");

    let x = markerPosition.x;
    let y = markerPosition.y;
    let z = markerPosition.z;

    let position = new THREE.Vector3(x, y, z);

    // Scaling the Scene bigger leads to bigger position calculations, which need to remain the same.
    // This is in fact a paradoxon i did not understand, but it needs to be done.
    // One would expect when the scene is bigger, the Position of the Marker and therefore the position of the Camera are also scaled accordingly, but it was not the case, and this method was figured out as the working one
    // It could be due to the fact that the Camera itself is not parented under the Scale Entity

    // reciprocal of sceneScale is used
    position.multiplyScalar(1 / sceneScale);

    let rotation = Marker.instance.object3D.getWorldQuaternion(new THREE.Quaternion());

    position.applyQuaternion(rotation.inverse());

    let zeroPos = new THREE.Vector3();
    let camPos = zeroPos.sub(position);

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

    ScaleEntity.instance.setAttribute("scale", "" + sceneScale + " " + sceneScale + " " + sceneScale);

    // editing shader variables on runtime
    document.getElementById("ball").object3D.children[0].material.uniforms.u_Time.value = now - startTime;
    if (document.getElementsByClassName("empty").length > 0) document.getElementById("ball").object3D.children[0].material.uniforms.drunk.value = true; //getting drunk when first cup was hit
    document.getElementById("ball").object3D.children[0].material.uniforms.drunkStage.value = document.getElementsByClassName("empty").length / cupsTotalAmount; //raising effect with every cup which gets class 'empty'

    requestAnimationFrame(animate);
}


///////////// UI Functions

function toggleSettings() {
    let settings = document.querySelector('.settings')
    settings.classList.toggle('active')
}




///////
// | //
// v //
///////

// This is working due to event binding and event-bubbling in javascript.
// The checked variable is a variable of the HTMLInputElement on which the EventListener is added
// the "this" keyword can, if not in an method with binding, only be used in classes to refere to the object itself
// Because the .bind([...]) variable/method is not explicitly defined, JavaScript seems to act like it did
// This is another beatiful example of why it is better to use TypeScript, in Typescript it would look like this:
/*
function onSizeToggleChanged(this: HTMLInputElement, change: Event): void {
    sceneScale = this.checked ? 4.5 : 1;
}
*/
//Now it is perfectly clear what the this stands for!

// I really encourage you, although it could(!) bring some inital extra work for definition files etc., to use TypeScript for this course.
// This will not only help your students code faster, better, and less nonesense which is magically allowed in JavaScript, 
// but also you to read and understand the code later on!


function onSizeToggleChanged(change) {
    //Change size when TableSize-RealSize toggle is changed
    //Checked is used because i wanted to define the value 100% right, also when the initial state of the Size gets changed later on, and so on...
    //... I call this best practise
    sceneScale = this.checked ? 4.5 : 1;
}

///////
// ^ //
// | //
///////


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

    addDrunkShaderMaterial()

    document.querySelector('.openClose').addEventListener('click', toggleSettings)
    document.querySelector('.cups.blue').addEventListener('click', rotateCupdisplay.bind('blue'))
    document.querySelector('.cups.red').addEventListener('click', rotateCupdisplay.bind('red'))

    let sizeToggle = document.querySelector("#sizeToggle");
    sizeToggle.addEventListener("change", onSizeToggleChanged);


    if (orbitControls) {
        installOrbitControls();
    }

    animate();
}