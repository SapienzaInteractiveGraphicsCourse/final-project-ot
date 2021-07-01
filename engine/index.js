"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var cameraViewMatrix;
var instanceMatrix;

var modelViewMatrixLoc, projectionMatrixLoc, cameraViewMatrixLoc;

// var lightPosition = vec4(0.0, 0.0, 200.0, 1.0);
var lightPosition = vec4(0.0, 0.0, -10.0, 1.0);

var lightColor = vec4(.7, .7, .7, 1.0);
// var lightColor = vec4(1.0, 1.0, 1.0, 1.0);

var lightPositionLoc;
var lightColorLoc;

var materialColorLoc;
var materialColor;

var textureModeLoc;

// camera
var x_cam_rot = -90;
var y_cam_rot = 0;
var z_cam_rot = 0;

var x_cam_pos = 0.0;
var y_cam_pos = 0.0;
var z_cam_pos = 0.0;

var aspect = 1.0;
var near = 1;
var far = 1000;
var fov = 100;


var eye = vec3(0.0, 10.0, 30.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);



var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


// sheep ids = 11
var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var tailId = 11;
var leftUpperFrontLegId = 2;
var leftLowerFrontLegId = 3;
var rightUpperFrontLegId = 4;
var rightLowerFrontLegId = 5;

var leftUpperBackLegId = 6;
var leftLowerBackLegId = 7;
var rightUpperBackLegId = 8;
var rightLowerBackLegId = 9;

// fence id = 7
var leftPoleId = 12;
var centerPoleId = 13;
var rightPoleId = 14;
var upperLeftTravPoleId = 15;
var lowerLeftTravPoleId = 16;
var upperRightTravPoleId = 17;
var lowerRightTravPoleId = 18;

// grass id = 1
var grassId = 19;


// sheep configuration
var headHeight = 2.5;
var headWidth = 2.5;

var tailHeight = 0.75;
var tailWidth = 0.75;

var torsoHeight = 7.0;
var torsoWidth = 4.5;

var upperLegHeight = 2.5;
var upperLegWidth = 1.4;
var lowerLegHeight = 2.5;
var lowerLegWidth = 0.9;

// fence configuration
var poleHeight = 7;
var poleWidth = 0.75;

var travHeight = 3;
var travWidth = 0.45;

// grass configuration
var grassHeight = 0.1;
// var grassWidth = 150.0;
var grassWidth = 100.0;


// sheep animation
var x_sheep_pos = 0.0;
var y_sheep_pos = -2.0;
var z_sheep_pos = 0.0;

var tic = 0;
var direction = 1;
var animation = false;



var numSheepNodes = 12;
var numFenceNodes = 7;
var numGrassNodes = 1;
var numNodes = numSheepNodes + numFenceNodes + numGrassNodes;

var numAngles = 12;
var angle = 0;

var theta = [0, 0, -90, 0, -90, 0, -90, 0, -90, 0, -90, 0];
var omega = [0];
var sigma = [0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var pointsArray = [];
var normalsArray = [];
var tangentsArray = [];
var texCoordsArray = [];

function configureTexture(image, id, bump_mapping) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + id);                    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if(bump_mapping) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.width, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

}


