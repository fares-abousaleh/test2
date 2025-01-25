//--------------------------
// ** hide / show / togle html element

function showElement(e){
  e.style.display = 'block'
}

function hideElement(e){
  e.style.display = 'none'
}

function togleElement(e){
  if( e.style.display != 'none' )
	  e.style.display = 'none'
  else 
	  e.style.display = 'block'
}


//----------------------------------------------
// ** return a random number in [a,b[
//    if b is undefined: return a number in [-a,a[
//    if a and b are undefined: return a number in [-1,1[

function rnd(a,b){
	if(a==undefined){a=-1;b=1}
	else if(b==undefined){b=-a}
	return a+(b-a)*Math.random();
}

function rndInt(a,b){
	return Math.floor(rnd(a,b))
}

function rndDecide(p){
	return (rnd(0,1)<=p)
}

function sat(v,a,b){
	if(v<=a)return a
	if(v>=b)return b
	return v
}

//-- rects has center (x,y) and half dims: w,h 
function intersectRects(A,B){
	let res = (A.x-A.w >= B.x+B.w)||  // B:::A
	          (B.x-B.w >= A.x+A.w)||  // A:::B
			  (A.y-A.h >= B.y+B.h)||  // A / B
	          (B.y-B.h >= A.y+A.h)   // B / A  
    return !res			  
}

function dist(A,B){
	const dx = A.x-B.x
	const dy = A.y-B.y
	return Math.pow(dx*dx+dy*dy,0.5)
}