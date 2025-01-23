export 
const fragmentShader = 
`
//--- variables passed from vertex shader ----
varying highp vec4 color; 
varying highp vec2 tPos;   // position in texture 
varying highp vec2 vPos;   // vertex position
varying highp float t;

// the texture  -------------
uniform sampler2D tx; 

void main(){
  gl_FragColor = color *  texture2D(tx,tPos);
}
`