//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

        // sheep init
        case torsoId:
            m = translate(x_sheep_pos, y_sheep_pos, z_sheep_pos);
            m = mult(m,rotate(sigma[torsoId], vec3(1, 0, 0)));
            m = mult(m,rotate(theta[torsoId], vec3(0, 1, 0)));
            m = mult(m,rotate(omega[torsoId], vec3(0, 0, 1)));
            figure[torsoId] = createNode( m, torso, null, leftUpperFrontLegId);
            break;

        case headId:
        case head1Id:
        case head2Id:
            m = translate(0.0, torsoHeight+0.25*headHeight, 0.0);
            m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)))
            m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
            m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
            figure[headId] = createNode( m, head, tailId, null);
            break;

        case tailId:
            m = translate(0.0, torsoHeight+tailHeight, 0.0);
            m = mult(m, rotate(theta[tailId], vec3(0, 1, 0)));
            m = mult(m, translate(0.0, -0.5*tailHeight, 0.0));    
            figure[tailId] = createNode( m, tail, null, null );
            break;
        
        case leftUpperFrontLegId:
            m = translate(-torsoWidth/3, 0.8*torsoHeight, torsoWidth/2 - upperLegWidth);
            m = mult(m, rotate(theta[leftUpperFrontLegId], vec3(1, 0, 0)));
            figure[leftUpperFrontLegId] = createNode( m, leftUpperArm, rightUpperFrontLegId, leftLowerFrontLegId );
            break;
        case rightUpperFrontLegId:
            m = translate(torsoWidth/3, 0.8*torsoHeight, torsoWidth/2 - upperLegWidth);
            m = mult(m, rotate(theta[rightUpperFrontLegId], vec3(1, 0, 0)));
            figure[rightUpperFrontLegId] = createNode( m, rightUpperArm, leftUpperBackLegId, rightLowerFrontLegId );
            break;

        case leftUpperBackLegId:
            m = translate(-torsoWidth/3, 0.5*upperLegHeight, torsoWidth/2 - upperLegWidth);
            m = mult(m , rotate(theta[leftUpperBackLegId], vec3(1, 0, 0)));
            figure[leftUpperBackLegId] = createNode( m, leftUpperLeg, rightUpperBackLegId, leftLowerBackLegId );
            break;

        case rightUpperBackLegId:
            m = translate(torsoWidth/3, 0.5*upperLegHeight, torsoWidth/2 - upperLegWidth);
            m = mult(m, rotate(theta[rightUpperBackLegId], vec3(1, 0, 0)));
            figure[rightUpperBackLegId] = createNode( m, rightUpperLeg, headId, rightLowerBackLegId );
            break;

        case leftLowerFrontLegId:
            m = translate(0.0, lowerLegHeight, 0.0);
            m = mult(m, rotate(theta[leftLowerFrontLegId], vec3(1, 0, 0)));
            figure[leftLowerFrontLegId] = createNode( m, leftLowerArm, null, null );
            break;

        case rightLowerFrontLegId:
            m = translate(0.0, lowerLegHeight, 0.0);
            m = mult(m, rotate(theta[rightLowerFrontLegId], vec3(1, 0, 0)));
            figure[rightLowerFrontLegId] = createNode( m, rightLowerArm, null, null );
            break;

        case leftLowerBackLegId:
            m = translate(0.0, lowerLegHeight, 0.0);
            m = mult(m, rotate(theta[leftLowerBackLegId],vec3(1, 0, 0)));
            figure[leftLowerBackLegId] = createNode( m, leftLowerLeg, null, null );
            break;

        case rightLowerBackLegId:
            m = translate(0.0, lowerLegHeight, 0.0);
            m = mult(m, rotate(theta[rightLowerBackLegId], vec3(1, 0, 0)));
            figure[rightLowerBackLegId] = createNode( m, rightLowerLeg, null, null );
            break;


        // fence init
        case leftPoleId:
            m = translate(-travHeight, 5*travHeight, torsoWidth/2);
            m = mult(m, rotate(90, vec3(1, 0, 0)))
            
            figure[leftPoleId] = createNode( m, leftPole, centerPoleId, upperLeftTravPoleId);
            break;

        case centerPoleId:
    
            m = translate(0.0, 5*travHeight, torsoWidth/2);
            m = mult(m, rotate(90, vec3(1, 0, 0)))
            figure[centerPoleId] = createNode( m, centerPole, rightPoleId, upperRightTravPoleId);
            break;

        case rightPoleId:

            m = translate(travHeight, 5*travHeight, torsoWidth/2);
            m = mult(m, rotate(90, vec3(1, 0, 0)))
            figure[rightPoleId] = createNode( m, rightPole, null, null );
            break;

        case upperLeftTravPoleId:

            m = translate(poleWidth + poleWidth/2, poleHeight/4, 0.0);
            m = mult(m, rotate(90, vec3(1, 0, 0)));
            m = mult(m, rotate(90, vec3(0, 0, 1)));
            figure[upperLeftTravPoleId] = createNode( m, upperLeftTravPole, null, lowerLeftTravPoleId );
            break;

        case upperRightTravPoleId:

            m = translate(poleWidth + poleWidth/2, poleHeight/4, 0.0);
            m = mult(m, rotate(90, vec3(1, 0, 0)));
            m = mult(m, rotate(90, vec3(0, 0, 1)));
            figure[upperRightTravPoleId] = createNode( m, upperRightTravPole, null, lowerRightTravPoleId );
            break;
        
        case lowerLeftTravPoleId:

            m = translate(0.0, 0.0, -poleHeight/2);
            figure[lowerLeftTravPoleId] = createNode( m, lowerLeftTravPole, null, null );
            break;

        case lowerRightTravPoleId:

            m = translate(0.0, 0.0, -poleHeight/2);
            figure[lowerRightTravPoleId] = createNode( m, lowerRightTravPole, null, null );
            break;

        // grass init

        case grassId:
            m = translate(0.0, 0.0, torsoWidth/2 + upperLegHeight + lowerLegHeight - upperLegWidth);
            m = mult(m, rotate(90, vec3(1, 0, 0)));
            // m = mult(m, rotate(90, vec3(0, 0, 1)));
            figure[grassId] = createNode( m, grass, null, null );
            break;
    



    }

}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

