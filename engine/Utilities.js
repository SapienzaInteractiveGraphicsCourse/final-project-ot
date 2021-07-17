import {Config} from "./Config.js";
import {vec3} from "../Common/MVnew.js";

export class Utilities {
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


}