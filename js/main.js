(function(){
var IM=window.IM,U=IM.U,T=IM.TASKS,R=U.R,P=U.P;
function $(s){return document.querySelector(s);}
var S={level:1,best:1,lang:'tr',kindle:false,deck:{}};
try{var sv=JSON.parse(localStorage.getItem('im2')||'null');if(sv)for(var k in sv)S[k]=sv[k];}catch(e){}
IM.S=S;IM.save=function(){try{localStorage.setItem('im2',JSON.stringify(S));}catch(e){}};
IM.lang=S.lang;IM.kindle=S.kindle;
var run=null,view='menu',raf=0,iv=0,last=0,cid=0,inp=$('#inp'),arena=$('#arena');
function setView(v){view=v;document.body.className=(S.kindle?'k ':'')+'v-'+v;}
function lv(x){return Math.max(1,Math.min(100,x));}

/* ---------- overlay ---------- */
function ov(html,btns){var o=$('#ov');o.innerHTML='<div class="box">'+html+'<div class="bt">'+btns.map(function(b,i){return '<button data-i="'+i+'">'+b[0]+'</button>';}).join('')+'</div></div>';o.style.display='flex';
 o.onclick=function(e){var b=e.target;while(b&&b!==o&&b.tagName!=='BUTTON')b=b.parentNode;if(b&&b.tagName==='BUTTON'){o.style.display='none';var f=btns[+b.getAttribute('data-i')][1];if(f)f();}};}
function howHtml(ids){return ids.map(function(i){return '<h3>'+T[i].name[S.lang]+' <small>(L'+T[i].unlock+')</small></h3><p>'+T[i].how[S.lang]+'</p>';}).join('');}
function allIds(){return Object.keys(T).sort(function(a,b){return T[a].unlock-T[b].unlock;});}
function showHelp(){ov('<h2>'+IM.t('help')+'</h2><p>'+(S.lang==='tr'?'Kartlar ekrana düşer. Her kartın bir süresi var. Doğru cevap stresi düşürür; yanlış ya da süre aşımı yükseltir. Stres %100 olursa oyun biter. Seviye süresini (20+0,35·S² saniye) bitirirsen sonraki seviye açılır. Tab veya tıklama ile hangi kartın aktif olduğunu seçersin; yazdığın cevap aktif karta gider. Ok tuşları ve SPACE ilgili kartlara doğrudan gider. ESC: duraklat.':'Cards fall onto the arena, each with a time limit. Right answers lower stress; wrong answers or timeouts raise it. At 100% the game ends. Survive the level (20+0.35·L² seconds) to unlock the next. Tab or click picks the active card; typed answers go to it. Arrow keys and SPACE go straight to matching cards. ESC pauses.')+'</p>'+howHtml(allIds()),[[IM.t('menu'),null]]);}

/* ---------- menü ---------- */
function renderMenu(){
 $('#bl').textContent=S.lang==='tr'?'EN':'TR';$('#bk').textContent=S.kindle?IM.t('kindleOn'):IM.t('kindleOff');
 $('#menu').innerHTML='<h1>İMKANSIZ</h1><p>'+IM.t('tag')+'</p><div class="mb"><button class="pr" id="m1">'+IM.t('cont')+S.level+'</button><button id="m2">'+IM.t('newg')+'</button><button id="m3">'+IM.t('lab')+'</button><button id="m4">'+IM.t('help')+'</button></div>'+
 '<div class="lsel"><span>'+IM.t('pickLvl')+': <b id="lvn">'+S.level+'</b> / '+S.best+'</span><input type="range" id="lvr" min="1" max="'+S.best+'" value="'+Math.min(S.level,S.best)+'"></div><div class="cr">'+IM.t('credit')+'</div>';
 $('#m1').onclick=function(){beginLevel(S.level);};
 $('#m2').onclick=function(){S.level=1;S.best=1;S.deck={};IM.save();beginLevel(1);};
 $('#m3').onclick=function(){renderLab();setView('lab');};
 $('#m4').onclick=showHelp;
 $('#lvr').oninput=function(){S.level=+this.value;$('#lvn').textContent=S.level;$('#m1').textContent=IM.t('cont')+S.level;IM.save();};
}
$('#bl').onclick=function(){S.lang=S.lang==='tr'?'en':'tr';IM.lang=S.lang;document.documentElement.lang=S.lang;IM.save();refreshUI();};
$('#bk').onclick=function(){S.kindle=!S.kindle;IM.kindle=S.kindle;IM.save();setView(view);setLoop();refreshUI();};
$('#bm').onclick=function(){if(run&&!run.lab){run.paused=true;ov('<h2>'+IM.t('pause')+'</h2>',[[IM.t('resume'),function(){run.paused=false;}],[IM.t('menu'),toMenu]]);}else toMenu();};
function refreshUI(){inp.placeholder=IM.t('ph');renderMenu();if(view==='lab')renderLab();}
function toMenu(){stopRun();renderMenu();setView('menu');}

/* ---------- oyun motoru ---------- */
function stopRun(){run=null;arena.innerHTML='';$('#prog i').style.width='0';}
function pool(L){var a=[];Object.keys(T).forEach(function(id){if(T[id].unlock<=L&&(!S.kindle||T[id].kindle)){a.push(id);if(id==='math')a.push(id);}});return a;}
function beginLevel(L){stopRun();var nt=Object.keys(T).filter(function(i){return T[i].unlock===L&&(!S.kindle||T[i].kindle);});
 function go(){setView('game');run={L:L,lab:null,dur:20+.35*L*L,t:0,stress:0,cards:[],sel:null,spawnT:0,ok:0,bad:0,paused:false};inp.value='';inp.focus();hud();}
 if(nt.length)ov('<h2>'+IM.t('lvl')+' '+L+'</h2><h3>'+IM.t('newtask')+'</h3>'+howHtml(nt),[[IM.t('start'),go],[IM.t('menu'),toMenu]]);else go();}
function maxCards(L){return Math.min(9,1+Math.floor(L/9));}
function interval(L){return Math.max(1.5,7-L*.06);}
function spawn(){var L=run.L,ids=run.lab?[run.lab]:pool(L),cur=run.cards.map(function(c){return c.type;}),cand=ids.filter(function(i){return cur.indexOf(i)<0;});
 if(!cand.length)cand=ids;addCard(P(cand));}
function addCard(type){var def=T[type],L=run.L,sp=def.make(L),el=document.createElement('div'),lbl=String.fromCharCode(65+(cid++%26)),opts='';
 if(sp.kind==='choice')opts='<div class="opts">'+sp.opts.map(function(o,i){return '<button class="op" data-i="'+i+'"><kbd>'+(i+1)+'</kbd>'+o+'</button>';}).join('')+'</div>';
 el.className='card';el.innerHTML='<div class="ch"><b class="lbl">'+lbl+'</b><span class="nm">'+def.name[S.lang]+'</span><span class="tm"></span></div><div class="cb">'+sp.body+'</div>'+opts+'<div class="ans"></div><div class="bar"><i></i></div>';
 var c={el:el,spec:sp,type:type,left:sp.ttl,ttl:sp.ttl,done:false,tmEl:el.querySelector('.tm'),barEl:el.querySelector('.bar i')};
 function end(ok,msg){if(c.done)return false;c.done=true;var i=run.cards.indexOf(c);if(i>=0)run.cards.splice(i,1);
  if(sp.onResult)sp.onResult(ok);if(!run.lab){run.stress=ok?Math.max(0,run.stress-3):Math.min(100,run.stress+10+run.L*.12);}
  if(ok)run.ok++;else run.bad++;el.className='card '+(ok?'good':'bad');
  if(!ok){el.querySelector('.ans').textContent='→ '+(msg||sp.show||'');}setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},ok?(S.kindle?600:380):(S.kindle?2500:1600));
  if(run.lab)labCount();hud();return true;}
 c.pass=function(){end(true);};c.fail=function(m){end(false,m);};
 c.wrong=function(){if(!run.lab)run.stress=Math.min(100,run.stress+4);el.className='card act bad';setTimeout(function(){el.className='card';},300);hud();};
 el.onclick=function(e){run.sel=c;if(e.target.closest&&e.target.closest('.op')){choose(c,+e.target.closest('.op').getAttribute('data-i'));}};
 arena.appendChild(el);run.cards.push(c);if(sp.init)sp.init(c);}
