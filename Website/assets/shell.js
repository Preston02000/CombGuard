/* CombGuard: settings panel, menu, reveal animations and season effects. Loaded on every page. */
/* ---------- site shell: settings, pages, reveals, season effects ---------- */
(function(){
var root=document.documentElement;root.classList.add('js');
var CG=window.CG={shown:[]};
function $(id){return document.getElementById(id);}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
var osCalm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* settings: season, season effects, reduce motion */
function seasonFor(d){var m=d.getMonth();return m>=2&&m<=4?'spring':m>=5&&m<=7?'summer':m>=8&&m<=10?'fall':'winter';}
var mode=store('cg-season-mode')||'auto';
var fxOn=store('cg-fx')!=='0',calm=store('cg-calm')==null?osCalm:store('cg-calm')==='1';
function applySeason(){var s=mode==='auto'?seasonFor(new Date()):mode;root.setAttribute('data-season',s);
  [].forEach.call(document.querySelectorAll('#season-seg button'),function(b){b.setAttribute('aria-checked',b.dataset.s===mode?'true':'false');});
  var hint=$('auto-hint');if(hint)hint.textContent=mode==='auto'?'Auto follows today’s date. Right now it’s '+s+'.':'Tap Auto to follow today’s date again.';
  document.dispatchEvent(new Event('cg-season'));resetParts();}
function applyMotion(){root.classList.toggle('calm',calm);root.classList.toggle('nofx',!fxOn);var a=$('opt-fx'),b=$('opt-calm');if(a)a.checked=fxOn;if(b)b.checked=calm;}
applyMotion();
[].forEach.call(document.querySelectorAll('#season-seg button'),function(b){b.addEventListener('click',function(){mode=b.dataset.s;store('cg-season-mode',mode);applySeason();});});
$('opt-fx').addEventListener('change',function(){fxOn=this.checked;store('cg-fx',fxOn?'1':'0');applyMotion();});
$('opt-calm').addEventListener('change',function(){calm=this.checked;store('cg-calm',calm?'1':'0');applyMotion();});

/* settings panel and phone menu */
function panel(btn,pn){btn.addEventListener('click',function(e){e.stopPropagation();var open=pn.hidden;closePanels();if(open){pn.hidden=false;btn.setAttribute('aria-expanded','true');}});}
function closePanels(){[['set-btn','settings'],['menu-btn','menu']].forEach(function(p){$(p[1]).hidden=true;$(p[0]).setAttribute('aria-expanded','false');});}
CG.closePanels=closePanels;
panel($('set-btn'),$('settings'));panel($('menu-btn'),$('menu'));
document.addEventListener('click',function(e){if(!e.target.closest('.panel'))closePanels();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closePanels();});

/* pages: each page is its own HTML file; <html data-page="..."> says which one this is */
var PAGE=root.dataset.page||'home';
[].forEach.call(document.querySelectorAll('[data-nav]'),function(a){if(a.dataset.nav===PAGE)a.setAttribute('aria-current','page');});
function jump(id,smooth){var t=id&&document.getElementById(id);if(!t)return false;
  if(t.id==='top')window.scrollTo({top:0,behavior:smooth&&!calm?'smooth':'auto'});else t.scrollIntoView({behavior:smooth&&!calm?'smooth':'auto',block:'start'});return true;}
function route(){CG.shown.forEach(function(f){f(PAGE);});var h=decodeURIComponent(location.hash.slice(1));if(h)setTimeout(function(){jump(h,false);},30);}
CG.route=route;
document.addEventListener('DOMContentLoaded',route);
/* links to a section on this same page scroll there smoothly */
document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(!a)return;closePanels();var href=a.getAttribute('href');
  if(href.charAt(0)!=='#'||href.length<2)return;if(jump(decodeURIComponent(href.slice(1)),true)){e.preventDefault();history.replaceState(null,'',href);}});

/* reveals: fade and rise as things scroll in; headlines arrive word by word */
function splitWords(h){var i=0;[].slice.call(h.childNodes).forEach(function(n){if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return;}var s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=p;f.appendChild(s);});h.replaceChild(f,n);}
  else if(n.nodeType===1){var w=document.createElement('span');w.className='w';w.style.setProperty('--i',i++);h.replaceChild(w,n);w.appendChild(n);}});}
