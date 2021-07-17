import {Environment} from "./Environment.js";
import {RandomEnvironmentGenerator} from "./EnvironmentGenerator.js";

import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import { OrbitControls } from '../resources/three.js-r129/examples/jsm/controls/OrbitControls.js';
import { ObstaclePart, Food, Bonus, Obstacle } from "./Entity.js";
import {Controller} from "./Controller.js";
import {Camera} from "./Camera.js";
import {Utilities} from "./Utilities.js";




// TODO Remove
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
    var face_depth = 1;

    let environment = new Environment(w_width, w_height, w_depth, face_depth);

    game = new RandomEnvironmentGenerator(game_level, environment);
    game.spawn_objects(10, Food, true, true, true, false);
    game.spawn_objects(2, Bonus, true, true, true, false);


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
