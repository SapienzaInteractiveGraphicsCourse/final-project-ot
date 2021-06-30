"use strict"
import * as THREE from './resources/three.js-r129/build/three.module.js';
import {Camera} from "./content/Camera.js";


import {resizeCanvas} from "./content/utils.js";
import {Snake} from "./content/Snake.js";


function main() {
    /*----- Enviroment -----*/
    const canvas = document.getElementById("canvas");
    const renderer = new THREE.WebGLRenderer({canvas});
    const scene = new THREE.Scene();

    /*------ Data ------*/
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 2000);
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    const snake = new Snake();




    /*----- Init ------*/
    camera.position.set(0, 20, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);

    light.position.set(0, 10, 2);

    scene.add(light);
    scene.add(snake.head);

    snake.addNode();
    snake.addNode();
    snake.addNode();

    function render(time) {
        resizeCanvas(renderer,camera);


        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
main()