function choose(c,i){if(c.done||c.spec.kind!=='choice')return;if(i===c.spec.ans)c.pass();else c.fail();}
function active(){if(!run)return null;var s=run.sel;if(s&&!s.done&&s.spec.kind!=='custom')return s;var b=null;
 run.cards.forEach(function(c){if(c.spec.kind==='custom')return;if(c.spec.ready&&!c.spec.ready())return;if(!b||c.left<b.left)b=c;});return b;}
function hud(){if(!run)return;var r=run.lab?0:Math.max(0,run.dur-run.t),m=Math.floor(r/60),s=Math.floor(r%60);
 $('#lv').textContent=IM.t('lvl')+' '+run.L;$('#tmr').textContent=run.lab?'LAB':(m+':'+(s<10?'0':'')+s);
 $('#st').style.width=run.stress+'%';$('#stp').textContent=IM.t('stress')+' '+Math.round(run.stress)+'%';$('#prog i').style.width=run.lab?'0':Math.min(100,run.t/run.dur*100)+'%';}
function step(dt){if(!run||run.paused)return;run.t+=dt;var L=run.L,a;
 if(run.lab){if(!run.cards.length){run.spawnT-=dt;if(run.spawnT<=0){spawn();run.spawnT=.8;}}}
 else{run.spawnT-=dt;if((run.cards.length<maxCards(L)&&run.spawnT<=0)||(!run.cards.length&&run.t>.3)){spawn();run.spawnT=interval(L)*(.7+.6*Math.random());}
  run.stress=Math.max(0,run.stress-Math.max(.05,.4-L*.004)*dt);}
 run.cards.slice().forEach(function(c){c.left-=dt;if(c.spec.update)c.spec.update(dt,c);if(c.done)return;
  c.barEl.style.width=Math.max(0,c.left/c.ttl*100)+'%';c.tmEl.textContent=Math.max(0,Math.ceil(c.left))+'s';if(c.left<=0)c.fail(IM.t('late'));});
 a=active();run.cards.forEach(function(c){var on=c===a,has=c.el.className.indexOf('act')>=0;if(on&&!has&&c.el.className==='card')c.el.className='card act';else if(!on&&has&&c.el.className==='card act')c.el.className='card';});
 hud();
 if(!run.lab){if(run.stress>=100)lose();else if(run.t>=run.dur)win();}}