// sheep functions
function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    materialColor = vec4(0.86, 0.86, 0.86, 1.0); // light grey
    gl.uniform4fv(materialColorLoc, materialColor);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    materialColor = vec4(0.86, 0.86, 0.86, 1.0); // light grey
    gl.uniform4fv(materialColorLoc, materialColor);

    for(var i =0; i<6; i++) {
        // face
        if(i == 3){
            gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 4);
            gl.uniform1f(textureModeLoc, 0.5);
        
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

            gl.uniform1f(textureModeLoc, 1.0);
            gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 1);
        }
        else{
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);   
        }
            
    }

}

function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -10. * tailHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    
    materialColor = vec4(210/255, 180/255, 160/255, 1.0); // pink
    gl.uniform4fv(materialColorLoc, materialColor);

    // deactivate texture and normalmap
    gl.uniform1f(textureModeLoc, 0.0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    // activate texture and normal map
    gl.uniform1f(textureModeLoc, 1.0);

    materialColor = vec4(0.86, 0.86, 0.86, 1.0); // light grey
    gl.uniform4fv(materialColorLoc, materialColor);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    

    materialColor = vec4(210/255, 180/255, 160/255, 1.0); // pink
    gl.uniform4fv(materialColorLoc, materialColor);

    // deactivate texture and normalmap
    gl.uniform1f(textureModeLoc, 0.0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    // activate texture and normal map
    gl.uniform1f(textureModeLoc, 1.0);

    materialColor = vec4(0.86, 0.86, 0.86, 1.0); // light grey
    gl.uniform4fv(materialColorLoc, materialColor);

}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    
    materialColor = vec4(210/255, 180/255, 160/255, 1.0); // pink
    gl.uniform4fv(materialColorLoc, materialColor);
    
    // deactivate texture and normalmap
    gl.uniform1f(textureModeLoc, 0.0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    // activate texture and normal map
    gl.uniform1f(textureModeLoc, 1.0);

    materialColor = vec4(0.86, 0.86, 0.86, 1.0); // light grey
    gl.uniform4fv(materialColorLoc, materialColor);

}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    
    materialColor = vec4(210/255, 180/255, 160/255, 1.0); // pink
    gl.uniform4fv(materialColorLoc, materialColor);

    // deactivate texture and normalmap
    gl.uniform1f(textureModeLoc, 0.0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    // activate texture and normal map
    gl.uniform1f(textureModeLoc, 1.0);

    materialColor = vec4(0.86, 0.86, 0.86, 1.0); // light grey
    gl.uniform4fv(materialColorLoc, materialColor);

}


// fence functions

function leftPole() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( poleWidth, poleHeight, poleWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );


    materialColor = vec4(128/255, 85/255, 0.0, 1.0); // brown
    materialColor = vec4(.8, .8, .0, 1.0); // green
    
    gl.uniform4fv(materialColorLoc, materialColor);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function centerPole() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( poleWidth, poleHeight, poleWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightPole() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( poleWidth, poleHeight, poleWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function upperRightTravPole() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( travWidth, travHeight, travWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function upperLeftTravPole() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( travWidth, travHeight, travWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
} 

function lowerRightTravPole() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( travWidth, travHeight, travWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function lowerLeftTravPole() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( travWidth, travHeight, travWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
} 

// grass functions

function grass(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( grassWidth, grassHeight, grassWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    
    // materialColor = vec4(0.0, 128/255, .0, 1.0); // green
    materialColor = vec4(.8, .8, .0, 1.0); // green
    gl.uniform4fv(materialColorLoc, materialColor);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);
    
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    tangentsArray.push(t1);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    tangentsArray.push(t1);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    tangentsArray.push(t1);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    tangentsArray.push(t1);
    texCoordsArray.push(texCoord[3]);
}

function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);


    instanceMatrix = mat4();

    modelViewMatrix = mat4();
    
    cameraViewMatrix = lookAt(eye, at, up);
        
    projectionMatrix = perspective(fov, aspect, near, far);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation( program, "uProjectionMatrix");
    cameraViewMatrixLoc = gl.getUniformLocation( program, "uCameraViewMatrix");
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix)  );
    gl.uniformMatrix4fv(cameraViewMatrixLoc, false, flatten(cameraViewMatrix)  );
    
    materialColorLoc = gl.getUniformLocation(program, "uMaterialColor");
    lightColorLoc = gl.getUniformLocation(program, "uLightColor");
    lightPositionLoc = gl.getUniformLocation(program, "uLightPosition");

    gl.uniform4fv(lightColorLoc, lightColor);
    gl.uniform4fv(lightPositionLoc, lightPosition);


    textureModeLoc = gl.getUniformLocation(program, "uTextureMode");

    load_textures();
    
    cube();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var tangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tangentsArray), gl.STATIC_DRAW);

    var tangentLoc = gl.getAttribLocation(program, "aTangent");
    gl.vertexAttribPointer(tangentLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(tangentLoc);

    var coordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);


    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}


