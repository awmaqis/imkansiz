(function(){
var IM=window.IM=window.IM||{};
function R(a,b){return a+Math.floor(Math.random()*(b-a+1));}
function P(a){return a[Math.floor(Math.random()*a.length)];}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t;}return a;}
function M(n){return n<0?'−'+(-n):String(n);}
function PM(n){return n<0?'('+M(n)+')':String(n);}
function pm(n){return n<0?'− '+(-n):'+ '+n;}
function cf(a){return a===1?'':a===-1?'−':M(a);}
function sup(n){var m={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};return String(n).replace(/[0-9-]/g,function(c){return m[c];});}
function sub(n){var m={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};return String(n).replace(/[0-9]/g,function(c){return m[c];});}
function F(n,d){var g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d;}return {v:n/d,s:d===1?M(n):M(n)+'/'+d};}
function N(v){return {v:v,s:M(v)};}
function A(q,r){return {q:q,v:r.v,s:r.s};}
function pol(c){var o='';for(var i=c.length-1;i>=0;i--){var v=c[i];if(!v)continue;var a=Math.abs(v),vp=i===0?String(a):(i===1?(a===1?'':a)+'x':(a===1?'':a)+'x'+sup(i));
 if(!o)o=(v<0?'−':'')+vp;else o+=(v<0?' − ':' + ')+vp;}return o||'0';}
function zf(a,b){return '('+M(a)+' '+(b<0?'−':'+')+' '+(Math.abs(b)===1?'':Math.abs(b))+'i)';}
function mat(m){return '['+m.map(function(r){return r.map(M).join(' ');}).join('; ')+']';}
var TRI=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,40,41]];
function Kf(s,n){return Math.min(n-1,Math.floor(Math.random()*(1+s*n)));}

function t1(s){var m=Math.round(6+s*24),a=R(2,m),b=R(2,m),c=R(2,12),d=R(2,m),e=R(2,9);
 var T=[function(){return ['('+a+' + '+b+') × '+c+' − '+d,(a+b)*c-d];},
 function(){return [a+' × '+b+' + '+c+' × '+d,a*b+c*d];},
 function(){return [a+' + '+b+' × ('+c+' − '+d+')',a+b*(c-d)];},
 function(){return [(a*c)+' ÷ '+c+' + '+b+' × '+e,a+b*e];},
 function(){return ['('+a+' + '+b+') × ('+c+' − '+d+')',(a+b)*(c-d)];},
 function(){return ['('+(a*e)+' − '+(b*e)+') ÷ '+e+' + '+c+'²',a-b+c*c];}];
 var r=T[R(0,Math.min(5,2+Math.floor(s*4)))]();return {q:r[0].replace(/\+ −/g,'−'),v:r[1],s:M(r[1])};}
function t2(s){var mx=Math.round(4+s*8),b=R(2,mx),d=R(2,mx),a=R(1,b+3),c=R(1,d+3),k=R(0,4),p,n;
 if(k===0)return A(a+'/'+b+' + '+c+'/'+d,F(a*d+c*b,b*d));
 if(k===1)return A(a+'/'+b+' × '+c+'/'+d,F(a*c,b*d));
 if(k===2)return A(a+'/'+b+' ÷ '+c+'/'+d,F(a*d,b*c));
 if(k===3){p=R(1,19)*5;n=R(1,20)*20;return A(p+'% × '+n,N(p*n/100));}
 p=R(1,9)*5;n=R(2,20)*20;return A(n+' × (1 + '+p+'%)',N(n+n*p/100));}
function t3(s){var x=R(-10,10),m=Math.round(3+s*9),a=R(2,m),c=P([-1,1])*R(1,m),b=R(-20,20),d;if(c===a)c=a+1;
 if(Math.random()<.5){d=a*x+b-c*x;return A(cf(a)+'x '+pm(b)+' = '+cf(c)+'x '+pm(d)+'   →  x = ?',N(x));}
 d=a*x+a*b-c*x;return A(a+'(x '+pm(b)+') = '+cf(c)+'x '+pm(d)+'   →  x = ?',N(x));}
