(function(){
var IM=window.IM,U=IM.U,R=U.R,P=U.P,T=IM.TASKS={};
function tm(b,L){return b*Math.max(.35,1-L*.0065);}
function fl(s){return s;}
function def(id,unlock,name,how,make){T[id]={id:id,unlock:unlock,name:name,how:how,make:make};}
function big(s,c){return '<div class="big'+(c?' '+c:'')+'">'+s+'</div>';}
function tag(s){return '<div class="tag">'+s+'</div>';}
function flash(o){var t=0,hid=false;
 return {kind:'text',body:'<div class="fl">'+o.shown+'</div>',check:o.check,show:o.show,ttl:o.sec+o.ans,onResult:o.onResult,
  ready:function(){return hid;},
  update:function(dt,c){t+=dt;if(!hid&&t>=o.sec){hid=true;c.el.querySelector('.fl').innerHTML=o.hidden;}}};}
function ago(ms){var m=Math.round(ms/60000);return m<90?m+' dk':m<2880?Math.round(m/60)+' sa':Math.round(m/1440)+' g';}
function pickW(L,o){return IM.pickWord(L,o);}
function accepts(w){var a=[U.nz(w[1])];if(w[2])String(w[2]).split('|').forEach(function(x){if(x)a.push(U.nz(x));});return a;}
function wordCard(w,L,tagTxt,res){
 var rev=Math.random()<.5,strict=L>50,en=w[1].replace(/^to /,''),miss=false,r2=function(ok){res&&res(ok&&!miss);},ow=function(){miss=true;};
 if(!rev){var A=accepts(w);return {kind:'text',body:(tagTxt?tag(tagTxt):'')+tag('TR → EN')+big(U.esc(w[0])),check:function(t){return A.indexOf(U.nz(t))>=0;},show:en,ttl:tm(12,L),onResult:r2,onWrong:ow};}
 var tr=IM.idxEn[U.nz(w[1])]||[U.nz(w[0])],trx=IM.idxEx[U.nz(w[1])]||[U.lc(w[0])];
 return {kind:'text',body:(tagTxt?tag(tagTxt):'')+tag('EN → TR')+big(U.esc(w[1])),
  check:function(t){return strict?trx.indexOf(U.lc(t.trim()))>=0:tr.indexOf(U.nz(t))>=0;},show:w[0],ttl:tm(13,L),onResult:r2,onWrong:ow};}

def('math',1,{tr:'Matematik',en:'Math'},
 {tr:'Kartta bir formül görünür. Sonucu hesapla ve alttaki kutuya yazıp Enter\'a bas. Cevap sayı ya da a/b kesridir (örn. 3/4). Zorluk okuldaki gibi basamak basamak artar: aritmetik, kesirler, denklemler, üsler, ikinci derece, logaritma, trigonometri, limit, türev, integral, seriler, karmaşık sayılar, matrisler.',
  en:'A formula appears on the card. Solve it, type the result in the box and press Enter. Answers are numbers or a/b fractions (e.g. 3/4). Difficulty climbs like school: arithmetic, fractions, equations, powers, quadratics, logs, trig, limits, derivatives, integrals, series, complex numbers, matrices.'},
 function(L){var g=IM.math.gen(L);return {kind:'text',body:'<div class="q">'+U.esc(g.q).replace(/\n/g,'<br>')+'</div>',check:function(t){return IM.math.check(t,g.v);},show:g.s,ttl:tm(22+g.tier*4,L)};});

def('words',3,{tr:'Kelime',en:'Words'},
 {tr:'Türkçe kelime görürsün: İngilizcesini yaz. İngilizce görürsen: Türkçesini yaz. 50. seviyeye kadar ç, ğ, ı, ö, ş, ü yerine c, g, i, o, s, u yazabilirsin; 50\'den sonra harfler tam doğru olmalı. Yanlış cevap kartı düşürmez ama stres yükler. Seviye yükseldikçe daha nadir ve zor kelimeler gelir.',
  en:'You see a Turkish word: type its English meaning. You see English: type the Turkish. Until level 50 you may type c, g, i, o, s, u instead of ç, ğ, ı, ö, ş, ü; after that letters must be exact. A wrong answer keeps the card but adds stress. Higher levels bring rarer, harder words.'},
 function(L){var w=pickW(L);return wordCard(w,L,'',function(ok){IM.deckNote(w,ok);});});

def('type',5,{tr:'Hızlı yazı',en:'Typing'},
 {tr:'Kartta yazan Türkçe metni aynen yaz ve Enter\'a bas. Başta kısa kelimeler, sonra uzun cümleler ve atasözleri gelir. 50. seviyeden sonra Türkçe harfler (ç ğ ı ö ş ü) zorunludur.',
  en:'Type the Turkish text on the card exactly and press Enter. Short words first, later long sentences and proverbs. After level 50 Turkish letters (ç ğ ı ö ş ü) are mandatory.'},
 function(L){var p;if(L>=12&&Math.random()<.5)p=P(IM.SENT);else{var n=1+Math.floor(L/9),a=[];for(var i=0;i<n;i++)a.push(pickW(L,{nospace:1,maxLen:Math.max(5,3+Math.floor(L/4))})[0]);p=a.join(' ');}
  return {kind:'text',body:big(U.esc(p),'sel'),check:function(t){t=t.replace(/\s+/g,' ').trim();return L>50?U.lc(t)===U.lc(p):U.nz(t)===U.nz(p);},show:p,ttl:tm(4+p.length*.5,L)};});

var AR=['↑','→','↓','←'];
def('arrows',7,{tr:'Ok dizisi',en:'Arrows'},
 {tr:'Kartta oklar sırayla görünür. Aynı sırayla ok tuşlarına bas (ya da kartın altındaki düğmelere dokun). "TERS SIRADA" yazıyorsa sondan başa, "ZITINA" yazıyorsa her okun tersine bas. Bir yanlış basış kartı düşürür.',
  en:'Arrows appear on the card. Press the arrow keys in the same order (or tap the buttons under the card). If it says "REVERSE" press from last to first; if "OPPOSITE" press the opposite of each arrow. One wrong press fails the card.'},
 function(L){var n=2+Math.floor(L/14),mode='same',seq=[],i,st=0;
  if(L>=35&&Math.random()<.4)mode='rev';if(L>=55&&Math.random()<.4)mode=Math.random()<.5?'opp':'rev';
  for(i=0;i<n;i++)seq.push(R(0,3));
  var tg=seq.map(function(d){return mode==='opp'?(d+2)%4:d;});if(mode==='rev')tg.reverse();
  var lab=mode==='rev'?IM.t('arrRev'):mode==='opp'?IM.t('arrOpp'):'';
  var sp={kind:'custom',ttl:tm(5+n*2,L),show:tg.map(function(d){return AR[d];}).join(' '),
   body:'<div class="seq">'+seq.map(function(d){return '<span>'+AR[d]+'</span>';}).join('')+'</div>'+(lab?tag(lab):'')+'<div class="pad">'+AR.map(function(a,k){return '<button data-d="'+k+'">'+a+'</button>';}).join('')+'</div>'};
  sp.onArrow=function(d,c){if(c.done)return;if(d!==tg[st]){c.fail();return;}
   c.el.querySelectorAll('.seq span')[mode==='rev'?n-1-st:st].className='dn';st++;if(st>=n)c.pass();};
  sp.init=function(c){U.qa(c.el,'.pad button').forEach(function(b){b.onclick=function(){sp.onArrow(+b.getAttribute('data-d'),c);};});};
  return sp;});

def('react',17,{tr:'Refleks',en:'Reaction'},
 {tr:'Kutu kırmızı iken bekle. Yeşile dönüp "ŞİMDİ!" yazdığı anda SPACE\'e bas (veya kutuya dokun). Erken basarsan ya da geç kalırsan kart düşer. Yüksek seviyelerde art arda birkaç tur vardır ve tepki süren kısalır.',
  en:'Wait while the box is red. The instant it turns green and says "NOW!" press SPACE (or tap the box). Too early or too late fails the card. At high levels there are several rounds in a row and your window shrinks.'},
 function(L){var rounds=1+Math.floor(L/30),r=0,st='wait',t=0,d=R(12,32)/10,win=Math.max(.38,1.1-L*.008);
  var sp={kind:'custom',body:'<div class="rpad wait">'+IM.t('wait')+'</div>',ttl:rounds*(3.5+win+1.5)+2,show:IM.t('reactAns')};
  function pd(c){return c.el.querySelector('.rpad');}
  sp.hit=function(c){if(c.done)return;if(st==='wait'){c.fail(IM.t('early'));return;}r++;
   if(r>=rounds){c.pass();return;}st='wait';t=0;d=R(12,32)/10;pd(c).className='rpad wait';pd(c).textContent=IM.t('wait');};
  sp.onSpace=sp.hit;
  sp.init=function(c){var p=pd(c);p.onmousedown=p.ontouchstart=function(e){e.preventDefault();sp.hit(c);};};
  sp.update=function(dt,c){t+=dt;if(st==='wait'&&t>=d){st='go';t=0;pd(c).className='rpad go';pd(c).textContent=IM.t('now');}
   else if(st==='go'&&t>win)c.fail(IM.t('late'));};
  return sp;});

var AC=null;
IM.tones=function(fr,dur){if(IM.mute||(IM.S&&IM.S.mute))return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.resume)AC.resume();
 var t0=AC.currentTime+.05;fr.forEach(function(f,i){var o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;
  g.gain.setValueAtTime(0,t0+i*dur);g.gain.linearRampToValueAtTime(.25,t0+i*dur+.02);g.gain.linearRampToValueAtTime(0,t0+i*dur+dur*.92);
  o.connect(g);g.connect(AC.destination);o.start(t0+i*dur);o.stop(t0+i*dur+dur);});}catch(e){}};
