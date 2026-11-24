/* CombGuard: hand-drawn sketches (rough.js) and the interactive parts of the home page.
   Loaded on the home, mission and team pages. */
(function(){
var NS='http://www.w3.org/2000/svg',G=rough.generator(),sd=900;
var reduce=document.documentElement.classList.contains('calm');
function o(x){var b={roughness:1.05,bowing:.8,strokeWidth:1.6,stroke:'S',seed:sd++};for(var k in x)b[k]=x[k];return b;}
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
/* draw a rough.js shape: outlines get .ln, hachure gets .hatch, solid fills get .fillink */
function S(par,name,args,opt,cls){G.toPaths(G[name].apply(G,args.concat([o(opt||{})]))).forEach(function(p){
  if(p.stroke==='S')el('path',{d:p.d,'class':'ln '+(cls||''),'stroke-width':p.strokeWidth||1.6},par);
  else if(p.stroke&&p.stroke!=='none')el('path',{d:p.d,'class':'hatch '+(cls||''),'stroke-width':p.strokeWidth||1},par);
  else if(p.fill&&p.fill!=='none')el('path',{d:p.d,'class':'fillink '+(cls||'')},par);});}
function L(par,d,cls,w){return el('path',{d:d,'class':'ln '+(cls||''),'stroke-width':w||1.5},par);}
function T(par,x,y,t,anchor,cls){var e=el('text',{x:x,y:y,'text-anchor':anchor||'start','class':cls||''},par);e.textContent=t;return e;}
function f1(n){return (+n).toFixed(1);}
function P(pts,open){return 'M'+pts.map(function(p){return f1(p[0])+' '+f1(p[1]);}).join(' L')+(open?'':' Z');}
function occ(g,pts){return el('path',{d:P(pts),'class':'occ'},g);}
function hexPts(cx,cy,r,rot){var a=[];for(var k=0;k<6;k++){var t=k*Math.PI/3+(rot||0);a.push([cx+r*Math.cos(t),cy+r*Math.sin(t)]);}return a;}
function rnd(seed){var s=seed%2147483647;if(s<=0)s+=2147483646;return function(){s=s*16807%2147483647;return (s-1)/2147483646;};}
function grp(par,cls,tr){var a={};if(cls)a['class']=cls;if(tr)a.transform=tr;return el('g',a,par);}
/* arrow with a head at the end of a cubic: M x0 y0 C x1 y1 x2 y2 x3 y3 */
function arr(g,x0,y0,x1,y1,x2,y2,x3,y3,cls){L(g,'M'+x0+' '+y0+' C'+x1+' '+y1+' '+x2+' '+y2+' '+x3+' '+y3,cls,1.4);
  var a=Math.atan2(y3-y2,x3-x2),h=8;L(g,'M'+f1(x3-h*Math.cos(a-.5))+' '+f1(y3-h*Math.sin(a-.5))+' L'+x3+' '+y3+' L'+f1(x3-h*Math.cos(a+.5))+' '+f1(y3-h*Math.sin(a+.5)),cls,1.4);}

/* ---------- building blocks ---------- */
var KX=.55,KY=-.3;
function box(g,x,y,w,h,dep,top,opt,cls){var dx=dep*KX,dy=dep*KY;
  var F=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],Sd=[[x+w,y],[x+w+dx,y+dy],[x+w+dx,y+h+dy],[x+w,y+h]],Tp=[[x,y],[x+dx,y+dy],[x+w+dx,y+dy],[x+w,y]];
  occ(g,F);occ(g,Sd);if(top)occ(g,Tp);
  S(g,'polygon',[F],opt,cls);
  var so={fill:'F',fillStyle:'hachure',hachureGap:7,hachureAngle:62,fillWeight:.8};for(var k in (opt||{}))so[k]=opt[k];S(g,'polygon',[Sd],so,cls);
  if(top)S(g,'polygon',[Tp],opt,cls);
  return {F:F,S:Sd,T:Tp,dx:dx,dy:dy};}
/* a Langstroth hive standing on the ground: stand, scale, bottom board, boxes, lid */
function hive(g,X,Y,w,op){op=op||{};var dep=op.dep||w*1.05,dx=dep*KX,dy=dep*KY,sw=op.sw||1.7,y=Y,c=op.cls||'',R={X:X,w:w,dx:dx,dy:dy,dep:dep},O={strokeWidth:sw};
  if(op.shadow!==false){var s=w*.42;S(g,'polygon',[[[X-s,Y+3],[X+w*.6,Y+3],[X+w*.6+dx,Y+dy+3],[X-s+dx,Y+dy+3]]],{fill:'F',fillStyle:'hachure',hachureGap:4.5,hachureAngle:-28,fillWeight:.7,stroke:'none'},'soft');}
  if(op.stand!==false){var sh=op.sh||w*.15,rh=sh*.38,lw=Math.max(5,w*.045);
    S(g,'rectangle',[X+w-lw-4+dx*.88,Y-sh+rh+dy*.88,lw,sh-rh],O,c);
    box(g,X-3,Y-sh,w+6,rh,dep,false,O,c);
    occ(g,[[X+3,Y-sh+rh],[X+3+lw,Y-sh+rh],[X+3+lw,Y],[X+3,Y]]);S(g,'rectangle',[X+3,Y-sh+rh,lw,sh-rh],O,c);
    occ(g,[[X+w-lw-3,Y-sh+rh],[X+w-3,Y-sh+rh],[X+w-3,Y],[X+w-lw-3,Y]]);S(g,'rectangle',[X+w-lw-3,Y-sh+rh,lw,sh-rh],O,c);
    R.legs=[[X+3+lw/2,Y],[X+w-3-lw/2,Y],[X+w-lw/2-4+dx*.88,Y+dy*.88]];y=Y-sh;}
  if(op.scale!==false){var sc=op.sc||Math.max(6,w*.055);box(g,X-1,y-sc,w+2,sc,dep,false,O,'hl');
    S(g,'rectangle',[X+w*.44,y-sc*.72,w*.12,sc*.44],{fill:'F',fillStyle:'solid',strokeWidth:1},'hl');R.scaleY=y-sc/2;y-=sc;}
  var bb=op.bb||Math.max(7,w*.065);box(g,X,y-bb,w,bb,dep,false,O,c);
  S(g,'rectangle',[X+w*.2,y-bb*.66,w*.6,bb*.46],{fill:'F',fillStyle:'solid',strokeWidth:1,roughness:.5},c);R.ent=[X+w*.5,y-bb*.43];
  var lb=[[X+w*.14,y],[X+w*.86,y],[X+w*.86-dx*.08,y-dy*.08],[X+w*.14-dx*.08,y-dy*.08]];occ(g,lb);S(g,'polygon',[lb],{strokeWidth:sw*.85},c);y-=bb;
  var n=op.boxes||2,bh=op.bh||w*.45;R.box=[];
  for(var i=0;i<n;i++){box(g,X,y-bh,w,bh,dep,false,O,c);
    S(g,'arc',[X+w/2,y-bh*.5,w*.26,bh*.2,Math.PI,Math.PI*2,false],{strokeWidth:sw*.8},c);L(g,'M'+f1(X+w*.38)+' '+f1(y-bh*.5)+' h'+f1(w*.24),c,sw*.8);
    S(g,'ellipse',[X+w+dx*.5,y-bh*.5+dy*.5,w*.11,bh*.1],{strokeWidth:sw*.7,roughness:.6},c);
    if(op.grain!==false&&w>60){L(g,'M'+f1(X+w*.07)+' '+f1(y-bh*.2)+' q'+f1(w*.15)+' -3 '+f1(w*.3)+' 0','faint '+c,1);L(g,'M'+f1(X+w*.6)+' '+f1(y-bh*.82)+' q'+f1(w*.12)+' 2 '+f1(w*.3)+' 0','faint '+c,1);}
    R.box.push([y-bh,y]);y-=bh;}
  R.lidY=y;
  if(op.lid!==false){var lh=op.lh||w*.085,ov=w*.03;R.lid=box(g,X-ov,y-lh,w+ov*2,lh,dep+ov*1.6,true,{strokeWidth:sw*1.05},c);R.lidX=X-ov;R.lidW=w+ov*2;R.lidH=lh;R.top=y-lh;
    if(op.snow!==false){var t=R.lid.T,d='M'+f1(t[0][0]-1)+' '+f1(t[0][1]+1)+' L'+f1(t[1][0])+' '+f1(t[1][1]-3)+' L'+f1(t[2][0]+2)+' '+f1(t[2][1]-3)+' L'+f1(t[3][0]+2)+' '+f1(t[3][1]+1);
      var k=6,xs=t[3][0]+2,xe=t[0][0]-1;for(var j=1;j<=k;j++){var xx=xs+(xe-xs)*j/k;d+=' Q'+f1(xx-(xe-xs)/k/2)+' '+f1(t[3][1]+(j%2?7:3))+' '+f1(xx)+' '+f1(t[3][1]+1);}
      el('path',{d:d+' Z','class':'snow ss-winter'},g);}}
  R.side=function(u,yy){return [X+w+dx*u,yy+dy*u];};
  return R;}
/* the CombGuard case on the side of a hive, with its plugs and a cable down to the scale */
function caseOn(g,R,u0,u1,y0,y1,op){op=op||{};var t=op.t||Math.max(5,R.w*.04),c=[R.side(u0,y0),R.side(u1,y0),R.side(u1,y1),R.side(u0,y1)],c2=c.map(function(p){return [p[0]+t,p[1]];});
  if(op.cable!==false&&R.scaleY){var a=c2[3],b=R.side(u0+.06,R.scaleY);L(g,'M'+f1(a[0]+(c2[2][0]-a[0])*.25)+' '+f1(a[1]+(c2[2][1]-a[1])*.25)+' C'+f1(a[0]+6)+' '+f1(a[1]+30)+' '+f1(b[0]+10)+' '+f1(b[1]-20)+' '+f1(b[0]+2)+' '+f1(b[1]),'hl',1.5);}
  occ(g,[c[0],c2[0],c2[1],c[1]]);S(g,'polygon',[[c[0],c2[0],c2[1],c[1]]],{strokeWidth:1.3},'hl');
  occ(g,[c[0],c2[0],c2[3],c[3]]);S(g,'polygon',[[c[0],c2[0],c2[3],c[3]]],{strokeWidth:1.3},'hl');
  occ(g,c2);S(g,'polygon',[c2],{strokeWidth:2},'hl');
  var cx=(c2[0][0]+c2[2][0])/2,cy=(c2[0][1]+c2[2][1])/2,r=Math.min(c2[1][0]-c2[0][0],c2[3][1]-c2[0][1])*.24;
  var hx=hexPts(0,0,r,Math.PI/6).map(function(p){return [cx+p[0]*.8,cy+p[1]+p[0]*KY*.9];});
  if(op.glow){el('circle',{cx:f1(cx),cy:f1(cy),r:f1(r*2.4),fill:'var(--honey)','class':'glow',opacity:.22},g);el('path',{d:P(hx),fill:'var(--honey)','class':'glow'},g);}
  S(g,'polygon',[hx],{strokeWidth:1.8,roughness:.5},'hl');el('circle',{cx:f1(cx),cy:f1(cy),r:f1(Math.max(1.6,r*.22)),'class':'dot'},g);
  for(var k=0;k<4;k++){var f=.18+k*.21,px=c2[3][0]+(c2[2][0]-c2[3][0])*f,py=c2[3][1]+(c2[2][1]-c2[3][1])*f;S(g,'rectangle',[px-2.5,py,5,Math.max(4,t*.9)],{strokeWidth:1,roughness:.4},'hl');}
  return {top:[(c2[0][0]+c2[1][0])/2,(c2[0][1]+c2[1][1])/2],c:c2,cx:cx,cy:cy};}
function panel(par,q,lines,cls){occ(par,q);S(par,'polygon',[q],{fill:'F',fillStyle:'hachure',hachureGap:5,hachureAngle:24,strokeWidth:1.8},cls||'');
  for(var k=1;k<lines;k++)L(par,'M'+f1(q[0][0]+(q[1][0]-q[0][0])*k/lines)+' '+f1(q[0][1]+(q[1][1]-q[0][1])*k/lines)+' L'+f1(q[3][0]+(q[2][0]-q[3][0])*k/lines)+' '+f1(q[3][1]+(q[2][1]-q[3][1])*k/lines),'soft',1);
  L(par,'M'+f1((q[0][0]+q[3][0])/2)+' '+f1((q[0][1]+q[3][1])/2)+' L'+f1((q[1][0]+q[2][0])/2)+' '+f1((q[1][1]+q[2][1])/2),'soft',1);}
/* solar panel on a short mast from the top of the case */
function mastPanel(g,top,h,pw){var x=top[0],y=top[1]-h;S(g,'line',[x,top[1],x,y],{strokeWidth:2.2},'hl');S(g,'circle',[x,y,7],{strokeWidth:1.4},'hl');
  var q=[[x-pw*.58,y+pw*.1],[x+pw*.22,y-pw*.3],[x+pw*.58,y-pw*.08],[x-pw*.22,y+pw*.32]];panel(g,q,4,'hl');return q;}
function tuft(g,x,y,s,cls){s=s||1;var d='';for(var k=-2;k<=2;k++){var h=(7+(((k+7)*37)%6))*s;d+='M'+f1(x+k*2.4*s)+' '+f1(y)+' q'+f1(k*1.2*s)+' '+f1(-h*.55)+' '+f1(k*3.2*s)+' '+f1(-h)+' ';}L(g,d,cls||'',1.1);}
function daisy(g,x,y,h,r,lean){var q=grp(g,'no-winter');lean=lean||0;var tx=x+lean,ty=y-h;L(q,'M'+x+' '+y+' Q'+f1(x+lean*.2)+' '+f1(y-h*.5)+' '+f1(tx)+' '+f1(ty),'',1.2);
  L(q,'M'+f1(x+lean*.1)+' '+f1(y-h*.3)+' q8 -7 13 -3 q-6 7 -13 3','',1);
  for(var k=0;k<9;k++){var a=k*40,ca=Math.cos(a*Math.PI/180),sa=Math.sin(a*Math.PI/180),px=tx+ca*r*.62,py=ty+sa*r*.62;el('ellipse',{cx:f1(px),cy:f1(py),rx:f1(r*.5),ry:f1(r*.2),transform:'rotate('+a+' '+f1(px)+' '+f1(py)+')','class':'petal'},q);}
  el('circle',{cx:f1(tx),cy:f1(ty),r:f1(r*.3),'class':'dot'},q);}
function lav(g,x,y,h){var q=grp(g,'no-winter');L(q,'M'+x+' '+y+' q2 '+f1(-h*.5)+' 4 '+f1(-h),'',1.1);for(var k=0;k<7;k++){var yy=y-h+k*5,xx=x+4-k*.3+(k%2?3:-3);el('ellipse',{cx:f1(xx),cy:f1(yy),rx:2.6,ry:4,'class':'bud'},q);}}
function oak(g,x,b,h){var tw=h*.065;
  L(g,'M'+f1(x-tw)+' '+b+' q'+f1(-tw*.6)+' 2 '+f1(-tw*1.8)+' 6 M'+f1(x+tw)+' '+b+' q'+f1(tw*.6)+' 2 '+f1(tw*1.9)+' 5 M'+f1(x-tw*.2)+' '+b+' q-2 4 -6 9 M'+f1(x+tw*.4)+' '+b+' q3 3 4 8','',1.4);
  S(g,'path',['M'+f1(x-tw)+' '+b+' C'+f1(x-tw*.7)+' '+f1(b-h*.25)+' '+f1(x-tw*.5)+' '+f1(b-h*.42)+' '+f1(x-tw*1.8)+' '+f1(b-h*.6)],{strokeWidth:1.8});
  S(g,'path',['M'+f1(x+tw)+' '+b+' C'+f1(x+tw*.7)+' '+f1(b-h*.25)+' '+f1(x+tw*.6)+' '+f1(b-h*.45)+' '+f1(x+tw*2)+' '+f1(b-h*.58)],{strokeWidth:1.8});
  for(var k=0;k<5;k++)L(g,'M'+f1(x-tw*.5+k*tw*.25)+' '+f1(b-8-k*9)+' v'+f1(-14-k*2),'soft',1);
  [[-.34,-.62],[-.22,-.86],[.02,-.95],[.24,-.84],[.36,-.6],[-.12,-.72],[.14,-.7]].forEach(function(p,i){L(g,'M'+f1(x+(i%2?tw:-tw)*.6)+' '+f1(b-h*.5)+' Q'+f1(x+p[0]*h*.5)+' '+f1(b+p[1]*h*.75)+' '+f1(x+p[0]*h)+' '+f1(b+p[1]*h),'',1.2);});
  var cg=grp(g,'no-winter');
  [[-.02,-.9,.17],[-.22,-.8,.16],[.2,-.8,.16],[-.3,-.6,.15],[.3,-.6,.15],[-.1,-.66,.17],[.12,-.64,.16]].forEach(function(c){var cx=x+c[0]*h,cy=b+c[1]*h,r=c[2]*h;
    el('ellipse',{cx:f1(cx),cy:f1(cy),rx:f1(r*1.12),ry:f1(r*.92),'class':'occ'},cg);S(cg,'ellipse',[cx,cy,r*2.24,r*1.84],{fill:'F',fillStyle:'hachure',hachureGap:7,hachureAngle:40,fillWeight:.7,strokeWidth:1.5},'leafy');});
  var bl=grp(g,'ss-spring'),rr=rnd(Math.round(x*7+h));for(var k=0;k<34;k++){var a=rr()*Math.PI*2,d=rr()*h*.34;el('circle',{cx:f1(x+Math.cos(a)*d*1.2),cy:f1(b-h*.74+Math.sin(a)*d*.75),r:f1(2+rr()*1.6),'class':'pkdot'},bl);}}
function pine(g,x,b,h,cls){cls=cls||'';S(g,'rectangle',[x-h*.025,b-h*.13,h*.05,h*.13],{strokeWidth:1.3},cls);
  for(var i=0;i<4;i++){var bt=b-h*.1-i*h*.19,tp=bt-h*.36,hw=h*.3*(1-i*.2),pts=[[x,tp],[x-hw,bt],[x-hw*.4,bt-3],[x,bt+2],[x+hw*.45,bt-3],[x+hw,bt]];
    occ(g,pts);S(g,'polygon',[pts],{fill:'F',fillStyle:'hachure',hachureGap:6,hachureAngle:58,fillWeight:.7,strokeWidth:1.4},cls);
    el('path',{d:P([[x,tp-1],[x-hw*.42,tp+(bt-tp)*.42],[x-hw*.16,tp+(bt-tp)*.36],[x,tp+(bt-tp)*.44],[x+hw*.2,tp+(bt-tp)*.36],[x+hw*.42,tp+(bt-tp)*.42]]),'class':'snow ss-winter'},g);}}
function sun(par,x,y,r,cls){cls=cls||'hl';S(par,'circle',[x,y,r*2],{strokeWidth:2},cls);for(var k=0;k<10;k++){var a=k/10*Math.PI*2;S(par,'line',[x+Math.cos(a)*(r+7),y+Math.sin(a)*(r+7),x+Math.cos(a)*(r+18),y+Math.sin(a)*(r+18)],{strokeWidth:1.5},cls);}}
function cloud(g,x,y,s,cls){var d='M'+f1(x-40*s)+' '+f1(y)+' q'+f1(-6*s)+' '+f1(-18*s)+' '+f1(14*s)+' '+f1(-20*s)+' q'+f1(6*s)+' '+f1(-18*s)+' '+f1(28*s)+' '+f1(-12*s)+' q'+f1(16*s)+' '+f1(-12*s)+' '+f1(30*s)+' '+f1(4*s)+' q'+f1(20*s)+' 0 '+f1(18*s)+' '+f1(28*s)+' Z';
  el('path',{d:d,'class':'occ'},g);S(g,'path',[d],{strokeWidth:1.5},cls||'');}
function birds(g,pts){pts.forEach(function(p){L(g,'M'+p[0]+' '+p[1]+' q5 -6 10 0 q5 -6 10 0','soft',1.3);});}
function beeS(g,x,y,s,rot){var b=grp(g,'',('translate('+f1(x)+' '+f1(y)+') rotate('+f1(rot||0)+') scale('+(s||1)+')'));
  el('ellipse',{cx:-3,cy:-6.5,rx:6,ry:3.8,'class':'wing',transform:'rotate(-18 -3 -6.5)'},b);el('ellipse',{cx:3,cy:-6.8,rx:5,ry:3.3,'class':'wing',transform:'rotate(14 3 -6.8)'},b);
  el('ellipse',{cx:0,cy:0,rx:8,ry:5,'class':'bbody'},b);el('path',{d:'M-2.5 -4.6 v9.2 M1.8 -4.8 v9.6','class':'ln','stroke-width':2.1},b);
  el('circle',{cx:8.8,cy:-.6,r:3.2,'class':'bhead'},b);el('path',{d:'M10.4 -3.2 q2 -4 5 -4.4 M9 -3.4 q.6 -4.6 3 -6','class':'ln','stroke-width':.8},b);el('path',{d:'M-8 .4 l-3.2 .4','class':'ln','stroke-width':1},b);return b;}
function pollenBee(g,x,y,s,rot){var b=beeS(g,x,y,s,rot);el('circle',{cx:1,cy:5.6,r:2.4,fill:'var(--honey)',stroke:'var(--line)','stroke-width':.6},b);return b;}
function smoker(g,x,y){S(g,'ellipse',[x+14,y+2,70,10],{fill:'F',fillStyle:'hachure',hachureGap:4,stroke:'none'},'soft');
  var bw=34,bh=50;occ(g,[[x-26,y-bh*.88],[x-4,y-bh*.9],[x-4,y-4],[x-28,y-8]]);S(g,'polygon',[[[x-4,y-bh*.86],[x-24,y-bh*.74],[x-28,y-bh*.16],[x-4,y-bh*.1]]],{fill:'F',fillStyle:'hachure',hachureGap:4,hachureAngle:90,strokeWidth:1.4});
  for(var k=1;k<4;k++)L(g,'M'+f1(x-4-k*6)+' '+f1(y-bh*.86+k*3)+' L'+f1(x-4-k*6.6)+' '+f1(y-bh*.12-k*1),'soft',1);
  occ(g,[[x,y-bh],[x+bw,y-bh],[x+bw,y],[x,y]]);S(g,'rectangle',[x,y-bh,bw,bh],{strokeWidth:1.7});L(g,'M'+x+' '+(y-8)+' h'+bw+' M'+x+' '+(y-bh+8)+' h'+bw,'soft',1.1);
  S(g,'rectangle',[x+8,y-bh*.62,bw-16,bh*.34],{fill:'F',fillStyle:'cross-hatch',hachureGap:4,strokeWidth:1,roughness:.5},'soft');
  var lid=[[x-2,y-bh],[x+bw+2,y-bh],[x+bw-4,y-bh-10],[x+bw*.68,y-bh-16],[x+bw*.4,y-bh-16],[x+4,y-bh-10]];occ(g,lid);S(g,'polygon',[lid],{strokeWidth:1.6});
  L(g,'M'+f1(x+bw*.42)+' '+f1(y-bh-16)+' q-2 -10 -10 -14 M'+f1(x+bw*.66)+' '+f1(y-bh-16)+' q-2 -14 -14 -20 M'+f1(x+bw*.42-10)+' '+f1(y-bh-30)+' l4 -6','',1.5);
  for(var k=0;k<3;k++)L(g,'M'+f1(x+bw*.3-k*3)+' '+f1(y-bh-36-k*12)+' q-7 -6 0 -12 q7 -6 0 -12','soft smoke',1.3);}
function jar(g,x,y){var d='M'+x+' '+(y-6)+' Q'+x+' '+y+' '+(x+6)+' '+y+' H'+(x+38)+' Q'+(x+44)+' '+y+' '+(x+44)+' '+(y-6)+' V'+(y-40)+' Q'+(x+44)+' '+(y-46)+' '+(x+38)+' '+(y-48)+' H'+(x+6)+' Q'+x+' '+(y-46)+' '+x+' '+(y-40)+' Z';
  L(g,'M'+(x+30)+' '+(y-50)+' L'+(x+48)+' '+(y-92),'',2.2);S(g,'ellipse',[x+49,y-94,9,6],{strokeWidth:1.4});
  el('path',{d:d,'class':'occ'},g);S(g,'path',[d],{strokeWidth:1.7});S(g,'rectangle',[x+3,y-34,38,30],{fill:'F',fillStyle:'hachure',hachureGap:3.2,hachureAngle:-40,stroke:'none'},'hl');
  occ(g,[[x+1,y-57],[x+43,y-57],[x+43,y-48],[x+1,y-48]]);S(g,'rectangle',[x+1,y-57,42,9],{fill:'F',fillStyle:'hachure',hachureGap:3,strokeWidth:1.4});
  occ(g,[[x+9,y-34],[x+35,y-34],[x+35,y-15],[x+9,y-15]]);S(g,'rectangle',[x+9,y-34,26,19],{strokeWidth:1.2});S(g,'polygon',[hexPts(x+22,y-24.5,5.5,Math.PI/6)],{strokeWidth:1.3,roughness:.3},'hl');}
function hiveTool(g,x,y){var q=[[x,y],[x+50,y-7],[x+52,y-3],[x+2,y+4]];occ(g,q);S(g,'polygon',[q],{strokeWidth:1.4},'pk');L(g,'M'+(x+50)+' '+(y-7)+' q8 -1 8 -8','pk',1.4);}
function ground(g,x0,y,x1,n,seed){S(g,'linearPath',[[[x0,y],[(x0+x1)/2,y-2],[x1,y+1]]],{strokeWidth:1.4});var r=rnd(seed||7);for(var k=0;k<(n||10);k++)tuft(g,x0+r()*(x1-x0),y+1,.7+r()*.4);}
function leaves(g,x0,y0,x1,y1,n,seed){var q=grp(g,'ss-fall'),r=rnd(seed||11);for(var k=0;k<n;k++){var x=x0+r()*(x1-x0),y=y0+r()*(y1-y0),a=r()*180;el('path',{d:'M-6 0 Q0 -5 6 0 Q0 5 -6 0 Z M-6 0 h12',transform:'translate('+f1(x)+' '+f1(y)+') rotate('+f1(a)+')','class':'ln pk','stroke-width':1.1},q);}}
function drifts(g,pts){var q=grp(g,'ss-winter');pts.forEach(function(p){el('path',{d:'M'+(p[0]-p[2])+' '+p[1]+' Q'+(p[0]-p[2]*.4)+' '+(p[1]-p[2]*.28)+' '+p[0]+' '+(p[1]-p[2]*.18)+' Q'+(p[0]+p[2]*.5)+' '+(p[1]-p[2]*.3)+' '+(p[0]+p[2])+' '+p[1]+' Z','class':'snow'},q);});}
function butterfly(g,x,y,s){var q=grp(g,'ss-summer','translate('+x+' '+y+') scale('+s+')');el('path',{d:'M0 0 C-10 -14 -20 -6 -12 2 C-18 8 -8 14 0 4 C8 14 18 8 12 2 C20 -6 10 -14 0 0 Z','class':'ln pk','stroke-width':1.2},q);L(q,'M0 -2 v8 M0 -2 q-3 -6 -6 -7 M0 -2 q3 -6 6 -7','',1);}
function phone(g,x,y,w,h){var d='M'+(x+14)+' '+y+' H'+(x+w-14)+' Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+14)+' V'+(y+h-14)+' Q'+(x+w)+' '+(y+h)+' '+(x+w-14)+' '+(y+h)+' H'+(x+14)+' Q'+x+' '+(y+h)+' '+x+' '+(y+h-14)+' V'+(y+14)+' Q'+x+' '+y+' '+(x+14)+' '+y+' Z';
  el('path',{d:d,'class':'occ'},g);S(g,'path',[d],{strokeWidth:2});S(g,'rectangle',[x+7,y+18,w-14,h-34],{strokeWidth:1},'soft');L(g,'M'+(x+w/2-10)+' '+(y+9)+' h20','',2.2);}
function note(g,x,y,t,ax,ay,anchor,cls){T(g,x,y,t,anchor||'start',cls||'sm');var sx=anchor==='end'?x+6:(anchor==='middle'?x:x-6),sy=y-5;if(ax!=null)arr(g,sx,sy,sx+(ax-sx)*.3,sy+(ay-sy)*.05-10,ax-(ax-sx)*.2,ay-(ay-sy)*.4,ax,ay,'soft');}
function rbox(g,x,y,w,h,r,opt,cls){var d='M'+(x+r)+' '+y+' H'+(x+w-r)+' Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+r)+' V'+(y+h-r)+' Q'+(x+w)+' '+(y+h)+' '+(x+w-r)+' '+(y+h)+' H'+(x+r)+' Q'+x+' '+(y+h)+' '+x+' '+(y+h-r)+' V'+(y+r)+' Q'+x+' '+y+' '+(x+r)+' '+y+' Z';el('path',{d:d,'class':'occ'},g);S(g,'path',[d],opt||{},cls);return d;}

/* ---------- bees that fly along dotted trails (only while their drawing is on screen) ---------- */
var flyers=[];
function trail(g,d){return el('path',{d:d,'class':'trail'},g);}
function fly(svg,path,n,spd,back){var Lh=path.getTotalLength();for(var i=0;i<n;i++){var w=grp(svg,'flyer'),b=beeS(w,0,0,1,0);flyers.push({svg:svg,path:path,L:Lh,g:w,off:i/n+Math.random()*.1,spd:spd||38,back:!!back});}}

/* ---------- section drawings ---------- */
var ART={
 weight:function(g,svg){ground(g,0,292,400,12,3);
   var R=hive(g,34,282,124,{bh:52,sh:15});
   S(g,'linearPath',[[[252,34],[252,120],[392,120]]],{strokeWidth:1.3});
   [14,20,24,22,34,46,62].forEach(function(h,i){S(g,'rectangle',[260+i*18,120-h,11,h],{fill:'F',fillStyle:'hachure',hachureGap:3,fillWeight:.9,strokeWidth:1.1,roughness:.5},'hl');T(g,265.5+i*18,136,'MTWTFSS'[i],'middle','xs');});
   T(g,252,24,'this week','start','sm');
   T(g,262,196,'+3 lb','start','lg hlt');T(g,264,216,'since this morning','start','xs');
   arr(g,258,210,244,226,232,244,224,256,'hl');
   var t1=trail(g,'M14 40 C-6 150 24 268 '+f1(R.ent[0])+' '+f1(R.ent[1]+2)),t2=trail(g,'M392 290 C330 310 240 300 '+f1(R.ent[0]+8)+' '+f1(R.ent[1]+4));
   pollenBee(g,30,120,1.05,70);pollenBee(g,300,302,1,190);fly(svg,t1,1,26);fly(svg,t2,1,30);},
 warmth:function(g){S(g,'rectangle',[86,40,262,222],{strokeWidth:1.2},'faint');
   var tb=[[36,38],[356,38],[356,50],[36,50]];occ(g,tb);S(g,'polygon',[tb],{strokeWidth:1.8});
   occ(g,[[56,50],[66,50],[66,268],[56,268]]);S(g,'rectangle',[56,50,10,218],{strokeWidth:1.6});occ(g,[[326,50],[336,50],[336,268],[326,268]]);S(g,'rectangle',[326,50,10,218],{strokeWidth:1.6});
   S(g,'rectangle',[56,262,280,8],{strokeWidth:1.6});
   var r=9.4,hw=r*Math.sqrt(3),rr=rnd(5);
   for(var row=0;row<15;row++)for(var col=0;col<17;col++){var x=72+col*hw+(row%2?hw/2:0),y=60+row*r*1.5;if(x>322||y>258)continue;
     var ex=(x-196)/92,ey=(y-166)/66,e=ex*ex+ey*ey,pts=hexPts(x,y,r-.6,Math.PI/6);
     var honey=(y<104&&(x<128||x>264))||(y<84);
     if(honey)S(g,'polygon',[pts],{fill:'F',fillStyle:'hachure',hachureGap:3,hachureAngle:-30,strokeWidth:.9,roughness:.4},'hl');
     else if(e<.72)S(g,'polygon',[pts],{fill:'F',fillStyle:'cross-hatch',hachureGap:3.4,strokeWidth:.9,roughness:.4});
     else{S(g,'polygon',[pts],{strokeWidth:.8,roughness:.4},'soft');if(e<1.05)L(g,'M'+f1(x-2.5)+' '+f1(y+1)+' a3 3 0 1 1 4 2.4','',1);else if(rr()<.22)el('circle',{cx:f1(x),cy:f1(y),r:2.6,'class':'pkdot'},g);}}
   [[150,140,1.1,-20],[232,198,1.1,160],[108,212,1,30],[272,128,1,200],[190,232,1,-70],[262,236,.95,110]].forEach(function(b){beeS(g,b[0],b[1],b[2],b[3]);});
   S(g,'line',[374,10,374,232],{strokeWidth:3.2},'hl');S(g,'circle',[374,236,10],{fill:'F',fillStyle:'solid',strokeWidth:1},'hl');L(g,'M374 10 q0 -8 12 -8 q12 0 12 12','hl',1.5);
   T(g,368,290,'the probe','end','sm');arr(g,370,276,378,268,376,256,375,246,'soft');
   T(g,20,300,'honey','start','sm');arr(g,40,284,38,250,48,120,70,96,'soft');
   T(g,196,304,'94°F','middle','lg hlt');
   [[-44,0],[0,-6],[44,0]].forEach(function(o2){S(g,'curve',[[[196+o2[0],278+o2[1]],[188+o2[0],270],[204+o2[0],262],[196+o2[0],254]]],{strokeWidth:1.3},'hl');});},
 air:function(g){var lid=[[22,86],[378,86],[378,108],[22,108]];occ(g,lid);S(g,'polygon',[lid],{fill:'F',fillStyle:'hachure',hachureGap:6,hachureAngle:20,fillWeight:.7,strokeWidth:1.8});T(g,200,80,'lid','middle','xs');
   S(g,'rectangle',[40,150,320,172],{strokeWidth:1.8});
   S(g,'rectangle',[40,150,12,172],{fill:'F',fillStyle:'hachure',hachureGap:4,strokeWidth:1.2});S(g,'rectangle',[348,150,12,172],{fill:'F',fillStyle:'hachure',hachureGap:4,strokeWidth:1.2});
   S(g,'rectangle',[30,138,154,10],{fill:'F',fillStyle:'hachure',hachureGap:5,strokeWidth:1.5});S(g,'rectangle',[216,138,154,10],{fill:'F',fillStyle:'hachure',hachureGap:5,strokeWidth:1.5});
   for(var k=0;k<8;k++){var x=66+k*38;S(g,'rectangle',[x,160,24,7],{strokeWidth:1.2});L(g,'M'+(x+12)+' 167 V318','soft',1);}
   [[100,230,.9,10],[180,262,.9,-40],[256,214,.9,200],[310,276,.85,120]].forEach(function(b){beeS(g,b[0],b[1],b[2],b[3]);});
   L(g,'M160 140 v-4 M240 140 v-4','hl',1.6);S(g,'rectangle',[160,118,80,20],{strokeWidth:2},'hl');S(g,'ellipse',[200,118,80,14],{strokeWidth:2},'hl');el('path',{d:'M162 118 a38 7 0 0 0 76 0 a38 7 0 0 0 -76 0','class':'occ'},g);S(g,'ellipse',[200,118,80,14],{strokeWidth:2},'hl');
   S(g,'polygon',[hexPts(200,118,4,Math.PI/6)],{strokeWidth:1.3,roughness:.3},'hl');L(g,'M186 146 h28','hl hid',1.4);
   L(g,'M240 128 C280 126 300 120 330 120 S 380 128 396 116','hl',1.5);T(g,392,134,'to the case','end','xs');
   [[186,206],[200,196],[214,208]].forEach(function(p,i){S(g,'curve',[[[p[0],p[1]],[p[0]-6,p[1]-12],[p[0]+6,p[1]-24],[p[0],p[1]-40]]],{strokeWidth:1.3},'hl soft');});
   function mol(x,y){S(g,'circle',[x,y,12],{strokeWidth:1.4});S(g,'circle',[x-20,y,10],{strokeWidth:1.3});S(g,'circle',[x+20,y,10],{strokeWidth:1.3});L(g,'M'+(x-15)+' '+(y-2)+' h4 M'+(x-15)+' '+(y+2)+' h4 M'+(x+11)+' '+(y-2)+' h4 M'+(x+11)+' '+(y+2)+' h4','',1);}
   mol(70,36);mol(124,58);T(g,40,72,'CO₂','start','sm');
   function drop(x,y,s){S(g,'path',['M'+x+' '+y+' q'+(-9*s)+' '+(13*s)+' 0 '+(18*s)+' q'+(9*s)+' '+(-5*s)+' 0 '+(-18*s)+' Z'],{strokeWidth:1.4},'ac');}
   drop(300,22,1.1);drop(326,40,.9);drop(352,20,1);T(g,372,72,'humidity','end','sm');
   T(g,200,300,'pod sits over the hole','middle','xs');},
 sound:function(g,svg){var B=box(g,30,96,200,120,90,false,{strokeWidth:1.8});
   S(g,'arc',[130,146,60,22,Math.PI,Math.PI*2,false],{strokeWidth:1.3});L(g,'M100 146 h60','',1.3);
   box(g,30,216,200,18,90,false,{strokeWidth:1.8});S(g,'rectangle',[62,221,136,9],{fill:'F',fillStyle:'solid',strokeWidth:1,roughness:.4});
   var lb=[[42,234],[218,234],[206,252],[30,252]];occ(g,lb);S(g,'polygon',[lb],{strokeWidth:1.6});
   [[78,244,.85,0],[124,246,.85,190],[180,243,.85,-10]].forEach(function(b){beeS(g,b[0],b[1],b[2],b[3]);});
   for(var k=1;k<=3;k++){S(g,'arc',[292,196,k*34,k*42,-Math.PI*.34,Math.PI*.34,false],{strokeWidth:1.4},'hl');}
   el('circle',{cx:334,cy:70,r:44,'class':'occ'},g);S(g,'circle',[334,70,88],{strokeWidth:2.2});S(g,'line',[300,104,282,128],{strokeWidth:5});
   for(var yy=38;yy<=102;yy+=8)for(var xx=302;xx<=366;xx+=8){if((xx-334)*(xx-334)+(yy-70)*(yy-70)<32*32)el('circle',{cx:xx,cy:yy,r:1.7,'class':'fillink soft'},g);}
   S(g,'circle',[334,70,38],{strokeWidth:1.6},'hl');T(g,388,132,'the mic','end','xs');
   L(g,'M20 292 '+(function(){var d='',r=rnd(3);for(var i=0;i<=72;i++){var x=20+i*5,a=(4+10*Math.abs(Math.sin(i/7)))*Math.sin(i*1.25)*(.7+r()*.6);d+='L'+x+' '+f1(292+a)+' ';}return d;})(),'hl',1.5);
   T(g,24,316,'a steady hum','start','xs');
   L(g,'M356 262 v-18 l12 -4 v18','',1.4);el('ellipse',{cx:353,cy:263,rx:4,ry:3,'class':'fillink'},g);el('ellipse',{cx:365,cy:259,rx:4,ry:3,'class':'fillink'},g);
   var t=trail(g,'M2 160 C30 190 30 240 72 240');fly(svg,t,1,22);},
 weather:function(g){ground(g,0,294,400,10,9);
   var R=hive(g,26,292,92,{bh:40,sh:12,grain:false});
   sun(g,62,54,20);cloud(g,158,78,1.15);
   for(var k=0;k<6;k++)L(g,'M'+(122+k*14)+' '+(92+(k%2)*8)+' l-5 12','ac',1.3);
   var B=box(g,196,146,124,88,40,true,{strokeWidth:2.1},'hl');
   S(g,'polygon',[hexPts(258,190,17,Math.PI/6)],{strokeWidth:2,roughness:.4},'hl');el('circle',{cx:258,cy:190,r:2.6,'class':'dot'},g);
   for(var k=0;k<6;k++)L(g,'M324 '+(156+k*11)+' l14 -7','hl',1.5);
   [174,196,218].forEach(function(y,i){L(g,'M398 '+(y+i*4)+' C380 '+(y-10)+' 368 '+(y+12)+' 350 '+(y-2),'ac',1.4);L(g,'M357 '+(y-8)+' l-8 6 l9 4','ac',1.4);});
   [216,244,272,300].forEach(function(x){S(g,'rectangle',[x-4,234,8,9],{strokeWidth:1.2,roughness:.4},'hl');});
   T(g,396,116,'outside sensor,','end','sm');T(g,396,132,'behind the vent','end','sm');arr(g,346,138,346,142,342,148,336,154,'soft');
   T(g,206,276,'61\u00b0F out here','start','sm hlt');T(g,206,290,'(example)','start','xs');},
 power:function(g){sun(g,50,50,22);
   var pq=[[110,104],[236,52],[294,84],[168,136]];
   [[76,64,140,96],[86,78,170,112],[70,84,128,124]].forEach(function(l){L(g,'M'+l[0]+' '+l[1]+' L'+l[2]+' '+l[3],'hl hid',1.3);});
   S(g,'line',[196,112,196,160],{strokeWidth:2.6},'hl');S(g,'circle',[196,112,10],{strokeWidth:1.5},'hl');panel(g,pq,5,'hl');
   var c=box(g,112,160,170,112,40,true,{strokeWidth:2.1},'hl');
   for(var k=0;k<5;k++)L(g,'M'+(290)+' '+(176+k*9)+' l12 -6','hl',1.3);
   var hx=hexPts(197,216,24,Math.PI/6);el('circle',{cx:197,cy:216,r:38,fill:'var(--honey)',opacity:.18,'class':'glow'},g);S(g,'polygon',[hx],{strokeWidth:2.2,roughness:.4},'hl');el('circle',{cx:197,cy:216,r:3.5,'class':'dot'},g);
   [138,170,224,256].forEach(function(x,i){S(g,'rectangle',[x-5,272,10,12],{strokeWidth:1.4},'hl');L(g,'M'+x+' 284 C'+x+' 300 '+(x+(i-1.5)*14)+' 306 '+(x+(i-1.5)*24)+' 320','hl',1.4);});
   S(g,'rectangle',[316,236,62,32],{strokeWidth:1.6});S(g,'rectangle',[378,245,6,14],{strokeWidth:1.3});
   [0,1,2].forEach(function(k){S(g,'rectangle',[322+k*18,242,13,20],{fill:'F',fillStyle:'solid',strokeWidth:1},'hl');});
   T(g,312,224,'charges by day','start','xs');T(g,312,290,'runs all night','start','xs');
   S(g,'path',['M362 150 a14 14 0 1 0 14 18 a10 10 0 1 1 -14 -18'],{strokeWidth:1.5});},
 alert:function(g){phone(g,30,34,130,256);
   rbox(g,44,66,102,52,8,{strokeWidth:1.3},'hl');S(g,'polygon',[hexPts(60,84,7,Math.PI/6)],{strokeWidth:1.5,roughness:.3},'hl');L(g,'M74 80 h56 M74 92 h44 M54 106 h70','soft',1.4);
   for(var k=0;k<4;k++)L(g,'M48 '+(140+k*24)+' h'+(80-k*10),'faint',3);
   var d=rbox(g,190,32,196,124,14,{strokeWidth:1.8});var tl=[[196,96],[156,104],[196,112]];occ(g,[[198,94],[156,104],[198,114]]);S(g,'linearPath',[tl],{strokeWidth:1.8});
   T(g,208,60,'CombGuard','start','sm ui');T(g,208,88,'Hive 2: weight dropped','start','sm');T(g,208,110,'4 lb in 10 minutes.','start','sm');T(g,208,138,'Worth a look?','start','sm hlt');
   T(g,384,176,'example alert','end','xs');
   S(g,'path',['M400 214 C350 214 300 220 230 228'],{strokeWidth:2.4});L(g,'M330 216 q6 -14 20 -16 M282 222 q-4 -12 -16 -16','',1.4);
   var r=rnd(4);el('ellipse',{cx:292,cy:256,rx:30,ry:34,'class':'occ'},g);S(g,'path',['M266 230 C262 262 276 292 294 294 C312 292 320 262 316 226 Z'],{strokeWidth:1.4},'soft');
   for(var k=0;k<46;k++){var a=r()*Math.PI*2,rr=Math.sqrt(r());el('ellipse',{cx:f1(291+Math.cos(a)*rr*22),cy:f1(258+Math.sin(a)*rr*30),rx:3.4,ry:2.2,transform:'rotate('+f1(r()*180)+' '+f1(291+Math.cos(a)*rr*22)+' '+f1(258+Math.sin(a)*rr*30)+')','class':'fillink hl'},g);}
   beeS(g,250,270,.8,30);beeS(g,340,250,.8,200);beeS(g,330,296,.8,160);T(g,388,312,'a swarm?','end','xs');},
 station:function(g){
   box(g,96,250,112,8,118,false,{strokeWidth:1.6},'hl');S(g,'rectangle',[144,252,16,4],{fill:'F',fillStyle:'solid',strokeWidth:1},'hl');
   arr(g,352,244,338,244,322,248,300,250,'hl');T(g,352,268,'scale','end','sm hlt');
   var R=hive(g,96,238,112,{stand:false,scale:false,shadow:false,lid:false,bh:42,grain:false});
   var ic=box(g,94,R.lidY-4,116,4,120,true,{strokeWidth:1.3});var cx=152+ic.dx*.5,cy=R.lidY-4+ic.dy*.5;el('ellipse',{cx:f1(cx),cy:f1(cy),rx:9,ry:3,'class':'fillink'},g);
   caseOn(g,R,.22,.7,R.box[1][0]+9,R.box[1][0]+36,{cable:false});
   box(g,90,62,124,10,128,true,{strokeWidth:1.6});T(g,292,38,'lid off','start','xs');
   S(g,'rectangle',[cx-18,94,36,9],{strokeWidth:1.8},'hl');S(g,'ellipse',[cx,94,36,7],{strokeWidth:1.8},'hl');arr(g,cx,108,cx,112,cx,116,cx,cy-5,'hl');T(g,cx+26,102,'pod','start','sm hlt');
   S(g,'line',[120,82,120,122],{strokeWidth:2.6},'hl');L(g,'M120 126 V170','hl hid',2);L(g,'M114 116 l6 8 l6 -8','hl',1.6);T(g,108,96,'probe','end','sm hlt');},
 watchstep:function(g,svg){ground(g,10,240,350,8,5);
   var R=hive(g,148,236,74,{bh:32,sh:10});var C=caseOn(g,R,.25,.75,R.box[1][0]+6,R.box[1][0]+22,{t:5,cable:false,glow:true});
   var arc=trail(g,'M28 214 Q180 -50 332 214');
   sun(g,74,128,13);S(g,'path',['M282 112 a15 15 0 1 0 15 20 a11 11 0 1 1 -15 -20'],{strokeWidth:1.8});
   for(var k=0;k<14;k++)el('path',{d:'M'+(250+((k*53)%90))+' '+(30+((k*37)%70))+' m-3 0 h6 m-3 -3 v6','class':'ln soft tw','stroke-width':1,style:'animation-delay:'+(-k*.37).toFixed(2)+'s'},g);
   T(g,74,170,'day','middle','sm');T(g,290,170,'night','middle','sm');
   var wx=C.cx+18,wy=C.cy-4;for(var k=1;k<=3;k++)S(g,'arc',[wx,wy,k*14,k*14,-Math.PI*.35,Math.PI*.35,false],{strokeWidth:1.4},'hl');
   S(g,'rectangle',[284,196,56,34],{strokeWidth:1.6});S(g,'linearPath',[[[276,236],[348,236],[342,230],[282,230],[276,236]]],{strokeWidth:1.5});S(g,'linearPath',[[[290,222],[302,214],[312,218],[324,206],[334,208]]],{strokeWidth:1.3,roughness:.4},'hl');
   fly(svg,arc,2,30);},
 alarm:function(g){ground(g,8,252,352,9,13);
   var H=[16,128,240].map(function(x,i){return hive(g,x,248,64,{bh:28,sh:9,cls:i===1?'hl':'',grain:false});});
   ['Hive 1','Hive 2','Hive 3'].forEach(function(t,i){T(g,[48,160,272][i],268,t,'middle',i===1?'xs hlt':'xs');});
   var h2=H[1],fx=h2.X+20+h2.dx*.5,fy=h2.top+h2.dy*.5;S(g,'line',[fx,fy,fx,fy-34],{strokeWidth:1.6},'hl');S(g,'polygon',[[[fx,fy-34],[fx+20,fy-28],[fx,fy-21]]],{fill:'F',fillStyle:'solid',strokeWidth:1},'hl');
   phone(g,18,10,66,112);rbox(g,26,34,50,30,5,{strokeWidth:1.2},'hl');L(g,'M28 38 l23 14 l23 -14','hl',1.2);T(g,51,90,'!','middle','lg hlt');
   arr(g,92,56,140,40,176,52,fx-6,fy-40,'hl');T(g,348,60,'open this one','end','sm hlt');T(g,348,80,'first','end','sm hlt');}
};

/* --- the intro: a grounded hive in its forest clearing --- */
function drawIntro(){var s=document.getElementById('art-intro');if(!s)return;var g=grp(s);
  sun(g,980,82,26);cloud(g,330,78,1.3,'soft');cloud(g,730,56,1,'soft');birds(g,[[590,118],[618,104],[606,132]]);
  var r=rnd(21),d='M0 332';for(var x=0;x<1100;x+=22){d+=' q11 '+f1(-12-r()*16)+' 22 0';}L(g,d,'faint',1.3);
  pine(g,945,338,120,'soft');pine(g,1062,340,150);pine(g,1004,342,200);pine(g,52,338,150,'soft');
  oak(g,150,344,300);
  S(g,'linearPath',[[[0,336],[300,332],[700,338],[1100,333]]],{strokeWidth:1.5});
  for(var k=0;k<70;k++){var yy=344+Math.pow(r(),1.7)*220,xx=r()*1100,ss=.35+(yy-340)/250;if(xx>430&&xx<800&&yy<480)continue;L(g,'M'+f1(xx)+' '+f1(yy)+' h'+f1(6*ss),'faint',1);}
  L(g,'M250 580 C330 548 420 520 480 488','soft',1.3);L(g,'M440 580 C480 550 560 520 600 492','soft',1.3);
  for(var k=0;k<9;k++){var t=k/9;el('ellipse',{cx:f1(270+t*190+r()*20),cy:f1(572-t*80),rx:f1(3+r()*2),ry:f1(2),'class':'ln soft','stroke-width':1},g);}
  leaves(g,40,346,300,400,22,5);leaves(g,420,490,760,560,14,8);drifts(g,[[120,560,70],[330,520,60],[880,540,90],[1040,500,60]]);
  smoker(g,382,476);
  var R=hive(g,470,478,190,{sh:30});
  var C=caseOn(g,R,.18,.7,268,322,{glow:true});var pq=mastPanel(g,C.top,66,112);
  var pc=[R.X+R.w/2+R.dx*.5,R.lidY+R.dy*.5];el('ellipse',{cx:f1(pc[0]),cy:f1(pc[1]),rx:22,ry:7,'class':'ln hl hid',fill:'none','stroke-width':1.6},g);
  L(g,'M'+f1(pc[0]-18)+' '+f1(pc[1]+6)+' V'+f1(pc[1]+86),'hl hid',1.8);
  R.legs.forEach(function(p){tuft(g,p[0],p[1]+1,1.1);});tuft(g,R.X+R.w*.5,R.legs[0][1]+2,1.2);
  jar(g,792,522);hiveTool(g,852,526);
  [[90,548,44,10,-4],[128,566,30,8,3],[246,560,34,9,-2],[700,566,38,10,4],[944,546,46,11,-3],[1000,566,30,9,2],[640,520,30,8,-2]].forEach(function(f){daisy(g,f[0],f[1],f[2],f[3],f[4]);});
  [[60,566,52],[214,566,42],[982,566,58],[1044,556,48],[740,560,40]].forEach(function(f){lav(g,f[0],f[1],f[2]);});
  for(var k=0;k<26;k++){var xx=r()*1100,yy=480+r()*96;if(xx>430&&xx<700&&yy<500)continue;tuft(g,xx,yy,.8+r()*.5);}
  butterfly(g,180,470,1.1);butterfly(g,930,440,.9);
  note(g,436,176,'pod under the lid',pc[0]-26,pc[1]-6,'end');
  note(g,436,302,'probe between the frames',pc[0]-24,pc[1]+60,'end');
  note(g,796,118,'solar on top',pq[1][0]+10,pq[1][1]+8,'start');
  note(g,812,248,'the case, on the side',C.c[1][0]+6,C.c[1][1]+16,'start');
  var sp=R.side(.55,R.scaleY);note(g,812,432,'a scale under the hive',sp[0]+6,sp[1],'start');
  note(g,880,470,'the good stuff',836,486,'start','xs');
  var e=R.ent,t1=trail(g,'M'+f1(e[0])+' '+f1(e[1]+4)+' C520 490 430 440 360 470 S200 520 128 532'),t2=trail(g,'M'+f1(e[0]+10)+' '+f1(e[1]+4)+' C620 560 860 592 944 500'),t3=trail(g,'M'+f1(e[0]+4)+' '+f1(e[1]+6)+' C560 520 640 540 700 528');
  fly(s,t1,2,40);fly(s,t2,1,36,true);fly(s,t3,1,30);}

/* --- the long night: scene that changes as you scroll --- */
var NIGHT={};
function drawNight(){var s=document.getElementById('art-night');if(!s)return;var g=grp(s),r=rnd(77);
  var defs=el('defs',{},s),lg=el('radialGradient',{id:'dawn',cx:.5,cy:.5,r:.5},defs);el('stop',{offset:'0',style:'stop-color:var(--honey);stop-opacity:.6'},lg);el('stop',{offset:'.55',style:'stop-color:var(--honey);stop-opacity:.22'},lg);el('stop',{offset:'1',style:'stop-color:var(--honey);stop-opacity:0'},lg);
  NIGHT.glow=el('ellipse',{cx:600,cy:462,rx:196,ry:150,fill:'url(#dawn)',opacity:0},g);
  NIGHT.stars=grp(g);for(var k=0;k<46;k++){var x=r()*800,y=10+r()*340;if(r()<.6)el('path',{d:'M'+f1(x-3)+' '+f1(y)+' h6 M'+f1(x)+' '+f1(y-3)+' v6','class':'ln tw','stroke-width':1.2,style:'animation-delay:'+(-r()*3).toFixed(2)+'s'},NIGHT.stars);else el('circle',{cx:f1(x),cy:f1(y),r:1.3,'class':'fillink tw',style:'animation-delay:'+(-r()*3).toFixed(2)+'s'},NIGHT.stars);}
  (function(){var d='';for(var k=0;k<=40;k++){var th=(165-k/40*150)*Math.PI/180;d+=(k?' L':'M')+f1(400+360*Math.cos(th))+' '+f1(450-360*Math.sin(th));}trail(g,d).setAttribute('opacity','.16');})();
  NIGHT.handle=grp(g,'moon-h');var hh=NIGHT.handle;hh.setAttribute('tabindex','0');hh.setAttribute('role','slider');hh.setAttribute('aria-label','Time of night. Drag the moon or use the arrow keys.');hh.setAttribute('aria-valuemin','0');hh.setAttribute('aria-valuemax','100');
  el('circle',{cx:0,cy:0,r:62,fill:'rgba(0,0,0,0)','class':'ring',stroke:'var(--honey)','stroke-width':1.4,'stroke-dasharray':'3 7',opacity:.7},hh);
  NIGHT.moon=grp(hh);el('circle',{cx:0,cy:0,r:52,fill:'var(--nfg)',opacity:.07},NIGHT.moon);S(NIGHT.moon,'path',['M-4 -32 a34 34 0 1 0 34 38 a26 26 0 1 1 -34 -38'],{strokeWidth:2.2});S(NIGHT.moon,'path',['M-4 -32 a34 34 0 1 0 34 38 a26 26 0 1 1 -34 -38'],{fill:'F',fillStyle:'hachure',hachureGap:5,stroke:'none'});
  NIGHT.sun=grp(g);sun(NIGHT.sun,650,470,30);
  var hills='M0 470 C120 440 220 446 330 460 S560 426 800 452 L800 660 L0 660 Z';el('path',{d:hills,'class':'occ'},g);S(g,'path',['M0 470 C120 440 220 446 330 460 S560 426 800 452'],{strokeWidth:1.4},'soft');
  [30,110,190,520,600,680,760].forEach(function(x,i){pine(g,x,478+(i%2)*6,70+((i*37)%40),'soft');});
  S(g,'linearPath',[[[0,562],[400,556],[800,563]]],{strokeWidth:1.5});
  pine(g,46,568,210);
  S(g,'path',['M141 566 C140 480 136 400 129 300 M159 566 C154 470 150 400 140 330'],{strokeWidth:1.8});L(g,'M146 540 v-30 M152 500 v-26 M144 460 v-22','soft',1);
  S(g,'path',['M131 300 C130 280 132 262 132 250 M138 330 C170 316 210 306 268 304 M136 392 C112 372 96 356 86 330 M134 270 C120 240 116 220 120 196 M240 305 q10 -14 22 -18'],{strokeWidth:1.8});
  var ow=grp(g);NIGHT.owl=ow;el('ellipse',{cx:232,cy:276,rx:20,ry:28,'class':'occ'},ow);S(ow,'ellipse',[232,276,40,56],{strokeWidth:1.8});S(ow,'path',['M216 256 l-4 -14 l10 8 M248 256 l4 -14 l-10 8'],{strokeWidth:1.6});
  S(ow,'path',['M218 282 q14 18 28 0'],{strokeWidth:1.2},'soft');L(ow,'M222 286 l2 4 M230 290 l2 4 M238 288 l2 4','soft',1);
  var ey=grp(ow,'blink');S(ey,'circle',[224,264,13],{strokeWidth:1.5});S(ey,'circle',[240,264,13],{strokeWidth:1.5});el('circle',{cx:224,cy:264,r:2.6,'class':'dot'},ey);el('circle',{cx:240,cy:264,r:2.6,'class':'dot'},ey);
  L(ow,'M232 268 l-2 5 l4 0 Z','hl',1.2);L(ow,'M226 304 l-2 4 M230 304 v5 M236 304 v5 M240 304 l2 4','hl',1.3);
  var R=hive(g,300,596,160,{sh:24});var C=caseOn(g,R,.2,.72,R.box[1][0]+12,R.box[1][0]+58,{glow:true});mastPanel(g,C.top,54,96);
  R.legs.forEach(function(p){tuft(g,p[0],p[1]+1,1);});
  pine(g,700,574,250);pine(g,770,580,170);
  for(var k=0;k<16;k++){var xx=r()*800;if(xx>290&&xx<560)continue;tuft(g,xx,566+r()*60,.8+r()*.4);}
  var tag=grp(g);NIGHT.tag=tag;el('rect',{x:120,y:118,width:168,height:40,rx:20,'class':'chip'},tag);NIGHT.tagT=T(tag,204,145,'+3 lb today','middle','hlt');L(tag,'M288 140 C320 150 340 200 '+f1(R.X+30)+' '+f1(R.top-10),'hl soft hid',1.3);
  NIGHT.clock=T(g,780,46,'7:40 pm','end','lg hlt');
  NIGHT.ev=[0,1,2,3].map(function(i){return grp(g,'ev');});
  (function(){var e0=NIGHT.ev[0],ent=R.ent;[['M-20 210 C120 260 220 420 ',2],['M820 260 C640 300 560 470 ',2],['M300 120 C200 200 260 480 ',1]].forEach(function(t){var p=el('path',{d:t[0]+f1(ent[0])+' '+f1(ent[1]),fill:'none',stroke:'none'},e0);var n0=flyers.length;fly(s,p,t[1],60);for(var k=n0;k<flyers.length;k++)e0.appendChild(flyers[k].g);});
    T(e0,ent[0]+90,ent[1]-6,'home for the night','start','xs hlt');})();
  (function(){var e1=NIGHT.ev[1];T(e1,262,236,'hoo','start','sm hlt').setAttribute('class','sm hlt hoo');var t2=T(e1,286,212,'hoo','start','sm hlt');t2.setAttribute('class','sm hlt hoo');t2.style.animationDelay='-1.2s';
    for(var k=0;k<7;k++)el('circle',{cx:f1(120+k*90+((k*37)%40)),cy:f1(380+((k*53)%120)),r:2.4,fill:'var(--honey)','class':'ff',style:'animation-delay:'+(-k*.7)+'s'},e1);})();
  (function(){var e2=NIGHT.ev[2];el('path',{d:'M640 60 L430 150','class':'ln shoot',stroke:'var(--nfg)','stroke-width':2},e2);el('path',{d:'M500 40 L330 112','class':'ln shoot',stroke:'var(--nfg)','stroke-width':1.6,style:'animation-delay:-1.6s'},e2);
    T(e2,R.X+R.w+R.dx+14,R.top+20,'brr','start','sm hlt').setAttribute('class','sm hlt hoo');})();
  (function(){var e3=NIGHT.ev[3];[[224,264],[240,264]].forEach(function(p){el('circle',{cx:p[0],cy:p[1],r:7,'class':'occ'},e3);L(e3,'M'+(p[0]-6)+' '+(p[1]+1)+' q6 5 12 0','',1.4);});
    var z1=T(e3,258,238,'z','start','sm hlt');z1.setAttribute('class','sm hlt zz');var z2=T(e3,270,222,'z','start','sm hlt');z2.setAttribute('class','sm hlt zz');z2.style.animationDelay='-1s';
    [[620,420],[660,440],[700,410]].forEach(function(b,i){var bg=grp(e3,'birdfly');bg.style.animationDelay=(-i*1.4)+'s';L(bg,'M'+b[0]+' '+b[1]+' q6 -7 12 0 q6 -7 12 0','',1.6);});})();
  var ff=grp(g,'ss-summer');for(var k=0;k<12;k++)el('circle',{cx:f1(40+r()*720),cy:f1(380+r()*170),r:2.6,fill:'var(--honey)','class':'ff',style:'animation-delay:'+(-r()*5).toFixed(2)+'s;animation-duration:'+(3+r()*3).toFixed(1)+'s'},ff);
  [['ss-winter','snow'],['ss-spring','petal'],['ss-fall','leaf']].forEach(function(z){var q=grp(g,z[0]);for(var k=0;k<26;k++){var x=r()*800,st='animation-delay:'+(-r()*14).toFixed(2)+'s;animation-duration:'+(9+r()*7).toFixed(1)+'s;--dx:'+(r()*80-20).toFixed(0)+'px';
    if(z[1]==='snow')el('circle',{cx:f1(x),cy:0,r:f1(1.5+r()*1.6),fill:'var(--nfg)',opacity:.85,'class':'fallp',style:st},q);
    else if(z[1]==='petal')el('ellipse',{cx:f1(x),cy:0,rx:3.4,ry:2,fill:'#F4B7C7',opacity:.85,'class':'fallp',style:st},q);
    else el('path',{d:'M'+f1(x-5)+' 0 q5 -4 10 0 q-5 4 -10 0 Z',fill:'none',stroke:'var(--honey)','stroke-width':1.2,'class':'fallp',style:st},q);}});
}
function setNight(p){if(!NIGHT.moon)return;var th=(165-p*150)*Math.PI/180,mx=400+360*Math.cos(th),my=450-360*Math.sin(th),mo=p<.76?1:Math.max(0,1-(p-.76)/.12);
  NIGHT.handle.setAttribute('transform','translate('+f1(mx)+' '+f1(my)+')');NIGHT.moon.setAttribute('opacity',Math.max(.3,mo).toFixed(2));
  var s=Math.max(0,Math.min(1,(p-.74)/.14));s=s*s*(3-2*s);NIGHT.sun.setAttribute('transform','translate(0 '+f1(70*(1-s))+')');NIGHT.glow.setAttribute('opacity',s.toFixed(2));NIGHT.stars.setAttribute('opacity',(1-s*.85).toFixed(2));}

/* --- live hive: laptop and phone on the desk --- */
function drawLive(){var s=document.getElementById('art-live');if(!s)return;var g=grp(s);
  rbox(g,80,20,500,320,16,{strokeWidth:2.2});S(g,'rectangle',[98,38,464,284],{strokeWidth:1.1},'soft');
  var base=[[36,364],[624,364],[596,340],[64,340]];occ(g,base);S(g,'polygon',[base],{strokeWidth:2});L(g,'M290 354 h80','',1.3);
  T(g,120,76,'Hive 2','start','ui').setAttribute('style','font-size:22px');T(g,120,98,'Back yard · updated 2 min ago','start','xs');
  rbox(g,430,56,112,32,16,{strokeWidth:1.6},'ac');el('circle',{cx:450,cy:72,r:5,fill:'var(--acc)','class':'glow'},g);T(g,462,78,'All quiet','start','sm act');
  L(g,'M118 110 H542','faint',1);
  [[118,122,'weight','82 lb'],[334,122,'brood','94°F'],[118,222,'CO₂','820 ppm'],[334,222,'hum','steady']].forEach(function(t,i){rbox(g,t[0],t[1],204,88,10,{strokeWidth:1.3});T(g,t[0]+12,t[1]+22,t[2],'start','xs');T(g,t[0]+12,t[1]+48,t[3],'start','lg');
    var x0=t[0]+110,y0=t[1]+70;
    if(i===0){var pts=[];for(var k=0;k<=12;k++){var d=Math.floor(k/3),p=k%3;pts.push([x0+k*7.4,y0-d*7-(p===1?4:p===2?2:0)]);}S(g,'linearPath',[pts],{strokeWidth:1.6,roughness:.4},'hl');}
    if(i===1){L(g,'M'+x0+' '+(y0-24)+' h86 M'+x0+' '+(y0-8)+' h86','soft hid',1);S(g,'linearPath',[[[x0,y0-16],[x0+30,y0-17],[x0+58,y0-15],[x0+86,y0-16]]],{strokeWidth:1.6,roughness:.4},'hl');}
    if(i===2){S(g,'curve',[[[x0,y0-6],[x0+26,y0-26],[x0+52,y0-12],[x0+86,y0-34]]],{strokeWidth:1.6},'hl');}
    if(i===3){var d2='M'+x0+' '+(y0-18);for(var k=1;k<=28;k++)d2+=' L'+f1(x0+k*3.1)+' '+f1(y0-18+Math.sin(k*1.4)*(3+6*Math.abs(Math.sin(k/5))));L(g,d2,'hl',1.3);}});
  var tp=grp(g,'','rotate(9 560 28)');el('rect',{x:494,y:10,width:136,height:32,'class':'tape'},tp);T(tp,562,32,'example data','middle','sm');
  phone(g,604,150,128,236);T(g,620,196,'Hive 2','start','sm ui');T(g,620,240,'94°F','start','xl');T(g,620,262,'brood, steady','start','xs');
  S(g,'linearPath',[[[620,330],[644,326],[668,330],[692,324],[716,328]]],{strokeWidth:1.5,roughness:.4},'hl');L(g,'M620 300 h96 M620 352 h96','faint',1);
  var mx=8,my=482;S(g,'ellipse',[mx+34,my+2,84,10],{fill:'F',fillStyle:'hachure',hachureGap:4,stroke:'none'},'soft');occ(g,[[mx,my-74],[mx+66,my-74],[mx+62,my],[mx+4,my]]);S(g,'path',['M'+mx+' '+(my-74)+' L'+(mx+4)+' '+my+' L'+(mx+62)+' '+my+' L'+(mx+66)+' '+(my-74)],{strokeWidth:1.8});S(g,'ellipse',[mx+33,my-74,66,12],{strokeWidth:1.6});
  S(g,'path',['M'+(mx+65)+' '+(my-58)+' C'+(mx+92)+' '+(my-60)+' '+(mx+92)+' '+(my-22)+' '+(mx+63)+' '+(my-22)],{strokeWidth:1.8});
  S(g,'polygon',[hexPts(mx+33,my-38,10,Math.PI/6)],{strokeWidth:1.6,roughness:.4},'hl');
  for(var k=0;k<3;k++)L(g,'M'+(mx+20+k*12)+' '+(my-84)+' q-6 -8 0 -15 q6 -7 0 -15','soft smoke',1.3);
  jar(g,120,484);}

/* --- join: a hive at sunset with a lantern lit for the watch --- */
function drawJoin(){var s=document.getElementById('art-join');if(!s)return;var g=grp(s),r=rnd(5);
  for(var k=0;k<10;k++){var x=760+r()*320,y=12+r()*70;el('path',{d:'M'+f1(x-3)+' '+f1(y)+' h6 M'+f1(x)+' '+f1(y-3)+' v6','class':'ln soft tw','stroke-width':1.1,style:'animation-delay:'+(-r()*3).toFixed(2)+'s'},g);}
  sun(g,770,236,46);birds(g,[[640,96],[666,84],[690,100]]);
  el('path',{d:'M0 250 C200 206 360 230 520 238 S860 200 1100 234 L1100 298 L0 298 Z','class':'occ'},g);S(g,'path',['M0 250 C200 206 360 230 520 238 S860 200 1100 234'],{strokeWidth:1.4},'soft');
  pine(g,40,262,120,'soft');pine(g,96,268,90,'soft');oak(g,1010,276,190);pine(g,930,266,110,'soft');
  S(g,'linearPath',[[[0,300],[550,296],[1100,302]]],{strokeWidth:1.5});
  var R=hive(g,370,316,128,{bh:54,sh:20});var C=caseOn(g,R,.2,.72,R.box[1][0]+8,R.box[1][0]+40,{glow:true});mastPanel(g,C.top,46,76);
  R.legs.forEach(function(p){tuft(g,p[0],p[1]+1,1);});
  S(g,'line',[640,312,640,140],{strokeWidth:2.6});S(g,'line',[640,148,684,148],{strokeWidth:2.2});L(g,'M684 148 v12','',1.6);tuft(g,640,312,1.2);
  el('circle',{cx:684,cy:196,r:46,fill:'var(--honey)',opacity:.2,'class':'glow'},g);
  S(g,'circle',[684,164,10],{strokeWidth:1.5});var cap=[[668,176],[700,176],[694,166],[674,166]];occ(g,cap);S(g,'polygon',[cap],{strokeWidth:1.6});
  occ(g,[[670,176],[698,176],[698,214],[670,214]]);S(g,'rectangle',[670,176,28,38],{strokeWidth:1.8});L(g,'M684 176 v38','soft',1);
  el('path',{d:'M684 206 q-7 -8 0 -18 q7 10 0 18 Z',fill:'var(--honey)','class':'glow'},g);S(g,'rectangle',[666,214,36,6],{strokeWidth:1.6});
  T(g,704,112,'a light left on','start','sm');T(g,704,132,'for the watch','start','sm');
  [[150,318,34,9,-2],[210,326,26,8,2],[840,318,36,10,-3],[900,326,28,8,2],[560,322,28,8,3]].forEach(function(f){daisy(g,f[0],f[1],f[2],f[3],f[4]);});
  [[120,326,40],[880,326,44],[260,326,34]].forEach(function(f){lav(g,f[0],f[1],f[2]);});
  for(var k=0;k<22;k++)tuft(g,r()*1100,304+r()*24,.8+r()*.4);
  var e=R.ent,t1=trail(g,'M1090 196 C900 226 700 280 '+f1(e[0]+8)+' '+f1(e[1])),t2=trail(g,'M900 18 C700 40 560 170 '+f1(e[0]+4)+' '+f1(e[1]+2));
  fly(s,t1,2,34);fly(s,t2,1,30);}

/* --- doodles beside headlines --- */
function drawDoodles(){document.querySelectorAll('svg.doodle').forEach(function(s,i){var g=grp(s);
  var d=s.dataset.doodle==='hop'?'M6 70 Q40 10 70 50 Q100 86 130 34':'M6 74 C40 84 60 24 88 42 C116 60 92 86 76 62 C62 36 110 22 134 30';trail(g,d);
  var pth=el('path',{d:d},null);g.appendChild(pth);var Lh=pth.getTotalLength(),p=pth.getPointAtLength(Lh),q=pth.getPointAtLength(Lh-4);g.removeChild(pth);
  beeS(g,p.x+6,p.y,1.35,Math.atan2(p.y-q.y,p.x-q.x)*57.3);});}

/* ---------- new sketches: the problem, mission, team and survey ---------- */
function leafAt(g,x,y,s,a,cls){var c=Math.cos(a),si=Math.sin(a);function r(px,py){return f1(x+px*c-py*si)+' '+f1(y+px*si+py*c);}
  L(g,'M'+r(0,0)+' Q'+r(s*.35,-s*.34)+' '+r(s,0)+' Q'+r(s*.35,s*.34)+' '+r(0,0)+' M'+r(s*.1,0)+' L'+r(s*.8,0),cls||'',1.1);}
function beeDots(g,cx,cy,rx,ry,n,seed,cls){var r=rnd(seed);for(var k=0;k<n;k++){var a=r()*Math.PI*2,d=Math.sqrt(r()),x=cx+Math.cos(a)*d*rx,y=cy+Math.sin(a)*d*ry;
  el('ellipse',{cx:f1(x),cy:f1(y),rx:3.2,ry:2,transform:'rotate('+f1(r()*180)+' '+f1(x)+' '+f1(y)+')','class':'fillink '+(cls||'')},g);}}
ART.pswarm=function(g,svg){ground(g,0,236,360,8,21);
  var R=hive(g,24,232,88,{bh:36,sh:10,grain:false});
  S(g,'path',['M362 34 C322 40 282 50 212 62'],{strokeWidth:2.6});L(g,'M304 44 q-6 -16 -22 -20 M252 54 q4 -14 -6 -26','',1.4);
  [[330,38,-2.6],[296,30,-2.2],[270,48,-2.9],[244,30,-1.9],[226,58,-3]].forEach(function(l){leafAt(g,l[0],l[1],18,l[2]);});
  var cl='M238 60 C228 96 240 142 263 150 C286 142 296 98 288 58 Z';el('path',{d:cl,'class':'occ'},g);S(g,'path',[cl],{strokeWidth:1.3},'soft');beeDots(g,263,102,22,40,70,9,'hl');
  var sx=R.X+R.w*.5+R.dx*.5,sy=R.top+R.dy*.5-4,d='M'+f1(sx)+' '+f1(sy)+' C'+f1(sx+30)+' '+f1(sy-70)+' 170 70 238 112';var tp=trail(g,d);
  var pth=el('path',{d:d},null);g.appendChild(pth);var Lh=pth.getTotalLength(),r=rnd(3);for(var k=0;k<40;k++){var p=pth.getPointAtLength(r()*Lh);el('ellipse',{cx:f1(p.x+(r()-.5)*26),cy:f1(p.y+(r()-.5)*22),rx:2.6,ry:1.7,'class':'fillink'},g);}g.removeChild(pth);
  T(g,150,206,'about half the colony','start','xs');fly(svg,tp,3,34);},
ART.pstores=function(g){S(g,'linearPath',[[[0,228],[180,226],[360,229]]],{strokeWidth:1.4});
  var lid=[[30,52],[330,52],[330,70],[30,70]];occ(g,lid);S(g,'polygon',[lid],{strokeWidth:1.8});
  el('path',{d:'M28 53 Q40 38 70 44 Q110 34 150 42 Q200 32 250 42 Q300 34 332 50 L332 54 Q300 62 270 56 Q230 64 190 56 Q140 64 100 56 Q60 62 28 56 Z','class':'snow'},g);
  S(g,'rectangle',[40,70,280,150],{strokeWidth:1.8});
  for(var i=0;i<8;i++){var fx=54+i*33;S(g,'rectangle',[fx,78,22,136],{strokeWidth:1,roughness:.6},'soft');
    if(i<3)S(g,'rectangle',[fx+2,82,18,96],{fill:'F',fillStyle:'hachure',hachureGap:3,hachureAngle:-30,stroke:'none'},'hl');}
  el('ellipse',{cx:250,cy:150,rx:44,ry:38,'class':'occ'},g);beeDots(g,250,150,40,34,90,13);
  L(g,'M210 120 C180 96 150 96 128 112','hl hid',1.6);L(g,'M136 104 l-9 8 l11 3','hl',1.6);
  T(g,52,248,'honey','start','sm hlt');T(g,312,248,'the cluster','end','sm');T(g,170,96,'out of reach','middle','xs');
  [[20,24],[346,22],[300,14],[70,20]].forEach(function(p){L(g,'M'+(p[0]-5)+' '+p[1]+' h10 M'+p[0]+' '+(p[1]-5)+' v10 M'+(p[0]-3.5)+' '+(p[1]-3.5)+' l7 7 M'+(p[0]+3.5)+' '+(p[1]-3.5)+' l-7 7','soft',1);});},
ART.pqueen=function(g){var r=11,hw=r*Math.sqrt(3);for(var row=0;row<11;row++)for(var col=0;col<16;col++){var x=22+col*hw+(row%2?hw/2:0),y=26+row*r*1.5;if(x>338||y>222)continue;
    var e=Math.pow((x-180)/170,2)+Math.pow((y-125)/104,2);if(e>1)continue;el('path',{d:P(hexPts(x,y,r-.8,Math.PI/6)),'class':'ln faint','stroke-width':1},g);}
  [[70,80,1,20],[110,170,1,-30],[260,70,1,160],[290,150,1,200],[90,128,.95,10],[230,196,.95,-150],[150,58,.9,40]].forEach(function(b){beeS(g,b[0],b[1],b[2],b[3]);});
  var q=grp(g);el('ellipse',{cx:174,cy:126,rx:34,ry:12,'class':'occ'},q);L(q,'M140 126 C150 112 196 112 208 126 C196 140 150 140 140 126 Z','hl hid',1.8);L(q,'M208 126 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0','hl hid',1.6);
  L(q,'M168 116 C160 96 182 92 186 112 M180 116 C184 98 204 100 196 116','hl hid',1.4);
  L(g,'M156 88 l6 -18 l10 12 l8 -18 l8 18 l10 -12 l6 18 Z','hl hid',1.6);T(g,238,98,'?','start','xl hlt');
  var qc='M302 168 C292 168 290 186 294 198 C298 212 312 212 314 198 C318 184 312 168 302 168 Z';el('path',{d:qc,'class':'occ'},g);S(g,'path',[qc],{fill:'F',fillStyle:'dots',hachureGap:4,strokeWidth:1.5});
  T(g,330,234,'queen cells?','end','xs');T(g,174,168,'where is she?','middle','sm hlt');},
ART.clip=function(g){rbox(g,24,18,72,94,8,{strokeWidth:1.8});S(g,'rectangle',[44,10,32,14],{strokeWidth:1.6},'hl');
  for(var k=0;k<3;k++){var y=42+k*22;S(g,'rectangle',[34,y,11,11],{strokeWidth:1.3});L(g,'M52 '+(y+6)+' h'+(30-k*6),'soft',1.6);if(k<2)L(g,'M35 '+(y+5)+' l4 5 l8 -10','hl',2);}
  var pq=[[84,104],[112,68],[118,72],[90,108]];occ(g,pq);S(g,'polygon',[pq],{strokeWidth:1.4},'hl');L(g,'M84 104 l-3 9 l9 -5','',1.4);},
ART.mhelm=function(g,svg){S(g,'linearPath',[[[30,200],[260,198],[490,201]]],{strokeWidth:1.5});
  var R=hive(g,206,196,108,{bh:42,sh:14,grain:false});var C=caseOn(g,R,.2,.7,R.box[1][0]+6,R.box[1][0]+30,{glow:true,t:6});mastPanel(g,C.top,30,52);
  var dm=trail(g,'M96 200 C96 36 424 36 424 200');
  sun(g,70,58,16);S(g,'path',['M452 44 a18 18 0 1 0 18 22 a13 13 0 1 1 -18 -22'],{strokeWidth:1.8});
  T(g,438,120,'on watch','start','sm hlt');[[60,180,40],[470,182,36]].forEach(function(f){daisy(g,f[0],f[1],f[2],9,2);});
  fly(svg,dm,2,40);},
ART.mnight=function(g){var r=rnd(31);for(var k=0;k<26;k++){var x=r()*520,y=8+r()*120;el('path',{d:'M'+f1(x-3)+' '+f1(y)+' h6 M'+f1(x)+' '+f1(y-3)+' v6','class':'ln tw','stroke-width':1.1,style:'animation-delay:'+(-r()*3).toFixed(2)+'s'},g);}
  S(g,'path',['M74 34 a26 26 0 1 0 26 30 a20 20 0 1 1 -26 -30'],{strokeWidth:2});
  S(g,'linearPath',[[[0,196],[260,192],[520,197]]],{strokeWidth:1.4},'soft');
  var R=hive(g,208,190,100,{bh:40,sh:12,grain:false});caseOn(g,R,.2,.7,R.box[1][0]+6,R.box[1][0]+30,{glow:true,t:6});
  T(g,260,226,'between visits','middle','sm hlt');
  'MTWTFSS'.split('').forEach(function(ch,i){var x=34+i*66;rbox(g,x,236,52,48,8,{strokeWidth:1.4});T(g,x+8,252,ch,'start','xs');
    if(i===0||i===6){L(g,'M'+(x+16)+' 268 l7 8 l14 -16','hl',2.2);}else T(g,x+26,278,'?','middle','lg hlt');});},
ART.rboard=function(g){rbox(g,18,18,164,104,10,{strokeWidth:1.8},'hl');S(g,'rectangle',[40,40,40,30],{fill:'F',fillStyle:'hachure',hachureGap:4,strokeWidth:1.4});S(g,'rectangle',[100,52,26,26],{fill:'F',fillStyle:'cross-hatch',hachureGap:4,strokeWidth:1.3});
  S(g,'rectangle',[140,34,26,14],{strokeWidth:1.2});for(var k=0;k<8;k++)el('circle',{cx:44+k*15,cy:106,r:2.6,'class':'ln','stroke-width':1.2},g);
  L(g,'M80 55 H100 M126 64 H150 V48 M60 70 V96 M113 78 V96 M153 48 V30','hl',1.3);[[28,28],[172,28],[28,112],[172,112]].forEach(function(p){el('circle',{cx:p[0],cy:p[1],r:3.2,'class':'ln','stroke-width':1.2},g);});},
ART.rcode=function(g){rbox(g,16,14,168,112,10,{strokeWidth:1.8});L(g,'M16 34 H184','soft',1.2);[30,42,54].forEach(function(x){el('circle',{cx:x,cy:24,r:3,'class':'ln','stroke-width':1.1},g);});
  [[30,52,70,''],[44,66,90,'hl'],[44,80,60,''],[58,94,70,'hl'],[30,108,40,'']].forEach(function(l){L(g,'M'+l[0]+' '+l[1]+' h'+l[2],l[3],3);});el('rect',{x:78,y:102,width:3,height:12,'class':'dot glow'},g);},
ART.rdash=function(g){rbox(g,16,14,168,112,10,{strokeWidth:1.8});S(g,'linearPath',[[[30,100],[56,88],[80,92],[104,70],[128,76],[152,52],[170,56]]],{strokeWidth:2,roughness:.5},'hl');
  L(g,'M30 108 H172','soft',1);S(g,'path',['M150 24 q0 -8 8 -8 q8 0 8 8 v8 l4 4 h-24 l4 -4 Z'],{strokeWidth:1.4});rbox(g,28,22,62,20,10,{strokeWidth:1.2},'ac');T(g,59,36,'all quiet','middle','xs act');},
ART.rcase=function(g){var B=box(g,36,46,92,64,44,true,{strokeWidth:1.8},'hl');S(g,'polygon',[hexPts(82,78,14,Math.PI/6)],{strokeWidth:1.8,roughness:.4},'hl');
  var rl=[[20,124],[170,96],[174,106],[24,134]];occ(g,rl);S(g,'polygon',[rl],{strokeWidth:1.4});for(var k=1;k<10;k++){var x=20+k*15,y=124-k*2.8;L(g,'M'+f1(x)+' '+f1(y)+' l1 '+(k%2?6:9),'',1);}
  var pn=[[150,30],[184,8],[190,14],[156,36]];occ(g,pn);S(g,'polygon',[pn],{strokeWidth:1.4},'hl');L(g,'M150 30 l-6 10 l12 -4','',1.3);},
ART.rtalk=function(g,svg){rbox(g,12,16,116,48,14,{strokeWidth:1.6});L(g,'M36 64 l-6 14 l18 -14','',1.6);T(g,70,45,'how many hives?','middle','xs');
  rbox(g,76,72,112,46,14,{strokeWidth:1.6},'hl');L(g,'M164 118 l8 14 l-20 -14','hl',1.6);T(g,132,100,'four, out back!','middle','xs');
  var t=trail(g,'M10 120 C40 100 50 132 70 112');fly(svg,t,1,18);};

/* sense cards: drift on their own, drag with momentum, tap to flip */
function senseStrip(){var d=document.getElementById('drift'),tr=document.getElementById('drift-track');if(!d)return;
  var x=0,v=0,half=1,down=false,moved=false,sx=0,x0=0,lx=0,lt=0,hover=false,inView=false,last=performance.now();
  function measure(){half=tr.scrollWidth/2||1;}measure();window.addEventListener('resize',measure);
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[0].isIntersecting;},{threshold:.1}).observe(d);
  d.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')hover=true;});d.addEventListener('pointerleave',function(){hover=false;});
  d.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;down=true;moved=false;sx=e.clientX;x0=x;lx=e.clientX;lt=performance.now();v=0;});
  d.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(!moved){if(Math.abs(dx)>6){moved=true;d.classList.add('drag');try{d.setPointerCapture(e.pointerId);}catch(_){}}else return;}
    var now=performance.now();x=x0+dx;v=(e.clientX-lx)/Math.max(.008,(now-lt)/1000);lx=e.clientX;lt=now;});
  function up(){if(!down)return;down=false;d.classList.remove('drag');if(!moved)v=0;}
  d.addEventListener('pointerup',up);d.addEventListener('pointercancel',up);
  d.addEventListener('click',function(e){if(moved){moved=false;e.preventDefault();return;}var c=e.target.closest('.fc');if(c)flip(c);});
  d.addEventListener('keydown',function(e){var c=e.target.closest('.fc');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();flip(c);}});
  function flip(c){var on=!c.classList.contains('flip');c.classList.toggle('flip',on);c.setAttribute('aria-pressed',on?'true':'false');}
  (function tick(now){var dt=Math.min(.05,(now-last)/1000);last=now;
    if(inView&&!down&&document.documentElement.dataset.page==='home'){var calm=document.documentElement.classList.contains('calm'),anyFlip=!!tr.querySelector('.fc.flip');
      if(Math.abs(v)>4){x+=v*dt;v*=Math.pow(.05,dt);}else{v=0;if(!calm)x-=(anyFlip?14:40)*dt;}}
    while(x<=-half)x+=half;while(x>0)x-=half;tr.style.transform='translate3d('+x.toFixed(1)+'px,0,0)';requestAnimationFrame(tick);})(last);}