function win(){var L=run.L;stopRun();S.best=Math.max(S.best,Math.min(100,L+1));S.level=Math.min(100,L+1);IM.save();
 ov('<h2>'+IM.t('won')+' · '+L+'</h2>'+(L>=100?'<p>'+IM.t('finale')+'</p>':''),[[L>=100?IM.t('menu'):IM.t('next'),L>=100?toMenu:function(){beginLevel(S.level);}],[IM.t('menu'),toMenu]]);}
function lose(){var L=run.L;stopRun();ov('<h2>'+IM.t('over')+'</h2><p>'+IM.t('lvl')+' '+L+'</p><p>'+IM.t('gameOverTip')+'</p>',[[IM.t('retry'),function(){beginLevel(L);}],[IM.t('menu'),toMenu]]);}
function setLoop(){cancelAnimationFrame&&cancelAnimationFrame(raf);clearInterval(iv);
 if(S.kindle)iv=setInterval(function(){step(1);},1000);else{last=Date.now();raf=requestAnimationFrame(fr);}}
function fr(){var n=Date.now(),dt=Math.min(.1,(n-last)/1000);last=n;step(dt);raf=requestAnimationFrame(fr);}

/* ---------- giriş ---------- */
inp.addEventListener('input',function(){var c=active();if(c&&c.spec.kind==='choice'){var v=inp.value.trim();if(/^[1-9]$/.test(v)){inp.value='';choose(c,+v-1);}}});
function submit(){var c=active();if(!c||c.spec.kind!=='text')return;if(c.spec.ready&&!c.spec.ready())return;var v=inp.value;if(!v.trim())return;inp.value='';if(c.spec.check(v))c.pass();else c.wrong();}
document.addEventListener('keydown',function(e){
 if(!run||run.paused||document.getElementById('ov').style.display==='flex')return;
 var k=e.key,ai={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3};
 if(k==='Enter'){e.preventDefault();submit();return;}
 if(k==='Escape'){if(!run.lab){run.paused=true;ov('<h2>'+IM.t('pause')+'</h2>',[[IM.t('resume'),function(){run.paused=false;}],[IM.t('menu'),toMenu]]);}return;}
 if(k==='Tab'){e.preventDefault();var cs=run.cards.filter(function(c){return c.spec.kind!=='custom';});if(!cs.length)return;var i=cs.indexOf(active());run.sel=cs[(i+1)%cs.length];return;}
 if(ai[k]!==undefined){var t=run.cards.filter(function(c){return c.spec.onArrow;})[0];if(t){e.preventDefault();t.spec.onArrow(ai[k],t);}return;}
 if(k===' '&&!inp.value){var t2=run.cards.filter(function(c){return c.spec.onSpace;})[0];if(t2){e.preventDefault();t2.spec.onSpace(t2);}return;}
 if(k.length===1&&!e.ctrlKey&&!e.metaKey&&document.activeElement!==inp)inp.focus();});
document.addEventListener('visibilitychange',function(){if(document.hidden&&run&&!run.lab&&!run.paused){run.paused=true;ov('<h2>'+IM.t('pause')+'</h2><p>'+IM.t('paused')+'</p>',[[IM.t('resume'),function(){run.paused=false;}],[IM.t('menu'),toMenu]]);}});

