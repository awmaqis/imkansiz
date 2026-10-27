(function(){
var IM=window.IM,U=IM.U,T=IM.TASKS,R=U.R,P=U.P,origRand=Math.random;
if(!Math.imul)Math.imul=function(a,b){var ah=a>>>16&65535,al=a&65535,bh=b>>>16&65535,bl=b&65535;return (al*bl+((ah*bl+al*bh<<16)>>>0)|0);};
function prng(a){a=a>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function mix(a,b){var h=(a^Math.imul(b+0x9e3779b9|0,0x85ebca6b))>>>0;h=Math.imul(h^(h>>>16),0x45d9f3b)>>>0;h=Math.imul(h^(h>>>16),0x45d9f3b)>>>0;return (h^(h>>>16))>>>0;}
function $(s){return document.querySelector(s);}
var S={level:1,best:1,lang:'tr',kindle:false,deck:{}};
try{var sv=JSON.parse(localStorage.getItem('im2')||'null');if(sv)for(var k in sv)S[k]=sv[k];}catch(e){}
IM.S=S;IM.save=function(){try{localStorage.setItem('im2',JSON.stringify(S));}catch(e){}};
IM.lang=S.lang;IM.kindle=S.kindle;
var run=null,view='menu',raf=0,iv=0,last=0,inp=$('#inp'),arena=$('#arena');
function setView(v){view=v;document.body.className=(S.kindle?'k ':'')+'v-'+v;}
function lv(x){return Math.max(1,Math.min(100,x));}

/* ---------- overlay ---------- */
function ov(html,btns){var o=$('#ov');o.innerHTML='<div class="box">'+html+'<div class="bt">'+btns.map(function(b,i){return '<button data-i="'+i+'">'+b[0]+'</button>';}).join('')+'</div></div>';o.style.display='flex';
 o.onclick=function(e){var b=e.target;while(b&&b!==o&&b.tagName!=='BUTTON')b=b.parentNode;if(b&&b.tagName==='BUTTON'){o.style.display='none';var f=btns[+b.getAttribute('data-i')][1];if(f)f();}};}
function howHtml(ids){return ids.map(function(i){return '<h3>'+T[i].name[S.lang]+' <small>(L'+T[i].unlock+')</small></h3><p>'+T[i].how[S.lang]+'</p>';}).join('');}
function allIds(){return Object.keys(T).sort(function(a,b){return T[a].unlock-T[b].unlock;});}
function showHelp(){ov('<h2>'+IM.t('help')+'</h2><p>'+(S.lang==='tr'?'Kartlar ekrana düşer. Her kartın bir süresi var. Doğru cevap stresi 5 puan düşürür; yanlış cevap ya da süre aşımı 20 puan yükseltir, yani 5 hata oyunu bitirir. Seviye süresi 30 sn × seviye numarası kadardır. Bu süreyi dayanırsan sonraki seviye açılır ama oyun bitmez: istediğin kadar devam eder, stres %100 olunca biter. Tab veya tıklama ile hangi kartın aktif olduğunu seçersin; yazdığın cevap aktif karta gider. Ok tuşları ve SPACE ilgili kartlara doğrudan gider. ESC: duraklat.':'Cards fall onto the arena, each with a time limit. A right answer lowers stress by 5; a wrong answer or timeout raises it by 20, so 5 mistakes end the game. A level takes 30 s × level number. Survive that long and the next level unlocks, but the game keeps going: play as long as you like until stress hits 100%. Tab or click picks the active card; typed answers go to it. Arrow keys and SPACE go straight to matching cards. ESC pauses.')+'</p>'+howHtml(allIds()),[[IM.t('menu'),null]]);}

/* ---------- menü ---------- */
function renderMenu(){
 $('#bl').textContent=S.lang==='tr'?'EN':'TR';$('#bk').textContent=S.kindle?IM.t('kindleOn'):IM.t('kindleOff');
 $('#menu').innerHTML='<h1>İMKANSIZ</h1><p>'+IM.t('tag')+'</p><div class="mb"><button class="pr" id="m1">'+IM.t('cont')+S.level+'</button><button id="m2">'+IM.t('newg')+'</button><button id="m3">'+IM.t('lab')+'</button><button id="m5">'+IM.t('recs')+' ('+IM.recs.list().length+')</button><button id="m4">'+IM.t('help')+'</button></div>'+
 '<div class="lsel"><span>'+IM.t('pickLvl')+': <b id="lvn">'+S.level+'</b> / '+S.best+'</span><input type="range" id="lvr" min="1" max="'+S.best+'" value="'+Math.min(S.level,S.best)+'"></div><div class="cr">'+IM.t('credit')+'</div>';
 $('#m1').onclick=function(){beginLevel(S.level);};
 $('#m2').onclick=function(){S.level=1;S.best=1;S.deck={};IM.save();beginLevel(1);};
 $('#m3').onclick=function(){renderLab();setView('lab');};
 $('#m4').onclick=showHelp;
 $('#m5').onclick=function(){renderRecs();setView('rec');};
 $('#lvr').oninput=function(){S.level=+this.value;$('#lvn').textContent=S.level;$('#m1').textContent=IM.t('cont')+S.level;IM.save();};
}
$('#bl').onclick=function(){S.lang=S.lang==='tr'?'en':'tr';IM.lang=S.lang;document.documentElement.lang=S.lang;IM.save();refreshUI();};
$('#bk').onclick=function(){if(run&&run.rec)run.rec.bad=1;if(rp)return;S.kindle=!S.kindle;IM.kindle=S.kindle;IM.save();setView(view);setLoop();refreshUI();};
$('#bm').onclick=function(){if(rp)rpExit();else if(run&&!run.lab&&!run.paused)pauseOv();else toMenu();};
function refreshUI(){inp.placeholder=IM.t('ph');renderMenu();if(view==='lab')renderLab();if(view==='rec')renderRecs();}
function toMenu(){if(rp){rpExit();return;}if(run&&!run.lab&&!run.replay)persist('quit');stopRun();renderMenu();setView('menu');}

/* ---------- oyun motoru ---------- */
var TICK=1/30,acc=0,rp=null;
function newRun(L,lab){return {L:L,lab:lab||null,dur:lab?1e9:30*L,unlocked:false,t:0,stress:0,cards:[],sel:null,spawnT:0,ok:0,bad:0,paused:false,tick:0,nc:0,all:{},dying:[],kindle:S.kindle,seed:0,dt:S.kindle?1:TICK,rec:null,replay:null};}
function evt(){if(run&&run.rec&&!run.replay){var a=[run.tick],i;for(i=0;i<arguments.length;i++)a.push(arguments[i]);run.rec.ev.push(a);}}
function persist(res){var r=run&&run.rec;if(!r||r.bad||run.tick*run.dt<3)return;
 if(res==='quit'&&run.unlocked)res='win';r.end={tick:run.tick,un:run.unlocked?1:0,res:res,stress:Math.round(run.stress),ok:run.ok,bad:run.bad};IM.recs.put(r);}
function stopRun(){run=null;Math.random=origRand;IM.rec=null;IM.ff=false;IM.mute=false;arena.innerHTML='';arena.className='';$('#prog i').style.width='0';}
function pool(L){var a=[],K=run?run.kindle:S.kindle;Object.keys(T).forEach(function(id){if(T[id].unlock<=L&&(!K||T[id].kindle)){a.push(id);if(id==='math')a.push(id);}});return a;}
function beginLevel(L){stopRun();var nt=Object.keys(T).filter(function(i){return T[i].unlock===L&&(!S.kindle||T[i].kindle);}),t0=Date.now();
 function go(){if(!IM.wordsReady&&Date.now()<t0+3000){setTimeout(go,100);return;}
  var seed=(origRand()*4294967296)>>>0;run=newRun(L,null);run.seed=seed;
  run.rec={v:1,id:Date.now().toString(36)+Math.floor(origRand()*1e6).toString(36),ts:Date.now(),L:L,seed:seed,kindle:S.kindle,lang:S.lang,dt:run.dt,wh:IM.wh(),nW:IM.W.length,ltm:[],ev:[],res:[]};
  IM.rec=run.rec;Math.random=prng(seed);acc=0;setView('game');inp.value='';inp.focus();hud();}
 if(nt.length)ov('<h2>'+IM.t('lvl')+' '+L+'</h2><h3>'+IM.t('newtask')+'</h3>'+howHtml(nt),[[IM.t('start'),go],[IM.t('menu'),toMenu]]);else go();}
function maxCards(L){return Math.min(9,1+Math.floor(L/9));}
function interval(L){return Math.max(1.5,7-L*.06);}
function spawn(){var L=run.L,ids=run.lab?[run.lab]:pool(L),cur=run.cards.map(function(c){return c.type;}),cand=ids.filter(function(i){return cur.indexOf(i)<0;});
 if(!cand.length)cand=ids;addCard(P(cand));}
function showAns(c,msg){var sp=c.spec,h='',a=c.el.querySelector('.ans');
 if(msg)h+='<div>✘ '+U.esc(msg)+'</div>';
 if(c.last)h+='<div>'+IM.t('yours')+': '+U.esc(c.last)+'</div>';
 h+='<div class="ca">'+IM.t('right')+': <b>'+U.esc(sp.show===undefined?'':sp.show)+'</b></div>';a.innerHTML=h;
 if(sp.kind==='choice')U.qa(c.el,'.op').forEach(function(o,i){if(i===sp.ans)o.className='op right';else if(i===c.pick)o.className='op wrongpick';});}
function addCard(type){var def=T[type],L=run.L,n=run.nc++,sp,el=document.createElement('div'),lbl=String.fromCharCode(65+(n%26)),opts='';
 if(!run.lab)Math.random=prng(mix(run.seed,n*2+1));
 sp=def.make(L);
 if(sp.kind==='choice')opts='<div class="opts">'+sp.opts.map(function(o,i){return '<button class="op" data-i="'+i+'"><kbd>'+(i+1)+'</kbd>'+o+'</button>';}).join('')+'</div>';
 el.className='card';el.setAttribute('data-n',n);el.innerHTML='<div class="ch"><b class="lbl">'+lbl+'</b><span class="nm">'+def.name[S.lang]+'</span><span class="tm"></span></div><div class="cb">'+sp.body+'</div>'+opts+'<div class="ans"></div><div class="bar"><i></i></div>';
 var c={n:n,el:el,spec:sp,type:type,left:sp.ttl,ttl:sp.ttl,done:false,tmEl:el.querySelector('.tm'),barEl:el.querySelector('.bar i'),last:'',pick:-1,wt:0,rm:0};
 function end(ok,msg){if(c.done)return false;c.done=true;var i=run.cards.indexOf(c);if(i>=0)run.cards.splice(i,1);
  if(sp.onResult)sp.onResult(ok);if(!run.lab){run.stress=ok?Math.max(0,run.stress-5):Math.min(100,run.stress+20);}
  if(ok)run.ok++;else run.bad++;if(run.rec&&!run.replay)run.rec.res.push([run.tick,n,type,ok?1:0]);
  el.className='card '+(ok?'good':'bad');if(!ok)showAns(c,msg);
  c.rm=run.t+(ok?(run.kindle?.6:.38):(run.kindle?4:3.5));run.dying.push(c);
  if(run.lab)labCount();hud();return true;}
 c.pass=function(){end(true);};c.fail=function(m){end(false,m);};
 c.wrong=function(){if(sp.onWrong)sp.onWrong();if(!run.lab)run.stress=Math.min(100,run.stress+20);el.className='card act bad';c.wt=run.t+.3;hud();};
 el.onclick=function(e){run.sel=c;if(e.target.closest&&e.target.closest('.op')){choose(c,+e.target.closest('.op').getAttribute('data-i'));}};
 arena.appendChild(el);run.cards.push(c);run.all[n]=c;if(sp.init)sp.init(c);
 if(run.replay)addTools(c);
 if(!run.lab)Math.random=prng(mix(run.seed,n*2+2));}
function choose(c,i){if(c.done||c.spec.kind!=='choice')return;if(i===c.spec.ans)c.pass();else{c.pick=i;c.fail();}}
function active(){if(!run)return null;var s=run.sel;if(s&&!s.done&&s.spec.kind!=='custom')return s;var b=null;
 run.cards.forEach(function(c){if(c.spec.kind==='custom')return;if(c.spec.ready&&!c.spec.ready())return;if(!b||c.left<b.left)b=c;});return b;}
function hud(){if(!run)return;var r=run.lab?0:Math.max(0,run.dur-run.t),m=Math.floor(r/60),s=Math.floor(r%60);
 $('#lv').textContent=IM.t('lvl')+' '+run.L;$('#tmr').textContent=run.lab?'LAB':run.unlocked?'✔ ∞':(m+':'+(s<10?'0':'')+s);
 $('#st').style.width=run.stress+'%';$('#stp').textContent=IM.t('stress')+' '+Math.round(run.stress)+'%';$('#prog i').style.width=run.lab?'0':run.unlocked?'100':Math.min(100,run.t/run.dur*100)+'%';}
function paint(){if(!run)return;run.cards.forEach(function(c){c.barEl.style.width=Math.max(0,c.left/c.ttl*100)+'%';c.tmEl.textContent=Math.max(0,Math.ceil(c.left))+'s';});
 var a=active();run.cards.forEach(function(c){var on=c===a,has=c.el.className.indexOf('act')>=0;if(on&&!has&&c.el.className==='card')c.el.className='card act';else if(!on&&has&&c.el.className==='card act')c.el.className='card';});hud();}
function step(dt){if(!run||run.paused)return;run.t+=dt;var L=run.L;
 if(run.lab){if(!run.cards.length){run.spawnT-=dt;if(run.spawnT<=0){spawn();run.spawnT=.8;}}}
 else{run.spawnT-=dt;if((run.cards.length<maxCards(L)&&run.spawnT<=0)||(!run.cards.length&&run.t>.3)){spawn();run.spawnT=interval(L)*(.7+.6*Math.random());}}
 run.cards.slice().forEach(function(c){c.left-=dt;if(c.spec.update)c.spec.update(dt,c);if(c.done)return;
  if(c.wt&&run.t>=c.wt){c.wt=0;c.el.className='card';}if(c.left<=0)c.fail(IM.t('late'));});
 run.dying=run.dying.filter(function(c){if(run.t<c.rm)return true;if(c.el.parentNode)c.el.parentNode.removeChild(c.el);return false;});
 run.tick++;if(!IM.ff)paint();
 if(!run.lab){if(run.stress>=100){if(run.replay)run.ended='lose';else lose();}else if(run.t>=run.dur&&!run.unlocked){run.unlocked=true;if(!run.replay)unlock();}}}
function unlock(){var L=run.L;S.best=Math.max(S.best,Math.min(100,L+1));S.level=Math.min(100,L+1);IM.save();
 var t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
 t.textContent=(L>=100?IM.t('finale'):IM.t('unlocked'));t.style.display='block';clearTimeout(t._h);t._h=setTimeout(function(){t.style.display='none';},6000);}
function lose(){var L=run.L;persist('lose');stopRun();ov('<h2>'+IM.t('over')+'</h2><p>'+IM.t('lvl')+' '+L+'</p><p>'+IM.t('gameOverTip')+'</p><p>'+IM.t('recSaved')+'</p>',[[IM.t('retry'),function(){beginLevel(L);}],[IM.t('menu'),toMenu]]);}
function setLoop(){cancelAnimationFrame(raf);clearInterval(iv);
 if(S.kindle)iv=setInterval(function(){if(run&&!run.replay&&!run.paused)step(1);},1000);else{last=Date.now();raf=requestAnimationFrame(fr);}}
function fr(){var n=Date.now(),dt=Math.min(.1,(n-last)/1000),g=0;last=n;
 if(run&&!run.replay&&!run.paused){acc+=dt;while(acc>=TICK&&run&&!run.replay&&g++<6){acc-=TICK;step(TICK);}}else acc=0;
 raf=requestAnimationFrame(fr);}

/* ---------- giriş (kayıt edilen eylemler) ---------- */
function doSubmit(c,v){evt('s',v);if(c.spec.check(v))c.pass();else{c.last=v;c.wrong();}}
function doDigit(c,n){evt('d',n);choose(c,n-1);}
function doTab(){var cs=run.cards.filter(function(c){return c.spec.kind!=='custom';});if(!cs.length)return;evt('T');var i=cs.indexOf(active());run.sel=cs[(i+1)%cs.length];}
function doArrow(d){var t=run.cards.filter(function(c){return c.spec.onArrow;})[0];if(!t)return false;evt('A',d);t.spec.onArrow(d,t);return true;}
function doSpace(){var t=run.cards.filter(function(c){return c.spec.onSpace;})[0];if(!t)return false;evt('S');t.spec.onSpace(t);return true;}
inp.addEventListener('input',function(){var c=active();if(c&&c.spec.kind==='choice'){var v=inp.value.trim();if(/^[1-9]$/.test(v)){inp.value='';doDigit(c,+v);}}});
function submit(){var c=active();if(!c||c.spec.kind!=='text')return;if(c.spec.ready&&!c.spec.ready())return;var v=inp.value;if(!v.trim())return;inp.value='';doSubmit(c,v);}
function pauseOv(extra){run.paused=true;var b=[[IM.t('resume'),function(){run.paused=false;}]];
 if(run.unlocked&&run.L<100)b.push([IM.t('nextL'),function(){persist('win');beginLevel(S.level);}]);b.push([IM.t('menu'),toMenu]);ov('<h2>'+IM.t('pause')+'</h2>'+(extra||''),b);}
document.addEventListener('keydown',function(e){
 if(rp){rpKey(e);return;}
 if(!run||run.paused||document.getElementById('ov').style.display==='flex')return;
 var k=e.key,ai={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3};
 if(k==='Enter'){e.preventDefault();submit();return;}
 if(k==='Escape'){if(!run.lab)pauseOv();return;}
 if(k==='Tab'){e.preventDefault();doTab();return;}
 if(ai[k]!==undefined){if(doArrow(ai[k]))e.preventDefault();return;}
 if(k===' '&&!inp.value){if(doSpace())e.preventDefault();return;}
 if(k.length===1&&!e.ctrlKey&&!e.metaKey&&document.activeElement!==inp)inp.focus();});
['click','mousedown','touchstart'].forEach(function(ty){arena.addEventListener(ty,function(e){
 if(!run||!e.isTrusted)return;
 if(run.replay){rpGuard(e);return;}
 if(!run.rec||!e.target.closest)return;var card=e.target.closest('.card');if(!card)return;
 var idx=Array.prototype.indexOf.call(card.querySelectorAll('*'),e.target);if(idx<0)return;
 evt('C',ty,+card.getAttribute('data-n'),idx);},true);});
document.addEventListener('visibilitychange',function(){if(!document.hidden)return;
 if(rp){rpPause();return;}
 if(run&&!run.lab&&!run.paused){persist('quit');pauseOv('<p>'+IM.t('paused')+'</p>');}});
window.addEventListener('pagehide',function(){if(run&&!run.lab&&!run.replay)persist('quit');});

/* ---------- kayıt listesi ---------- */
function mmss(s){return Math.floor(s/60)+':'+('0'+Math.floor(s%60)).slice(-2);}
function renderRecs(){var L=IM.recs.list(),h='<div class="lr"><button id="rl0">← '+IM.t('menu')+'</button><b>'+IM.t('recs')+'</b><button id="rlx">'+IM.t('exp')+'</button><button id="rli">'+IM.t('imp')+'</button></div><div id="rlm"></div>';
 if(IM.recs.dropped)h+='<p class="mu">'+IM.t('dropped')+'</p>';
 if(!L.length)h+='<p class="mu">'+IM.t('noRecs')+'</p>';
 L.forEach(function(m){var d=new Date(m.ts),cls=m.res==='win'?'g':m.res==='lose'?'b':'m',tx=m.res==='win'?IM.t('rWin'):m.res==='lose'?IM.t('rLose'):IM.t('rQuit');
  h+='<div class="ri"><div class="rin"><b>'+d.toLocaleDateString()+' '+d.toLocaleTimeString().slice(0,5)+'</b> · '+IM.t('lvl')+' '+m.L+(m.kindle?' · K':'')+' · <span class="'+cls+'">'+tx+'</span>'+(m.un&&m.res==='lose'?' <span class="g">✔ '+IM.t('rWin')+'</span>':'')+' · '+mmss(m.sec)+' · ✔'+m.ok+' ✘'+m.bad+'</div><div class="rib"><button data-w="'+m.id+'">'+IM.t('watch')+'</button><button data-d="'+m.id+'">'+IM.t('del')+'</button></div></div>';});
 $('#recp').innerHTML=h;
 $('#rl0').onclick=toMenu;
 $('#rlx').onclick=function(){try{var b=new Blob([IM.recs.exportAll()],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='imkansiz-replays.json';document.body.appendChild(a);a.click();document.body.removeChild(a);}catch(x){}};
 $('#rli').onclick=function(){var f=document.createElement('input');f.type='file';f.accept='.json,application/json';f.onchange=function(){var r=new FileReader();r.onload=function(){var n=IM.recs.importText(String(r.result));if(n<0)alert(IM.t('impBad'));else{renderRecs();$('#rlm').textContent=IM.t('impOk')+' '+n;}};r.readAsText(f.files[0]);};f.click();};
 U.qa($('#recp'),'button[data-w]').forEach(function(b){b.onclick=function(){var r=IM.recs.get(b.getAttribute('data-w'));if(r)startReplay(r);};});
 U.qa($('#recp'),'button[data-d]').forEach(function(b){b.onclick=function(){if(confirm(IM.t('delAsk'))){IM.recs.del(b.getAttribute('data-d'));renderRecs();}};});}

/* ---------- tekrar (replay): aynı tohum + aynı girdiler = aynı oyun ---------- */
function mkReplayRun(rec){var r=newRun(rec.L,null);r.kindle=rec.kindle;r.seed=rec.seed;r.dt=rec.dt;r.replay=rec;r.ei=0;r.ended='';return r;}
function rpReset(){arena.innerHTML='';Math.random=prng(rp.rec.seed);IM.rp={ltm:rp.rec.ltm,ltmI:0};run=mkReplayRun(rp.rec);}
function applyEv(e){var k=e[1],c;
 if(k==='s'){c=active();if(c&&c.spec.kind==='text'&&(!c.spec.ready||c.spec.ready())&&String(e[2]).trim())doSubmit(c,e[2]);}
 else if(k==='d'){c=active();if(c&&c.spec.kind==='choice')doDigit(c,e[2]);}
 else if(k==='T')doTab();else if(k==='A')doArrow(e[2]);else if(k==='S')doSpace();
 else if(k==='C'){c=run.all[e[3]];if(c){var el=c.el.querySelectorAll('*')[e[4]];if(el)el.dispatchEvent(e[2]==='touchstart'?new Event('touchstart',{bubbles:true,cancelable:true}):new MouseEvent(e[2],{bubbles:true,cancelable:true}));}}}
function rpTick(){var r=run,ev=rp.rec.ev;if(r.ended||r.tick>=rp.end)return false;
 while(r.ei<ev.length&&ev[r.ei][0]<=r.tick){applyEv(ev[r.ei]);r.ei++;}step(rp.TICK);return true;}
function rpSeek(tk){tk=Math.max(0,Math.min(rp.end,Math.round(tk)));if(tk<run.tick)rpReset();
 IM.ff=true;IM.mute=true;while(run.tick<tk&&rpTick()){}IM.ff=false;IM.mute=false;
 run.cards.forEach(function(c){if(c.spec.paint)c.spec.paint();});paint();rpRefresh();rpBar();}
function startReplay(rec){stopRun();rp={rec:rec,playing:false,speed:1,acc:0,auto:true,end:rec.end?rec.end.tick:0,TICK:rec.dt,last:Date.now(),raf:0,tmo:0};
 IM.kindle=rec.kindle;setView('replay');rpBuild();rpReset();
 if(rec.wh!==undefined&&rec.wh!==IM.wh())$('#rwn').textContent=IM.t('rWarn');
 hud();rpPlay();cancelAnimationFrame(rp.raf);rp.raf=requestAnimationFrame(rpLoop);}
function rpExit(){if(!rp)return;cancelAnimationFrame(rp.raf);clearTimeout(rp.tmo);rp=null;IM.rp=null;IM.kindle=S.kindle;stopRun();renderRecs();setView('rec');}
function rpLoop(){if(!rp)return;rp.raf=requestAnimationFrame(rpLoop);var n=Date.now(),dt=Math.min(.1,(n-rp.last)/1000),g=0;rp.last=n;
 if(!rp.playing)return;rp.acc+=dt*rp.speed;
 while(rp.acc>=rp.TICK&&g<60){g++;rp.acc-=rp.TICK;if(!rpTick()){rpPause();$('#rwn').textContent=IM.t('rEnd');break;}}
 if(g>=60)rp.acc=0;rpBar();}
function rpPlay(){if(run.tick>=rp.end||run.ended)rpSeek(0);rp.playing=true;rp.acc=0;$('#rwn').textContent='';arena.className='pl';$('#rpp').textContent=IM.t('rPause');rpRefresh();}
function rpPause(){if(!rp)return;rp.playing=false;arena.className='ps';$('#rpp').textContent=IM.t('rPlay');rpRefresh();}
function rpBuild(){var rec=rp.rec;
 $('#rb').innerHTML='<div class="rtl"><input type="range" id="rs" min="0" max="'+rp.end+'" value="0"><div id="rm"></div></div>'+
 '<div class="rr"><button id="r0">'+IM.t('rRestart')+'</button><button id="rpp"></button><button id="rpv">'+IM.t('prevBad')+'</button><button id="rnx">'+IM.t('nextBad')+'</button><span id="rt"></span>'+
 '<span class="rsp">'+[.25,.5,1,2,4,8].map(function(x){return '<button data-sp="'+x+'" class="'+(x===1?'on':'')+'">'+x+'×</button>';}).join('')+'</span>'+
 '<label><input type="checkbox" id="rau" checked> '+IM.t('rAuto')+'</label><button id="rx">'+IM.t('exitR')+'</button></div><div class="rh"><span id="rwn"></span> '+IM.t('rHint')+'</div>';
 var tot=Math.max(1,rp.end),mk='';rec.res.forEach(function(r){if(!r[3])mk+='<i style="left:'+(r[0]/tot*100).toFixed(2)+'%"></i>';});$('#rm').innerHTML=mk;
 $('#rpp').onclick=function(){this.blur();rp.playing?rpPause():rpPlay();};
 $('#r0').onclick=function(){this.blur();rpSeek(0);};
 $('#rx').onclick=rpExit;
 $('#rau').onchange=function(){rp.auto=this.checked;rpRefresh();};
 $('#rs').oninput=function(){var v=+this.value;rpBar(true);clearTimeout(rp.tmo);rp.tmo=setTimeout(function(){rpSeek(v);},60);};
 U.qa($('#rb'),'button[data-sp]').forEach(function(b){b.onclick=function(){this.blur();rp.speed=+b.getAttribute('data-sp');U.qa($('#rb'),'button[data-sp]').forEach(function(x){x.className=x===b?'on':'';});};});
 function bad(dir){var t=run.tick,L=rp.rec.res.filter(function(r){return !r[3];}),x=null,i;
  if(dir>0){for(i=0;i<L.length;i++)if(L[i][0]+1>t){x=L[i];break;}}else{for(i=L.length-1;i>=0;i--)if(L[i][0]+1<t-1){x=L[i];break;}}
  if(x){rpPause();rpSeek(x[0]+1);}}
 $('#rpv').onclick=function(){this.blur();bad(-1);};$('#rnx').onclick=function(){this.blur();bad(1);};}
function rpBar(drag){if(!rp||!run)return;var s=$('#rs');if(!drag)s.value=run.tick;$('#rt').textContent=mmss((drag?+s.value:run.tick)*rp.TICK)+' / '+mmss(rp.end*rp.TICK);}
function rpKey(e){var t=e.target;if(t&&t.className==='rpi')return;var k=e.key;
 if(k===' '){e.preventDefault();rp.playing?rpPause():rpPlay();}
 else if(k==='ArrowRight'){e.preventDefault();rpSeek(run.tick+2/rp.TICK*(rp.TICK<1?1:.5));}
 else if(k==='ArrowLeft'){e.preventDefault();rpSeek(run.tick-2/rp.TICK*(rp.TICK<1?1:.5));}
 else if(k==='Escape')rpExit();}
/* duraklatılmışken kartlarla (oyunu etkilemeyen) oynama */
function addTools(c){var sp=c.spec,tb=document.createElement('div'),i,g;tb.className='rpt';
 tb.innerHTML='<div class="rpa"></div><div class="rpr"><button class="rpe">👁 '+IM.t('rAns')+'</button>'+(sp.kind==='text'?'<input class="rpi" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="rpg">?</button>':'')+'</div>';
 c.el.appendChild(tb);tb.onclick=function(e){e.stopPropagation();};
 tb.querySelector('.rpe').onclick=function(e){e.stopPropagation();c.peek=!c.peek;rpRefresh();};
 g=tb.querySelector('.rpg');
 if(g){i=tb.querySelector('.rpi');var chk=function(){if(!i.value.trim())return;c.rpmsg=sp.check(i.value)?'ok':'no';rpRefresh();};
  g.onclick=function(e){e.stopPropagation();chk();};i.onkeydown=function(e){e.stopPropagation();if(e.key==='Enter')chk();};}}
function rpRefresh(){if(!rp||!run)return;var ps=!rp.playing;
 run.cards.forEach(function(c){var sh=ps&&(c.peek||rp.auto),pa=c.el.querySelector('.rpa'),h='';if(!pa)return;
  if(sh)h+='<span class="ca">'+IM.t('right')+': <b>'+U.esc(c.spec.show===undefined?'':c.spec.show)+'</b></span> ';
  if(c.rpmsg)h+='<span class="'+(c.rpmsg==='ok'?'g':'b')+'">'+(c.rpmsg==='ok'?'✔ '+IM.t('yes'):'✘ '+IM.t('no'))+'</span>';
  pa.innerHTML=h;
  if(c.spec.kind==='choice')U.qa(c.el,'.op').forEach(function(o,i){var k='op';if(sh&&i===c.spec.ans)k+=' right';if(c.mark&&c.mark.i===i)k+=c.mark.good?' right':' wrongpick';o.className=k;});});}
function rpGuard(e){var t=e.target;if(!t.closest||t.closest('.rpt'))return;e.stopPropagation();
 if(e.type==='click'&&!rp.playing){var op=t.closest('.op');if(op){var card=op.closest('.card'),c=run.all[+card.getAttribute('data-n')];
  if(c&&!c.done){var i=+op.getAttribute('data-i'),good=i===c.spec.ans;c.mark={i:i,good:good};c.rpmsg=good?'ok':'no';rpRefresh();}}}}

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
 $('#lrun').onclick=function(){stopRun();run=newRun(labL,labId);acc=0;inp.value='';inp.focus();labCount();hud();};
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
IM.loadWords(function(){IM.wordsReady=1;if(run&&run.rec)run.rec.bad=1;});
IM._tests=tests;
})();
