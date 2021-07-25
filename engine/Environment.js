import { View }  from "./View.js";
import { ObstaclePart, Food, Entity, CubeCell, Obstacle} from "./Entity.js";

import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {Config} from "./Config.js";
import {Utilities} from "./Utilities.js";
import {EntityMeshManager, ModelLoader} from "./ModelLoader.js";
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";




// Environment structure

export class Environment extends View{


    constructor(width, height, depth, face_depth){
        super();

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.face_depth = face_depth;

        const env = [];

        for(let i = 0; i < width; i++){
            const plane = [];
            for(let j = 0; j < height; j++){
                const row = [];
                for(let k = 0; k < depth; k++){
                    let cell = new CubeCell(i, j, k, true, false, false, null);
                    row.push(cell);
                }
                plane.push(row);
            }   
            env.push(plane);
        }

        this.environment = env;

        this.mesh = null;

        this.draw();


    }

    draw(){


        const cube_w = this.width * Config.cell_cube_dim;
        const cube_h = this.height * Config.cell_cube_dim;
        const cube_d = this.depth * Config.cell_cube_dim;
        const cube_face_depth = this.face_depth * Config.cell_cube_dim;

        // Cube Material
        const cube_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        cube_material.visible = false;
        cube_material.transparent = true;
        cube_material.opacity = 0.0;
        cube_material.wireframe = true;

        // Cube Geometry
        const cube_geometry = new THREE.BoxGeometry(cube_w, cube_h, cube_d, cube_w, cube_h, cube_d);

        // Cube Mesh
        const cube_mesh = new THREE.Mesh( cube_geometry, cube_material );

        const core_w = cube_w - (2 * cube_face_depth);
        const core_h = cube_h - (2 * cube_face_depth);
        const core_d = cube_d - (2 * cube_face_depth);
        if(core_w > 0 && core_h > 0 && core_d > 0){


            const core_mesh = EntityMeshManager.get_instance().get_environment_core_mesh();
            core_mesh.scale.set(core_w, core_h, core_d);
            cube_mesh.add(core_mesh);

        }

        if(Config.grid_helpler) Utilities.addAxisGridDebug(cube_mesh, 'Environment');

        cube_mesh.scale.set(
            1 / (Config.cell_cube_dim * 10),
            1 / (Config.cell_cube_dim * 10),
            1 / (Config.cell_cube_dim * 10)
        );

        this.mesh = cube_mesh;

    }

    animate(){
        let scale = this.mesh.scale;
        let target_scale = {x: scale.x * (Config.cell_cube_dim * 10), y: scale.y * (Config.cell_cube_dim * 10), z: scale.z * (Config.cell_cube_dim * 10)}
        const tween_scale = new TWEEN.Tween(scale).to(target_scale, 1000);

        let rotation = this.mesh.rotation;
        let target_rotation = {x: Utilities.degrees_to_radians(360), y: Utilities.degrees_to_radians(360), z: Utilities.degrees_to_radians(360)}
        const tween_rotate = new TWEEN.Tween(rotation).to(target_rotation, 1000);


        tween_rotate.start();
        tween_scale.start();

    }

    get_cube_cell(position) {
        const x = position[0];
        const y = position[1];
        const z = position[2];

        return this.environment[x][y][z];
    }

    get_cube_cell_content(position) {
        return this.get_cube_cell(position).content;
    }


}


