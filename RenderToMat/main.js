import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {ARButton} from './ARButton.js'

let camera;
let renderer;
let scene;

let rtCamera;
let rtScene; 
let renderTarget;

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

let display;

function main() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0;
    camera.position.z = 10;
    camera.rotation.x = 0;

    renderTarget = insideScene();

    const displayGeometry = new THREE.BoxGeometry(1, 1,1);
    /*const material = new THREE.MeshPhongMaterial({
        map: renderTarget.texture,
    });*/

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

    //const material2 = new THREE.ShaderMaterial({
    //    uniforms: {
    //        size: {
    //            value: new THREE.Vector3(512, 512, 0).multiplyScalar(0.5)
    //        },
    //        u_resolution: {
    //            value: new THREE.Vector2(512, 512)
    //        },
    //        length_center_to_corner: {
    //            value: new THREE.Vector2(512, 512).length()
    //        },
    //        drunkStage: {
    //            value: 1
    //        },
    //        drunk: {
    //            value: true
    //        },
    //        //texture: {
    //        //    value: renderTarget.texture
    //        //}
    //    },
    //    vertexShader: [
    //        "varying vec3 vPos;",
    //        "void main()	{",
    //          "vPos = position;",
    //          "gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    //        "}"
    //    ],
    //    fragmentShader: [
    //        "uniform vec3 size;",
    //        "uniform vec2 u_resolution;",
    //        "uniform float length_center_to_corner;",
    //        "uniform float drunkStage;",
    //        "uniform bool drunk;",
    //        "void main()",
    //        "{",
    //        "if(drunk) {",
    //        "float rad = (size.x/0.9) * length_center_to_corner;",
    //        "vec2 pos = vec2((u_resolution.x/2.0), (u_resolution.y/2.0));",
    //        "float relPosX = abs(gl_FragCoord.x - pos.x);",
    //        "float relPosY = abs(gl_FragCoord.y - pos.y);",
    //        "float fragDist = sqrt((relPosX * relPosX) + (relPosY * relPosY));",
    //        "float circleInfo = (rad - fragDist)/rad;",
    //        "float value = smoothstep(1.0, 0.0, sqrt(circleInfo * drunkStage));",
    //        "gl_FragColor = vec4(1,1,1,value);",
    //        "} else {",
    //        "gl_FragColor = vec4(0.0,0.0,0.0,0 );",
    //        "}",
    //        "}"
    //    ].join("\n") 
    //});

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

let cube;

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
    cube = new THREE.Mesh(geometry, material);
    console.log(rtScene);
    rtScene.add(cube);

    let renderTarget = new THREE.WebGLRenderTarget(512, 512);
    return renderTarget;
}

let now = Date.now();
let deltaTime = 0.018;

function calculateDeltaTime() {
    deltaTime = (Date.now() - now) / 1000;
    now = Date.now();
}

function animate() {
    calculateDeltaTime();
    cube.rotateY(1 * deltaTime);
    display.rotateY(Math.sin(-0.5 * deltaTime));

    renderer.setRenderTarget(renderTarget);
    renderer.render(rtScene, rtCamera);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

main();
//insideScene();