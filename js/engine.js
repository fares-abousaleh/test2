 
var aspectRatio,
    World={},
	Camera={},
	CollisionBlocks=[] 
 
function initWorld(width,height){
	 
	aspectRatio   = can.height *1.0/ can.width
	World.width   = width
	World.height  = height
	World.hWidth  = width/2
	World.hHeight = height/2
	Camera.x = 0
	Camera.y = 0
	Camera.w = 0.2
	Camera.h = Camera.w * aspectRatio 
	Camera.maxX = World.hWidth  - 1
	Camera.maxY = World.hHeight - aspectRatio
	
	
}

function updateCamera(player)
{
	if(player.x-Camera.x>Camera.w)
		Camera.x=player.x-Camera.w
	else
	if(player.x-Camera.x<-Camera.w)
		Camera.x=player.x+Camera.w
	
	if(player.y-Camera.y>Camera.h)
		Camera.y=player.y-Camera.h
	else
	if(player.y-Camera.y<-Camera.h/2)
		Camera.y=player.y+Camera.h/2
	
	Camera.x = sat( Camera.x, -Camera.maxX,Camera.maxX)
	Camera.y = sat( Camera.y, -Camera.maxY,Camera.maxY)
}
/*---------------------------------------*
 
               Sprite Class
			
 *---------------------------------------*/
function Sprite(x,y,w,h,tx){
	this.tx = tx
	this.x  = x
	this.y  = y
	this.vx = 0
	this.vy = 0
	this.ax = 0
	this.ay = 0
	this.width = w
	this.height = h
	this.w = w/2
	this.h = h/2
	this.color = [1,1,1,1]
	this.th = rnd(Math.PI)
	
	//----------------------------------------
	//-- calculate distance to another sprite
	this.distTo=function(sp){
		let a = sp.x-this.x
		let b = sp.y-this.y
		return Math.sqrt(a*a+b*b)
	}
	
	this.speed=function(){
		return Math.sqrt(this.vx*this.vx+this.vy*this.vy)
	}
	
	this.flipH=function(dir){
		let i=Math.min(this.tx[1],this.tx[3])
		let j=Math.max(this.tx[1],this.tx[3])
		if(dir<0){
			this.tx[1]=i
			this.tx[3]=j
		}else{
			this.tx[1]=j
			this.tx[3]=i
		}
	}
	
	//----------------------------------------------
	//-- checks the new position (newx,newy) for 
	//   collisions with blocks & world edges,
	//   then adjusts the new position
	this.checkCollision=function(newx,newy){
		
		const rh ={x:newx,y:this.y,w:this.w,h:this.h}
		const rv ={x:this.x,y:newy,w:this.w,h:this.h}
		
		const  sx = Math.sign(this.vx)
		const  sy = Math.sign(this.vy)
		const eps = 0.0001
		
		//-- collisions with blocks
		for(let i=0;i<CollisionBlocks.length;i++){
			let c = CollisionBlocks[i]
			
		    if(sx!=0&&intersectRects(rh,c)) 
				rh.x = c.x-sx*(eps+c.w+this.w)
			else 
			if(sy!=0&&intersectRects(rv,c)) 
				rv.y = c.y-sy*(eps+c.h+this.h)
		}
		newx = rh.x
		newy = rv.y
		
		//-- detect world edge
		
		if(newx+this.w>World.hWidth||newx-this.w<-World.hWidth)
				newx = sx * (World.hWidth-this.w-eps)
			
		if(newy+this.h>World.hHeight||newy-this.h<-World.hHeight)
				newy = sy * (World.hHeight-this.h-eps)
			
		//-- assign new position
				
		this.x= newx
		this.y= newy
	}

}

//--------------------------------------------
// add sprite vertices to vertex buffer 
// and add colors & texture coordinates to attribute buffers

