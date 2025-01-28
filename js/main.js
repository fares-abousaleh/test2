import { Engine , Mouse } from "./wglTools.js"
import Sprite from "./sprites.js"

var trianglesOn = true
const SZ = 0.095
const sprites = [new Sprite({txPos:{x:0.5,y:0,xx:0.75,yy:0.25},hw:SZ,hh:SZ})]
sprites[0].v={x:0,y:0}
const clouds = []
const missiles = []
const fires = []


function createMissile(){
	return new Sprite({
		color:[1,1,1,1],
		pos:{x:0,y:2},
		txPos:{x:0.5,y:0.25,xx:0.75,yy:0.5},
		hw:0.1,hh:0.06})
}

function createFire(sp){
	const fr = new Sprite({
		color:[1,1,1,1],
		pos:{x:sp.pos.x,y:sp.pos.y},
		txPos:{x:0.75,y:0,xx:1,yy:0.25},
		hw:SZ,hh:SZ})
	fr.rot = rnd(Math.PI)
	return fr
}

function startFire(sp){
	for(let i in fires)
		if(fires[i].hw>1){
			fires[i]= createFire(sp)
			return
		}
	fires.push( createFire(sp) )		
}

function createMonster(){
	const y = 0.25*rndInt(0,2)
	const w = rnd(0.5*SZ,SZ)
	const sp =  new Sprite({
		color:[1,1,1,1],
		pos:{x:rnd(),y:rnd()},
		txPos:{x:0,y:y,xx:0.25,yy:y+0.25},
		hw:w,hh:w})
	sp.v={x:rnd(0.1),y:rnd(-2,-1)}
	sp.rot=rnd(0.05)
	return sp
}


function createCloud(sp){
	const w = rnd(1.2,2.4)
	sp = sp || new Sprite({})
	sp.color=[rnd(0.5,1),rnd(0.5,1),rnd(0.5,1),rnd(0.1,0.3)]
	sp.pos={x:rnd(),y:rnd( 3, 2)}
	sp.txPos={x:0,y:0.5,xx:0.5,yy:1}
	sp.hw=w
	sp.hh=w
	sp.rot=rnd(3.14159)
	return sp
}

for(let i=0;i<10;i++)
	missiles[i] = createMissile()

for(let i=1;i<10;i++)
	sprites[i]=createMonster()

var missile_count = 3

for(let i=0;i<10;i++)
		clouds[i] = createCloud()
	
document.body.onkeydown = function(e){
	
	switch(e.key){
		
		case '1': Engine.animation.func = animate1
		          break
		
		case '2': Engine.animation.func = animate
		          break
		
		case 'Escape': 
		          Engine.messagebox.clear()
				  break
					   
		case 't': trianglesOn = !trianglesOn
				  break
				 
		case 'a': Engine.stopSound()
                  Engine.togle()
				  if(Engine.animation.on){
				  Engine.playMusic()
				  }
				  else{
				  Engine.stopMusic()
				  }
				  break	
		case 'r': 
				  sprites[0].pos.y=-0.9
				  Engine.stopSound()
				  Engine.playMusic()
				  break
		case 'm':		
                  missile_fire()				  
				  break		
		default: 
				  Engine.messagebox.clear()
				  Engine.messagebox.print("Unknown command "+e.key)
	
	}
}

function missile_fire(){
	if(missile_count>0){
					//missile_count--
					Engine.playSound('piu') 
					for(let i in missiles)
						if(missiles[i].pos.y>=2){
							missiles[i].pos.x=sprites[0].pos.x
							missiles[i].pos.y=sprites[0].pos.y
							break
						}
				  }	
}
	

