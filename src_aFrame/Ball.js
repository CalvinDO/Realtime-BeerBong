import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Camera } from './Camera.js';


class Ball extends THREE.Mesh {

    currentSpeed = new THREE.Vector3(0, 0, 0);
    currentPosition = new THREE.Vector3(0, 1.2, 1.3);
    gravity;
    deltaTime = 0.02;

    isKinematic = true;

    element;

    soundElement;

    static radius = 0.02;

    static instance;

    static bouncesTillReset = 7;

    static tossFactor = 0.0075;
    bounces = 0;

    framesAlive = 0;

    ballHoldingDistance = 0.4;


    constructor(_material, _gravity) {

        super(new THREE.SphereGeometry(Ball.radius, 32, 16), _material);

        this.gravity = _gravity;

        Ball.instance = this;

        this.element = document.querySelector("a-sphere");
        this.soundElement = document.querySelector("a-sphere a-sound");

        //this.log("'" + Ball.radius + " " + Ball.radius +" " + Ball.radius + "'")
        this.element.setAttribute("scale", Ball.radius + " " + Ball.radius + " " + Ball.radius);
        //this.log(this.element.getAttribute("scale").toString());
    }

    updatePhysics(_deltaTime) {

        this.deltaTime = _deltaTime;

        //console.log(this.currentPosition, this.currentSpeed, this.position);

        if (this.isKinematic) {
            //this.currentPosition = this.position = 
            this.setBackToCamPosPlusOffset();
            return;
        }

        this.updateSpeed();

        this.updatePosition();



        this.framesAlive++;
        if (this.framesAlive > 50) {
            //alert("frames alive = " + this.framesAlive + ".  CurrentPosition Z = " + this.currentPosition.z);
        }

        //this.log(this.framesAlive);
    }

    updatePosition() {

        this.currentPosition.add(this.currentSpeed.clone().multiplyScalar(this.deltaTime));

        this.position.copy(this.currentPosition);

        this.updateHTML();
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

    setBackTo(_position) {

        this.currentPosition.set(_position.x, _position.y, _position.z)
        this.currentSpeed.set(0, 0, 0);
        //this.log(this.currentPosition.x.toFixed(2) + " ; " + this.currentPosition.y.toFixed(2) + " ; " + this.currentPosition.z.toFixed(2) + " || Time: " + Date.now());

        this.updatePosition();

        //this.gravity.set(0, -9.81, 0);
        //this.deltaTime = 0.02;

        this.bounces = 0;

        this.isKinematic = true;
    }

    toss(_swipe) {

        this.setBack();

        _swipe.multiplyScalar(Ball.tossFactor);

        let swipe3D = new THREE.Vector3(_swipe.x, -_swipe.y * 2, _swipe.y);
        this.currentSpeed = swipe3D;

        this.isKinematic = false;

        this.log("BAll says: tossed!");
        //alert("BAll says: tossed!");
    }

    tossFromCam(_swipe) {

        _swipe.multiplyScalar(Ball.tossFactor);

        let zeroPos = new THREE.Vector3();

        //this.setBackTo((new THREE.Vector3(_toss.x, _toss.y, _toss.z)).multiplyScalar(ballSetBackFactor));
        let camPos = Camera.instance.position.clone();
        camPos.sub(camPos.clone().normalize().multiplyScalar(this.ballHoldingDistance))

        this.setBackTo(camPos);

        //this.log(_toss.x.toFixed(2) + " ; " + _toss.y.toFixed(2) + " ; " + _toss.z.toFixed(2) + " || Time: " + Date.now());

        this.currentSpeed = zeroPos.clone().sub(Camera.instance.position).clone().normalize().multiplyScalar(this.getLogit(-_swipe.y) * 3);
        this.currentSpeed.add(new THREE.Vector3(0, this.getLogit(-_swipe.y) * 3, 0));


        //this.log(this.getLogit(-_swipe.y)); 

        let crossedToLeft = camPos.clone().cross(new THREE.Vector3(camPos.x, 0, camPos.z));
        crossedToLeft.normalize();
        crossedToLeft.multiplyScalar(_swipe.x / 2);

        this.currentSpeed.add(crossedToLeft);

        //this.currentSpeed.multiplyScalar(0.0001);
        //this.isKinematic = false;
        this.isKinematic = false;
    }

    getLogit(a) {
        //assuming 5 is max swipe after factor
        let x = a / 5;
        //this.log(x.toFixed(2) +  "    "  + (1.8 + Math.log(x/(1-x))).toFixed(4) );

        let output = 2 + Math.log(x / (1 - x));
        if (output < 0) {
            output = 0;
        }
        this.log(output);
        return output;
    }

    log(message) {
        let display = document.querySelector("#display");
        display.innerHTML = message.toString();

    }

    updateSpeed() {
        //console.log("gravity: ", this.gravity);

        //console.log(this.currentSpeed, this.deltaTime);



        if (this.hitsSomething()) {

            this.soundElement.play();
            this.currentSpeed.y *= -0.65;

            this.currentPosition.y += Math.abs(this.currentSpeed.y * this.deltaTime);

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
        //console.log("scaledGravity: ", scaledGravity);


        this.currentSpeed.add(scaledGravity);



        //console.log("gravity: ", this.gravity);
    }

    hitsSomething() {

        let x = this.currentPosition.x;
        let y = this.currentPosition.y;
        let z = this.currentPosition.z;


        if (y < 0) {
            return true;
        }

        if (x > -0.305 && x < 0.305) {

            if (z > -0.614 && z < 0.614) {

                if (/*y > 0.3 && */y < 0.62) {
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
        //console.log(this.element.attributes);

        //this.log(this.currentPosition.y);
    }
}

export { Ball }