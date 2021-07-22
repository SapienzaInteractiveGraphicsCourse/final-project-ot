import {Environment} from "./Environment.js";
import {EnvironmentManager} from "./EnvironmentManager.js";

import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import { OrbitControls } from '../resources/three.js-r129/examples/jsm/controls/OrbitControls.js';
import {ObstaclePart, Food, Bonus} from "./Entity.js";
import {Controller} from "./Controller.js";
import {Camera} from "./Camera.js";
import {Utilities} from "./Utilities.js";
import {Config} from "./Config.js";
import {SnakeNode} from "./Snake.js";
import {ModelLoader, EntityMeshManager} from "./ModelLoader.js";


class GameEngine{

    constructor() {

        // read configuration

        this.world_width = Config.world_width;
        this.world_height = Config.world_height;
        this.world_depth = Config.world_depth;
        this.world_face_depth = Config.world_face_depth;

        this.game_level = Config.game_level;

        // end configuration

        this.environment_manager = null;

        this.is_started = false;

        // score
        this.score_manager = new ScoreManger();


    }

    init_score_manager(){
        // this.score_manager.
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

        let manager = new EnvironmentManager(environment);
        let level = this.game_level;
        manager.init_game(level);

        this.environment_manager = manager;

        console.log("Game initialized.");
    }

    start_engine(){
        // start match

        console.log("Starting game.");

        this.is_started = true;

        Controller.init(this);
        Controller.get_instance().start();

        console.log("Game started.");
    }

    stop_engine(){
        // stop match
        console.log("Stopping game.");
        this.environment_manager.destroy_game();
        //this.init_engine();

        console.log("Game stopped.");

    }

    bonus_hit(content){

        console.log(content.constructor.name, " Hitted");
        // destroy object
        this.environment_manager.destroy_object_structure(content.x, content.y, content.z);
        this.environment_manager.destroy_object_view();

        this.environment_manager.spawn_random_type_bonus(1, true, true, true);

        this.score_manager.update_score(Bonus);


    }

    food_hit(content){
        this.environment_manager.destroy_object_structure(content.x, content.y, content.z);
        this.environment_manager.destroy_object_view();

        this.environment_manager.snake.add_node();
        this.environment_manager.spawn_foods(1, true, true, true, false);

        this.score_manager.update_score(Food);
    }

    obstacle_hit(){
        alert("Obstacle HIT");
        //console.log("obstacle hit");
        this.score_manager.update_score(ObstaclePart);
        this.stop_engine();
    }

    snake_hit(){

        alert("Snake HIT");
        this.score_manager.update_score(SnakeNode);

    }


}


class ScoreManger{

    get score() {
        return this._score;
    }

    _score;

    constructor() {
        this._score = Config.initial_score;
        this.multiplicator = Config.multiplicator;
        this.food_score = Config.food_score;
        this.bonus_score = Config.bonus_score;
        this.obstacle_score = Config.obstacle_score;
        this.snakenode_score = Config.snakenode_score;

        this.mesh = null;
    }

    update_score(type){
        let score = 0;
        switch (type.name) {
            case 'Food':
                score = this.food_score;
                break;

            case 'Bonus':
                score = this.bonus_score;
                break;

            case 'ObstaclePart':
                score = this.obstacle_score;
                break;

            case 'SnakeNode':
                score = this.snakenode_score;
                break;
            default:
                console.log("Update score: not implemented exception", type.name);
                break;
        }

        this._score = this._score + this.multiplicator * score;
        console.log("New Score: ", this._score);


    }


    draw(){

        const loader = new THREE.FontLoader();

        loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

            const geometry = new THREE.TextGeometry( 'Hello three.js!', {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            } );
        } );
    }






}


