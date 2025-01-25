import { Engine , Mouse } from "./wglTools.js"
import Sprite from "./sprites.js"

var trianglesOn = true

const sprites = [new Sprite({txPos:{x:0.5,y:0,xx:0.75,yy:0.25},hw:0.16,hh:0.16})]
const trigs = []
const missiles = []

function createMissile(){
	return new Sprite({
		color:[1,1,1,1],
		pos:{x:0,y:2},
		txPos:{x:0.5,y:0.25,xx:0.75,yy:0.5},
		hw:0.12,hh:0.16})
}

function createMonster(){
	const y = 0.25*rndInt(0,2)
	const sp =  new Sprite({
		color:[1,1,1,1],
		pos:{x:rnd(),y:rnd()},
		txPos:{x:0,y:y,xx:0.25,yy:y+0.25},
		hw:0.1,hh:0.1})
	sp.v={x:rnd(),y:rnd()}
	return sp
}

for(let i=0;i<10;i++)
	missiles[i]=createMissile()

for(let i=1;i<10;i++)
	sprites[i]=createMonster()

var missile_count = 3

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
				 
		case 'a':
                  Engine.togle()
				  break	
		case 'r': 
                  for(let i=1;i<10;i++)
					sprites[i]=createMonster()
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
	for(let i in trigs){
					  trigs[i].add({x:0,y:0}, t*(2+i*0.1))
					  trigs[i].pos.y -= dt*(1+0.053*i)
					  if(trigs[i].pos.y<-2){
						  const x = rndInt(0,3)*0.25 
						  const y = rndInt(0,3)*0.25 
						  trigs[i].hw = rnd(0.3,0.6)
						  trigs[i].hh = rnd(0.3,0.6)
						  trigs[i].txPos={x:x,y:y,xx:x+0.25,yy:y+0.25}
						  trigs[i].color=[rnd(0.5,1),rnd(0.5,1),rnd(0.5,1),rnd(0.05,0.31)]
						  trigs[i].pos.y=rnd(1.5,3.5) 
						  trigs[i].pos.x=rnd() 
					  }
				}
				  
	for(let i=1;i<sprites.length;i++){
		const dx = 0.1*Math.sin((i%5+1)*1.0*t)
		const dy = 0.1*Math.cos((i%5+1)*1.0*t)
		sprites[i].pos.x+=dx
		sprites[i].pos.y+=dy
		for(let j in missiles){
			if(dist(missiles[j].pos,sprites[i].pos)<0.1451){
				missiles[j].pos.y=3
				 sprites[i].pos.y=3
			}
		}
		if(sprites[i].pos.y<1){
			sprites[i].add()
			
		sprites[i].pos.x-=dx+sprites[i].v.x*dt
		sprites[i].pos.y-=dy+sprites[i].v.y*dt
		sprites[i].v.x+=0.4*sprites[i].pos.x*dt
		sprites[i].v.y+=0.4*sprites[i].pos.y*dt
		}
	}
	
	if(Mouse.state==1)
	if(dist(sprites[0].pos,Mouse)>0.05)
	{
		sprites[0].pos.x += dt*13*(Mouse.x - sprites[0].pos.x)
		sprites[0].pos.y += dt*13*(Mouse.y - sprites[0].pos.y)
		sprites[0].pos.x = sat(sprites[0].pos.x ,-1,1)
		sprites[0].pos.y = sat(sprites[0].pos.y ,-1,1)
	}		
	else {
		Mouse.state=0
		missile_fire()
	}
		
	for(let i in missiles){
		if(missiles[i].pos.y<2){
			missiles[i].pos.y+=3*dt
			missiles[i].add()
			
		}
	}
	
	sprites[0].add( {x:0,y:0.16*Math.sin(3*t)})
	
	
	
	if(rnd(0,100)<12)
	{ 
		Engine.messagebox.clear()
		Engine.messagebox.print("fps:"+Math.round(1.0/dt))
		Engine.messagebox.print("dt ="+Math.round(dt*1000.0)+"ms" )
		Engine.messagebox.print("press (a) to togle animation")
		Engine.messagebox.print("press (1) or (2) to chose type of animation")
		Engine.messagebox.print("press (t) to hide or show background objects")
		
	}
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
	 
	for(let i=0;i<20;i++)
		trigs.push(new Sprite({pos:{x:rnd(),y:-2},hw:0.3,hh:0.3}))
	Engine.messagebox.print("Press 'a' to stop or resume animation.")
	Engine.messagebox.print("Press 't' to show or hide triangles.")
	Engine.messagebox.print("Press 'Escape' to erase text.")
	
	Engine.resume(animate)
}