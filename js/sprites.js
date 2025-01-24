
import {Engine} from "./wglTools.js"

/*-------------------------------------------
	Sprite Class  
  -------------------------------------------*/
export default class Sprite{
	
	//-- conctruct a Sprite copying from another if provided
	constructor(sp={}){
		this.pos = sp.pos  || {x:0,y:0}
		this.txPos = sp.txPos || {x:0,y:0,xx:0.25,yy:0.25}
		this.hw = sp.hw || 0.1 // halfWidth
		this.hh = sp.hh || 0.1 // halfHeight
		this.color = sp.color || [1,1,1,1]
	}
	
	//-- adds this sprite to webGL buffer 
	add(translation,rotation){
		translation = translation || {x:0,y:0}
		rotation = rotation ||0
		const x = this.pos.x+translation.x
		const y = this.pos.y+translation.y
		const hw = this.hw
		const hh = this.hh
		const c  = this.color
		const tx = this.txPos.x
		const ty = this.txPos.y
		const txx = this.txPos.xx
		const tyy = this.txPos.yy
		const cs = Math.cos(rotation)
		const sn = Math.sin(rotation)
		const aa1 = x+hw*cs+hh*sn  
		const bb1 = y-hw*sn+hh*cs  
		const aa2 = x-hw*cs+hh*sn 
		const bb2 = y+hw*sn+hh*cs 
		const aa3 = 2*x-aa1
		const bb3 = 2*y-bb1
		const aa4 = 2*x-aa2
		const bb4 = 2*y-bb2
		// Engine.addVertex( [x+hw,y+hh] ,c, [tx,ty] )
		// Engine.addVertex( [x-hw,y+hh] ,c, [txx,ty] )
		// Engine.addVertex( [x+hw,y-hh] ,c, [tx,tyy] )
		
		// Engine.addVertex( [x+hw,y-hh] ,c, [tx,tyy] )
		// Engine.addVertex( [x-hw,y+hh] ,c, [txx,ty] )
		// Engine.addVertex( [x-hw,y-hh] ,c, [txx,tyy] )
		
		Engine.addVertex( [aa2,bb2] ,c, [tx,ty] )
		Engine.addVertex( [aa1,bb1] ,c, [txx,ty] )
		Engine.addVertex( [aa3,bb3] ,c, [tx,tyy] )
		
		Engine.addVertex( [aa3,bb3] ,c, [tx,tyy] )
		Engine.addVertex( [aa1,bb1] ,c, [txx,ty] )
		Engine.addVertex( [aa4,bb4] ,c, [txx,tyy] )
	}
}