/* the long night: drag the moon, tap a time, or let it play */
function nightControls(){var svg=document.getElementById('art-night');if(!svg||!NIGHT.moon)return;
  var E=[{m:1180,tag:'+3 lb today',h:'The foragers are home.',p:'The hive is 3 lb heavier than this morning. Nectar is coming in.'},
    {m:1395,tag:'brood 94°F',h:'The brood is holding at 94°F.',p:'The hum is low and even. Nothing to report.'},
    {m:1590,tag:'coldest hour',h:'The coldest hour of the night.',p:'Outside drops. The bees pull in tighter and keep the core of the hive warm.'},
    {m:1805,tag:'all quiet',h:'First light. All quiet.',p:'The hum picks up as the foragers wake. Nothing needs you today. If something did, you’d get an email.'}];
  var times=[].slice.call(document.querySelectorAll('#times button')),entry=document.getElementById('entry'),eT=document.getElementById('e-tag'),eH=document.getElementById('e-h'),eP=document.getElementById('e-p'),hint=document.getElementById('drag-hint');
  var t=0,idx=0,user=false,tw=null,inView=false,hold=0,last=performance.now(),h=NIGHT.handle;
  function fmt(m){m=Math.round(m)%1440;var hh=Math.floor(m/60),mm=m%60,ap=hh>=12?'pm':'am';hh=hh%12||12;return hh+':'+(mm<10?'0':'')+mm+' '+ap;}
  var TH=[0,.3,.58,.86];function clockAt(v){var K=[[0,1180],[.3,1395],[.58,1590],[.86,1805],[1,1860]];for(var i=1;i<K.length;i++)if(v<=K[i][0]){var u=(v-K[i-1][0])/(K[i][0]-K[i-1][0]);return K[i-1][1]+(K[i][1]-K[i-1][1])*u;}return 1860;}
  function setT(v){t=Math.max(0,Math.min(1,v));var m=clockAt(t),a=0;TH.forEach(function(th,i){if(t>=th-.0001)a=i;});NIGHT.clock.textContent=fmt(m);setNight(t);
    h.setAttribute('aria-valuenow',Math.round(t*100));h.setAttribute('aria-valuetext',fmt(m));
    if(a!==idx){idx=a;eT.textContent=E[a].tag;eH.textContent=E[a].h;eP.textContent=E[a].p;NIGHT.tagT.textContent=E[a].tag;entry.classList.remove('swap');void entry.offsetWidth;entry.classList.add('swap');
      times.forEach(function(b,i){b.setAttribute('aria-selected',i===a?'true':'false');});
      NIGHT.ev.forEach(function(g2,i){g2.classList.toggle('on',i===a);});NIGHT.owl.classList.toggle('tilt',a===1);}}
  function tween(to,ms){var from=t,t0=performance.now();tw=function(now){var u=Math.min(1,(now-t0)/ms),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;setT(from+(to-from)*e);if(u>=1)tw=null;};}
  var mh=T(h,0,-76,'drag me','middle','sm hlt');function stopAuto(){user=true;if(mh&&mh.parentNode)mh.parentNode.removeChild(mh);}
  function tFromX(x){var c=Math.max(-1,Math.min(1,(x-400)/360)),th=Math.acos(c)*180/Math.PI;return Math.max(0,Math.min(1,(165-th)/150));}
  function svgX(e){var pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse()).x;}
  var dragging=false;
  h.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();stopAuto();tw=null;dragging=true;try{h.setPointerCapture(e.pointerId);}catch(_){}});
  h.addEventListener('pointermove',function(e){if(dragging)setT(tFromX(svgX(e)));});
  function end(){if(dragging&&t>.78&&t<.86)tween(.86,400);dragging=false;}h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);
  svg.addEventListener('click',function(e){if(e.target.closest('.moon-h'))return;stopAuto();var v=tFromX(svgX(e));tween(v>.78&&v<.86?.86:v,700);});
  h.addEventListener('keydown',function(e){var k=e.key;if(k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();stopAuto();setT(t+.04);}else if(k==='ArrowLeft'||k==='ArrowDown'){e.preventDefault();stopAuto();setT(t-.04);}else if(k==='Home'){stopAuto();setT(0);}else if(k==='End'){stopAuto();setT(1);}});
  times.forEach(function(b,i){b.addEventListener('click',function(){stopAuto();tween(TH[i],900);});});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[0].isIntersecting;},{threshold:.35}).observe(svg);
  setT(0);idx=-1;setT(0);
  (function tick(now){var dt=Math.min(.05,(now-last)/1000);last=now;if(tw)tw(now);
    else if(inView&&!user&&!document.documentElement.classList.contains('calm')){if(t<1)setT(t+dt/(t<.86?22:26)*(TH.some(function(th){return Math.abs(t-th-.06)<.06;})?.35:1));else{hold+=dt;if(hold>3){hold=0;tween(0,1400);}}}
    requestAnimationFrame(tick);})(last);}

