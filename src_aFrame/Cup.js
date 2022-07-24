import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Ball } from './Ball.js'
import { Camera } from './Camera.js';
import { ScaleEntity } from './ScaleEntity.js';


class Cup {

    // The Position of a Cup
    position;

    //The Diameter of the Cup Model in Blender Measures
    static diameterCup = 0.092;

    static openingRadius = Cup.diameterCup / 2;

    //The height of the Cup Model in Blender Measures
    height = 0.117;

    // The AFrame Element of a Cup
    cupAFrame;

    // The id of a cup, like "red01, blue05" etc.
    cupID;


    isNotHittable;

    visible = true;



    constructor(_cupAFrame, _cupID, _position, _isNotHittable) {
        this.cupAFrame = _cupAFrame;
        this.cupID = _cupID;
        this.position = _position;
        this.isNotHittable = _isNotHittable;
    }

    // update collisions when visible and hitable
    update() {

        if (!this.visible) {
            return;
        }

        if (this.isNotHittable) {
            return;
        }

        this.checkCollisions();
    }

    // check Collisions with the Ball, approaching with an cylinder
    checkCollisions() {

        let ballXZ = new THREE.Vector2(Ball.instance.position.x, Ball.instance.position.z);
        let thisXZ = new THREE.Vector2(this.position.x, this.position.z);

        let XZMiddleDistance = ballXZ.sub(thisXZ);

        if (XZMiddleDistance.length() < Cup.openingRadius) {

            if (Ball.instance.position.y < this.position.y + this.height) {

                if (Ball.instance.position.y >= this.position.y) {

                    this.hit();
                }
            }
        }
    }

    // update the a-frame HTMLElement
    updateHTML() {

        if (!this.visible) {
            this.cupAFrame.setAttribute("display", "none");
        }
    }

    // Remove Cup and Set Back Ball when hit
    hit() {

        this.visible = false;

        Ball.instance.setBackTo(Camera.instance.position);

        this.cupAFrame.setAttribute("display", "none");

        ScaleEntity.instance.removeChild(this.cupAFrame);



        document.querySelector('#' + this.cupID).classList.add('empty')

    }

    // A logging method used for debugging
    log(message) {
        let display = document.querySelector("#display");
        display.innerHTML = message.toString();
    }
}

export { Cup }