def('sound',28,{tr:'Ses',en:'Sound'},
 {tr:'Kısa bir ses dizisi çalar (ses açık olsun!). Sorulan sesin (en yüksek ya da en alçak) kaçıncı olduğunu seç: kartta 1, 2, 3… tuşuna bas ya da düğmeye dokun. "Tekrar dinle" bedava. Yüksek seviyelerde sesler birbirine çok yakındır.',
  en:'A short tone sequence plays (turn the volume on!). Pick which tone was the highest or the lowest: press 1, 2, 3… or tap the button. "Replay" is free. At high levels the tones are very close in pitch.'},
 function(L){var n=3+Math.floor(L/35),gap=Math.max(1,5-Math.floor(L/20)),ks=[],tr=0,hi=Math.random()<.5;
  while(ks.length<n&&tr++<800){var k=R(-12,12),ok=true;ks.forEach(function(x){if(Math.abs(x-k)<gap)ok=false;});if(ok)ks.push(k);}
  while(ks.length<n)ks.push(R(-12,12)+ks.length*.01);
  var ex=hi?Math.max.apply(null,ks):Math.min.apply(null,ks),idx=ks.indexOf(ex),fr=ks.map(function(k){return 440*Math.pow(2,k/12);});
  var sp={kind:'choice',body:tag(hi?IM.t('hi'):IM.t('lo'))+'<button class="rp">'+IM.t('replay')+'</button>',opts:ks.map(function(k,i){return '♪ '+(i+1);}),ans:idx,show:String(idx+1),ttl:tm(10+n*2,L)};
  function play(){IM.tones(fr,.4);}
  sp.init=function(c){play();c.el.querySelector('.rp').onclick=play;};return sp;});

def('odd',15,{tr:'Farklı olan',en:'Odd one out'},
 {tr:'Dört (sonra beş) kelimeden üçü aynı gruptandır (hayvan, meyve, renk, meslek…). Farklı gruptan olanı bul: numarasına bas ya da dokun.',
  en:'Of four (later five) Turkish words, all but one belong to the same group (animal, fruit, colour, job…). Find the odd one: press its number or tap it.'},
 function(L){var ks=Object.keys(IM.CATS),a=P(ks),b;do{b=P(ks);}while(b===a);var n=L>=60?5:4;
  var o=P(IM.CATS[b]),op=U.sh(U.sh(IM.CATS[a]).slice(0,n-1).concat([o]));
  return {kind:'choice',body:tag(IM.t('oddQ')),opts:op.map(U.esc),ans:op.indexOf(o),show:o,ttl:tm(9,L)};});

def('assoc',31,{tr:'Çağrışım',en:'Association'},
 {tr:'Bir kelime verilir. Dört seçenekten hangisi onunla AYNI gruba ait? (Örn. "elma" ile aynı grup: "armut".) Hızlı çağrışım yapman gerekir.',
  en:'A word is shown. Which of the four options belongs to the SAME group? (e.g. with "elma": "armut".) You need fast associative thinking.'},
 function(L){var ks=U.sh(Object.keys(IM.CATS)),a=ks[0],cue=P(IM.CATS[a]),good,o=[];
  do{good=P(IM.CATS[a]);}while(good===cue);o.push(good);for(var i=1;i<4;i++)o.push(P(IM.CATS[ks[i]]));o=U.sh(o);
  return {kind:'choice',body:big(U.esc(cue))+tag(IM.t('assQ')),opts:o.map(U.esc),ans:o.indexOf(good),show:good,ttl:tm(8,L)};});

def('digits',11,{tr:'Sayı hafızası',en:'Digit span'},
 {tr:'KISA SÜRELİ HAFIZA. Bir sayı dizisi kısa süre görünür sonra kaybolur. Kaybolunca diziyi yaz ve Enter\'a bas. 30. seviyeden sonra bazen TERSTEN yazman istenir.',
  en:'SHORT-TERM MEMORY. A digit string shows briefly, then vanishes. Once hidden, type it and press Enter. After level 30 you sometimes must type it BACKWARDS.'},
 function(L){var n=3+Math.floor(L/9),rev=L>=30&&Math.random()<.5,d='',i;for(i=0;i<n;i++)d+=R(0,9);
  var a=rev?d.split('').reverse().join(''):d;
  return flash({shown:big(d,'mono')+tag(IM.t('memo')),hidden:tag(rev?IM.t('typeRev'):IM.t('typeIt')),sec:fl(Math.max(1.2,(.75-L*.003)*n+.8)),ans:tm(3+n*1.2,L),
   check:function(t){return t.replace(/\D/g,'')===a;},show:a});});

