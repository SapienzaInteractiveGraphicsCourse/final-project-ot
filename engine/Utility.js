
export function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// given the current matrix, a 4-tuple (x, y, z, f) and the reference system expressed in term of max coord size
// return the correct interpretation of the given tuple.
export function coord_to_coord(max_x, max_y, max_z, x, y, z, f, matrix){
  // default 
  // max_x = max_y = 10
  // max_z = 2 

  var out_x, out_y, out_z, out_f;

  if(x > max_x){
    // from this face to right face 
    out_x = 0;
    out_y = y;
    out_z = z; // = 0 !
    out_f = matrix.right.id;
    
  } else if (x < 0){
    // from this face to left face
    out_x = max_x;
    out_y = y;
    out_z = z;
    out_f = matrix.left.id;

  }

  if(y > max_y){
    // from this face to down face  
    out_x = x;
    out_y = 0;
    out_z = z;
    out_f = matrix.down.id;


  
  } else if (y < 0){
    // from this face to up face
    out_x = x;
    out_y = max_y;
    out_z = z;
    out_f = matrix.up.id;
  }

  if(z > max_z){
    // 
    out_x = x;
    out_y = y;
    out_z = max_z;
    out_f = f;
  
  } else if (z < 0){

    out_x = x;
    out_y = y;
    out_z = 0;
    out_f = f;
  }


}
