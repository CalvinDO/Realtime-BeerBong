import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {ARButton} from './ARButton.js'
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/ShaderPass.js';
import { GlitchPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/GlitchPass.js';
import { CustomShader } from './customShader.js';

let camera;
let renderer;
let scene;

let rtCamera;
let rtScene; 
let renderTarget;
let composer;

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


function main() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0;
    camera.position.z = 10;
    camera.rotation.x = 0;



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

    composer = new EffectComposer( renderer );

    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass ); 

    const customShader = new ShaderPass( CustomShader );
    composer.addPass( customShader );

    const glitchPass = new GlitchPass();
    composer.addPass( glitchPass );
    
    animate();
}


function animate() {

    

    requestAnimationFrame(animate);

    composer.render();
}

main();
//insideScene();