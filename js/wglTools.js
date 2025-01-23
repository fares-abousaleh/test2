
import {fragmentShader} from "./fragmentShader.js"

import {vertexShader} from "./vertexShader.js"

const MAX_VERTEX_NUM = 10000

var vNum = 0

var ctx ,prog, vbuf, cbuf, tbuf
var messagebox = null
var maincanvas = null
var animation = {on:false,func:function(){}}

function resumeAnim(f){
	animation.on = true
	animation.func = f || animation.func
	requestAnimationFrame(f)
}

function stopAnim(){
	animation.on=false
}

const vArr= new Float32Array(MAX_VERTEX_NUM * 2)
const cArr= new Float32Array(MAX_VERTEX_NUM * 4)
const tArr= new Float32Array(MAX_VERTEX_NUM * 2)
var unifPosTime
 
function setUnif(name,value){
		let loc = ctx.getUniformLocation(prog,name)
		ctx.uniform1f(loc,value)
	 }
	 
//--------------------------------
// ** newBuffer: creates a buffer and bind it to attribute 'name'
function newBuffer(name,size){
	var p = ctx.getAttribLocation(prog,name);
	var buffer = ctx.createBuffer(); 
	ctx.bindBuffer(ctx.ARRAY_BUFFER,buffer); 
	ctx.enableVertexAttribArray(p);
	ctx.vertexAttribPointer(p,size,ctx.FLOAT,false,0,0); 
	return buffer;
} 	
	
//---------------------------------
// ** setBuffer: sets the vbalues in buffer 
function setBuffer(buffer,values){
	ctx.bindBuffer(ctx.ARRAY_BUFFER,buffer);
	ctx.bufferData(ctx.ARRAY_BUFFER,values,ctx.STATIC_DRAW);
}

//--------------------------------
function initGL(can,messagebox){
	
	can.oncontextmenu = function(){return false} 
	ctx = can.getContext("webgl");
	ctx.enable(ctx.BLEND);
	ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
	if(ctx)
		messagebox.print("WebGL device context created.");
	var  VShader = createShader(ctx,ctx.VERTEX_SHADER,vertexShader);
	var  FShader = createShader(ctx,ctx.FRAGMENT_SHADER,fragmentShader);
	if(VShader)
		messagebox.print("Vertex shader compiled.")
	if(FShader)
		messagebox.print("Fragment shader compiled.")
	
	prog = ctx.createProgram();
	ctx.attachShader(prog,VShader);
	ctx.attachShader(prog,FShader);
	ctx.linkProgram(prog);
	var res = ctx.getProgramParameter(prog,ctx.LINK_STATUS);
	if(res)
		messagebox.print("WeGL Program started.")
	else {
		messagebox.print("Errors compiling shaders!")
		return
	}
	ctx.viewport(0,0,can.width,can.height);
	ctx.useProgram(prog);
	
	//------- Load Texture
	var img = new Image(512,512);
	img.onload = function(){
		newTex(img)
	}
	img.src = './assets/bk.png'
	
	//------- create buffers & texture
	vbuf = newBuffer("positions",2); // 2 coordinates per vertex
	cbuf = newBuffer("colors",4);      // 4 color components per vertex
	tbuf = newBuffer("tpositions",2);      // 2 texture coordinates per vertex		
	
}

//--------------------------------
	
function createShader(gl,type,src){
	 var shader = gl.createShader(type);
	 gl.shaderSource(shader,src);
	 gl.compileShader(shader);
	 var res = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
	 if(res)return shader;
}
	
    
//---------------------------------
// ** newTex: creates a texture from an image object
function newTex(image){
 let tex = ctx.createTexture();
 ctx.bindTexture(ctx.TEXTURE_2D,tex);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
 ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
 //ctx.texImage2D(ctx.TEXTURE_2D,0,ctx.RGBA,image.width, image.height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE,new Uint8Array(image.data)); 
 ctx.texImage2D(ctx.TEXTURE_2D,0,ctx.RGBA,ctx.RGBA,ctx.UNSIGNED_BYTE,image)
 return tex;
}

//---------------------------------
function copyArr(dest,pos,src){
	for(let i=0;i<src.length&&pos<MAX_VERTEX_NUM;i++,pos++)
			dest[pos]=src[i]
}

//---------------------------------
// ** drawAll
function getTime(){
	return time
}

var time = 0
const StartDate = Date.now()
function drawAll(){
	time = (Date.now()-StartDate)*0.001
	setUnif("time",time)
	setBuffer(vbuf,  vArr ) 
	setBuffer(cbuf,  cArr ) 
	setBuffer(tbuf,  tArr )
	ctx.drawArrays(ctx.TRIANGLES,0,vNum);	 
	vNum=0
	if(animation.on)
		resumeAnim(animation.func)
}

function addVertex(v,clr,tx){
	vArr[vNum*2+0]=v[0]
	vArr[vNum*2+1]=v[1]
	
	cArr[vNum*4+0]=clr[0]
	cArr[vNum*4+1]=clr[1]
	cArr[vNum*4+2]=clr[2]
	cArr[vNum*4+3]=clr[3]
	
	tArr[vNum*2+0]=tx[0]
	tArr[vNum*2+1]=tx[1]
	
	vNum++
}

function createMainCanvas(w,h){
	const can = document.createElement("canvas")
	can.setAttribute("style",
	`
			position:absolute;
			left:4px;
			top:4px;
			margin:0;
			
			background:#303030;
	`)
	document.body.appendChild(can)
	can.width = w
	can.height = h
	return can
}

function createMessageBox(w,h){
	
	let messagebox = document.createElement("span")	
	
	messagebox.print = function(s){
		messagebox.innerHTML += ""+s+"<br>"
	}
	
	messagebox.clear = function(){
		messagebox.innerHTML = ""
	}
	
	document.body.appendChild(messagebox)
	
	messagebox.setAttribute("style",`
			position:absolute;
			left:10%;
			top:10%;
			curssor:pointer; 
			text-align: left;
			color: yellow;
			z-index: 1;
			user-select: none;"
	`)
	
	return messagebox
}	

function start(w,h){
	messagebox = createMessageBox(w,h)
	maincanvas = createMainCanvas(w,h)
	initGL(maincanvas,messagebox)
	Engine.messagebox=messagebox
}

function togleAnim(){
	if(animation.on)stopAnim()
	else resumeAnim(animation.func)
}

/*-----------------------------------------
	Exported Object: Engine
  -----------------------------------------*/
const Engine = {
	    resume:resumeAnim,
		stop:stopAnim,
		togle:togleAnim,
		time:getTime,
		start:start,
		draw:drawAll,
		addVertex:addVertex,
		messagebox:messagebox,
		animation:animation
		}

export default Engine
