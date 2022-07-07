import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Camera } from './Camera.js';


class Ball {

    speed = new THREE.Vector3(0, 0, 0);
    position = new THREE.Vector3(0, 1.2, 1.3);
    gravity;
    deltaTime = 0.02;

    isKinematic = true;

    element;

    static radius = 0.02;

    static instance;

    static bouncesTillReset = 7;

    static tossFactor = 1 / window.innerHeight * 5.77;
    bounces = 0;

    framesAlive = 0;

    ballHoldingDistance = 0.4;


    constructor(_gravity) {
        
        Ball.instance = this;

        this.gravity = _gravity;

        this.element = document.querySelector("a-sphere");

        this.element.setAttribute("scale", Ball.radius + " " + Ball.radius + " " + Ball.radius);
        
    }

    updatePhysics(_deltaTime) {

        this.deltaTime = _deltaTime;


        if (this.isKinematic) {
            this.setBackToCamPosPlusOffset();
            return;
        }

        this.updateSpeed();

        this.updatePosition();


        this.framesAlive++;
    }

    updatePosition() {

        this.position.add(this.speed.clone().multiplyScalar(this.deltaTime));

        this.updateHTML();
    }

    setBack() {

        this.position.set(0, 1.2, 1.3)
        this.speed.set(0, 0, 0);

        this.updatePosition();

        //this.gravity.set(0, -9.81, 0);
        //this.deltaTime = 0.02;


        this.bounces = 0;

        this.isKinematic = true;
    }

    setBackTo(_position) {

        this.position.set(_position.x, _position.y, _position.z)
        this.speed.set(0, 0, 0);

        this.updatePosition();

        this.bounces = 0;

        this.isKinematic = true;
    }

    toss(_swipe) {

        this.setBack();

        _swipe.multiplyScalar(Ball.tossFactor);

        let swipe3D = new THREE.Vector3(_swipe.x, -_swipe.y * 2, _swipe.y);
        this.speed = swipe3D;

        this.isKinematic = false;
    }

    tossFromCam(_swipe) {

        _swipe.multiplyScalar(Ball.tossFactor);

        let zeroPos = new THREE.Vector3();

        
        let camPos = Camera.instance.position.clone();
        camPos.sub(camPos.clone().normalize().multiplyScalar(this.ballHoldingDistance))

        this.setBackTo(camPos);

        this.speed = zeroPos.clone().sub(Camera.instance.position).clone().normalize().multiplyScalar(this.getLogit(-_swipe.y) * 3);
        this.speed.add(new THREE.Vector3(0, this.getLogit(-_swipe.y) * 3, 0));


        let crossedToLeft = camPos.clone().cross(new THREE.Vector3(camPos.x, 0, camPos.z));
        crossedToLeft.normalize();
        crossedToLeft.multiplyScalar(_swipe.x / 2);

        this.speed.add(crossedToLeft);

        this.isKinematic = false;
    }

    getLogit(a) {
        let x = a / 5;

        let output = 2.5 + Math.log(x / (1 - x));
        if (output < 0) {
            output = 0;
        }
        //this.log(output);
        return output;
    }

    log(message) {
        let display = document.querySelector("#display");
        display.innerHTML = message.toString();
    }

    updateSpeed() {

        if (this.hitsSomething()) {

            this.speed.y *= -0.8;

            this.position.y += Math.abs(this.speed.y * this.deltaTime);

            /*
            if (this.currentSpeed.y < 0){
                this.currentPosition.y += Math.abs(this.currentSpeed.y * this.deltaTime);
            } else{
                this.currentPosition.y -= Math.abs(this.currentSpeed.y * this.deltaTime);
            }
            */

            this.bounces += 1;

            if (this.bounces > Ball.bouncesTillReset) {
                this.setBackToCamPosPlusOffset();
            }
            return;
        }

        let scaledGravity = this.gravity.clone().multiplyScalar(this.deltaTime);

        this.speed.add(scaledGravity);
    }

    hitsSomething() {

        let x = this.position.x;
        let y = this.position.y;
        let z = this.position.z;


        if (y < 0) {
            return true;
        }

        if (x > -0.305 && x < 0.305) {

            if (z > -1.22 && z < 1.22) {

                if (/*y > 0.3 && */y < 0.65) {
                    return true;
                }
            }
        }

        return false;
    }

    setBackToCamPosPlusOffset() {
        let camPos = Camera.instance.position.clone();
        camPos.sub(camPos.clone().normalize().multiplyScalar(this.ballHoldingDistance))

        this.setBackTo(camPos);
    }

    updateHTML() {
        this.element.setAttribute("position", this.position.x + " " + this.position.y + " " + this.position.z);
    }
}

export { Ball }