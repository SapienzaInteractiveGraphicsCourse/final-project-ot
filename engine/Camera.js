"use strict"
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import {Config} from "./Config.js";
import {Utilities} from "./Utilities.js";
import {cross} from "../Common/MVnew.js";

export class Camera {

    constructor() {
        // Camera
        this.speed = Config.camera_speed;
        this.radius = Config.camera_radius;
        this.offset_up = Config.camera_offset_up;
        this.offset_right = Config.camera_offset_right;
        this.camera = new THREE.PerspectiveCamera(Config.fov,Config.aspect,Config.near,Config.far);

        // Light
        this.light = new THREE.PointLight(Config.camera_light_color, Config.camera_light_intensity);
        this.light_pos = Config.camera_light_position;
        this.light.position.set(this.light_pos.x, this.light_pos.y, this.light_pos.z);


        this.container = new THREE.Object3D();
        this.container.add(this.camera);
        this.camera.add(this.light);
        this.container.position.set(this.offset_right, this.offset_up, this.radius);


    }

    update_position(up_direction, right_direction) {
        const up_vector = Utilities.direction_to_vector(up_direction);
        const right_vector = Utilities.direction_to_vector(right_direction);

        const camera_vector = cross(right_vector, up_vector);
        const camera_direction = Utilities.vector_to_direction(camera_vector);
        camera_vector[camera_direction.axis] *= this.radius;
        camera_vector[up_direction.axis] = up_direction.sign * this.offset_up;
        camera_vector[right_direction.axis] = right_direction.sign * this.offset_right;


        const target_pos = {x: camera_vector[0], y:camera_vector[1], z:camera_vector[2]};
        const target_up = {x: up_vector[0], y: up_vector[1], z: up_vector[2]};
        new TWEEN.Tween(this.container.position).to(target_pos, this.speed).easing(TWEEN.Easing.Quadratic.Out).start();
        new TWEEN.Tween(this.camera.up).to(target_up,this.speed).easing(TWEEN.Easing.Quadratic.Out).start();
    }

    reset_position() {
        this.container.position.set(this.offset_right, this.offset_up, this.radius);
        this.camera.up.set(0, 1, 0);
    }


}