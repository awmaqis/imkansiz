(function(){
var IM=window.IM=window.IM||{};
var S="ev|house,araba|car,kitap|book,su|water,ekmek|bread,süt|milk,kedi|cat,köpek|dog,kuş|bird,balık|fish,ağaç|tree,çiçek|flower,güneş|sun,ay|moon,yıldız|star,deniz|sea,nehir|river,dağ|mountain,yol|road,şehir|city,köy|village,okul|school,öğretmen|teacher,öğrenci|student,doktor|doctor,hasta|sick,sağlık|health,para|money,zaman|time,gün|day,gece|night,sabah|morning,akşam|evening,hafta|week,yıl|year,anne|mother,baba|father,kardeş|sibling,arkadaş|friend,çocuk|child,adam|man,kadın|woman,insan|human,el|hand,ayak|foot,göz|eye,kulak|ear,burun|nose,ağız|mouth,baş|head,kalp|heart,kapı|door,pencere|window,masa|table,sandalye|chair,yatak|bed,oda|room,mutfak|kitchen,bahçe|garden,duvar|wall,çatı|roof,elma|apple,armut|pear,üzüm|grape,portakal|orange,peynir|cheese,yumurta|egg,et|meat,tavuk|chicken,çay|tea,kahve|coffee,şeker|sugar,tuz|salt,gelmek|to come,gitmek|to go,görmek|to see,bilmek|to know,istemek|to want,vermek|to give,almak|to take,yapmak|to do,söylemek|to say,yazmak|to write,okumak|to read,yemek|to eat,içmek|to drink,uyumak|to sleep,koşmak|to run,yürümek|to walk,düşünmek|to think,sevmek|to love,anlamak|to understand,öğrenmek|to learn,unutmak|to forget,hatırlamak|to remember,beklemek|to wait,açmak|to open,kapatmak|to close,büyük|big,küçük|small,uzun|long,kısa|short,güzel|beautiful,çirkin|ugly,iyi|good,kötü|bad,yeni|new,eski|old,hızlı|fast,yavaş|slow,sıcak|hot,soğuk|cold,ağır|heavy,hafif|light,zor|difficult,kolay|easy,mutlu|happy,üzgün|sad,kırmızı|red,mavi|blue,yeşil|green,sarı|yellow,siyah|black,beyaz|white,bugün|today,yarın|tomorrow,dün|yesterday,şimdi|now,hep|always,hiç|never,belki|maybe,çok|very,az|few,gerçek|real,hayat|life,ölüm|death,savaş|war,barış|peace,özgürlük|freedom,cesaret|courage,korku|fear,umut|hope,rüya|dream,hafıza|memory,dikkat|attention,sabır|patience,başarı|success,hata|mistake,cevap|answer,soru|question,sınır|limit,hız|speed";
var SA=S.split(',');IM.W=SA.map(function(p,i){var a=p.split('|');a.push('',Math.round(i*99/(SA.length-1)));return a;}); /* 4. eleman = zorluk 0-99 (yedek listede sıra = zorluk) */
IM.SENT=["Damlaya damlaya göl olur","Sakla samanı gelir zamanı","Ak akçe kara gün içindir","Bir elin nesi var iki elin sesi var","Gülü seven dikenine katlanır","Komşu komşunun külüne muhtaç","Acele işe şeytan karışır","Çalışmak başarının anahtarıdır","Sabır acıdır meyvesi tatlıdır","Her şey zamanla yerini bulur","Ağaç yaşken eğilir","Bugünün işini yarına bırakma","Üzüm üzüme baka baka kararır","Kişi arkadaşından bellidir","Dost acı söyler","Güzellik göz ile değil gönül ile görülür"];
IM.CATS={
 hayvan:"kedi köpek at inek koyun kuş balık aslan kaplan tavşan".split(' '),
 meyve:"elma armut üzüm portakal muz kiraz çilek şeftali erik nar".split(' '),
 sebze:"domates salatalık patlıcan biber havuç soğan patates ıspanak lahana kabak".split(' '),
 renk:"kırmızı mavi yeşil sarı siyah beyaz mor turuncu pembe gri".split(' '),
 vücut:"el ayak göz kulak burun ağız baş kalp diz omuz".split(' '),
 aile:"anne baba kardeş dede nine amca teyze dayı hala torun".split(' '),
 ulaşım:"araba otobüs tren uçak gemi bisiklet tramvay metro taksi kamyon".split(' '),
 mobilya:"masa sandalye yatak dolap koltuk halı sehpa raf kanepe perde".split(' '),
 meslek:"doktor öğretmen mühendis avukat pilot aşçı berber terzi şoför polis".split(' '),
 hava:"yağmur kar rüzgar bulut güneş sis fırtına dolu şimşek gökkuşağı".split(' '),
 içecek:"çay kahve su süt ayran limonata kola gazoz şalgam şerbet".split(' '),
 zaman:"saat dakika saniye gün hafta mevsim sabah akşam öğle gece".split(' '),
 alet:"çekiç testere tornavida pense matkap anahtar çivi vida bıçak makas".split(' '),
 doğa:"dağ deniz nehir göl orman çöl ada vadi şelale mağara".split(' ')};
IM.WJ=0;IM.idxEn={};
IM.buildIdx=function(){var m={},x={},U=IM.U;IM.W.forEach(function(w){var gl=[w[1]].concat(w[2]?String(w[2]).split('|'):[]),t=U.nz(w[0]),e=U.lc(w[0]);
 gl.forEach(function(g){var k=U.nz(g);if(!k)return;(m[k]=m[k]||[]);if(m[k].indexOf(t)<0)m[k].push(t);(x[k]=x[k]||[]);if(x[k].indexOf(e)<0)x[k].push(e);});});IM.idxEn=m;IM.idxEx=x;
 IM.WS=IM.W.map(function(w,i){return [typeof w[3]==='number'?w[3]:Math.min(99,w[0].length*8),i];}).sort(function(a,b){return a[0]-b[0]||a[1]-b[1];}).map(function(p){return IM.W[p[1]];});};
/* SEVİYE → KELİME ZORLUĞU. [en_yüksek_seviye, alt%, üst%]: kelimeler zorluğa göre dizilir (0=kolay, 1=zor); o seviyede sadece alt%-üst% aralığından seçilir. İstediğin gibi değiştir. */
IM.WLV=[[5,0,.12],[10,0,.2],[20,.05,.3],[35,.15,.45],[50,.25,.6],[75,.4,.8],[100,.55,1],[1e9,.65,1]];
IM.pickWord=function(L,o){o=o||{};var t=IM.WLV,b=t[t.length-1],i,S=IM.WS,n=S.length,lo,hi,w;
 for(i=0;i<t.length;i++)if(L<=t[i][0]){b=t[i];break;}
 lo=Math.min(n-1,Math.floor(b[1]*n));hi=Math.max(lo,Math.ceil(b[2]*n)-1);
 function bad(x){return (o.minLen&&x[0].length<o.minLen)||(o.maxLen&&x[0].length>o.maxLen)||(o.nospace&&/\s/.test(x[0]));}
 for(i=0;i<60;i++){w=S[IM.U.R(lo,hi)];if(!bad(w))return w;}
 var f=S.slice(lo,hi+1).filter(function(x){return !bad(x);});if(!f.length)f=S.filter(function(x){return !bad(x);});
 return f.length?f[IM.U.R(0,f.length-1)]:w;};
/* ---- Amisa: github.com/awmaqis/amisa/data.json → "Sözlük" klasöründeki kelimeler, birden çok İngilizce karşılıkla ---- */
IM.AMISA_URL='https://raw.githubusercontent.com/awmaqis/amisa/main/data.json';IM.AMISA_FOLDER='sözlük';
function enList(s,out){String(s||'').split(/[,;]/).forEach(function(p){p=p.replace(/\s*\([^)]*\)/g,'').replace(/\s+/g,' ').trim().toLowerCase();
 if(p&&p.length<=40&&/^[a-z][a-z '\-\.\/]*$/.test(p)&&out.indexOf(p)<0)out.push(p);});}
IM.fromAmisa=function(d){if(!d||!d.dicts||!d.folders)return null;var fid=null,res=[],lk=IM.AMISA_FOLDER;
 d.folders.forEach(function(f){if(String(f.name||'').toLocaleLowerCase('tr')===lk)fid=f.id;});if(!fid)return null;
 d.dicts.forEach(function(dc){if(dc.fid!==fid)return;(dc.w||[]).forEach(function(w){var tr=String(w.w||'').trim(),en=[],x=w.x||{},k,sub=0;if(!tr||/[^\wçğıöşüâîûÇĞİÖŞÜ \-']/.test(tr))return;
  if(x.k)enList(x.k.en,en);for(k in x)if(k!=='k'&&x[k]){var n0=en.length;enList(x[k].en,en);if(en.length>n0)sub=1;}
  if(!en.length){var mm=String(w.m||'').match(/^EN:\s*(.*)$/mg);(mm||[]).forEach(function(l){enList(l.slice(3),en);});}
  if(!en.length)return;
  res.push([tr,en[0],en.slice(1,6).join('|'),tr.length*6+(/\s/.test(tr)?12:0)+(sub?10:0)+(en.length>2?4:0)]);});});
 if(res.length<10)return null;var ord=res.map(function(r,i){return i;}).sort(function(a,b){return res[a][3]-res[b][3]||a-b;});
 ord.forEach(function(i,p){res[i][3]=Math.round(p*99/(res.length-1));});return res;};
IM.loadWords=function(cb){var done=false,AK='im:amisa',cached=null;function fin(){if(done)return;done=true;IM.buildIdx();cb&&cb();}
 function local(){try{var x=new XMLHttpRequest();x.open('GET','words.json',true);x.onreadystatechange=function(){if(x.readyState!==4)return;
   try{if(x.status===200||(x.status===0&&x.responseText)){var a=JSON.parse(x.responseText);if(a&&a.length>9){IM.W=a.map(function(e){return e.length?e:[e.tr,e.en,e.alt];});IM.WJ=1;IM.WSRC='words.json';}}}catch(e){}fin();};x.send();}catch(e){fin();}}
 try{cached=JSON.parse(localStorage.getItem(AK)||'null');}catch(e){}
 if(cached&&cached.length>9){IM.W=cached;IM.WSRC='amisa (kayıtlı)';fin();}
 try{var r=new XMLHttpRequest();r.open('GET',IM.AMISA_URL+'?t='+Date.now(),true);r.timeout=cached?8000:2600;
  r.onload=function(){try{var a=IM.fromAmisa(JSON.parse(r.responseText));if(a){try{localStorage.setItem(AK,JSON.stringify(a));}catch(e){}
    if(!done){IM.W=a;IM.WSRC='amisa';fin();}return;}}catch(e){}if(!done)local();};
  r.onerror=r.ontimeout=function(){if(!done)local();};r.send();}catch(e){if(!done)local();}};
IM.buildIdx();
IM.wh=function(){var W=IM.W,s=[W.length,W[0],W[W.length>>1],W[W.length-1],'v4'].join('/'),h=0,i;for(i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h;};
/* uzun hafıza (aralıklı tekrar) */
var INT=[60,300,1800,7200,43200,172800,604800];
IM.deckNote=function(w,ok){if(IM.rp)return;var D=IM.S.deck,d=D[w[0]]||(D[w[0]]={tr:w[0],en:w[1],alt:w[2]||'',box:0});
 d.box=ok?Math.min(d.box+1,INT.length-1):0;d.seen=Date.now();d.due=d.seen+INT[d.box]*1000;
 var k=Object.keys(D);if(k.length>4000)delete D[k[0]];IM.save();};
})();