/* live hive: the example numbers tick over while you watch */
function liveTicks(){var s=document.getElementById('art-live');if(!s)return;var txt=[].slice.call(s.querySelectorAll('text')),w=null,u=null;
  txt.forEach(function(t){if(t.textContent==='82 lb')w=t;if(/updated/.test(t.textContent))u=t;});var val=82.0,n=0;
  setInterval(function(){if(document.documentElement.dataset.page!=='home'||document.hidden)return;var r=s.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
    val=Math.min(83.4,Math.max(81.6,val+(Math.random()*.3-.08)));if(w)w.textContent=val.toFixed(1)+' lb';n++;if(u)u.textContent='Back yard · updated just now';},2600);}

/* on phones the intro sketch can be dragged sideways, and the join sketch is cropped to the hive and lantern */
function phoneFit(){var mq=window.matchMedia('(max-width:700px)'),js=document.getElementById('art-join'),sc=document.getElementById('intro-scroll');
  if(!js)return;function f(){js.setAttribute('viewBox',mq.matches?'300 70 520 262':'0 0 1100 330');if(mq.matches&&sc)sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)*.52;}
  if(mq.addEventListener)mq.addEventListener('change',f);f();}
/* ---------- draw everything ---------- */
document.querySelectorAll('svg.sk[data-art]').forEach(function(s){var g=grp(s);ART[s.dataset.art](g,s);});
drawIntro();drawNight();drawLive();drawJoin();drawDoodles();phoneFit();

