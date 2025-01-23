export 
const vertexShader = 
`
//--- buffers passed from main program ----
attribute vec2 positions;  // position 
attribute vec4 colors;     // color
attribute vec2 tpositions; // position in texture
uniform float time;

//--- varibles to be passed to fragment shader ----
varying highp vec4 color;  
varying highp vec2 tPos; // pos in texture
varying highp vec2 vPos; // vertex position 
varying highp float t;

void main(){
   gl_Position =  vec4(positions ,0.0,1.0);
   color = colors; 
   tPos  = tpositions;
   vPos  = positions;
   t     = time;
}
`