def('grid',23,{tr:'Desen hafızası',en:'Pattern memory'},
 {tr:'KISA SÜRELİ GÖRSEL HAFIZA. Karelerden bazıları sırayla yanar. Işık bitince AYNI SIRAYLA karelere dokun/tıkla. Seviye arttıkça dizi uzar ve ızgara 4×4 olur.',
  en:'SHORT-TERM VISUAL MEMORY. Squares light up one by one. When the lights stop, tap/click the SAME squares in the SAME order. The sequence grows and the grid becomes 4×4.'},
 function(L){var g=L<50?3:4,k=3+Math.floor(L/9),seq=[],i,v,ph='show',t=0,st=0,step=Math.max(.35,.75-L*.004);
  for(i=0;i<k;i++){do{v=R(0,g*g-1);}while(i&&v===seq[i-1]);seq.push(v);}
  var cells='';for(i=0;i<g*g;i++)cells+='<button data-c="'+i+'"></button>';
  var sp={kind:'custom',body:tag(IM.t('memo'))+'<div class="grid g'+g+'">'+cells+'</div>',ttl:k*step+tm(4+k*1.5,L),show:seq.map(function(x){return x+1;}).join(' ')};
  sp.update=function(dt,c){if(ph!=='show')return;t+=dt;var j=Math.floor(t/step),bs=c.el.querySelectorAll('.grid button'),q;for(q=0;q<bs.length;q++)bs[q].className='';
   if(j>=k){ph='in';c.el.querySelector('.tag').textContent=IM.t('yourTurn');return;}if((t%step)<step*.7)bs[seq[j]].className='lit';};
  sp.init=function(c){U.qa(c.el,'.grid button').forEach(function(b){b.onclick=function(){if(ph!=='in'||c.done)return;
   if(+b.getAttribute('data-c')===seq[st]){b.className='dn';st++;if(st>=k)c.pass();}else c.fail();};});};
  return sp;});

def('schulte',19,{tr:'Dikkat tablosu',en:'Attention table'},
 {tr:'Karışık yerleştirilmiş sayılara 1\'den başlayarak sırayla dokun/tıkla. 45. seviyeden sonra sayı ve harf dönüşümlü gider (1, A, 2, B, 3, C…). Yanlış dokunuş kartı düşürür.',
  en:'Tap/click the scattered numbers in order starting from 1. After level 45 numbers and letters alternate (1, A, 2, B, 3, C…). A wrong tap fails the card.'},
 function(L){var N=Math.min(25,4+Math.floor(L/5)),alt=L>=45&&N>=8,seq=[],i,st=0;
  for(i=0;i<N;i++)seq.push(alt?(i%2?String.fromCharCode(65+(i-1)/2):String(i/2+1)):String(i+1));
  var cols=Math.ceil(Math.sqrt(N)),w=Math.floor(100/cols)-2,h='';U.sh(seq).forEach(function(s){h+='<button style="width:'+w+'%">'+s+'</button>';});
  var sp={kind:'custom',body:'<div class="sch">'+h+'</div>',ttl:tm(N*1.5+4,L),show:seq.join(' ')};
  sp.init=function(c){U.qa(c.el,'.sch button').forEach(function(b){b.onclick=function(){if(c.done||b.className)return;
   if(b.textContent===seq[st]){b.className='dn';st++;if(st>=N)c.pass();}else c.fail();};});};return sp;});

def('series',13,{tr:'Sayı dizisi',en:'Number series'},
 {tr:'MANTIK. Bir sayı dizisinin ilk terimleri verilir, kuralı bul ve soru işaretinin yerine gelecek sayıyı yaz.',
  en:'LOGIC. The first terms of a series are shown. Find the rule and type the number that replaces the question mark.'},
 function(L){var k=R(0,Math.min(7,2+Math.floor(L/12))),a=R(1,9),d=R(2,9),s=[],i,r;
  if(k===0)for(i=0;i<7;i++)s.push(a+i*d);
  else if(k===1){r=R(2,3);a=R(1,4);for(i=0;i<7;i++)s.push(a*Math.pow(r,i));}
  else if(k===2){for(i=1;i<=7;i++)s.push(i*i+a);}
  else if(k===3){var b=R(1,9);s=[a,b];for(i=2;i<7;i++)s.push(s[i-1]+s[i-2]);}
  else if(k===4){s=[a];for(i=1;i<7;i++)s.push(s[i-1]+i*d);}
  else if(k===5){s=[a];for(i=1;i<7;i++)s.push(i%2?s[i-1]+d:s[i-1]-(d-1));}
  else if(k===6){for(i=0;i<7;i++)s.push(i%2?a*10+(i>>1)*d:a+(i>>1)*(d+1));}
  else{r=P([2,3]);var c=R(-2,3);s=[a];for(i=1;i<7;i++)s.push(s[i-1]*r+c);}
  return {kind:'text',body:big(s.slice(0,6).join(' , ')+' , ?','mono'),check:function(t){return +t.replace(/\s/g,'')===s[6];},show:String(s[6]),ttl:tm(16+k*2,L)};});

def('stroop',9,{tr:'Renk-kelime',en:'Colour-word'},
 {tr:'DİKKAT ve ÇELİŞME. Bir renk adı başka bir renkle yazılmıştır. Kartın üstündeki kurala göre doğru renk karesini seç: "YAZININ RENGİ" ise yazının boyası, "KELİMENİN ANLAMI" ise kelimenin adı. 1-4 tuşları kareleri seçer. 40. seviyeden itibaren karelerin yeri karışır.',
  en:'ATTENTION & CONFLICT. A colour name is printed in another colour. Follow the rule on the card: pick the INK colour, or the colour the WORD names. Keys 1-4 pick the squares. From level 40 on the squares are shuffled.'},
 function(L){var C=U.sh(IM.COL).slice(0,4),wi=R(0,3),ink=R(0,3);if(Math.random()<.85)while(ink===wi)ink=R(0,3);
  var rule=L>=25&&Math.random()<.5?'word':'ink',ans=rule==='ink'?ink:wi,ord=L>=40?U.sh([0,1,2,3]):[0,1,2,3];
  return {kind:'choice',body:tag(IM.t(rule==='ink'?'ruleInk':'ruleWord'))+big(C[wi][IM.lang],'')['replace']('class="big"','class="big" style="color:'+C[ink].hex+'"'),
   opts:ord.map(function(i){return '<span class="sw" style="background:'+C[i].hex+'"></span>';}),ans:ord.indexOf(ans),show:C[ans][IM.lang],ttl:tm(6,L)};});

