/* CombGuard: product page tour, x-ray hotspots and parts viewer. */
(function(){
var reduce=document.documentElement.classList.contains('calm');
/* product page: scroll-driven tour, hero image, x-ray hotspots */
function productPage(){var root=document.documentElement;
  var tr=document.getElementById('tour-track'),steps=[].slice.call(document.querySelectorAll('#tour-steps .ts')),imgs=[].slice.call(document.querySelectorAll('#tour-frame img')),bars=[].slice.call(document.querySelectorAll('.tour-bars b')),tn=document.getElementById('tour-n'),ring=document.getElementById('tour-ring'),cur=-1;
  function cl(v){return v<0?0:v>1?1:v;}
  function tour(){if(root.dataset.page!=='product'||!tr)return;var r=tr.getBoundingClientRect(),span=r.height-innerHeight,p=cl(-r.top/Math.max(1,span)),n=imgs.length,x=p*n,calm=root.classList.contains('calm');
    imgs.forEach(function(im,i){var e=i===0?1:cl((x-i+.32)/.32),u=cl(x-i),out=cl((x-i-1+.32)/.32);
      im.style.clipPath=i===0?'none':'circle('+(e*78).toFixed(2)+'% at 50% 52%)';
      im.style.transform=calm?'none':'scale('+(1.14-.12*e+.05*u-.04*out).toFixed(4)+')';im.style.opacity=i===0?1:(e>0?1:0);im.style.zIndex=i;});
    var a=Math.min(n-1,Math.floor(x+.2));if(a!==cur){cur=a;steps.forEach(function(s,k){s.classList.toggle('on',k===a);s.classList.toggle('past',k<a);});if(tn)tn.textContent='0'+(a+1);}
    bars.forEach(function(bb,k){bb.style.transform='scaleX('+cl(x-k).toFixed(3)+')';});
    var ed=x%1,ringE=x<.68?0:cl((ed-.68)/.32);if(ring){ring.style.opacity=(x>=n-.68?0:ringE*(1-ringE)*4).toFixed(2);ring.style.transform='translate(-50%,-50%) scale('+(.2+ringE*1.6).toFixed(3)+')';}}
  var hi=document.getElementById('p-hero-img');
  function sc(){if(root.dataset.page!=='product'||!hi)return;var r=hi.getBoundingClientRect(),p=cl((innerHeight-r.top)/(innerHeight*.9));hi.style.transform=root.classList.contains('calm')?'none':'scale('+(.86+.14*p).toFixed(4)+')';}
  var tk=0;window.addEventListener('scroll',function(){if(!tk){tk=requestAnimationFrame(function(){tk=0;sc();tour();});}},{passive:true});window.addEventListener('resize',tour);
  CG.shown.push(function(){sc();tour();});
  /* x-ray hotspots */
  var H=[{x:57.8,y:13.4,t:'Solar panel',p:'On a short mast above the case, tilted toward the sun. It tops up the battery every day so there are no cords to run.',c:['Tilting mount','Charges by day'],img:'r-solar',tag:'up close'},
    {x:59.4,y:44.8,t:'The case',p:'Rides on the side of the top box. Inside sits our own main board with an ESP32, a real-time clock, a microSD backup and the battery.',c:['Our own PCB','ESP32','microSD backup'],img:'r-inside',tag:'inside the case'},
    {x:53.9,y:39.5,t:'Outside sensor',p:'Tucked behind the vent on the side of the case, it reads the open-air temperature and humidity so you can compare inside and out.',c:['Temperature','Humidity','Behind the vent'],img:'r-case',tag:'the vent'},
    {x:40,y:31,t:'Under the lid',p:'Lift the lid and the sensor pod sits on the inner cover, right over the hole, reading CO₂, humidity and the colony’s hum.',c:['SCD41 CO₂','SHT45','MEMS mic'],img:'r-podlid',tag:'inside the hive'},
    {x:37,y:56,t:'Between the frames',p:'Inside the top box, a thin steel probe slides down between two brood frames to track the brood nest temperature.',c:['Brood temperature','Near 94°F'],img:'r-probetop',tag:'inside the hive'},
    {x:66.2,y:72,t:'Cables',p:'Clipped along the box and plugged into sealed screw-lock connectors, so rain stays out and parts swap in seconds.',c:['GX12 screw-lock','Weather sealed'],img:'r-ports',tag:'the plugs'},
    {x:49,y:91.5,t:'The scale',p:'The whole hive stands on a low plate with a load cell underneath, so every pound of bees, brood and honey shows up.',c:['Load cell','Up to 220 lb'],img:'r-scaleclose',tag:'under the hive'}];
  var box=document.getElementById('hot-img');if(!box)return;var dots=[],act=-1,auto=true,inView=false,timer=0;
  box.insertAdjacentHTML('beforeend',H.map(function(h,i){return '<button class="hs" type="button" style="left:'+h.x+'%;top:'+h.y+'%" aria-label="'+h.t+'"><span class="dot">'+(i+1)+'</span></button>';}).join(''));
  dots=[].slice.call(box.querySelectorAll('.hs'));
  var spot=document.getElementById('spot'),lens=document.getElementById('lens'),li=document.getElementById('lens-img'),lt=document.getElementById('lens-tag'),ln=document.getElementById('hl-l'),card=document.getElementById('hot-card');
  function place(){if(act<0)return;var h=H[act],W=box.clientWidth,Hh=box.clientHeight,dx=h.x/100*W,dy=h.y/100*Hh,L=lens.offsetWidth,lx=h.x>=50?W*.04:W*.96-L,ly=Math.max(10,Hh*.06);
    lens.style.left=lx+'px';lens.style.top=ly+'px';spot.style.setProperty('--x',dx+'px');spot.style.setProperty('--y',dy+'px');
    var cx=lx+L/2,cy=ly+L/2,ang=Math.atan2(dy-cy,dx-cx);ln.setAttribute('x1',dx);ln.setAttribute('y1',dy);ln.setAttribute('x2',(cx+Math.cos(ang)*L/2).toFixed(1));ln.setAttribute('y2',(cy+Math.sin(ang)*L/2).toFixed(1));}
  function show(i,user){if(user){auto=false;}act=(i+H.length)%H.length;var h=H[act];dots.forEach(function(d,k){d.setAttribute('aria-pressed',k===act?'true':'false');d.classList.toggle('on',k===act);});
    box.classList.add('active');lens.classList.remove('in');void lens.offsetWidth;li.src='assets/img/'+h.img+'.webp';var th=document.getElementById('hc-thumb');if(th){th.src=li.src;th.alt='Concept render: '+h.t;}lt.textContent=h.tag;lens.classList.add('in');
    card.classList.remove('swap');void card.offsetWidth;card.classList.add('swap');
    document.getElementById('hc-n').textContent='0'+(act+1);document.getElementById('hc-h').textContent=h.t;document.getElementById('hc-p').textContent=h.p;
    document.getElementById('hc-chips').innerHTML=h.c.map(function(c){return '<li>'+c+'</li>';}).join('');place();}
  dots.forEach(function(d,i){d.addEventListener('click',function(e){e.stopPropagation();show(i,true);});});
  document.getElementById('hc-prev').addEventListener('click',function(){show(act-1,true);});document.getElementById('hc-next').addEventListener('click',function(){show(act+1,true);});
  window.addEventListener('resize',place);CG.shown.push(function(){setTimeout(place,80);});
  var pre=0;if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[0].isIntersecting;if(!pre&&es[0].isIntersecting){pre=1;H.forEach(function(h){var im=new Image();im.src='assets/img/'+h.img+'.webp';});}},{threshold:.4}).observe(box);
  setInterval(function(){if(auto&&inView&&root.dataset.page==='product'&&!root.classList.contains('calm'))show(act+1,false);},4800);
  show(1,false);}

/* ---------- closer look: pills that open a small panel and swap the render ---------- */
(function(){var pills=[].slice.call(document.querySelectorAll('#pills .pill')),img=document.getElementById('look-img');
  function open(p){pills.forEach(function(q){var on=q===p&&!q.classList.contains('open');q.classList.toggle('open',on);q.querySelector('button').setAttribute('aria-expanded',on?'true':'false');});
    var src=p.classList.contains('open')?p.dataset.img:'assets/img/r-case.webp',alt=p.classList.contains('open')?p.dataset.alt:pills[0].dataset.alt;
    if(img.getAttribute('src')!==src){img.classList.add('fade');setTimeout(function(){img.src=src;img.alt=alt;img.onload=function(){img.classList.remove('fade');};},reduce?0:260);}}
  pills.forEach(function(p){p.querySelector('button').addEventListener('click',function(){open(p);});});})();
productPage();
})();
