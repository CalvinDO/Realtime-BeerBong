import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'

class Ball extends THREE.Mesh {

    currentSpeed = new THREE.Vector3(0, 0, 0);
    currentPosition = new THREE.Vector3(0, 1.2, 1.3);
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

    setBack() {
        this.currentPosition.set(0, 1, 1.3)
        this.currentSpeed.set(0, 1.2, 0);
        this.gravity.set(0, -9.81, 0)
        this.deltaTime = 0.02
    }

    toss(_swipe) {
        _swipe.multiplyScalar(0.005);
        let swipe3D = new THREE.Vector3(_swipe.x, -_swipe.y * 2, _swipe.y);
        this.currentSpeed = swipe3D;
    }


    updateSpeed() {
        //console.log("gravity: ", this.gravity);

        //console.log(this.currentSpeed, this.deltaTime);


        if (this.currentPosition.y <= 0.67) {

            this.currentSpeed.y *= -1;

            //this.currentSpeed.multiplyScalar(-1);
            // console.log(this.currentSpeed.length());
            // console.log("switchedDirection!");
            return;
        }

        let scaledGravity = this.gravity.clone().multiplyScalar(this.deltaTime);
        //console.log("scaledGravity: ", scaledGravity);
        this.currentSpeed.add(scaledGravity);



        //console.log("gravity: ", this.gravity);
    }
}

export { Ball }