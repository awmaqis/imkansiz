(function(){
var IM=window.IM=window.IM||{};
IM.lang='tr';IM.kindle=false;
function R(a,b){return a+Math.floor(Math.random()*(b-a+1));}
IM.U={
 R:R,
 P:function(a){return a[Math.floor(Math.random()*a.length)];},
 sh:function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=R(0,i),t=a[i];a[i]=a[j];a[j]=t;}return a;},
 esc:function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');},
 lc:function(s){return String(s).replace(/İ/g,'i').replace(/I/g,'ı').toLowerCase();},
 nz:function(s){
  s=String(s).replace(/İ/g,'i').replace(/I/g,'i').toLowerCase();
  var m={'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','â':'a','î':'i','û':'u'};
  s=s.replace(/[çğıöşüâîû]/g,function(c){return m[c];});
  return s.replace(/^to\s+/,'').replace(/\s+/g,' ').trim();},
 qa:function(el,sel){return Array.prototype.slice.call(el.querySelectorAll(sel));}
};
var D={
tr:{
 tag:'İnsan sınırlarının ötesinde.',cont:'DEVAM ET · SEVİYE ',newg:'YENİ OYUN',lab:'LAB · GÖREVLERİ DENE',help:'NASIL OYNANIR',
 lvl:'SEVİYE',stress:'STRES',start:'BAŞLA',next:'SONRAKİ SEVİYE',retry:'TEKRAR DENE',menu:'MENÜ',
 over:'Stres %100 oldu. Oyun bitti.',won:'Seviye tamamlandı',newtask:'Yeni görev',
 ph:'Cevabı yaz → Enter  ·  Tab: kart değiştir',pause:'Duraklatıldı',resume:'DEVAM',pickLvl:'Başlanacak seviye',best:'En yüksek açık seviye',
 run:'ÇALIŞTIR',stop:'DURDUR',tests:'OTOMATİK TESTLER',okc:'doğru',badc:'hatalı',
 wait:'BEKLE…',now:'ŞİMDİ!',early:'Çok erken bastın',late:'Çok geç kaldın',replay:'▶ TEKRAR DİNLE',match:'EŞLEŞTİ  [SPACE]',
 same:'AYNI',diff:'FARKLI',memo:'Ezberle',typeIt:'Şimdi yaz',typeRev:'Şimdi TERSTEN yaz',yourTurn:'Sıra sende',
 hi:'En YÜKSEK ses kaçıncıydı?',lo:'En ALÇAK ses kaçıncıydı?',oddQ:'Hangisi farklı gruptan?',assQ:'ile aynı grup:',
 ruleInk:'YAZININ RENGİ hangisi?',ruleWord:'Kelimenin ANLAMI hangi renk?',arrRev:'TERS SIRADA bas',arrOpp:'ZITINA bas',
 ltmDue:'Uzun hafıza · daha önce gördün',ltmNew:'Yeni kelime · ezberle, sonra yazacaksın',missed:'Eşleşmeyi kaçırdın',
 voxQ:'Kaç küp var? (gizli olanlar dahil)',voxS:'İki şekil döndürülünce aynı mı?',anaQ:'Harfleri düzenle, kelimeyi yaz',
 dotsQ:'Kaç nokta vardı?',credit:'Sözlük verisi: Vikisözlük / kaikki.org (CC BY-SA)',finale:'İMKANSIZ’ı yendin. İnsan olduğuna emin misin?',
 mathHint:'Sayı ya da a/b kesri yaz',gameOverTip:'İpucu: LAB sekmesinde zayıf görevini tek başına çalış.',
 kindleOn:'KINDLE: AÇIK',kindleOff:'KINDLE',paused:'Sekme gizlendiği için durdu.',tasks:'GÖREVLER',lvlSel:'SEVİYE'
},
en:{
 tag:'Beyond human limits.',cont:'CONTINUE · LEVEL ',newg:'NEW GAME',lab:'LAB · TRY TASKS',help:'HOW TO PLAY',
 lvl:'LEVEL',stress:'STRESS',start:'START',next:'NEXT LEVEL',retry:'TRY AGAIN',menu:'MENU',
 over:'Stress hit 100%. Game over.',won:'Level complete',newtask:'New task',
 ph:'Type answer → Enter  ·  Tab: switch card',pause:'Paused',resume:'RESUME',pickLvl:'Start at level',best:'Highest unlocked level',
 run:'RUN',stop:'STOP',tests:'AUTO TESTS',okc:'correct',badc:'wrong',
 wait:'WAIT…',now:'NOW!',early:'Too early',late:'Too late',replay:'▶ REPLAY',match:'MATCH  [SPACE]',
 same:'SAME',diff:'DIFFERENT',memo:'Memorize',typeIt:'Now type it',typeRev:'Now type it BACKWARDS',yourTurn:'Your turn',
 hi:'Which tone was the HIGHEST?',lo:'Which tone was the LOWEST?',oddQ:'Which one is from another group?',assQ:'— same group as:',
 ruleInk:'Which is the INK color?',ruleWord:'Which color does the WORD name?',arrRev:'press in REVERSE order',arrOpp:'press the OPPOSITE',
 ltmDue:'Long-term memory · you saw this before',ltmNew:'New word · memorize it, then type it',missed:'You missed a match',
 voxQ:'How many cubes? (hidden ones too)',voxS:'Same shape once rotated?',anaQ:'Unscramble the Turkish word',
 dotsQ:'How many dots were there?',credit:'Dictionary data: Wiktionary / kaikki.org (CC BY-SA)',finale:'You beat IMKANSIZ. Are you sure you are human?',
 mathHint:'Type a number or a/b fraction',gameOverTip:'Tip: practise your weakest task alone in LAB.',
 kindleOn:'KINDLE: ON',kindleOff:'KINDLE',paused:'Paused because the tab was hidden.',tasks:'TASKS',lvlSel:'LEVEL'
}};
IM.t=function(k){var d=D[IM.lang];return d[k]===undefined?k:d[k];};
IM.COL=[{tr:'KIRMIZI',en:'RED',hex:'#ff3b4e'},{tr:'MAVİ',en:'BLUE',hex:'#3b82ff'},{tr:'YEŞİL',en:'GREEN',hex:'#22d36b'},{tr:'SARI',en:'YELLOW',hex:'#ffd23b'}];
})();
