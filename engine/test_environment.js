// import { Group } from "../resources/three.js-r129/build/three.module.js";
import { Scene, SkeletonHelper } from "../resources/three.js-r129/build/three.module.js";
import * as Entity from "./Entity.js";
import { ModelLoader } from "./ModelLoader.js";
import { degrees_to_radians } from "./Utility.js";
import { View }  from "./View.js";


import {Environment} from "./Environment.js";
import {RandomEnvironmentGenerator} from "./Environment.js";




function start_engine(){



    var env_dim = 10;
    var game_level = 3;

    let environment = new Environment(env_dim);

    let game = new RandomEnvironmentGenerator(game_level, environment);
    game.generate();

    console.log(environment);
    
    var mesh =  game.view();

    const group = new THREE.Group();
    mesh.forEach(element => { group.add(element) });


    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

    const controls = new THREE.OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 50, 150 );
    controls.update();

    
    const light = new THREE.AmbientLight( 0x404040, 5.0); // soft white light
    scene.add( light );


    scene.add(group);


    camera.position.z = 10;

    const animate = function () {

        requestAnimationFrame( animate );

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        renderer.render( scene, camera );
    };

    animate();
        


}

start_engine();
