import { Engine , Mouse } from "./wglTools.js"
import Sprite from "./sprites.js"

//----------------------------------------------
// Globals
//----------------------------------------------
const SZ = 0.095
const sprites = [new Sprite({txPos:{x:0.5,y:0,xx:0.75,yy:0.25},hw:SZ,hh:SZ})]
const player = sprites[0]
	  player.v={x:0,y:0}
const clouds = []
const missiles = []
const ammos = []
const fires = []
var score_hit = 0
var score_missed = 0
var missile_count = 0

//----------------------------------------------
// create ammo sprite
//----------------------------------------------
function createAmmo(){
	let sp = new Sprite({
		color:[1,1,1,1],
		pos:{x:rnd(),y:rnd(4,6)},
		txPos:{x:0.75,y:0.25,xx:1,yy:0.5},
		hw:0.1,hh:0.1})
	sp.rot=0
	return sp
}

//----------------------------------------------
// create missile sprite
//----------------------------------------------
function createMissile(){
	return new Sprite({
		color:[1,1,1,1],
		pos:{x:0,y:2},
		txPos:{x:0.5,y:0.25,xx:0.75,yy:0.5},
		hw:0.1,hh:0.06})
}
//----------------------------------------------
// create fire sprite
//----------------------------------------------
function createFire(sp){
	const fr = new Sprite({
		color:[1,1,1,1],
		pos:{x:sp.pos.x,y:sp.pos.y},
		txPos:{x:0.75,y:0,xx:1,yy:0.25},
		hw:SZ,hh:SZ})
	fr.rot = rnd(Math.PI)
	return fr
}

//----------------------------------------
// Search for inactive fire sprite 
// and init it at the position 
// of the given sprite
//----------------------------------------
function startFire(sp){
	for(let i in fires)
		if(fires[i].hw>1){
			fires[i]= createFire(sp)
			return
		}
	fires.push( createFire(sp) )		
}

//----------------------------------------------
// creates a new monster sprite 
// or resets an existing one if (sp) is defined
//----------------------------------------------
function createMonster(sp){
	sp = sp || new Sprite({})
	const y = 0.25*rndInt(0,2)
	const w = rnd(0.5*SZ,SZ)
	sp.color=[1,1,1,1]
	sp.pos={x:rnd(),y:rnd()}
	sp.txPos={x:0,y:y,xx:0.25,yy:y+0.25}
	sp.hw=w
	sp.hh=w
	sp.v={x:rnd(0.1),y:rnd(-2,-1)}
	sp.rot=rnd(0.05)
	return sp
}

//----------------------------------------------
// creates a new cloud sprite 
// or resets an existing one if (sp) is defined
//----------------------------------------------
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
//----------------------------------------------
// Event listener for keyboard
//----------------------------------------------
document.body.onkeydown = function(e){
	
	switch(e.key){
		
		case '1': Engine.animation.func = animate1
		          break
		
		case '2': Engine.animation.func = animate
		          break
		
		case 'Escape': 
		          Engine.messagebox.clear()
				  break
					   
		case 'a': Engine.stopSound()
                  Engine.togle()
				  if(Engine.animation.on){
					Engine.playMusic()
				  }
				  else{
					  Engine.stopMusic()
					  Engine.stopSound()
				  }
				  break	
		case 'r': 
				  player.pos.y=-0.9
				  Engine.stopSound()
				  Engine.playMusic()
				  Engine.alertBox.clear()
				  score_hit = 0
			      score_missed = 0
				  break
		case 'm':		
                  missile_launch()				  
				  break		
		default: 
				  Engine.messagebox.clear()
				  Engine.messagebox.print("Unknown command "+e.key)
	
	}
}
//--------------------------------------------
// Search for inactive missile sprite
// and init it at the position of the player. 
//--------------------------------------------
function missile_launch(){
	if(missile_count>0){
					missile_count--
					Engine.playSound('piu') 
					for(let i in missiles)
						if(missiles[i].pos.y>=2){
							missiles[i].pos.x=player.pos.x
							missiles[i].pos.y=player.pos.y
							break
						}
				  }else Engine.playSound('bao')	
}
	