def('ltm',25,{tr:'Uzun hafıza',en:'Long-term memory'},
 {tr:'UZUN SÜRELİ HAFIZA. Oyun daha önce gördüğün kelimeleri 1 dk, 5 dk, 30 dk, 2 sa, 12 sa, 2 gün, 7 gün sonra yeniden sorar (aralıklı tekrar). Doğru bilirsen aralık uzar, yanlışta sıfırlanır. Hiç sorulacak kelime yoksa yeni bir kelime ezberletir. İlerleme tarayıcında kalır.',
  en:'LONG-TERM MEMORY. The game re-asks words you saw earlier after 1 min, 5 min, 30 min, 2 h, 12 h, 2 days, 7 days (spaced repetition). Right answers stretch the gap, wrong ones reset it. If nothing is due it teaches a new word. Progress stays in your browser.'},
 function(L){var rp=IM.rp,dec=rp?rp.ltm[rp.ltmI++]:null,D=IM.S.deck;
  if(!dec){var now=Date.now(),due=[],k;for(k in D)if(D[k].due<=now)due.push(D[k]);
   if(due.length){due.sort(function(a,b){return a.due-b.due;});var d=due[0];dec={m:'d',w:[d.tr,d.en,d.alt],age:now-d.seen};}
   else{var q,i=0;do{q=pickW(L);i++;}while(D[q[0]]&&i<30);dec={m:'n',w:q};}
   if(IM.rec)IM.rec.ltm.push(dec);}
  var w=dec.w;
  if(dec.m==='d')return wordCard(w,L,IM.t('ltmDue')+' · '+ago(dec.age),function(ok){IM.deckNote(w,ok);});
  var en=w[1].replace(/^to /,''),A=accepts(w);
  return flash({shown:tag(IM.t('ltmNew'))+big(U.esc(w[0])+' = '+U.esc(en)),hidden:tag('TR → EN')+big(U.esc(w[0])),sec:fl(4),ans:tm(10,L),
   check:function(t){return A.indexOf(U.nz(t))>=0;},show:en,onResult:function(ok){IM.deckNote(w,ok);}});});

def('dots',34,{tr:'Nokta sayma',en:'Dot counting'},
 {tr:'Ekranda bir anlığına noktalar belirir. Kaybolunca kaç tane olduğunu yaz. Seviye arttıkça noktalar çoğalır ve daha kısa görünür.',
  en:'Dots flash on screen for a moment. When they vanish, type how many there were. They multiply and show shorter as levels rise.'},
 function(L){var n=Math.min(40,R(3+Math.floor(L/10),6+Math.floor(L/6))),pts=[],tr=0,s='';
  while(pts.length<n&&tr++<3000){var x=R(8,192),y=R(8,112),ok=true;pts.forEach(function(p){if(Math.abs(p[0]-x)<13&&Math.abs(p[1]-y)<13)ok=false;});if(ok)pts.push([x,y]);}
  n=pts.length;pts.forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5"/>';});
  return flash({shown:'<svg viewBox="0 0 200 120" class="dots">'+s+'</svg>',hidden:tag(IM.t('dotsQ')),sec:fl(Math.max(.5,1.4-L*.008)),ans:tm(6,L),
   check:function(t){return +t===n;},show:String(n)});});

/* ---------- 3D: voxel yapılar ---------- */
var DIRS=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],ROTS=[];
[[0,1,2,1],[0,2,1,-1],[1,0,2,-1],[1,2,0,1],[2,0,1,1],[2,1,0,-1]].forEach(function(p){for(var s=0;s<8;s++){var sg=[s&1?-1:1,s&2?-1:1,s&4?-1:1];if(p[3]*sg[0]*sg[1]*sg[2]===1)ROTS.push({p:p,sg:sg});}});
function rot(c,r){return c.map(function(v){return [v[r.p[0]]*r.sg[0],v[r.p[1]]*r.sg[1],v[r.p[2]]*r.sg[2]];});}
function norm(c){var m=[1e9,1e9,1e9];c.forEach(function(v){for(var i=0;i<3;i++)if(v[i]<m[i])m[i]=v[i];});
 return c.map(function(v){return (v[0]-m[0])+','+(v[1]-m[1])+','+(v[2]-m[2]);}).sort().join('|');}
function canon(c){var b=null;ROTS.forEach(function(r){var k=norm(rot(c,r));if(b===null||k<b)b=k;});return b;}
function key(v){return v.join(',');}
function connected(c){var set={},seen={},st=[c[0]],n=0;c.forEach(function(v){set[key(v)]=1;});seen[key(c[0])]=1;
 while(st.length){var v=st.pop();n++;DIRS.forEach(function(d){var w=[v[0]+d[0],v[1]+d[1],v[2]+d[2]],k=key(w);if(set[k]&&!seen[k]){seen[k]=1;st.push(w);}});}return n===c.length;}
function genShape(n){var box=n>12?4:3,cells=[[1,1,1]],set={'1,1,1':1};
 while(cells.length<n){var b=P(cells),d=P(DIRS),w=[b[0]+d[0],b[1]+d[1],b[2]+d[2]];if(set[key(w)]||w.some(function(x){return x<0||x>=box;}))continue;set[key(w)]=1;cells.push(w);}return cells;}
function mutate(c){for(var t=0;t<80;t++){var i=R(0,c.length-1),rest=c.filter(function(_,j){return j!==i;}),set={};rest.forEach(function(v){set[key(v)]=1;});
 var b=P(rest),d=P(DIRS),w=[b[0]+d[0],b[1]+d[1],b[2]+d[2]];if(set[key(w)]||key(w)===key(c[i]))continue;var nc=rest.concat([w]);
 if(connected(nc)&&canon(nc)!==canon(c))return nc;}return null;}
function drawVox(cv,cells,ang,tilt){if(IM.ff)return;var g=cv.getContext('2d'),W=cv.width,H=cv.height,n=cells.length,i,cx=0,cy=0,cz=0,set={};
 g.clearRect(0,0,W,H);cells.forEach(function(v){cx+=v[0];cy+=v[1];cz+=v[2];set[key(v)]=1;});cx/=n;cy/=n;cz/=n;
 var ca=Math.cos(ang),sa=Math.sin(ang),ct=Math.cos(tilt),st=Math.sin(tilt),rad=1;
 function tr(x,y,z){var X=x*ca+z*sa,Z=-x*sa+z*ca,Y=y*ct-Z*st;Z=y*st+Z*ct;return [X,Y,Z];}
 cells.forEach(function(v){var d=Math.sqrt(Math.pow(v[0]-cx,2)+Math.pow(v[1]-cy,2)+Math.pow(v[2]-cz,2));if(d>rad)rad=d;});
 var sc=Math.min(W,H)*.44/(rad+.9),D=9,faces=[];
 function pr(p){var f=D/(D+p[2]);return [W/2+p[0]*sc*f,H/2-p[1]*sc*f];}
 cells.forEach(function(v){for(var a=0;a<3;a++)for(var s=-1;s<=1;s+=2){var nb=[v[0],v[1],v[2]];nb[a]+=s;if(set[key(nb)])continue;
  var u=(a+1)%3,w=(a+2)%3,cs=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(function(o){var q=[v[0]-cx,v[1]-cy,v[2]-cz];q[a]+=s*.5;q[u]+=o[0];q[w]+=o[1];return tr(q[0],q[1],q[2]);});
  var nn=[0,0,0];nn[a]=s;var rn=tr(nn[0],nn[1],nn[2]);if(rn[2]>0.001)continue;
  var z=0;cs.forEach(function(p){z+=p[2];});faces.push({z:z/4,cs:cs.map(pr),sh:Math.max(0,Math.min(1,.55-rn[0]*.25-rn[1]*.35-rn[2]*.1))});}});
 faces.sort(function(a,b){return b.z-a.z;});
 faces.forEach(function(f){g.beginPath();g.moveTo(f.cs[0][0],f.cs[0][1]);for(i=1;i<4;i++)g.lineTo(f.cs[i][0],f.cs[i][1]);g.closePath();
  var l=Math.round(22+f.sh*60);g.fillStyle='hsl(172,55%,'+l+'%)';g.fill();g.lineWidth=1.5;g.strokeStyle='#071a1a';g.stroke();});}
