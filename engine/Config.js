export class Config {

    static DIRECTIONS = {AXES: {X:0, Y:1, Z:2}, SIGN: {POSITIVE: 1, NEGATIVE: -1}}
    static x_positive_axis = 'X';
    static y_positive_axis = 'Y';
    static z_positive_axis = 'Z';

    static x_negative_axis = '-X';
    static y_negative_axis = '-Y';
    static z_negative_axis = '-Z';

    /*----- Game settings------*/
    static game_level = 30;


    // debugging mode
    static log = false;
    static grid_helpler = false;


    // view
    static cell_cube_dim = 1;
    static graphic_level = 3;


    /*----- Enviroment settings ------*/



    // environment settings
    static world_width = 10;
    static world_height = 10;
    static world_depth = 10;
    static world_face_depth = 1;

    // Objects
    static objects_speed = 2000;


    /*------ Snake settings ------*/
    static snake_speed = 300;
    static snake_nodes_distance = Config.cell_cube_dim;
    static snake_head_dimension = 0.8 * Config.snake_nodes_distance;
    static snake_nodes_dimension = 0.6 * Config.snake_nodes_distance;



    /*------ Texture packs ------*/
    static TEXTURE_PACKS = [
        {
            id: 0,
            name: "Standard",
            textures: {
                background: {name: 'background_texture', type: 'texture', path: 'models/bg.jpg'},
                invincibility: {name: 'bonus_invincibility_model', type: 'obj', path: 'models/star/star.obj'},
                lucky: {name: 'bonus_lucky_model', type: 'obj', path: 'models/lucky_leaf/lucky_leaf.obj'},
                score: {name: 'bonus_score_model', type: 'font', path: '../resources/three.js-r129/examples/fonts/helvetiker_regular.typeface.json'},
            },
        },
        {
            id: 1,
            name: "Pack 1",
            textures: {
                core: {name: 'core_texture_1', type: 'texture', path: 'models/mario/grass/Grass_001_COLOR.jpg'},
                snake_head: {name: 'snake_head_1', type: 'texture', path: 'models/mario/yoshi_tex.png'},
                core_norm: {name: 'core_texture_norm_1', type: 'texture', path: 'models/mario/grass/Grass_001_NORM.jpg'},
                food: {name: 'food_model_1', type: 'mtl', path: 'models/mario/power_up.mtl', obj: 'models/mario/power_up.obj'},
                obstacle: {name: 'obstacle_texture_1', type: 'texture', path: 'models/mario/wall_tex.png'},
                invincibility: {name: 'bonus_invincibility_model_1', type: 'mtl', path: 'models/mario/star.mtl', obj: 'models/mario/star.obj'},
                lucky: {name: 'bonus_lucky_model_1', type: 'mtl', path: 'models/mario/flower.mtl', obj: 'models/mario/flower.obj'},
                score: {name: 'bonus_score_model_1', type: 'mtl', path: 'models/mario/coin.mtl', obj: 'models/mario/coin.obj'},
            },
        },
    ];
    static current_texture_pack = Config.TEXTURE_PACKS[0];



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
    static camera_light_intensity = Config.current_texture_pack.id === 0 ? 0.8 : 2.5;
    static camera_light_position = {x: 3.0, y: 3.0, z: 0.0};

    /*------ Resource settings ------*/

    // score config
    static initial_score = 0;
    static multiplicator = 1;
    static food_score = 5;
    static bonus_score = 0.5;
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



    /*----- Game settings------*/
    // static game_level = 30;

    static username = "Guest";
    static current_level = 0;


    // game mode
    // static GAME_MODES = [
    //     {
    //         id : 0,
    //         name: "Custom",
    //         label: "custom"
    //     },
    //     {
    //         id : 1,
    //         name: "Regular",
    //         label: "regular"
    //     }
    // ];


    // match configuration
    static GAME_MODES = [
        {
            id: 0,
            name: 'Custom',
            levels: false,
            total_levels: 1,
            configuration: {
                levels: [
                    {
                        level: 1,
                        name: "Level 1",
                        configuration: {

                            // env
                            world_width: 7,
                            world_height: 7,
                            world_depth: 7,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 5,
                            texture_pack_id: 0
                        }
                    }
                ]
            }
        },
        {
            id: 1,
            name: "Regular",
            levels: true,
            total_levels: 3,
            configuration: {
                levels: [
                    {
                        level: 1,
                        name: "Level 1",
                        configuration: {

                            // env
                            world_width: 10,
                            world_height: 10,
                            world_depth: 10,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 2,
                            texture_pack_id: 0
                        }
                    },
                    {
                        level: 2,
                        name: "Level 2",
                        configuration: {

                            // env
                            world_width: 8,
                            world_height: 8,
                            world_depth: 8,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 3,
                            texture_pack_id: 0
                        }

                    },
                    {
                        level: 3,
                        name: "Level 3",
                        configuration: {

                            // env
                            world_width: 5,
                            world_height: 5,
                            world_depth: 5,
                            world_face_depth: 1,

                            // level
                            game_level: 10,

                            // entity
                            spawn_obs: true,
                            spawn_bonus: true,

                            movable_obs: true,
                            movable_food: true,
                            movable_bonus: true,

                            erasable_obs: true,
                            erasable_food: true,
                            erasable_bonus: true,

                            target_score: 2,
                            texture_pack_id: 0
                        }

                    },
                ]
            }
        }
    ];


    // static current_game_mode = Config.GAME_MODES[0]; // custom
    static current_match_configuration = Config.GAME_MODES[0]; // custom match config



}