function animate(){
	 const dt  = Engine.dtime()
	 const t   = Engine.time()
	 
	  
	//--- draw random triangles
	if(trianglesOn)
	for(let i in clouds){
					  clouds[i].add({x:0,y:0}, t*(0.1+i*0.01))
					  clouds[i].pos.y -= dt*(1+0.053*i)
					  if(clouds[i].pos.y<-1-clouds[i].hh){
				        createCloud(clouds[i])		   
					  }
				}
				  
	//-- animate enemies ----------------			  
	for(let i=1;i<sprites.length;i++)
	{
		const sp = sprites[i]
		//---collision with missile
		if(sp.pos.y<1.1)
		for(let j in missiles){
			if(dist(missiles[j].pos,sp.pos)<0.1451){
				startFire(sp)
				missiles[j].pos.y=3
				sp.pos.y=rnd(2,3)
				sp.pos.x=rnd( )
				sp.v.y=rnd(-1,-0.3)
				sp.v.x=rnd(0.1)
				Engine.playSound('dg') 
				break 
			}
		}
		
			sp.add(undefined,sp.rot+=rnd(0.1)*dt)
			sp.pos.x+= sp.v.x*dt
			sp.pos.y+= sp.v.y*dt
			 
			sp.pos.x=sat(sp.pos.x,-0.95,0.95)
			if(rnd()>0 ){
				sp.v.x -= Math.sign(sp.pos.x)*rnd(3 ,10)*dt
				sp.v.y += rnd(33)*dt
			}
			sp.v.y  = sat(sp.v.y,-1,-0.3)
			
		if(sp.pos.y<-1.5){
			sp.pos.y=rnd(2,2.7)
			sp.pos.x=rnd( )
		}
	}
	
	if(sprites[0].pos.y<2)
	{
		const d = dist(sprites[0].pos,Mouse)
		if(d>0.05)
		{
			sprites[0].v.x = dt*513*(Mouse.x - sprites[0].pos.x)
			sprites[0].v.y = dt*513*(Mouse.y - sprites[0].pos.y)
			sprites[0].pos.x += dt*sprites[0].v.x
			sprites[0].pos.y += dt*sprites[0].v.y
			sprites[0].pos.x = sat(sprites[0].pos.x ,-1,1)
			sprites[0].pos.y = sat(sprites[0].pos.y ,-1,1)
		}		
		else
		if(Mouse.state>0) // triger missile		
		{
			Mouse.state=0
			missile_fire()
			
		}
		//--- collisions with monsters	
		for(let j=1;j<sprites.length;j++){
		   if(dist(sprites[0].pos,sprites[j].pos)<0.1){
		      startFire(sprites[0])
			  Engine.stopMusic()
			  Engine.playSound('sad')
			  sprites[0].pos.y=3
			  break
		   }
		}
	}
	
	for(let i in missiles){
		if(missiles[i].pos.y<2){
			missiles[i].pos.y+=3*dt
			missiles[i].add()
			
		}
	}
	
	for(let i in fires ) 
	{
		if(fires[i].hw<1){
			fires[i].add(undefined,fires[i].rot+=rnd()*0.1 )
			fires[i].hw+=dt*6 
			fires[i].hh+=dt*6 
			fires[i].color[3]*=0.7
			fires[i].color[1]*=0.7
			fires[i].color[2]*=0.9
		}
	}
	
	sprites[0].add( {x:0.06*Math.sin(4*t),y:0.06*Math.sin(3*t)})
	
	
	
	if(rnd(0,100)<12)
	{ 
		Engine.messagebox.clear()
		Engine.messagebox.print("fps:"+Math.round(1.0/dt))
		Engine.messagebox.print("dt ="+Math.round(dt*1000.0)+"ms" )
		Engine.messagebox.print("press (a) to togle animation")
		Engine.messagebox.print("press (1) or (2) to chose type of animation")
		Engine.messagebox.print("press (t) to hide or show background objects")
		Engine.messagebox.print("fires:"+fires.length)
		Engine.messagebox.print("enemies:"+sprites.length)
		
	}
	if(sprites[0].pos.y<2)Engine.playMusic()
	Engine.draw()
	
}

function animate1(){
	 
	const dt = Engine.dtime()
	const t = Engine.time()
	
	sprites[0].hw *=2
	sprites[0].hh *=2
	
	sprites[0].add(undefined, 8.0*Engine.time() )
	sprites[0].pos.x += rnd(0.08) 
	sprites[0].pos.y += rnd(0.08)
	
	sprites[0].hw *=0.5
	sprites[0].hh *=0.5
	if(rnd(0,100)<12)
	{ 
		Engine.messagebox.clear()
		Engine.messagebox.print("fps:"+Math.round(1.0/dt))
		Engine.messagebox.print("dt ="+Math.round(dt*1000.0)+"ms" )
	}
	Engine.draw()
	
}

document.body.onload = function(){		
	Engine.messagebox.print("Press 'a' to stop or resume animation.")
	Engine.messagebox.print("Press 't' to show or hide triangles.")
	Engine.messagebox.print("Press 'Escape' to erase text.")
	Engine.addMusic(['happy','fast'])
	Engine.addSound(['piu','dg','sad'])
	Engine.resume(animate)
}

document.body.addEventListener("mousedown",() => {
	if(sprites[0].pos.y>2){
		document.body.onkeydown({key:'r'})
		return
	}
	 	
} )