IM.vox={ROTS:ROTS,rot:rot,canon:canon,genShape:genShape,mutate:mutate,connected:connected,draw:drawVox};

def('voxcount',38,{tr:'3B küp sayma',en:'3D cube count'},
 {tr:'3 BOYUTLU UZAMSAL ALGI. Dönen üç boyutlu bir küp yapısı görürsün. Arkada ve içeride gizli kalanlar dahil toplam kaç küp olduğunu yaz. Yapı döndükçe farklı yüzleri görünür; hepsini zihninde birleştir.',
  en:'3D SPATIAL PERCEPTION. You see a rotating 3D cube structure. Type the total number of cubes, hidden ones included. As it spins, different faces appear; assemble them in your mind.'},
 function(L){var n=Math.max(3,Math.min(18,Math.min(16,4+Math.floor(L/8))+R(-2,2))),cells=genShape(n),ang=Math.random()*6,cv=null,sp;
  sp={kind:'text',body:tag(IM.t('voxQ'))+'<canvas class="cv" width="260" height="170"></canvas>',check:function(t){return +t===n;},show:String(n),ttl:tm(14+n*2,L)};
  sp.init=function(c){cv=c.el.querySelector('canvas');drawVox(cv,cells,ang,.5);};
  sp.update=function(dt){ang+=dt*.8;if(cv)drawVox(cv,cells,ang,.5);};sp.paint=function(){if(cv)drawVox(cv,cells,ang,.5);};return sp;});

def('vox3d',44,{tr:'3B karşılaştırma',en:'3D compare'},
 {tr:'3 BOYUTLU ZİHİNSEL DÖNDÜRME. İki yapı yan yana döner. Biri diğerinin sadece döndürülmüş hâli mi (1 = AYNI), yoksa bir küp yer değiştirmiş mi / ayna görüntüsü mü (2 = FARKLI)? 1 ya da 2 tuşuna bas.',
  en:'3D MENTAL ROTATION. Two structures spin side by side. Is one just a rotated copy (1 = SAME) or has a cube moved / is it a mirror image (2 = DIFFERENT)? Press 1 or 2.'},
 function(L){var n=Math.max(3,Math.min(13,Math.min(12,4+Math.floor(L/9))+R(-1,2))),a=genShape(n),same=Math.random()<.5,b;
  if(same)b=rot(a,P(ROTS));else{b=null;if(L>=60&&Math.random()<.5){var m=a.map(function(v){return [-v[0],v[1],v[2]];});if(canon(m)!==canon(a))b=rot(m,P(ROTS));}if(!b)b=mutate(a);if(!b){b=rot(a,P(ROTS));same=true;}}
  var ang=Math.random()*6,c1=null,c2=null,sp={kind:'choice',body:tag(IM.t('voxS'))+'<div class="two"><canvas width="170" height="150"></canvas><canvas width="170" height="150"></canvas></div>',
   opts:[IM.t('same'),IM.t('diff')],ans:same?0:1,show:same?IM.t('same'):IM.t('diff'),ttl:tm(18+n*2,L)};
  sp.init=function(c){var cs=c.el.querySelectorAll('canvas');c1=cs[0];c2=cs[1];drawVox(c1,a,ang,.5);drawVox(c2,b,ang+1.7,.5);};
  sp.update=function(dt){ang+=dt*.7;if(c1){drawVox(c1,a,ang,.5);drawVox(c2,b,ang+1.7,.5);}};sp.paint=function(){if(c1){drawVox(c1,a,ang,.5);drawVox(c2,b,ang+1.7,.5);}};return sp;});

def('nback',50,{tr:'N-geri hafıza',en:'N-back'},
 {tr:'ÇALIŞMA HAFIZASI. Harfler tek tek akar. Şu anki harf, N harf ÖNCEKİYLE aynıysa SPACE\'e bas (ya da düğmeye dokun). N=1: bir önceki, N=2: iki önceki, N=3: üç önceki. Eşleşmeyi kaçırmak da, yok yere basmak da kartı düşürür.',
  en:'WORKING MEMORY. Letters stream one by one. If the current letter equals the one N steps BACK press SPACE (or tap the button). N=1: previous, N=2: two back, N=3: three back. Missing a match or pressing wrongly fails the card.'},
 function(L){var n=L>=85?3:L>=65?2:1,len=8+Math.floor((L-50)/6),step=Math.max(1,2-(L-50)*.012),set='ABCDEFGH'.slice(0,L<70?6:8).split(''),seq=[],i,x,t=0,cur=-1,pr=false;
  for(i=0;i<len;i++){if(i>=n&&Math.random()<.35)seq.push(seq[i-n]);else{do{x=P(set);}while(i>=n&&x===seq[i-n]);seq.push(x);}}
  function isM(j){return j>=n&&seq[j]===seq[j-n];}
  var sp={kind:'custom',body:tag('N = '+n)+'<div class="big nb">·</div><button class="mt">'+IM.t('match')+'</button>',ttl:len*step+3,show:seq.map(function(x,j){return isM(j)?'['+x+']':x;}).join(' ')};
  sp.hit=function(c){if(c.done)return;if(cur>=0&&isM(cur)&&!pr){pr=true;c.el.querySelector('.nb').className='big nb dn';}else c.fail();};
  sp.onSpace=sp.hit;sp.init=function(c){c.el.querySelector('.mt').onclick=function(){sp.hit(c);};};
  sp.update=function(dt,c){t+=dt;var idx=Math.floor(t/step),el=c.el.querySelector('.nb');
   while(cur<idx){if(cur>=0&&isM(cur)&&!pr){c.fail(IM.t('missed'));return;}cur++;pr=false;if(cur>=len){c.pass();return;}el.textContent=seq[cur];el.className='big nb';}
   if(cur<len&&(t%step)>step*.78)el.textContent='·';};
  return sp;});

