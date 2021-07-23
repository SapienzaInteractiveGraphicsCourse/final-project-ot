export class Config {

    static DIRECTIONS = {AXES: {X:0, Y:1, Z:2}, SIGN: {POSITIVE: 1, NEGATIVE: -1}}
    static x_axis = 'X';
    static y_axis = 'Y';
    static z_axis = 'Z';

    /*----- Game settings------*/
    static game_level = 30;

    static username = "Guest";

    // debugging mode
    static log = false;
    static grid_helpler = false;


    // view
    static cell_cube_dim = 1;



    /*----- Camera settings ------*/
    // Camera
    static fov = 50;
    static aspect = 2;
    static near = 0.1;
    static far = 2000;
    static camera_speed = 500;
    static camera_radius = 15;
    static camera_offset_up = 6;
    static camera_offset_right = 6;

    // Camera Light
    static camera_light_color = 0xffffff;
    static camera_light_intensity = .8;
    static camera_light_position = {x: 3.0, y: 3.0, z: 0.0};



    /*----- Enviroment settings ------*/



    // environment settings
    static world_width = 10;
    static world_height = 10;
    static world_depth = 10;
    static world_face_depth = 1;


    /*------ Snake settings ------*/
    static snake_speed = 400;
    static snake_nodes_distance = Config.cell_cube_dim;
    static snake_head_dimension = 0.8 * Config.snake_nodes_distance;
    static snake_nodes_dimension = 0.6 * Config.snake_nodes_distance;


    /*------ Texture packs ------*/
    static TEXTURE_PACKS = [
        {
            id: 0,
            name: "Standard",
            textures: {
                invisibility: {name: 'bonus_invisibility_model', type: 'gltf', path: 'models/spooky_ghost/scene.gltf'},
                invincibility: {name: 'bonus_invincibility_model', type: 'obj', path: 'models/star/star.obj'},
                lucky: {name: 'bonus_lucky_model', type: 'obj', path: 'models/lucky_leaf/lucky_leaf.obj'},
                score: {name: 'bonus_score_model', type: 'font', path: '../resources/three.js-r129/examples/fonts/helvetiker_regular.typeface.json'},
            },
        },
        {
            id: 1,
            name: "Pack 1",
            textures: {
                //food: {name: 'food_model', type: 'gltf', path: 'models/apple/scene.gltf'},
                //invisibility: {name: 'bonus_invisibility_model', type: 'gltf', path: 'models/spooky_ghost/scene.gltf'},
                //invincibility: {name: 'bonus_invincibility_model', type: 'gltf', path: 'models/cartoon_bomb/scene.gltf'},
                //score: {name: 'bonus_score_model', type: 'gltf', path: '../resources/three.js-r129/examples/fonts/helvetiker_regular.typeface.json'},
            },
        },
    ];
    static current_texture_pack = Config.TEXTURE_PACKS[0];

    /*------ Resource settings ------*/
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

    // score config
    static initial_score = 0;
    static multiplicator = 1;
    static food_score = 1;
    static bonus_score = 0;
    static obstacle_score = 0;
    static snakenode_score = 0;


    // Light
    static ambient_light_color = 0xffffff;
    static ambient_light_intensity = 0.3;

    static game_mode = "custom";
    static spawn_obs = true;
    static spawn_bonus = true;

    static movable_obs = true;
    static movable_food = true;
    static movable_bonus = true;

    static erasable_obs = true;
    static erasable_food = true;
    static erasable_bonus = true;

    // Material
    static world_color = 0x99CCFF;
    static world_opacity = 0.7;




}