[].forEach.call(document.querySelectorAll('[data-words]'),splitWords);
[].forEach.call(document.querySelectorAll('[data-stagger]'),function(c){[].forEach.call(c.querySelectorAll('[data-rv]'),function(el,i){el.style.setProperty('--d',i);});});
function count(el){var to=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),suf=el.textContent.replace(/[0-9.,]/g,''),t0=null;if(calm||!to){return;}
  function step(ts){if(!t0)t0=ts;var u=Math.min(1,(ts-t0)/1400),v=to*(1-Math.pow(1-u,3));el.textContent=v.toFixed(dec)+suf;if(u<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
function inLivePage(){return true;}
CG.inLivePage=inLivePage;
if('IntersectionObserver' in window){var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting||!inLivePage(e.target))return;e.target.classList.add('in');rio.unobserve(e.target);
    [].forEach.call(e.target.querySelectorAll('[data-count]'),count);if(e.target.dataset.count)count(e.target);});},{rootMargin:'0px 0px -8% 0px',threshold:.12});
  [].forEach.call(document.querySelectorAll('[data-rv],[data-words]'),function(el){rio.observe(el);});
  CG.shown.push(function(){setTimeout(function(){[].forEach.call(document.querySelectorAll('[data-rv]:not(.in),[data-words]:not(.in)'),function(el){rio.unobserve(el);rio.observe(el);});},60);});}
else [].forEach.call(document.querySelectorAll('[data-rv],[data-words]'),function(el){el.classList.add('in');});

/* season effects: one engine, used by the opening scroll and by the rest of the site */
var FX=window.CGFX={
  make:function(s,W,H,dens){var out=[],R=Math.random;function add(k,o){o.k=k;o.ph=R()*6.28;o.rot=R()*6.28;o.vr=(R()-.5)*1.2;o.z=.5+R()*.8;out.push(o);return o;}
    var n=function(v){return Math.max(1,Math.round(v*dens));};
    if(s==='winter'){for(var i=0;i<n(46);i++)add('snow',{x:R()*W,y:R()*H,r:1.2+R()*2.4});}
    else if(s==='fall'){for(var i=0;i<n(22);i++)add('leaf',{x:R()*W,y:R()*H,r:7+R()*5});}
    else if(s==='spring'){for(var i=0;i<n(24);i++)add('petal',{x:R()*W,y:R()*H,r:6+R()*5});for(var i=0;i<n(3);i++)add('fly',{x:R()*W,y:H*(.15+R()*.6),s:.8+R()*.5});for(var i=0;i<n(8);i++)add('mote',{x:R()*W,y:R()*H});}
    else{for(var i=0;i<n(10);i++)add('gust',{x:R()*W-120,y:H*(.06+R()*.86),w:220+R()*200,life:R(),sp:.16+R()*.12});for(var i=0;i<n(10);i++)add('seed',{x:R()*W,y:R()*H});for(var i=0;i<n(5);i++)add('sleaf',{x:R()*W,y:R()*H,r:7+R()*4});}
    return out;},
  draw:function(c,P,dt,t,W,H,col){var R=Math.random;c.strokeStyle=col;c.fillStyle=col;c.lineWidth=1.3;c.lineCap='round';
    for(var i=0;i<P.length;i++){var p=P[i];
      if(p.k==='gust'){p.life+=dt*p.sp;if(p.life>1.25){p.life=0;p.x=R()*W-p.w*.6;p.y=H*(.06+R()*.86);p.w=220+R()*200;}
        var u1=Math.min(1,p.life),u0=Math.max(0,p.life-.4);if(u1<=u0)continue;var a=Math.sin(Math.min(1,p.life/1.25)*Math.PI);
        for(var line=0;line<2;line++){c.globalAlpha=(line?.3:.55)*a;c.lineWidth=line?1.1:1.8;c.beginPath();var first=true;
          for(var k=0;k<=32;k++){var u=u0+(u1-u0)*k/32,x=p.x+u*p.w,y=p.y+line*7+Math.sin(u*5+p.ph+t*.8)*6;if(!line&&u>.58&&u<.82){var q=(u-.58)/.24*6.28;x+=Math.sin(q)*-26;y-=(1-Math.cos(q))*15;}
            if(line&&u>.7)break;first?c.moveTo(x,y):c.lineTo(x,y);first=false;}c.stroke();}
        c.lineWidth=1.3;continue;}
      if(p.k==='seed'){p.x+=(28+p.z*20)*dt;p.y+=Math.sin(t*.9+p.ph)*.35-.08;if(p.x>W+20){p.x=-20;p.y=R()*H;}
        var sw=Math.sin(t*1.3+p.ph)*.25;c.globalAlpha=.55;c.save();c.translate(p.x,p.y);c.rotate(sw);c.beginPath();c.moveTo(0,0);c.lineTo(0,-9);for(var k=0;k<7;k++){var an=-Math.PI*.85+k*Math.PI*.7/6;c.moveTo(0,-9);c.lineTo(Math.cos(an)*7,-9+Math.sin(an)*7);}c.lineWidth=.9;c.stroke();c.beginPath();c.arc(0,0,1.3,0,6.28);c.fill();c.restore();c.lineWidth=1.3;continue;}
      if(p.k==='fly'){p.x+=(18*p.s)*dt;p.y+=Math.sin(t*1.4+p.ph)*.7;if(p.x>W+30){p.x=-30;p.y=H*(.15+R()*.6);}var f=.25+.75*Math.abs(Math.sin(t*9+p.ph)),sz=7*p.s;
        c.globalAlpha=.7;c.save();c.translate(p.x,p.y);c.rotate(Math.sin(t*1.4+p.ph)*.25);c.beginPath();c.ellipse(-sz*.55*f,-sz*.35,sz*.6*f,sz*.45,0,0,6.28);c.ellipse(sz*.55*f,-sz*.35,sz*.6*f,sz*.45,0,0,6.28);c.ellipse(-sz*.4*f,sz*.35,sz*.4*f,sz*.32,0,0,6.28);c.ellipse(sz*.4*f,sz*.35,sz*.4*f,sz*.32,0,0,6.28);c.stroke();c.beginPath();c.moveTo(0,-sz*.6);c.lineTo(0,sz*.7);c.stroke();c.restore();continue;}
      if(p.k==='mote'){p.y-=4*dt;p.x+=Math.sin(t*.6+p.ph)*.2;if(p.y<-10){p.y=H+10;p.x=R()*W;}c.globalAlpha=.35+.25*Math.sin(t*2+p.ph);c.beginPath();c.arc(p.x,p.y,1.3,0,6.28);c.fill();continue;}
      if(p.k==='sleaf'){p.x+=(40+p.z*30)*dt;p.y+=Math.sin(t*1.1+p.ph)*.6+.1;p.rot+=p.vr*dt*2;if(p.x>W+30){p.x=-30;p.y=R()*H;}}
      else{var v=p.k==='snow'?(16+p.z*20):p.k==='petal'?(18+p.z*14):(24+p.z*18);p.y+=v*dt;p.x+=Math.sin(t*.7+p.ph)*(p.k==='snow'?.25:.6)+.15;p.rot+=p.vr*dt;if(p.y>H+20){p.y=-20;p.x=R()*W;}}
      c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.beginPath();
      if(p.k==='snow'){c.globalAlpha=.45+.3*p.z;c.arc(0,0,p.r*p.z,0,6.28);c.fill();}
      else{c.globalAlpha=p.k==='petal'?.65:.6;var r=p.r*(p.k==='petal'?1:1.3);c.moveTo(0,0);c.quadraticCurveTo(r*.45,-r*.42,r,0);c.quadraticCurveTo(r*.45,r*.42,0,0);if(p.k!=='petal'){c.moveTo(-3,0);c.lineTo(r*.85,0);}c.stroke();}
      c.restore();}
    c.globalAlpha=1;}};