var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT );


        cameraViewMatrix = lookAt(eye, at, up);
        cameraViewMatrix = mult(cameraViewMatrix, translate(x_cam_pos, y_cam_pos, z_cam_pos));
        cameraViewMatrix = mult(cameraViewMatrix, rotate(x_cam_rot, vec3(1, 0, 0)));
        cameraViewMatrix = mult(cameraViewMatrix, rotate(y_cam_rot, vec3(0, 1, 0)));
        cameraViewMatrix = mult(cameraViewMatrix, rotate(z_cam_rot, vec3(0, 0, 1)));  
          
        
        projectionMatrix = perspective(fov, aspect, near, far);

        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(cameraViewMatrixLoc, false, flatten(cameraViewMatrix));
        
        gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 1);
        gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 6);
        gl.uniform1f(textureModeLoc, 1.0);
        traverse(torsoId);

        gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 3);
        gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 7);
        gl.uniform1f(textureModeLoc, 1.0);
        traverse(leftPoleId);

        gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 2);
        gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 5);
        gl.uniform1f(textureModeLoc, 1.0);
        traverse(grassId);

        // animation
        
        if(animation){

            tic = tic + 1;
            
            sheep_animation();

        }
            
        requestAnimationFrame(render);
}


function sheep_animation() {

    // sheep go ahead
    sheep_animation_step(
        0, 
        60,
        [
            [_left_leg_movement, [1]],
            [_translate_torso, [0, direction*0.05, 0]]
        ]
    );

    sheep_animation_step(
        60, 
        120,
        [
            [_right_leg_movement, [1]],
            [_left_leg_movement, [-1]],
            [_translate_torso, [0, direction*0.05, 0]] 

        ]
    );

    sheep_animation_step(
        120, 
        150,
        [
            [_right_leg_movement, [-1]],
            [_left_leg_movement, [1]],
            [_translate_torso, [0, direction*0.05, 0]] 

        ]
    );

    // sheep prepare to jump
    sheep_animation_step(
        150, 
        165,
        [
            [_prepare_jump, [1]], 
            [_translate_torso, [0, 0, -0.01]] 
        ]
    );

    // sheep jump
    sheep_animation_step(
        165, 
        180,
        [
            [_prepare_jump, [-1]], 
            [_translate_torso, [0, 0, 0.250]],
            [_legs_jump_movement,[1]] 
        ]
    );


    sheep_animation_step(
        180, 
        195,
        [
            [_translate_torso, [0, direction*0.05, 0.250]],
            [_legs_jump_movement,[1]]  
        ]
    );

    sheep_animation_step(
        195, 
        210,
        [
            [_translate_torso, [0, direction*0.1, 0.125]],
            [_legs_jump_movement,[1]]  
        ]
    );


    sheep_animation_step(
        210, 
        225,
        [
            [_translate_torso, [0, direction*0.1, 0.125/2]],
            [_legs_jump_movement,[1]]  
        ]
    );


    sheep_animation_step(
        225, 
        240,
        [
            [_translate_torso, [0, direction*0.1, 0.125/4]], 

        ]
    );


    sheep_animation_step(
        240, 
        250,
        [
            [_translate_torso, [0, direction*0.1, 0]] 
        ]
    );


    sheep_animation_step(
        250, 
        265,
        [
            [_translate_torso, [0, direction*0.1, -0.125/4]] 
        ]
    );


    sheep_animation_step(
        265, 
        280,
        [
            [_translate_torso, [0, direction*0.1, -0.125/2]],
            [_legs_jump_movement,[-1]]  
        ]
    );


    sheep_animation_step(
        280, 
        295,
        [
            [_translate_torso, [0, direction*0.1, -0.125]],
            [_legs_jump_movement,[-1]]  
        ]
    );


    sheep_animation_step(
        295, 
        310,
        [
            [_translate_torso, [0, direction*0.1, -0.250]],
            [_legs_jump_movement,[-1]]  
        ]
    );


    sheep_animation_step(
        310, 
        325,
        [
            [_prepare_jump, [1]], 
            [_translate_torso, [0, direction*0.1, -0.250]],
            [_legs_jump_movement,[-1]]  
        ]
    );


    // sheep end jump
    sheep_animation_step(
        325, 
        340,
        [
            [_prepare_jump, [-1]], 
            [_translate_torso, [0, 0, 0.01]] 
        ]
    );

    // sheep go ahead
    sheep_animation_step(
        340, 
        400,
        [
            [_right_leg_movement, [-1]],
            [_translate_torso, [0, direction*0.05, 0]] 
        ]
    );


    sheep_animation_step(
        400, 
        460,
        [
            [_right_leg_movement, [1]],
            [_left_leg_movement, [-1]],
            [_translate_torso, [0, direction*0.05, 0]] 
        ]
    );


    sheep_animation_step(
        460, 
        520,
        [
            [_right_leg_movement, [-1]],
            [_left_leg_movement, [1]],
            [_translate_torso, [0, direction*0.05, 0]] 
        ]
    );

    sheep_animation_step(
        520, 
        580,
        [
            [_right_leg_movement, [1]],
            [_left_leg_movement, [-1]],
            [_translate_torso, [0, direction*0.05, 0]] 
        ]
    );

    sheep_animation_step(
        580, 
        610,
        [
            [_right_leg_movement, [-1]],
            [_left_leg_movement, [1]],
            [_translate_torso, [0, direction*0.05, 0]] 
        ]
    );

    // sheep prepare to jump
    sheep_animation_step(
        610, 
        625,
        [
            [_prepare_jump, [1]], 
            // [_translate_torso, [0, 0, -0.01]] 
        ]
    );

    // sheep jump and turn left
    sheep_animation_step(
        625, 
        640,
        [
            [_prepare_jump, [-1]], 
            [_translate_torso, [0, 0, 0.125/2]] ,
            [_rotate_torso, [0, 0, 1]]
        ]
    );

    sheep_animation_step(
        640, 
        685,
        [
            [_translate_torso, [0, 0, 0.125/2]] ,
            [_rotate_torso, [0, 0, 1]]
        ]
    );

    sheep_animation_step(
        685, 
        715,
        [
            [_translate_torso, [0, 0, 0.125/4]] ,
            [_rotate_torso, [0, 0, 1]]
        ]
    );

    sheep_animation_step(
        715, 
        735,
        [
            [_translate_torso, [0, 0, 0]] ,
            [_rotate_torso, [0, 0, 1]]
        ]
    );

    sheep_animation_step(
        735, 
        765,
        [
            [_translate_torso, [0, 0, -0.125/4]] ,
            [_rotate_torso, [0, 0, 1]]
        ]
    );


    sheep_animation_step(
        765, 
        805,
        [
            [_translate_torso, [0, 0, -0.125/2]] ,
            [_rotate_torso, [0, 0, 1]]
        ]
    );
    
    // sheep end jump and restart animation
    sheep_animation_step(
        805, 
        825,
        [
            [_translate_torso, [0, 0, -0.125/2]] ,
        ]
    );

    // backward
    sheep_animation_step(
        825, 
        835,
        [
            [_backward_animation, []]
        ]
    );


  
}

