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
        this.read_configuration();


        // end configuration

        this.environment_manager = null;

        this.started = false;

        // score
        this.score_manager = null;

        this.scene = null;


    }


    read_configuration() {

        this.world_width = Config.world_width;
        this.world_height = Config.world_height;
        this.world_depth = Config.world_depth;
        this.world_face_depth = Config.world_face_depth;

        this.game_level = Config.game_level;

    }

    save_configuration(){

        let username = document.getElementById('username-text').value;
        let env_dim = document.getElementById('env-dim-range').value;
        let env_level = document.getElementById('env-level-range').value;

        let spw_obs = document.getElementById('spw-obs-check').checked;
        let spw_bonus = document.getElementById('spw-bonus-check').checked;

        let mov_obs = document.getElementById('mov-obs-check').checked;
        let mov_food = document.getElementById('mov-food-check').checked;
        let mov_bonus = document.getElementById('mov-bonus-check').checked;

        let des_obs = document.getElementById('des-obs-check').checked;
        let des_food = document.getElementById('des-food-check').checked;
        let des_bonus = document.getElementById('des-bonus-check').checked;

        if(username !== "") Config.username = username;

        Config.world_width = env_dim;
        Config.world_height = env_dim;
        Config.world_depth = env_dim;

        Config.game_level = env_level;

        Config.spawn_obs = spw_obs;
        Config.spawn_bonus = spw_bonus;

        Config.movable_obs = mov_obs;
        Config.movable_food = mov_food;
        Config.movable_bonus = mov_bonus;

        Config.erasable_obs = des_obs;
        Config.erasable_food = des_food;
        Config.erasable_bonus = des_bonus;


        // let texture_pack;
        // Config.texture_pack = texture_pack;

    }


    load_render() {

        /*----- Enviroment -----*/
        const canvas = document.getElementById("canvas-div");
        const renderer = new THREE.WebGLRenderer({canvas});
        const scene = new THREE.Scene();
        const light = new THREE.AmbientLight( 0x404040, 5.0); // soft white light
        const camera_obj = new Camera(0,0,25);

        const controls = new OrbitControls( camera_obj.camera, renderer.domElement );
        controls.target.set(0, 0, 0);


        this.scene = scene;
        this.light = light;

        requestAnimationFrame(render);

        function render(time) {

            if(engine.started){

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

    load_resources(){

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

            show_loader_div(false);
            show_setting_div(true);
            show_canvas_div(false);

            // init mesh manager that may be contains some object loaded by model loader.
            EntityMeshManager.init();


        }

    }

    init_engine(){
        // prepare game
        console.log("Init game...");

        engine.read_configuration();

        // init score manager
        let score_manager = new ScoreManger();
        this.score_manager = score_manager;

        // init environment
        let environment = new Environment(
            this.world_width,
            this.world_height,
            this.world_depth,
            this.world_face_depth
        );

        // init environment manager
        let level = this.game_level;
        let manager = new EnvironmentManager(environment, level);

        this.environment_manager = manager;

        // removes all mesh from the scene
        for( let i = this.scene.children.length - 1; i >= 0; i--) {
            let obj = this.scene.children[i];
            this.scene.remove(obj);
        }

        this.scene.add(this.light);
        this.scene.add(this.environment_manager.environment.mesh);


        // init controller
        if(this.started) Controller.reset(this);
        else Controller.init(this);

        console.log("Game initialized.");
    }

    start_engine(){
        // start match

        console.log("Starting game.");

        this.started = true;

        Controller.get_instance().start();

        console.log("Game started.");
    }

    stop_engine(){
        // stop match
        console.log("Stopping game.");

        this.environment_manager.destroy_game();

        show_setting_div(true);
        show_canvas_div(false);
        show_loader_div(false);
        enable_start_btn(false);

        console.log("Game stopped.");

    }

    // collision handler
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

        this.read_score_configuration();

        this.mesh = null;
    }

    read_score_configuration(){
        this.multiplicator = Config.multiplicator;
        this.food_score = Config.food_score;
        this.bonus_score = Config.bonus_score;
        this.obstacle_score = Config.obstacle_score;
        this.snakenode_score = Config.snakenode_score;
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
        console.log("Score: ", this._score);

    }


    draw(){

        // const loader = new THREE.FontLoader();
        //
        // loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        //
        //     const geometry = new THREE.TextGeometry( 'Hello three.js!', {
        //         font: font,
        //         size: 80,
        //         height: 5,
        //         curveSegments: 12,
        //         bevelEnabled: true,
        //         bevelThickness: 10,
        //         bevelSize: 8,
        //         bevelOffset: 0,
        //         bevelSegments: 5
        //     } );
        // } );

        let value = this.score;

        // score bonus
        const geometry = new THREE.TextGeometry(value, {
            font: ModelLoader.get_instance().models[Config.score_bonus_gltf_model_name],
            size: 0.5,
            height: 0.1
        });

        this.material = new THREE.MeshBasicMaterial( { color: 0xFFC500 } );


    }






}




// attaches events on settings form buttons (save configuration button and start game button)
function configure_event_handlers(){

    document.getElementById('btn-start').addEventListener("click", btn_start_click_function);
    document.getElementById('btn-save').addEventListener("click", btn_save_click_function);

}

function btn_start_click_function(){

    show_setting_div(false);
    show_loader_div(false);
    show_canvas_div(true);

    engine.start_engine();

}

function btn_save_click_function(){


    // save configuration
    engine.save_configuration();

    enable_start_btn(true);

    engine.init_engine();



}

// html utility functions
function show_setting_div(show){
    if(show) document.getElementById("settings-div").style.display = "unset";
    else document.getElementById("settings-div").style.display = "none";

}

function show_loader_div(show){
    if(show) document.getElementById("loader-div").style.display = "unset";
    else document.getElementById("loader-div").style.display = "none";
}

function show_canvas_div(show){
    if(show) document.getElementById("canvas-div").style.display = "unset";
    else document.getElementById("canvas-div").style.display = "none";
}

function enable_start_btn(enable){
    if(enable) document.getElementById("btn-start").removeAttribute('disabled');
    else document.getElementById("btn-start").setAttribute('disabled', "true");

}


configure_event_handlers();

// test configuration
// [todo replace with the following function]
// load_resources();

//document.getElementById("loader-div").style.display = "none";
//document.getElementById("settings-div").style.display = "none";
//document.getElementById("canvas-div").style.display = 'unset';
//init();

// [end todo replace]


let engine = new GameEngine();

engine.load_render();

engine.load_resources();





