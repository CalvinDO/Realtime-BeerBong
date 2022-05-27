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

        let distance = ballXZ.sub(thisXZ);

        if (distance.length() < this.openingRadius) {

            if (Ball.instance.position.y < this.position.y + this.height) {

                this.visible = false;
                Ball.instance.setBack();
            }

        }
    }
}

export { Cup }