function _backward_animation() {

    direction = direction * (-1);
    tic = 0;
    
}

// [ f1, [args_11, ..., args_1n], ..., fn, [args_n1, ..., args_nn]]
function sheep_animation_step(start, stop, f_list){
    if(tic >= start & tic < stop){
        for(var i = 0; i < f_list.length; i++) { 
            var f = f_list[i][0];
            var args = f_list[i][1];
            f(args);
        }
    }  
}

function _rotate_torso(params) {
    rotate_torso(params[0], params[1], params[2]);
}

function _translate_torso(params) {
    translate_torso(params[0], params[1], params[2]);
}

function _left_leg_movement(params) {
    left_leg_movement(params[0]);
}

function _right_leg_movement(params) {
    right_leg_movement(params[0]);
}

function _prepare_jump(params) {
    prepare_jump(params[0]);
}

function _legs_jump_movement(params) {
    legs_jump_movement(params[0]);
}

function prepare_jump(size) {
    // leg movement
    
    theta[leftUpperFrontLegId] -= size/2;
    theta[leftUpperBackLegId] -= size/2;
    theta[rightUpperFrontLegId] -= size/2;
    theta[rightUpperBackLegId] -= size/2;



    theta[leftLowerFrontLegId] -= size;
    theta[leftLowerBackLegId] -= size;
    theta[rightLowerFrontLegId] -= size;
    theta[rightLowerBackLegId] -= size;


    initNodes(leftUpperFrontLegId);
    initNodes(leftUpperBackLegId);
    initNodes(rightUpperFrontLegId);
    initNodes(rightUpperBackLegId);
    
    initNodes(leftLowerFrontLegId);
    initNodes(leftLowerBackLegId);
    initNodes(rightLowerFrontLegId);
    initNodes(rightLowerBackLegId);


    
}