function t4(s){var k=R(0,3),m=Math.round(3+s*7),x,y,a1,b1,a2,b2,p,q,a,b,c;
 if(k===0){for(;;){x=R(-9,9);y=R(-9,9);a1=R(1,m);b1=P([-1,1])*R(1,m);a2=P([-1,1])*R(1,m);b2=R(1,m);if(a1*b2-a2*b1!==0)break;}
  p=R(1,3);q=P([-2,-1,1,2,3]);
  return A(cf(a1)+'x '+pm(b1)+'y = '+M(a1*x+b1*y)+'\n'+cf(a2)+'x '+pm(b2)+'y = '+M(a2*x+b2*y)+'\n'+cf(p)+'x '+pm(q)+'y = ?',N(p*x+q*y));}
 if(k===1){a=R(2,m);b=R(1,20);c=R(-10,30);return A('min{ x ∈ ℤ : '+a+'x − '+b+' > '+M(c)+' }',N(Math.floor((c+b)/a)+1));}
 a=R(-9,9);b=R(2,2+Math.round(s*8));
 if(k===2)return A('#{ x ∈ ℤ : |x '+pm(-a)+'| < '+b+' }',N(2*b-1));
 return A('#{ x ∈ ℤ : |x '+pm(-a)+'| ≤ '+b+' }',N(2*b+1));}
function t5(s){var k=R(0,Math.min(5,2+Math.floor(s*4))),b,n,m,t,c;
 if(k===0){b=R(2,5);var i=R(1,5),j=R(1,5);n=R(0,i+j);return A(b+sup(i)+' · '+b+sup(j)+' ÷ '+b+sup(n),N(Math.pow(b,i+j-n)));}
 if(k===1){t=P(TRI);m=R(1,1+Math.round(s*5));return A('√('+(t[0]*t[0]*m*m)+' + '+(t[1]*t[1]*m*m)+')',N(t[2]*m));}
 if(k===2){n=R(2,3+Math.round(s*5));return A(n*n*n+'^(2/3)',N(n*n));}
 if(k===3){b=P([2,3,5,6,7]);m=R(2,4+Math.round(s*6));return A('√'+(b*m*m)+' · √'+b,N(b*m));}
 if(k===4){b=R(2,4);n=P([3,5]);m=R(2,4);c=R(2,5);return A('(−'+b+')'+sup(n)+' + '+c+sup(m),N(-Math.pow(b,n)+Math.pow(c,m)));}
 b=R(2,5);n=R(2,4);return A(b+sup(-n),F(1,Math.pow(b,n)));}
function t6(s){var r1,r2,a=R(1,1+Math.round(s*2)),k=R(0,3),S,r;
 do{r1=R(-9,9);r2=R(-9,9);}while(!r1||!r2||r1===r2);
 var b=-a*(r1+r2),c=a*r1*r2,po=pol([c,b,a])+' = 0';
 if(k===0)return A(po+'   →  max(x₁, x₂)',N(Math.max(r1,r2)));
 if(k===1)return A(po+'   →  x₁² + x₂²',N(r1*r1+r2*r2));
 if(k===2)return A(po+'   →  |x₁ − x₂|',N(Math.abs(r1-r2)));
 S=R(2,12);r=R(1,S-1);return A('x² − '+S+'x + k = 0,  x₁ = '+r+'   →  k',N(r*(S-r)));}
function t7(s){var k=R(0,4),b=P([2,3,5]),m=R(1,4),u,i,q;
 if(k===0){b=P([2,3,5,10]);m=R(2,b===10?4:5);return A('log'+sub(b)+' '+Math.pow(b,m),N(m));}
 if(k===1){var p=R(2,4);q=R(1,6);while(q===p)q=R(1,6);b=P([2,3]);return A('log'+sub(Math.pow(b,p))+' '+Math.pow(b,q),F(q,p));}
 if(k===2){u=R(2,7);i=R(1,3);b=P([2,3]);var u2=R(2,7),j=R(1,3);return A('log'+sub(b)+' '+(u*Math.pow(b,i))+' − log'+sub(b)+' '+u+' + log'+sub(b)+' '+(u2*Math.pow(b,j))+' − log'+sub(b)+' '+u2,N(i+j));}
 if(k===3){var Nn=R(2,30);b=P([2,3,5]);return A(b+'^(log'+sub(b)+' '+Nn+' + 1)',N(Nn*b));}
 b=P([3,5,6,7]);m=R(2,5);return A('log'+sub(2)+' '+b+' · log'+sub(b)+' '+Math.pow(2,m),N(m));}
