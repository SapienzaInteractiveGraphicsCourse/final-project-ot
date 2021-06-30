"use strict"

export class Camera {
    #fov;
    #aspect;
    #near;
    #far;
    #camera;

    constructor() {
        this.#fov = 75;
        this.#aspect = 2;  // the canvas default
        this.#near = 0.1;
        this.#far = 5;
        this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    //getter
    get position() {
        return this.#camera.position;
    }

    //setter
    set position(pos) {
        this.#camera.position = pos;
    }

}