def('anagram',21,{tr:'Harf bulmaca',en:'Anagram'},
 {tr:'Karışık harflerden Türkçe kelimeyi çıkar ve yaz. Başlangıçta İngilizce ipucu verilir, 40. seviyeden itibaren ipucu yoktur. Uzun kelimeler gelir.',
  en:'Unscramble the letters into a Turkish word and type it. An English hint is shown at first, none from level 40 on. Words get longer.'},
 function(L){var w,i=0,mx=Math.min(12,4+Math.floor(L/8));w=pickW(L,{minLen:4,maxLen:mx,nospace:1});
  var ch=w[0].split(''),sc;i=0;do{sc=U.sh(ch);i++;}while(sc.join('')===w[0]&&i<20);
  var key2=U.nz(w[0]).split('').sort().join(''),ok=IM.W.filter(function(x){return x[0].length===w[0].length&&U.nz(x[0]).split('').sort().join('')===key2;}).map(function(x){return U.nz(x[0]);});
  return {kind:'text',body:tag(IM.t('anaQ')+(L<40?' · '+U.esc(w[1].replace(/^to /,'')):''))+big(sc.join(' ').replace(/i/g,'İ').replace(/ı/g,'I').toUpperCase(),'mono'),check:function(t){return ok.indexOf(U.nz(t))>=0;},show:w[0],ttl:tm(8+w[0].length*1.6,L)};});
/* ---- KÜP RUBİK 3B: 2×2 (L1) → 8×8 (L100). Her çıkartma (c=küp merkezi, n=yüzey normali, k=renk) 3B'de döner; çözüm = her yüzün tek renk olması.
   Kontrol: 4 yön tuşu ÇEVİR (seçili satır/sütunu ekranda yukarı/aşağı/sola/sağa), 4 yön tuşu BAK (küpün çevresinde dolaş), fare/dokunma ile sürükle = bak.
   Hepsi ekrana göre (kameraya göre) çalışır. Tuşlar IM.rb ile ayarlanır (menü → KÜP TUŞLARI). ---- */
