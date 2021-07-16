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


}