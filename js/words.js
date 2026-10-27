(function(){
var IM=window.IM=window.IM||{};
var S="ev|house,araba|car,kitap|book,su|water,ekmek|bread,süt|milk,kedi|cat,köpek|dog,kuş|bird,balık|fish,ağaç|tree,çiçek|flower,güneş|sun,ay|moon,yıldız|star,deniz|sea,nehir|river,dağ|mountain,yol|road,şehir|city,köy|village,okul|school,öğretmen|teacher,öğrenci|student,doktor|doctor,hasta|sick,sağlık|health,para|money,zaman|time,gün|day,gece|night,sabah|morning,akşam|evening,hafta|week,yıl|year,anne|mother,baba|father,kardeş|sibling,arkadaş|friend,çocuk|child,adam|man,kadın|woman,insan|human,el|hand,ayak|foot,göz|eye,kulak|ear,burun|nose,ağız|mouth,baş|head,kalp|heart,kapı|door,pencere|window,masa|table,sandalye|chair,yatak|bed,oda|room,mutfak|kitchen,bahçe|garden,duvar|wall,çatı|roof,elma|apple,armut|pear,üzüm|grape,portakal|orange,peynir|cheese,yumurta|egg,et|meat,tavuk|chicken,çay|tea,kahve|coffee,şeker|sugar,tuz|salt,gelmek|to come,gitmek|to go,görmek|to see,bilmek|to know,istemek|to want,vermek|to give,almak|to take,yapmak|to do,söylemek|to say,yazmak|to write,okumak|to read,yemek|to eat,içmek|to drink,uyumak|to sleep,koşmak|to run,yürümek|to walk,düşünmek|to think,sevmek|to love,anlamak|to understand,öğrenmek|to learn,unutmak|to forget,hatırlamak|to remember,beklemek|to wait,açmak|to open,kapatmak|to close,büyük|big,küçük|small,uzun|long,kısa|short,güzel|beautiful,çirkin|ugly,iyi|good,kötü|bad,yeni|new,eski|old,hızlı|fast,yavaş|slow,sıcak|hot,soğuk|cold,ağır|heavy,hafif|light,zor|difficult,kolay|easy,mutlu|happy,üzgün|sad,kırmızı|red,mavi|blue,yeşil|green,sarı|yellow,siyah|black,beyaz|white,bugün|today,yarın|tomorrow,dün|yesterday,şimdi|now,hep|always,hiç|never,belki|maybe,çok|very,az|few,gerçek|real,hayat|life,ölüm|death,savaş|war,barış|peace,özgürlük|freedom,cesaret|courage,korku|fear,umut|hope,rüya|dream,hafıza|memory,dikkat|attention,sabır|patience,başarı|success,hata|mistake,cevap|answer,soru|question,sınır|limit,hız|speed";
IM.W=S.split(',').map(function(p){return p.split('|');});
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
IM.buildIdx=function(){var m={},U=IM.U;IM.W.forEach(function(w){var k=U.nz(w[1]);(m[k]=m[k]||[]).push(U.nz(w[0]));});IM.idxEn=m;};
IM.loadWords=function(cb){
 try{var x=new XMLHttpRequest();x.open('GET','words.json',true);
  x.onreadystatechange=function(){if(x.readyState!==4)return;
   try{if(x.status===200||(x.status===0&&x.responseText)){var a=JSON.parse(x.responseText);
    if(a&&a.length>9){IM.W=a.map(function(e){return e.length?e:[e.tr,e.en,e.alt];});IM.WJ=1;}}}catch(e){}
   IM.buildIdx();cb&&cb();};
  x.send();}catch(e){IM.buildIdx();cb&&cb();}};
IM.buildIdx();
IM.wh=function(){var W=IM.W,s=[W.length,W[0],W[W.length>>1],W[W.length-1]].join('/'),h=0,i;for(i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h;};
/* uzun hafıza (aralıklı tekrar) */
var INT=[60,300,1800,7200,43200,172800,604800];
IM.deckNote=function(w,ok){if(IM.rp)return;var D=IM.S.deck,d=D[w[0]]||(D[w[0]]={tr:w[0],en:w[1],alt:w[2]||'',box:0});
 d.box=ok?Math.min(d.box+1,INT.length-1):0;d.seen=Date.now();d.due=d.seen+INT[d.box]*1000;
 var k=Object.keys(D);if(k.length>4000)delete D[k[0]];IM.save();};
})();
