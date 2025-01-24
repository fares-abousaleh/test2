import Engine from "./wglTools.js"
import Sprite from "./sprites.js"

var trianglesOn = true

const sprites = [
	new Sprite({pos:{x:0,y:0},hw:0.1,hh:0.1,color:[1,1,1,1],txPos:{x:0,y:0,xx:0.25,yy:0.25}}),
	new Sprite({pos:{x:0.5,y:0.5},hw:0.1,hh:0.1,color:[1,1,1,1],txPos:{x:0,y:0.25,xx:0.25,yy:0.5}}),
	new Sprite({pos:{x:rnd(),y:rnd()}}),
	new Sprite({pos:{x:rnd(),y:rnd()}}),
	new Sprite({pos:{x:rnd(),y:rnd()}}),
	new Sprite({pos:{x:rnd(),y:rnd()}}),
	new Sprite({pos:{x:rnd(),y:rnd()},txPos:{x:0.25,y:0.25,xx:0.5,yy:0.5}}),
	new Sprite({pos:{x:rnd(),y:rnd()},txPos:{x:0.25,y:0.0,xx:0.5,yy:0.25}}),
	]

const trigs = []
 
document.body.onmousedown = function(){
	Engine.togle()
}

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
                  for(let i in sprites){
					sprites[i].pos.x = rnd()
					sprites[i].pos.y = rnd()
				  }
							
				  break		
		default: 
				  Engine.messagebox.clear()
				  Engine.messagebox.print("Unknown command "+e.key)
	
	}
}

var oldt = 0

function animate(t){
	t*=0.001
	const dt = (t-oldt)
	oldt = t
	
	//--- draw random triangles
	if(trianglesOn)
	for(let i in trigs){
					  trigs[i].add({x:0,y:0},0.1*t*(2+i*1.1))
					  trigs[i].pos.y-= 0.9*dt*(1+0.053*i)
					  if(trigs[i].pos.y<-2){
						  trigs[i].pos.x=rnd()
						  const x = rndInt(0,3)*0.25 
						  const y = rndInt(0,3)*0.25 
						  trigs[i].txPos={x:x,y:y,xx:x+0.25,yy:y+0.25}
						  trigs[i].color=[rnd(0.5,1),rnd(0.5,1),rnd(0.5,1),rnd(0.2,0.51)]
						  trigs[i].pos.y=rnd(1.5,3.5) 
					  }
				}
				  
	for(let i=0;i<10;i++)
		sprites[i%sprites.length].add({x:-0.16+(i%4)*0.16+0.1*Math.sin((i%5+1)*1.0*t),y:-0.14+(i%3)*0.13+0.1*Math.cos((i%7+1)*1.0*t)})
	
	if(rnd(0,100)<12)
	{ 
		Engine.messagebox.clear()
		Engine.messagebox.print("fps:"+Math.round(1.0/dt))
		Engine.messagebox.print("dt ="+Math.round(dt*1000.0)+"ms" )
	}
	Engine.draw()
	
}

function animate1(t){
	t*=0.001
	const dt = (t-oldt)
	oldt = t
	
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
	Engine.start(
		window.screen.width-4,
		window.screen.height-4)
	for(let i=0;i<20;i++)
		trigs.push(new Sprite({pos:{x:rnd(),y:-2},hw:0.3,hh:0.3}))
	Engine.messagebox.print("Press 'a' to stop or resume animation.")
	Engine.messagebox.print("Press 't' to show or hide triangles.")
	Engine.messagebox.print("Press 'Escape' to erase text.")
	
	Engine.resume(animate)
}
