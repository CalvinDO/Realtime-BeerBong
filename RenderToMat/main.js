import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {ARButton} from './ARButton.js'


///////////////////////////////////////////////////////////////////////
/*///////////////////////////// Global Variables//////////////////// */
///////////////////////////////////////////////////////////////////////
let camera;
let renderer;
let scene;

let rtCamera;
let rtScene; 
let renderTarget;
let insideCube;

let now = Date.now();
let deltaTime = 0.018;

let display; // used in this example for the bigger cube, could have been a plane for the real project

// Standart Shader which could have been changed if the project would have been focused on the Render To Material Branch
const vsSource = `
    varying vec2 vUv;    
    void main() 
    {
    	vUv = uv;
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    	gl_Position = projectionMatrix * modelViewPosition;
    }
`;

const fsSource = `
    varying vec2 vUv;     
    uniform sampler2D text;

    void main() {
        gl_FragColor = texture2D(text, vUv);
    }
`;



//setting up the "outside Scene"
function main() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    // camera settings
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0;
    camera.position.z = 10;
    camera.rotation.x = 0;

    renderTarget = insideScene();

    const displayGeometry = new THREE.BoxGeometry(1, 1,1);

    // Shader Material of the bigger Cube. No settings possible right now to add the drunk shader effects.
    var material2 = new THREE.ShaderMaterial({
        uniforms: {
                    size: {
                        value: new THREE.Vector3(512, 512, 0).multiplyScalar(0.5)
                    },
                    u_resolution: {
                        value: new THREE.Vector2(512, 512)
                    },
                    length_center_to_corner: {
                        value: new THREE.Vector2(512, 512).length()
                    },
                    drunkStage: {
                        value: 1
                    },
                    drunk: {
                        value: true
                    },
                    text: {
                        value: renderTarget.texture
                    }
                },
        vertexShader: vsSource,
        fragmentShader: fsSource
    });
    
    display = new THREE.Mesh(displayGeometry, material2);
    display.name = "drunkFilter";
    display.position.set(0.0, 0.0, 8);
    scene.add(display);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer));
    renderer.xr.enabled = true;

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    animate();
}



// setting up the Scene which will be rendered on the "red" cube
function insideScene() {
    rtCamera = new THREE.PerspectiveCamera(75, 512 / 512, 0.1, 5);
    rtScene = new THREE.Scene();
    rtScene.background = new THREE.Color('red');

    rtCamera.position.z = 2;

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        rtScene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    insideCube = new THREE.Mesh(geometry, material);
    console.log(rtScene);
    rtScene.add(insideCube);

    let renderTarget = new THREE.WebGLRenderTarget(512, 512);
    return renderTarget;
}


///////////// functions to controll Runtime

function calculateDeltaTime() {
    deltaTime = (Date.now() - now) / 1000;
    now = Date.now();
}


///////////// Game Loop

function animate() {
    calculateDeltaTime();
    insideCube.rotateY(1 * deltaTime);
    display.rotateY(Math.sin(-0.5 * deltaTime));

    renderer.setRenderTarget(renderTarget); //first rendering inner scene on cube
    renderer.render(rtScene, rtCamera);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera); //rendering the whole scene

    requestAnimationFrame(animate);
}

main();