//TODO REMOVE
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {GLTFLoader} from "../resources/three.js-r129/examples/jsm/loaders/GLTFLoader.js";

// ! don't touch
let resources_to_load_number = 0;
let resources_loaded = 0;


export class ModelLoader{

    constructor(){

        //  Manager
        const manager = new THREE.LoadingManager();
        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        manager.onLoad = function ( ) {

            console.log( 'Loading complete!');

        };

        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        manager.onError = function ( url ) {

            console.log( 'There was an error loading ' + url );

        };

        this.loader = new GLTFLoader( manager );

        this.resources_to_load = [];
        // this.resources_to_load_number = 0;
        // this.resources_loaded = 0;


    }

    add_resources_to_load(path){
        resources_to_load_number++;
        this.resources_to_load.push(path);
    }

    load_resources(){

        let promises = [];

        let res = this.resources_to_load.pop();
        while( res !== undefined){
            let res_path = res;
            let promise = new Promise(resolve => {

                this.loader.load(
                    res_path,
                    this.#resource_onload_callback,
                    this.#resource_onprogress_callback,
                    this.#resource_onerror_callback
                );

            });

            promises.push(promise);
            res = this.resources_to_load.pop();
        }

        return promises;

    }


    #resource_onload_callback(gltf){
        console.log("Resource loaded callback.");
        // resources_to_load_number--;
        // resources_loaded++;
        // console.log("Loaded", resources_loaded, "To load: ", resources_to_load_number);

    }

    #resource_onprogress_callback(xhr){
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }

    #resource_onerror_callback(error){
        console.log( 'An error happened' );

    }



}

let loader = new ModelLoader();

// loader.add_resources_to_load('/home/leonardo/WebstormProjects/final-project-ot/engine/models/apple/scene.gltf');
// loader.add_resources_to_load('/home/leonardo/WebstormProjects/final-project-ot/engine/models/stone/scene.gltf');

loader.add_resources_to_load('models/apple/scene.gltf');
// loader.add_resources_to_load('models/stone/scene.gltf');

let promises = loader.load_resources();


Promise.allSettled(promises).then(() => {
    console.log("Promise solved");
    alert("okkk");
});

