/* Yeni görevler (v2). Tekrar (replay) uyumu için: rastgelelik yalnızca R/P/U.sh ile, zamanlama yalnızca update(dt) ile. */
(function(){
var IM=window.IM,U=IM.U,R=U.R,P=U.P,T=IM.TASKS;
function X(a,b){return IM.lang==='tr'?a:b;}
function tm(b,L){return b*Math.max(.35,1-L*.0065);}
function fl(s){return s;}
function def(id,unlock,name,how,make){T[id]={id:id,unlock:unlock,name:name,how:how,make:make};}
function big(s,c){return '<div class="big'+(c?' '+c:'')+'">'+s+'</div>';}
function tag(s){return '<div class="tag">'+s+'</div>';}
function sup(n){var m={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};return String(n).replace(/[0-9]/g,function(c){return m[c];});}
function flash(o){var t=0,hid=false;
 return {kind:'text',body:'<div class="fl">'+o.shown+'</div>',check:o.check,show:o.show,ttl:o.sec+o.ans,onResult:o.onResult,
  ready:function(){return hid;},update:function(dt,c){t+=dt;if(!hid&&t>=o.sec){hid=true;c.el.querySelector('.fl').innerHTML=o.hidden;}}};}

/* ---- Karşılaştır: karar hızı ---- */
function cx(k){var a,b;
 if(k===0){a=R(1,9);b=R(2,9);return [a+'/'+b,a/b];}
 if(k===1){a=R(11,99);return [(a/10).toFixed(1),a/10];}
 if(k===2){a=R(2,9);b=R(2,5);return [a+sup(b),Math.pow(a,b)];}
 if(k===3){a=R(2,99);return ['√'+a,Math.sqrt(a)];}
 if(k===4){a=R(3,15);b=R(3,15);return [a+' × '+b,a*b];}
 if(k===5){a=R(1,19)*5;b=R(2,20)*10;return [a+'% × '+b,a*b/100];}
 a=R(3,100);return ['log₂ '+a,Math.log(a)/Math.LN2];}
def('compare',8,{tr:'Karşılaştır',en:'Compare'},
 {tr:'KARAR HIZI. İki ifadeden hangisinin BÜYÜK (ya da KÜÇÜK) olduğunu seç: 1 veya 2 tuşu ya da dokunma. Seviye arttıkça ifadeler (kesir, ondalık, üs, kök, yüzde, logaritma) birbirine çok yaklaşır; hesaplamadan tahmin etmek gerekir.',
  en:'DECISION SPEED. Pick which of two expressions is LARGER (or SMALLER): press 1 or 2, or tap. As levels rise the expressions (fractions, decimals, powers, roots, percents, logs) get closer, so you must estimate fast.'},
 function(L){var km=Math.min(6,Math.floor(L/12)+1),x,y,i,ok=false,thr=Math.max(.012,.2-L*.002),mx=.4-L*.002;
  for(i=0;i<300;i++){x=cx(R(0,km));y=cx(R(0,km));var d=Math.abs(x[1]-y[1])/Math.max(x[1],y[1]);if(x[0]!==y[0]&&d>=thr&&d<=mx){ok=true;break;}}
  if(!ok){do{x=cx(0);y=cx(0);}while(x[1]===y[1]);}
  var bg=!(L>=30&&Math.random()<.5),a=bg?(x[1]>y[1]?0:1):(x[1]<y[1]?0:1);
  return {kind:'choice',body:tag(bg?X('Hangisi BÜYÜK?','Which is LARGER?'):X('Hangisi KÜÇÜK?','Which is SMALLER?')),opts:[x[0],y[0]],ans:a,show:[x[0],y[0]][a],ttl:tm(7,L)};});

/* ---- Ekler: Türkçe ünlü uyumu ---- */
var SW='ev okul araba masa göz kapı deniz dağ kuş elma şehir köy yol göl at el kedi kalem sınıf pencere bahçe oda ders park otobüs tren telefon süt gül kız arkadaş öğrenci hastane doktor şarkı müzik spor gazete hayvan insan nehir orman bulut güneş yıldız çiçek* ağaç* kitap* çocuk* balık* mutfak* yaprak* ekmek* erkek* ayak*'.split(' ');
function lvw(w){var m=w.match(/[aıoueiöü]/g);return m[m.length-1];}
function suf(w,k){var v=lvw(w),back='aıou'.indexOf(v)>=0,rnd='ouöü'.indexOf(v)>=0,end=w.charAt(w.length-1),vow='aıoueiöü'.indexOf(end)>=0;
 if(k==='pl')return w+(back?'lar':'ler');
 if(k==='loc'||k==='abl')return w+('çfhkpsşt'.indexOf(end)>=0?'t':'d')+(back?'a':'e')+(k==='abl'?'n':'');
 if(k==='dat')return w+(vow?'y':'')+(back?'a':'e');
 return w+(vow?'y':'')+(back?(rnd?'u':'ı'):(rnd?'ü':'i'));}
function sufOpts(w,k){var e=w.charAt(w.length-1),vow='aıoueiöü'.indexOf(e)>=0,b=vow?'y':'';
 if(k==='pl')return [w+'lar',w+'ler'];
 if(k==='loc')return ['da','de','ta','te'].map(function(s){return w+s;});
 if(k==='abl')return ['dan','den','tan','ten'].map(function(s){return w+s;});
 if(k==='dat')return ['a','e','ya','ye'].map(function(s){return w+s;});
 return ['ı','i','u','ü'].map(function(s){return w+b+s;});}
def('suffix',12,{tr:'Ek ustası',en:'Suffix master'},
 {tr:'TÜRKÇE DİL BİLGİSİ. Bir kelime ve istenen hâl (çoğul, bulunma -da, ayrılma -dan, yönelme -a, belirtme -ı) verilir. Ünlü uyumuna, sert ünsüz benzeşmesine (-ta/-te) ve kaynaştırma "y" harfine göre doğru biçimi seç. Kuralı bilmeyen ezberleyerek öğrenir.',
  en:'TURKISH GRAMMAR. A word and a case (plural, locative -da, ablative -dan, dative -a, accusative -ı) are given. Pick the correct form using vowel harmony, hard-consonant assimilation (-ta/-te) and the buffer letter "y". You absorb the rules by repetition.'},
 function(L){var raw=P(SW),soft=raw.charAt(raw.length-1)==='*',w=raw.replace('*',''),ks=['pl','loc','abl'];
  if(!soft){if(L>=22)ks.push('dat');if(L>=32)ks.push('acc');}
  var k=P(ks),ok=suf(w,k),op=sufOpts(w,k),lab={pl:X('çoğul','plural'),loc:X('bulunma (-da/-de)','"in / at" (locative)'),abl:X('ayrılma (-dan/-den)','"from" (ablative)'),dat:X('yönelme (-a/-e)','"to" (dative)'),acc:X('belirtme (-ı/-i/-u/-ü)','"the" object (accusative)')}[k];
  op=U.sh(op);return {kind:'choice',body:big(w)+tag(lab),opts:op,ans:op.indexOf(ok),show:ok,ttl:tm(8,L)};});

/* ---- Zincir hesap: çalışma belleği + aritmetik ---- */
def('chain',16,{tr:'Zincir hesap',en:'Chain calc'},
 {tr:'ÇALIŞMA BELLEĞİ + HESAP. Önce bir sayı, sonra tek tek işlemler (+7, ×3, −4…) belirir ve kaybolur. Sonucu aklından hesaplayıp yaz. Not alamazsın; sayıyı hep aklında güncelle.',
  en:'WORKING MEMORY + ARITHMETIC. A start number, then single operations (+7, ×3, −4…) appear and vanish. Compute the result in your head and type it. Keep updating the running number mentally.'},
 function(L){var n=Math.min(9,3+Math.floor(L/12)),st,v,ops,i,k,a,g=0;
  do{st=R(2,9+Math.floor(L/4));v=st;ops=[];for(i=0;i<n;i++){k=R(0,L>=20?2:1);a=R(2,9+Math.floor(L/6));
   if(k===0){v+=a;ops.push('+ '+a);}else if(k===1){v-=a;ops.push('− '+a);}else{a=R(2,L>=50?5:3);v*=a;ops.push('× '+a);}}g++;}while(Math.abs(v)>5000&&g<30);
  var step=fl(Math.max(.9,1.7-L*.007)),t=0,cur=-1,hid=false;
  var sp={kind:'text',body:'<div class="fl">'+big(st,'mono')+'</div>',check:function(x){return IM.math.check(x,v);},show:String(v),ttl:(n+2)*step+tm(8+n*2,L),ready:function(){return hid;}};
  sp.update=function(dt,c){t+=dt;var i=Math.floor(t/step);if(i===cur)return;cur=i;var el=c.el.querySelector('.fl');
   if(i===0)el.innerHTML=big(st,'mono');else if(i<=n)el.innerHTML=big(ops[i-1],'mono');else{hid=true;el.innerHTML=tag(X('Sonuç neydi?','What was the result?'))+big('= ?','mono');}};
  return sp;});

/* ---- Kelime listesi: sözel kısa süreli bellek ---- */
def('wordspan',20,{tr:'Kelime listesi',en:'Word list'},
 {tr:'SÖZEL KISA SÜRELİ BELLEK. Bir kelime listesi kısa süre görünür. Kaybolunca "3. kelime neydi?" diye sorulur; yüksek seviyelerde bazen tüm kelimeleri (sırasız) yazman istenir. Kelimeleri bir hikâyeye bağlamak hatırlamayı kolaylaştırır.',
  en:'VERBAL SHORT-TERM MEMORY. A list of words shows briefly. When hidden you are asked "what was word #3?"; at high levels sometimes you must type them all (any order). Linking the words into a story makes recall easier.'},
 function(L){var n=Math.min(9,3+Math.floor(L/15)),ck=Object.keys(IM.CATS),ws=[],tr=0,w;
  while(ws.length<n&&tr++<300){w=P(IM.CATS[P(ck)]);if(ws.indexOf(w)<0)ws.push(w);}n=ws.length;
  var all=L>=35&&Math.random()<.5,k=R(0,n-1),sec=fl(Math.max(1.5,(1.05-L*.004)*n+1)),
   sh=tag(X('Ezberle','Memorize'))+'<div class="wl">'+ws.map(function(x,j){return '<span><i>'+(j+1)+'</i> '+U.esc(x)+'</span>';}).join('')+'</div>';
  return flash({shown:sh,hidden:tag(all?X('Hepsini yaz (sıra önemsiz, boşlukla ayır)','Type them all (any order, space-separated)'):(k+1)+X('. kelime neydi?','. word?')),sec:sec,ans:tm(6+n*(all?2.5:.8),L),
   check:function(t){if(!all)return U.nz(t)===U.nz(ws[k]);var tk=t.split(/[\s,;]+/).filter(Boolean).map(U.nz);return tk.length===n&&ws.every(function(x){return tk.indexOf(U.nz(x))>=0;});},show:all?ws.join(' '):ws[k]});});

/* ---- Pusula: uzamsal yönelim ---- */
def('compass',24,{tr:'Pusula',en:'Compass'},
 {tr:'UZAMSAL YÖNELİM. Başlangıçta (0,0) noktasında KUZEYE bakıyorsun. Komutlar sırayla uygulanır (ileri, sağa dön, sola dön, geri dön). Önce sadece sonunda hangi yöne baktığını seçersin; sonra bulunduğun yeri "x,y" olarak yazarsın (doğu = +x, kuzey = +y).',
  en:'SPATIAL ORIENTATION. You start at (0,0) facing NORTH. Commands apply in order (forward, turn right, turn left, turn around). At first you pick the final facing; later you type your final position as "x,y" (east = +x, north = +y).'},
 function(L){var n=Math.min(12,3+Math.floor(L/10)),face=0,x=0,y=0,st=[],i,k,a,mode=L<30?'face':'pos',DX=[0,1,0,-1],DY=[1,0,-1,0];
  for(i=0;i<n;i++){k=(mode==='pos'&&i===0)?0:R(0,3);
   if(k===0){a=R(1,5);x+=DX[face]*a;y+=DY[face]*a;st.push(X('İleri '+a,'Forward '+a));}
   else if(k===1){face=(face+1)%4;st.push(X('Sağa dön','Turn right'));}
   else if(k===2){face=(face+3)%4;st.push(X('Sola dön','Turn left'));}
   else{face=(face+2)%4;st.push(X('Geri dön','Turn around'));}}
  var body=tag(X('Başlangıç: (0,0), KUZEYE bakıyorsun · doğu = +x, kuzey = +y','Start: (0,0), facing NORTH · east = +x, north = +y'))+'<div class="q cmp">'+st.join(' → ')+'</div>';
  if(mode==='face'){var nm=[X('Kuzey','North'),X('Doğu','East'),X('Güney','South'),X('Batı','West')];
   return {kind:'choice',body:body+tag(X('Sonunda hangi yöne bakıyorsun?','Which way do you face at the end?')),opts:nm,ans:face,show:nm[face],ttl:tm(8+n*2,L)};}
  return {kind:'text',body:body+tag(X('Son konum? (x,y yaz)','Final position? (type x,y)')),show:x+','+y,ttl:tm(12+n*3,L),
   check:function(t){var m=t.replace(/[−–]/g,'-').match(/^\s*\(?\s*(-?\d+)\s*[,; ]\s*(-?\d+)\s*\)?\s*$/);return !!m&&+m[1]===x&&+m[2]===y;}};});

/* ---- Eşleştir: görsel bellek + sözcük ---- */
def('pairs',27,{tr:'Kart eşleştir',en:'Card pairs'},
 {tr:'GÖRSEL + SÖZEL BELLEK. Kartlar kısa süre açık kalır: her Türkçe kelimenin İngilizce karşılığı vardır. Kapanınca kartlara dokunarak çiftleri bul (TR kelime + EN anlamı). Yanlış eşleşme hakkın sınırlıdır; seviye arttıkça çift sayısı artar, hata hakkı azalır.',
  en:'VISUAL + VERBAL MEMORY. Cards stay open briefly: each Turkish word has an English meaning. When they close, tap to find pairs (TR word + EN meaning). Wrong matches are limited; more pairs and fewer allowed mistakes as levels rise.'},
 function(L){var m=Math.min(8,3+Math.floor(L/25)),ws=[],tr=0,w,en,cards=[],i;
  while(ws.length<m&&tr++<400){w=IM.pickWord(L,{nospace:1,maxLen:9});en=w[1].replace(/^to /,'');
   if(en.length<=12&&!/\s/.test(en)&&ws.every(function(x){return x[0]!==w[0]&&x[1]!==en;}))ws.push([w[0],en]);}
  m=ws.length;ws.forEach(function(p,j){cards.push({p:j,t:p[0]});cards.push({p:j,t:p[1]});});cards=U.sh(cards);
  var cols=m<=3?3:4,pk=fl(Math.max(1.8,m*.6-L*.01)),allow=Math.max(2,Math.round(m*(1.1-L*.004))+(L<30?2:0)),ph='peek',t=0,up=[],done=[],cnt=0,miss=0,lock=0;
  var sp={kind:'custom',body:tag(X('Ezberle','Memorize'))+'<div class="prg" style="grid-template-columns:repeat('+cols+',1fr)">'+cards.map(function(c,j){return '<button data-k="'+j+'" class="up">'+U.esc(c.t)+'</button>';}).join('')+'</div>',
   ttl:pk+tm(12+m*10,L),show:ws.map(function(p){return p[0]+' = '+p[1];}).join(' · ')};
  function bs(c){return c.el.querySelectorAll('.prg button');}
  sp.update=function(dt,c){if(ph==='peek'){t+=dt;if(t>=pk){ph='play';U.qa(c.el,'.prg button').forEach(function(b){b.className='';b.textContent='?';});c.el.querySelector('.tag').textContent=X('Sıra sende · hata hakkı: ','Your turn · mistakes left: ')+(allow-miss);}}
   else if(lock>0){lock-=dt;if(lock<=0){var b=bs(c);up.forEach(function(j){b[j].className='';b[j].textContent='?';});up=[];}}};
  sp.init=function(c){U.qa(c.el,'.prg button').forEach(function(b){b.onclick=function(ev){ev.stopPropagation();var k=+b.getAttribute('data-k');
   if(ph!=='play'||lock>0||c.done||done[k]||up.indexOf(k)>=0)return;b.className='up';b.textContent=cards[k].t;up.push(k);
   if(up.length===2){var a=cards[up[0]],d=cards[up[1]];
    if(a.p===d.p){var bb=bs(c);up.forEach(function(j){done[j]=1;bb[j].className='dn';});up=[];cnt++;if(cnt===m)c.pass();}
    else{miss++;lock=.7;c.el.querySelector('.tag').textContent=X('Hata hakkı: ','Mistakes left: ')+(allow-miss);if(miss>allow)c.fail(X('Çok fazla yanlış eşleşme','Too many mismatches'));}}};});};
  return sp;});

/* ---- Işıklar: mantık / planlama bulmacası ---- */
def('lights',33,{tr:'Işıklar',en:'Lights out'},
 {tr:'MANTIK ve PLANLAMA. Bir kareye basınca kendisi ve yandaki (üst, alt, sağ, sol) kareler yanar/söner. Hepsini söndür. Bulmaca çözülebilir olarak üretilir; basış sırası önemli değildir, aynı kareye iki kez basmak etkisizdir. Seviye arttıkça ızgara 5×5 olur.',
  en:'LOGIC & PLANNING. Pressing a square flips it and its four neighbours. Turn everything off. Puzzles are always solvable; order does not matter and pressing a square twice cancels out. The grid grows to 5×5.'},
 function(L){var n=L<60?3:L<85?4:5,k=Math.min(n*n-2,2+Math.floor(L/14)),g=[],i;for(i=0;i<n*n;i++)g.push(0);
  function press(c){var r=Math.floor(c/n),q=c%n;[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var rr=r+d[0],qq=q+d[1];if(rr>=0&&rr<n&&qq>=0&&qq<n)g[rr*n+qq]^=1;});}
  var cells=U.sh(g.map(function(_,j){return j;})).slice(0,k);cells.forEach(press);
  while(g.every(function(x){return !x;})){var e=R(0,n*n-1);if(cells.indexOf(e)<0){cells.push(e);press(e);}}
  function off(){return g.every(function(x){return !x;});}
  var sp={kind:'custom',body:tag(X('Hepsini söndür','Turn them all off'))+'<div class="lg" style="grid-template-columns:repeat('+n+',1fr)">'+g.map(function(v,j){return '<button data-k="'+j+'" class="'+(v?'on':'')+'"></button>';}).join('')+'</div>',
   ttl:tm(15+cells.length*7,L),show:X('En fazla '+cells.length+' basışla çözülürdü','Solvable in at most '+cells.length+' presses')};
  sp.init=function(c){var b=c.el.querySelectorAll('.lg button');U.qa(c.el,'.lg button').forEach(function(x){x.onclick=function(ev){ev.stopPropagation();if(c.done)return;press(+x.getAttribute('data-k'));
   g.forEach(function(v,j){b[j].className=v?'on':'';});if(off())c.pass();};});};
  return sp;});

/* ---- Simge / kategori üst verisi, ses efektleri ---- */
var META={math:['∑','math'],rubik:['◰','spatial'],words:['Aa','lang'],type:['⌨','lang'],arrows:['⇅','motor'],stroop:['◐','attn'],digits:['№','mem'],series:['…','logic'],odd:['≠','lang'],react:['⚡','motor'],schulte:['▦','attn'],anagram:['⤮','lang'],grid:['▣','mem'],ltm:['⌛','mem'],sound:['♪','attn'],assoc:['⇄','lang'],dots:['∴','attn'],voxcount:['⬡','spatial'],vox3d:['⟳','spatial'],nback:['N','mem'],compare:['⚖','math'],suffix:['-lar','lang'],chain:['⛓','math'],wordspan:['¶','mem'],compass:['✢','spatial'],pairs:['◫','mem'],lights:['✦','logic']};
Object.keys(T).forEach(function(id){var m=META[id]||['•','logic'];T[id].ico=m[0];T[id].cat=m[1];});
IM.CATN={math:['Matematik','Math'],lang:['Dil','Language'],mem:['Hafıza','Memory'],attn:['Dikkat','Attention'],spatial:['Uzamsal 3B','Spatial 3D'],motor:['Refleks','Reflex'],logic:['Mantık','Logic']};
IM.sfx=function(ok){if(IM.mute)return;IM.tones(ok?[660,990]:[196,131],ok?.07:.13);};
})();