/* draw sketches in, line by line, as they come into view (on whichever page is showing) */
var vis=new WeakMap(),pend=[];
function drawIn(svg){var ps=[].slice.call(svg.querySelectorAll('path.ln,path.hatch')),n=ps.length,span=Math.min(2.2,.6+n/260);
  ps.forEach(function(p){var len=p.getTotalLength();if(!len)return;p.style.transition='none';p.style.strokeDasharray=len+' '+len;p.style.strokeDashoffset=len;});
  svg.getBoundingClientRect();
  ps.forEach(function(p,i){var len=p.getTotalLength();if(!len)return;var dl=(i/Math.max(1,n))*span;p.style.transition='stroke-dashoffset 1s cubic-bezier(.45,.05,.35,1) '+dl.toFixed(2)+'s';p.style.strokeDashoffset=0;
    setTimeout(function(){p.style.strokeDasharray='';p.style.transition='';p.style.strokeDashoffset='';},(dl+1.1)*1000);});}
if('IntersectionObserver' in window){
  var vio=new IntersectionObserver(function(es){es.forEach(function(e){vis.set(e.target,e.isIntersecting&&CG.inLivePage(e.target));});},{rootMargin:'80px'});
  document.querySelectorAll('#home-main svg.sk,.page svg.sk').forEach(function(s){vis.set(s,false);vio.observe(s);});
  if(!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting||!CG.inLivePage(e.target))return;io.unobserve(e.target);pend.splice(pend.indexOf(e.target),1);drawIn(e.target);});},{threshold:.2});
    document.querySelectorAll('.page svg.sk:not(.doodle-skip)').forEach(function(s){if(s.closest('.hero'))return;var pg=s.closest('.page'),r=s.getBoundingClientRect();if((pg&&pg.classList.contains('pre'))||r.top>window.innerHeight){pend.push(s);io.observe(s);}});
    CG.shown.push(function(){setTimeout(function(){pend.slice().forEach(function(s){io.unobserve(s);io.observe(s);});document.querySelectorAll('.page svg.sk').forEach(function(s){vio.unobserve(s);vio.observe(s);});},60);});}
}else document.querySelectorAll('.page svg.sk').forEach(function(s){vis.set(s,true);});

