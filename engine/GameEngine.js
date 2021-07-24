import {Environment} from "./Environment.js";
import {EnvironmentManager} from "./EnvironmentManager.js";

import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {OrbitControls} from '../resources/three.js-r129/examples/jsm/controls/OrbitControls.js';
import {Bonus, Food, ObstaclePart, SnakeNodeEntity} from "./Entity.js";
import {Controller} from "./Controller.js";
import {Camera} from "./Camera.js";
import {Utilities} from "./Utilities.js";
import {Config} from "./Config.js";
import {SnakeNode} from "./Snake.js";
import {EntityMeshManager, ModelLoader} from "./ModelLoader.js";
import {ScoreManager} from "./ScoreManager.js";


class MatchManager {

    constructor() {


        this.username = null;
        this.game_mode = null;

        // regular game level
        this.current_level = Config.current_level;

        this.read_configuration();

        this.save_configuration();


    }

    get_configuration_message(){

        let message = " Game configuration " + "\n";
        // general
        message += " id " + this.game_mode.id + "\n";
        message += " name " + this.game_mode.name + "\n";
        message += " levels " + this.game_mode.levels + "\n";
        message += " total_levels " + this.game_mode.total_levels + "\n";
        // etc
        message += " world_width " + this.game_mode.configuration.levels[this.current_level].configuration.world_width + "\n";
        message += " world_height " + this.game_mode.configuration.levels[this.current_level].configuration.world_height + "\n";
        message += " world_face_depth" + this.game_mode.configuration.levels[this.current_level].configuration.world_depth + "\n";
        message += " game_level " + this.game_mode.configuration.levels[this.current_level].configuration.game_level + "\n";
        message += " spawn_obs " + this.game_mode.configuration.levels[this.current_level].configuration.spawn_obs + "\n";
        message += " spawn_bonus " + this.game_mode.configuration.levels[this.current_level].configuration.spawn_bonus + "\n";
        message += " movable_obs " + this.game_mode.configuration.levels[this.current_level].configuration.movable_obs + "\n";
        message += " movable_food " + this.game_mode.configuration.levels[this.current_level].configuration.movable_food + "\n";
        message += " movable_bonus " + this.game_mode.configuration.levels[this.current_level].configuration.movable_bonus + "\n";
        message += " erasable_obs " + this.game_mode.configuration.levels[this.current_level].configuration.erasable_obs + "\n";
        message += " erasable_food " + this.game_mode.configuration.levels[this.current_level].configuration.erasable_food + "\n";
        message += " erasable_bonus " + this.game_mode.configuration.levels[this.current_level].configuration.erasable_bonus + "\n";
        message += " target_score " + this.game_mode.configuration.levels[this.current_level].configuration.target_score + "\n";

        return message;
    }


    read_configuration() {

        document.getElementById('username-text').value = Config.username;

        let current_match_configuration = Config.current_match_configuration;
        document.getElementById('game-mode-select').selected = current_match_configuration.name;

        let current_level = this.current_level;

        if(!current_match_configuration.levels){
            // custom game
            enable_form_input(true);

            // alert(" read_configuration " + current_match_configuration.id + " current level " + current_level);

            let current_game_settings = current_match_configuration.configuration.levels[current_level].configuration;

            document.getElementById('texture-mode-select').selected = Config.TEXTURE_PACKS[current_game_settings.texture_pack_id];
            document.getElementById('env-dim-range').value = current_game_settings.world_width;
            document.getElementById('env-level-range').value = current_game_settings.game_level;


            document.getElementById('spw-obs-check').checked = current_game_settings.spawn_obs;
            document.getElementById('spw-bonus-check').checked = current_game_settings.spawn_bonus;

            document.getElementById('mov-obs-check').checked = current_game_settings.movable_obs;
            document.getElementById('mov-food-check').checked = current_game_settings.movable_food;
            document.getElementById('mov-bonus-check').checked = current_game_settings.movable_bonus;

            document.getElementById('des-obs-check').checked = current_game_settings.erasable_obs;
            document.getElementById('des-food-check').checked = current_game_settings.erasable_food;
            document.getElementById('des-bonus-check').checked = current_game_settings.erasable_bonus;

        }else{
            // regular game
            // alert(" read_configuration " + current_match_configuration.id + " current level " + current_level);

            enable_form_input(false);
        }




    }