function addSpriteToBuf(sprite,scalex=1,scaley=1,rotation=0){
	let x = sprite.x - Camera.x
	let y = sprite.y - Camera.y
	if(x-sprite.width>1||x+sprite.width<-1
	   ||y+sprite.height<-1||y-sprite.height>1)return
	   
	let w = sprite.width *0.5*scalex
	let h = sprite.height*0.5*scaley
	const th = sprite.th+rotation
	let c = Math.cos( th )  
	let s = Math.sin( th )
	let px =  c*w-s*h
	let py =  s*w+c*h
	let qx = -c*w-s*h
	let qy = -s*w+c*h
	
	let coords = [
					x+px,y+py,
					x+qx,y+qy,
					x-px,y-py,
					x+px,y+py,
					x-px,y-py,
					x-qx,y-qy 
					]
					
	 
	copyArr(vArr,vNum*2,coords)
	
	//vArr=vArr.concat(coords)
	
    let txcoords = [sprite.tx[2],sprite.tx[1],
					sprite.tx[0],sprite.tx[1],
					sprite.tx[0],sprite.tx[3],
					sprite.tx[2],sprite.tx[1],
					sprite.tx[0],sprite.tx[3],
					sprite.tx[2],sprite.tx[3]
					]
    copyArr(tArr,vNum*2,txcoords)
	
    for(let k=0;k<6;k++,vNum++)					
	  copyArr(cArr,vNum*4,sprite.color)
    
}

//-- add an array of sprites to be drawn
function addSprites(sps){
	for(let k=0;k<sps.length;k++)
		addSpriteToBuf(sps[k])
}


//-- explosion animation 

const explosions = []
const explosionMax = 20
var explosionCur =0

var sparks=[]

function startSpark(pos1,pos2){
	let d = pos1.distTo(pos2)
	let p = new Sprite(pos2.x,pos2.y,
	                   2*d,2*d,
					   
					  [0,0.5,0.5,1])
	p.color[3]=0.5
	p.th=Math.atan2(pos2.x-pos1.x,pos2.y-pos1.y)
	sparks.push(p)
}

function updateSparks(){
	for(let k=0;k<sparks.length;k++){
		let p = sparks[k]
		p.color[3]-=1.0/(60.0*2)
		let q={x:p.x,y:p.y}	
		for(let i=0;i<14;i++){
		
		p.color[0]=rnd(0.5,1)
		p.color[1]=rnd(0.5,1)
		p.color[2]=rnd(0.5,1)
		p.x =q.x+ rnd(0.051)
		p.y =q.y+ rnd(0.051)
		p.flipH(rnd())
		addSpriteToBuf(p,rnd(0.5,1),rnd(0.5,1),rnd(Math.PI))
		
		}
		p.x=q.x
		p.y=q.y
	}
	for(let k=0;k<sparks.length;k++){
		if(sparks[k].color[3]<=0){
			sparks.splice(k,1)
			break
		}
	}
}

function startExplosion(sp){
	
	
	for(let k=0;k<40;k++){
		let p = new Sprite(sp.x, sp.y, 
	                  0.1*sp.width, 0.1*sp.height, 
					  [])
		let a = sp.tx[0]
		let b = sp.tx[1]
		let aa = sp.tx[2]
		let bb = sp.tx[3]
		p.tx=[rnd(a,0.5*(aa+a)),rnd(b,0.5*(bb+b)),
		      rnd(0.5*(aa+a),aa),rnd(0.5*(bb+b),bb)]
		p.color=[1,1,1,1]
		p.vx=0.51*rnd()
		p.vy=0.51*rnd()
		explosions[explosionCur]=p
	    explosionCur++
	    if(explosionCur>=explosionMax)explosionCur=0 
	}

	
	 
}

function explosionsUpdate(dt){
	for(let k=0;k<explosions.length;k++)
	{
		let p = explosions[k]
		if(!p||p.color[3]<0.01)continue
		p.x+=p.vx*dt
		p.y+=p.vy*dt
		if(p.color[3]>0)
			p.color[3]-=1.0/(3.0*60.0)
		p.th+=dt*rnd(10,22)
		addSpriteToBuf(p)
	}
}


 