var SQ={0:0,30:1,45:2,60:3,90:4},CQ={0:4,30:3,45:2,60:1,90:0};
function t8(s){var k=R(0,3),ang=[0,30,45,60,90],a,b,A1,B1,sm,al;
 if(k===0){a=R(1,5);b=R(1,5);A1=P(ang);B1=P(ang);return A(a+'·sin²'+A1+'° + '+b+'·cos²'+B1+'°',F(a*SQ[A1]+b*CQ[B1],4));}
 if(k===1){sm=P([30,90,150]);al=5*R(2,sm/5-2);b=sm-al;return A('sin '+al+'°·cos '+b+'° + cos '+al+'°·sin '+b+'°',F(sm===90?2:1,2));}
 if(k===2){var th=P([30,45,60,90]);return A('cos²'+th+'° − sin²'+th+'°',F({30:1,45:0,60:-1,90:-2}[th],2));}
 var T=[['sin(π/6)',1,2],['cos(π/3)',1,2],['tan(π/4)',1,1],['sin(π/2)',1,1],['cos(π)',-1,1],['sin(π)',0,1],['cos(0)',1,1],['cos(π/2)',0,1]],q=[],sum=0,i,x,c;
 for(i=0;i<3;i++){x=P(T);c=R(1,1+Math.round(s*4));q.push(c+'·'+x[0]);sum+=c*x[1]/x[2];}
 return {q:q.join(' + '),v:sum,s:F(Math.round(sum*2),2).s};}
function t9(s){var k=R(0,6),a=R(-9,9)||3,b,c,d,m=Math.round(2+s*7);
 if(k===0)return A('lim x→'+M(a)+'  (x² − '+a*a+')/(x '+pm(-a)+')',N(2*a));
 if(k===1){a=R(1,m);b=R(-9,9);c=R(1,m);d=R(1,9);return A('lim x→∞  ('+a+'x² '+pm(b)+'x)/('+c+'x² '+pm(d)+')',F(a,c));}
 if(k===2){a=R(2,m);b=R(1,m);return A('lim x→0  sin('+a+'x)/sin('+(b===1?'':b)+'x)',F(a,b));}
 if(k===3){a=R(2,m+2);return A('lim x→0  (e^('+a+'x) − 1)/x',N(a));}
 if(k===4)return A('lim x→'+M(a)+'  (x³ − '+M(a*a*a)+')/(x '+pm(-a)+')',N(3*a*a));
 if(k===5){a=R(1,m);c=R(1,m);return A('lim x→∞  ('+a*c+'x + '+R(1,9)+')/√('+(c*c)+'x² + '+R(1,9)+')',N(a));}
 a=R(1,m+2);return A('lim x→0  (1 − cos('+a+'x))/x²',F(a*a,2));}
function t10(s){var k=R(0,Math.min(6,2+Math.floor(s*5))),a=R(-5,5)||2,b=R(-5,5),c=R(-9,9),d=R(-9,9),p=R(-3,3),n;
 if(k===0)return A('f(x) = '+pol([d,c,b,a])+',  f′('+M(p)+')',N(3*a*p*p+2*b*p+c));
 if(k===1)return A('f(x) = (x² '+pm(a)+')(x '+pm(b)+'),  f′('+M(p)+')',N(2*p*(p+b)+(p*p+a)));
 if(k===2){n=R(3,5);p=R(0,2);a=R(1,4);return A('f(x) = ('+cf(a)+'x '+pm(b)+')'+sup(n)+',  f′('+p+')',N(n*a*Math.pow(a*p+b,n-1)));}
 if(k===3){a=R(2,9);b=R(2,9);return A('f(x) = '+a+'·e^('+b+'x),  f′(0)',N(a*b));}
 if(k===4){a=R(1,5);p=R(1,4);return A('f(x) = x²/(x + '+a+'),  f′('+p+')',F(p*p+2*a*p,(p+a)*(p+a)));}
 if(k===5){a=R(1,9);p=R(1,5);return A('f(x) = ln(x² + '+a+'),  f′('+p+')',F(2*p,p*p+a));}
 a=R(1,3);b=R(-3,3);c=R(-4,4);p=R(-2,2);return A('f(x) = '+pol([0,0,c,b,a])+',  f″('+M(p)+')',N(12*a*p*p+6*b*p+2*c));}