var pc=$('pfx'),px=pc.getContext('2d'),parts=[],PW=0,PH=0,col='#000';
function psize(){var d=Math.min(2,window.devicePixelRatio||1);PW=window.innerWidth;PH=window.innerHeight;pc.width=PW*d;pc.height=PH*d;px.setTransform(d,0,0,d,0,0);}
function resetParts(){var s=root.getAttribute('data-season');col=getComputedStyle(root).getPropertyValue('--pt').trim()||'#333';parts=FX.make(s,PW,PH,PW<700?.6:1);}
CG.resetParts=resetParts;
var last=performance.now();
function heroOnScreen(){if(root.dataset.page!=='home')return false;var st=$('stage');if(!st)return false;var r=st.getBoundingClientRect();return r.bottom>PH*.4&&r.top<PH*.6;}
function loop(now){var dt=Math.min(.05,(now-last)/1000),t=now/1000;last=now;px.clearRect(0,0,PW,PH);
  if(!(calm||!fxOn||document.hidden||heroOnScreen()||root.dataset.page==='dashboard'))FX.draw(px,parts,dt,t,PW,PH,col);
  requestAnimationFrame(loop);}
psize();window.addEventListener('resize',function(){psize();resetParts();});applySeason();requestAnimationFrame(loop);
})();
