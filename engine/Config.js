export class Config {
    static world_width = 10;
    static world_height = 10;
    static world_depth = 10;
    static world_face_depth = 1;

    static DIRECTIONS = {AXES: {X:0, Y:1, Z:2}, SIGN: {POSITIVE: 1, NEGATIVE: -1}}
    // view
    static cell_cube_dim = 1;


    /*----- Camera settings ------*/
    static fov = 60;
    static aspect = 2;
    static near = 0.1;
    static far = 2000;
    static camera_speed = 500;
    static camera_radius = 25;
    static camera_offset_up = 5;
    static camera_offset_right = 5;



}