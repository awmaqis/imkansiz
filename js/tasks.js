(function(){
var IM=window.IM,U=IM.U,R=U.R,P=U.P,T=IM.TASKS={};
function tm(b,L){return b*Math.max(.35,1-L*.0065)*(IM.kindle?1.5:1);}
function fl(s){return IM.kindle?s*1.5+1:s;}
function def(id,unlock,kindle,name,how,make){T[id]={id:id,unlock:unlock,kindle:kindle,name:name,how:how,make:make};}
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

def('math',1,true,{tr:'Matematik',en:'Math'},
 {tr:'Kartta bir formül görünür. Sonucu hesapla ve alttaki kutuya yazıp Enter\'a bas. Cevap sayı ya da a/b kesridir (örn. 3/4). Zorluk okuldaki gibi basamak basamak artar: aritmetik, kesirler, denklemler, üsler, ikinci derece, logaritma, trigonometri, limit, türev, integral, seriler, karmaşık sayılar, matrisler.',
  en:'A formula appears on the card. Solve it, type the result in the box and press Enter. Answers are numbers or a/b fractions (e.g. 3/4). Difficulty climbs like school: arithmetic, fractions, equations, powers, quadratics, logs, trig, limits, derivatives, integrals, series, complex numbers, matrices.'},
 function(L){var g=IM.math.gen(L);return {kind:'text',body:'<div class="q">'+U.esc(g.q).replace(/\n/g,'<br>')+'</div>',check:function(t){return IM.math.check(t,g.v);},show:g.s,ttl:tm(22+g.tier*4,L)};});

def('words',3,true,{tr:'Kelime',en:'Words'},
 {tr:'Türkçe kelime görürsün: İngilizcesini yaz. İngilizce görürsen: Türkçesini yaz. 50. seviyeye kadar ç, ğ, ı, ö, ş, ü yerine c, g, i, o, s, u yazabilirsin; 50\'den sonra harfler tam doğru olmalı. Yanlış cevap kartı düşürmez ama stres yükler. Seviye yükseldikçe daha nadir ve zor kelimeler gelir.',
  en:'You see a Turkish word: type its English meaning. You see English: type the Turkish. Until level 50 you may type c, g, i, o, s, u instead of ç, ğ, ı, ö, ş, ü; after that letters must be exact. A wrong answer keeps the card but adds stress. Higher levels bring rarer, harder words.'},
 function(L){var w=pickW(L);return wordCard(w,L,'',function(ok){IM.deckNote(w,ok);});});

def('type',5,true,{tr:'Hızlı yazı',en:'Typing'},
 {tr:'Kartta yazan Türkçe metni aynen yaz ve Enter\'a bas. Başta kısa kelimeler, sonra uzun cümleler ve atasözleri gelir. 50. seviyeden sonra Türkçe harfler (ç ğ ı ö ş ü) zorunludur.',
  en:'Type the Turkish text on the card exactly and press Enter. Short words first, later long sentences and proverbs. After level 50 Turkish letters (ç ğ ı ö ş ü) are mandatory.'},
 function(L){var p;if(L>=12&&Math.random()<.5)p=P(IM.SENT);else{var n=1+Math.floor(L/9),a=[];for(var i=0;i<n;i++)a.push(pickW(L,{nospace:1,maxLen:Math.max(5,3+Math.floor(L/4))})[0]);p=a.join(' ');}
  return {kind:'text',body:big(U.esc(p),'sel'),check:function(t){t=t.replace(/\s+/g,' ').trim();return L>50?U.lc(t)===U.lc(p):U.nz(t)===U.nz(p);},show:p,ttl:tm(4+p.length*.5,L)};});

var AR=['↑','→','↓','←'];
def('arrows',7,true,{tr:'Ok dizisi',en:'Arrows'},
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

def('react',17,false,{tr:'Refleks',en:'Reaction'},
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
IM.tones=function(fr,dur){if(IM.mute)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.resume)AC.resume();
 var t0=AC.currentTime+.05;fr.forEach(function(f,i){var o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;
  g.gain.setValueAtTime(0,t0+i*dur);g.gain.linearRampToValueAtTime(.25,t0+i*dur+.02);g.gain.linearRampToValueAtTime(0,t0+i*dur+dur*.92);
  o.connect(g);g.connect(AC.destination);o.start(t0+i*dur);o.stop(t0+i*dur+dur);});}catch(e){}};
def('sound',28,false,{tr:'Ses',en:'Sound'},
 {tr:'Kısa bir ses dizisi çalar (ses açık olsun!). Sorulan sesin (en yüksek ya da en alçak) kaçıncı olduğunu seç: kartta 1, 2, 3… tuşuna bas ya da düğmeye dokun. "Tekrar dinle" bedava. Yüksek seviyelerde sesler birbirine çok yakındır.',
  en:'A short tone sequence plays (turn the volume on!). Pick which tone was the highest or the lowest: press 1, 2, 3… or tap the button. "Replay" is free. At high levels the tones are very close in pitch.'},
 function(L){var n=3+Math.floor(L/35),gap=Math.max(1,5-Math.floor(L/20)),ks=[],tr=0,hi=Math.random()<.5;
  while(ks.length<n&&tr++<800){var k=R(-12,12),ok=true;ks.forEach(function(x){if(Math.abs(x-k)<gap)ok=false;});if(ok)ks.push(k);}
  while(ks.length<n)ks.push(R(-12,12)+ks.length*.01);
  var ex=hi?Math.max.apply(null,ks):Math.min.apply(null,ks),idx=ks.indexOf(ex),fr=ks.map(function(k){return 440*Math.pow(2,k/12);});
  var sp={kind:'choice',body:tag(hi?IM.t('hi'):IM.t('lo'))+'<button class="rp">'+IM.t('replay')+'</button>',opts:ks.map(function(k,i){return '♪ '+(i+1);}),ans:idx,show:String(idx+1),ttl:tm(10+n*2,L)};
  function play(){IM.tones(fr,.4);}
  sp.init=function(c){play();c.el.querySelector('.rp').onclick=play;};return sp;});

def('odd',15,true,{tr:'Farklı olan',en:'Odd one out'},
 {tr:'Dört (sonra beş) kelimeden üçü aynı gruptandır (hayvan, meyve, renk, meslek…). Farklı gruptan olanı bul: numarasına bas ya da dokun.',
  en:'Of four (later five) Turkish words, all but one belong to the same group (animal, fruit, colour, job…). Find the odd one: press its number or tap it.'},
 function(L){var ks=Object.keys(IM.CATS),a=P(ks),b;do{b=P(ks);}while(b===a);var n=L>=60?5:4;
  var o=P(IM.CATS[b]),op=U.sh(U.sh(IM.CATS[a]).slice(0,n-1).concat([o]));
  return {kind:'choice',body:tag(IM.t('oddQ')),opts:op.map(U.esc),ans:op.indexOf(o),show:o,ttl:tm(9,L)};});

def('assoc',31,true,{tr:'Çağrışım',en:'Association'},
 {tr:'Bir kelime verilir. Dört seçenekten hangisi onunla AYNI gruba ait? (Örn. "elma" ile aynı grup: "armut".) Hızlı çağrışım yapman gerekir.',
  en:'A word is shown. Which of the four options belongs to the SAME group? (e.g. with "elma": "armut".) You need fast associative thinking.'},
 function(L){var ks=U.sh(Object.keys(IM.CATS)),a=ks[0],cue=P(IM.CATS[a]),good,o=[];
  do{good=P(IM.CATS[a]);}while(good===cue);o.push(good);for(var i=1;i<4;i++)o.push(P(IM.CATS[ks[i]]));o=U.sh(o);
  return {kind:'choice',body:big(U.esc(cue))+tag(IM.t('assQ')),opts:o.map(U.esc),ans:o.indexOf(good),show:good,ttl:tm(8,L)};});

def('digits',11,true,{tr:'Sayı hafızası',en:'Digit span'},
 {tr:'KISA SÜRELİ HAFIZA. Bir sayı dizisi kısa süre görünür sonra kaybolur. Kaybolunca diziyi yaz ve Enter\'a bas. 30. seviyeden sonra bazen TERSTEN yazman istenir.',
  en:'SHORT-TERM MEMORY. A digit string shows briefly, then vanishes. Once hidden, type it and press Enter. After level 30 you sometimes must type it BACKWARDS.'},
 function(L){var n=3+Math.floor(L/9),rev=L>=30&&Math.random()<.5,d='',i;for(i=0;i<n;i++)d+=R(0,9);
  var a=rev?d.split('').reverse().join(''):d;
  return flash({shown:big(d,'mono')+tag(IM.t('memo')),hidden:tag(rev?IM.t('typeRev'):IM.t('typeIt')),sec:fl(Math.max(1.2,(.75-L*.003)*n+.8)),ans:tm(3+n*1.2,L),
   check:function(t){return t.replace(/\D/g,'')===a;},show:a});});

def('grid',23,true,{tr:'Desen hafızası',en:'Pattern memory'},
 {tr:'KISA SÜRELİ GÖRSEL HAFIZA. Karelerden bazıları sırayla yanar. Işık bitince AYNI SIRAYLA karelere dokun/tıkla. Seviye arttıkça dizi uzar ve ızgara 4×4 olur.',
  en:'SHORT-TERM VISUAL MEMORY. Squares light up one by one. When the lights stop, tap/click the SAME squares in the SAME order. The sequence grows and the grid becomes 4×4.'},
 function(L){var g=L<50?3:4,k=3+Math.floor(L/9),seq=[],i,v,ph='show',t=0,st=0,step=IM.kindle?2:Math.max(.35,.75-L*.004);
  for(i=0;i<k;i++){do{v=R(0,g*g-1);}while(i&&v===seq[i-1]);seq.push(v);}
  var cells='';for(i=0;i<g*g;i++)cells+='<button data-c="'+i+'"></button>';
  var sp={kind:'custom',body:tag(IM.t('memo'))+'<div class="grid g'+g+'">'+cells+'</div>',ttl:k*step+tm(4+k*1.5,L),show:seq.map(function(x){return x+1;}).join(' ')};
  sp.update=function(dt,c){if(ph!=='show')return;t+=dt;var j=Math.floor(t/step),bs=c.el.querySelectorAll('.grid button'),q;for(q=0;q<bs.length;q++)bs[q].className='';
   if(j>=k){ph='in';c.el.querySelector('.tag').textContent=IM.t('yourTurn');return;}if((t%step)<step*.7)bs[seq[j]].className='lit';};
  sp.init=function(c){U.qa(c.el,'.grid button').forEach(function(b){b.onclick=function(){if(ph!=='in'||c.done)return;
   if(+b.getAttribute('data-c')===seq[st]){b.className='dn';st++;if(st>=k)c.pass();}else c.fail();};});};
  return sp;});

def('schulte',19,true,{tr:'Dikkat tablosu',en:'Attention table'},
 {tr:'Karışık yerleştirilmiş sayılara 1\'den başlayarak sırayla dokun/tıkla. 45. seviyeden sonra sayı ve harf dönüşümlü gider (1, A, 2, B, 3, C…). Yanlış dokunuş kartı düşürür.',
  en:'Tap/click the scattered numbers in order starting from 1. After level 45 numbers and letters alternate (1, A, 2, B, 3, C…). A wrong tap fails the card.'},
 function(L){var N=Math.min(25,4+Math.floor(L/5)),alt=L>=45&&N>=8,seq=[],i,st=0;
  for(i=0;i<N;i++)seq.push(alt?(i%2?String.fromCharCode(65+(i-1)/2):String(i/2+1)):String(i+1));
  var cols=Math.ceil(Math.sqrt(N)),w=Math.floor(100/cols)-2,h='';U.sh(seq).forEach(function(s){h+='<button style="width:'+w+'%">'+s+'</button>';});
  var sp={kind:'custom',body:'<div class="sch">'+h+'</div>',ttl:tm(N*1.5+4,L),show:seq.join(' ')};
  sp.init=function(c){U.qa(c.el,'.sch button').forEach(function(b){b.onclick=function(){if(c.done||b.className)return;
   if(b.textContent===seq[st]){b.className='dn';st++;if(st>=N)c.pass();}else c.fail();};});};return sp;});

def('series',13,true,{tr:'Sayı dizisi',en:'Number series'},
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

def('stroop',9,false,{tr:'Renk-kelime',en:'Colour-word'},
 {tr:'DİKKAT ve ÇELİŞME. Bir renk adı başka bir renkle yazılmıştır. Kartın üstündeki kurala göre doğru renk karesini seç: "YAZININ RENGİ" ise yazının boyası, "KELİMENİN ANLAMI" ise kelimenin adı. 1-4 tuşları kareleri seçer. 40. seviyeden itibaren karelerin yeri karışır.',
  en:'ATTENTION & CONFLICT. A colour name is printed in another colour. Follow the rule on the card: pick the INK colour, or the colour the WORD names. Keys 1-4 pick the squares. From level 40 on the squares are shuffled.'},
 function(L){var C=U.sh(IM.COL).slice(0,4),wi=R(0,3),ink=R(0,3);if(Math.random()<.85)while(ink===wi)ink=R(0,3);
  var rule=L>=25&&Math.random()<.5?'word':'ink',ans=rule==='ink'?ink:wi,ord=L>=40?U.sh([0,1,2,3]):[0,1,2,3];
  return {kind:'choice',body:tag(IM.t(rule==='ink'?'ruleInk':'ruleWord'))+big(C[wi][IM.lang],'')['replace']('class="big"','class="big" style="color:'+C[ink].hex+'"'),
   opts:ord.map(function(i){return '<span class="sw" style="background:'+C[i].hex+'"></span>';}),ans:ord.indexOf(ans),show:C[ans][IM.lang],ttl:tm(6,L)};});

def('ltm',25,true,{tr:'Uzun hafıza',en:'Long-term memory'},
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

def('dots',34,true,{tr:'Nokta sayma',en:'Dot counting'},
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
function drawVox(cv,cells,ang,tilt){if(IM.ff)return;var g=cv.getContext('2d'),W=cv.width,H=cv.height,k=IM.kindle,n=cells.length,i,cx=0,cy=0,cz=0,set={};
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
  var l=Math.round(22+f.sh*60);g.fillStyle=k?'hsl(0,0%,'+(30+f.sh*65)+'%)':'hsl(172,55%,'+l+'%)';g.fill();g.lineWidth=k?2:1.5;g.strokeStyle=k?'#000':'#071a1a';g.stroke();});}
IM.vox={ROTS:ROTS,rot:rot,canon:canon,genShape:genShape,mutate:mutate,connected:connected,draw:drawVox};

def('voxcount',38,true,{tr:'3B küp sayma',en:'3D cube count'},
 {tr:'3 BOYUTLU UZAMSAL ALGI. Dönen üç boyutlu bir küp yapısı görürsün. Arkada ve içeride gizli kalanlar dahil toplam kaç küp olduğunu yaz. Yapı döndükçe farklı yüzleri görünür; hepsini zihninde birleştir.',
  en:'3D SPATIAL PERCEPTION. You see a rotating 3D cube structure. Type the total number of cubes, hidden ones included. As it spins, different faces appear; assemble them in your mind.'},
 function(L){var n=Math.min(16,4+Math.floor(L/8)),cells=genShape(n),ang=Math.random()*6,cv=null,sp;
  sp={kind:'text',body:tag(IM.t('voxQ'))+'<canvas class="cv" width="260" height="170"></canvas>',check:function(t){return +t===n;},show:String(n),ttl:tm(14+n*2,L)};
  sp.init=function(c){cv=c.el.querySelector('canvas');drawVox(cv,cells,ang,.5);};
  sp.update=function(dt){ang+=dt*.8;if(cv)drawVox(cv,cells,ang,.5);};sp.paint=function(){if(cv)drawVox(cv,cells,ang,.5);};return sp;});

def('vox3d',44,true,{tr:'3B karşılaştırma',en:'3D compare'},
 {tr:'3 BOYUTLU ZİHİNSEL DÖNDÜRME. İki yapı yan yana döner. Biri diğerinin sadece döndürülmüş hâli mi (1 = AYNI), yoksa bir küp yer değiştirmiş mi / ayna görüntüsü mü (2 = FARKLI)? 1 ya da 2 tuşuna bas.',
  en:'3D MENTAL ROTATION. Two structures spin side by side. Is one just a rotated copy (1 = SAME) or has a cube moved / is it a mirror image (2 = DIFFERENT)? Press 1 or 2.'},
 function(L){var n=Math.min(12,4+Math.floor(L/9)),a=genShape(n),same=Math.random()<.5,b;
  if(same)b=rot(a,P(ROTS));else{b=null;if(L>=60&&Math.random()<.5){var m=a.map(function(v){return [-v[0],v[1],v[2]];});if(canon(m)!==canon(a))b=rot(m,P(ROTS));}if(!b)b=mutate(a);if(!b){b=rot(a,P(ROTS));same=true;}}
  var ang=Math.random()*6,c1=null,c2=null,sp={kind:'choice',body:tag(IM.t('voxS'))+'<div class="two"><canvas width="170" height="150"></canvas><canvas width="170" height="150"></canvas></div>',
   opts:[IM.t('same'),IM.t('diff')],ans:same?0:1,show:same?IM.t('same'):IM.t('diff'),ttl:tm(18+n*2,L)};
  sp.init=function(c){var cs=c.el.querySelectorAll('canvas');c1=cs[0];c2=cs[1];drawVox(c1,a,ang,.5);drawVox(c2,b,ang+1.7,.5);};
  sp.update=function(dt){ang+=dt*.7;if(c1){drawVox(c1,a,ang,.5);drawVox(c2,b,ang+1.7,.5);}};sp.paint=function(){if(c1){drawVox(c1,a,ang,.5);drawVox(c2,b,ang+1.7,.5);}};return sp;});

def('nback',50,false,{tr:'N-geri hafıza',en:'N-back'},
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

def('anagram',21,true,{tr:'Harf bulmaca',en:'Anagram'},
 {tr:'Karışık harflerden Türkçe kelimeyi çıkar ve yaz. Başlangıçta İngilizce ipucu verilir, 40. seviyeden itibaren ipucu yoktur. Uzun kelimeler gelir.',
  en:'Unscramble the letters into a Turkish word and type it. An English hint is shown at first, none from level 40 on. Words get longer.'},
 function(L){var w,i=0,mx=Math.min(12,4+Math.floor(L/8));w=pickW(L,{minLen:4,maxLen:mx,nospace:1});
  var ch=w[0].split(''),sc;i=0;do{sc=U.sh(ch);i++;}while(sc.join('')===w[0]&&i<20);
  var key2=U.nz(w[0]).split('').sort().join(''),ok=IM.W.filter(function(x){return x[0].length===w[0].length&&U.nz(x[0]).split('').sort().join('')===key2;}).map(function(x){return U.nz(x[0]);});
  return {kind:'text',body:tag(IM.t('anaQ')+(L<40?' · '+U.esc(w[1].replace(/^to /,'')):''))+big(sc.join(' ').replace(/i/g,'İ').replace(/ı/g,'I').toUpperCase(),'mono'),check:function(t){return ok.indexOf(U.nz(t))>=0;},show:w[0],ttl:tm(8+w[0].length*1.6,L)};});
})();
