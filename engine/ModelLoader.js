//TODO REMOVE
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {GLTFLoader} from "../resources/three.js-r129/examples/jsm/loaders/GLTFLoader.js";
import {Config} from "./Config.js";
import {OBJLoader} from "../resources/three.js-r129/examples/jsm/loaders/OBJLoader.js";

export class EntityMeshManager {

    static #instance = null;
    texture_pack;

    #environment_core_mesh;
    #snake_head_mesh;
    #snake_node_mesh;
    #food_mesh;
    #obstacle_part_mesh;
    #lucky_bonus_mesh;
    #score_bonus_mesh;
    #fast_bonus_mesh;
    #invincibility_bonus_mesh;
    #invisibility_bonus_mesh;


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
        this.texture_pack = Config.current_texture_pack;
        this.set_texture_pack();
    }

    load_textures(){

    }



    /*------- Set methods ------*/
    set_texture_pack() {
        this.texture_pack = Config.current_texture_pack;
        this.set_texture_models();
        switch (this.texture_pack.id) {
            case 0:
            case 1:
                this.set_standard_pack();
                break;
        }
    }

    set_texture_models() {
        const textures = this.texture_pack.textures;
        console.log("Loading textures...")
        if (textures === null) return;

        if (textures["snake_head"] !== undefined)
            this.#snake_head_mesh = ModelLoader.get_instance().models[textures["snake_head"].name];

        if (textures["snake_node"] !== undefined)
            this.#snake_node_mesh = ModelLoader.get_instance().models[textures["snake_node"].name];

        if (textures["food"] !== undefined)
            this.#food_mesh = ModelLoader.get_instance().models[textures["food"].name];

        if (textures["obstacle"] !== undefined)
            this.#obstacle_part_mesh = ModelLoader.get_instance().models[textures["obstacle"].name];

        if (textures["lucky"] !== undefined)
            this.#lucky_bonus_mesh = ModelLoader.get_instance().models[textures["lucky"].name];

        if (textures["invisibility"] !== undefined) {
            this.#invisibility_bonus_mesh = ModelLoader.get_instance().models[textures["invisibility"].name];
        }

        if (textures["invincibility"] !== undefined)
            this.#invincibility_bonus_mesh = ModelLoader.get_instance().models[textures["invincibility"].name];

        if (textures["score"] !== undefined)
            this.#score_bonus_mesh = ModelLoader.get_instance().models[textures["score"].name];

        console.log("Done textures.")
    }

    set_standard_pack(){
        let geometry, material, light, color, mesh, object, dimension;
        /*------ Environment ------*/ //TODO
        const core_color = Config.world_color;
        const core_opacity = Config.world_opacity;
        material = new THREE.MeshPhongMaterial( {color: core_color, transparent: true, opacity: core_opacity} );
        geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

        this.#environment_core_mesh = new THREE.Mesh(geometry, material);


        /*------- Snake ------*/
        // Head
        dimension = Config.snake_head_dimension;
        color = 0x87c38f;
        geometry = new THREE.BoxGeometry(dimension,dimension,dimension);
        material = new THREE.MeshPhongMaterial({color: color, emissive: color, emissiveIntensity: 0.3});
        light = new THREE.PointLight(0x44aa88, 0.8, 2, 1);
        this.#snake_head_mesh = new THREE.Mesh(geometry, material).add(light);

        // Nodes
        dimension = Config.snake_nodes_dimension;
        color = 0x415d43;
        geometry = new THREE.BoxGeometry(dimension,dimension,dimension);
        material = new THREE.MeshPhongMaterial({color: color, emissive: color, emissiveIntensity: 0.3});
        light = new THREE.PointLight(color, 0.8, 2, 1);

        this.#snake_node_mesh = new THREE.Mesh(geometry, material).add(light);



        /*------- Food ------*/
        color = 0xd55672;
        geometry = new THREE.SphereGeometry( 0.25, 50, 50 );
        material = new THREE.MeshPhongMaterial( {color: color, emissive: color, emissiveIntensity: 0.4} );
        material.shininess = 200;
        light = new THREE.PointLight(color, 1.5, 2, 1);

        this.#food_mesh = new THREE.Mesh(geometry, material).add(light);



        /*------- Obstacle ------*/
        color = 0x7f6a93;
        geometry = new THREE.BoxGeometry(1, 1 ,1);
        material = new THREE.MeshPhongMaterial({color: color});
        material.transparent = true;
        material.opacity = 0.8;

        this.#obstacle_part_mesh = new THREE.Mesh(geometry, material);



        /*------- Lucky bonus ------*/
        color = 0xFFC500;
        mesh = this.#lucky_bonus_mesh.children[0];
        geometry = mesh.geometry;
        material = new THREE.MeshPhongMaterial({color: color, emissive: color, emissiveIntensity: 0.4});
        material.transparent = true;
        material.opacity = 0.8;


        mesh = new THREE.Mesh(geometry, material);
        light = new THREE.PointLight(color, 2.5, 2, 1);
        mesh.scale.set(0.01,0.01,0.01);
        mesh.add(light);

        this.#lucky_bonus_mesh = mesh;


        /*------- Score bonus ------*/
        color = 0xFFC500;
        geometry = new THREE.TextGeometry('$', {
            font: ModelLoader.get_instance().models[this.texture_pack.textures.score.name],
            size: 0.5,
            height: 0.1
        });
        material = new THREE.MeshPhongMaterial( { color: color, emissive: color, emissiveIntensity: 0.4 } );
        material.transparent = true;
        material.opacity = 0.8;
        light = new THREE.PointLight(color, 2.5, 2, 1);

        this.#score_bonus_mesh = new THREE.Mesh(geometry, material).add(light);

        /*------- Fast bonus - Deprecated ------*/
        geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        material = new THREE.MeshBasicMaterial( { color: 0xFFFF92 } );

        this.#fast_bonus_mesh = new THREE.Mesh(geometry, material);


        /*------- Invisibility bonus - Deprecated ------*/
        geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        material = new THREE.MeshBasicMaterial( { color: 0xBAC2DC } );

        this.#invisibility_bonus_mesh = new THREE.Mesh(geometry, material);


        /*------- Invincibility bonus ------*/
        color = 0xFFC500;
        mesh = this.#invincibility_bonus_mesh.children[0];
        geometry = mesh.geometry;
        material = new THREE.MeshPhongMaterial({color: color, emissive: color, emissiveIntensity: 0.6});
        material.transparent = true;
        material.opacity = 0.8;

        mesh = new THREE.Mesh(geometry, material);
        light = new THREE.PointLight(color, 2.5, 2, 1);
        mesh.scale.set(.3,.3,.3);

        mesh.add(light);
        this.#invincibility_bonus_mesh = mesh;

    }



    /* -------- Build meshes --------*/
    get_environment_core_mesh() {
        return this.#environment_core_mesh;
    }
    get_snake_head_mesh() {
        return this.#snake_head_mesh.clone();
    }

    get_snake_node_mesh() {
        return this.#snake_node_mesh.clone();
    }

    get_food_mesh(){
        return this.#food_mesh.clone();
    }

    get_obstacle_part_mesh(){
        return this.#obstacle_part_mesh.clone();
    }

    get_lucky_bonus_mesh(){
        return this.#lucky_bonus_mesh.clone();
    }

    get_score_bonus_mesh(){
        return this.#score_bonus_mesh.clone();
    }

    get_fast_bonus_mesh(){
        return this.#fast_bonus_mesh.clone();
    }

    get_invisibility_bonus_mesh(){
        return this.#invisibility_bonus_mesh.clone();
    }

    get_invincibility_bonus_mesh(){
        return this.#invincibility_bonus_mesh.clone();
    }
}

export class ModelLoader{

    static #instance;

    #resources_to_load;
    #gltf_loader;
    #obj_loader;
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


        this.#gltf_loader = new GLTFLoader(manager);
        this.#obj_loader = new OBJLoader(manager);
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

    load_obj(resource, onload_callback, onprogress_callback, onerror_callback){

        let loader = this;

        // load model
        this.#obj_loader.load( resource.path, private_obj_onload_callback, onprogress_callback, onerror_callback );

        function private_obj_onload_callback(obj){
            loader.models[resource.name] = obj;
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
                case 'obj':
                    this.load_obj(resource, onload_callback, onprogress_callback, onerror_callback);
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


