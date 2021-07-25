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
import {EntityMeshManager, ModelLoader} from "./ModelLoader.js";
import {ScoreManager} from "./ScoreManager.js";


class MatchManager {

    constructor() {


        this.read_configuration();

        this.save_configuration();


    }

    get_configuration_message(){

        let message = " Game configuration " + "\n";

        // general
        message += " username " + this.username + "\n";
        message += " current_level " + this.current_level + "\n";

        // game mode general
        message += " id " + this.game_mode_id + "\n";
        message += " name " + this.game_mode_name + "\n";
        message += " levels " + this.game_mode_levels + "\n";
        message += " total_levels " + this.game_mode_total_levels + "\n";

        // game level general
        message += " game level id " + this.game_mode_level_id + "\n";
        message += " game level name " + this.game_mode_level_name + "\n";

        // game level specific
        message += " world_width " + this.world_width + "\n";
        message += " world_height " + this.world_height + "\n";
        message += " world_face_depth" + this.world_depth + "\n";
        message += " game_level " + this.game_level + "\n";
        message += " spawn_obs " + this.spawn_obs + "\n";
        message += " spawn_bonus " + this.spawn_bonus + "\n";
        message += " movable_obs " + this.movable_obs + "\n";
        message += " movable_food " + this.movable_food + "\n";
        message += " movable_bonus " + this.movable_bonus + "\n";
        message += " erasable_obs " + this.erasable_obs + "\n";
        message += " erasable_food " + this.erasable_food + "\n";
        message += " erasable_bonus " + this.erasable_bonus + "\n";
        message += " target_score " + this.target_score + "\n";

        return message;
    }

    read_data_from_config(){

        // general
        this.current_level = Config.current_level;
        this.username = Config.username;

        // game mode general
        this.game_mode_id = Config.current_match_configuration.id;
        this.game_mode_name = Config.current_match_configuration.name;
        this.game_mode_levels = Config.current_match_configuration.levels;
        this.game_mode_total_levels = Config.current_match_configuration.total_levels;


        // game level general
        this.game_mode_level_name = Config.current_match_configuration.configuration.levels[Config.current_level].name;
        this.game_mode_level_id = Config.current_match_configuration.configuration.levels[Config.current_level].id;

        // game level specific
        this.texture_pack_id = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.texture_pack_id;

        this.world_width = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.world_width;
        this.world_height = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.world_height;
        this.world_depth = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.world_depth;
        this.world_face_depth = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.world_face_depth;

        this.game_level = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.game_level;
        this.target_score = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.target_score;

        this.spawn_bonus = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.spawn_bonus;
        this.spawn_obs = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.spawn_obs;

        this.movable_bonus = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.movable_bonus;
        this.movable_food = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.movable_food;
        this.movable_obs = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.movable_obs;

        this.erasable_bonus = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.erasable_bonus;
        this.erasable_food = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.erasable_food;
        this.erasable_obs = Config.current_match_configuration.configuration.levels[Config.current_level].configuration.erasable_obs;


    }

    read_configuration() {

        this.read_data_from_config();

        document.getElementById('username-text').value = this.username;
        document.getElementById('game-mode-select').selected = this.game_mode_name;


        if( ! this.game_mode_levels){
            // custom game
            enable_form_input(true);

            // alert(" read_configuration " + current_match_configuration.id + " current level " + current_level);

            document.getElementById('texture-mode-select').selected = Config.TEXTURE_PACKS[this.texture_pack_id];
            document.getElementById('env-dim-range').value = this.world_width;
            document.getElementById('env-level-range').value = this.game_level;

            document.getElementById('spw-obs-check').checked = this.spawn_obs;
            document.getElementById('spw-bonus-check').checked = this.spawn_bonus;

            document.getElementById('mov-obs-check').checked = this.movable_obs;
            document.getElementById('mov-food-check').checked = this.movable_food;
            document.getElementById('mov-bonus-check').checked = this.movable_bonus;

            document.getElementById('des-obs-check').checked = this.erasable_obs;
            document.getElementById('des-food-check').checked = this.erasable_food;
            document.getElementById('des-bonus-check').checked = this.erasable_bonus;

        }else{
            // regular game
            // alert(" read_configuration " + current_match_configuration.id + " current level " + current_level);
            enable_form_input(false);
        }




    }

