import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Ball } from './Ball.js'
import { Marker } from './Marker.js';
import { ScaleEntity } from './ScaleEntity.js';


class Cup {

    position;

    openingRadius = 0.092 / 2;
    height = 0.117;
    cupAFrame;

    cupID;

    onlyVisual;

    visible = true;



    constructor(_cupAFrame, _cupID, _position, _onlyVisual) {
        this.cupAFrame = _cupAFrame;
        this.cupID = _cupID;
        this.position = _position;
        this.onlyVisual = _onlyVisual;
    }

    update() {

        if (!this.visible) {
            return;
        }

        if (this.onlyVisual) {
            return;
        }

        this.checkCollisions();
    }


    checkCollisions() {

        let ballXZ = new THREE.Vector2(Ball.instance.position.x, Ball.instance.position.z);
        let thisXZ = new THREE.Vector2(this.position.x, this.position.z);

        let XZMiddleDistance = ballXZ.sub(thisXZ);

        if (XZMiddleDistance.length() < this.openingRadius) {

            if (Ball.instance.position.y < this.position.y + this.height) {

                if (Ball.instance.position.y >= this.position.y) {

                    this.hit();
                }
            }
        }
    }

    updateHTML() {

        if (!this.visible) {
            this.cupAFrame.setAttribute("display", "none");
        }
    }

    hit() {

        this.visible = false;

        Ball.instance.setBack();

        this.cupAFrame.setAttribute("display", "none");

        ScaleEntity.instance.removeChild(this.cupAFrame);


        if (this.cupID != 'red11' || this.cupID != 'blue11') {
            document.querySelector('#' + this.cupID).classList.add('empty')
        }
    }

    log(message) {
        let display = document.querySelector("#display");
        display.innerHTML = message.toString();
    }
}

export { Cup }