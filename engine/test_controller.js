"use strict"
import {Snake} from "./../content/Snake.js";

import {TWEEN} from "./../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";

import { EventHandler } from "./../content/Snake.js";
import { Controller, KeyboardHandler } from "./Controller.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

const controls = new THREE.OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 50, 150 );
controls.update();

    
const light = new THREE.AmbientLight( 0x404040, 5.0); // soft white light
scene.add( light );

camera.position.z = 10;

let snake = new Snake();
snake.add_node();
snake.add_node();
snake.add_node();
snake.add_node();
snake.add_node();
snake.add_node();
snake.add_node();


scene.add(snake.head);

let controller = new Controller(snake);
let k_handler = new KeyboardHandler(controller);


var tic = 0;
const animate = function (time) {

    // console.log(time);
    tic++;
    requestAnimationFrame( animate );


    TWEEN.update(time);

    controls.update();
    
    renderer.render( scene, camera );

    // console.log(tic);
    // if(tic % 100 == 0) {
    //     EventHandler.startNextEvent();
    //     console.log("Timer expired");
    // }
    
        
};

animate(tic);
        

