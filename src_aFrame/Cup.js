import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Ball } from './Ball.js'
import { Marker } from './Marker.js';
import { ScaleEntity } from './ScaleEntity.js';


class Cup extends THREE.Group {

    openingRadius = 0.092 / 2;
    height = 0.117;
    cupAFrame;

    constructor(_group, _cupAFrame) {

        super();

        this.add(_group);
        this.cupAFrame = _cupAFrame;

    }

    update() {

        if (!this.visible) {
            return;
        }

        this.checkCollisions();

        //this.updateHTML();
    }


    checkCollisions() {

        let ballXZ = new THREE.Vector2(Ball.instance.position.x, Ball.instance.position.z);
        let thisXZ = new THREE.Vector2(this.position.x, this.position.z);

        let XZMiddleDistance = ballXZ.sub(thisXZ);

        if (XZMiddleDistance.length() < this.openingRadius /*- (Ball.radius / 2)*/) {

            if (Ball.instance.position.y < this.position.y + this.height) {

                if (Ball.instance.position.y >= this.position.y) {

                    this.hit();
                }
            }
        } /*else if (XZMiddleDistance.length() < this.openingRadius + Ball.radius) {

            if (Ball.instance.position.y < this.position.y + this.height) {

                if (Ball.instance.position.y >= this.position.y) {

                    Ball.instance.currentSpeed = Ball.instance.position.clone().sub(this.position);
                }
            }
        }*/
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

        //alert(this.cupAFrame.getAttribute("display"));
    }

}

export { Cup }