/* ---------- LAB ---------- */
var labId='math',labL=1;
function labCount(){var e=$('#lc');if(e&&run)e.textContent=run.ok+' '+IM.t('okc')+' · '+run.bad+' '+IM.t('badc');}
function renderLab(){
 $('#labp').innerHTML='<div class="lr"><button id="lb">← '+IM.t('menu')+'</button><b>LAB</b></div><div id="labt">'+allIds().map(function(i){return '<button data-id="'+i+'" class="'+(i===labId?'on':'')+'">'+T[i].name[S.lang]+'</button>';}).join('')+'</div>'+
 '<div id="labh"></div><div class="lr"><span>'+IM.t('lvl')+' <b id="labn">'+labL+'</b></span><input type="range" id="labl" min="1" max="100" value="'+labL+'"><button id="lrun">'+IM.t('run')+'</button><button id="lstop">'+IM.t('stop')+'</button><span id="lc"></span></div>'+
 '<div class="lr"><button id="lt">'+IM.t('tests')+'</button></div><div id="lg"></div>';
 function info(){$('#labh').textContent=T[labId].how[S.lang];}info();
 $('#lb').onclick=toMenu;
 U.qa($('#labt'),'button').forEach(function(b){b.onclick=function(){labId=b.getAttribute('data-id');U.qa($('#labt'),'button').forEach(function(x){x.className=x===b?'on':'';});info();};});
 $('#labl').oninput=function(){labL=+this.value;$('#labn').textContent=labL;};
 $('#lrun').onclick=function(){stopRun();run={L:labL,lab:labId,dur:1e9,t:0,stress:0,cards:[],sel:null,spawnT:0,ok:0,bad:0,paused:false};inp.value='';inp.focus();labCount();hud();};
 $('#lstop').onclick=function(){stopRun();};
 $('#lt').onclick=function(){$('#lg').textContent=tests().join('\n');};}
function tests(){var o=[],M=IM.math,V=IM.vox;
 function t(n,f){try{var r=f();o.push((r===true?'✔ ':'✘ ')+n+(r===true?'':' → '+r));}catch(e){o.push('✘ '+n+' → '+e.message);}}
 t('math: 14 basamak × 150 soru',function(){for(var i=1;i<=14;i++)for(var j=0;j<150;j++){var g=M.gen(1,i);if(!isFinite(g.v)||!M.check(g.s,g.v))return 'basamak '+i+': '+g.q;}return true;});
 t('math: kesir/ondalık/virgül',function(){return M.check('3/4',.75)&&M.check('0,75',.75)&&M.check('-2',-2)&&!M.check('abc',1)&&!M.check('2',3);});
 t('harf normalleştirme',function(){return U.nz('ŞEKER')==='seker'&&U.nz('İstanbul')==='istanbul'&&U.nz('to run')==='run'&&U.lc('IŞIK')==='ışık';});
 t('kelimeler yüklendi ('+IM.W.length+(IM.WJ?', words.json':', yedek liste')+')',function(){return IM.W.length>9&&IM.W.every(function(w){return typeof w[0]==='string'&&typeof w[1]==='string';});});
 t('localStorage',function(){localStorage.setItem('im_t','1');var r=localStorage.getItem('im_t')==='1';localStorage.removeItem('im_t');return r;});
 t('ses (AudioContext)',function(){return !!(window.AudioContext||window.webkitAudioContext)||'yok (Kindle olabilir)';});
 t('3B: 24 dönüş',function(){var s=V.genShape(8),c=V.canon(s);if(V.ROTS.length!==24)return V.ROTS.length;return V.ROTS.every(function(r){return V.canon(V.rot(s,r))===c;});});
 t('3B: ayna görüntüsü farklı',function(){var s=[[0,0,0],[1,0,0],[1,1,0],[1,1,1]];return V.canon(s)!==V.canon(s.map(function(v){return [-v[0],v[1],v[2]];}));});
 t('3B: mutate bağlantılı & farklı',function(){for(var i=0;i<30;i++){var s=V.genShape(7),m=V.mutate(s);if(m&&(!V.connected(m)||V.canon(m)===V.canon(s)))return 'hata';}return true;});
 t('tüm görevler L1/50/100 üretir',function(){var save=run;run={L:1,cards:[]};var bad=null;Object.keys(T).forEach(function(id){[1,50,100].forEach(function(L){try{var sp=T[id].make(L);if(typeof sp.body!=='string'||!(sp.ttl>0))bad=id+'@'+L;}catch(e){bad=id+'@'+L+' '+e.message;}});});run=save;return bad||true;});
 t('hafıza destesi',function(){IM.deckNote(['__t','test'],true);var d=IM.S.deck.__t,r=d&&d.due>Date.now();delete IM.S.deck.__t;return !!r;});
 return o;}

/* ---------- başlat ---------- */
document.documentElement.lang=S.lang;inp.placeholder=IM.t('ph');setView('menu');renderMenu();setLoop();
IM.loadWords(function(){});
IM._tests=tests;
})();
