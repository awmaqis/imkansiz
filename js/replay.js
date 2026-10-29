/* Oyun kayıtları deposu (localStorage). Kayıt = tohum + girdi olayları; küçük (birkaç KB). */
(function(){
var IM=window.IM=window.IM||{},IDX='imr:idx',PRE='imr:';
function jget(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
function idx(){var a=jget(IDX);return a&&a.length!==undefined?a:[];}
function meta(r){var e=r.end||{};return {id:r.id,ts:r.ts,L:r.L,res:e.res||'quit',sec:Math.round((e.tick||0)*r.dt),ok:e.ok||0,bad:e.bad||0,un:e.un?1:0};}
IM.recs={dropped:0,
 list:function(){return idx().filter(function(x){return !x.kindle;}).slice().sort(function(a,b){return b.ts-a.ts;});},
 get:function(id){return jget(PRE+id);},
 put:function(r){var ix=idx().filter(function(x){return x.id!==r.id;}),ok=jset(PRE+r.id,r);
  while(!ok&&ix.length){var o=0,i;for(i=1;i<ix.length;i++)if(ix[i].ts<ix[o].ts)o=i;
   try{localStorage.removeItem(PRE+ix[o].id);}catch(e){}ix.splice(o,1);IM.recs.dropped++;ok=jset(PRE+r.id,r);}
  if(!ok)return false;ix.push(meta(r));
  if(!jset(IDX,ix)){try{localStorage.removeItem(PRE+r.id);}catch(e){}return false;}return true;},
 del:function(id){try{localStorage.removeItem(PRE+id);}catch(e){}jset(IDX,idx().filter(function(x){return x.id!==id;}));},
 exportAll:function(){return JSON.stringify({im_replays:1,items:idx().map(function(m){return jget(PRE+m.id);}).filter(Boolean)});},
 importText:function(t){var d;try{d=JSON.parse(t);}catch(e){return -1;}if(!d||!d.items)return -1;var n=0;
  d.items.forEach(function(r){if(r&&r.id&&r.ev&&r.seed!==undefined&&IM.recs.put(r))n++;});return n;}
};
})();