    save_configuration(){

        let username = document.getElementById('username-text').value;

        let game_mode = parseInt(document.getElementById('game-mode-select').value);

        if(game_mode === Config.GAME_MODES[0].id) // custom
        {

            this.current_level = 0; // reset game level
            Config.current_level = this.current_level;
            Config.current_match_configuration = Config.GAME_MODES[0];

            // alert(" save configuration " + game_mode + " current level " + this.current_level);


            // player can modify settings

            let texture_mode = document.getElementById('texture-mode-select').value;

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

            // current_level = 0; always
            let current_level = this.current_level;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.texture_pack_id = texture_mode;

            Config.GAME_MODES[0].configuration.levels[current_level].configuration.world_width = env_dim;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.world_height = env_dim;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.world_depth = env_dim;

            Config.GAME_MODES[0].configuration.levels[current_level].configuration.game_level = env_level;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.spawn_obs = spw_obs;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.spawn_bonus = spw_bonus;

            Config.GAME_MODES[0].configuration.levels[current_level].configuration.movable_obs = mov_obs;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.movable_food = mov_food;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.movable_bonus = mov_bonus;

            Config.GAME_MODES[0].configuration.levels[current_level].configuration.erasable_obs = des_obs;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.erasable_food = des_food;
            Config.GAME_MODES[0].configuration.levels[current_level].configuration.erasable_bonus = des_bonus;


        }
        else if(game_mode === Config.GAME_MODES[1].id) // regular
        {
            // driven game
            // alert("save configuration " + game_mode + " current level " + this.current_level);
            Config.current_level = this.current_level;
            Config.current_match_configuration = Config.GAME_MODES[1];


        }

        this.username = username;
        this.current_level = Config.current_level;
        this.game_mode = Config.current_match_configuration;




    }

    start_level(){

        alert(
            " Start level \n" +
            " Config: " + this.game_mode.id + " " + this.game_mode.name + " " + this.game_mode.levels + "\n" +
            " Level: " + this.game_mode.configuration.levels[this.current_level].name
        )
    }

    end_level(reached_score){

        alert(
            " End level \n" +
            " Config: " + this.game_mode.id + " " + this.game_mode.name + " " + this.game_mode.levels + "\n" +
            " Total score " + reached_score + "\n" +
            " Level " + this.current_level
        )

        if (this.game_mode.levels === true) {
            // regular game
            let current_level = this.current_level;
            let target_score = this.game_mode.configuration.levels[current_level].configuration.target_score;
            if (reached_score >= target_score) {
                alert("Level Win, total score " + reached_score);
                if (this.game_mode.total_levels - 1 === this.current_level ){
                    alert("World completed, thanks you!");
                    this.current_level = 0;
                }
                else {
                    this.current_level++;
                }
            } else {
                alert("Level Lose, total score " + reached_score);
            }
        }
        else{
            // custom game
            alert("custom game, total score" + reached_score);
        }

    }


}

class GameEngine{

    constructor() {


        // // read configuration
        // this.read_configuration();

        // end configuration
        this.match_manager = new MatchManager();

        this.environment_manager = null;

        this.started = false;

        // score
        this.score_manager = null;

        this.scene = null;


    }


    load_render() {

        /*----- Enviroment -----*/
        const canvas = document.getElementById("canvas-div");
        const renderer = new THREE.WebGLRenderer({canvas});
        const scene = new THREE.Scene();
        const light = new THREE.AmbientLight( Config.ambient_light_color, Config.ambient_light_intensity);
        const camera_obj = new Camera(0,0,25);

        const controls = new OrbitControls( camera_obj.camera, renderer.domElement );
        controls.target.set(0, 0, 0);

        this.scene = scene;
        this.light = light;
        this.camera_obj = camera_obj;

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

        const textures_info = Config.TEXTURE_PACKS;
        for (let i = 0; i < textures_info.length; i++) {

            if (textures_info[i].textures === null) continue;
            for (let texture_name in textures_info[i].textures) {
                const texture_parameters = textures_info[i].textures[texture_name];
                if (texture_parameters === null) continue;
                ModelLoader.get_instance().add_resources_to_load(texture_parameters);

            }
        }

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

        // read match configuration
        this.match_manager.read_configuration();


        // init score manager
        this.score_manager = new ScoreManager();

        // init environment

        let environment = new Environment(
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.world_width,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.world_height,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.world_depth,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.world_face_depth
        );

        // init environment manager
        this.environment_manager = new EnvironmentManager(environment);

        this.environment_manager.create_match(
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.game_level,

            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.spawn_obs,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.spawn_bonus,

            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.movable_obs,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.movable_food,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.movable_bonus,

            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.erasable_obs,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.erasable_food,
            this.match_manager.game_mode.configuration.levels[this.match_manager.current_level].configuration.erasable_bonus

        );

        // removes all mesh from the scene
        for( let i = this.scene.children.length - 1; i >= 0; i--) {
            let obj = this.scene.children[i];
            this.scene.remove(obj);
        }

        this.scene.add(this.light);
        this.scene.add(this.camera_obj.container);
        this.scene.add(this.environment_manager.environment.mesh);


        // init or reset controller
        if(this.started) Controller.reset(this);
        else Controller.init(this);

        console.log("Game initialized.");
    }

