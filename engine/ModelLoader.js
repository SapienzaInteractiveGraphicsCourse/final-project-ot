import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {GLTFLoader} from "../resources/three.js-r129/examples/jsm/loaders/GLTFLoader.js";
import {Config} from "./Config.js";
import {OBJLoader} from "../resources/three.js-r129/examples/jsm/loaders/OBJLoader.js";
import {MTLLoader} from "../resources/three.js-r129/examples/jsm/loaders/MTLLoader.js";

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
                this.set_standard_pack();
                break;
            case 1:
                this.set_pack_one();
                break;
        }
    }

    set_texture_models() {
        const textures = this.texture_pack.textures;
        console.log("Loading textures...")
        if (textures === null) return;

        if (textures["core"] !== undefined)
            this.#environment_core_mesh = ModelLoader.get_instance().models[textures["core"].name];

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
        /*------ Environment ------*/
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

        this.#snake_head_mesh = new THREE.Mesh(geometry, material)

        if (Config.graphic_level >= 1){
            light = new THREE.PointLight(color, 0.8, 2, 1);
            this.#snake_head_mesh.add(light);
        }

        // Nodes
        dimension = Config.snake_nodes_dimension;
        color = 0x415d43;
        geometry = new THREE.BoxGeometry(dimension,dimension,dimension);
        material = new THREE.MeshPhongMaterial({color: color, emissive: color, emissiveIntensity: 0.3});

        this.#snake_node_mesh = new THREE.Mesh(geometry, material);

        if (Config.graphic_level >= 2) {
            light = new THREE.PointLight(color, 0.8, 2, 1);
            this.#snake_node_mesh.add(light);
        }


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


    set_pack_one() {
        const textures = this.texture_pack.textures;
        let geometry, material, light, color, mesh, object, dimension;
        let texture, normal;
        /*------ Environment ------*/
        color = 0x7FFF00;
        geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
        texture = ModelLoader.get_instance().models[textures["core"].name];
        normal = ModelLoader.get_instance().models[textures["core_norm"].name];
        texture.format = THREE.RGBFormat;
        normal.format = THREE.RGBFormat;
        texture.anisotropy = Config.max_anisotropy;
        normal.anisotropy = Config.max_anisotropy;


        material = new THREE.MeshPhongMaterial( {color: color, map: texture, normalMap: normal} );

        this.#environment_core_mesh = new THREE.Mesh(geometry, material);
        this.#environment_core_mesh.material.needsUpdate = true;


        /*------- Snake ------*/
        // Head
        dimension = Config.snake_head_dimension;
        color = 0xE34234;
        geometry = new THREE.BoxGeometry(dimension,dimension,dimension);
        material = new THREE.MeshPhongMaterial({color: color});

        this.#snake_head_mesh = new THREE.Mesh(geometry, material)

        if (Config.graphic_level >= 1){
            light = new THREE.PointLight(color, 3.0, 2, 1);
            this.#snake_head_mesh.add(light);
        }

        // Nodes
        dimension = Config.snake_nodes_dimension;
        color = 0x913831;
        geometry = new THREE.BoxGeometry(dimension,dimension,dimension);
        material = new THREE.MeshPhongMaterial({color: color});

        this.#snake_node_mesh = new THREE.Mesh(geometry, material);

        if (Config.graphic_level >= 2) {
            light = new THREE.PointLight(color, 3.0, 2, 1);
            this.#snake_node_mesh.add(light);
        }



        /*------- Food ------*/
        mesh = this.#food_mesh;
        mesh.scale.set(0.02,.02,.02);
        mesh.position.y = -1;



        /*------- Obstacle ------*/
        color = 0x7f6a93;
        texture = this.#obstacle_part_mesh;
        texture.anisotropy = Config.max_anisotropy;
        geometry = new THREE.BoxGeometry(1, 1 ,1);
        material = new THREE.MeshBasicMaterial({map: texture});

        this.#obstacle_part_mesh = new THREE.Mesh(geometry, material);



        /*------- Lucky bonus ------*/
        color = 0xFFC500;
        mesh = this.#lucky_bonus_mesh;
        mesh.scale.set(.1,.1,.1);



        /*------- Score bonus ------*/
        color = 0xFFC500;
        mesh = this.#score_bonus_mesh;
        mesh.scale.set(.01,.01,.01);

        /*------- Fast bonus - Deprecated ------*/
        geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        material = new THREE.MeshBasicMaterial( { color: 0xFFFF92 } );

        this.#fast_bonus_mesh = new THREE.Mesh(geometry, material);


        /*------- Invisibility bonus - Deprecated ------*/
        geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        material = new THREE.MeshBasicMaterial( { color: 0xBAC2DC } );

        this.#invisibility_bonus_mesh = new THREE.Mesh(geometry, material);


        /*------- Invincibility bonus ------*/
        // color = 0xFFC500;
        mesh = this.#invincibility_bonus_mesh;
        mesh.scale.set(.002,.002,.002);

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

    manager;
    #resources_to_load;
    #gltf_loader;
    #obj_loader;
    #mtl_loader;
    #font_loader;
    #texture_loader;
    #texture_cube_loader;

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

        manager.onLoad = callback;

        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        manager.onError = function ( url ) {

            console.log( 'There was an error loading ' + url );

        };


        this.#gltf_loader = new GLTFLoader(manager);
        this.#obj_loader = new OBJLoader(manager);
        this.#mtl_loader = new MTLLoader(manager);
        this.#font_loader = new THREE.FontLoader(manager);
        this.#texture_loader = new THREE.TextureLoader(manager);
        this.#texture_cube_loader = new THREE.CubeTextureLoader(manager);
        this.#resources_to_load = [];
        this._total_resources = 0;

        this.manager = manager;
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

    load_mtl(resource, onload_callback, onprogress_callback, onerror_callback){

        let loader = this;

        // load model
        this.#mtl_loader.load( resource.path, private_mtl_onload_callback, onprogress_callback, onerror_callback );

        function private_mtl_onload_callback(materials){
            const objLoader = new OBJLoader(loader.manager);
            objLoader.setMaterials(materials);
            objLoader.load(resource.obj, private_obj_onload_callback, onprogress_callback, onerror_callback);


            function private_obj_onload_callback(obj){
                loader.models[resource.name] = obj;
                onload_callback();
            }
        }
    }

    load_texture(resource, onload_callback, onprogress_callback, onerror_callback){

        let loader = this;

        // load texture
        this.#texture_loader.load( resource.path, private_texture_onload_callback, onprogress_callback, onerror_callback );

        function private_texture_onload_callback(obj){
            loader.models[resource.name] = obj;
            onload_callback();
        }
    }

    load_texture_cube(resource, onload_callback, onprogress_callback, onerror_callback){

        let loader = this;
        let paths = [];
        for (let i = 0; i < 6; i++) {
            paths.push(resource.path);
        }
        // load texture
        this.#texture_cube_loader.load( paths, private_texture_onload_callback, onprogress_callback, onerror_callback );

        function private_texture_onload_callback(obj){
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
                case 'mtl':
                    this.load_mtl(resource, onload_callback, onprogress_callback, onerror_callback);
                    break;
                case 'obj':
                    this.load_obj(resource, onload_callback, onprogress_callback, onerror_callback);
                    break;
                case 'font':
                    this.load_font(resource, onload_callback, onprogress_callback, onerror_callback);
                    break;
                case 'texture':
                    this.load_texture(resource, onload_callback, onprogress_callback, onerror_callback);
                    break;
                case 'texture_cube':
                    this.load_texture_cube(resource, onload_callback, onprogress_callback, onerror_callback);
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

}


