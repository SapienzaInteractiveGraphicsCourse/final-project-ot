import {Environment} from "./Environment.js";
import {RandomEnvironmentGenerator} from "./EnvironmentGenerator.js";

import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
// import * as TWEEN from "../resources/tween.js-18.6.4/dist/tween.esm.js";
// import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
// import TWEEN from "https://code.createjs.com/1.0.0/tweenjs.min.js";

import * as THREE from '../resources/three.js-r129/build/three.module.js';
import { OrbitControls } from '../resources/three.js-r129/examples/jsm/controls/OrbitControls.js';
import { ObstaclePart, Food, Bonus, Obstacle } from "./Entity.js";
import {Controller} from "./Controller.js";
import {Camera} from "./Camera.js";
import {Utilities} from "./Utilities.js";





var controls;
var cube_environment;

let game;
    



function start_engine(){

    /*----- Enviroment -----*/
    const canvas = document.getElementById("canvas");
    const renderer = new THREE.WebGLRenderer({canvas});
    const scene = new THREE.Scene();
    const light = new THREE.AmbientLight( 0x404040, 5.0); // soft white light
    const camera_obj = new Camera(0,0,25);


    controls = new OrbitControls( camera_obj.camera, renderer.domElement );
    controls.target.set(0, 0, 0);

    


    let w_width = 10, w_height = 10, w_depth = 10;
    var game_level = 5;
    var face_depth = 3;

    let environment = new Environment(w_width, w_height, w_depth, face_depth);

    game = new RandomEnvironmentGenerator(game_level, environment);
    game.spawn_objects(10, Food, true, true, true, false);
    game.spawn_objects(2, Bonus, true, true, true, false);
    // game.


    Controller.init(game);
    cube_environment = game.environment.mesh;

    scene.add( light );
    scene.add(cube_environment);

    Controller.get_instance().right();
    Controller.get_instance().move_snake();
    game.snake.add_node();
    game.snake.add_node();
    game.snake.add_node();
    game.snake.add_node();






    var tic = 0;


    function render(time) {
        tic++;
        if(tic % 200 == 0){
        
            console.log("TIC: ", tic);

            //game.move_objects(3, false);

            //game.destroy_objects(3, true);
           
            // game.spawn_objects(1, Food, true, true, true);
            // if(tic == 200) game.spawn_objects(1, Bonus, true, true, true, false);
            //game.spawn_objects(5, ObstaclePart, true, true, true, true);
            
        }
        if (game.world_directions_updated){
            camera_obj.update_position(game.up_direction, game.right_direction);
            game.world_directions_updated = false;
        }


        Utilities.resizeCanvas(renderer,camera_obj.camera);

        TWEEN.update(time);

        controls.update();

        renderer.render(scene, camera_obj.camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

}


 
start_engine();


// document.getElementById('up').onclick = function(e){
//
//     console.log("rotate up");
//     console.log("current face ", current_face);
//     console.log("previous face ", previous_face);
//
//     let available_direction = get_available_direction();
//
//     console.log("available_direction ", available_direction);
//
//     let dir = available_direction['up'];
//     previous_face = current_face;
//     current_face = dir;
//     rotate_to_face(dir);
//
//
// }
//
//
// document.getElementById('down').onclick = function(e){
//
//     console.log("rotate down");
//     console.log("current face ", current_face);
//     console.log("previous face ", previous_face);
//
//     let available_direction = get_available_direction();
//
//     console.log("available_direction ", available_direction);
//
//     let dir = available_direction['down'];
//     previous_face = current_face;
//     current_face = dir;
//     rotate_to_face(dir);
// }
//
//
// document.getElementById('left').onclick = function(e){
//
//     console.log("rotate left");
//     console.log("current face ", current_face);
//     console.log("previous face ", previous_face);
//
//     let available_direction = get_available_direction();
//
//     console.log("available_direction ", available_direction);
//
//     let dir = available_direction['left'];
//     previous_face = current_face;
//     current_face = dir;
//     rotate_to_face(dir);
// }
//
//
// document.getElementById('right').onclick = function(e){
//
//     console.log("rotate right");
//     console.log("current face ", current_face);
//     console.log("previous face ", previous_face);
//
//     let available_direction = get_available_direction();
//
//     console.log("available_direction ", available_direction);
//
//     let dir = available_direction['right'];
//     previous_face = current_face;
//     current_face = dir;
//     rotate_to_face(dir);
// }

// 1 : [ 0  0  1 ]
// 2 : [ 1  0  0 ]
// 3 : [ 0  1  0 ]
// 4 : [ 0 -1  0 ]
// 5 : [-1  0  0 ]
// 6 : [ 0  0 -1 ]

// let offset = 50;
// let target_position = [
//     { x: 0, y: 0, z: offset },
//     { x: offset, y: 0, z: 0 },
//     { x: 0, y: offset, z: 0 },
//     { x: 0, y: -offset, z: 0 },
//     { x: -offset, y: 0, z: 0 },
//     { x: 0, y: 0, z: -offset }
// ];

// NEW
// 1 : [ 0  0  1 ]
// 2 : [ -1  0  0 ]
// 3 : [ 0  -1  0 ]
// 4 : [ 0 1  0 ]
// 5 : [1  0  0 ]
// 6 : [ 0  0 -1 ]

let offset = 50;
let target_position = [
    { x: 0, y: 0, z: offset },      // 1
    { x: -offset, y: 0, z: 0 },     // 2
    { x: 0, y: -offset, z: 0 },     // 3
    { x: 0, y: offset, z: 0 },      // 4
    { x: offset, y: 0, z: 0 },      // 5
    { x: 0, y: 0, z: -offset }      // 6
];


// 0        0       50   ( 1 )
// 0        25      25   ( 14 )
// 0        50      0    ( 4 )


let from_edge = 'down';
let current_face = 1;
let previous_face = 3;


function get_available_direction(){
    let direction;
    switch (current_face) {
        case 1:
            switch (previous_face) {
                case 2:
                    direction = {left: 4, right: 3, up: 5, down: 2};
                    break;
                case 3:
                    direction = {left: 2, right: 5, up: 4, down: 3};
                    break;
                case 4:
                    direction = {left: 5, right: 2, up: 3, down: 4};
                    break;
                case 5:
                    direction = {left: 3, right: 4, up: 2, down: 5};
                    break;     
                default:
                    console.log('error prev_face ', previous_face, ' current_face ', current_face);
                    break;
            }
            break;
        case 2:
            switch (previous_face) {
                case 1:
                    direction = {left: 3, right: 4, up: 6, down: 1};
                    break;
                case 3:
                    direction = {left: 6, right: 1, up: 4, down: 3};
                    break;
                case 4:
                    direction = {left: 1, right: 6, up: 3, down: 4};
                    break;
                case 6:
                    direction = {left: 4, right: 3, up: 1, down: 6};
                    break;     
                default:
                    console.log('error prev_face ', previous_face, ' current_face ', current_face);
                    break;
            }
            
            break;
        case 3:
            switch (previous_face) {
                case 1:
                    direction = {left: 5, right: 2, up: 6, down: 1};
                    break;
                case 2:
                    direction = {left: 1, right: 6, up: 5, down: 2};
                    break;
                case 5:
                    direction = {left: 6, right: 1, up: 2, down: 5};
                    break;
                case 6:
                    direction = {left: 2, right: 5, up: 1, down: 6};
                    break;     
                default:
                    console.log('error prev_face ', previous_face, ' current_face ', current_face);
                    break;
            }
            
            break;
        case 4:
            switch (previous_face) {
                case 1:
                    direction = {left: 2, right: 5, up: 6, down: 1};
                    break;
                case 2:
                    direction = {left: 6, right: 1, up: 5, down: 2};
                    break;
                case 5:
                    direction = {left: 1, right: 6, up: 2, down: 5};
                    break;     
                case 6:
                    direction = {left: 5, right: 2, up: 1, down: 6};
                    break;
            
                default:
                    console.log('error prev_face ', previous_face, ' current_face ', current_face);
                    break;
            }
            
            break;
        case 5:
            switch (previous_face) {
                case 1:
                    direction = {left: 4, right: 3, up: 6, down: 1};
                    break;
                case 3:
                    direction = {left: 1, right: 6, up: 4, down: 3};
                    break;
                case 4:
                    direction = {left: 6, right: 1, up: 3, down: 4};
                    break;     
                case 6:
                    direction = {left: 3, right: 4, up: 1, down: 6};
                    break;
            
                default:
                    console.log('error prev_face ', previous_face, ' current_face ', current_face);
                    break;
            }
            
            break;
        case 6:
            switch (previous_face) {
                case 2:
                    direction = {left: 3, right: 4, up: 5, down: 2};
                    break;
                case 3:
                    direction = {left: 5, right: 2, up: 4, down: 3};
                    break;
                case 4:
                    direction = {left: 2, right: 5, up: 3, down: 4};
                    break;     
                case 5:
                    direction = {left: 4, right: 3, up: 2, down: 5};
                    break;
            
                default:
                    console.log('error prev_face ', previous_face, ' current_face ', current_face);
                    break;
            }
            
            break;
        default:
            console.log('error prev_face ', previous_face, ' current_face ', current_face);
            break;
    }

    return direction;
}

    
function rotate_to_face(target_face){

    // let target_coords = target_position[target_face - 1];

    // rotate_to_coord(target_coords);    
    let current_coord = target_position[current_face - 1];
    let previous_coord = target_position[previous_face - 1];
    let interpolation_coord = get_coord_interpolation(current_coord, previous_coord);

    // console.log("current_face ", current_face, " coords ", current_coord);
    // console.log("previous_face ", previous_face, " coords ", previous_coord);

    // console.log("interpolation ", interpolation_coord);

    // rotate_to_coord(interpolation_coord);

    rotate_from_to_coord(previous_coord, current_coord);

   
    

}

function rotate_from_to_coord(from, to){
    
    let interpolation_coord = get_coord_interpolation(from, to);


    const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
    
    const tween_step_1 = new TWEEN.Tween(coords)
    .to(interpolation_coord, 1000)
    .onUpdate(() =>
      camera.position.set(coords.x, coords.y, coords.z)

    );

    const tween_step_2 = new TWEEN.Tween(coords)
    .to(to, 1000)
    .onUpdate(() =>
      camera.position.set(coords.x, coords.y, coords.z)

    ).delay(500);

    tween_step_1.chain(tween_step_2).start();
    

}

function rotate_to_coord(target_coords){

    const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
    const tween = new TWEEN.Tween(coords)
          .to(target_coords, 3000)
          .onUpdate(() =>
            camera.position.set(coords.x, coords.y, coords.z)

          )
          .start();
}

function get_coord_interpolation(from_coord, to_coord){
    
    let coord_interpolation = {};
    let from_coord_keys = Object.keys(from_coord);
    for(let i = 0; i < from_coord_keys.length; i++) {
        coord_interpolation[from_coord_keys[i]] = from_coord[from_coord_keys[i]] / 2;
    }

    let to_coord_keys = Object.keys(to_coord);
    for(let i = 0; i < to_coord_keys.length; i++) {
        coord_interpolation[to_coord_keys[i]] = coord_interpolation[to_coord_keys[i]] + to_coord[to_coord_keys[i]] / 2;
    }   

    return coord_interpolation;

}


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}