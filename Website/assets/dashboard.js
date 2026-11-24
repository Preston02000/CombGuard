/* ---------- live hive dashboard demo (all data is made up here, in the browser) ---------- */
(function(){
var root=document.documentElement,NS='http://www.w3.org/2000/svg';
function $(id){return document.getElementById(id);}
if(!$('dash'))return;
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function cl(v,a,b){return v<a?a:v>b?b:v;}
var STEP=9e5,N=30*96,NOW=Math.floor(Date.now()/STEP)*STEP;
var CLIM={spring:{t:58,a:10,gain:.7,act:1},summer:{t:80,a:10,gain:.35,act:1},fall:{t:55,a:11,gain:-.15,act:.55},winter:{t:33,a:9,gain:-.12,act:.12}};
var HIVES=[{name:'Hive 1',where:'Back yard',w0:82,g:1,size:1,col:'var(--s1)'},{name:'Hive 2',where:'Orchard',w0:76,g:.8,size:.95,col:'var(--s2)'},{name:'Hive 3',where:'Fence line',w0:66,g:.45,size:.7,col:'var(--s3)'}];
var M=[{k:'weight',l:'Weight',u:'lb',d:1},{k:'brood',l:'Brood temp',u:'°F',d:1},{k:'co2',l:'CO₂',u:'ppm',d:0},{k:'humi',l:'Humidity inside',u:'%',d:0},{k:'hz',l:'Hum pitch',u:'Hz',d:0},{k:'tout',l:'Outside',u:'°F',d:0},{k:'batt',l:'Battery',u:'V',d:2}];
var D=null,EV=[],hive=0,metric='weight',range=1,table=false,hiEv=null;
var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function hm(ts){var d=new Date(ts),h=d.getHours(),m=d.getMinutes(),ap=h>=12?'pm':'am';h=h%12||12;return h+':'+(m<10?'0':'')+m+' '+ap;}
function dayName(ts){var d=new Date(ts),t=new Date(NOW);if(d.toDateString()===t.toDateString())return 'Today';t.setDate(t.getDate()-1);if(d.toDateString()===t.toDateString())return 'Yesterday';return DAYS[d.getDay()];}
function hourOf(ts){var d=new Date(ts);return d.getHours()+d.getMinutes()/60;}

/* ---------- example data ---------- */
function generate(){var s=root.getAttribute('data-season')||'fall',c=CLIM[s],r=rng(7),ts=[],tout=[],hout=[],solar=[],batt=[];
  var dayOff=[],cloud=[],o=0;for(var d=0;d<32;d++){o=o*.6+(r()-.5)*8;dayOff.push(o);cloud.push(r()<.3?.5+r()*.5:r()*.35);}
  var b=3.95;
  for(var i=0;i<N;i++){var t=NOW-(N-1-i)*STEP,h=hourOf(t),d=Math.floor(i/96);ts.push(t);
    var off=dayOff[d]+(dayOff[d+1]-dayOff[d])*(i%96)/96,T=c.t+off+c.a*Math.sin(2*Math.PI*(h-9)/24)+(r()-.5)*1.2;tout.push(T);
    hout.push(cl(70-(T-c.t)*1.7+(r()-.5)*4,28,98));
    var sol=Math.max(0,Math.sin(Math.PI*(h-6.5)/12.5))*6.3*(1-.65*cloud[d])+(r()-.5)*.15;sol=Math.max(0,sol);solar.push(sol);
    b+=sol>3.2?.0045:-.0011;b=cl(b,3.62,4.18);batt.push(b);}
  var out={ts:ts,tout:tout,hout:hout,solar:solar,batt:batt,hives:[]};EV=[];
  var swarmI=N-1-Math.round((NOW-atClock(2,11.67))/STEP),coolA=N-1-Math.round((NOW-lastNightAt(1.33))/STEP),coolB=coolA+13;
  HIVES.forEach(function(H,hi){var r2=rng(31+hi*17),w=[],br=[],co=[],hu=[],hz=[],gain=c.gain*H.g;
    for(var i=0;i<N;i++){var t=ts[i],h=hourOf(t),act=Math.max(0,Math.sin(Math.PI*(h-7)/12))*c.act*(tout[i]>52?1:.3),post=hi===1&&i>=swarmI;
      var base=H.w0+gain*(i/96)+gain*(h/24)*.4;var wv=base-1.05*act*H.size*(post?.6:1)+(r2()-.5)*.08;if(post)wv-=4.2;w.push(wv);
      var bv=(s==='winter'?92.6:94)+.25*Math.sin(i/9)+(r2()-.5)*.25;if(hi===2&&i>=coolA&&i<=coolB){var e=Math.min(1,Math.min(i-coolA,coolB-i)/2);bv=bv-(bv-89.2)*e;}br.push(bv);
      co.push((s==='winter'?1500:900)+850*(1-act)*H.size+(r2()-.5)*120);
      hu.push(cl(58+6*Math.sin(2*Math.PI*(h-3)/24)+(r2()-.5)*3,40,80));
      var hv=226+16*act+(r2()-.5)*7;if(hi===1&&i<swarmI&&i>swarmI-288){hv+=26*Math.pow(1-(swarmI-i)/288,1.5);}hz.push(hv);}
    out.hives.push({weight:w,brood:br,co2:co,humi:hu,hz:hz});});
  var w1=out.hives[0].weight,wk=w1[N-1]-w1[N-1-672];
  EV.push({hive:1,i:swarmI,k:'weight',sev:'crit',t:'Weight dropped 4.2 lb in 12 minutes',b:'A sudden drop in the middle of the day. Possible swarm: worth a look today.'});
  EV.push({hive:1,i:swarmI-170,k:'hz',sev:'warn',t:'The hum is climbing',b:'Peak pitch is up about 10% over two days. Colonies often get louder before they swarm.'});
  EV.push({hive:2,i:coolA+2,k:'brood',sev:'warn',t:'Brood ran cool overnight',b:'Brood temperature sat near 89°F for about 3 hours before recovering.'});
  EV.push({hive:0,i:N-1-Math.round((NOW-atClock(1,19))/STEP),k:'weight',sev:'good',t:wk>=0?'Weight up '+wk.toFixed(1)+' lb this week':'Stores holding steady',b:wk>=0?'Nectar is coming in. A good week to think about adding a super.':'Down '+Math.abs(wk).toFixed(1)+' lb this week, which is normal for the season.'});
  EV.sort(function(a,b2){return b2.i-a.i;});D=out;}
function atClock(daysAgo,h){var d=new Date(NOW);d.setDate(d.getDate()-daysAgo);d.setHours(Math.floor(h),Math.round((h%1)*60),0,0);return Math.floor(d.getTime()/STEP)*STEP;}
function lastNightAt(h){var d=new Date(NOW);if(d.getHours()<7)d.setDate(d.getDate()-1);d.setHours(Math.floor(h),Math.round((h%1)*60),0,0);if(d.getTime()>NOW-36e5)d.setDate(d.getDate()-1);return Math.floor(d.getTime()/STEP)*STEP;}
function val(k,hi,i){if(k==='tout'||k==='batt'||k==='hout'||k==='solar')return D[k][i];return D.hives[hi][k][i];}
function fmt(m,v){return v.toFixed(m.d);}
function mOf(k){for(var i=0;i<M.length;i++)if(M[i].k===k)return M[i];}

/* ---------- controls ---------- */
var hb=$('d-hives');
HIVES.forEach(function(H,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.dataset.h=i;b.innerHTML='<i class="sd" style="background:'+H.col+'"></i><span>'+H.name+'<small>'+H.where+'</small></span>';hb.appendChild(b);b.addEventListener('click',function(){hive=i;hiEv=null;render();});});
[].forEach.call(document.querySelectorAll('#d-range button'),function(b){b.addEventListener('click',function(){range=+b.dataset.r;hiEv=null;render();});});
$('d-tbl-btn').addEventListener('click',function(){table=!table;this.setAttribute('aria-pressed',table?'true':'false');this.textContent=table?'View as chart':'View as table';renderMain();});
var tilesEl=$('d-tiles');
M.forEach(function(m){var b=document.createElement('button');b.type='button';b.className='d-tile';b.dataset.k=m.k;b.innerHTML='<span class="dtl">'+m.l+'</span><span class="tv"></span><span class="td"></span><svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path/></svg>';tilesEl.appendChild(b);b.addEventListener('click',function(){metric=m.k;hiEv=null;render();});});

/* ---------- status, tiles, alerts, night ---------- */
var STAT=[{sev:'good',h:'All quiet',p:'Everything at Hive 1 is in its usual range.'},{sev:'crit',h:'Check this hive',p:''},{sev:'warn',h:'Worth a look',p:''}];
var ICO={good:'✓',warn:'!',crit:'!'},SEVL={good:'Good news',warn:'Heads up',crit:'Check now'};
function renderStatus(){var st=STAT[hive],sw=EV.filter(function(e){return e.hive===hive&&e.sev!=='good';})[0],p=st.p;
  if(sw)p=sw.t+' ('+dayName(D.ts[sw.i])+' at '+hm(D.ts[sw.i])+'). '+sw.b;
  $('d-status').innerHTML='<span class="ico '+st.sev+'" aria-hidden="true">'+ICO[st.sev]+'</span><div><b>'+HIVES[hive].name+': '+st.h+'</b><span>'+p+'</span></div>'+(sw?'<button type="button" id="d-show">Show on chart</button>':'');
  if(sw)$('d-show').addEventListener('click',function(){focusEvent(sw);});}
function spark(arr){var lo=Math.min.apply(null,arr),hi=Math.max.apply(null,arr),sp=hi-lo||1;return 'M'+arr.map(function(v,i){return (i/(arr.length-1)*100).toFixed(1)+' '+(28-(v-lo)/sp*26).toFixed(1);}).join(' L');}
function renderTiles(){var n=range*96,st=Math.max(1,Math.floor(n/60));[].forEach.call(tilesEl.children,function(b){var m=mOf(b.dataset.k),now=val(m.k,hive,N-1),ago=val(m.k,hive,N-97),dl=now-ago,arr=[];
    for(var i=N-n;i<N;i+=st)arr.push(val(m.k,hive,i));
    var extra=m.k==='tout'?' · '+Math.round(D.hout[N-1])+'%':m.k==='batt'?' · sun '+D.solar[N-1].toFixed(1)+' V':'';
    b.querySelector('.tv').innerHTML=fmt(m,now)+'<small>'+m.u+'</small>';
    b.querySelector('.td').textContent=(dl>=0?'▲ ':'▼ ')+Math.abs(dl).toFixed(m.d)+' vs. yesterday'+extra;
    b.querySelector('path').setAttribute('d',spark(arr));b.setAttribute('aria-pressed',m.k===metric?'true':'false');
    b.setAttribute('aria-label',m.l+' '+fmt(m,now)+' '+m.u+'. Show on the chart.');});}
function renderAlerts(){var ul=$('d-alerts');ul.innerHTML='';EV.forEach(function(e){var li=document.createElement('li'),b=document.createElement('button');b.type='button';if(hiEv===e)b.className='on';
    b.innerHTML='<span class="ico '+e.sev+'" aria-hidden="true">'+ICO[e.sev]+'</span><span class="am">'+SEVL[e.sev]+' · '+HIVES[e.hive].name+' · '+dayName(D.ts[e.i])+', '+hm(D.ts[e.i])+'</span><span class="at">'+e.t+'</span><span class="ab">'+e.b+'</span>';
    b.addEventListener('click',function(){focusEvent(e);});li.appendChild(b);ul.appendChild(li);});}
function focusEvent(e){hive=e.hive;metric=e.k;hiEv=e;var age=(N-1-e.i)/96;range=age<.9?1:age<6.5?7:30;render();var ch=$('d-chart');if(ch.getBoundingClientRect().top<70||ch.getBoundingClientRect().bottom>innerHeight)ch.scrollIntoView({behavior:root.classList.contains('calm')?'auto':'smooth',block:'center'});}
function renderNight(){$('d-night-h').textContent=HIVES[hive].name;var end=N-1-Math.round((NOW-lastNightAt(6))/STEP),i0=end-41,i1=end-27,lo=i0,ol=$('d-log');
  for(var i=i0;i<=end;i++)if(D.tout[i]<D.tout[lo])lo=i;var w=D.hives[hive].weight,br=D.hives[hive].brood,hz=D.hives[hive].hz,morning=i0-46,cool=EV.filter(function(e){return e.hive===hive&&e.k==='brood'&&e.i>=i0&&e.i<=end;})[0];
  var rows=[[D.ts[i0],'The foragers are home.','Weight '+w[i0].toFixed(1)+' lb, '+(w[i0]-w[morning]>=0?'up ':'down ')+Math.abs(w[i0]-w[morning]).toFixed(1)+' lb since the morning.'],
    [D.ts[i1],'Brood at '+br[i1].toFixed(1)+'°F.','The hum is steady at '+Math.round(hz[i1])+' Hz.'],
    [D.ts[lo],'Coldest hour: '+Math.round(D.tout[lo])+'°F outside.',cool?'The brood dipped to about 89°F here, so you got an email.':'Inside, the brood held at '+br[lo].toFixed(1)+'°F.'],
    [D.ts[end],'First light.',STAT[hive].sev==='good'?'All quiet. Nothing needs you today.':'There’s an alert worth reading above.']];
  ol.innerHTML=rows.map(function(r){return '<li><time>'+hm(r[0])+'</time><b>'+r[1]+'</b><span>'+r[2]+'</span></li>';}).join('');}

/* ---------- charts ---------- */
function nice(lo,hi,n){var sp=hi-lo||1,st=Math.pow(10,Math.floor(Math.log10(sp/n))),e=sp/n/st;st*=e>=5?10:e>=2?5:e>=1.5?2:1;var a=Math.floor(lo/st)*st,b=Math.ceil(hi/st)*st,out=[];for(var v=a;v<=b+st/2;v+=st)out.push(+v.toFixed(6));return out;}
function chart(box,o){box.innerHTML='';var W=box.clientWidth,Hh=box.clientHeight;if(!W)return;var ml=o.ml||46,mr=o.mr||14,mt=12,mb=26,iw=W-ml-mr,ih=Hh-mt-mb;
  var all=[];o.series.forEach(function(s){all=all.concat(s.v);});var lo=Math.min.apply(null,all),hi=Math.max.apply(null,all),pad=(hi-lo)*.12||1,ticks=nice(lo-pad,hi+pad,4),y0=ticks[0],y1=ticks[ticks.length-1];
  var n=o.series[0].v.length;function X(i){return ml+i/(n-1)*iw;}function Y(v){return mt+(1-(v-y0)/(y1-y0))*ih;}
  var svg=el('svg',{viewBox:'0 0 '+W+' '+Hh,role:'img','aria-label':o.aria},box),g=el('g',{'class':'grid'},svg),ax=el('g',{'class':'axis'},svg);
  ticks.forEach(function(t){var y=Y(t);el('line',{x1:ml,x2:W-mr,y1:y,y2:y},g);var tx=el('text',{x:ml-8,y:y+4,'text-anchor':'end'},ax);tx.textContent=(o.tf?o.tf(t):t);});
  o.xt.forEach(function(x){var tx=el('text',{x:X(x.i),y:Hh-6,'text-anchor':'middle'},ax);tx.textContent=x.l;});
  o.series.forEach(function(s,si){var d='M'+s.v.map(function(v,i){return X(i).toFixed(1)+' '+Y(v).toFixed(1);}).join(' L');
    if(o.area&&si===0)el('path',{d:d+' L'+X(n-1)+' '+(mt+ih)+' L'+ml+' '+(mt+ih)+' Z','class':'area',fill:s.c},svg);
    el('path',{d:d,'class':'ln',stroke:s.c},svg);
    if(o.labels){var lv=s.v[n-1],lt=el('text',{x:X(n-1)+6,y:Y(lv)+4,'class':'lab'},svg);lt.textContent=s.lab;}});
  (o.events||[]).forEach(function(e){var x=X(e.i),y=Y(o.series[0].v[e.i]),gg=el('g',{'class':'ev',tabindex:0,role:'button','aria-label':e.t},svg),col=e.sev==='crit'?'var(--crit)':e.sev==='warn'?'var(--warn)':'var(--good)';
    if(e.hi){el('circle',{cx:x,cy:y,r:18,fill:col,opacity:.2},gg);}el('circle',{cx:x,cy:y,r:10,fill:col},gg);var t=el('text',{x:x,y:y+4,'text-anchor':'middle'},gg);t.textContent=e.sev==='good'?'✓':'!';if(e.sev==='warn')t.style.fill='#3a2600';
    if(e.note){var a=el('text',{x:x+(x>W*.7?-16:16),y:y-14,'text-anchor':x>W*.7?'end':'start','class':'ann'},svg);a.textContent=e.note;}
    gg.addEventListener('click',function(){focusEvent(e.ref);});});
  var hov=el('g',{visibility:'hidden'},svg),xh=el('line',{'class':'xh',y1:mt,y2:mt+ih,x1:0,x2:0},hov),dots=o.series.map(function(s){return el('circle',{r:5,fill:s.c,'class':'hd',cx:0,cy:0},hov);});
  var tip=document.createElement('div');tip.className='d-tip';box.appendChild(tip);
  function move(e){var r=box.getBoundingClientRect(),px=e.clientX-r.left;if(px<ml-4||px>W-mr+4){leave();return;}var i=Math.round(cl((px-ml)/iw,0,1)*(n-1)),x=X(i);
    hov.setAttribute('visibility','visible');xh.setAttribute('x1',x);xh.setAttribute('x2',x);dots.forEach(function(d,k){d.setAttribute('cx',x);d.setAttribute('cy',Y(o.series[k].v[i]));});
    tip.innerHTML='<b>'+o.tt(i)+'</b>'+o.series.map(function(s){return '<span><i style="background:'+s.c+'"></i>'+(o.series.length>1?s.lab+': ':'')+o.vf(s.v[i])+'</span>';}).join('');
    tip.style.opacity=1;var tw=tip.offsetWidth;tip.style.left=cl(x+(x>W*.6?-tw-14:14),0,W-tw)+'px';tip.style.top=(mt+6)+'px';}
  function leave(){tip.style.opacity=0;hov.setAttribute('visibility','hidden');}
  box.onpointermove=move;box.onpointerdown=move;box.onpointerleave=leave;}
function sample(){var n=range*96,st=range===1?1:range===7?4:16,idx=[];for(var i=N-n;i<N;i+=st)idx.push(i);if(idx[idx.length-1]!==N-1)idx.push(N-1);return idx;}
function xticks(idx){var out=[];idx.forEach(function(gi,k){var d=new Date(D.ts[gi]),h=d.getHours(),m=d.getMinutes();
    if(range===1&&m===0&&h%6===0)out.push({i:k,l:h===0?'12 am':h===12?'noon':(h%12)+(h<12?' am':' pm')});
    else if(range===7&&h===12&&m===0)out.push({i:k,l:DAYS[d.getDay()]});
    else if(range===30&&h<4&&d.getDate()%5===0&&m===0)out.push({i:k,l:MON[d.getMonth()]+' '+d.getDate()});});return out;}
function renderMain(){var m=mOf(metric),idx=sample(),tt=function(k){var t=D.ts[idx[k]];return dayName(t)+', '+hm(t);},series,sub;
  var rl=range===1?'last 24 hours':'last '+range+' days';
  if(metric==='brood'||metric==='tout'){series=[{lab:'Brood (inside)',c:'var(--in)',v:idx.map(function(i){return D.hives[hive].brood[i];})},{lab:'Outside',c:'var(--out)',v:idx.map(function(i){return D.tout[i];})}];sub='Brood and outside temperature, '+rl+', °F';}
  else{series=[{lab:m.l,c:'var(--in)',v:idx.map(function(i){return val(metric,hive,i);})}];sub=m.l+', '+rl+', '+m.u+(metric==='batt'?' (the solar panel charges it by day)':'');}
  $('d-ch-title').textContent=HIVES[hive].name+': '+(metric==='tout'?'Brood vs. outside':m.l);$('d-ch-sub').textContent=sub;
  $('d-legend').innerHTML=series.length>1?series.map(function(s){return '<span><i style="background:'+s.c+'"></i>'+s.lab+'</span>';}).join(''):'';
  var evs=EV.filter(function(e){return e.hive===hive&&(e.k===metric||(metric==='tout'&&e.k==='brood'))&&e.i>=idx[0];}).map(function(e){var k=0;for(var j=0;j<idx.length;j++)if(idx[j]<=e.i)k=j;return {i:k,sev:e.sev,t:e.t,ref:e,hi:hiEv===e,note:e.sev==='crit'?'possible swarm':e.k==='brood'?'ran cool':e.k==='hz'?'hum climbing':''};});
  var ch=$('d-chart'),tb=$('d-table');ch.hidden=table;tb.hidden=!table;
  if(table){var step=range===1?4:range===7?24:96,rows=[];for(var i=N-1;i>=N-range*96;i-=step)rows.push(i);
    tb.innerHTML='<table><caption class="sr">'+sub+'</caption><thead><tr><th>Time</th>'+series.map(function(s){return '<th>'+s.lab+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(i){return '<tr><td>'+dayName(D.ts[i])+', '+hm(D.ts[i])+'</td>'+series.map(function(s){var v=s.lab==='Outside'?D.tout[i]:s.lab==='Brood (inside)'?D.hives[hive].brood[i]:val(metric,hive,i);return '<td>'+v.toFixed(m.d)+' '+(series.length>1?'°F':m.u)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>';return;}
  chart(ch,{series:series,xt:xticks(idx),tt:tt,vf:function(v){return v.toFixed(m.d)+' '+(series.length>1?'°F':m.u);},tf:function(t){return metric==='batt'?t.toFixed(1):Math.round(t*10)/10;},area:series.length===1,labels:series.length>1,mr:series.length>1?104:14,events:evs,
    aria:sub+'. Latest '+series.map(function(s){return s.lab+' '+s.v[s.v.length-1].toFixed(m.d);}).join(', ')+'.'});}
function renderCompare(){var idx=[];for(var i=N-672;i<N;i+=4)idx.push(i);idx.push(N-1);
  var series=HIVES.map(function(H,hi){var w=D.hives[hi].weight,b0=w[idx[0]];return {lab:H.name+' '+((w[N-1]-b0)>=0?'+':'')+(w[N-1]-b0).toFixed(1)+' lb',c:H.col,v:idx.map(function(i){return w[i]-b0;})};});
  $('d-cmp-legend').innerHTML=HIVES.map(function(H){return '<span><i style="background:'+H.col+'"></i>'+H.name+'</span>';}).join('');
  var save=range;range=7;var xt=xticks(idx);range=save;
  chart($('d-cmp'),{series:series,xt:xt,tt:function(k){var t=D.ts[idx[k]];return dayName(t)+', '+hm(t);},vf:function(v){return (v>=0?'+':'')+v.toFixed(1)+' lb';},tf:function(t){return (t>0?'+':'')+t;},labels:true,mr:118,ml:40,aria:'Weight change for all three hives over the last 7 days.'});}
function render(){if(!D)generate();[].forEach.call(hb.children,function(b,i){b.setAttribute('aria-checked',i===hive?'true':'false');});
  [].forEach.call(document.querySelectorAll('#d-range button'),function(b){b.setAttribute('aria-checked',+b.dataset.r===range?'true':'false');});
  renderStatus();renderTiles();renderMain();renderAlerts();renderCompare();renderNight();}

/* ---------- live feel: the clock ticks, readings refresh each minute ---------- */
var secs=0;setInterval(function(){if(root.dataset.page!=='dashboard'||document.hidden)return;secs++;if(secs>=60){secs=0;
    var h=D.hives[hive];h.weight[N-1]+=(Math.random()-.5)*.06;h.co2[N-1]+=(Math.random()-.5)*30;h.hz[N-1]+=(Math.random()-.5)*2;renderTiles();}
  $('d-upd').textContent='Live · updated '+(secs<5?'just now':secs+' s ago');},1000);
var rt=0;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(root.dataset.page==='dashboard')render();},150);});
document.addEventListener('cg-season',function(){D=null;if(root.dataset.page==='dashboard')render();});
CG.shown.push(function(pg){if(pg==='dashboard'){secs=0;render();}});
generate();
})();