// yaw > 0 turn left
// yaw < 0 turn right
function rotate_torso(roll, pitch, yaw){

    theta[torsoId] += roll;
    sigma[torsoId] += pitch;
    omega[torsoId] += yaw;
    
    initNodes(torsoId);
    
}

// z = go up 
// y = go ahead
// x = go sideways
function translate_torso(x_size, y_size, z_size){
    x_sheep_pos += x_size;
    y_sheep_pos += y_size;
    z_sheep_pos -= z_size;
    initNodes(torsoId);    
}

function left_leg_movement(size){

    // leg movement
    theta[leftUpperFrontLegId] += size;
    initNodes(leftUpperFrontLegId);

    theta[leftLowerBackLegId] -= size/4;
    initNodes(leftLowerBackLegId);

    theta[leftLowerFrontLegId] -= size;
    initNodes(leftLowerFrontLegId);

    theta[rightUpperBackLegId] += size;
    initNodes(rightUpperBackLegId);

    theta[rightLowerFrontLegId] -= size/4;
    initNodes(rightLowerFrontLegId);

    theta[rightLowerBackLegId] -= size;
    initNodes(rightLowerBackLegId);
    
}

function right_leg_movement(size){

      
    // leg movement
    theta[rightUpperFrontLegId] += size;
    initNodes(rightUpperFrontLegId);

    theta[rightLowerBackLegId] -= size/4;
    initNodes(rightLowerBackLegId);

    theta[rightLowerFrontLegId] -= size;
    initNodes(rightLowerFrontLegId);

    theta[leftUpperBackLegId] += size;
    initNodes(leftUpperBackLegId);

    theta[leftLowerFrontLegId] -= size/4;
    initNodes(leftLowerFrontLegId);

    theta[leftLowerBackLegId] -= size;
    initNodes(leftLowerBackLegId);


}