function load_resources(){

    //    load texture, bump maps, images etc.
    console.log("Loading resources...");

    ModelLoader.init(resources_loaded_callback);


    // ModelLoader.get_instance().add_resources_to_load({ type: 'gltf', path: 'models/stone/scene.gltf'});
    // ModelLoader.get_instance().add_resources_to_load({ type: 'gltf', path: 'models/big_border_stone_03/scene.gltf'});
    // ModelLoader.get_instance().add_resources_to_load({ type: 'gltf', path: 'models/stone_black_1/scene.gltf'});

    ModelLoader.get_instance().add_resources_to_load({ name: Config.food_gltf_model_name, type: 'gltf', path: Config.food_gltf_model_path });
    ModelLoader.get_instance().add_resources_to_load({ name: Config.invincibility_bonus_gltf_model_name, type: 'gltf', path: Config.invincibility_bonus_gltf_model_path});
    ModelLoader.get_instance().add_resources_to_load({ name: Config.score_bonus_gltf_model_name, type: 'font', path: Config.score_bonus_gltf_model_path});
    ModelLoader.get_instance().add_resources_to_load({ name: Config.invisibility_bonus_gltf_model_name, type: 'gltf', path: Config.invisibility_bonus_gltf_model_path});

    ModelLoader.get_instance().load_resources(resource_onload_callback, null, resource_onerror_callback);

    // one resource loaded callback
    function resource_onload_callback(){
        let delta = 100 / ModelLoader.get_instance().total_resources;
        let loading_status = document.getElementById("loader-progress-bar").style.width;
        loading_status = String(parseInt(loading_status) + delta + "%");
        document.getElementById("loader-progress-bar").style.width = loading_status;

    }

    function resource_onerror_callback(){
        console.log("Error");

    }

    function resource_onprogress_callback(){
        console.log('Progress');

    }


    // all resources loaded callback
    function resources_loaded_callback(){

        console.log("Resources loaded.");

        document.getElementById("loader-div").style.display = "none";
        document.getElementById("settings-div").style.display = "unset";

        // init mesh manager that may be contains some object loaded by model loader.
        EntityMeshManager.init();

    }

}

function init(){

    let engine = new GameEngine();
    engine.init_engine();
    engine.start_engine();

    /*----- Enviroment -----*/
    const canvas = document.getElementById("canvas-div");
    const renderer = new THREE.WebGLRenderer({canvas});
    const scene = new THREE.Scene();
    const light = new THREE.AmbientLight( 0x404040, 5.0); // soft white light
    const camera_obj = new Camera(0,0,25);

    const controls = new OrbitControls( camera_obj.camera, renderer.domElement );
    controls.target.set(0, 0, 0);


    scene.add( light );
    scene.add( engine.environment_manager.environment.mesh);

    requestAnimationFrame(render);


    function render(time) {

        if(engine.is_started){

            if (Controller.get_instance().world_directions_updated){
                camera_obj.update_position(Controller.get_instance().up_direction, Controller.get_instance().right_direction);
                Controller.get_instance().world_directions_updated = false;
            }

        }


        Utilities.resizeCanvas(renderer, camera_obj.camera);

        TWEEN.update(time);

        controls.update();

        renderer.render(scene, camera_obj.camera);

        requestAnimationFrame(render);
    }



}


function configure_event_handlers(){

    document.getElementById('btn-start').addEventListener("click", btn_start_click_function);
    // document.getElementById('btn-end').addEventListener("click", this.btn_end_click_function);

}

function btn_start_click_function(){

    document.getElementById("loader-div").style.display = "none";
    document.getElementById("settings-div").style.display = "none";
    document.getElementById("canvas-div").style.display = "unset";


    init();

}

function btn_end_click_function(game){
    console.log("end");

    engine.stop_engine();

    document.getElementById('gamestartscreen').hidden = false;
}



configure_event_handlers();

// test configuration
// [todo replace with the following function]
load_resources();

//document.getElementById("loader-div").style.display = "none";
//document.getElementById("settings-div").style.display = "none";
//document.getElementById("canvas-div").style.display = 'unset';
//init();

// [end todo replace]
