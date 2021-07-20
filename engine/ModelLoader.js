//TODO REMOVE
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {GLTFLoader} from "../resources/three.js-r129/examples/jsm/loaders/GLTFLoader.js";

export class ModelLoader{

    get total_resources() {
        return this._total_resources;
    }

    #resources_to_load;
    #loader;

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


        this.#loader = new GLTFLoader( manager );
        this.#resources_to_load = [];
        this._total_resources = 0;


    }

    add_resources_to_load(path){
        this.#resources_to_load.push(path);
        this._total_resources++;
    }

    load_resources(onload_callback, onprogress_callback, onerror_callback){

        // get first model path to load
        let res = this.#resources_to_load.pop();
        while( res !== undefined){
            let res_path = res;
            // load model
            this.#loader.load(
                res_path, onload_callback, onprogress_callback, onerror_callback
                // this.#resource_onload_callback,
                // this.#resource_onprogress_callback,
                // this.#resource_onerror_callback
            );

            // get next model path to load
            res = this.#resources_to_load.pop();
        }


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