function t11(s){var k=R(0,6),a=R(-4,4)||1,b=R(-5,5),c=R(-5,5),kk=R(1,2+Math.round(s*4)),n,m;
 if(k===0)return A('∫[0, '+kk+'] ('+pol([c,b,a])+') dx',F(2*a*kk*kk*kk+3*b*kk*kk+6*c*kk,6));
 if(k===1){a=R(1,9);return A(a+'·∫[0, π] sin x dx + ∫[0, π/2] cos x dx',N(2*a+1));}
 if(k===2){a=R(2,9);return A('∫[1, e²] '+a+'/x dx',N(2*a));}
 if(k===3){n=R(2,5);return A('∫[0, 1] 2x(x² + 1)'+sup(n)+' dx',F(Math.pow(2,n+1)-1,n+1));}
 if(k===4){a=R(2,9);return A(a+'·∫[0, 1] x·eˣ dx',N(a));}
 if(k===5){m=R(1,kk);return A('∫[0, '+(kk+m)+'] |x − '+m+'| dx',F(m*m+kk*kk,2));}
 kk=R(1,4);a=R(1,6);return A('∫[−'+kk+', '+kk+'] (x³ + '+a+'x²) dx',F(2*a*kk*kk*kk,3));}
function t12(s){var k=R(0,7),a=R(1,9),d=R(2,6),n=R(5,10+Math.round(s*20)),q=R(2,6),r=R(2,4),m;
 if(k===0)return A(a+' + '+(a+d)+' + '+(a+2*d)+' + … + '+(a+(n-1)*d),N(n*(2*a+(n-1)*d)/2));
 if(k===1)return A('Σ(n=0→∞) '+a+'·(1/'+q+')ⁿ',F(a*q,q-1));
 if(k===2)return A('Σ(k=1→'+n+') 1/(k(k+1))',F(n,n+1));
 if(k===3){n=R(3,6+Math.round(s*10));return A('Σ(k=1→'+n+') k²',N(n*(n+1)*(2*n+1)/6));}
 if(k===4){n=R(5,9+Math.round(s*6));m=R(2,4);var c=1,i;for(i=0;i<m;i++)c=c*(n-i)/(i+1);return A('[xᵐ](1 + x)ⁿ,  n = '+n+', m = '+m,N(Math.round(c)));}
 if(k===5){m=R(2,5);a=R(1,4);var f=1;for(var j=2;j<=m;j++)f*=j;return A('[x'+sup(m)+'] e^('+a+'x)',F(Math.pow(a,m),f));}
 if(k===6){n=R(4,9+Math.round(s*20));return A('Σ(k=1→'+n+') (2k − 1)',N(n*n));}
 n=R(3,5);return A(a+'·(1 + '+r+' + … + '+r+sup(n-1)+')',N(a*(Math.pow(r,n)-1)/(r-1)));}
function t13(s){var k=R(0,6),a=R(-6,6),b=R(-6,6)||1,c=R(-6,6),d=R(-6,6)||2,n,t,u;
 if(k===0)return A('Re('+zf(a,b)+zf(c,d)+')',N(a*c-b*d));
 if(k===1)return A('Im('+zf(a,b)+zf(c,d)+')',N(a*d+b*c));
 if(k===2){t=P(TRI);return {q:'|'+zf(t[0],t[1])+'|',v:t[2],s:String(t[2])};}
 if(k===3){n=R(10,100);return A('Re(i^'+n+') + 2·Im(i^'+n+')',N([1,2,-1,-2][n%4]));}
 if(k===4){c=c||3;return A('Re('+zf(a,b)+'/'+zf(c,d)+')',F(a*c+b*d,c*c+d*d));}
 if(k===5){n=R(2,12);var x=1,y=0,i,nx;for(i=0;i<n;i++){nx=x-y;y=x+y;x=nx;}return A('Re((1 + i)^'+n+')',N(x));}
 t=P(TRI);u=P(TRI);return {q:'|'+zf(t[0],t[1])+zf(u[0],u[1])+'|',v:t[2]*u[2],s:String(t[2]*u[2])};}
