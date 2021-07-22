import { View }  from "./View.js";
import { ObstaclePart, Food, Entity, CubeCell, Obstacle} from "./Entity.js";

import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {Config} from "./Config.js";
import {Utilities} from "./Utilities.js";




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


        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        let v1, v2, v3, v4, v5, v6, v7, v8;
        let v;

        // for(let l = 0; l < this.face_depth; l++){
        //
        //     v1 = new THREE.Vector3((this.width - 2 * l) / 2, (this.height - 2*l ) /2,(this.depth - 2 * l ) / 2);
        //     v2 = new THREE.Vector3((this.width - 2 * l) / 2, (this.height - 2*l ) /2,-(this.depth - 2 * l ) / 2);
        //     v3 = new THREE.Vector3((this.width - 2 * l) / 2, - (this.height - 2*l ) /2,(this.depth - 2 * l ) / 2);
        //     v4 = new THREE.Vector3((this.width - 2 * l) / 2, - (this.height - 2*l ) /2,-(this.depth - 2 * l ) / 2);
        //
        //     v5 = new THREE.Vector3(- (this.width - 2 * l) / 2, (this.height - 2*l ) /2,(this.depth - 2 * l ) / 2);
        //     v6 = new THREE.Vector3(- (this.width - 2 * l) / 2, (this.height - 2*l ) /2,-(this.depth - 2 * l ) / 2);
        //     v7 = new THREE.Vector3(- (this.width - 2 * l) / 2, - (this.height - 2*l ) /2,(this.depth - 2 * l ) / 2);
        //     v8 = new THREE.Vector3(- (this.width - 2 * l) / 2, - (this.height - 2*l ) /2,-(this.depth - 2 * l ) / 2);
        //
        //     // right face
        //     vertices.push( v1.x, v1.y, v1.z );
        //     vertices.push( v2.x, v2.y, v2.z );
        //     vertices.push( v2.x, v2.y, v2.z );
        //     vertices.push( v4.x, v4.y, v4.z );
        //     vertices.push( v4.x, v4.y, v4.z );
        //     vertices.push( v3.x, v3.y, v3.z );
        //     vertices.push( v3.x, v3.y, v3.z );
        //     vertices.push( v1.x, v1.y, v1.z );
        //
        //     // front face
        //     vertices.push( v5.x, v5.y, v5.z );
        //     vertices.push( v1.x, v1.y, v1.z );
        //     vertices.push( v1.x, v1.y, v1.z );
        //     vertices.push( v3.x, v3.y, v3.z );
        //     vertices.push( v3.x, v3.y, v3.z );
        //     vertices.push( v7.x, v7.y, v7.z );
        //     vertices.push( v7.x, v7.y, v7.z );
        //     vertices.push( v5.x, v5.y, v5.z );
        //
        //     // left face
        //     vertices.push( v6.x, v6.y, v6.z );
        //     vertices.push( v5.x, v5.y, v5.z );
        //     vertices.push( v5.x, v5.y, v5.z );
        //     vertices.push( v7.x, v7.y, v7.z );
        //     vertices.push( v7.x, v7.y, v7.z );
        //     vertices.push( v8.x, v8.y, v8.z );
        //     vertices.push( v8.x, v8.y, v8.z );
        //     vertices.push( v6.x, v6.y, v6.z );
        //
        //     // back face
        //     vertices.push( v2.x, v2.y, v2.z );
        //     vertices.push( v6.x, v6.y, v6.z );
        //     vertices.push( v6.x, v6.y, v6.z );
        //     vertices.push( v8.x, v8.y, v8.z );
        //     vertices.push( v8.x, v8.y, v8.z );
        //     vertices.push( v4.x, v4.y, v4.z );
        //     vertices.push( v4.x, v4.y, v4.z );
        //     vertices.push( v2.x, v2.y, v2.z );
        //
        // }

        // for(let i = 0; i < this.width; i++) {
        //     for (let j = 0; j < this.height; j++) {
        //         for (let k = 0; k < this.depth; k++) {
        //             let ren_c = Utilities.world_to_render(i, j, k);
        //             console.log(ren_c);
        //
        //             v = new THREE.Vector3(ren_c[0], ren_c[1], ren_c[2]);
        //             vertices.push( v.x, v.y, v.z );
        //             break;
        //
        //         }
        //     }
        // }
        //
        // geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        //
        // const material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1.0 } );
        // const line = new THREE.LineSegments( geometry, material );



        //

        // this.mesh = line;
        // const core_w = this.width - (2 * this.face_depth);
        // const core_h = this.height - (2 * this.face_depth);
        // const core_d = this.depth - (2 * this.face_depth);
        // if(core_w > 0 && core_h > 0 && core_d > 0){
        //
        //     // Core Material
        //     // const core_material = new THREE.MeshBasicMaterial( {color: 0x99CCFF, opacity: 0.1} );
        //     const core_material = new THREE.MeshStandardMaterial( {color: 0x99CCFF, transparent: true, opacity: 0.7} );
        //
        //     // Core Geometry
        //     const core_geometry = new THREE.BoxGeometry(core_w, core_h, core_d, core_w, core_h, core_d);
        //     // Core Mesh
        //     const core_mesh = new THREE.Mesh( core_geometry, core_material );
        //
        //     line.add(core_mesh);
        //
        // }
        //
        // return;


        const cube_w = this.width * Config.cell_cube_dim;
        const cube_h = this.height * Config.cell_cube_dim;
        const cube_d = this.depth * Config.cell_cube_dim;
        const cube_face_depth = this.face_depth * Config.cell_cube_dim;

        // Cube Material
        const cube_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        cube_material.transparent = true;
        cube_material.opacity = 0.1;
        cube_material.wireframe = true;

        // Cube Geometry
        const cube_geometry = new THREE.BoxGeometry(cube_w, cube_h, cube_d, cube_w, cube_h, cube_d);

        // Cube Mesh
        const cube_mesh = new THREE.Mesh( cube_geometry, cube_material );

        const core_w = cube_w - (2 * cube_face_depth);
        const core_h = cube_h - (2 * cube_face_depth);
        const core_d = cube_d - (2 * cube_face_depth);
        if(core_w > 0 && core_h > 0 && core_d > 0){

            // Core Material
            // const core_material = new THREE.MeshBasicMaterial( {color: 0x99CCFF, opacity: 0.1} );
            const core_material = new THREE.MeshStandardMaterial( {color: 0x99CCFF, transparent: true, opacity: 0.7} );


            // Core Geometry
            const core_geometry = new THREE.BoxGeometry(core_w, core_h, core_d, core_w, core_h, core_d);
            // Core Mesh
            const core_mesh = new THREE.Mesh( core_geometry, core_material );

            cube_mesh.add(core_mesh);

        }

        if(Config.grid_helpler) Utilities.addAxisGridDebug(cube_mesh, 'Environment');

        this.mesh = cube_mesh;

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