var RCOL=['#1f9d3a','#1f5fd8','#d62828','#ff8c1a','#f4f4f4','#ffd500'],RLT='GBROWY';
IM.rb={
 acts:[['tu','Çevir ↑','Turn ↑'],['td','Çevir ↓','Turn ↓'],['tl','Çevir ←','Turn ←'],['tr','Çevir →','Turn →'],
  ['vu','Bak ▲','View ▲'],['vd','Bak ▼','View ▼'],['vl','Bak ◀','View ◀'],['vr','Bak ▶','View ▶'],
  ['rp','Satır yukarı','Row up'],['rn','Satır aşağı','Row down'],['cp','Sütun sola','Column left'],['cn','Sütun sağa','Column right']],
 def:{tu:'KeyW',td:'KeyS',tl:'KeyA',tr:'KeyD',vu:'ArrowUp',vd:'ArrowDown',vl:'ArrowLeft',vr:'ArrowRight',rp:'KeyQ',rn:'KeyE',cp:'KeyZ',cn:'KeyC'},
 ok:/^(Key[A-Z]|Digit\d|Numpad\w+|Arrow\w+|Space|Bracket\w+|Comma|Period|Semicolon|Quote|Slash|Backslash|Minus|Equal|Backquote)$/,
 keys:function(){var o={},k=(IM.S&&IM.S.rbKeys)||{},a;for(a in IM.rb.def)o[a]=k[a]||IM.rb.def[a];return o;},
 find:function(code){var K=IM.rb.keys(),a;for(a in K)if(K[a]===code)return a;return null;},
 label:function(c){var m={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',Space:'␣'};if(m[c])return m[c];
  if(/^Key[A-Z]$/.test(c))return c.slice(3);if(/^Digit\d$/.test(c))return c.slice(5);return c.replace('Numpad','Num ');}
};
function rv(v,a,q){var x=v[0],y=v[1],z=v[2],i,t;for(i=0;i<(q>0?1:3);i++){if(a===0){t=y;y=-z;z=t;}else if(a===1){t=x;x=z;z=-t;}else{t=x;x=-y;y=t;}}return [x,y,z];}
function nidx(n){return n[2]>0?0:n[2]<0?1:n[0]>0?2:n[0]<0?3:n[1]>0?4:5;}
function rbSize(L){return Math.min(8,2+Math.floor((L-1)/14.3));}
function rbFrac(L,N){return Math.max(0,Math.min(1,((L-1)-(N-2)*14.3)/14.3));}
/* kamera: tr = dünya→ekran, it = ekran→dünya (tr'nin tersi) */
function rbCam(y,p){var cy=Math.cos(y),sy=Math.sin(y),cp=Math.cos(p),sp=Math.sin(p);
 return {tr:function(v){var x=v[0]*cy+v[2]*sy,z=-v[0]*sy+v[2]*cy,yy=v[1]*cp-z*sp;z=v[1]*sp+z*cp;return [x,yy,z];},
  it:function(v){var yy=v[1]*cp+v[2]*sp,z=-v[1]*sp+v[2]*cp;return [v[0]*cy-z*sy,yy,v[0]*sy+z*cy];}};}
/* ekranda "yukarı" ve "sağ" hangi dünya eksenlerine denk geliyor? */
function rbAxes(y,p){var c=rbCam(y,p),up=c.it([0,1,0]),rt=c.it([1,0,0]),aV=0,aH,i,b=-1;
 for(i=0;i<3;i++)if(Math.abs(up[i])>b){b=Math.abs(up[i]);aV=i;}
 b=-1;aH=0;for(i=0;i<3;i++)if(i!==aV&&Math.abs(rt[i])>b){b=Math.abs(rt[i]);aH=i;}
 return {cam:c,aV:aV,aH:aH,sV:up[aV]>=0?1:-1,sH:rt[aH]>=0?1:-1};}
var RB_PIT=[-1.4,-.5,.5,1.4],RB_Y0=-.6,RB_Q=Math.PI/2;
def('rubik',5,{tr:'Küp Rubik 3B',en:"Rubik's cube 3D"},
 {tr:'3 BOYUTLU KÜP RUBİK. Karışık bir küp gelir; her yüzü tek renge getir. 2×2 ile başlar, 100. seviyede 8×8 olur. ÇEVİR: önce SATIR ve SÜTUN numarasını seç (küp üzerinde pembe = satır, turkuaz = sütun parlar; küpe tıklayarak da seçebilirsin). Sonra ÇEVİR yön tuşlarıyla (↑ ↓ ← →) o satırı sola/sağa, o sütunu yukarı/aşağı çevir. Hepsi ekrana göre çalışır. BAK: ◀ ▶ ▲ ▼ ile küpün çevresinde dolaş (yanlar, üst, alt) ya da fareyle / parmakla sürükle; sürüklediğin yöne döner, ters değil. Dolaştıkça küpün başka yüzleri de çevrilebilir hâle gelir. KLAVYE: küpün kartına tıkla; varsayılan olarak çevirmek W A S D, bakmak oklar, satır seçmek Q/E, sütun seçmek Z/C. Hepsi menüdeki KÜP TUŞLARI ekranından değiştirilebilir. Her 10. seviyenin sonunda (10, 20, … 100) bir küp çözmeden sonraki seviyeye geçemezsin; sıradan seviyelerde de bitmeden önce bir küp gelir. Süre dolarsa kart düşer.',
  en:"3D RUBIK'S CUBE. A scrambled cube appears; make every face one colour. Starts at 2×2 and reaches 8×8 at level 100. TURN: first pick a ROW and a COLUMN number (on the cube pink = row, cyan = column; you can also click the cube to pick). Then use the TURN arrows (↑ ↓ ← →) to turn that row left/right and that column up/down. Everything is relative to the screen. LOOK: walk around the cube with ◀ ▶ ▲ ▼ (sides, top, bottom) or drag with the mouse / finger; it turns the way you drag, not the opposite. As you walk around, other faces become turnable. KEYBOARD: click the cube card; by default turn = W A S D, look = arrow keys, row = Q/E, column = Z/C. All of them can be changed in the menu under CUBE KEYS. At the end of every 10th level (10, 20, … 100) you must solve a cube to advance; ordinary levels also drop one before they end. If time runs out the card fails."},
 function(L){var o=IM.rbOpt||{};IM.rbOpt=null;var gate=!!o.gate,boss=gate&&L>=100,N=rbSize(L),fr,k,i,j,a,li,last='',st=[],log=[],guard=0,h,rowI=0,colI=0,yaw=RB_Y0,pit=.5,tY=null,tP=null,cvs=null,hits=[],keyEl=null,kb=IM.rb.keys();
  if(!gate&&N>2&&Math.random()<.35)N--;
  h=N-1;fr=rbFrac(L,N)*(gate?1:.8);if(gate)fr=Math.min(1,fr+.15);
  k=boss?24:Math.max(1,Math.round(2+fr*(4+2*N))+R(-1,1));
  var ttl=boss?1800:(45+k*16+N*N*4)*(gate?1.25:1);
  for(a=0;a<3;a++)[1,-1].forEach(function(sg){var n=[0,0,0],u=(a+1)%3,w=(a+2)%3,x,y;n[a]=sg;
   for(x=0;x<N;x++)for(y=0;y<N;y++){var c=[0,0,0];c[a]=sg*h;c[u]=-h+2*x;c[w]=-h+2*y;st.push({c:c,n:n.slice(),k:nidx(n)});}});
  function mv(a,pv,q){st.forEach(function(s){if(s.c[a]===pv){s.c=rv(s.c,a,q);s.n=rv(s.n,a,q);}});}
  function solved(){var m={},ok=true;st.forEach(function(s){var key=s.n.join();if(m[key]===undefined)m[key]=s.k;else if(m[key]!==s.k)ok=false;});return ok;}
  do{log=[];for(i=0;i<k;i++){do{a=R(0,2);li=R(0,N-1);}while(a+':'+li===last&&k>1);last=a+':'+li;var q0=P([1,-1]);mv(a,-h+2*li,q0);log.push([a,-h+2*li,q0]);}guard++;}while(solved()&&guard<9);
  /* "niyet edilen" görünüm: animasyon sürüyorsa hedef, yoksa şimdiki */
  function ey(){return tY===null?yaw:tY;}function ep(){return tP===null?pit:tP;}
  function axes(){return rbAxes(ey(),ep());}
  function rowCo(A){return A.sV*(h-2*rowI);}function colCo(A){return A.sH*(-h+2*colI);}
  function draw(){if(IM.ff)return;var cv=cvs;if(!cv)return;var g=cv.getContext('2d'),W=cv.width,H=cv.height,sc=.265*Math.min(W,H)/N,cm=rbCam(yaw,pit),D=7*N,A=axes(),rc=rowCo(A),cc=colCo(A),q=[];
   function tr(v){return cm.tr(v);}
   function pj(p){var f=D/(D-p[2]);return [W/2+p[0]*sc*f,H/2-p[1]*sc*f,f];}
   function quad(cen,u,w,m){return [[-1,-1],[1,-1],[1,1],[-1,1]].map(function(d){var v=cen.slice();v[u]+=d[0]*m;v[w]+=d[1]*m;return pj(tr(v));});}
   g.clearRect(0,0,W,H);
   st.forEach(function(s){var nr=tr(s.n);if(nr[2]<=.02)return;var an=s.n[0]?0:s.n[1]?1:2,u=(an+1)%3,w=(an+2)%3,cen=[s.c[0]+s.n[0],s.c[1]+s.n[1],s.c[2]+s.n[2]];
    q.push({z:tr(cen)[2],b:quad(cen,u,w,1),s:quad(cen,u,w,.86),k:s.k,c:s.c,rs:s.c[A.aV]===rc,cs:s.c[A.aH]===cc});});
   q.sort(function(a,b){return a.z-b.z;});hits=q;
   function path(p){g.beginPath();g.moveTo(p[0][0],p[0][1]);for(var t=1;t<4;t++)g.lineTo(p[t][0],p[t][1]);g.closePath();}
   q.forEach(function(e){path(e.b);g.fillStyle='#000';g.fill();path(e.s);g.fillStyle=RCOL[e.k];g.fill();
    if(e.rs){g.lineWidth=3;g.strokeStyle='#ff2bd6';g.stroke();}
    if(e.cs){g.lineWidth=e.rs?1.5:3;g.strokeStyle='#00e5ff';g.stroke();}
    if(N<=4){var ce=[0,1,2,3].reduce(function(m,t){return [m[0]+e.s[t][0]/4,m[1]+e.s[t][1]/4];},[0,0]);g.fillStyle='#000';g.font='bold '+Math.round(sc*e.s[0][2]*1.3)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(RLT.charAt(e.k),ce[0],ce[1]);}});}
  /* ÇEVİR: yön = ekranda en öndeki taşın gideceği yön. Eksen/katman ekran satırı/sütunundan çıkar. */
  function turn(d){var A=axes(),ax=(d===2||d===3)?A.aV:A.aH,co=(d===2||d===3)?rowCo(A):colCo(A),dv=A.cam.it([0,0,1]),best=null,bs=-1e9;
   dv[ax]=0;var m=Math.sqrt(dv[0]*dv[0]+dv[1]*dv[1]+dv[2]*dv[2])||1;dv=dv.map(function(x){return 3*x/m;});
   [1,-1].forEach(function(q){var s0=A.cam.tr(dv),s1=A.cam.tr(rv(dv,ax,q)),sc2=d===0?s1[1]-s0[1]:d===1?s0[1]-s1[1]:d===2?s0[0]-s1[0]:s1[0]-s0[0];if(sc2>bs){bs=sc2;best=q;}});
   mv(ax,co,best);}
  function stepView(dir){var by=ey(),bp=ep(),t;
   if(dir==='l'||dir==='r'){var kk=(by-RB_Y0)/RB_Q;kk=dir==='l'?Math.ceil(kk-1e-6)-1:Math.floor(kk+1e-6)+1;tY=RB_Y0+kk*RB_Q;}
   else if(dir==='u'){t=null;RB_PIT.forEach(function(v){if(v<bp-1e-6)t=v;});tP=t===null?RB_PIT[0]:t;}
   else{t=null;for(var z=RB_PIT.length-1;z>=0;z--)if(RB_PIT[z]>bp+1e-6)t=RB_PIT[z];tP=t===null?RB_PIT[RB_PIT.length-1]:t;}}
  var bx='<div class="rbl">'+(IM.lang==='tr'?'SATIR (pembe)':'ROW (pink)')+'</div><div class="rbx r">';
  for(i=0;i<N;i++)bx+='<button data-t="R'+i+'">'+(i+1)+'</button>';
  bx+='</div><div class="rbl">'+(IM.lang==='tr'?'SÜTUN (turkuaz)':'COLUMN (cyan)')+'</div><div class="rbx c">';
  for(i=0;i<N;i++)bx+='<button data-t="C'+i+'">'+(i+1)+'</button>';bx+='</div>';
  function cross(p,sym,cls){var h2='<div class="dp '+cls+'">';['u','l','d','r'].forEach(function(d,ix){h2+='<button class="d'+d+'" data-t="'+p+d+'" data-a="'+p+d+'">'+sym[ix]+'<small data-k="'+p+d+'"></small></button>';});return h2+'</div>';}
  var pads='<div class="rbpads"><div><div class="rbl">'+(IM.lang==='tr'?'ÇEVİR':'TURN')+'</div>'+cross('t',['↑','←','↓','→'],'tn')+'</div><div><div class="rbl">'+(IM.lang==='tr'?'BAK':'LOOK')+'</div>'+cross('v',['▲','◀','▼','▶'],'vw')+'</div></div>';
  var sp={kind:'custom',ttl:ttl,show:IM.lang==='tr'?'En fazla '+k+' hamlede çözülürdü':'Solvable in at most '+k+' moves',gate:gate,dump:function(){return JSON.stringify(st);},scr:log,solvedNow:solved,
   body:tag((gate?(IM.lang==='tr'?'KAPI · çöz ve geç · ':'GATE · solve to advance · '):'')+N+'×'+N)+'<canvas class="cv rbcv" width="320" height="300"></canvas><div class="rbh"></div>'+bx+pads};
  function sync(c){U.qa(c.el,'.rbx button').forEach(function(b){var t=b.getAttribute('data-t');b.className=(t==='R'+rowI||t==='C'+colI)?'on':'';});draw();}
  function clampI(v){return Math.max(0,Math.min(N-1,v));}
  function act(t,c){if(c.done)return;var ch=t.charAt(0),dm={u:0,d:1,l:2,r:3};
   if(ch==='R')rowI=clampI(+t.slice(1));else if(ch==='C')colI=clampI(+t.slice(1));
   else if(t==='rp')rowI=clampI(rowI-1);else if(t==='rn')rowI=clampI(rowI+1);else if(t==='cp')colI=clampI(colI-1);else if(t==='cn')colI=clampI(colI+1);
   else if(ch==='t'){turn(dm[t.charAt(1)]);if(solved()){sync(c);c.pass();return;}}
   else if(ch==='v')stepView(t.charAt(1));
   sync(c);}
  sp.act=act;
  sp.rbApply=function(kind,a,b,c){if(c.done)return;
   if(kind==='k')act(a,c);
   else if(kind==='v'){yaw=a;pit=b;tY=tP=null;sync(c);}
   else if(kind==='s'){rowI=clampI(a);colI=clampI(b);sync(c);}};
  sp.paint=draw;
  sp.update=function(dt,c){var mvd=false,f=Math.min(1,dt*10);
   if(tY!==null){yaw+=(tY-yaw)*f;if(Math.abs(tY-yaw)<.003){yaw=tY;tY=null;}mvd=true;}
   if(tP!==null){pit+=(tP-pit)*f;if(Math.abs(tP-pit)<.003){pit=tP;tP=null;}mvd=true;}
   if(mvd)draw();
   if(keyEl&&!IM.ff){var on=IM.rbOn&&IM.rbOn()===c,tx=on?(IM.lang==='tr'?'⌨ klavye aktif':'⌨ keyboard on'):(IM.lang==='tr'?'⌨ klavye için küpe tıkla':'⌨ click the cube for keyboard');if(keyEl.textContent!==tx)keyEl.textContent=tx;}};
  sp.init=function(c){cvs=c.el.querySelector('canvas');keyEl=c.el.querySelector('.rbh');
   U.qa(c.el,'.rbx button,.dp button').forEach(function(b){b.onclick=function(ev){ev.stopPropagation();act(b.getAttribute('data-t'),c);};});
   U.qa(c.el,'small[data-k]').forEach(function(s){s.textContent=IM.rb.label(kb[s.getAttribute('data-k')]);});
   var dr=null,mx=0;
   function down(x,y){if(IM.rp||c.done)return;dr=[x,y];mx=0;tY=tP=null;}
   function move(x,y){if(!dr)return;var dx=x-dr[0],dy=y-dr[1];mx+=Math.abs(dx)+Math.abs(dy);yaw+=dx*.012;pit=Math.max(-1.45,Math.min(1.45,pit+dy*.012));dr=[x,y];draw();}
   function up(x,y){if(!dr)return;dr=null;if(mx>0)IM.evt&&IM.evt('R',c.n,'v',yaw,pit);
    if(mx<5&&x!==undefined){var r=cvs.getBoundingClientRect(),px=(x-r.left)*cvs.width/r.width,py=(y-r.top)*cvs.height/r.height,i2,e,A;
     function inside(p){var ins=false,a2,b2;for(a2=0,b2=3;a2<4;b2=a2++){if(((p[a2][1]>py)!==(p[b2][1]>py))&&(px<(p[b2][0]-p[a2][0])*(py-p[a2][1])/(p[b2][1]-p[a2][1])+p[a2][0]))ins=!ins;}return ins;}
     for(i2=hits.length-1;i2>=0;i2--){e=hits[i2];if(inside(e.b)){A=axes();rowI=clampI((h-A.sV*e.c[A.aV])/2);colI=clampI((A.sH*e.c[A.aH]+h)/2);IM.evt&&IM.evt('R',c.n,'s',rowI,colI);sync(c);return;}}}
    draw();}
   cvs.onmousedown=function(e){if(!e.isTrusted)return;down(e.clientX,e.clientY);e.preventDefault();};
   cvs.onmousemove=function(e){if(e.isTrusted)move(e.clientX,e.clientY);};
   cvs.onmouseup=function(e){if(e.isTrusted)up(e.clientX,e.clientY);};cvs.onmouseleave=function(){if(dr){dr=null;if(mx>0)IM.evt&&IM.evt('R',c.n,'v',yaw,pit);}};
   cvs.ontouchstart=function(e){if(!e.isTrusted||!e.touches[0])return;down(e.touches[0].clientX,e.touches[0].clientY);};
   cvs.ontouchmove=function(e){if(!e.isTrusted||!e.touches[0])return;move(e.touches[0].clientX,e.touches[0].clientY);e.preventDefault();};
   cvs.ontouchend=function(e){if(!e.isTrusted)return;var t=e.changedTouches&&e.changedTouches[0];up(t?t.clientX:undefined,t?t.clientY:undefined);e.preventDefault();};
   sync(c);};
  return sp;});
T.rubik.noPool=1;

})();
