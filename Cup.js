import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Ball } from './Ball.js'


class Cup extends THREE.Group {

    openingRadius = 0.092 / 2;
    height = 0.117;


    constructor(_group) {

        super();

        this.add(_group);
    }

    update() {

        if (!this.visible) {
            return;
        }

        this.checkCollisions();
    }


    checkCollisions() {

        let ballXZ = new THREE.Vector2(Ball.instance.position.x, Ball.instance.position.z);
        let thisXZ = new THREE.Vector2(this.position.x, this.position.z);

        let XZMiddleDistance = ballXZ.sub(thisXZ);

        if (XZMiddleDistance.length() < this.openingRadius - Ball.radius) {

            if (Ball.instance.position.y < this.position.y + this.height) {

                if (Ball.instance.position.y >= this.position.y) {

                    this.visible = false;
                    Ball.instance.setBack();
                }
            }
        } else if (XZMiddleDistance.length() < this.openingRadius + Ball.radius) {

            if (Ball.instance.position.y < this.position.y + this.height) {

                if (Ball.instance.position.y >= this.position.y) {

                    Ball.instance.currentSpeed = Ball.instance.position.clone().sub(this.position);
                }
            }
        }
    }
}

export { Cup }