    save_configuration(){

        Config.username = document.getElementById('username-text').value;

        let game_mode = parseInt(document.getElementById('game-mode-select').value);

        if(game_mode === Config.GAME_MODES[0].id) // custom
        {

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
            this.current_level = 0; // reset game level
            Config.current_level = this.current_level;
            Config.current_match_configuration = Config.GAME_MODES[0];

            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.texture_pack_id = texture_mode;
            Config.current_texture_pack = Config.TEXTURE_PACKS[texture_mode];

            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.world_width = env_dim;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.world_height = env_dim;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.world_depth = env_dim;

            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.game_level = env_level;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.spawn_obs = spw_obs;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.spawn_bonus = spw_bonus;

            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.movable_obs = mov_obs;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.movable_food = mov_food;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.movable_bonus = mov_bonus;

            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.erasable_obs = des_obs;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.erasable_food = des_food;
            Config.GAME_MODES[0].configuration.levels[Config.current_level].configuration.erasable_bonus = des_bonus;


        }
        else if(game_mode === Config.GAME_MODES[1].id) // regular
        {
            // if game mode is changed reset current level
            if(Config.current_match_configuration.id !== Config.GAME_MODES[1].id ) this.current_level = 0;

            Config.current_level = this.current_level; // update level if needed
            Config.current_match_configuration = Config.GAME_MODES[1]; // set game mode
            Config.current_texture_pack = Config.TEXTURE_PACKS[Config.current_match_configuration.configuration.levels[Config.current_level].configuration.texture_pack_id]; // set texture pack

        }
        else if(game_mode === Config.GAME_MODES[2].id) // regular
        {
            // if game mode is changed reset current level
            if(Config.current_match_configuration.id !== Config.GAME_MODES[2].id ) this.current_level = 0;
            Config.current_level = this.current_level; // update level if needed
            Config.current_match_configuration = Config.GAME_MODES[2]; // set game mode
            Config.current_texture_pack = Config.TEXTURE_PACKS[Config.current_match_configuration.configuration.levels[Config.current_level].configuration.texture_pack_id]; // set texture pack

        }
        else if(game_mode === Config.GAME_MODES[3].id) // regular
        {
            // if game mode is changed reset current level
            if(Config.current_match_configuration.id !== Config.GAME_MODES[3].id ) this.current_level = 0;
            Config.current_level = this.current_level; // update level if needed
            Config.current_match_configuration = Config.GAME_MODES[3]; // set game mode
            Config.current_texture_pack = Config.TEXTURE_PACKS[Config.current_match_configuration.configuration.levels[Config.current_level].configuration.texture_pack_id]; // set texture pack

        }
        //    todo add here new added world configuration



    }

    start_level(){
        // alert(
        //     " Start level \n" +
        //     " Config: " + this.game_mode_id + " " + this.game_mode_name + " " + this.game_mode_levels + "\n" +
        //     " Level: " + this.game_mode_level_name
        // )
    }

    end_level(reached_score){

        show_result_div(true);

        let result_div = document.getElementById('result-text');
        result_div.innerHTML = '';

        let message = "";
        message = "Game over " + this.username + " !";
        result_div.appendChild(document.createTextNode(message));
        result_div.appendChild(document.createElement("br"));
        message = "Total score: " + reached_score;
        result_div.appendChild(document.createTextNode(message));
        result_div.appendChild(document.createElement("br"));

        if (this.game_mode_levels === true) {
            // regular game
            let target_score = this.target_score;
            let level_name = this.game_mode_level_name;
            let total_level = this.game_mode_total_levels;
            let current_level = this.current_level;
            let world_name = this.game_mode_name;
            if (reached_score >= target_score) { // Win level
                message = "Level " + level_name + " win !";
                result_div.appendChild(document.createTextNode(message));
                result_div.appendChild(document.createElement("br"));

                // alert("Level Win, total score " + reached_score);
                if (total_level - 1 === current_level ){  // Win world
                    message = "World " + world_name + " completed !";
                    result_div.appendChild(document.createTextNode(message));
                    result_div.appendChild(document.createElement("br"));

                    current_level = 0;
                }
                else { // world to complete
                    current_level++;
                }
            } else {  // lose level
                // alert("Level Lose, total score " + reached_score);
                message = "Level " + level_name + " lose !";
                result_div.appendChild(document.createTextNode(message));
                result_div.appendChild(document.createElement("br"));
                message = target_score + " points are required to pass this level ";
                result_div.appendChild(document.createTextNode(message));
                result_div.appendChild(document.createElement("br"));

            }

            this.current_level = current_level;

        }
        else{
            // custom game

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

        scene.background = new THREE.Color(0,0,0.1);
        Config.max_anisotropy = renderer.getMaxAnisotropy();

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
            show_canvas_div(true);

            // init mesh manager that may be contains some object loaded by model loader.
            EntityMeshManager.init();


        }

    }