/* flying bees */
flyers.forEach(function(f){if(reduce){var p=f.path.getPointAtLength(f.L*((f.off*.8+.1)%1));f.g.setAttribute('transform','translate('+f1(p.x)+' '+f1(p.y)+')');}});
if(!reduce){(function tick(now){var t=now/1000;var calmNow=document.documentElement.classList.contains('calm');for(var i=0;i<flyers.length;i++){var f=flyers[i];if(calmNow||!vis.get(f.svg))continue;
  var u=((t*f.spd/f.L+f.off)%1);if(f.back)u=1-u;var s=u*f.L,p=f.path.getPointAtLength(s),q=f.path.getPointAtLength(Math.min(f.L,Math.max(0,s+(f.back?-3:3))));
  var a=Math.atan2(q.y-p.y,q.x-p.x)*57.3,flip=Math.abs(a)>90?' scale(1 -1)':'',bob=Math.sin(t*9+i)*1.6;
  f.g.setAttribute('transform','translate('+f1(p.x)+' '+f1(p.y+bob)+') rotate('+f1(a)+')'+flip);f.g.style.opacity=(u<.04||u>.96)?'0':'1';}
  requestAnimationFrame(tick);})(performance.now());}

/* ---------- join form ----------
   To connect a real mailing list, put your sign-up endpoint below (for example a Formspree form URL or your own
   Cloudflare Worker that talks to Resend). Never put an API key in this file: anyone can read it. */