//----------------------------------------
// main loop: animate sprites and render
// interact with inputs
//----------------------------------------
function animate(){
	 const dt  = Engine.dtime()
	 const t   = Engine.time()
	 	
	//--- draw random clouds in background
	for(let i in clouds){
					  clouds[i].add({x:0,y:0}, t*(0.1+i*0.01))
					  clouds[i].pos.y -= dt*(1+0.053*i)
					  if(clouds[i].pos.y<-1-clouds[i].hh){
				        createCloud(clouds[i])		   
					  }
				}
				  
	
	//--- draw ammos
	for(let i in ammos){
		const m = ammos[i]
		m.rot -= rnd(2,3)*dt
		m.pos.y -= 1*dt
		if(m.pos.y<-1.3){
			m.pos.y=rnd(4,6)
			m.pos.x=rnd()
		}else
		if(m.pos.y<1.3){
		m.add(undefined,ammos[i].rot)
		if(dist(m.pos,player.pos)<player.hw)//collect ammo
			{
				missile_count+=10
				Engine.playSound('ammo_collect')
				m.pos.y=rnd(4,9)
				m.pos.x=rnd()	
			}
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
				score_hit+=1
				break 
			}
		}
		
			sp.add(undefined,sp.rot+=i*rnd( 1, 2)*dt)
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
			if(player.pos.y<2)score_missed+=1
		}
	}
	
	if(player.pos.y<2)
	{
		const d = dist(player.pos,Mouse)
		if(d>0.05)
		{
			player.v.x = dt*513*(Mouse.x - player.pos.x)
			player.v.y = dt*513*(Mouse.y - player.pos.y)
			player.pos.x += dt*player.v.x
			player.pos.y += dt*player.v.y
			player.pos.x = sat(player.pos.x ,-1,1)
			player.pos.y = sat(player.pos.y ,-1,1)
		}		
		else
		if(Mouse.state>0) // triger missile		
		{
			Mouse.state=0
			missile_launch()
		}
		//--- collisions with monsters	
		for(let j=1;j<sprites.length;j++){
		   if(dist(player.pos,sprites[j].pos)<0.1){
		      startFire(player)
			  Engine.stopMusic()
			  Engine.playSound('sad')
			  Engine.alertBox.print('Game Over')
			   
			  Engine.alertBox.print('click to resume')
			  player.pos.y=3
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
	
	player.add( {x:0.06*Math.sin(4*t),y:0.06*Math.sin(3*t)})
	
	
	
	if(rnd(0,100)<12)
	{ 
		Engine.messagebox.clear()
		Engine.messagebox.print('score:'+Math.round(score_hit*100.0/(score_hit+score_missed+1.0))+'%')
		Engine.messagebox.print("ammo:"+missile_count)
	    
		Engine.messagebox.print("fps:"+Math.round(1.0/dt))
		Engine.messagebox.print("press (a) to togle animation")
		Engine.messagebox.print("press (m) or (mouse) to fire")
	}
	
	
	if(Engine.animation.on&&player.pos.y<2)Engine.playMusic()
	Engine.draw()
	
}

//----------------------------------------
// alternative main loop for testing purpose.
// Animate sprites and render
// interact with inputs
//----------------------------------------
function animate1(){
	 
	const dt = Engine.dtime()
	const t = Engine.time()
	
	player.hw *=2
	player.hh *=2
	
	player.add(undefined, 8.0*Engine.time() )
	player.pos.x += rnd(0.08) 
	player.pos.y += rnd(0.08)
	
	player.hw *=0.5
	player.hh *=0.5
	if(rnd(0,100)<12)
	{ 
		Engine.messagebox.clear()
		Engine.messagebox.print("fps:"+Math.round(1.0/dt))
		Engine.messagebox.print("dt ="+Math.round(dt*1000.0)+"ms" )
		}
	Engine.draw()
	
}
//-----------------------------------------
// main entry for program
// init sprites and Engine
//-----------------------------------------
document.body.onload = function(){		
	for(let i=0;i<10;i++)
		missiles[i] = createMissile()

	for(let i=1;i<10;i++)
		sprites[i]=createMonster()
	
	for(let i=0;i<10;i++)
		clouds[i] = createCloud()
	
	missile_count = 3
	for(let i=0;i<4;i++)
		ammos[i] = createAmmo()

	Engine.addMusic(['happy','fast'])
	Engine.addSound(['piu','dg','sad','bao','ammo_collect'])
	Engine.resume(animate)
}

document.body.addEventListener("mousedown",() => {
	if(player.pos.y>2){
		document.body.onkeydown({key:'r'})
		return
	}
	 	
} )