function legs_jump_movement(size) {
    // leg movement
    theta[rightUpperFrontLegId] += size;
    initNodes(rightUpperFrontLegId);

    theta[leftUpperFrontLegId] += size;
    initNodes(leftUpperFrontLegId);
    
    theta[rightUpperBackLegId] -= size;
    initNodes(rightUpperBackLegId);

    theta[leftUpperBackLegId] -= size;
    initNodes(leftUpperBackLegId);


}

function resetScene() {
    tic = 0;
    direction = 1;
    animation = false;


    // sheep animation
    x_sheep_pos = 0.0;
    y_sheep_pos = -2.0;
    z_sheep_pos = 0.0;

    theta = [0, 0, -90, 0, -90, 0, -90, 0, -90, 0, -90, 0];
    omega = [0];
    sigma = [0];
    
    for(i=0; i<numNodes; i++) initNodes(i);
    

    
}

function load_textures() {

    
    // var wool_url = "https://st4.depositphotos.com/16252222/40632/i/950/depositphotos_406327612-stock-photo-white-wool-texture-background-cotton.jpg"; // wool
    var wool_url = "wool_text.jpg";

    var wool_image = new Image();
    wool_image.crossOrigin = "";
    wool_image.src = wool_url;
    wool_image.onload = function(){
        configureTexture(wool_image, 1, false);
    }

    
    // var grass_url =  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSJ5swlLPQP741o1Ft-UfYWl1TSmQbqdbvcA&usqp=CAU"; // grass
    var grass_url =  "grass_text.jpg";

    var grass_image = new Image();
    grass_image.crossOrigin = "";
    grass_image.src = grass_url;
    grass_image.onload = function(){
        configureTexture(grass_image, 2, false);
    }


    // var wood_url =  "https://st4.depositphotos.com/3898687/i/600/depositphotos_272084126-stock-photo-texture-of-dark-old-wood.jpg"; // wood
    var wood_url =  "wood_text.jpeg";
    var wood_image = new Image();
    wood_image.crossOrigin = "";
    wood_image.src = wood_url;
    wood_image.onload = function(){
        configureTexture(wood_image, 3, false);
    }

    // var sheepface_url = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6438ee0c-40e3-453b-b9c3-67b093e85e96/d4rvenw-f469bcb8-447a-4269-b59f-8f3d9cfe347b.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY0MzhlZTBjLTQwZTMtNDUzYi1iOWMzLTY3YjA5M2U4NWU5NlwvZDRydmVudy1mNDY5YmNiOC00NDdhLTQyNjktYjU5Zi04ZjNkOWNmZTM0N2IuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0._etzq_pC2F9R9B8zwgE2A1D-axh4SOzhRpJrsOqpcks";
    var sheepface_url = "sheep_face_text.png";
    var sheepface_image = new Image();
    sheepface_image.crossOrigin = "";
    sheepface_image.src = sheepface_url;
    sheepface_image.onload = function(){
        configureTexture(sheepface_image, 4, false);
    }

    // bump maps


    // var grass_map_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTRb6tLxIB34obF52sdBTsjOXhVCHC12v78A&usqp=CAU";
    var grass_map_url = "grass_map.jpeg";
    var grass_map_image = new Image();
    grass_map_image.crossOrigin = "";
    grass_map_image.src = grass_map_url;
    grass_map_image.onload = function(){
        configureTexture(grass_map_image, 5, true);
    }

    // var wool_map_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBT7725Ffh2SpC9kWj_Phmdb4q52Rw48sSc6lskO10vPvnNHWUmSCpkzLqUfpcFlRF12w&usqp=CAU";
    var wool_map_url = "wool_map.jpg";
    var wool_map_image = new Image();
    wool_map_image.crossOrigin = "";
    wool_map_image.src = wool_map_url;
    wool_map_image.onload = function(){
        configureTexture(wool_map_image, 6, true);
    }


    // var wool_map_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBT7725Ffh2SpC9kWj_Phmdb4q52Rw48sSc6lskO10vPvnNHWUmSCpkzLqUfpcFlRF12w&usqp=CAU";
    var wood_map_url = "wood_map.jpg";
    var wood_map_image = new Image();
    wood_map_image.crossOrigin = "";
    wood_map_image.src = wood_map_url;
    wood_map_image.onload = function(){
        configureTexture(wood_map_image, 7, true);
    }

}