
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { Ball } from './Ball.js'
import { Cup } from './Cup.js'
import { ARButton } from './ARButton.js'
import { Marker } from './Marker.js';
import { Camera } from './Camera.js';

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


let customConsole;

let aMarker;

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
            Marker.instance.appendChild(newCupaFrame);


            let newCup = new Cup(root, newCupaFrame);
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

    Camera.instance = document.querySelector("#camera");
    Camera.instance.setAttribute("rotation-position-reader");

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.3;
    camera.position.z = 1.6;
    camera.rotation.x = -0.5;


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer));
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

function animate() {
    //alert("start of animate");

    calculateDeltaTime();

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

    //console.log(Camera.instance.getAttribute("camera"));

    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(Camera.instance.object3D.matrixWorld);
    //console.log(Camera.instance.object3D.matrixWorld);

    //log(worldPos.x);

    renderer.render(threeScene, camera);



    requestAnimationFrame(animate);
}




function onTouchStart(_event) {
    mouseDownPos = new THREE.Vector2(_event.touches[0].clientX, _event.touches[0].clientY);
}

function onTouchEnd(_event) {
    mouseUpPos = new THREE.Vector2(_event.changedTouches[0].clientX, _event.changedTouches[0].clientY);

    let swipe = mouseUpPos.sub(mouseDownPos);
    // console.log(swipe);
    //console.log(ball.position);
    ball.toss(swipe);

    //log(ball.position.z);

    //customConsole.log(ball);
}





function log(message) {
    let display = document.querySelector("#display");
    display.innerHTML = message.toString();

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

init();



function init() {
    //alert("main init working!!");

    //customConsole = document.querySelector("#console");



    //alert("main init working!");




    // alert("setup fake cups");


    //setupGui();

    AFRAME.registerComponent('rotation-position-reader', {
        tick: function () {
            console.log("hellooo")
            // `this.el` is the element.
            // `object3D` is the three.js object.

            // `rotation` is a three.js Euler using radians. `quaternion` also available.
            //console.log(this.el.object3D.rotation);

            // `position` is a three.js Vector3.
            var position = new THREE.Vector3();
            var worldPos = new THREE.Vector3();
            //worldPos.setFromMatrixPosition(this.el.object3D.matrixWorld);
            worldPos = this.el.object3D.getWorldPosition(this.el.position);
            //log(this.el.object3D.position.x + " " + this.el.object3D.position.y + " " + this.el.object3D.position.z);
            log(worldPos.x + " ; " + worldPos.y + " ; " + worldPos.z);
        }
    });



    //aMarker = document.getElementById("a_Marker");
    Marker.instance = document.getElementById("a_Marker");

    //log(Date.now() + " !!!!");
    setupSceneCamRenderer();

    addLights();

    instantiateMaterials();




    addBall();

    addCups();


    loadModel('Table.glb', pTable)


    //addDrunkEffect();



    if (orbitControls) {
        installOrbitControls();
    }
    //alert("added ball and cups and table and orbit controls!");

    animate();
    //requestAnimationFrame(animate());

    /* */
}
