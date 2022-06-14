import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/ShaderPass.js';
import { GlitchPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/GlitchPass.js';
import { CustomShader, CustomShader2, CustomShader3 } from './customShader.js';
//import { shaderVariablesSingleton } from './ShaderVariables.js';

let aMarker = document.getElementById("a_Marker");
let scene = document.getElementById("a_Scene");
let composer;
let renderer;

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


//function initRenderTarget() {
//    AFRAME.registerComponent("renderTargetComponent", {
//        init: function() {
//            const renderer = this.sceneEl.renderer;
//            this.composer = new THREE.EffectComposer(renderer);
//            // add some passes ..
//            // (...)
//            // override `render`
//            this.bind();
//        },
//        // we need to keep the timestamps for the composer.render() function
//        tick: function (t, dt) {
//            this.t = t;
//            this.dt = dt;
//        },
//        // Bind the EffectComposer to the A-Frame render loop.
//        bind: function () {
//            const renderer = this.sceneEl.renderer;
//            const render = renderer.render;
//            const system = this;
//            let isDigest = false;
//            
//            renderer.render = function () {
//                if (isDigest) {
//                  render.apply(this, arguments);
//                } else {
//                  isDigest = true;
//                  system.composer.render(system.dt);
//                  isDigest = false;
//                }
//            };
//        }
//    })
//}

function init() {
    console.log("init");
    console.log(scene.object3D);
    for (let i = 0; i < pCups.length; i++) {
        if (i <= 10) {
            aMarker.innerHTML += "<a-entity position='" + pCups[i].x + " " + pCups[i].y + " " + pCups[i].z + "' scale='1.0 1.0 1.0' gltf-model='./Assets/RedCup.glb'></a-entity>"
        } else {
            aMarker.innerHTML += "<a-entity position='" + pCups[i].x + " " + pCups[i].y + " " + pCups[i].z + "' scale='1.0 1.0 1.0' gltf-model='./Assets/BlueCup.glb'></a-entity>"
        }
    }

    animate()
}

function animate() {
    //console.log("hi");
    requestAnimationFrame(animate);
}

init();