    start_engine(){
        // start match

        console.log("Starting game.");

        console.log(this.match_manager.get_configuration_message());

        this.started = true;

        this.match_manager.start_level();

        Controller.get_instance().start();

        console.log("Game started.");
    }

    stop_engine(score){
        // stop match
        console.log("Stopping game.");


        this.match_manager.end_level(score);

        // this.environment_manager.destroy_game();

        show_setting_div(true);
        show_canvas_div(false);
        show_loader_div(false);
        enable_start_btn(false);

        console.log("Game stopped.");

    }

    update_engine(){
    }

    // collision handler

    // given the
    collision(content){


        if( content.eatable ) {

            console.log(content.constructor.name + " Hitted");

            this.environment_manager.destroy_object_structure(content.x, content.y, content.z);
            this.environment_manager.destroy_object_view();

            switch (content.constructor.name) {
                case 'ObstaclePart':
                    alert("Not implemented exception");
                    break;
                case 'SnakeNodeEntity':
                    alert("Not implemented exception");
                    break;
                case 'Food':
                    this.environment_manager.snake.add_node();
                    this.environment_manager.spawn_foods(1, true, true, true, false);


                    break;

                case 'LuckyBonus':
                case 'ScoreBonus':
                case 'FastBonus':
                case 'InvincibilityBonus':
                case 'InvisibilityBonus':
                case 'Bonus':

                    break;
            }



            // todo remove old
            // very dirty solution
            // this.scene.children.pop();

            this.camera_obj.camera.remove(this.score_manager.total_score_mesh);
            this.scene.remove(this.score_manager.local_score_mesh);

            this.score_manager.update_score(content);

            this.scene.add(this.score_manager.local_score_mesh);
            this.camera_obj.camera.add(this.score_manager.total_score_mesh);

            this.score_manager.animate();




            return false;
        }
        else{
            alert(content.constructor.name + " Hitted");

            this.stop_engine(this.score_manager.score);

            return true; // end game

        }



    }


}


// attaches events on settings form buttons (save configuration button and start game button)
function configure_event_handlers(){

    document.getElementById('btn-start').addEventListener("click", btn_start_click_function);
    document.getElementById('btn-save').addEventListener("click", btn_save_click_function);

    document.getElementById('game-mode-select').addEventListener("click", game_mode_option_change_function);

}

function game_mode_option_change_function(obj) {
    let game_mode = parseInt(document.getElementById('game-mode-select').value);
    if(game_mode === Config.GAME_MODES[0].id) // custom
    {
        enable_form_input(true);
    } else if(game_mode === Config.GAME_MODES[1].id) // regular
    {
        enable_form_input(false);
    }
}

function btn_start_click_function(){

    show_setting_div(false);
    show_loader_div(false);
    show_canvas_div(true);

    engine.start_engine();

}

function btn_save_click_function(){


    // save match configuration
    engine.match_manager.save_configuration();

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


function custom_texture_pack_select_menu(){
    let select_menu_object = document.getElementById("texture-mode-select");
    const packs = Config.TEXTURE_PACKS;
    for(let i = 0; i < packs.length; i++){
        let opt = document.createElement('option');
        opt.value = packs[i].id;
        opt.innerHTML = packs[i].name;
        select_menu_object.appendChild(opt);

    }
}

function custom_game_mode_select_menu(){
    let select_menu_object = document.getElementById("game-mode-select");
    const packs = Config.GAME_MODES;
    for(let i = 0; i < packs.length; i++){
        let opt = document.createElement('option');
        opt.value = packs[i].id;
        opt.innerHTML = packs[i].name;
        select_menu_object.appendChild(opt);

    }
}

function enable_form_input(enable = true){

    document.getElementById('texture-mode-select').disabled = !enable;

    document.getElementById('env-dim-range').disabled = !enable;
    document.getElementById('env-level-range').disabled = !enable;

    document.getElementById('spw-obs-check').disabled = !enable;
    document.getElementById('spw-bonus-check').disabled = !enable;

    document.getElementById('mov-obs-check').disabled = !enable;
    document.getElementById('mov-food-check').disabled = !enable;
    document.getElementById('mov-bonus-check').disabled = !enable;

    document.getElementById('des-obs-check').disabled = !enable;
    document.getElementById('des-food-check').disabled = !enable;
    document.getElementById('des-bonus-check').disabled = !enable;



}

configure_event_handlers();

custom_texture_pack_select_menu();

custom_game_mode_select_menu();

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





