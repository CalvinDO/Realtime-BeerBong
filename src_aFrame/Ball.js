import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Camera } from './Camera.js';


class Ball {

    // The current Speed of the Ball. The Initial Speed is 0 0 0
    speed = new THREE.Vector3(0, 0, 0);
    // The current Position of the Ball
    // The concrete initial values are completely irrelevant because it get's set in front of the camera each frame per code.
    position = new THREE.Vector3(0, 1.2, 1.3);

    // Duplicate of the Gravity constant because due to having to work with Javascript i can't just use a namespace
    //and use the "export let" gravity variable of the whole namespace
    gravity;

    // Also an permanently updated duplicate for the deltaTime, because we are working with JavaScript...
    deltaTime = 0.02;

    // Kinematic bodys don't get influenced by world physics like the gravity or speed
    isKinematic = true;

    // The HTMLElement the Ball is carrying with. Ball could also be a subclass of an A-Entit
    element;

    // Radius of the cup
    static radius = 0.02;

    // Singleton management
    static instance;

    // The cup has 7 bounces until it get's reset
    static bouncesTillReset = 7;

    // A Factor estimated through tests, it just feels the best
    static strengthFactor = 5.77;

    //The Strength Factor get's scaled with the windows.innerHeight to have the same through percentage over the screen on every device
    static tossFactor = 1 / window.innerHeight * Ball.strengthFactor;

    // The amount of bounces the Ball has bounced since the last reset
    bounces = 0;

    // The frames the Game is Running, also a duplicate variable because we are working with JavaScript...
    framesAlive = 0;

    // The Distance the Ball gets positioned in front of the cam
    ballHoldingDistance = 0.4;

    // _gravity is used to duplicate the gravityConstant because we are working with JavaScript... 
    constructor(_gravity) {

        Ball.instance = this;

        this.gravity = _gravity;

        this.element = document.querySelector("a-sphere");

        this.element.setAttribute("scale", Ball.radius + " " + Ball.radius + " " + Ball.radius);

    }

    // Update the physics
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

    // Update the Position
    updatePosition() {

        this.position.add(this.speed.clone().multiplyScalar(this.deltaTime));

        this.updateHTML();
    }

    // Set the bounces and isKinematic to true, to hold the Ball in front of the cam, and update the position
    setBack() {

        this.updatePosition();

        this.bounces = 0;

        this.isKinematic = true;
    }

    // Set The Ball back to a specific position
    setBackTo(_position) {

        this.position.set(_position.x, _position.y, _position.z)
        this.speed.set(0, 0, 0);

        this.setBack();
    }


    // Toss the Ball from the Cam position using the swipe to calculate the resulting Speed
    tossFromCam(_swipe) {

        _swipe.multiplyScalar(Ball.tossFactor);

        let zeroPos = new THREE.Vector3();


        let camPos = Camera.instance.position.clone();
        camPos.sub(camPos.clone().normalize().multiplyScalar(this.ballHoldingDistance))

        this.setBackTo(camPos);

        // negate and normalize the Camera Vector, then multiply it with the up-down component of the delinearized negated Swipe, scaled by 3
        this.speed = zeroPos.clone().sub(Camera.instance.position).clone().normalize().multiplyScalar(this.getLogit(-_swipe.y) * 3);
        this.speed.add(new THREE.Vector3(0, this.getLogit(-_swipe.y) * 3, 0));


        let crossedToLeft = camPos.clone().cross(new THREE.Vector3(camPos.x, 0, camPos.z));
        crossedToLeft.normalize();
        // The TouchSwipe to the left and right has less influence than the touch to up and down, so devide swipe.x with 2
        crossedToLeft.multiplyScalar(_swipe.x / 2);

        this.speed.add(crossedToLeft);

        this.isKinematic = false;
    }

    // Mathematical curve for delinearisation of throw
    // Plot the curve in Geogebra for visualisation
    getLogit(a) {
        // universal scaling with 0.2 because it was best when testing and resulted from previously used calculations
        let x = a / 5;

        let output = 2.5 + Math.log(x / (1 - x));
        if (output < 0) {
            output = 0;
        }

        return output;
    }

    // A logging method used for debugging
    log(message) {
        let display = document.querySelector("#display");
        display.innerHTML = message.toString();
    }

    // updating the Speed
    updateSpeed() {

        if (this.hitsSomething()) {

            this.speed.y *= -0.8;

            this.position.y += Math.abs(this.speed.y * this.deltaTime);

            this.bounces += 1;

            if (this.bounces > Ball.bouncesTillReset) {
                this.setBackToCamPosPlusOffset();
            }
            return;
        }

        let scaledGravity = this.gravity.clone().multiplyScalar(this.deltaTime);

        this.speed.add(scaledGravity);
    }

    //Table or Floor hit detection
    hitsSomething() {

        let x = this.position.x;
        let y = this.position.y;
        let z = this.position.z;

        // 0 is the floor level
        if (y < 0) {
            return true;
        }

        // The X Dimensions/Boundaries or width of the Table
        if (x > -0.305 && x < 0.305) {
            // The Z Dimensions/Boundaries or length of the Table
            if (z > -1.22 && z < 1.22) {
                // The Y Dimension or Height of the Table
                if (y < 0.65) {
                    return true;
                }
            }
        }

        return false;
    }

    // Set The Ball Back to Cam Position + Offset
    setBackToCamPosPlusOffset() {
        let camPos = Camera.instance.position.clone();
        camPos.sub(camPos.clone().normalize().multiplyScalar(this.ballHoldingDistance))

        this.setBackTo(camPos);
    }

    // Update the position of the a-frame HTML Element
    updateHTML() {
        this.element.setAttribute("position", this.position.x + " " + this.position.y + " " + this.position.z);
    }
}

export { Ball }