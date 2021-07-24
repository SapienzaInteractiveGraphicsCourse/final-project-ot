import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {GUI} from "../resources/three.js-r129/examples/jsm/libs/dat.gui.module.js";
import {Config} from "./Config.js";
import {vec3} from "../Common/MVnew.js";

export class Utilities {
    static gui = new GUI({name: "Debug", width: 400});

    // given x, y and z coordinate return an axis of rotation
    static axis_from_world_coord(x, y, z){
        let axis;
        if(x === 0){
            axis = Utilities.vector_to_direction([1,0,0]);
        } else if (x === Config.world_width - 1){
            axis = Utilities.vector_to_direction([-1,0,0]);
        } else if (y === 0){
            axis = Utilities.vector_to_direction([0,1,0]);
        } else if (y === Config.world_height - 1){
            axis = Utilities.vector_to_direction([0,-1,0]);
        } else if (z === 0){
            axis = Utilities.vector_to_direction([0,0,1]);
        } else if (z === Config.world_depth - 1){
            axis = Utilities.vector_to_direction([0,0,-1]);
        }
        return axis;
    }

    static world_to_render(coordinates_or_x,y,z){
        let x = coordinates_or_x;
        if (arguments.length === 1) {
            z = coordinates_or_x[2];
            y = coordinates_or_x[1];
            x = coordinates_or_x[0];
        }
        var w = Config.world_width;
        var h = Config.world_height;
        var d = Config.world_depth;
        return [x - w/2 + 0.5, y - h/2 + 0.5, z - d/2 + 0.5];
    }

    static render_to_world(coordinates_or_x,y,z) {
        let x = coordinates_or_x;
        if (arguments.length === 1) {
            z = coordinates_or_x[2];
            y = coordinates_or_x[1];
            x = coordinates_or_x[0];
        }
        var w = Config.world_width;
        var h = Config.world_height;
        var d = Config.world_depth;

        return [Math.round(x + w/2 - 0.5),Math.round( y + h/2 - 0.5), Math.round( z + d/2 - 0.5)];
    }

    static direction_to_vector(direction){
        const out = vec3();
        out[direction.axis] = direction.sign;
        return out;
    }

    static vector_to_direction(vector) {
        for (let i = 0; i < 3; i++) {
            vector[i] = Math.round(vector[i])
            if (vector[i] === 0) continue;
            return {
                axis: i,
                sign: vector[i]
            }
        }
    }

    static addAxisGridDebug(node, label, size = 1, units = 10) {
        const handler = new AxisGridHandler(node,size,units);
        Utilities.gui.add(handler, 'axisVisible').name(label + ' Axis');
        Utilities.gui.add(handler, 'gridVisible').name(label + ' Grid');

    }

    // todo implements removeAxisGridDebug !
    static removeAxisGridDebug(node, label, size = 1, units = 10) {

    }

    /*---- Resize canvas to screen size ------*/
    static resizeCanvas(renderer, camera) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }




    static degrees_to_radians(degrees)
    {
        return degrees * (Math.PI/180);
    }

    static radians_to_degrees(radians)
    {
        return radians * (180/Math.PI);
    }

    static array_equal(arr1, arr2) {
        let equal = true;
        arr1.forEach((value, index) => {
            if (value !== arr2[index]) {
                equal = false;
                return equal;
            }
        });
        return equal;
    }

}


/*------ GUI for debugging ------*/
class AxisGridHandler {
    #axis
    #grid

    constructor(node, size = 1, units = 10) {
        this.#axis = new THREE.AxesHelper(size);
        this.#axis.material.depthTest = false;
        this.#axis.renderOrder = 2;
        this.#axis.visible = false;
        node.add(this.#axis);

        this.#grid = new THREE.GridHelper(units, units);
        this.#grid.material.depthTest = false;
        this.#grid.renderOrder = 1;
        this.#grid.visible = false;
        node.add(this.#grid);

    }

    // Getters
    get axisVisible() {
        return this.#axis.visible;
    }
    get gridVisible() {
        return this.#grid.visible;
    }

    // Setters
    set axisVisible(value) {
        this.#axis.visible = value;
    }
    set gridVisible(value) {
        this.#grid.visible = value;
    }
}
