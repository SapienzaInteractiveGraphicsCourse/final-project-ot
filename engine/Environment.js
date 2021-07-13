import { View }  from "./View.js";
import { makeAxisGridDebug } from "./../content/utils.js";
import { ObstaclePart, Bonus, Player, Food, Entity, CubeCell, Obstacle} from "./Entity.js";

import * as THREE from '../resources/three.js-r129/build/three.module.js';




// Environment structure

export class Environment extends View{

    constructor(width, height, depth, face_depth){
        super();

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.face_depth = face_depth;

        var env = [];

        for(var i = 0; i < width; i++){
            var plane = [];
            for(var j = 0; j < height; j++){
                var row = [];
                for(var k = 0; k < depth; k++){
                    let cell = new CubeCell(i, j, k, true, false, false, null);
                    row.push(cell);
                }
                plane.push(row);
            }   
            env.push(plane);
        }

        this.environment = env;

        this.draw();


    }

    draw(){

        var cube_w = this.width;
        var cube_h = this.height;
        var cube_d = this.depth;
        var cube_face_depth = this.face_depth;

        // Cube Material
        const cube_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        cube_material.transparent = true;
        cube_material.opacity = 0.1;
        cube_material.wireframe = true;
        
        // Cube Geometry 
        const cube_geometry = new THREE.BoxGeometry(cube_w, cube_h, cube_d, cube_w, cube_h, cube_d);
        
        // Cube Mesh
        const cube_mesh = new THREE.Mesh( cube_geometry, cube_material );
        

        var core_w = cube_w - ( 2 * cube_face_depth);
        var core_h = cube_h - ( 2 * cube_face_depth);
        var core_d = cube_d - ( 2 * cube_face_depth);
        if(core_w > 0 && core_h > 0 && core_d > 0){

            // Core Material
            const core_material = new THREE.MeshBasicMaterial( {color: 0x99CCFF} );
            // Core Geometry    
            const core_geometry = new THREE.BoxGeometry(core_w, core_h, core_d, core_w, core_h, core_d);
            // Core Mesh
            const core_mesh = new THREE.Mesh( core_geometry, core_material );

            cube_mesh.add(core_mesh);
        
        }

        makeAxisGridDebug(cube_mesh, 'Environment');

        this.mesh = cube_mesh;




    }


}