    init_engine(){
        // prepare game
        console.log("Init game...");

        // read match configuration
        this.match_manager.read_configuration();
        EntityMeshManager.get_instance().set_texture_pack();


        // init score manager
        this.score_manager = new ScoreManager();

        // init environment

        let environment = new Environment(
            this.match_manager.world_width,
            this.match_manager.world_height,
            this.match_manager.world_depth,
            this.match_manager.world_face_depth
        );

        // init environment manager
        this.environment_manager = new EnvironmentManager(environment);



        this.environment_manager.create_match(
            this.match_manager.game_level,

            this.match_manager.spawn_obs,
            this.match_manager.spawn_bonus,

            this.match_manager.movable_obs,
            this.match_manager.movable_food,
            this.match_manager.movable_bonus,

            this.match_manager.erasable_obs,
            this.match_manager.erasable_food,
            this.match_manager.erasable_bonus

        );

        // removes all mesh from the scene
        for( let i = this.scene.children.length - 1; i >= 0; i--) {
            let obj = this.scene.children[i];
            this.scene.remove(obj);
        }

        this.camera_obj.reset_position();

        this.scene.add(this.light);
        this.scene.add(this.camera_obj.container);

        let env_mesh = this.environment_manager.environment.mesh;
        environment.animate();
        this.scene.add(env_mesh);


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

    stop_engine(){
        // stop match
        console.log("Stopping game.");

        this.environment_manager.destroy_game();

        show_setting_div(true);
        show_canvas_div(true);
        show_loader_div(false);
        enable_start_btn(false);

        console.log("Game stopped.");

    }

    random_environment_interaction(){

        const spawn_obs = this.match_manager.spawn_obs;
        const spawn_bonus = this.match_manager.spawn_bonus;

        const movableObs = this.match_manager.movable_obs;
        const movableFood = this.match_manager.movable_food;
        const movableBonus = this.match_manager.movable_bonus;

        const erasableObs = this.match_manager.erasable_obs;
        const erasableFood = this.match_manager.erasable_food;
        const erasableBonus = this.match_manager.erasable_bonus;


        // 30 %
        if( Math.random() > 0.7 ){
            const percentage = Math.random();
            if(percentage > 0 && percentage < 25){ // 0 % < x < 25 %
                if(spawn_obs) {
                    if(Config.actived_bonus === Config.BONUS['InvincibilityBonus']) this.environment_manager.spawn_obstacles(5, true, movableObs, erasableObs, true, true);
                    else this.environment_manager.spawn_obstacles(5, true, movableObs, erasableObs, false, true);
                }
            } else if(percentage > 25 && percentage < 50) { // 25 % < x < 50 %
                if(spawn_bonus) this.environment_manager.spawn_random_type_bonus(5, true, movableBonus, erasableBonus, true);
            } else if(percentage > 50 && percentage < 75) { // 50 % < x < 75 %
                // todo makes move_objects typed and call iff movable is setted... (movableObs, movableFood, movableBonus)
                this.environment_manager.move_objects(5, true)
            } else if(percentage > 75 && percentage < 100) {
                this.environment_manager.destroy_objects(5, true);
            }
        }


    }

    // collision handler
    collision(content){


        if( content.eatable ) {

            console.log(content.constructor.name + " Hitted");

            this.environment_manager.destroy_object_structure(content.x, content.y, content.z);
            this.environment_manager.destroy_object_view();

            this.random_environment_interaction();

            let num;
            switch (content.constructor.name) {
                case 'ObstaclePart':
                    break;
                case 'SnakeNodeEntity':
                    if(Config.log) console.log("SnakeNodeEntity Not implemented exception");
                    break;
                case 'Food':
                    // when the snake eat food
                    // adds a node
                    this.environment_manager.snake.add_node();

                    // spawn a new food
                    if(this.environment_manager.food_num < 2) this.environment_manager.spawn_foods(1, true, true, true, false);

                    num = Math.random();
                    if(num > 0.8) this.environment_manager.spawn_random_type_bonus(1, true, true, true);

                    break;
                case 'LuckyBonus':
                    num = Math.random();
                    if(num > 0 && num < 0.30){
                        this.environment_manager.spawn_random_type_bonus(5, true, true, true);
                    }
                    else if(num > 0.30 && num < 0.60) this.environment_manager.spawn_foods(3, true, true, true);
                    else {
                        num = Math.floor((Math.random() * 5 ) + 2);
                        this.score_manager.multiplicator = num;
                    }

                    Config.actived_bonus = Config.BONUS['LuckyBonus'];
                    break;
                case 'ScoreBonus':
                    num = Math.floor((Math.random() * 5 ) + 2);
                    this.score_manager.multiplicator = num;

                    Config.actived_bonus = Config.BONUS['ScoreBonus'];
                    break;
                case 'FastBonus':

                    Config.actived_bonus = Config.BONUS['FastBonus'];
                    break;
                case 'InvincibilityBonus':
                        // makes obstacle part erasable and eatable
                        this.environment_manager.modify_objects(ObstaclePart, undefined, undefined, true, true);

                    Config.actived_bonus = Config.BONUS['InvincibilityBonus'];
                    break;
                case 'InvisibilityBonus':

                    Config.actived_bonus = Config.BONUS['InvisibilityBonus'];
                    break;
                case 'Bonus':

                    // Config.actived_bonus = Config.BONUS['LuckyBonus'];
                    break;
            }

            // removes mesh from scene and add the new ones once the score is updated
            if( this.score_manager.bonus_text_mesh !== null ) this.camera_obj.camera.remove(this.score_manager.bonus_text_mesh);
            if( this.score_manager.total_score_mesh !== null ) this.camera_obj.camera.remove(this.score_manager.total_score_mesh);
            if( this.score_manager.local_score_mesh !== null ) this.scene.remove(this.score_manager.local_score_mesh);

            this.score_manager.update_score(content);

            if( this.score_manager.local_score_mesh !== null ) this.scene.add(this.score_manager.local_score_mesh);
            if( this.score_manager.total_score_mesh !== null )this.camera_obj.camera.add(this.score_manager.total_score_mesh);
            if( this.score_manager.bonus_text_mesh !== null )this.camera_obj.camera.add(this.score_manager.bonus_text_mesh);

            this.score_manager.animate_local_score();
            this.score_manager.animate_bonus_text();


            return false;
        }
        else{

            if( this.score_manager.bonus_text_mesh !== null ) this.camera_obj.camera.remove(this.score_manager.bonus_text_mesh);
            if( this.score_manager.total_score_mesh !== null ) this.camera_obj.camera.remove(this.score_manager.total_score_mesh);
            if( this.score_manager.local_score_mesh !== null ) this.scene.remove(this.score_manager.local_score_mesh);

            this.match_manager.end_level(this.score_manager.score);

            return true; // end game

        }



    }


}


// attaches events on settings form buttons (save configuration button and start game button)
function configure_event_handlers(){

    document.getElementById('btn-start').addEventListener("click", btn_start_click_function);
    document.getElementById('btn-save').addEventListener("click", btn_save_click_function);
    document.getElementById('btn-continue').addEventListener("click", btn_continue_click_function);

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
    } else if(game_mode === Config.GAME_MODES[2].id) // regular
    {
        enable_form_input(false);
    } else if(game_mode === Config.GAME_MODES[3].id) // regular
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

function btn_continue_click_function(){

    show_result_div(false);
    engine.stop_engine();
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

function show_result_div(show){
    if(show) document.getElementById("result-div").style.display = "unset";
    else document.getElementById("result-div").style.display = "none";
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


let engine = new GameEngine();

engine.load_render();

engine.load_resources();





