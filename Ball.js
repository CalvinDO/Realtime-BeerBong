import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'

class Ball extends THREE.Mesh {

    currentSpeed = new THREE.Vector3(0, 0, 0);
    currentPosition = new THREE.Vector3(0, 1.2, 1.3);
    gravity;
    deltaTime = 0.02;

    isKinematic = true;

    static radius = 0.02;

    static instance;

    static bouncesTillReset = 7;

    bounces = 0;

    constructor(_material, _gravity) {

        super(new THREE.SphereGeometry(Ball.radius, 32, 16), _material);

        this.gravity = _gravity;

        Ball.instance = this;
    }

    updatePhysics(_deltaTime) {

        this.deltaTime = _deltaTime;

        console.log(this.currentPosition, this.currentSpeed, this.position);

        if (this.isKinematic) {
            return;
        }

        this.updateSpeed();

        this.updatePosition();

    }

    updatePosition() {

        this.currentPosition.add(this.currentSpeed.clone().multiplyScalar(this.deltaTime));

        this.position.copy(this.currentPosition);
    }

    setBack() {

        this.currentPosition.set(0, 1.2, 1.3)
        this.currentSpeed.set(0, 0, 0);

        this.updatePosition();

        //this.gravity.set(0, -9.81, 0);
        //this.deltaTime = 0.02;


        this.bounces = 0;

        this.isKinematic = true;
    }

    toss(_swipe) {

        this.setBack();

        _swipe.multiplyScalar(0.005);

        let swipe3D = new THREE.Vector3(_swipe.x, -_swipe.y * 2, _swipe.y);
        this.currentSpeed = swipe3D;

        this.isKinematic = false;
    }


    updateSpeed() {
        //console.log("gravity: ", this.gravity);

        //console.log(this.currentSpeed, this.deltaTime);



        if (this.currentPosition.y <= 0.67) {


            this.currentSpeed.y *= -0.8;
            this.currentPosition.y += Math.abs(this.currentSpeed.y * this.deltaTime);

            this.bounces += 1;

            if (this.bounces > Ball.bouncesTillReset) {
                this.setBack();
            }
            return;
        }

        let scaledGravity = this.gravity.clone().multiplyScalar(this.deltaTime);
        //console.log("scaledGravity: ", scaledGravity);


        this.currentSpeed.add(scaledGravity);



        //console.log("gravity: ", this.gravity);
    }
}

export { Ball }