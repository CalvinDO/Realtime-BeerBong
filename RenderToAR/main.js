import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/ShaderPass.js';
import { GlitchPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/GlitchPass.js';
import { CustomShader } from './customShader.js';

// global scene values
var btn, gl, glCanvas, camera, scene, renderer, cube;
let composer;

// global xr value
var xrSession = null;

loadScene();
init();

function loadScene() {
    // setup WebGL
    glCanvas = document.createElement('canvas');
    gl = glCanvas.getContext('webgl', { antialias: true });
    
    // setup Three.js scene
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    );

    scene = new THREE.Scene();

    var light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
				light.position.set( 0.5, 1, 0.25 );
                scene.add( light );

    var geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    var material = new THREE.MeshPhongMaterial({color: 0x89CFF0});
    cube = new THREE.Mesh( geometry, material );
    cube.position.y = 0.2;
    scene.add( cube );

    // setup Three.js WebGL renderer
    renderer = new THREE.WebGLRenderer({
        canvas: glCanvas,
        context: gl
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    document.body.appendChild( renderer.domElement );

    composer = new EffectComposer( renderer );

    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass ); 

    const customShader = new ShaderPass( CustomShader ); // in customshader.js kann man einen shader entwickeln der dann angewendet wird
    composer.addPass( customShader );

    const glitchPass = new GlitchPass(); // Nur zum beispiel das postprocessing funktioniert
    composer.addPass( glitchPass );
}

function init() {
        navigator.xr.isSessionSupported('immersive-ar')
            .then((supported) => {
                if (supported) {
                    btn = document.createElement("button");
                    btn.addEventListener('click', onRequestSession);
                    btn.innerHTML = "Enter XR";
                    var header = document.querySelector("header");
                    header.appendChild(btn);
                }
                else {
                    navigator.xr.isSessionSupported('inline')
                        .then((supported) => {
                            if (supported) {
                                console.log('inline session supported')
                            }
                            else {console.log('inline not supported')};
                        })
                }
            })
            .catch((reason) => {
                console.log('WebXR not supported: ' + reason);
            });
}

function onRequestSession() {
    console.log("requesting session");
    navigator.xr.requestSession('immersive-ar', {requiredFeatures: ['viewer', 'local']})
        .then(onSessionStarted)
        .catch((reason) => {
            console.log('request disabled: ' + reason);
        });
}

function onSessionStarted(session) {
    console.log('starting session');
    btn.removeEventListener('click', onRequestSession);
    btn.addEventListener('click', endXRSession);
    btn.innerHTML = "STOP AR";
    xrSession = session;
    xrSession.addEventListener("end", onSessionEnd);
    setupWebGLLayer()
        .then(()=> {
            renderer.xr.setReferenceSpaceType('local');
            renderer.xr.setSession(xrSession);
            animate();
        })
}

function setupWebGLLayer() {
    return gl.makeXRCompatible().then(() => {
        xrSession.updateRenderState( {baseLayer: new XRWebGLLayer(xrSession, gl) });
    });
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render(time) {
    if (!xrSession) {
        renderer.clear(true, true, true);
        return;
    } else {
        time *= 0.001;
        cube.translateY(0.2 * Math.sin(time) / 100);
        cube.rotateY(Math.PI / 180);
        composer.render();
        //renderer.render(scene, camera);
    }
}

function endXRSession() {
    if (xrSession) {
        console.log('ending session...');
        xrSession.end().then(onSessionEnd);
    }
}

function onSessionEnd() {
    xrSession = null;
    console.log('session ended');
    btn.innerHTML = "START AR";
    btn.removeEventListener('click', endXRSession);
    btn.addEventListener('click', onRequestSession);
}