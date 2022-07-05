
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { Ball } from './Ball.js'
import { Cup } from './Cup.js'
import { ARButton } from './ARButton.js'
import { Marker } from './Marker.js';
import { Camera } from './Camera.js';
import { Scene } from './Scene.js';
import { ScaleEntity } from './ScaleEntity.js';

//document.addEventListener("keydown", onKeyDown)



let threeScene;
let ball;
let materials = {};
let shading = 'smooth';
let renderer;
let camera;
let controls;
const loader = new GLTFLoader();

let orbitControls = false;
let ballThrow = true;

let customShader;
let customShader2;
let customShader3;


let customConsole;

let aMarker;

let camToMarker;

let scale = 1;


if (ballThrow) {
    window.addEventListener("mousedown", onMouseDown);
    //window.addEventListener("mouseup", onMouseUp);

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
        z: 0.75
    },

    // enemies
    //1. row
    {
        x: 0,
        y: 0.67,
        z: -0.85,
        id: "blue8"
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
    loader.load('Assets/' + model, function (glb) {

        const root = glb.scene
        // root.scale.set(1.5, 1.5, 1.5)


        if (model == 'RedCup.glb' || model == 'BlueCup.glb') {


            let newCupaFrame = document.createElement("a-entity");
            newCupaFrame.setAttribute("position", position.x + " " + position.y + " " + position.z);
            newCupaFrame.setAttribute("scale", "1.0 1.0 1.0");
            newCupaFrame.setAttribute("gltf-model", './Assets/' + model);
            ScaleEntity.instance.appendChild(newCupaFrame);

            let newCup = new Cup(root, newCupaFrame, position.id);
            newCup.position.set(position.x, position.y, position.z)

            /*
            for (let i = 0; i < pCups.length; i++) {
                let newCupaFrame = document.createElement("a-entity");
                newCupaFrame.setAttribute("position", pCups[i].x + " " + pCups[i].y + " " + pCups[i].z);
                newCupaFrame.setAttribute("scale", "1.0 1.0 1.0");

                if (i <= 10) {

                    newCupaFrame.setAttribute("gltf-model", './Assets/RedCup.glb');

                    //aMarker.innerHTML += "<a-entity position='" + pCups[i].x + " " + pCups[i].y + " " + pCups[i].z + "' scale='1.0 1.0 1.0' gltf-model='./Assets/RedCup.glb'></a-entity>"
                } else {

                    newCupaFrame.setAttribute("gltf-model", './Assets/BlueCup.glb');

                    //aMarker.innerHTML += "<a-entity position='" + pCups[i].x + " " + pCups[i].y + " " + pCups[i].z + "' scale='1.0 1.0 1.0' gltf-model='./Assets/BlueCup.glb'></a-entity>"
                }
            }
            */

            cups.push(newCup);
            threeScene.add(newCup);

            //console.log("own Cup Object: ", newCup);

        } else {
            root.position.set(position.x, position.y, position.z)
            threeScene.add(root);
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

    threeScene = new THREE.Scene();

    threeScene.background = new THREE.Color(0xdddddd)

    Camera.instance = document.querySelector("a-entity[camera]");
    Camera.instance.setAttribute("rotation-position-reader");

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.3;
    camera.position.z = 1.6;
    camera.rotation.x = -0.5;


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //document.body.appendChild(ARButton.createButton(renderer));
    renderer.xr.enabled = true;
}

function addLights() {

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0)
    directionalLight.castShadow = true;
    threeScene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    threeScene.add(ambientLight);

    const spotLight1 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight1.position.set(0, 300, 500)
    threeScene.add(spotLight1)

    const spotLight2 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight2.position.set(500, 100, 0)
    threeScene.add(spotLight2)

    const spotLight3 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight3.position.set(0, 100, -500)
    threeScene.add(spotLight3)

    const spotLight4 = new THREE.PointLight(0xc4c4c4c4, 0.2)
    spotLight4.position.set(-500, 300, 0)
    threeScene.add(spotLight4)
}


function instantiateMaterials() {

    materials['wireframe'] = new THREE.MeshBasicMaterial({ wireframe: true });
    materials['flat'] = new THREE.MeshPhongMaterial({ specular: 0x000000, flatShading: true, side: THREE.DoubleSide });
    materials['smooth'] = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
    materials['glossy'] = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
}

function addBall() {
    ball = new Ball(materials[shading], gravity);

    threeScene.add(ball);

    //ball.position.copy(currentPosition)
    ball.updatePosition();

    //alert("Ball start position z== " + ball.position.z);
    //customConsole.log(ball.currentPosition);
}



function addDrunkEffect() {

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    //customConsole.log(planeGeometry.parameters.width);
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
    threeScene.add(plane);
}



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
    

    // console.log(swipe);
    //console.log(ball.position);
    // console.log(swipe);
    //console.log(ball.position);
    //console.log(markerPosition);
    
    //console.log(x, y, z);

    
    /*
    position.x = x;
    position.y = y;
    position.z = z;
    position.set(x, y, z);
    */
    //console.log(position, x, y, z);
    //console.log("before quat: ", position.x, position.y, position.z)
    //console.log("real position: ", Marker.instance.object3D.getWorldPosition(new THREE.Vector3()));

    //let rotation = Marker.instance.getAttribute("rotation");
    //console.log("cam rotation: ", Camera.instance.object3D.getWorldQuaternion(new THREE.Quaternion()));

    //console.log(rotation.angleTo(new THREE.Quaternion()));
    //let invertedRotation = new THREE.Quaternion();
    //invertedRotation.copy(rotation);
    //invertedRotation.invert();

    //console.log("after quat: ", position.x, position.y, position.z);

    //var worldPos = markerPosition.clone();
    //worldPos.setFromMatrixPosition(Camera.instance.object3D.matrixWorld);
    //console.log(Marker.instance.object3D.getWorldPosition(new THREE.Vector3()));

   

    //ball.toss(swipe);

    //log(ball.position.z);

    //customConsole.log(ball);
}


function calculateCameraPosition(){

    let markerPosition = Marker.instance.getAttribute("position");
    
    let x = markerPosition.x;
    let y = markerPosition.y;
    let z = markerPosition.z;

    let position = new THREE.Vector3(x, y, z);

    position.multiplyScalar(1/scale);

    let rotation = Marker.instance.object3D.getWorldQuaternion(new THREE.Quaternion());
    
    position.applyQuaternion(rotation.inverse()/*Marker.instance.getAttribute("rotation")*/);
    
    let zeroPos = new THREE.Vector3();
    let camPos = zeroPos.clone().sub(position);

    Camera.instance.position = camPos;
}


function log(message) {
    let display = document.querySelector("#display");
    display.innerHTML = message.toString();

}

function onMouseDown(_event) {
    mouseDownPos = new THREE.Vector2(_event.clientX, _event.clientY);
}
/*
function onMouseUp(_event) {
    mouseUpPos = new THREE.Vector2(_event.clientX, _event.clientY);

    //let swipe = mouseUpPos.sub(mouseDownPos);
    // console.log(swipe);
    //console.log(ball.position);


    let markerPosition = Marker.instance.getAttribute("position");

    //console.log(markerPosition);
    let x = markerPosition.x;
    let y = markerPosition.y;
    let z = markerPosition.z;
    //console.log(x, y, z);
    let position = new THREE.Vector3(x, y, z);
    //console.log(position, x, y, z);
    position.x = x;
    position.y = y;
    position.z = z;



    //var worldPos = markerPosition.clone();
    //worldPos.setFromMatrixPosition(Camera.instance.object3D.matrixWorld);
    //console.log(Marker.instance.object3D.getWorldPosition(new THREE.Vector3()));

    //ball.tossDirect(markerPosition);
    ball.tossDirect(Marker.instance.object3D.getWorldPosition(new THREE.Vector3()));
    //ball.toss(swipe);
}
*/
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

function animate() {
    //alert("start of animate");

    calculateDeltaTime();

    calculateCameraPosition();

    if (ball) {
        ball.rotateY(1 * deltaTime)
        ball.rotateZ(1 * deltaTime)

        ball.updatePhysics(deltaTime);
    }
    //log(ball.position.z);


    cups.forEach(cup => cup.update());

    //shading = effectController.newShading;

    if (controls) {
        controls.update()
    }

    ScaleEntity.instance.setAttribute("scale", "" + scale + " " + scale + " " + scale);

    //worldPos = Camera.instance.object3D.getWorldPosition(position);
    //log(worldPos.x.toFixed(2) + " ; " + worldPos.y.toFixed(2) + " ; " + worldPos.z.toFixed(2) + " || Time: " + Date.now());

    //console.log(Camera.instance.getAttribute("camera"));


    //console.log(Camera.instance.object3D.matrixWorld);

    //log(worldPos.x);

    renderer.render(threeScene, camera);


    requestAnimationFrame(animate);
}


init();


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


function init() {
    //alert("main init working!!");

    //customConsole = document.querySelector("#console");

    //alert("main init working!");

    // alert("setup fake cups");

    //setupGui();

    //aMarker = document.getElementById("a_Marker");
    Marker.instance = document.getElementById("a_Marker");
    Scene.instance = document.getElementById("a_Scene");
    ScaleEntity.instance = document.getElementById("a_ScaleEntity");

    //log(Date.now() + " !!!!");
    setupSceneCamRenderer();

    addLights();

    instantiateMaterials();

    addBall();

    addCups();


    loadModel('Table.glb', pTable)

    //addDrunkEffect();

    //document.querySelectorAll('.cups').addEventListener('click', rotate)
    document.querySelector('.cups.blue').addEventListener('click', rotate.bind('blue'))
    document.querySelector('.cups.red').addEventListener('click', rotate.bind('red'))

    if (orbitControls) {
        installOrbitControls();
    }
    //alert("added ball and cups and table and orbit controls!");

    /*
    AFRAME.registerComponent('rotation-position-reader', {
        tick: function () {
            // `this.el` is the element.
            // `object3D` is the three.js object.

            // `rotation` is a three.js Euler using radians. `quaternion` also available.
            //console.log(this.el.object3D.rotation);

            // `position` is a three.js Vector3.
            let markerPosition = Marker.instance.getAttribute("position");
            //console.log(markerPosition);

            let x = markerPosition.x;
            let y = markerPosition.y;
            let z = markerPosition.z;
            //console.log(x, y, z);
            let position = new THREE.Vector3(1, 2, 3);
            position.x = x;
            position.y = y;
            position.z = z;

            //console.log(position, x, y, z);


            var worldPos = new THREE.Vector3();

            var quaternion = new THREE.Quaternion();

            //worldPos.setFromMatrixPosition(this.el.object3D.matrixWorld);
            //worldPos = this.el.object3D.getWorldPosition(position);
            //worldPos = 
            //log(this.el.object3D.position.x + " " + this.el.object3D.position.y + " " + this.el.object3D.position.z);
            //log(worldPos.x.toFixed(2) + " ; " + worldPos.y.toFixed(2) + " ; " + worldPos.z.toFixed(2) + " || Time: " + Date.now());
            //log(Camera.instance.getAttribute("position").x);
            //console.log(this.el.object3D.getWorldQuaternion(quaternion));
        }
    });
    */

    animate();
    //requestAnimationFrame(animate());

    /* */
}


//jAFRAME.registerSystem("postprocessing", {
//j
//j	composer: null,
//j	originalRenderMethod: null,
//j
//j	/**
//j	 * Initialises this system.
//j	 */
//j
//j	init() {
//j		console.log("hi");
//j		const sceneEl = this.sceneEl;
//j
//j        if (!sceneEl.hasLoaded) {
//j            sceneEl.addEventListener('render-target-loaded', this.init.bind(this));
//j            return;
//j          }
//j
//j		const scene = sceneEl.object3D;
//j		const renderer = sceneEl.renderer;
//j		const render = renderer.render;
//j		const camera = sceneEl.camera;
//j
//j		const clock = new THREE.Clock();
//j		const composer = new EffectComposer(renderer);
//j
//j		this.composer = composer;
//j		this.originalRenderMethod = render;
//j
//j		const renderPass = new RenderPass(scene, camera);
//j    
//j		composer.addPass(renderPass);
//j        
//j
//j        customShader = new ShaderPass( TestShader ); 
//j        customShader.renderToScreen = true;
//j        composer.addPass( customShader );
//j
//j        this.composer = composer;
//j        this.t = 0;
//j        this.dt = 0;
//j        this.bind();
//j	},
//j    tick: function (t, dt) {
//j        this.t = t;
//j        this.dt = dt;
//j    },
//j    bind: function () {
//j        console.log("hi bind");
//j        const renderer = this.sceneEl.renderer;
//j        const render = renderer.render;
//j        const system = this;
//j        let isDigest = false;
//j
//j        renderer.render = function () {
//j            if (isDigest) {
//j                render.apply(this, arguments);
//j            } else {
//j                isDigest = true;
//j                system.composer.render(system.dt);
//j                isDigest = false;
//j            }
//j        };
//j    }
//j});