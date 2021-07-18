import {Environment} from "./Environment.js";
import {RandomEnvironmentGenerator} from "./EnvironmentGenerator.js";

import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import { OrbitControls } from '../resources/three.js-r129/examples/jsm/controls/OrbitControls.js';
import { ObstaclePart, Food, Bonus, Obstacle } from "./Entity.js";
import {Controller} from "./Controller.js";
import {Camera} from "./Camera.js";
import {Utilities} from "./Utilities.js";
import {Config} from "./Config.js";



class GameEngine{

    constructor() {

        // read configuration

        this.world_width = Config.world_width;
        this.world_height = Config.world_height;
        this.world_depth = Config.world_depth;
        this.world_face_depth = Config.world_face_depth;

        this.game_level = Config.game_level;

        // end configuration

        this.game = null;



    }

    init_resources(){
        //    load texture, bump maps, images etc.
        console.log("Loading resources...");

        console.log("Resources loaded.");
    }

    init_engine(){
        // prepare game
        console.log("Init game...");

        let environment = new Environment(
            this.world_width,
            this.world_height,
            this.world_depth,
            this.world_face_depth
        );

        let game = new RandomEnvironmentGenerator(environment);
        game.init_game(this.game_level);

        this.game = game;

        console.log("Game initialized.");
    }

    start_engine(){
        // start match

        console.log("Starting game.");

        Controller.init(this.game);
        Controller.get_instance().right();
        Controller.get_instance().move_snake();

        console.log("Game started.");
    }

    stop_engine(){
        // stop match
        console.log("Stopping game.");

        console.log("Game stopped.");

    }


}


let engine = new GameEngine();
engine.init_resources();
engine.init_engine();


/*----- Enviroment -----*/
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas});
const scene = new THREE.Scene();
const light = new THREE.AmbientLight( 0x404040, 5.0); // soft white light
const camera_obj = new Camera(0,0,25);

const controls = new OrbitControls( camera_obj.camera, renderer.domElement );
controls.target.set(0, 0, 0);


scene.add( light );
scene.add( engine.game.environment.mesh);

requestAnimationFrame(render);


function render(time) {

    if (engine.game.world_directions_updated){
        camera_obj.update_position(engine.game.up_direction, engine.game.right_direction);
        engine.game.world_directions_updated = false;
    }


    Utilities.resizeCanvas(renderer, camera_obj.camera);

    TWEEN.update(time);

    controls.update();

    renderer.render(scene, camera_obj.camera);

    requestAnimationFrame(render);
}


function configure_event_handlers(){

    document.getElementById('btn-start').addEventListener("click", btn_start_click_function);
    // document.getElementById('btn-end').addEventListener("click", this.btn_end_click_function);

}

function btn_start_click_function(){
    console.log("start");
    let message = "Settings"
    alert(message);
    document.getElementById('gamestartscreen').hidden = true;
    engine.start_engine();
}

function btn_end_click_function(game){
    console.log("end");

    engine.stop_engine();

    document.getElementById('gamestartscreen').hidden = false;
}


// requestAnimationFrame(render);


configure_event_handlers();



// TODO Remove
// var controls;
// var cube_environment;
//
// let game;




// function start_engine(){
//
//     /*----- Enviroment -----*/
//     // const canvas = document.getElementById("canvas");
//     // const renderer = new THREE.WebGLRenderer({canvas});
//     // const scene = new THREE.Scene();
//     // const light = new THREE.AmbientLight( 0x404040, 5.0); // soft white light
//     // const camera_obj = new Camera(0,0,25);
//     //
//     //
//     // controls = new OrbitControls( camera_obj.camera, renderer.domElement );
//     // controls.target.set(0, 0, 0);
//
//
//
//
//     let w_width = Config.world_width;
//     let w_height = Config.world_height;
//     let w_depth = Config.world_depth;
//     let w_face_depth = Config.world_face_depth;
//
//     let game_level = Config.game_level;
//
//     let environment = new Environment(w_width, w_height, w_depth, w_face_depth);
//
//     game = new RandomEnvironmentGenerator(environment);
//     game.init_game(game_level);
//     game.spawn_objects(3, Food, true, true, true, false);
//     game.spawn_objects(3, Bonus, true, true, true, false);
//     game.spawn_objects(30, ObstaclePart, true, true, true, false);
//
//
//     Controller.init(game);
//     cube_environment = game.environment.mesh;
//
//     scene.add( light );
//     scene.add(cube_environment);
//
//     Controller.get_instance().right();
//     Controller.get_instance().move_snake();
//     game.snake.add_node();
//     game.snake.add_node();
//     game.snake.add_node();
//     game.snake.add_node();
//
//
//
//
//
//
//     var tic = 0;
//
//
//     // function render(time) {
//     //     // tic++;
//     //     // if(tic % 200 == 0){
//     //     //
//     //     //     console.log("TIC: ", tic);
//     //     //
//     //     //     //game.move_objects(3, false);
//     //     //
//     //     //     //game.destroy_objects(3, true);
//     //     //
//     //     //     // game.spawn_objects(1, Food, true, true, true);
//     //     //     // if(tic == 200) game.spawn_objects(1, Bonus, true, true, true, false);
//     //     //     //game.spawn_objects(5, ObstaclePart, true, true, true, true);
//     //     //
//     //     // }
//     //     if (game.world_directions_updated){
//     //         camera_obj.update_position(game.up_direction, game.right_direction);
//     //         game.world_directions_updated = false;
//     //     }
//     //
//     //
//     //     Utilities.resizeCanvas(renderer,camera_obj.camera);
//     //
//     //     TWEEN.update(time);
//     //
//     //     controls.update();
//     //
//     //     renderer.render(scene, camera_obj.camera);
//     //
//     //     requestAnimationFrame(render);
//     // }
//     //
//     // requestAnimationFrame(render);
//
// }



// start_engine();