function det3(m){return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);}
function rm(n,lo,hi){var m=[],i,j;for(i=0;i<n;i++){m.push([]);for(j=0;j<n;j++)m[i].push(R(lo,hi));}return m;}
function t14(s){var k=R(0,7),h=Math.round(3+s*3),X,Y,dt,i,j,e;
 if(k===0){X=rm(2,-h,h);return A('det '+mat(X),N(X[0][0]*X[1][1]-X[0][1]*X[1][0]));}
 if(k===1){X=rm(3,-3,3+Math.round(s*2));return A('det '+mat(X),N(det3(X)));}
 if(k===2){X=rm(2,-h,h);Y=rm(2,-h,h);var tr=0;for(i=0;i<2;i++)for(j=0;j<2;j++)tr+=X[i][j]*Y[j][i];return A('tr(AB),  A = '+mat(X)+',  B = '+mat(Y),N(tr));}
 if(k===3){X=rm(2,-h,h);i=R(0,1);j=R(0,1);e=0;for(var l=0;l<2;l++)e+=X[i][l]*X[l][j];return A('(A²)'+sub(i+1)+sub(j+1)+',  A = '+mat(X),N(e));}
 if(k===4){do{X=rm(2,-h,h);dt=X[0][0]*X[1][1]-X[0][1]*X[1][0];}while(!dt);i=R(0,1);j=R(0,1);
  var num=[[X[1][1],-X[0][1]],[-X[1][0],X[0][0]]][i][j];return A('(A⁻¹)'+sub(i+1)+sub(j+1)+',  A = '+mat(X),F(num,dt));}
 if(k===5){var da=R(-3,3)||2,db=R(-3,3)||-2,kk=R(2,3);return A('det A = '+da+',  det B = '+db+',  A,B ∈ ℝ³ˣ³  →  det('+kk+'A²B)',N(Math.pow(kk,3)*da*da*db));}
 if(k===6){var a=R(1,4),b=R(1,3),n=R(2,5);return A('tr( [ '+a+' 0; 0 '+b+' ]'+sup(n)+' )',N(Math.pow(a,n)+Math.pow(b,n)));}
 X=rm(2,-h,h);Y=rm(2,-h,h);return A('det(AB),  A = '+mat(X)+',  B = '+mat(Y),N((X[0][0]*X[1][1]-X[0][1]*X[1][0])*(Y[0][0]*Y[1][1]-Y[0][1]*Y[1][0])));}
var TIERS=[null,t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14];
function gen(L,forceTier){
 var tier=forceTier||Math.min(14,Math.ceil(L/7.15)),s=((L-1)/7.15)%1;
 if(!forceTier&&tier>1&&Math.random()<.2){tier=R(1,tier-1);s=Math.random();}
 var g,tries=0;
 do{g=TIERS[tier](s);tries++;}while((!isFinite(g.v)||Math.abs(g.v)>1e7)&&tries<20);
 g.tier=tier;return g;}
function check(t,v){t=String(t).replace(/,/g,'.').replace(/[−–]/g,'-').replace(/\s+/g,'');
 var m=t.match(/^(-?[\d.]+)\/(-?[\d.]+)$/),x;
 if(m)x=parseFloat(m[1])/parseFloat(m[2]);else x=/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)?parseFloat(t):NaN;
 if(!isFinite(x))return false;
 return Math.abs(x-v)<1e-6||(t.indexOf('.')>=0&&Math.abs(x-v)<0.006);}
IM.math={gen:gen,check:check,TIERS:TIERS};
})();
