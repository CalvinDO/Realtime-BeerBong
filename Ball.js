
class Ball extends THREE.Mesh {

    currentSpeed = new THREE.Vector3(0, 0, 0);
    currentPosition = new THREE.Vector3(0, 2, 0);
    gravity = new THREE.Vector3(0, -9.81, 0);

    now = Date.now();
    deltaTime = 0

    constructor(geometry, material) {
        super(geometry, material);
    }

    updatePhysics() {

        this.updateSpeed();

        this.updatePosition();
    }

    updatePosition() {
        this.currentPosition.add(this.currentSpeed.clone().multiplyScalar(this.deltaTime));

        this.position.copy(this.currentPosition);
    }

    updateSpeed() {
        //console.log("gravity: ", this.gravity);

        //console.log(this.currentSpeed, this.deltaTime);
        if (this.currentPosition.y <= 0) {
            this.currentSpeed.multiplyScalar(-1);
            console.log(this.currentSpeed.length());
            console.log("switchedDirection!");
            return;
        }

        let scaledGravity = this.gravity.clone().multiplyScalar(this.deltaTime);
        //console.log("scaledGravity: ", scaledGravity);
        this.currentSpeed.add(scaledGravity);



        //console.log("gravity: ", this.gravity);
    }

    calculateDeltaTime() {
        this.deltaTime = (Date.now() - this.now) / 1000
        this.now = Date.now()
    }
}