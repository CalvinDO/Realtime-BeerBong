import * as THREE from './three.js-master/build/three.module.js'

class Ball extends THREE.Mesh {

    currentSpeed = new THREE.Vector3(0, 0, 0);
    currentPosition = new THREE.Vector3(0, 2, 0);
    gravity;
    deltaTime = 0.02;


    constructor(_geometry, _material, _gravity) {
        super(_geometry, _material);
        this.gravity = _gravity;
    }

    updatePhysics(_deltaTime) {
        this.deltaTime = _deltaTime;

        this.updateSpeed();

        this.updatePosition();

    }

    updatePosition() {

        this.currentPosition.add(this.currentSpeed.clone().multiplyScalar(this.deltaTime));

        this.position.copy(this.currentPosition);
    }

    toss(_swipe) {
        _swipe.multiplyScalar(0.01);
        let swipe3D = new THREE.Vector3(_swipe.x, -_swipe.y * 3, _swipe.y);
        this.currentSpeed = swipe3D;
    }


    updateSpeed() {
        //console.log("gravity: ", this.gravity);

        //console.log(this.currentSpeed, this.deltaTime);


        if (this.currentPosition.y <= 0) {

            this.currentSpeed.y *= -1;

            //this.currentSpeed.multiplyScalar(-1);
            console.log(this.currentSpeed.length());
            console.log("switchedDirection!");
            return;
        }

        let scaledGravity = this.gravity.clone().multiplyScalar(this.deltaTime);
        //console.log("scaledGravity: ", scaledGravity);
        this.currentSpeed.add(scaledGravity);



        //console.log("gravity: ", this.gravity);
    }
}

export {Ball}