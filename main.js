/* Reveal */
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('show');
  });
},{threshold:.15});
reveals.forEach(r=>observer.observe(r));

/* Aura */
const aura=document.getElementById('aura');
let mx=0,my=0;
window.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
});
(function auraLoop(){
  aura.style.transform=`translate(${mx-140}px,${my-140}px)`;
  requestAnimationFrame(auraLoop);
})();

/* Typing Animation */
const text="Web Developer & BGMI Gamer";
const typing=document.getElementById("typing");
let i=0;
function type(){
  if(i<text.length){
    typing.textContent+=text.charAt(i++);
    setTimeout(type,120);
  }else{
    setTimeout(()=>{
      typing.textContent="";
      i=0;
      type();
    },5000);
  }
}
type();

/* Kill Flash */
document.addEventListener('click',()=>{
  const k=document.getElementById('killFlash');
  k.classList.add('active');
  setTimeout(()=>k.classList.remove('active'),400);
});

/* Parallax */
window.addEventListener('scroll',()=>{
  document.getElementById('bg-image').style.transform=
    `translateY(${scrollY*0.15}px) scale(1.1)`;
});

/* Canvas Fire */
const canvas=document.getElementById('bg-canvas');
const ctx=canvas.getContext('2d');
function resizeCanvas(){
  canvas.width=innerWidth;
  canvas.height=innerHeight;
}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();

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
(function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach((p,i)=>{
    p.update();p.draw();
    if(p.life<=0)particles.splice(i,1);
  });
  requestAnimationFrame(loop);
})();

/* Project Slider */
const slider=document.querySelector('.project-slider');
let index=0;
document.getElementById('next').onclick=()=>{
  index=(index+1)%slider.children.length;
  slider.style.transform=`translateX(-${index*100}%)`;
};
document.getElementById('prev').onclick=()=>{
  index=(index-1+slider.children.length)%slider.children.length;
  slider.style.transform=`translateX(-${index*100}%)`;
};