var JOIN_ENDPOINT='';
(function(){var f=document.getElementById('join-form'),inp=document.getElementById('join-email'),done=document.getElementById('join-done');
  if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var v=inp.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){done.hidden=false;done.textContent='Please enter a full email address, like you@example.com.';inp.focus();return;}
    if(JOIN_ENDPOINT){done.hidden=false;done.textContent='Sending…';fetch(JOIN_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email:v})}).then(function(r){if(!r.ok)throw 0;done.textContent='You’re on the Watch. We’ll email you with build updates.';f.reset();}).catch(function(){done.textContent='Something went wrong. Please try again in a minute.';});return;}done.hidden=false;done.textContent='Thanks! Our mailing list isn’t open yet, so your email wasn’t saved. For now, the beekeeper survey is the best way to stay in touch.';f.reset();});})();

/* ---------- gallery: timer, swipe that follows your finger, tap a side photo or the arrows ---------- */
(function(){if(!document.getElementById('slider'))return;var sl=document.getElementById('slider'),view=document.getElementById('sl-view'),track=document.getElementById('slides'),slides=[].slice.call(track.children),dots=document.getElementById('sl-dots'),play=document.getElementById('sl-play'),
    n=slides.length,idx=0,paused=reduce,inView=false,drag=0;
  slides.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show slide '+(i+1));b.appendChild(document.createElement('i'));b.addEventListener('click',function(){go(i);});dots.appendChild(b);});
  var bs=[].slice.call(dots.children);
  function gap(){return parseFloat(getComputedStyle(track).columnGap)||22;}
  function W(){return slides[0].getBoundingClientRect().width/(slides[0].classList.contains('on')?1:.96);}
  function layout(instant){var w=slides[0].offsetWidth,cw=view.clientWidth;track.style.transition=instant?'none':'';track.style.transform='translate3d('+f1((cw-w)/2-idx*(w+gap())+drag)+'px,0,0)';}
  function go(i){idx=(i%n+n)%n;slides.forEach(function(s,k){s.classList.toggle('on',k===idx);s.setAttribute('aria-hidden',k===idx?'false':'true');});
    bs.forEach(function(b,k){b.classList.toggle('on',k===idx);b.setAttribute('aria-current',k===idx?'true':'false');var bar=b.firstChild;bar.style.animation='none';bar.offsetWidth;bar.style.animation='';});layout();
    var lab=document.getElementById('sl-lab'),sn=slides[idx].querySelector('.sn');if(lab&&sn){lab.classList.add('swap');setTimeout(function(){lab.innerHTML=sn.innerHTML;lab.classList.remove('swap');},180);}}
  bs.forEach(function(b){b.firstChild.addEventListener('animationend',function(){if(!paused&&inView)go(idx+1);});});
  function setPaused(p){paused=p;sl.classList.toggle('paused',p||!inView);play.setAttribute('aria-label',p?'Play the gallery':'Pause the gallery');}
  play.addEventListener('click',function(){setPaused(!paused);});
  view.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(idx+1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(idx-1);}});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){inView=es[0].isIntersecting;sl.classList.toggle('paused',paused||!inView);sl.classList.toggle('show',inView);},{threshold:.3}).observe(sl);}else inView=true;
  var down=false,dragging=false,moved=false,sx=0,sy=0;
  view.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;if(e.target.closest('button'))return;down=true;dragging=false;moved=false;sx=e.clientX;sy=e.clientY;});
  view.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx,dy=e.clientY-sy;
    if(!dragging){if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.2){dragging=moved=true;try{view.setPointerCapture(e.pointerId);}catch(_){}sl.classList.add('dragging');}else if(Math.abs(dy)>12){down=false;}return;}
    var atEdge=(idx===0&&dx>0)||(idx===n-1&&dx<0);drag=atEdge?dx*.35:dx;layout(true);});
  function end(){if(!down)return;down=false;if(!dragging)return;dragging=false;sl.classList.remove('dragging');var d=drag,w=slides[0].offsetWidth;drag=0;
    if(Math.abs(d)>Math.min(80,w*.12))go(idx+(d<0?1:-1));else layout();}
  view.addEventListener('pointerup',end);view.addEventListener('pointercancel',end);
  view.addEventListener('click',function(e){if(moved){moved=false;return;}if(e.target.closest('button'))return;var s=e.target.closest('.slide');
    if(s){var i=slides.indexOf(s);if(i!==idx){go(i);return;}var rc=s.getBoundingClientRect(),fx=(e.clientX-rc.left)/rc.width;if(fx<.12)go(idx-1);else if(fx>.88)go(idx+1);return;}
    var vr=view.getBoundingClientRect();go(idx+(e.clientX<vr.left+vr.width/2?-1:1));});
  window.addEventListener('resize',function(){layout(true);});setPaused(paused);go(0);})();

senseStrip();nightControls();liveTicks();
})();
