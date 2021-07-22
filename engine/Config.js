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
    static camera_radius = 20;
    static camera_offset_up = 5;
    static camera_offset_right = 5;


    //    game setting

    static game_level = 30;

    /*------ Snake settings ------*/
    static snake_speed = 200;
    static snake_nodes_distance = 1; //TODO parametric
    static static_nodes_dimension = 0.8; // (0,1] * snake_nodes_distance

    // resource name
    static food_gltf_model_name = 'food_model';
    static food_gltf_model_path = 'models/apple/scene.gltf' ;

    static obstacle_part_gltf_model_name;
    static obstacle_part_gltf_model_path;

    static invisibility_bonus_gltf_model_name = 'bonus_invisibility_model';
    static invisibility_bonus_gltf_model_path = 'models/spooky_ghost/scene.gltf';

    static invincibility_bonus_gltf_model_name = 'bonus_invincibility_model';
    static invincibility_bonus_gltf_model_path = 'models/cartoon_bomb/scene.gltf';

    static fast_bonus_gltf_model_name;
    static fast_bonus_gltf_model_path;

    static score_bonus_gltf_model_name = 'bonus_score_model';
    static score_bonus_gltf_model_path = '../resources/three.js-r129/examples/fonts/helvetiker_regular.typeface.json';

    static lucky_bonus_gltf_model_name;
    static lucky_bonus_gltf_model_path;


    static x_axis = 'X';
    static y_axis = 'Y';
    static z_axis = 'Z';



}