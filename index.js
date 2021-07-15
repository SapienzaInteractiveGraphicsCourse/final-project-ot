"use strict"
import * as THREE from './resources/three.js-r129/build/three.module.js';
import {Camera} from "./content/Camera.js";


import {resizeCanvas} from "./content/utils.js";
import {EventHandler, Snake} from "./content/Snake.js";
import {TWEEN} from "./resources/three.js-r129/examples/jsm/libs/tween.module.min.js";

//TODO migliorare
let snake;

function main() {
    /*----- Enviroment -----*/
    const canvas = document.getElementById("canvas");
    const renderer = new THREE.WebGLRenderer({canvas});
    const scene = new THREE.Scene();

    /*------ Data ------*/
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 2000);
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    snake = new Snake();




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
    snake.addNode();
    snake.addNode();
    snake.addNode();
    snake.addNode();

    dummyController();
    //snake._moveToTarget(-3.2,0,0);
    //snake.goDown()
    //snake.start();
    function render(time) {
        //time *= 0.001;

        resizeCanvas(renderer,camera);



        TWEEN.update(time);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}



/*---- Tests ----*/
let count = 0
export function dummyController() {
    console.log(count);
    if (count++ < 2) {
        snake.goLeft();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 6) {
        snake.goDown();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 9) {
        snake.goRight();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 10) {
        snake.goUp();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 13) {
        snake.goRight();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 14) {
        snake.goUp();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 15) {
        snake.goRight();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 16) {
        snake.goUp();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 17) {
        snake.goRight();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 18) {
        snake.goUp();
        EventHandler.startNextEvent();
        return;
    }

    if (count < 19) {
        snake.goRight();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 20) {
        snake.goUp();
        EventHandler.startNextEvent();
        return;
    }
    if (count < 21) {
        snake.goLeft();
        EventHandler.startNextEvent();
        return;
    }

}


main()