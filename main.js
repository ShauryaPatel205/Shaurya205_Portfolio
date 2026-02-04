// Page reveal
window.addEventListener('load',()=>{
  document.body.classList.add('loaded');
});

// Neon aura
const aura=document.getElementById('aura');
window.addEventListener('mousemove',e=>{
  aura.style.left=e.clientX-140+'px';
  aura.style.top=e.clientY-140+'px';
});

// Kill flash
document.addEventListener('click',()=>{
  const k=document.getElementById('killFlash');
  k.classList.add('active');
  setTimeout(()=>k.classList.remove('active'),400);
});

// Parallax
window.addEventListener('scroll',()=>{
  document.getElementById('bg-image').style.transform=
    `translateY(${scrollY*0.15}px) scale(1.1)`;
});

// BGMI fire canvas
const canvas=document.getElementById('bg-canvas');
const ctx=canvas.getContext('2d');
canvas.width=innerWidth;
canvas.height=innerHeight;

let particles=[];
class P{
  constructor(x,y){
    this.x=x;this.y=y;
    this.vx=(Math.random()-.5)*4;
    this.vy=-Math.random()*6;
    this.life=80;
  }
  update(){
    this.x+=this.vx;
    this.y+=this.vy;
    this.vy+=.15;
    this.life--;
  }
  draw(){
    ctx.fillStyle="orange";
    ctx.beginPath();
    ctx.arc(this.x,this.y,4,0,Math.PI*2);
    ctx.fill();
  }
}

window.addEventListener('click',e=>{
  for(let i=0;i<20;i++)
    particles.push(new P(e.clientX,e.clientY));
  if(particles.length>600)particles.splice(0,200);
});

function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach((p,i)=>{
    p.update();p.draw();
    if(p.life<=0)particles.splice(i,1);
  });
  requestAnimationFrame(loop);
}
loop();
