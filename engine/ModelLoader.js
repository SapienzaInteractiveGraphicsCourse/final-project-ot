//TODO REMOVE
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {GLTFLoader} from "../resources/three.js-r129/examples/jsm/loaders/GLTFLoader.js";
import {Config} from "./Config.js";

export class EntityMeshManager {

    static #instance = null;

    #food_geometry;
    #food_material;

    #obstacle_part_geometry;
    #obstacle_part_material;

    #lucky_bonus_geometry;
    #lucky_bonus_material;

    #score_bonus_geometry;
    #score_bonus_material;

    #fast_bonus_geometry;
    #fast_bonus_material;

    #invincibility_bonus_geometry;
    #invincibility_bonus_material;

    #invisibility_bonus_geometry;
    #invisibility_bonus_material;


    /*------- SINGLETON Handle ------*/
    static init() {
        if (EntityMeshManager.#instance != null) {
            console.log("ERROR: EntityMeshManager already initialized");
            return null;
        }
        EntityMeshManager.#instance = new EntityMeshManager();
    }

    static get_instance() {
        if (EntityMeshManager.#instance != null)
            return EntityMeshManager.#instance;
        console.log("ERROR: EntityMeshManager not initialized");
    }

    constructor() {

        // food
        this.#food_geometry = new THREE.SphereGeometry( 0.25, 8, 8 );
        this.#food_material = new THREE.MeshBasicMaterial( {color: 0xCE1212} );

        // obstacle part
        const obs_material = new THREE.MeshNormalMaterial();
        obs_material.transparent = true;
        obs_material.opacity = 0.8;
        this.#obstacle_part_geometry = new THREE.BoxGeometry(1, 1 ,1);
        this.#obstacle_part_material = obs_material;

        // lucky bonus
        this.#lucky_bonus_geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        this.#lucky_bonus_material = new THREE.MeshBasicMaterial( { color: 0x48A229 } );

        // score bonus
        this.#score_bonus_geometry = new THREE.TextGeometry('$', {
            font: ModelLoader.get_instance().models[Config.score_bonus_gltf_model_name],
            size: 0.5,
            height: 0.1
        });

        this.#score_bonus_material = new THREE.MeshBasicMaterial( { color: 0xFFC500 } );



        // fast bonus
        this.#fast_bonus_geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        this.#fast_bonus_material = new THREE.MeshBasicMaterial( { color: 0xFFFF92 } );

        // invisibility bonus
        this.#invisibility_bonus_geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        this.#invisibility_bonus_material = new THREE.MeshBasicMaterial( { color: 0xBAC2DC } );

        // invincibility bonus
        // this.#invincibility_bonus_geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        // this.#invincibility_bonus_material = new THREE.MeshBasicMaterial( { color: 0x3A5FD6 } );
        //
        // this.#invincibility_bonus_geometry = ModelLoader.get_instance().models[0];

    }

    get_food_mesh(){
        return new THREE.Mesh( this.#food_geometry, this.#food_material );
    }

    get_obstacle_part_mesh(){

        return new THREE.Mesh( this.#obstacle_part_geometry, this.#obstacle_part_material );
    }

    get_lucky_bonus_mesh(){
        return new THREE.Mesh( this.#lucky_bonus_geometry, this.#lucky_bonus_material );
    }

    get_score_bonus_mesh(){
        return new THREE.Mesh( this.#score_bonus_geometry, this.#score_bonus_material );
    }

    get_fast_bonus_mesh(){
        return new THREE.Mesh( this.#fast_bonus_geometry, this.#fast_bonus_material );
    }

    get_invisibility_bonus_mesh(){
        // return new THREE.Mesh( this.#invisibility_bonus_geometry, this.#invisibility_bonus_material );

        let model = ModelLoader.get_instance().models[Config.invisibility_bonus_gltf_model_name];
        return model;
    }

    get_invincibility_bonus_mesh(){

        let model = ModelLoader.get_instance().models[Config.invincibility_bonus_gltf_model_name];
        return model;
        // return new THREE.Mesh( this.#invincibility_bonus_geometry, this.#invincibility_bonus_material );
    }



}

export class ModelLoader{

    static #instance;

    #resources_to_load;
    #gltf_loader;
    #font_loader;

    models = [];
    geometries = [];

    /*------- SINGLETON Handle ------*/
    static init(callback) {
        if (ModelLoader.#instance != null) {
            console.log("ERROR: ModelLoader already initialized");
            return null;
        }
        ModelLoader.#instance = new ModelLoader(callback);
    }

    static get_instance() {
        if (ModelLoader.#instance != null)
            return ModelLoader.#instance;
        console.log("ERROR: ModelLoader not initialized");
    }

    constructor(callback){

        //  Manager
        const manager = new THREE.LoadingManager();
        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        // manager.onLoad = function ( ) {
        //
        //     console.log( 'Loading complete!');
        //
        // };

        manager.onLoad = callback;

        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        manager.onError = function ( url ) {

            console.log( 'There was an error loading ' + url );

        };


        this.#gltf_loader = new GLTFLoader( manager );
        this.#resources_to_load = [];
        this._total_resources = 0;

        this.#font_loader = new THREE.FontLoader(manager);




    }


    add_resources_to_load(resource){
        this.#resources_to_load.push(resource);
        this._total_resources++;
    }


    load_font(resource, onload_callback, onprogress_callback, onerror_callback){

        let loader = this;

        // load font
        this.#font_loader.load( resource.path, private_font_onload_callback, onprogress_callback, onerror_callback);

        function private_font_onload_callback(font){
            loader.models[resource.name] = font;
            onload_callback();
        }
    }

    load_gltf(resource, onload_callback, onprogress_callback, onerror_callback){

        let loader = this;

        // load model
        this.#gltf_loader.load( resource.path, private_gltf_onload_callback, onprogress_callback, onerror_callback );

        function private_gltf_onload_callback(gltf){
            loader.models[resource.name] = gltf.scene;
            onload_callback();
        }
    }

    load_resources(onload_callback, onprogress_callback, onerror_callback){

        // get first model path to load
        let resource = this.#resources_to_load.pop();
        while( resource !== undefined){

            // resource = { type: ..., name: ..., path: ...}
            switch (resource.type) {
                case 'gltf':
                    this.load_gltf(resource, onload_callback, onprogress_callback, onerror_callback);
                    break;
                case 'font':
                    this.load_font(resource, onload_callback, onprogress_callback, onerror_callback);
                    break;
                case 'texture':
                    break;
                default:
                    break

            }


            // get next model path to load
            resource = this.#resources_to_load.pop();
        }


    }

    get total_resources() {
        return this._total_resources;
    }


    #resource_onload_callback(gltf){
        // console.log("Resource loaded callback.");

    }

    #resource_onprogress_callback(xhr){
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }

    #resource_onerror_callback(error){
        // console.log( 'An error happened' );

    }




}

// let loader = new ModelLoader();
//
// // loader.add_resources_to_load('/home/leonardo/WebstormProjects/final-project-ot/engine/models/apple/scene.gltf');
// // loader.add_resources_to_load('/home/leonardo/WebstormProjects/final-project-ot/engine/models/stone/scene.gltf');
//
// loader.add_resources_to_load('models/apple/scene.gltf');
// loader.add_resources_to_load('models/stone/scene.gltf');
// loader.add_resources_to_load('models/big_border_stone_03/scene.gltf');
// loader.add_resources_to_load('models/stone_black_1/scene.gltf');
//
// loader.load_resources();


