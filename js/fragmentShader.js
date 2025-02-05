export 
const fragmentShader = 
`
//--- variables passed from vertex shader ----
varying highp vec4 color; 
varying highp vec2 tPos;   // position in texture 
varying highp vec2 vPos;   // vertex position
varying highp float t;
varying highp vec4 bomb;


// the texture  -------------
uniform sampler2D tx; 

highp float f(highp float d){
	return 1.0/(1.0+ d*d);
}

highp vec4 coef(){
	highp float dt = (t-bomb.z)*2.0 ;  
    highp float cf = 0.0;
	cf = distance(vPos.xy,bomb.xy)-dt;
	cf = f(13.0*cf);
	return vec4(sin(10.0*cf),0.0,0.0,0.0);
}	

void main(){
  gl_FragColor = (color +coef()) * texture2D(tx,tPos);
}
`