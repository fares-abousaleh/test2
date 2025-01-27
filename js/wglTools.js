
import {fragmentShader} from "./fragmentShader.js"

import {vertexShader} from "./vertexShader.js"

export {Engine,Mouse}
const MAX_VERTEX_NUM = 10000

var vNum = 0

var ctx ,prog, vbuf, cbuf, tbuf
var messagebox = null
var maincanvas = null
var animation = {on:false,func:function(){}}
var isReady = false

function resumeAnim(f){
	last_time=Date.now()
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
		isReady = true
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



var last_time = Date.now()
var dtime=0, time = 0

function getTime(){
	return time
}

function getDTime(){
    return dtime
}

//---------------------------------
// ** drawAll
function drawAll(){
	const cur_time = Date.now()
	dtime = (cur_time-last_time)*0.001
	time  += dtime
	last_time = cur_time
	if(isReady){
		setUnif("time",time)
		setBuffer(vbuf,  vArr ) 
		setBuffer(cbuf,  cArr ) 
		setBuffer(tbuf,  tArr )
		ctx.drawArrays(ctx.TRIANGLES,0,vNum);	 
	}else {
		// alert("waiting for images...")
		messagebox.clear()
		messagebox.print("waiting for images to load...")
	}
	vNum=0
	if(animation.on)
		requestAnimationFrame(animation.func)
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
	`  margin:0;
	    position:absolute;
		width:512px;
		height:512px;
		background:#111;
		padding:5px;
		border: solid 1px #332;
		left:5px;
		top:5px;
	`)
	document.body.appendChild(can)
	can.width  = 512;
	can.height = 512;
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
	
	
	
	let lf = 5, tp = 20 + maincanvas.height
	if(window.screen.width>window.screen.height){
		lf = 20 + maincanvas.width
		tp  = 5
	}
	messagebox.setAttribute("style",`
			position:absolute;
			curssor:pointer; 
			margin:0 px;
			border: solid 1px #332; 
			padding:5px;
			color: #885;
			z-index: 1;
			min-width:512px;
			user-select: none;
			font:consolas, 0.6em;
			top:`+tp+`px;
			left:`+lf+`px;
	`)
	document.body.appendChild(messagebox)	
	return messagebox
}	

function start(w,h){
	maincanvas = createMainCanvas(w,h)
	messagebox = createMessageBox(w,h)
	
	initGL(maincanvas,messagebox)
	Engine.messagebox=messagebox
	Engine.can=maincanvas
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
		dtime:getDTime, 
		draw:drawAll,
		addVertex:addVertex,
		messagebox:messagebox,
		animation:animation,
		can:maincanvas,
		stopMusic:stopMusic,
		sounds:[ 
			new Audio('./assets/dg.mp3') ,
			new Audio('./assets/sad.mp3') ,
			new Audio('./assets/happy.mp3') ,
			new Audio('./assets/piu.mp3')
		   ]
		}

const Mouse = {x:undefined,y:undefined,state:undefined}
 
start()

maincanvas.onmousedown = function(e){
	maincanvas.onmousemove(e)
	Mouse.state = 1
	
}

maincanvas.onmouseup = function(e){
	maincanvas.onmousemove(e) 
	Mouse.state = 0
	 
}

maincanvas.onmousemove = function(e){
	const rec = maincanvas.getBoundingClientRect()
	Mouse.x = -1.0+2.0*(e.x - rec.x)/rec.width
	Mouse.y = +1.0-2.0*(e.y - rec.y)/rec.height
	 
}

maincanvas.addEventListener("touchstart",(e)=>{
	const rec = maincanvas.getBoundingClientRect()
	Mouse.x = -1.0+2.0*(e.touches[0].clientX - rec.x)/rec.width
	Mouse.y = +1.0-2.0*(e.touches[0].clientY - rec.y)/rec.height
	Mouse.state=e.touches.length>0
})

maincanvas.addEventListener("touchend",(e)=>{
	Mouse.state=e.touches.length>0
})
function playMusic(k){

if(!Engine.sounds||!Engine.sounds[k]) return 

Engine.sounds[k].play()

	
}
function stopMusic(){
	for(let i in Engine.sounds)
		{
			
			Engine.sounds[i].pause()
			Engine.sounds[i]. currentTime=0
} }

		
		
