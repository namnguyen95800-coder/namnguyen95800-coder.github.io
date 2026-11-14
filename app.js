/* Báo thức và thông báo đồng hồ chạy (chỉ hoạt động trong bản APK Capacitor) */
window.NA=(function(){
  function LN(){try{var C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.LocalNotifications||null}catch(e){return null}}
  function TN(){try{var C=window.Capacitor;return C&&C.Plugins&&C.Plugins.TimerNotif||null}catch(e){return null}}
  var base={eng:100,cook:200},prev={},prevLive={},q=Promise.resolve(),ready=null,chan='timer2',holds={},awake=false;
  function init(l){
    if(ready)return ready;
    ready=l.checkPermissions().then(function(p){return p.display==='granted'?p:l.requestPermissions()})
      .then(function(){
        var t=TN(),old=function(){return l.createChannel({id:'timer2',name:'Hết giờ',description:'Báo chuông khi hết giờ',importance:5,visibility:1,vibration:true,lights:true,sound:'alarm.wav'})};
        if(t&&t.alarmChannel)return t.alarmChannel().then(function(){chan='alarm3'}).catch(old);
        return old();
      })
      .catch(function(){});
    return ready;
  }
  function chanFor(){
    if(chan!=='alarm3')return chan;
    var sl=document.getElementById('snd'),i=sl?parseInt(sl.value,10):NaN;
    return ['alarm_beep','alarm_bell','alarm_horn','alarm_soft'][isNaN(i)?3:i]||'alarm3';
  }
  function same(a,b){
    if(a.length!==b.length)return false;
    for(var i=0;i<a.length;i++){if(a[i].title!==b[i].title||a[i].body!==b[i].body||a[i].ch!==b[i].ch||Math.abs(a[i].at-b[i].at)>2000)return false}
    return true;
  }
  function sync(g,items){
    var l=LN();if(!l||base[g]==null)return;
    items=(items||[]).slice(0,40);
    var cf=chanFor();items.forEach(function(x){x.ch=cf});
    var old=prev[g]||[];
    if(same(old,items))return;
    prev[g]=items;
    q=q.then(function(){return init(l)}).then(function(){
      var ids=[];for(var i=0;i<40;i++)ids.push({id:base[g]+i});
      return l.cancel({notifications:ids});
    }).then(function(){
      if(!items.length)return;
      return l.schedule({notifications:items.map(function(x,i){
        return {id:base[g]+i,title:x.title,body:x.body||' ',channelId:cf,sound:(cf==='alarm3'||cf==='timer2')?'alarm.wav':cf+'.wav',
          smallIcon:'ic_stat_timer',iconColor:'#2DBE9D',largeIcon:'notif_large',
          schedule:{at:new Date(x.at),allowWhileIdle:true}};
      })});
    }).catch(function(){});
  }
  /* Thông báo đang chạy: tự đếm giờ ngay trên thanh thông báo */
  function live(g,list){
    var l=LN(),t=TN();if(!l||!t)return;
    list=list||[];
    var old=prevLive[g]||{},cur={},changed=false;
    list.forEach(function(x){cur[x.id]=x});
    Object.keys(cur).forEach(function(id){var a=old[id],b=cur[id];if(!a||a.title!==b.title||a.text!==b.text||a.paused!==b.paused||a.st!==b.st||a.next!==b.next||Math.abs(a.when-b.when)>2000)changed=true});
    Object.keys(old).forEach(function(id){if(!cur[id])changed=true});
    if(!changed)return;
    prevLive[g]=cur;
    q=q.then(function(){return init(l)}).then(function(){
      Object.keys(old).forEach(function(id){if(!cur[id])t.cancel({id:+id}).catch(function(){})});
      Object.keys(cur).forEach(function(id){
        var b=cur[id];
        t.show({id:+id,key:b.key||'',title:b.title,text:b.text,when:Math.round(b.when||0),countdown:!!b.countdown,timeout:Math.round(b.timeout||0),paused:!!b.paused,st:b.st||'',pauseOn:b.pauseOn!==false,next:b.next||''}).catch(function(){});
      });
    }).catch(function(){});
  }
  function hold(k,on){
    var t=TN();if(!t||!t.keepAwake)return;
    holds[k]=!!on;var any=false;for(var x in holds)if(holds[x])any=true;
    if(any!==awake){awake=any;try{t.keepAwake({on:any}).catch(function(){})}catch(e){}}
  }
  var NAH={};
  function setup(){
    var t=TN();if(!t||!t.addListener||setup.d)return;setup.d=true;
    try{t.addListener('action',function(e){try{
      var k=(e&&e.key)||'',a=e&&e.act;
      if(k.indexOf('cook:')===0){if(NAH.cook)NAH.cook(+k.slice(5),a)}else if(k==='trk'){if(NAH.trk)NAH.trk(a)}else if(NAH.eng)NAH.eng(k,a);
    }catch(x){}})}catch(x){}
  }
  function reset(){
    var l=LN(),t=TN();if(!l)return;
    var ids=[];for(var i=0;i<40;i++){ids.push({id:100+i});ids.push({id:200+i})}
    try{l.cancel({notifications:ids}).catch(function(){})}catch(e){}
    try{if(t&&t.cancelAll)t.cancelAll().catch(function(){})}catch(e){}
    prev={};prevLive={};
  }
  function boot(){
    setup();var t=TN();
    if(t&&t.takePending)t.takePending().then(function(p){if(p&&p.act)reset()}).catch(function(){});
  }
  function ask(){var l=LN();return l?init(l):Promise.resolve()}
  function perm(){var l=LN();return l?l.checkPermissions().then(function(p){return p.display}).catch(function(){return 'unknown'}):Promise.resolve('none')}
  return {sync:sync,live:live,hold:hold,boot:boot,reset:reset,ask:ask,perm:perm,h:NAH,get on(){return !!LN()}};
})();
;
/* Điền email hoặc link biểu mẫu để nhận góp ý của người dùng. Để trống thì góp ý được gửi lên GitHub Issues. */window.BG_FEEDBACK={email:'',form:''};
;
window.PX={lunar:1,age:1,hms:1,desk:1,wage:1,pace:1,plan:1,words:1,week:1,water:1,zone:1,spaced:1,leave:1,tally:1,today:1,todo:1,rules:1,close:1,habit:1,sun:1,metro:1,music:1,track:1,meet:1};window.PXR={};
window.FS=(function(){
  var fake=null;
  function app(){return document.documentElement.classList.contains('in-app')}
  function tn(){try{var C=window.Capacitor;return C&&C.Plugins&&C.Plugins.TimerNotif||null}catch(e){return null}}
  function imm(on,ls){try{var t=tn();if(t&&t.immersive)t.immersive({on:on,landscape:!!ls}).catch(function(){})}catch(e){}}
  function fire(){try{document.dispatchEvent(new Event('fullscreenchange'))}catch(e){}}
  function active(){return !!fake||!!document.fullscreenElement}
  function ok(){return app()||(!!document.documentElement.requestFullscreen&&document.fullscreenEnabled!==false)}
  function enter(el,o){
    if(app()){if(!fake){fake=el;if(el!==document.documentElement)el.classList.add('fsx');imm(true,o&&o.landscape);fire()}return Promise.resolve()}
    var f=el.requestFullscreen||el.webkitRequestFullscreen;if(!f)return Promise.reject(new Error('no'));var r=f.call(el);return r&&r.then?r:Promise.resolve()}
  function exit(){
    if(fake){fake.classList.remove('fsx');fake=null;imm(false);fire();return Promise.resolve()}
    if(document.fullscreenElement)return document.exitFullscreen();return Promise.resolve()}
  return {enter:enter,exit:exit,active:active,ok:ok,el:function(){return fake}}
})();
window.SAVE=function(name,data,mime){
  try{
    var C=window.Capacitor,P=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins;
    if(!(P&&P.Filesystem&&P.Share))return false;
    new Promise(function(res,rej){
      if(typeof data==='string'){res(btoa(unescape(encodeURIComponent(data))));return}
      var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1])};r.onerror=rej;r.readAsDataURL(data)
    }).then(function(b){return P.Filesystem.writeFile({path:name,data:b,directory:'CACHE'})})
      .then(function(r){return P.Share.share({title:name,files:[r.uri]})})
      .catch(function(){});
    return true;
  }catch(e){return false}
};
/* Báo có bản APK mới (chỉ trong app) */
window.addEventListener('load',function(){
  setTimeout(function(){try{
    var C=window.Capacitor,P=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins;
    if(!(P&&P.App&&P.App.getInfo)||!window.fetch)return;
    var last=+localStorage.getItem('bg2x-upchk')||0;if(Date.now()-last<6*3600*1000)return;
    localStorage.setItem('bg2x-upchk',String(Date.now()));
    P.App.getInfo().then(function(info){
      return fetch('https://api.github.com/repos/namnguyen95800-coder/namnguyen95800-coder.github.io/releases/tags/latest').then(function(r){return r.json()}).then(function(j){
        var m=/build:(\d+)/.exec(j&&j.body||'');if(!m)return;
        if(+m[1]>(+info.build||0)){
          var b=document.createElement('div');b.setAttribute('role','status');
          b.style.cssText='position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);z-index:99998;padding:12px 14px;border-radius:14px;background:#12302b;color:#e8fff7;border:1px solid #2dbe9d;font-size:15px;display:flex;gap:10px;align-items:center';
          b.innerHTML='<span style="flex:1">'+(document.documentElement.lang==='en'?'A new app version is available.':'Có bản app mới, cập nhật để dùng tính năng mới.')+'</span><a href="https://github.com/namnguyen95800-coder/namnguyen95800-coder.github.io/releases/download/latest/Dousob.apk" style="color:#2dbe9d;font-weight:700;text-decoration:none">'+(document.documentElement.lang==='en'?'Update':'Cập nhật')+'</a><button type="button" style="background:none;border:0;color:inherit;font-size:18px" aria-label="x">✕</button>';
          b.querySelector('button').onclick=function(){b.remove()};document.body.appendChild(b);
        }
      });
    }).catch(function(){});
  }catch(e){}},4000);
});
(function(){
var $=function(i){return document.getElementById(i)},EN=function(){return document.documentElement.lang==='en'},T=function(v,e){return EN()?e:v},pad=function(n){return(n<10?'0':'')+n};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function ls(k,v){try{if(v===undefined){var r=localStorage.getItem('bg2x-'+k);return r===null?null:JSON.parse(r)}localStorage.setItem('bg2x-'+k,JSON.stringify(v))}catch(e){return null}}
function mount(h,on,click){var p=$('panel');p.innerHTML='<div class="tcalc">'+h+'</div>';p.onclick=click||null;p.oninput=p.onchange=on||null}
function fld(l,id,v,ex){return '<label>'+l+'<input id="'+id+'" value="'+esc(v)+'" '+(ex||'')+'></label>'}
function today(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function pdate(s){var m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(s||'');return m?{y:+m[1],m:+m[2],d:+m[3],u:Date.UTC(+m[1],+m[2]-1,+m[3])}:null}
var tick=null;function stop(){if(tick){clearInterval(tick);tick=null}if(window.__mt)window.__mt()}
/* ---- Lịch tháng dùng chung (thống kê, thói quen) ---- */
window.CAL={
  cells:function(y,m){var f=new Date(y,m,1),n=new Date(y,m+1,0).getDate(),o=(f.getDay()+6)%7,c=[],i;for(i=0;i<o;i++)c.push(null);for(i=1;i<=n;i++)c.push(new Date(y,m,i));return c},
  wk:function(){return EN()?['Mo','Tu','We','Th','Fr','Sa','Su']:['T2','T3','T4','T5','T6','T7','CN']},
  key:function(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())},
  title:function(y,m){return EN()?['January','February','March','April','May','June','July','August','September','October','November','December'][m]+' '+y:'Tháng '+(m+1)+'/'+y}
};
/* ---- Âm lịch (thuật toán Hồ Ngọc Đức, múi giờ +7) ---- */
function jd(d,m,y){var a=Math.floor((14-m)/12),y2=y+4800-a,m2=m+12*a-3,j=d+Math.floor((153*m2+2)/5)+365*y2+Math.floor(y2/4)-Math.floor(y2/100)+Math.floor(y2/400)-32045;return j<2299161?d+Math.floor((153*m2+2)/5)+365*y2+Math.floor(y2/4)-32083:j}
function j2d(j){var a,b,c;if(j>2299160){a=j+32044;b=Math.floor((4*a+3)/146097);c=a-Math.floor(b*146097/4)}else{b=0;c=j+32082}var d=Math.floor((4*c+3)/1461),e=c-Math.floor(1461*d/4),m=Math.floor((5*e+2)/153);return[e-Math.floor((153*m+2)/5)+1,m+3-12*Math.floor(m/10),b*100+d-4800+Math.floor(m/10)]}
function nm(k){var t=k/1236.85,t2=t*t,t3=t2*t,r=Math.PI/180,j=2415020.75933+29.53058868*k+0.0001178*t2-0.000000155*t3+0.00033*Math.sin((166.56+132.87*t-0.009173*t2)*r),M=359.2242+29.10535608*k-0.0000333*t2-0.00000347*t3,P=306.0253+385.81691806*k+0.0107306*t2+0.00001236*t3,F=21.2964+390.67050646*k-0.0016528*t2-0.00000239*t3,c=(0.1734-0.000393*t)*Math.sin(M*r)+0.0021*Math.sin(2*r*M)-0.4068*Math.sin(P*r)+0.0161*Math.sin(r*2*P)-0.0004*Math.sin(r*3*P)+0.0104*Math.sin(r*2*F)-0.0051*Math.sin(r*(M+P))-0.0074*Math.sin(r*(M-P))+0.0004*Math.sin(r*(2*F+M))-0.0004*Math.sin(r*(2*F-M))-0.0006*Math.sin(r*(2*F+P))+0.001*Math.sin(r*(2*F-P))+0.0005*Math.sin(r*(2*P+M)),dt=t<-11?0.001+0.000839*t+0.0002261*t2-0.00000845*t3-0.000000081*t*t3:-0.000278+0.000265*t+0.000262*t2;return j+c-dt}
function sl(n){var t=(n-2451545.5-7/24)/36525,t2=t*t,r=Math.PI/180,M=357.5291+35999.0503*t-0.0001559*t2-0.00000048*t*t2,L0=280.46645+36000.76983*t+0.0003032*t2,D=(1.9146-0.004817*t-0.000014*t2)*Math.sin(r*M)+(0.019993-0.000101*t)*Math.sin(r*2*M)+0.00029*Math.sin(r*3*M),L=(L0+D)*r;L-=Math.PI*2*Math.floor(L/(Math.PI*2));return Math.floor(L/Math.PI*6)}
function nmd(k){return Math.floor(nm(k)+0.5+7/24)}
function m11(y){var k=Math.floor((jd(31,12,y)-2415021)/29.530588853),n=nmd(k);if(sl(n)>=9)n=nmd(k-1);return n}
function leapOff(a){var k=Math.floor((a-2415021.076998695)/29.530588853+0.5),i=1,last,arc=sl(nmd(k+i));do{last=arc;i++;arc=sl(nmd(k+i))}while(arc!==last&&i<14);return i-1}
function s2l(dd,mm,yy){var dn=jd(dd,mm,yy),k=Math.floor((dn-2415021.076998695)/29.530588853),ms=nmd(k+1);if(ms>dn)ms=nmd(k);var a=m11(yy),b=a,ly;if(a>=ms){ly=yy;a=m11(yy-1)}else{ly=yy+1;b=m11(yy+1)}var ld=dn-ms+1,df=Math.floor((ms-a)/29),lm=df+11,lp=0;if(b-a>365){var lo=leapOff(a);if(df>=lo){lm=df+10;if(df===lo)lp=1}}if(lm>12)lm-=12;if(lm>=11&&df<4)ly-=1;return[ld,lm,ly,lp]}
function l2s(ld,lm,ly,lp){var a,b;if(lm<11){a=m11(ly-1);b=m11(ly)}else{a=m11(ly);b=m11(ly+1)}var k=Math.floor(0.5+(a-2415021.076998695)/29.530588853),off=lm-11;if(off<0)off+=12;if(b-a>365){var lo=leapOff(a),lmo=lo-2;if(lmo<0)lmo+=12;if(lp&&lm!==lmo)return null;if(lp||off>=lo)off+=1}return j2d(nmd(k+off)+ld-1)}
var CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'],CHI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
function cc(y){return CAN[(y+6)%10]+' '+CHI[(y+8)%12]}
function lstr(l){return pad(l[0])+'/'+pad(l[1])+(l[3]?' ('+T('nhuận','leap')+')':'')+' '+T('năm','year')+' '+cc(l[2])}
PXR.lunar=function(){
  var n=new Date(),L=s2l(n.getDate(),n.getMonth()+1,n.getFullYear()),ty=n.getFullYear(),tet=l2s(1,1,ty),tn=new Date(tet[2],tet[1]-1,tet[0]);if(tn<new Date(ty,n.getMonth(),n.getDate()))tet=l2s(1,1,ty+1);
  mount('<h3>'+T('Hôm nay (âm lịch)','Today (lunar)')+'</h3><div class="card"><div class="big">'+esc(lstr(L))+'</div><div class="nm">'+T('Tết Nguyên Đán tới: ','Next Lunar New Year: ')+pad(tet[0])+'/'+pad(tet[1])+'/'+tet[2]+'</div></div>'+
  '<h3>'+T('Đổi dương lịch sang âm lịch','Solar to lunar')+'</h3><div class="row">'+fld(T('Ngày dương','Solar date'),'lu-a',today(),'type="date"')+'</div><div class="card" id="lu-r1"></div>'+
  '<h3>'+T('Đổi âm lịch sang dương lịch','Lunar to solar')+'</h3><div class="row">'+fld(T('Ngày','Day'),'lu-d',1,'inputmode="numeric"')+fld(T('Tháng','Month'),'lu-m',1,'inputmode="numeric"')+fld(T('Năm','Year'),'lu-y',ty,'inputmode="numeric"')+
  '<label>'+T('Tháng nhuận','Leap month')+'<select id="lu-l"><option value="0">'+T('Không','No')+'</option><option value="1">'+T('Có','Yes')+'</option></select></label></div><div class="card" id="lu-r2"></div>',function(){
    var a=pdate($('lu-a').value);$('lu-r1').innerHTML=a?'<div class="big">'+esc(lstr(s2l(a.d,a.m,a.y)))+'</div>':'';
    var d=+$('lu-d').value,m=+$('lu-m').value,y=+$('lu-y').value,r=(d>0&&d<31&&m>0&&m<13&&y>1900&&y<2200)?l2s(d,m,y,+$('lu-l').value):null;
    $('lu-r2').innerHTML=r&&r[0]?'<div class="big">'+pad(r[0])+'/'+pad(r[1])+'/'+r[2]+'</div>':T('Ngày âm không hợp lệ.','Invalid lunar date.');
  });$('panel').oninput();
};
/* ---- Tính tuổi ---- */
PXR.age=function(){
  mount('<div class="row">'+fld(T('Ngày sinh','Date of birth'),'ag-a',ls('birth')||'2000-01-01','type="date"')+'</div><div class="card" id="ag-r"></div>',function(){
    var b=pdate($('ag-a').value),n=new Date(),t={y:n.getFullYear(),m:n.getMonth()+1,d:n.getDate()},r=$('ag-r');
    if(!b||b.u>Date.UTC(t.y,t.m-1,t.d)){r.textContent=T('Chọn ngày sinh hợp lệ.','Choose a valid birth date.');return}
    ls('birth',$('ag-a').value);
    var y=t.y-b.y,m=t.m-b.m,d=t.d-b.d;if(d<0){m--;d+=new Date(Date.UTC(t.y,t.m-1,0)).getUTCDate()}if(m<0){y--;m+=12}
    var days=Math.round((Date.UTC(t.y,t.m-1,t.d)-b.u)/864e5),nb=Date.UTC(t.y,b.m-1,b.d);if(nb<Date.UTC(t.y,t.m-1,t.d))nb=Date.UTC(t.y+1,b.m-1,b.d);
    var wd=new Date(b.u).getUTCDay(),W=EN()?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
    r.innerHTML='<div class="big">'+y+' '+T('tuổi','years')+' '+m+' '+T('tháng','mo')+' '+d+' '+T('ngày','d')+'</div><div class="nm">'+days.toLocaleString()+' '+T('ngày','days')+' · '+(days*24).toLocaleString()+' '+T('giờ','hours')+'</div><div class="nm">'+T('Sinh vào ','Born on ')+W[wd]+' · '+T('Còn ','In ')+Math.round((nb-Date.UTC(t.y,t.m-1,t.d))/864e5)+T(' ngày nữa đến sinh nhật',' days until your birthday')+'</div><div class="nm">'+T('Năm sinh âm lịch: ','Lunar year: ')+cc(s2l(b.d,b.m,b.y)[2])+'</div>';
  });$('panel').oninput();
};
/* ---- Cộng trừ giờ ---- */
function hm(s){var m=/^\s*(\d{1,3}):([0-5]?\d)\s*$/.exec(s);return m?(+m[1])*60+(+m[2]):null}
function fm(x){var s=x<0?'-':'';x=Math.abs(x);return s+Math.floor(x/60)+':'+pad(x%60)}
PXR.hms=function(){
  mount('<h3>'+T('Khoảng giờ giữa hai mốc','Time between two times')+'</h3><div class="row">'+fld(T('Từ','From'),'hm-a','08:15','type="time"')+fld(T('Đến','To'),'hm-b','17:40','type="time"')+'</div><div class="card" id="hm-r1"></div>'+
  '<h3>'+T('Cộng hoặc trừ giờ','Add or subtract')+'</h3><div class="row">'+fld(T('Số thứ nhất (giờ:phút)','First (h:mm)'),'hm-c','2:45','inputmode="text"')+'<label>'+T('Phép tính','Operation')+'<select id="hm-o"><option>+</option><option>-</option></select></label>'+fld(T('Số thứ hai (giờ:phút)','Second (h:mm)'),'hm-d','1:30','inputmode="text"')+'</div><div class="card" id="hm-r2"></div>',function(){
    var a=hm($('hm-a').value),b=hm($('hm-b').value);
    if(a===null||b===null)$('hm-r1').textContent=T('Chọn đủ hai mốc giờ.','Choose both times.');else{var d=(b-a+1440)%1440;$('hm-r1').innerHTML='<div class="big">'+Math.floor(d/60)+' '+T('giờ','h')+' '+d%60+' '+T('phút','min')+'</div><div class="nm">'+T('Nếu qua nửa đêm vẫn tính đúng. ','Crossing midnight is handled. ')+(d/60).toFixed(2)+' '+T('giờ','hours')+'</div>'}
    var c=hm($('hm-c').value),e=hm($('hm-d').value);
    $('hm-r2').innerHTML=(c===null||e===null)?T('Nhập dạng giờ:phút, ví dụ 2:45.','Use h:mm, e.g. 2:45.'):'<div class="big">'+fm($('hm-o').value==='+'?c+e:c-e)+'</div><div class="nm">'+((($('hm-o').value==='+'?c+e:c-e)/60).toFixed(2))+' '+T('giờ','hours')+'</div>';
  });$('panel').oninput();
};
/* ---- Đồng hồ để bàn: 5 kiểu (số lớn, lật, neon, tối giản, kim) ---- */
var DKT=[['big','Số lớn','Big'],['flip','Đồng hồ lật','Flip'],['neon','Neon','Neon'],['thin','Tối giản','Minimal'],['analog','Kim','Analog']];
function dkCss(){if($('dk-css'))return;var s=document.createElement('style');s.id='dk-css';s.textContent=
'#dk-c{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;min-height:min(62vh,500px);padding:16px 8px;overflow:hidden;text-align:center;transition:background .3s}'+
'#dk-c:fullscreen{width:100vw;height:100vh;min-height:0;border-radius:0;margin:0}#dk-c:-webkit-full-screen{width:100vw;height:100vh;min-height:0;border-radius:0;margin:0}'+
'#dk-c .dt{font-weight:800;line-height:1;font-variant-numeric:tabular-nums;font-size:min(17vw,30vh)}#dk-c .dd{font-size:clamp(14px,3.4vw,24px);opacity:.75}'+
'#dk-c.dk-neon{background:#05060a;color:#35f0ff}#dk-c.dk-neon .dt{font-weight:600;letter-spacing:.04em;text-shadow:0 0 8px #35f0ff,0 0 24px #1aa7c9,0 0 48px #1aa7c9}'+
'#dk-c.dk-thin{background:transparent}#dk-c.dk-thin .dt{font-weight:200;letter-spacing:.02em;font-size:min(21vw,34vh)}'+
'#dk-c.dk-flip{background:#0c0c0f;color:#f3f3f3}#dk-c.dk-analog{background:#0b1220;color:#dbe7f3}'+
'.fr{display:flex;gap:min(2.4vw,14px);align-items:center;perspective:900px}.fr i{font-style:normal;font-size:calc(var(--H)*.4);opacity:.5}'+
'.fp{position:relative;width:calc(var(--H)*.82);height:var(--H);font-weight:800;font-size:calc(var(--H)*.68);font-variant-numeric:tabular-nums}'+
'.fp .h{position:absolute;left:0;right:0;height:calc(50% - 1px);overflow:hidden;background:#1d1d23;backface-visibility:hidden}'+
'.fp .h span{position:absolute;left:0;right:0;height:calc(var(--H) - 2px);line-height:calc(var(--H) - 2px);text-align:center}'+
'.fp .t{top:0;border-radius:10px 10px 0 0}.fp .t span{top:0}.fp .b{bottom:0;border-radius:0 0 10px 10px;background:#17171c}.fp .b span{bottom:0}'+
'.fp .ft{top:0;border-radius:10px 10px 0 0;transform-origin:50% 100%;animation:fpt .28s ease-in forwards;z-index:3}.fp .ft span{top:0}'+
'.fp .fb{bottom:0;border-radius:0 0 10px 10px;background:#17171c;transform-origin:50% 0;transform:rotateX(90deg);animation:fpb .28s .28s ease-out forwards;z-index:3}.fp .fb span{bottom:0}'+
'@keyframes fpt{to{transform:rotateX(-90deg)}}@keyframes fpb{to{transform:rotateX(0)}}#dk-c svg{width:min(80vw,56vh);height:auto}'+
'#dk-c.fsx{position:fixed;inset:0;z-index:99999;width:100vw;height:100dvh;min-height:0;border-radius:0;margin:0}.fsx-x{display:none}.fsx .fsx-x{display:block;position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);right:12px;z-index:100000;min-width:44px;min-height:44px;border-radius:22px;font-size:20px;opacity:.7}'+
'.dkc{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.dkc button[aria-pressed="true"]{outline:2px solid #2dbe9d;outline-offset:1px}';
document.head.appendChild(s)}
function mkFp(v){return '<div class="fp" data-v="'+v+'"><div class="h t"><span>'+v+'</span></div><div class="h b"><span>'+v+'</span></div></div>'}
function flipTo(el,v){var o=el.getAttribute('data-v');if(o===v)return;el.setAttribute('data-v',v);el.querySelector('.t span').textContent=v;
  var x=el.querySelectorAll('.ft,.fb');for(var i=0;i<x.length;i++)x[i].remove();
  var f=document.createElement('div');f.className='h ft';f.innerHTML='<span>'+o+'</span>';var g=document.createElement('div');g.className='h fb';g.innerHTML='<span>'+v+'</span>';el.appendChild(f);el.appendChild(g);
  setTimeout(function(){var b=el.querySelector('.b span');if(b)b.textContent=v;if(f.parentNode){f.remove();g.remove()}},580)}
function dkSvg(){var t='<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" fill="#101a26" stroke="#2dbe9d" stroke-width="3"/>';
  for(var i=0;i<60;i++){var m=i%5===0;t+='<line x1="100" y1="7" x2="100" y2="'+(m?19:12)+'" stroke="#9fb4c8" stroke-width="'+(m?3:1)+'" transform="rotate('+(i*6)+' 100 100)"/>'}
  [['12',100,44],['3',156,106],['6',100,170],['9',44,106]].forEach(function(p){t+='<text x="'+p[1]+'" y="'+p[2]+'" fill="#dbe7f3" font-size="16" font-weight="700" text-anchor="middle">'+p[0]+'</text>'});
  return t+'<line id="dk-hh" x1="100" y1="100" x2="100" y2="58" stroke="#fff" stroke-width="6" stroke-linecap="round"/><line id="dk-hm" x1="100" y1="100" x2="100" y2="36" stroke="#fff" stroke-width="4" stroke-linecap="round"/><line id="dk-hs" x1="100" y1="112" x2="100" y2="24" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="100" r="5" fill="#ff6b6b"/></svg>'}
PXR.desk=function(){
  stop();dkCss();var th=ls('dkt')||'big',h12=!!ls('h12'),sec=ls('dks')!==false,wl=null,dim=false;
  function now(){var n=new Date(),h=n.getHours();return{n:n,h:h,hh:h12?((h%12)||12):h,m:n.getMinutes(),s:n.getSeconds()}}
  function build(){var c=$('dk-c'),q=now(),h='';c.className='card dk-'+th;
    if(th==='flip')h='<div class="fr" style="--H:min('+(sec?30:40)+'vw,50vh)">'+mkFp(pad(q.hh))+'<i>:</i>'+mkFp(pad(q.m))+(sec?'<i>:</i>'+mkFp(pad(q.s)):'')+'</div>';
    else if(th==='analog')h=dkSvg();else h='<div class="dt" id="dk-t"></div>';
    c.innerHTML=h+'<div class="dd" id="dk-d"></div><button class="fsx-x" id="dk-x" type="button" aria-label="'+T('Thoát toàn màn hình','Exit fullscreen')+'">✕</button>';
    var b=document.querySelectorAll('[data-th]');for(var i=0;i<b.length;i++)b[i].setAttribute('aria-pressed',b[i].getAttribute('data-th')===th?'true':'false')}
  function rot(id,a){var e=$(id);if(e)e.setAttribute('transform','rotate('+a+' 100 100)')}
  function upd(){var c=$('dk-c');if(!c){stop();return}var q=now();
    if(th==='flip'){var f=c.querySelectorAll('.fp');flipTo(f[0],pad(q.hh));flipTo(f[1],pad(q.m));if(f[2])flipTo(f[2],pad(q.s))}
    else if(th==='analog'){rot('dk-hh',(q.h%12)*30+q.m*.5);rot('dk-hm',q.m*6+q.s*.1);rot('dk-hs',q.s*6)}
    else $('dk-t').textContent=pad(q.hh)+':'+pad(q.m)+(sec?':'+pad(q.s):'');
    $('dk-d').textContent=q.n.toLocaleDateString(EN()?'en-GB':'vi-VN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+(h12?' · '+(q.h<12?'AM':'PM'):'')}
  mount('<div class="dkc">'+DKT.map(function(x){return '<button type="button" data-th="'+x[0]+'">'+(EN()?x[2]:x[1])+'</button>'}).join('')+'</div><div class="card" id="dk-c"></div><div class="dkc"><button id="dk-f" type="button">'+T('Toàn màn hình','Fullscreen')+'</button><button id="dk-h" type="button">'+T('Đổi 12/24 giờ','12/24 hour')+'</button><button id="dk-s" type="button">'+T('Hiện/ẩn giây','Show/hide seconds')+'</button>'+(tnPlug()&&tnPlug().brightness?'<button id="dk-b" type="button" aria-pressed="'+dim+'">🌙 '+T('Giảm sáng','Dim screen')+'</button>':'')+'</div><div class="nm">'+T('Màn hình luôn sáng khi mở công cụ này.','Screen stays on while this tool is open.')+'</div>',null,function(e){
    var b=e.target.closest('button');if(!b)return;var id=b.id,t=b.getAttribute('data-th');
    if(t){th=t;ls('dkt',th);build();upd()}
    else if(id==='dk-h'){h12=!h12;ls('h12',h12);build();upd()}
    else if(id==='dk-s'){sec=!sec;ls('dks',sec);build();upd()}
    else if(id==='dk-f'){try{FS.enter($('dk-c')).catch(function(){})}catch(x){}}
    else if(id==='dk-x'){FS.exit()}
    else if(id==='dk-b'){dim=!dim;b.setAttribute('aria-pressed',dim);try{tnPlug().brightness({v:dim?0.08:-1}).catch(function(){})}catch(x){}}
  });
  build();upd();tick=setInterval(upd,1000);
  try{if(window.NA)window.NA.hold('desk',true)}catch(e){}
  window.__mt=function(){try{if(dim){dim=false;tnPlug().brightness({v:-1})}}catch(e){}try{if(window.NA)window.NA.hold('desk',false)}catch(e){}try{if(wl)wl.release()}catch(e){}window.__mt=null};
  try{if(navigator.wakeLock)navigator.wakeLock.request('screen').then(function(w){wl=w}).catch(function(){})}catch(e){}
};
/* ---- Tính lương theo giờ ---- */
PXR.wage=function(){
  var s=ls('wage')||{r:30000,h:176,a:20,b:0,c:0};
  mount('<div class="row">'+fld(T('Lương một giờ (đồng)','Hourly rate'),'wg-r',s.r,'inputmode="numeric"')+fld(T('Số giờ làm thường','Regular hours'),'wg-h',s.h,'inputmode="decimal"')+'</div><div class="row">'+fld(T('Tăng ca ngày thường (150%)','Overtime weekday (150%)'),'wg-a',s.a,'inputmode="decimal"')+fld(T('Tăng ca cuối tuần (200%)','Weekend (200%)'),'wg-b',s.b,'inputmode="decimal"')+fld(T('Tăng ca ngày lễ (300%)','Holiday (300%)'),'wg-c',s.c,'inputmode="decimal"')+'</div><div class="card" id="wg-o"></div><div class="nm">'+T('Ước tính trước thuế và bảo hiểm, chưa tính phụ cấp ca đêm. Chỉ để tham khảo.','Estimate before tax and insurance, night shift not included. For reference only.')+'</div>',function(){
    var v=function(i){return parseFloat(String($(i).value).replace(',','.'))||0},r=v('wg-r'),h=v('wg-h'),a=v('wg-a'),b=v('wg-b'),c=v('wg-c');ls('wage',{r:r,h:h,a:a,b:b,c:c});
    var t1=r*h,t2=r*a*1.5,t3=r*b*2,t4=r*c*3,f=function(x){return Math.round(x).toLocaleString(EN()?'en-US':'vi-VN')};
    $('wg-o').innerHTML='<div class="big">'+f(t1+t2+t3+t4)+' đ</div><div class="nm">'+T('Giờ thường: ','Regular: ')+f(t1)+' · 150%: '+f(t2)+' · 200%: '+f(t3)+' · 300%: '+f(t4)+'</div>';
  });$('panel').oninput();
};
/* ---- Pace chạy bộ ---- */
PXR.pace=function(){
 var s=ls('pace')||{d:5,h:0,m:30,s:0};
 mount('<div class="row">'+fld(T('Quãng đường (km)','Distance (km)'),'pc-d',s.d,'inputmode="decimal"')+'</div><div class="row">'+fld(T('Giờ','Hours'),'pc-h',s.h,'inputmode="numeric"')+fld(T('Phút','Minutes'),'pc-m',s.m,'inputmode="numeric"')+fld(T('Giây','Seconds'),'pc-s',s.s,'inputmode="numeric"')+'</div><div class="card" id="pc-o"></div><div class="nm">'+T('Dự đoán dùng công thức Riegel, chỉ để tham khảo: sức bền thực tế, địa hình và thời tiết sẽ khác.','Predictions use the Riegel formula, for reference only: real endurance, terrain and weather will differ.')+'</div>',function(){
  var v=function(i){return parseFloat(String($(i).value).replace(',','.'))||0},d=v('pc-d'),h=v('pc-h'),m=v('pc-m'),sc=v('pc-s'),t=h*3600+m*60+sc,o=$('pc-o');
  if(d<=0||t<=0){o.textContent=T('Nhập quãng đường và thời gian lớn hơn 0.','Enter a distance and a time greater than 0.');return}
  ls('pace',{d:d,h:h,m:m,s:sc});
  var two=function(n){return(n<10?'0':'')+n},fm=function(x){x=Math.round(x);var a=Math.floor(x/3600),b=Math.floor(x%3600/60),c=x%60;return a?a+':'+two(b)+':'+two(c):b+':'+two(c)};
  var P=[[5,'5 km'],[10,'10 km'],[21.0975,T('Bán marathon','Half marathon')],[42.195,'Marathon']];
  var rows=P.map(function(p){var tt=t*Math.pow(p[0]/d,1.06);return '<div class="nm">'+p[1]+': <b>'+fm(tt)+'</b> · '+fm(tt/p[0])+' /km</div>'}).join('');
  o.innerHTML='<div class="big">'+fm(t/d)+' /km</div><div class="nm">'+(d/(t/3600)).toFixed(2)+' km/h</div><div class="nm" style="margin-top:8px">'+T('Dự đoán nếu giữ sức tương đương:','If you hold similar form:')+'</div>'+rows;
 });$('panel').oninput();
};
/* ---- Tiến độ đến hạn ---- */
PXR.plan=function(){
 var n=new Date(),fd=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
 var s=ls('plan')||{due:fd(new Date(n.getFullYear(),n.getMonth(),n.getDate()+14)),tot:100,done:0,u:T('trang','pages'),sun:1};
 mount('<div class="row">'+fld(T('Hạn hoàn thành','Deadline'),'pl-due',s.due,'type="date"')+'</div><div class="row">'+fld(T('Tổng khối lượng','Total amount'),'pl-t',s.tot,'inputmode="decimal"')+fld(T('Đã làm','Done so far'),'pl-x',s.done,'inputmode="decimal"')+fld(T('Đơn vị','Unit'),'pl-u',s.u,'maxlength="14"')+'</div><label class="chk" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" id="pl-s"'+(s.sun?' checked':'')+'> '+T('Nghỉ Chủ nhật','Skip Sundays')+'</label><div class="card" id="pl-o"></div><div class="nm">'+T('Phần dự phòng giả định bạn muốn xong khi còn 20% thời gian.','The buffer line assumes you want to finish with 20% of the time to spare.')+'</div>',function(){
  var v=function(i){return parseFloat(String($(i).value).replace(',','.'))||0},o=$('pl-o'),tot=v('pl-t'),dn=v('pl-x'),u=($('pl-u').value||'').trim()||T('phần','units'),sun=$('pl-s').checked,dv=$('pl-due').value,p=dv.split('-');
  if(p.length!==3||!+p[0]){o.textContent=T('Chọn hạn hoàn thành hợp lệ.','Choose a valid deadline.');return}
  ls('plan',{due:dv,tot:tot,done:dn,u:u,sun:sun?1:0});
  var now=new Date(),td=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()),due=Date.UTC(+p[0],+p[1]-1,+p[2]),rem=tot-dn,pct=tot>0?Math.min(100,Math.max(0,dn/tot*100)):0;
  if(tot<=0){o.textContent=T('Nhập tổng khối lượng lớn hơn 0.','Enter a total amount greater than 0.');return}
  if(rem<=0){o.innerHTML='<div class="big">🎉 '+T('Xong rồi!','All done!')+'</div><div class="nm">'+pct.toFixed(0)+'%</div>';return}
  if(due<td){o.innerHTML='<div class="big">'+T('Đã quá hạn '+Math.round((td-due)/864e5)+' ngày','Overdue by '+Math.round((td-due)/864e5)+' days')+'</div><div class="nm">'+T('Còn lại ','Left: ')+Math.round(rem*10)/10+' '+esc(u)+'</div>';return}
  var cal=Math.round((due-td)/864e5)+1,wd=0,i;for(i=0;i<cal;i++){if(!(sun&&new Date(td+i*864e5).getUTCDay()===0))wd++}
  if(!wd){o.textContent=T('Không còn ngày làm việc nào trước hạn. Bỏ chọn "Nghỉ Chủ nhật" nếu cần.','No working days before the deadline. Untick "Skip Sundays" if needed.');return}
  var f=function(x){return x>=10?String(Math.ceil(x)):String(Math.ceil(x*10)/10)},bd=Math.max(1,Math.floor(wd*0.8));
  o.innerHTML='<div class="big">'+f(rem/wd)+' '+esc(u)+T(' mỗi ngày',' per day')+'</div><div class="nm">'+T('Còn ','Left: ')+Math.round(rem*10)/10+' '+esc(u)+' · '+wd+T(' ngày làm · '+cal+' ngày lịch',' working days · '+cal+' calendar days')+'</div><div class="nm">'+T('Muốn xong sớm với 20% dự phòng: ','To finish with a 20% buffer: ')+'<b>'+f(rem/bd)+' '+esc(u)+T('/ngày','/day')+'</b></div><div class="nm">'+T('Đã xong ','Completed ')+pct.toFixed(0)+'%</div>';
 });$('panel').oninput();
};
/* ---- Đếm từ, thời gian đọc ---- */
PXR.words=function(){
 var s=ls('words')||{r:200,w:130};
 mount('<label>'+T('Dán hoặc gõ văn bản','Paste or type text')+'<textarea id="wd-t" rows="7" style="width:100%;box-sizing:border-box;padding:10px;border-radius:12px;border:1px solid var(--line,#ccc);background:var(--bg,#fff);color:var(--ink,#111);font:inherit"></textarea></label><div class="row">'+fld(T('Tốc độ đọc (từ/phút)','Reading speed (words/min)'),'wd-r',s.r,'inputmode="numeric"')+fld(T('Tốc độ nói (từ/phút)','Speaking speed (words/min)'),'wd-w',s.w,'inputmode="numeric"')+'</div><div class="card" id="wd-o"></div><div class="nm">'+T('Văn bản không được lưu. Từ được đếm theo khoảng trắng như trong Word; tốc độ mặc định là mức tham khảo.','Text is never saved. Words are counted by spaces like Word; default speeds are rough references.')+'</div>',function(){
  var t=$('wd-t').value,r=Math.max(1,parseFloat($('wd-r').value)||200),w=Math.max(1,parseFloat($('wd-w').value)||130),o=$('wd-o');
  ls('words',{r:r,w:w});
  var words=t.trim()?t.trim().split(/\s+/).length:0,ch=t.length,chn=t.replace(/\s/g,'').length,sn=(t.match(/[.!?…]+(\s|$)/g)||[]).length||(t.trim()?1:0);
  var two=function(n){return(n<10?'0':'')+n},fm=function(min){var x=Math.round(min*60),a=Math.floor(x/60),b=x%60;return T(a+' phút '+two(b)+' giây',a+' min '+two(b)+' s')};
  o.innerHTML='<div class="big">'+words.toLocaleString()+' '+T('từ','words')+'</div><div class="nm">'+ch.toLocaleString()+' '+T('ký tự','characters')+' ('+chn.toLocaleString()+' '+T('không tính khoảng trắng','without spaces')+') · '+sn+' '+T('câu','sentences')+'</div><div class="nm">📖 '+T('Đọc thầm: ','Silent reading: ')+'<b>'+fm(words/r)+'</b></div><div class="nm">🎤 '+T('Nói, thuyết trình: ','Speaking: ')+'<b>'+fm(words/w)+'</b></div>';
 });$('panel').oninput();
};
/* ---- Tuần và ngày trong năm ---- */
PXR.week=function(){
 var fd=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
 function iso(y,m,d){var x=new Date(Date.UTC(y,m-1,d)),dy=(x.getUTCDay()+6)%7;x.setUTCDate(x.getUTCDate()-dy+3);var fy=x.getUTCFullYear(),f=new Date(Date.UTC(fy,0,4));return[1+Math.round(((x-f)/864e5-3+((f.getUTCDay()+6)%7))/7),fy]}
 mount('<div class="row">'+fld(T('Chọn ngày','Pick a date'),'wk-d',fd(new Date()),'type="date"')+'</div><div class="chips2"><button type="button" id="wk-t">'+T('Hôm nay','Today')+'</button></div><div class="card" id="wk-o"></div><div class="nm">'+T('Tuần tính theo chuẩn ISO, bắt đầu từ thứ Hai.','Weeks follow ISO 8601, starting on Monday.')+'</div>',function(){
  var p=$('wk-d').value.split('-'),o=$('wk-o');if(p.length!==3||!+p[0]){o.textContent=T('Chọn một ngày hợp lệ.','Choose a valid date.');return}
  var y=+p[0],m=+p[1],d=+p[2],u=Date.UTC(y,m-1,d),leap=(y%4===0&&y%100!==0)||y%400===0,tot=leap?366:365,doy=Math.round((u-Date.UTC(y,0,0))/864e5),w=iso(y,m,d),ww=iso(w[1],12,28)[0];
  var W=EN()?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
  o.innerHTML='<div class="big">'+T('Tuần ','Week ')+w[0]+'<span style="font-size:.5em;font-weight:600"> / '+ww+'</span></div><div class="nm">'+W[new Date(u).getUTCDay()]+', '+d+'/'+m+'/'+y+'</div><div class="nm">'+T('Ngày thứ ','Day ')+'<b>'+doy+'</b> / '+tot+T(' trong năm · còn ',' of the year · ')+(tot-doy)+T(' ngày',' days left')+'</div><div class="nm">'+T('Quý ','Quarter ')+Math.ceil(m/3)+' · '+T('đã qua ','')+(doy/tot*100).toFixed(1)+'%'+T(' của năm',' of the year passed')+'</div>'+(w[1]!==y?'<div class="nm">'+T('Thuộc tuần của năm ','Belongs to ISO year ')+w[1]+'</div>':'');
 },function(e){if(e.target&&e.target.id==='wk-t'){$('wk-d').value=fd(new Date());$('panel').oninput()}});$('panel').oninput();
};
function ntr(s){return '<span data-notr>'+esc(s)+'</span>'}
/* ---- Hàm dùng chung cho các tính năng hỗ trợ làm việc ---- */
function pu2(x){var p=String(x).split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])}
function todayMs(){var n=new Date();return Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())}
function rdj(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function goldenWin(){
 var ci=ls('ci');ci=Array.isArray(ci)?ci:[];var fo=ci.filter(function(e){return e.k==='focus'&&e.s}),by={};
 fo.forEach(function(e){var g=Math.floor(new Date(e.t).getHours()/2)*2;(by[g]=by[g]||[]).push(e.s)});
 var gr=Object.keys(by).map(function(g){var v=by[g],s=0;v.forEach(function(x){s+=x});return{h:+g,n:v.length,a:s/v.length}}).filter(function(r){return r.n>=3}).sort(function(a,b){return b.a-a.a})[0];
 return fo.length>=5&&gr?gr:null;
}
function estFactor(){
 var s=ls('todo');if(!s||!Array.isArray(s.items))return null;
 var a=s.items.filter(function(x){return x.done&&x.est>0&&x.p>0&&!x.ib}),se=0,sp=0;a.forEach(function(x){se+=x.est;sp+=x.p});
 return a.length>=3&&se>0?{f:sp/se,n:a.length}:null;
}
function capacity(){
 var st=rdj('bg-stats',{}),n=new Date(),days=[],i,d,key;
 for(i=1;i<=14;i++){d=new Date(n.getFullYear(),n.getMonth(),n.getDate()-i);key=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());var c=(st[key]&&st[key].pomo)?st[key].pomo[1]:0;if(c>0)days.push(c)}
 return days.length>=3?Math.round(days.reduce(function(a,b){return a+b},0)/days.length*10)/10:null;
}
function openList(items){var td=todayMs();return items.filter(function(x){return !x.done&&!x.ib&&(x.s||(x.d&&pu2(x.d)<=td))})}
function pickNext(items,skip,gw){
 var td=todayMs(),hr=new Date().getHours(),inG=!!(gw&&hr>=gw.h&&hr<gw.h+2);
 var cand=items.filter(function(x){return !x.done&&!x.ib}).map(function(x){
  var sc=0,w=[],df=x.d?Math.round((pu2(x.d)-td)/864e5):null;
  if(df!==null){if(df<0){sc+=50+Math.min(10,-df);w.push(T('đã trễ '+(-df)+' ngày','overdue by '+(-df)+' d'))}else if(df===0){sc+=40;w.push(T('hạn hôm nay','due today'))}else if(df===1){sc+=25;w.push(T('hạn ngày mai','due tomorrow'))}else if(df<=3){sc+=12;w.push(T('hạn trong '+df+' ngày','due in '+df+' d'))}}
  if(x.pr===1){sc+=20;w.push(T('ưu tiên cao','high priority'))}else if(x.pr===3)sc-=5;
  if(x.s){sc+=15;w.push(T('bạn đã ghim','pinned by you'))}
  if(x.p>0||x.f>0){sc+=10;w.push(T('đang làm dở','already in progress'))}
  if(inG&&x.pr===1){sc+=10;w.push(T('đúng giờ vàng của bạn','your golden hour'))}
  return{it:x,sc:sc,why:w.slice(0,3).join(' · ')||T('việc đang chờ bạn','waiting for you')};
 }).sort(function(a,b){return b.sc-a.sc});
 return cand.length?cand[skip%cand.length]:null;
}
window.BGX={pickNext:pickNext,goldenWin:goldenWin,estFactor:estFactor,capacity:capacity};

/* ---- Việc cần làm ---- */
PXR.todo=function(){
 var view=ls('todo-view')||'today',pjf='',msg='';
 function load(){var s=ls('todo');if(!s||!Array.isArray(s.items))s={items:[],cur:''};if(!s.cur)s.cur='';return s}
 function save(s){var cut=Date.now()-60*864e5;s.items=s.items.filter(function(x){return !x.done||x.done>cut}).slice(-400);ls('todo',s);try{window.dispatchEvent(new Event('bg-todo'))}catch(e){}}
 function pu(x){var p=String(x).split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])}
 function dfTo(d){var n=new Date();return Math.round((pu(d)-Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()))/864e5)}
 function dl(d){if(!d)return '';var df=dfTo(d);return df<0?T('trễ '+(-df)+' ngày','late '+(-df)+' d'):df===0?T('hôm nay','today'):df===1?T('ngày mai','tomorrow'):T('còn '+df+' ngày','in '+df+' d')}
 function inView(it,v){
  if(v==='inbox')return !!it.ib&&!it.done;
  if(it.ib&&!it.done)return false;
  if(v==='done')return !!it.done;
  if(it.done)return false;
  if(v==='today')return !!it.s||(it.d&&dfTo(it.d)<=0);
  if(v==='soon')return !!it.d&&dfTo(it.d)>0&&dfTo(it.d)<=7;
  return true;
 }
 function sortf(a,b){var ad=a.d?dfTo(a.d):9999,bd=b.d?dfTo(b.d):9999;return (a.pr||2)-(b.pr||2)||ad-bd||(a.c||0)-(b.c||0)}
 function draw(){
  var s=load(),it=s.items,V=[['today',T('Hôm nay','Today')],['soon',T('7 ngày tới','Next 7 days')],['all',T('Tất cả','All')],['done',T('Đã xong','Done')]];var ibn=it.filter(function(x){return x.ib&&!x.done}).length;if(ibn)V.push(['inbox','📥 '+T('Hộp thư','Inbox')]);if(view==='inbox'&&!ibn)view='today';
  var pjs=[];it.forEach(function(x){if(x.j&&pjs.indexOf(x.j)<0)pjs.push(x.j)});if(pjf&&pjs.indexOf(pjf)<0)pjf='';
  var list=it.filter(function(x){return inView(x,view)&&(!pjf||x.j===pjf)});
  if(view==='done')list.sort(function(a,b){return b.done-a.done});else list.sort(sortf);
  var h='<div class="chips2" style="grid-template-columns:repeat(2,1fr)">'+V.map(function(v){var n=it.filter(function(x){return inView(x,v[0])}).length;return '<button type="button" data-v="'+v[0]+'" aria-pressed="'+(v[0]===view)+'"'+(v[0]===view?' style="background:var(--go);color:var(--go-ink)"':'')+'>'+v[1]+' ('+n+')</button>'}).join('')+'</div>';
  if(pjs.length)h+='<div class="chips2" style="margin-top:8px;grid-template-columns:repeat(auto-fit,minmax(90px,1fr))"><button type="button" data-pj="" aria-pressed="'+(!pjf)+'"'+(!pjf?' style="background:var(--ink);color:var(--surface)"':'')+'>'+T('Mọi dự án','All projects')+'</button>'+pjs.map(function(p,i){return '<button type="button" data-pj="'+i+'" aria-pressed="'+(p===pjf)+'"'+(p===pjf?' style="background:var(--ink);color:var(--surface)"':'')+'>'+ntr(p)+'</button>'}).join('')+'</div>';
  h+='<div id="td-l" style="margin-top:12px">'+(list.length?list.map(function(x){
    if(x.ib&&!x.done)return '<div class="card" style="display:block;margin-bottom:10px"><div style="overflow-wrap:anywhere;font-weight:700">💭 '+ntr(x.t)+'</div><div class="row" style="margin:8px 0 0;gap:6px"><button type="button" data-a="ib2t" data-id="'+x.id+'">➡ '+T('Thành việc','Make it a task')+'</button><button type="button" data-a="rm" data-id="'+x.id+'" aria-label="'+T('Xóa','Delete')+'">🗑</button></div></div>';
    var dd=x.d?dfTo(x.d):null,col=dd!==null&&dd<0&&!x.done?'var(--stop)':'var(--muted)',meta=[];
    if(x.j)meta.push('📁 '+ntr(x.j));
    if(x.d)meta.push('<span style="color:'+col+'">'+dl(x.d)+' ('+x.d.split('-').reverse().slice(0,2).join('/')+')</span>');
    if(x.est||x.p)meta.push('🍅 '+(x.p||0)+(x.est?'/'+x.est:''));
    if(x.f)meta.push('⏱ '+Math.round(x.f/60000)+T(' phút',' min'));
    if(x.est&&x.d&&!x.done){var left=Math.max(0,x.est-(x.p||0)),dd2=Math.max(1,dfTo(x.d)+1);if(left>0&&dfTo(x.d)>=0)meta.push(T('cần ~'+(Math.ceil(left/dd2*10)/10)+' 🍅/ngày','~'+(Math.ceil(left/dd2*10)/10)+' 🍅/day'))}
    return '<div class="card" style="display:block;margin-bottom:10px"><div style="display:flex;gap:10px;align-items:flex-start"><button type="button" data-a="ck" data-id="'+x.id+'" aria-label="'+T('Đánh dấu xong','Mark done')+'" style="min-width:44px;min-height:44px;border-radius:50%;font-size:20px;padding:0">'+(x.done?'✓':'○')+'</button><div style="flex:1;min-width:0"><div style="font-weight:700;overflow-wrap:anywhere'+(x.done?';text-decoration:line-through;opacity:.6':'')+'">'+(x.pr===1?'🔴 ':x.pr===3?'⚪ ':'🟡 ')+(x.s&&!x.done?'⭐ ':'')+ntr(x.t)+(s.cur===x.id?' 🎯':'')+'</div><div class="nm">'+meta.join(' · ')+'</div></div></div>'+(x.done?'<div class="row" style="margin:8px 0 0"><button type="button" data-a="rm" data-id="'+x.id+'">'+T('Xóa','Delete')+'</button></div>':'<div class="row" style="margin:8px 0 0;gap:6px"><button type="button" data-a="go" data-id="'+x.id+'">🍅 '+T('Bắt đầu','Start')+'</button><button type="button" data-a="st" data-id="'+x.id+'" aria-label="'+T('Ghim vào Hôm nay','Pin to Today')+'">'+(x.s?'★':'☆')+'</button><button type="button" data-a="sp" data-id="'+x.id+'" aria-label="'+T('Thêm vào ôn tập cách quãng','Add to spaced review')+'">🧠</button><button type="button" data-a="ed" data-id="'+x.id+'" aria-label="'+T('Sửa','Edit')+'">✏️</button><button type="button" data-a="rm" data-id="'+x.id+'" aria-label="'+T('Xóa','Delete')+'">🗑</button></div>')+'</div>'}).join(''):'<div class="nm">'+(view==='today'?T('Hôm nay chưa có việc nào. Thêm việc bên dưới, hoặc bấm ☆ ở một việc để ghim vào Hôm nay.','Nothing for today yet. Add a task below, or tap ☆ on a task to pin it to Today.'):T('Không có việc nào ở mục này.','No tasks here.'))+'</div>')+'</div><div class="nm" id="td-m" role="status">'+msg+'</div>';
  $('td-top').innerHTML=h;
  $('td-pl').innerHTML=pjs.map(function(p){return '<option value="'+esc(p)+'">'}).join('');
 }
 function add(){
  var t=($('td-t').value||'').trim();if(!t){$('td-t').focus();return}
  var s=load(),e=parseInt($('td-e').value,10);
  s.items.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:t.slice(0,120),pr:parseInt($('td-p').value,10)||2,d:$('td-d').value||'',j:($('td-j').value||'').trim().slice(0,20),est:e>0&&e<100?e:0,p:0,f:0,s:0,done:0,c:Date.now()});
  save(s);$('td-t').value='';$('td-e').value='';msg='';draw();
 }
 mount('<div id="td-top"></div><div class="card" style="display:block;margin-top:12px"><div class="row">'+fld(T('Việc cần làm','New task'),'td-t','','maxlength="120" autocomplete="off"')+'</div><div class="row">'+fld(T('Hạn (không bắt buộc)','Due (optional)'),'td-d','','type="date"')+'<label>'+T('Ưu tiên','Priority')+'<select id="td-p"><option value="1">'+T('Cao','High')+'</option><option value="2" selected>'+T('Vừa','Medium')+'</option><option value="3">'+T('Thấp','Low')+'</option></select></label></div><div class="row">'+fld(T('Dự án','Project'),'td-j','','maxlength="20" list="td-pl" autocomplete="off"')+fld(T('Số 🍅 dự kiến','Planned 🍅'),'td-e','','inputmode="numeric"')+'</div><div class="nm" id="td-eh"></div><datalist id="td-pl"></datalist><div class="chips2"><button type="button" id="td-a">'+T('Thêm việc','Add task')+'</button></div></div><div class="nm" style="margin-top:10px">'+T('Bấm 🍅 để chọn việc và mở Pomodoro: mỗi phiên xong sẽ được cộng vào việc đó. Việc có hạn và số 🍅 dự kiến sẽ cho biết mỗi ngày cần bao nhiêu 🍅. Bấm 🧠 để thêm nội dung vào Ôn tập cách quãng.','Tap 🍅 to pick a task and open Pomodoro: each finished session counts toward it. Tasks with a due date and planned 🍅 show how many 🍅 you need per day. Tap 🧠 to add it to Spaced review.')+'</div>',function(e){var t=e&&e.target;if(t&&t.id==='td-e'){var f=estFactor(),v=parseInt($('td-e').value,10);$('td-eh').textContent=(f&&v>0&&Math.abs(f.f-1)>0.2)?T('Hệ số của bạn ×'+f.f.toFixed(1)+': nên ghi ~'+Math.max(1,Math.round(v*f.f))+' 🍅','Your factor ×'+f.f.toFixed(1)+': try ~'+Math.max(1,Math.round(v*f.f))+' 🍅'):''}},function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b)return;
  if(b.id==='td-a'){add();return}
  if(b.hasAttribute('data-v')){view=b.getAttribute('data-v');ls('todo-view',view);msg='';draw();return}
  if(b.hasAttribute('data-pj')){var pjs=[],s0=load();s0.items.forEach(function(x){if(x.j&&pjs.indexOf(x.j)<0)pjs.push(x.j)});var q=b.getAttribute('data-pj');pjf=q===''?'':(pjs[+q]||'');draw();return}
  var a=b.getAttribute('data-a'),id=b.getAttribute('data-id');if(!a)return;
  var s=load(),it=s.items.filter(function(x){return x.id===id})[0];if(!it)return;
  if(a==='ck'){it.done=it.done?0:Date.now();if(it.done&&s.cur===id)s.cur='';if(it.done&&window.BGBUS)BGBUS.emit('task-done',{t:it.t});msg=it.done?T('Đã xong. Giỏi lắm! 🎉','Done. Nice work! 🎉'):''}
  else if(a==='ib2t'){it.ib=0;it.pr=2;msg=T('Đã chuyển thành việc.','Turned into a task.')}
  else if(a==='st'){it.s=it.s?0:1}
  else if(a==='go'){s.cur=id;save(s);if(window.BGBUS){BGBUS.req('start-pomo',{})}else{var t=document.querySelector('#tabs [data-m="pomo"]');if(t)t.click()}return}
  else if(a==='sp'){var sp=ls('spaced');if(!sp||!Array.isArray(sp.items))sp={items:[]};sp.items.push({n:it.t.slice(0,60),d:today(),s:0});ls('spaced',sp);msg=T('Đã thêm vào Ôn tập cách quãng.','Added to Spaced review.')}
  else if(a==='ed'){var v=window.prompt(T('Sửa tên việc','Edit task'),it.t);if(v&&v.trim())it.t=v.trim().slice(0,120);else return}
  else if(a==='rm'){if(!window.confirm(T('Xóa việc này?','Delete this task?')))return;s.items=s.items.filter(function(x){return x.id!==id});if(s.cur===id)s.cur=''}
  save(s);draw();
 });
 draw();
};
/* ---- Hôm nay ---- */
PXR.today=function(){
 var skipN=0;
 function rd(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
 function pu(x){var p=String(x).split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])}
 function openTab(m){var b=document.querySelector('#tabs [data-m="'+m+'"]');if(b)b.click()}
 function draw(){
  var t=today(),n=new Date(),td=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()),hr=n.getHours();
  var hello=hr<11?T('Chào buổi sáng','Good morning'):hr<18?T('Chào buổi chiều','Good afternoon'):T('Chào buổi tối','Good evening');
  var W=EN()?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
  var st=rd('bg-stats',{}),day=st[t]||{},ms=0,k;for(k in day)ms+=day[k][0];var goal=parseInt(localStorage.getItem('bg2-goal'),10);if(!(goal>=1))goal=30;var fm=Math.round(ms/60000),fp=Math.min(100,Math.round(fm/goal*100));
  var td0=ls('todo');if(!td0||!Array.isArray(td0.items))td0={items:[],cur:''};
  var tasks=td0.items.filter(function(x){return !x.done&&(x.s||(x.d&&pu(x.d)<=td))}).sort(function(a,b){return (a.pr||2)-(b.pr||2)||(a.d||'9').localeCompare(b.d||'9')});
  var doneToday=td0.items.filter(function(x){return x.done&&new Date(x.done).toDateString()===n.toDateString()}).length;
  var H=ls('habits')||[],hd=H.filter(function(x){return x.d&&x.d.indexOf(t)>=0}).length;
  var wt=ls('water')||{},wg=wt.goal||2000,wsum=((wt.days||{})[t]||[]).reduce(function(a,b){return a+b},0);
  var GAP=[1,3,7,14,30],sp=ls('spaced'),due=0;if(sp&&Array.isArray(sp.items))sp.items.forEach(function(x){if(pu(x.d)+GAP[x.s]*864e5<=td)due++});
  var DAYS=rd('bg-days',[]);DAYS=Array.isArray(DAYS)?DAYS.filter(function(e){return e&&e.date&&pu(e.date)>=td}).sort(function(a,b){return pu(a.date)-pu(b.date)}).slice(0,3):[];
  var sl=ls('sl'),last=Array.isArray(sl)&&sl.length?sl[sl.length-1]:null;
  function card(title,open,body){return '<div class="card" style="display:block;margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>'+title+'</b>'+(open?'<button type="button" data-open="'+open+'" style="min-height:36px;padding:4px 12px">'+T('Mở','Open')+'</button>':'')+'</div>'+body+'</div>'}
  function bar(p){return '<div style="height:10px;border-radius:6px;background:var(--line);overflow:hidden;margin:8px 0"><div style="height:100%;width:'+p+'%;background:var(--go)"></div></div>'}
  var h='<div class="big">☀️ '+hello+'</div><div class="nm">'+W[n.getDay()]+', '+n.getDate()+'/'+(n.getMonth()+1)+'/'+n.getFullYear()+'</div><div style="height:10px"></div>';
  var nxt=pickNext(td0.items,skipN,goldenWin());
  h+=card('👉 '+T('Làm gì tiếp theo?','What next?'),'',nxt?'<div style="font-weight:700;margin-top:6px;overflow-wrap:anywhere">'+ntr(nxt.it.t)+'</div><div class="nm">'+nxt.why+'</div><div class="row" style="margin:8px 0 0;gap:6px"><button type="button" data-go="'+nxt.it.id+'">🍅 '+T('Bắt đầu','Start')+'</button><button type="button" data-s5="'+nxt.it.id+'">⏱ '+T('Chỉ 5 phút','Just 5 min')+'</button><button type="button" data-skip="1">↻ '+T('Việc khác','Another')+'</button></div>':'<div class="nm">'+T('Chưa có việc nào. Thêm ở mục Việc cần làm, hoặc gõ nhanh bằng Ctrl+K.','No tasks yet. Add one in To-do, or use Ctrl+K.')+'</div>');
  h+=card('✅ '+T('Việc hôm nay','Tasks today'),'todo',(tasks.length?tasks.slice(0,5).map(function(x){var late=x.d&&pu(x.d)<td;return '<div style="display:flex;gap:8px;align-items:center;margin-top:8px"><button type="button" data-ck="'+x.id+'" aria-label="'+T('Đánh dấu xong','Mark done')+'" style="min-width:40px;min-height:40px;border-radius:50%;padding:0">○</button><div style="flex:1;min-width:0;overflow-wrap:anywhere">'+(x.pr===1?'🔴 ':'')+ntr(x.t)+(late?' <span style="color:var(--stop);font-size:12px">'+T('trễ','late')+'</span>':'')+'</div><button type="button" data-go="'+x.id+'" aria-label="'+T('Bắt đầu Pomodoro','Start Pomodoro')+'" style="min-height:40px;padding:4px 10px">🍅</button></div>'}).join('')+(tasks.length>5?'<div class="nm">+'+(tasks.length-5)+T(' việc nữa',' more')+'</div>':''):'<div class="nm">'+T('Chưa có việc nào cho hôm nay.','Nothing planned for today.')+'</div>')+(doneToday?'<div class="nm">'+T('Đã xong hôm nay: ','Done today: ')+doneToday+'</div>':''));
  var plan=openList(td0.items).reduce(function(a,x){return a+Math.max(0,(x.est>0?x.est-(x.p||0):1))},0),cap=capacity(),ef=estFactor();
  if(plan>0||(ef&&Math.abs(ef.f-1)>0.2)){var cb='';
   if(plan>0){cb+='<div class="nm">'+T('Hôm nay bạn xếp khoảng '+plan+' 🍅','Planned for today: about '+plan+' 🍅')+(cap?T('; bạn thường làm được ~'+cap+' 🍅 mỗi ngày.','; you usually finish ~'+cap+' 🍅 a day.'):'.')+'</div>';
    if(cap&&plan>cap*1.2)cb+='<div class="nm" style="color:var(--stop)">'+T('Có vẻ quá tải. Hãy dời bớt việc ít quan trọng sang ngày khác.','Looks overloaded. Move less important tasks to another day.')+'</div>';else if(cap)cb+='<div class="nm">'+T('Vừa sức ✓','Within your usual capacity ✓')+'</div>'}
   if(ef&&Math.abs(ef.f-1)>0.2)cb+='<div class="nm">📏 '+T('Bạn thường ước lượng '+(ef.f>1?'thiếu':'thừa')+' ×'+ef.f.toFixed(1)+' (từ '+ef.n+' việc đã xong).','You usually estimate '+(ef.f>1?'too low':'too high')+' by ×'+ef.f.toFixed(1)+' (from '+ef.n+' finished tasks).')+'</div>';
   h+=card('⚖️ '+T('Sức chứa hôm nay','Today capacity'),'todo',cb)}
  var ibc=td0.items.filter(function(x){return x.ib&&!x.done}).length;
  if(ibc)h+=card('📥 '+T('Hộp thư ý nghĩ','Thought inbox'),'','<div class="nm">'+T(ibc+' ý nghĩ chưa xử lý.',ibc+' thoughts waiting.')+'</div><button type="button" data-inbox="1" style="min-height:40px;margin-top:6px">'+T('Xem và xử lý','Review')+'</button>');
  var cld=rdj('bg2x-closed',null);
  if(hr>=16&&!(cld&&cld.d===t))h+=card('🌙 '+T('Đóng ngày','Close the day'),'close','<div class="nm">'+(tasks.length?T('Còn '+tasks.length+' việc chưa xong. Dồn sang mai chỉ bằng một chạm.','Still '+tasks.length+' open tasks. Roll them to tomorrow in one tap.'):T('Tổng kết ngày và chuẩn bị cho mai.','Wrap up the day and prepare for tomorrow.'))+'</div>');
  var ci=ls('ci');ci=Array.isArray(ci)?ci:[];var fo=ci.filter(function(e){return e.k==='focus'&&e.s}),by={};
  fo.forEach(function(e){var g=Math.floor(new Date(e.t).getHours()/2)*2;(by[g]=by[g]||[]).push(e.s)});
  var gr=Object.keys(by).map(function(g){var v=by[g],s=0;v.forEach(function(x){s+=x});return{h:+g,n:v.length,a:s/v.length}}).filter(function(r){return r.n>=3}).sort(function(a,b){return b.a-a.a})[0];
  if(fo.length>=5&&gr){
   var inG=hr>=gr.h&&hr<gr.h+2,hard=tasks.filter(function(x){return x.pr===1})[0]||tasks[0],wl=(gr.h-hr+24)%24,win=pad(gr.h)+':00–'+pad((gr.h+2)%24)+':00';
   var gb='<div class="nm">'+T('Bạn tập trung tốt nhất lúc '+win+' (trung bình '+gr.a.toFixed(1)+'/5).','You focus best at '+win+' (average '+gr.a.toFixed(1)+'/5).')+'</div>';
   if(hard)gb+='<div style="display:flex;gap:8px;align-items:center;margin-top:8px"><div style="flex:1;min-width:0;overflow-wrap:anywhere">'+(inG?T('Đang trong giờ vàng, làm việc khó nhất ngay: ','In your golden hours, tackle the hardest task now: '):T('Giờ vàng kế tiếp sau khoảng '+wl+' giờ. Để dành cho: ','Next golden window in about '+wl+' h. Save it for: '))+'<b>'+ntr(hard.t)+'</b></div>'+(inG?'<button type="button" data-go="'+hard.id+'" aria-label="'+T('Bắt đầu Pomodoro','Start Pomodoro')+'" style="min-height:40px;padding:4px 10px">🍅</button>':'')+'</div>';
   h+=card('🌟 '+T('Giờ vàng','Golden hours'),'',gb);
  }
  h+=card('🍅 '+T('Tập trung','Focus'),'pomo','<div class="nm">'+fm+' / '+goal+T(' phút mục tiêu',' min goal')+'</div>'+bar(fp));
  h+=card('🔥 '+T('Thói quen','Habits'),'habit',H.length?'<div class="nm">'+hd+'/'+H.length+T(' đã làm hôm nay',' done today')+'</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'+H.slice(0,8).map(function(x,i){var on=x.d&&x.d.indexOf(t)>=0;return '<button type="button" data-hb="'+i+'" aria-pressed="'+on+'" style="min-height:40px'+(on?';background:var(--go);color:var(--go-ink)':'')+'">'+(on?'✓ ':'')+ntr(x.n||x.name||'?')+'</button>'}).join('')+'</div>':'<div class="nm">'+T('Chưa có thói quen nào.','No habits yet.')+'</div>');
  h+=card('💧 '+T('Uống nước','Water'),'water','<div class="nm">'+wsum+' / '+wg+' ml</div>'+bar(Math.min(100,Math.round(wsum/wg*100)))+'<button type="button" data-wt="250" style="min-height:40px">+250 ml</button>');
  if(due)h+=card('🧠 '+T('Ôn tập','Review'),'spaced','<div class="nm" style="color:var(--stop)">'+T(due+' mục đến hạn ôn hôm nay',due+' items due for review')+'</div>');
  if(DAYS.length)h+=card('🗓️ '+T('Sắp tới','Coming up'),'days',DAYS.map(function(e){var df=Math.round((pu(e.date)-td)/864e5);return '<div class="nm" style="margin-top:6px">'+ntr(e.name||'')+': <b>'+(df===0?T('hôm nay','today'):T(df+' ngày',df+' d'))+'</b></div>'}).join(''));
  if(last&&last.w&&n.getTime()-last.w<36*36e5)h+=card('😴 '+T('Giấc ngủ gần nhất','Last sleep'),'sleep','<div class="nm">'+(function(){var m=Math.round((last.w-last.b)/60000);return Math.floor(m/60)+T(' giờ ',' h ')+(m%60)+T(' phút',' min')})()+'</div>');
  $('td-box').innerHTML=h;
 }
 mount('<div id="td-box"></div><div class="nm">'+T('Tổng quan lấy từ các công cụ khác của Bấm giờ. Mọi dữ liệu nằm trên máy bạn.','An overview pulled from the other Bấm giờ tools. All data stays on your device.')+'</div>',null,function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-skip')){skipN++;draw();return}
  if(b.hasAttribute('data-s5')){if(window.BGBUS)BGBUS.req('sprint',{id:b.getAttribute('data-s5')});return}
  if(b.hasAttribute('data-inbox')){try{localStorage.setItem('bg2x-todo-view','"inbox"')}catch(x){}openTab('todo');return}
  if(b.hasAttribute('data-open')){openTab(b.getAttribute('data-open'));return}
  if(b.hasAttribute('data-ck')){var s=ls('todo');if(!s||!Array.isArray(s.items))return;var it=s.items.filter(function(x){return x.id===b.getAttribute('data-ck')})[0];if(it){it.done=Date.now();if(s.cur===it.id)s.cur='';if(window.BGBUS)BGBUS.emit('task-done',{t:it.t});ls('todo',s);try{window.dispatchEvent(new Event('bg-todo'))}catch(x){}}draw();return}
  if(b.hasAttribute('data-go')){var s2=ls('todo');if(s2&&Array.isArray(s2.items)){s2.cur=b.getAttribute('data-go');ls('todo',s2);try{window.dispatchEvent(new Event('bg-todo'))}catch(x){}}if(window.BGBUS)BGBUS.req('start-pomo',{});else openTab('pomo');return}
  if(b.hasAttribute('data-hb')){var H=ls('habits')||[],i=parseInt(b.getAttribute('data-hb'),10),h=H[i],t=today();if(h){h.d=h.d||[];var j=h.d.indexOf(t);if(j>=0)h.d.splice(j,1);else h.d.push(t);ls('habits',H)}draw();return}
  if(b.hasAttribute('data-wt')){var w=ls('water')||{};if(!w.goal)w.goal=2000;if(!w.days)w.days={};var k=today();w.days[k]=w.days[k]||[];var w0=w.days[k].reduce(function(p,x){return p+x},0);w.days[k].push(parseInt(b.getAttribute('data-wt'),10));ls('water',w);var w1=w.days[k].reduce(function(p,x){return p+x},0);if(w0<w.goal&&w1>=w.goal&&window.BGBUS)BGBUS.emit('water-goal',{});draw();return}
 });
 draw();
};
/* ---- Quy tắc tự động ---- */
PXR.rules=function(){
 function load(){var a=ls('rules');return Array.isArray(a)?a:[]}
 function save(a){ls('rules',a.slice(0,30))}
 function tools(){return [].map.call(document.querySelectorAll('#tabs [data-m]'),function(b){return{k:b.getAttribute('data-m'),n:b.textContent.trim()}})}
 function tn(k){var t=tools().filter(function(x){return x.k===k})[0];return t?t.n:k}
 function desc(r){
  var w=r.on==='pomo'?T('Xong mỗi '+r.n+' phiên Pomodoro','After every '+r.n+' Pomodoro sessions'):r.on==='task'?T('Xong một việc cần làm','A task is completed'):r.on==='water'?T('Đủ mục tiêu uống nước','Water goal reached'):T('Mỗi ngày lúc '+r.t,'Every day at '+r.t);
  var d=r.do==='toast'?T('hiện nhắc','show reminder')+(r.txt?': “'+ntr(r.txt)+'”':''):r.do==='open'?T('mở ','open ')+ntr(tn(r.tool)):r.do==='water'?T('thêm 250 ml nước','add 250 ml of water'):T('bắt đầu Pomodoro','start Pomodoro');
  return '<b>'+T('Khi ','When ')+'</b>'+w+'<br><b>'+T('Thì ','Then ')+'</b>'+d;
 }
 function draw(){
  var a=load(),L=$('ru-l');
  L.innerHTML=a.length?a.map(function(r,i){return '<div class="card" style="display:block;margin-bottom:10px;'+(r.en?'':'opacity:.55')+'"><div class="nm" style="line-height:1.6">'+desc(r)+'</div><div class="row" style="margin:8px 0 0"><button type="button" data-t="'+i+'" aria-pressed="'+(!!r.en)+'">'+(r.en?T('Đang bật','On'):T('Đang tắt','Off'))+'</button><button type="button" data-d="'+i+'">'+T('Xóa','Delete')+'</button></div></div>'}).join(''):'<div class="nm">'+T('Chưa có quy tắc nào. Ví dụ: "Mỗi 4 phiên Pomodoro thì hiện nhắc Nghỉ dài, uống nước".','No rules yet. Example: "After every 4 Pomodoro sessions, show a reminder to take a long break and drink water".')+'</div>';
 }
 function sync(){
  var on=$('ru-on').value,dd=$('ru-do').value;
  $('ru-n').closest('label').hidden=on!=='pomo';
  $('ru-t').closest('label').hidden=on!=='time';
  $('ru-x').closest('label').hidden=dd!=='toast';
  $('ru-tl').closest('label').hidden=dd!=='open';
 }
 var opts=tools().map(function(t){return '<option value="'+t.k+'">'+ntr(t.n)+'</option>'}).join('');
 mount('<div class="card" style="display:block"><div class="row"><label>'+T('Khi','When')+'<select id="ru-on"><option value="pomo">'+T('Xong mỗi N phiên Pomodoro','After every N Pomodoro sessions')+'</option><option value="task">'+T('Xong một việc cần làm','A task is completed')+'</option><option value="water">'+T('Đủ mục tiêu uống nước','Water goal reached')+'</option><option value="time">'+T('Mỗi ngày vào một giờ','Every day at a time')+'</option></select></label></div><div class="row">'+fld(T('Số phiên N','Sessions N'),'ru-n','4','inputmode="numeric"')+fld(T('Giờ','Time'),'ru-t','12:00','type="time"')+'</div><div class="row"><label>'+T('Thì','Then')+'<select id="ru-do"><option value="toast">'+T('Hiện nhắc','Show a reminder')+'</option><option value="open">'+T('Mở một công cụ','Open a tool')+'</option><option value="water">'+T('Thêm 250 ml nước','Add 250 ml of water')+'</option><option value="pomo">'+T('Bắt đầu Pomodoro','Start Pomodoro')+'</option></select></label></div><div class="row">'+fld(T('Lời nhắc','Reminder text'),'ru-x','','maxlength="60"')+'<label>'+T('Công cụ','Tool')+'<select id="ru-tl">'+opts+'</select></label></div><div class="chips2"><button type="button" id="ru-a">'+T('Thêm quy tắc','Add rule')+'</button></div></div><div id="ru-l" style="margin-top:12px"></div><div class="nm">'+T('Quy tắc chạy khi trang Bấm giờ đang mở (kể cả ở khung khác). Thông báo hiện nổi phía trên màn hình.','Rules run while Bấm giờ is open (including in other panes). Alerts appear at the top of the screen.')+'</div>',function(e){sync()},function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b)return;var a=load();
  if(b.id==='ru-a'){
   var on=$('ru-on').value,dd=$('ru-do').value,n=parseInt($('ru-n').value,10)||0,t=$('ru-t').value;
   if(on==='pomo'&&!(n>=1&&n<=20)){$('ru-n').focus();return}
   if(on==='time'&&!t){$('ru-t').focus();return}
   a.push({id:Date.now().toString(36),on:on,n:n,t:t,do:dd,txt:($('ru-x').value||'').trim().slice(0,60),tool:$('ru-tl').value,en:1,last:''});save(a);$('ru-x').value='';draw();return;
  }
  if(b.hasAttribute('data-t')){var r=a[+b.getAttribute('data-t')];if(r)r.en=r.en?0:1;save(a);draw();return}
  if(b.hasAttribute('data-d')){a.splice(+b.getAttribute('data-d'),1);save(a);draw()}
 });
 sync();draw();
};
/* ---- Đóng ngày ---- */
PXR.close=function(){
 function load(){var s=ls('todo');if(!s||!Array.isArray(s.items))s={items:[],cur:''};return s}
 function draw(){
  var s=load(),n=new Date(),key=today(),st=rdj('bg-stats',{}),day=st[key]||{},ms=0,k;for(k in day)ms+=day[k][0];var pc=day.pomo?day.pomo[1]:0;
  var doneT=s.items.filter(function(x){return x.done&&!x.ib&&new Date(x.done).toDateString()===n.toDateString()}).length,open=openList(s.items);
  var h='<div class="big">🌙 '+T('Đóng ngày','Close the day')+'</div><div class="nm">'+T('Xong '+doneT+' việc · '+pc+' 🍅 · '+Math.round(ms/60000)+' phút tập trung','Done '+doneT+' tasks · '+pc+' 🍅 · '+Math.round(ms/60000)+' min focused')+'</div>';
  if(open.length)h+='<div class="card" style="display:block;margin-top:10px"><b>'+T('Chưa xong. Chọn việc dồn sang mai:','Unfinished. Pick tasks to roll over to tomorrow:')+'</b>'+open.map(function(x){return '<label class="chk" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink);margin-top:8px"><input type="checkbox" data-cl="'+x.id+'" checked> '+ntr(x.t)+'</label>'}).join('')+'<div class="chips2" style="margin-top:10px"><button type="button" id="cl-go">'+T('Dồn sang mai và đóng ngày','Roll over and close the day')+'</button></div></div>';
  else h+='<div class="card" style="display:block;margin-top:10px"><div class="nm">'+T('Không còn việc nào dở dang. Hôm nay gọn gàng rồi! 🎉','Nothing left unfinished. Nice and tidy! 🎉')+'</div><div class="chips2" style="margin-top:10px"><button type="button" id="cl-go">'+T('Đóng ngày','Close the day')+'</button></div></div>';
  var cl=rdj('bg2x-closed',null);if(cl&&cl.d===key)h+='<div class="nm" style="margin-top:8px">✅ '+T('Hôm nay bạn đã đóng ngày.','You already closed today.')+'</div>';
  var cap=capacity(),ef=estFactor();
  if(cap)h+='<div class="nm" style="margin-top:8px">⚖️ '+T('Sức chứa thường ngày của bạn: ~'+cap+' 🍅.','Your usual daily capacity: ~'+cap+' 🍅.')+'</div>';
  if(ef&&Math.abs(ef.f-1)>0.2)h+='<div class="nm">📏 '+T('Bạn thường ước lượng '+(ef.f>1?'thiếu':'thừa')+' ×'+ef.f.toFixed(1)+' so với thực tế.','You usually estimate '+(ef.f>1?'too low':'too high')+' by ×'+ef.f.toFixed(1)+'.')+'</div>';
  $('cl-box').innerHTML=h;
 }
 mount('<div id="cl-box"></div><div class="nm" style="margin-top:10px">'+T('Dồn việc sang mai sẽ đổi hạn thành ngày mai và bỏ ghim Hôm nay. Mai bạn sẽ thấy chúng ở mục Hôm nay.','Rolling over sets the due date to tomorrow and unpins from Today. You will see them in Today tomorrow.')+'</div>',null,function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b||b.id!=='cl-go')return;
  var s=load(),tm=new Date();tm.setDate(tm.getDate()+1);var ts=tm.getFullYear()+'-'+pad(tm.getMonth()+1)+'-'+pad(tm.getDate()),ids=[].map.call(document.querySelectorAll('[data-cl]'),function(x){return x.checked?x.getAttribute('data-cl'):null}).filter(Boolean),c=0;
  s.items.forEach(function(x){if(ids.indexOf(x.id)>=0){x.d=ts;x.s=0;c++}});
  ls('todo',s);ls('closed',{d:today()});try{window.dispatchEvent(new Event('bg-todo'))}catch(x){}
  draw();$('cl-box').insertAdjacentHTML('afterbegin','<div class="card" style="display:block;margin-bottom:10px">✅ '+T('Đã đóng ngày. '+c+' việc được dồn sang mai.','Day closed. '+c+' tasks rolled over to tomorrow.')+'</div>');
 });
 draw();
};
/* ---- Uống nước ---- */
PXR.water=function(){
 var fd=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
 function load(){var s=ls('water')||{};if(!s.goal)s.goal=2000;if(!s.days)s.days={};return s}
 function draw(){
  var s=load(),k=fd(new Date()),t=s.days[k]||[],sum=t.reduce(function(a,b){return a+b},0),pct=Math.min(100,Math.round(sum/s.goal*100)),i,h='';
  var W=EN()?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['CN','T2','T3','T4','T5','T6','T7'];
  for(i=1;i<=6;i++){var d=new Date();d.setDate(d.getDate()-i);var v=(s.days[fd(d)]||[]).reduce(function(a,b){return a+b},0);h+='<div class="nm">'+W[d.getDay()]+' '+d.getDate()+'/'+(d.getMonth()+1)+': '+v+' ml'+(v>=s.goal?' ✓':'')+'</div>'}
  $('wt-o').innerHTML='<div class="big">💧 '+sum+' / '+s.goal+' ml</div><div style="height:10px;border-radius:6px;background:var(--line);overflow:hidden;margin:10px 0"><div style="height:100%;width:'+pct+'%;background:var(--go)"></div></div><div class="nm">'+pct+'%'+(sum>=s.goal?' 🎉':T(' · còn '+Math.max(0,s.goal-sum)+' ml',' · '+Math.max(0,s.goal-sum)+' ml to go'))+' · '+t.length+T(' lần uống',' drinks')+'</div><div class="nm" style="margin-top:10px"><b>'+T('6 ngày trước','Previous 6 days')+'</b></div>'+h;
 }
 var s0=load();
 mount('<div class="row">'+fld(T('Mục tiêu mỗi ngày (ml)','Daily goal (ml)'),'wt-g',s0.goal,'inputmode="numeric"')+'</div><div class="chips2" style="grid-template-columns:repeat(3,1fr)"><button type="button" data-add="150">+150</button><button type="button" data-add="250">+250</button><button type="button" data-add="500">+500</button></div><div class="row">'+fld(T('Số khác (ml)','Other amount (ml)'),'wt-x','','inputmode="numeric"')+'<button type="button" id="wt-c">'+T('Thêm','Add')+'</button><button type="button" id="wt-u">'+T('Hoàn tác','Undo')+'</button></div><div class="card" id="wt-o"></div><div class="nm">'+T('Mục tiêu do bạn tự đặt. Nhu cầu nước mỗi người khác nhau tùy cơ thể, thời tiết và vận động.','The goal is yours to set. Needs vary with body, weather and activity.')+'</div>',function(e){
  if(e&&e.target&&e.target.id==='wt-g'){var g=parseFloat($('wt-g').value)||0;if(g>=500&&g<=6000){var s=load();s.goal=Math.round(g);ls('water',s)}}
  draw();
 },function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b)return;
  var s=load(),k=fd(new Date());s.days[k]=s.days[k]||[];var b0=s.days[k].reduce(function(a,x){return a+x},0);
  if(b.hasAttribute('data-add')){s.days[k].push(parseInt(b.getAttribute('data-add'),10))}
  else if(b.id==='wt-c'){var c=parseFloat($('wt-x').value)||0;if(c>0&&c<=2000)s.days[k].push(Math.round(c));$('wt-x').value=''}
  else if(b.id==='wt-u'){s.days[k].pop()}
  else return;
  var ks=Object.keys(s.days).sort();while(ks.length>30){delete s.days[ks.shift()]}
  ls('water',s);var b1=s.days[k].reduce(function(p,x){return p+x},0);if(b0<s.goal&&b1>=s.goal&&window.BGBUS)BGBUS.emit('water-goal',{});draw();
 });
 draw();
};
/* ---- Vùng nhịp tim ---- */
PXR.zone=function(){
 var s=ls('zone')||{a:30,r:''};
 mount('<div class="row">'+fld(T('Tuổi','Age'),'zn-a',s.a,'inputmode="numeric"')+fld(T('Nhịp tim lúc nghỉ (không bắt buộc)','Resting heart rate (optional)'),'zn-r',s.r,'inputmode="numeric"')+'</div><div class="card" id="zn-o"></div><div class="nm">'+T('Nhịp tim tối đa ước tính bằng 220 trừ tuổi, sai lệch giữa từng người có thể lớn. Nếu nhập nhịp tim nghỉ, app dùng công thức Karvonen. Chỉ để tham khảo: người có bệnh tim hoặc dùng thuốc ảnh hưởng nhịp tim nên hỏi bác sĩ.','Max heart rate is estimated as 220 minus age and varies a lot between people. With a resting rate the Karvonen formula is used. For reference only: if you have a heart condition or take medication that affects heart rate, ask a doctor.')+'</div>',function(){
  var a=parseFloat($('zn-a').value)||0,r=parseFloat($('zn-r').value)||0,o=$('zn-o');
  if(a<10||a>100){o.textContent=T('Nhập tuổi từ 10 đến 100.','Enter an age from 10 to 100.');return}
  var mx=220-a,k=r>=30&&r<mx-20;ls('zone',{a:a,r:r||''});
  var Z=[[50,60,'Rất nhẹ, khởi động','Very light, warm-up'],[60,70,'Nhẹ, nền tảng sức bền','Light, base endurance'],[70,80,'Vừa, tập aerobic','Moderate, aerobic'],[80,90,'Nặng, gần ngưỡng','Hard, near threshold'],[90,100,'Tối đa, chỉ vài phút','Maximum, a few minutes']];
  var f=function(p){return Math.round(k?r+(mx-r)*p/100:mx*p/100)};
  o.innerHTML='<div class="big">'+mx+' bpm</div><div class="nm">'+T('Nhịp tim tối đa ước tính','Estimated max heart rate')+(k?' · Karvonen':'')+'</div>'+Z.map(function(z,i){return '<div class="nm" style="margin-top:8px"><b>Z'+(i+1)+' · '+f(z[0])+'–'+f(z[1])+' bpm</b> ('+z[0]+'–'+z[1]+'%)<br>'+T(z[2],z[3])+'</div>'}).join('');
 });$('panel').oninput();
};
/* ---- Ôn tập cách quãng ---- */
PXR.spaced=function(){
 var GAP=[1,3,7,14,30],fd=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
 function load(){var s=ls('spaced');return s&&Array.isArray(s.items)?s:{items:[]}}
 function pu(x){var p=String(x).split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])}
 function draw(){
  var s=load(),now=new Date(),td=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()),L=$('sp-l');
  var a=s.items.map(function(it,i){return{it:it,i:i,due:pu(it.d)+GAP[it.s]*864e5}}).sort(function(x,y){return x.due-y.due});
  if(!a.length){L.innerHTML='<div class="nm">'+T('Chưa có mục nào. Thêm nội dung bạn vừa học, app sẽ nhắc ôn sau 1, 3, 7, 14 và 30 ngày.','Nothing yet. Add what you just learned and you will be reminded after 1, 3, 7, 14 and 30 days.')+'</div>';return}
  L.innerHTML=a.map(function(x){var df=Math.round((x.due-td)/864e5),dd=new Date(x.due),st=df<0?T('trễ '+(-df)+' ngày','late by '+(-df)+' d'):df===0?T('hôm nay','today'):T('còn '+df+' ngày','in '+df+' d'),col=df<=0?'var(--stop)':'var(--muted)';
   return '<div class="card" style="display:block"><div style="font-weight:700">'+ntr(x.it.n)+'</div><div class="nm" style="color:'+col+'">'+T('Ôn lần ','Review ')+(x.it.s+1)+'/5 · '+st+' ('+dd.getUTCDate()+'/'+(dd.getUTCMonth()+1)+')</div><div class="row" style="margin:8px 0 0"><button type="button" data-ok="'+x.i+'">'+T('Đã ôn','Reviewed')+'</button><button type="button" data-del="'+x.i+'">'+T('Xóa','Delete')+'</button></div></div>'}).join('');
 }
 mount('<div class="row">'+fld(T('Nội dung vừa học','What you studied'),'sp-n','','maxlength="60"')+fld(T('Ngày học','Date studied'),'sp-d',fd(new Date()),'type="date"')+'<button type="button" id="sp-a">'+T('Thêm','Add')+'</button></div><div id="sp-l"></div><div class="nm" style="margin-top:10px">'+T('Mỗi lần ôn xong, lần sau cách xa hơn: 1, 3, 7, 14 rồi 30 ngày, tính từ lần ôn gần nhất. Đây là gợi ý, bạn ôn sớm hơn cũng được.','Each review pushes the next one further: 1, 3, 7, 14, then 30 days from your last review. A suggestion only, reviewing earlier is fine.')+'</div>',null,function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b)return;var s=load();
  if(b.id==='sp-a'){var n=($('sp-n').value||'').trim(),d=$('sp-d').value;if(!n||!d){return}if(s.items.length>=60){window.alert(T('Tối đa 60 mục. Hãy xóa bớt.','Maximum 60 items. Please delete some.'));return}s.items.push({n:n.slice(0,60),d:d,s:0});$('sp-n').value=''}
  else if(b.hasAttribute('data-ok')){var i=parseInt(b.getAttribute('data-ok'),10),it=s.items[i];if(!it)return;it.s++;it.d=fd(new Date());if(it.s>=GAP.length){s.items.splice(i,1)}}
  else if(b.hasAttribute('data-del')){var j=parseInt(b.getAttribute('data-del'),10);if(!s.items[j])return;if(!window.confirm(T('Xóa mục này?','Delete this item?')))return;s.items.splice(j,1)}
  else return;
  ls('spaced',s);draw();
 });
 draw();
};
/* ---- Giờ xuất phát ---- */
PXR.leave=function(){
 var s=ls('leave')||{t:'08:00',m:30,b:10,p:30};
 mount('<div class="row">'+fld(T('Cần đến lúc','Arrive by'),'lv-t',s.t,'type="time"')+fld(T('Thời gian di chuyển (phút)','Travel time (min)'),'lv-m',s.m,'inputmode="numeric"')+'</div><div class="row">'+fld(T('Dự phòng kẹt xe, tìm chỗ (phút)','Buffer for delays (min)'),'lv-b',s.b,'inputmode="numeric"')+fld(T('Chuẩn bị trước khi đi (phút)','Getting ready (min)'),'lv-p',s.p,'inputmode="numeric"')+'</div><div class="card" id="lv-o"></div><div class="nm">'+T('Tính ngược từ giờ cần đến. Hãy dự phòng nhiều hơn khi đi giờ cao điểm hoặc trời mưa.','Worked backwards from your arrival time. Allow more in rush hour or rain.')+'</div>',function(){
  var t=$('lv-t').value,o=$('lv-o'),m=Math.max(0,parseFloat($('lv-m').value)||0),b=Math.max(0,parseFloat($('lv-b').value)||0),p=Math.max(0,parseFloat($('lv-p').value)||0);
  var q=t.split(':');if(q.length<2||isNaN(+q[0])){o.textContent=T('Chọn giờ cần đến.','Choose an arrival time.');return}
  ls('leave',{t:t,m:m,b:b,p:p});
  var A=(+q[0])*60+(+q[1]),L=A-m-b,P=L-p,two=function(n){return(n<10?'0':'')+n},fm=function(x){var d=Math.floor(x/1440);x=((x%1440)+1440)%1440;return two(Math.floor(x/60))+':'+two(x%60)+(d<0?T(' (hôm trước)',' (day before)'):'')};
  var n=new Date(),nm=n.getHours()*60+n.getMinutes(),left=L-nm,msg='';
  if(L>=0&&P<=1439){msg=left>0?'<div class="nm">'+T('Bây giờ còn ','Now: ')+left+T(' phút nữa đến giờ xuất phát.',' min until you should leave.')+'</div>':'<div class="nm" style="color:var(--stop)">'+T('Đã quá giờ xuất phát ','Past leave time by ')+(-left)+T(' phút.',' min.')+'</div>'}
  o.innerHTML='<div class="big">🚗 '+T('Xuất phát lúc ','Leave at ')+fm(L)+'</div><div class="nm">'+T('Bắt đầu chuẩn bị lúc ','Start getting ready at ')+'<b>'+fm(P)+'</b></div><div class="nm">'+T('Đến nơi lúc ','Arrive at ')+fm(A)+'</div>'+msg;
 });$('panel').oninput();
};
/* ---- Đếm lần ---- */
PXR.tally=function(){
 function load(){var s=ls('tally')||{};return{n:s.n||0,t:s.t||20,sets:Array.isArray(s.sets)?s.sets:[]}}
 function draw(){
  var s=load(),tot=s.sets.reduce(function(a,b){return a+b},0);
  $('tl-o').innerHTML='<div class="big" style="font-size:56px;text-align:center">'+s.n+'</div><div class="nm" style="text-align:center">'+T('Mục tiêu ','Target ')+s.t+(s.n>=s.t?' 🎉':'')+'</div>'+(s.sets.length?'<div class="nm" style="margin-top:10px"><b>'+T('Các hiệp','Sets')+'</b>: '+s.sets.map(function(x,i){return (i+1)+': '+x}).join(' · ')+' · '+T('tổng ','total ')+(tot+s.n)+'</div>':'');
 }
 var s0=load();
 mount('<button type="button" id="tl-p" style="width:100%;min-height:110px;font-size:40px;font-weight:800;border-radius:22px;border:0;background:var(--go);color:var(--go-ink)">+1</button><div class="card" id="tl-o" style="display:block"></div><div class="row"><button type="button" id="tl-m">−1</button><button type="button" id="tl-s">'+T('Lưu hiệp','Save set')+'</button><button type="button" id="tl-r">'+T('Làm lại','Reset')+'</button></div><div class="row">'+fld(T('Mục tiêu mỗi hiệp','Target per set'),'tl-t',s0.t,'inputmode="numeric"')+'</div><div class="nm">'+T('Dùng để đếm số lần hít đất, gập bụng, vòng nhảy dây... Bấm Lưu hiệp để chốt một hiệp và đếm tiếp hiệp mới.','Count push-ups, sit-ups, jump-rope rounds... Tap Save set to finish a set and start a new one.')+'</div>',function(e){
  if(e&&e.target&&e.target.id==='tl-t'){var g=parseInt($('tl-t').value,10);if(g>0&&g<=9999){var s=load();s.t=g;ls('tally',s)}}
  draw();
 },function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b)return;var s=load();
  if(b.id==='tl-p'){s.n++;try{if(navigator.vibrate&&s.n===s.t)navigator.vibrate(60)}catch(x){}}
  else if(b.id==='tl-m'){s.n=Math.max(0,s.n-1)}
  else if(b.id==='tl-s'){if(s.n>0){s.sets.push(s.n);s.n=0;if(s.sets.length>40)s.sets.shift()}}
  else if(b.id==='tl-r'){if((s.n||s.sets.length)&&!window.confirm(T('Xóa số đếm và các hiệp?','Clear the count and all sets?')))return;s.n=0;s.sets=[]}
  else return;
  ls('tally',s);draw();
 });
 draw();
};


/* ---- Chuỗi thói quen (có lịch tháng để xem lại và bù ngày) ---- */
function calCss(){if($('cal-css'))return;var s=document.createElement('style');s.id='cal-css';s.textContent=
'.calh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:10px 0 6px}.calh button{min-width:40px;min-height:40px;padding:4px 10px}.calh b{flex:1;text-align:center}'+
'.calw,.calg{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}.calw span{text-align:center;font-size:12px;opacity:.65;padding:2px 0}'+
'.calg button,.calg i{aspect-ratio:1;min-height:36px;padding:0;border-radius:8px;font-size:13px;font-style:normal;display:flex;align-items:center;justify-content:center}.calg i{background:transparent}'+
'.calg button.on{background:#2dbe9d;color:#04231c;font-weight:700}.calg button.td{outline:2px solid var(--ink);outline-offset:1px}.calg button.fu{opacity:.35}.calg button.l1{background:color-mix(in srgb,var(--go) 28%,var(--surface))}.calg button.l2{background:color-mix(in srgb,var(--go) 52%,var(--surface))}.calg button.l3{background:color-mix(in srgb,var(--go) 76%,var(--surface))}.calg button.l4{background:var(--go);color:#04231c}.calg button.hit{box-shadow:inset 0 0 0 2px var(--go)}.calg button.sel{outline:2px solid var(--ink);outline-offset:1px}';
document.head.appendChild(s)}
window.CAL.css=calCss;
PXR.habit=function(){
  calCss();
  var H=ls('habits')||[],op=-1,cm=new Date();cm=new Date(cm.getFullYear(),cm.getMonth(),1);
  function save(){ls('habits',H)}
  function streak(d){var s=0,t=new Date();t.setHours(12);var k=CAL.key;if(d.indexOf(k(t))<0)t.setDate(t.getDate()-1);while(d.indexOf(k(t))>=0){s++;t.setDate(t.getDate()-1)}return s}
  function best(d){var a=d.slice().sort(),b=0,r=0,pv=null;a.forEach(function(x){var t=new Date(x+'T12:00:00');if(pv&&Math.round((t-pv)/864e5)===1)r++;else r=1;if(r>b)b=r;pv=t});return b}
  function calHtml(h,i){
    var y=cm.getFullYear(),m=cm.getMonth(),cells=CAL.cells(y,m),td=today(),n=0;
    var g=cells.map(function(c){if(!c)return '<i></i>';var k=CAL.key(c),on=h.d.indexOf(k)>=0;if(on)n++;return '<button type="button" data-d="'+k+'" data-i="'+i+'" class="'+(on?'on ':'')+(k===td?'td ':'')+(k>td?'fu':'')+'">'+c.getDate()+'</button>'}).join('');
    return '<div style="width:100%"><div class="calh"><button type="button" data-m="-1">◀</button><b>'+CAL.title(y,m)+'</b><button type="button" data-m="1">▶</button></div><div class="calw">'+CAL.wk().map(function(w){return '<span>'+w+'</span>'}).join('')+'</div><div class="calg">'+g+'</div><div class="nm" style="margin-top:6px">'+T('Tháng này: ','This month: ')+n+' '+T('ngày','days')+' · '+T('Dài nhất: ','Best: ')+best(h.d)+' '+T('ngày liên tiếp','day streak')+'. '+T('Bấm vào ngày để đánh dấu hoặc bỏ đánh dấu (kể cả ngày đã qua).','Tap a day to mark or unmark it (past days too).')+'</div></div>';
  }
  function draw(){
    var td=today();mount('<div class="row">'+fld(T('Thói quen mới','New habit'),'hb-n','','maxlength="40" autocomplete="off"')+'<button id="hb-add" type="button">'+T('Thêm','Add')+'</button></div>'+
    (H.length?H.map(function(h,i){var on=h.d.indexOf(td)>=0;return '<div class="card" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:8px 0"><div style="flex:1;min-width:0"><b>'+esc(h.n)+'</b><div class="nm">🔥 '+streak(h.d)+' '+T('ngày liên tiếp','day streak')+' · '+h.d.length+' '+T('lần','total')+'</div></div><button type="button" data-t="'+i+'">'+(on?'✓ '+T('Xong','Done'):T('Hôm nay','Today'))+'</button><button type="button" data-c="'+i+'" aria-label="'+T('Lịch','Calendar')+'" aria-pressed="'+(op===i)+'">📅</button><button type="button" data-x="'+i+'" aria-label="'+T('Xoá','Delete')+'">✕</button>'+(op===i?calHtml(h,i):'')+'</div>'}).join(''):'<div class="card">'+T('Chưa có thói quen nào. Thêm một việc bạn muốn làm mỗi ngày, rồi bấm "Hôm nay" khi hoàn thành.','No habits yet. Add something you want to do daily, then tap "Today" when done.')+'</div>'),null,function(e){
      var b=e.target.closest('button');if(!b)return;
      if(b.id==='hb-add'){var n=$('hb-n').value.trim();if(n){H.push({n:n,d:[]});save();draw()}}
      else if(b.hasAttribute('data-d')){var h=H[+b.getAttribute('data-i')],k=b.getAttribute('data-d'),j=h.d.indexOf(k);if(k>td)return;if(j<0)h.d.push(k);else h.d.splice(j,1);save();draw()}
      else if(b.hasAttribute('data-m')){cm=new Date(cm.getFullYear(),cm.getMonth()+(+b.getAttribute('data-m')),1);draw()}
      else if(b.hasAttribute('data-t')){var h2=H[+b.getAttribute('data-t')],k2=h2.d.indexOf(td);if(k2<0)h2.d.push(td);else h2.d.splice(k2,1);save();draw()}
      else if(b.hasAttribute('data-c')){var ci=+b.getAttribute('data-c');op=op===ci?-1:ci;cm=new Date(new Date().getFullYear(),new Date().getMonth(),1);draw()}
      else if(b.hasAttribute('data-x')&&confirm(T('Xoá thói quen này?','Delete this habit?'))){H.splice(+b.getAttribute('data-x'),1);op=-1;save();draw()}
    });
  }draw();
};

/* ---- Mặt trời mọc, lặn ---- */
var CITY=[['Hà Nội','Hanoi',21.03,105.85],['TP. Hồ Chí Minh','Ho Chi Minh City',10.78,106.70],['Đà Nẵng','Da Nang',16.05,108.22],['Hải Phòng','Hai Phong',20.86,106.68],['Huế','Hue',16.46,107.59],['Nha Trang','Nha Trang',12.24,109.19],['Đà Lạt','Da Lat',11.94,108.44],['Cần Thơ','Can Tho',10.03,105.78]];
function sunT(lat,lon,y,m,d,rise){var r=Math.PI/180,N=Math.floor((Date.UTC(y,m-1,d)-Date.UTC(y,0,0))/864e5),lh=lon/15,t=N+((rise?6:18)-lh)/24,M=0.9856*t-3.289,L=(M+1.916*Math.sin(M*r)+0.02*Math.sin(2*M*r)+282.634)%360,RA=Math.atan(0.91764*Math.tan(L*r))/r;RA=(RA+360)%360;RA=(RA+Math.floor(L/90)*90-Math.floor(RA/90)*90)/15;
  var sd=0.39782*Math.sin(L*r),cd=Math.cos(Math.asin(sd)),ch=(Math.cos(90.833*r)-sd*Math.sin(lat*r))/(cd*Math.cos(lat*r));if(ch>1||ch<-1)return null;
  var H=(rise?360-Math.acos(ch)/r:Math.acos(ch)/r)/15,Tm=H+RA-0.06571*t-6.622,ut=((Tm-lh)%24+24)%24;return((ut+7)%24)*60}
PXR.sun=function(){
  mount('<div class="row"><label>'+T('Thành phố','City')+'<select id="su-c">'+CITY.map(function(c,i){return '<option value="'+i+'"'+(ls('city')===i?' selected':'')+'>'+(EN()?c[1]:c[0])+'</option>'}).join('')+'</select></label>'+fld(T('Ngày','Date'),'su-d',today(),'type="date"')+'</div><div class="card" id="su-r"></div><div class="nm">'+T('Giờ địa phương (UTC+7), sai số vài phút.','Local time (UTC+7), a few minutes margin.')+'</div>',function(){
    var c=CITY[+$('su-c').value],d=pdate($('su-d').value);ls('city',+$('su-c').value);if(!d){$('su-r').textContent=T('Chọn ngày hợp lệ.','Choose a valid date.');return}
    var a=sunT(c[2],c[3],d.y,d.m,d.d,1),b=sunT(c[2],c[3],d.y,d.m,d.d,0);if(a===null||b===null){$('su-r').textContent='—';return}
    var f=function(x){x=Math.round(x);return pad(Math.floor(x/60)%24)+':'+pad(x%60)};
    $('su-r').innerHTML='<div class="big">🌅 '+f(a)+' &nbsp; 🌇 '+f(b)+'</div><div class="nm">'+T('Ngày dài ','Daylight ')+Math.floor((b-a)/60)+' '+T('giờ','h')+' '+Math.round((b-a)%60)+' '+T('phút','min')+'</div><div class="nm">'+T('Giờ vàng chụp ảnh: ','Golden hour: ')+f(a)+'–'+f(a+60)+' · '+f(b-60)+'–'+f(b)+'</div>';
  });$('panel').oninput();
};
/* ---- Máy gõ nhịp: phách mạnh nhẹ tuỳ chỉnh, chia nhịp, 4 âm sắc, tăng tốc dần ---- */
function mtCss(){if($('mt-css'))return;var s=document.createElement('style');s.id='mt-css';s.textContent=
'.mtb{min-width:44px;min-height:44px;border-radius:50%;font-size:20px;padding:0;margin:3px}.mtb.s2{outline:2px solid #2dbe9d}.mtb.s0{opacity:.4}.mtb.on{background:#2dbe9d;color:#04231c}'+
'.mtp{position:relative;height:24px;margin:10px 8px;border-radius:12px;background:rgba(127,127,127,.2)}.mtp i{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#2dbe9d}'+
'.mtr{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin:8px 0}.mtr button{min-height:40px;padding:6px 12px}.mtr button[aria-pressed="true"]{background:var(--ink);color:var(--bg)}';
document.head.appendChild(s)}
var TSIG=[['2/4',[2,1]],['3/4',[2,1,1]],['4/4',[2,1,1,1]],['5/4',[2,1,1,2,1]],['6/8',[2,1,1,2,1,1]]];
function tname(b){return b<40?'Grave':b<60?'Largo':b<66?'Larghetto':b<76?'Adagio':b<108?'Andante':b<120?'Moderato':b<156?'Allegro':b<176?'Vivace':b<200?'Presto':'Prestissimo'}
PXR.metro=function(){
  stop();mtCss();
  var S=ls('metro')||{},D={bpm:100,bt:4,sub:1,snd:'click',vol:0.8,hap:false,tr:false,ts:5,tb:4,tm:160};
  for(var k in D)if(S[k]===undefined)S[k]=D[k];
  var on=false,ctx=null,nx=0,step=0,bars=0,timer=null,taps=[],flip=0,cur=-1;
  function save(){ls('metro',S)}
  function fix(){var a=S.acc||[];while(a.length<S.bt)a.push(a.length?1:2);a.length=S.bt;S.acc=a}
  function dots(){fix();return S.acc.map(function(a,i){return '<button type="button" class="mtb s'+a+(i===cur?' on':'')+'" data-i="'+i+'" aria-label="'+T('Phách ','Beat ')+(i+1)+'">'+(a===2?'●':a===1?'○':'·')+'</button>'}).join('')}
  function opts(arr,v){return arr.map(function(x){return '<option value="'+x[0]+'"'+(String(x[0])===String(v)?' selected':'')+'>'+x[1]+'</option>'}).join('')}
  function nums(n){var r=[];for(var i=1;i<=n;i++)r.push([i,i]);return r}
  function upd(){var b=$('mt-b');if(b)b.textContent=S.bpm;var n=$('mt-n');if(n)n.textContent=tname(S.bpm);var sl=$('mt-s');if(sl)sl.value=S.bpm}
  function render(){
    fix();
    mount('<div class="card" style="text-align:center"><div id="mt-b" class="big" style="font-size:64px"></div><div class="nm" id="mt-n"></div><div class="mtp"><i id="mt-p"></i></div><div id="mt-d">'+dots()+'</div></div>'+
    '<div class="mtr"><button type="button" id="mt-m5">−5</button><button type="button" id="mt-m1">−1</button><input id="mt-s" type="range" aria-label="Tốc độ (BPM)" min="30" max="240" value="'+S.bpm+'" style="flex:1;min-width:100px"><button type="button" id="mt-p1">+1</button><button type="button" id="mt-p5">+5</button></div>'+
    '<div class="mtr">'+TSIG.map(function(x){return '<button type="button" data-ts="'+x[0]+'">'+x[0]+'</button>'}).join('')+'</div>'+
    '<div class="mtr"><label>'+T('Số phách','Beats')+'<select id="mt-bt">'+opts(nums(12),S.bt)+'</select></label><label>'+T('Chia nhỏ','Subdivide')+'<select id="mt-u">'+opts([[1,'♩'],[2,'♪♪'],[3,'♪♪♪'],[4,'♬♬']],S.sub)+'</select></label><label>'+T('Âm sắc','Sound')+'<select id="mt-w">'+opts([['click',T('Tích tắc','Click')],['wood',T('Gỗ','Wood')],['drum',T('Trống','Drum')],['bell',T('Chuông','Bell')]],S.snd)+'</select></label></div>'+
    '<div class="mtr"><label style="flex:1;min-width:140px">'+T('Âm lượng','Volume')+'<input id="mt-v" type="range" min="0.1" max="1" step="0.05" value="'+S.vol+'"></label><button type="button" id="mt-hp" aria-pressed="'+!!S.hap+'">📳 '+T('Rung','Haptics')+'</button><button type="button" id="mt-tr" aria-pressed="'+!!S.tr+'">🚀 '+T('Tăng tốc dần','Speed up')+'</button></div>'+
    (S.tr?'<div class="mtr"><label>+BPM<input id="mt-ts" value="'+S.ts+'" inputmode="numeric" style="width:64px"></label><label>'+T('mỗi (ô nhịp)','every (bars)')+'<input id="mt-tb" value="'+S.tb+'" inputmode="numeric" style="width:64px"></label><label>'+T('tối đa','max')+'<input id="mt-tm" value="'+S.tm+'" inputmode="numeric" style="width:72px"></label></div>':'')+
    '<div class="mtr"><button id="mt-g" type="button">'+(on?'■ '+T('Dừng','Stop'):'▶ '+T('Bắt đầu','Start'))+'</button><button id="mt-t" type="button">'+T('Gõ nhịp','Tap tempo')+'</button></div>'+
    '<div class="nm">'+T('Bấm vào từng chấm để đổi phách: ● mạnh, ○ thường, · tắt tiếng.','Tap each dot to change the beat: ● strong, ○ normal, · muted.')+'</div>',
    function(e){
      var id=e.target.id,v=e.target.value;
      if(id==='mt-s'){S.bpm=+v;upd()}
      else if(id==='mt-v')S.vol=+v;
      else if(id==='mt-bt'){S.bt=+v;fix();var d=$('mt-d');if(d)d.innerHTML=dots()}
      else if(id==='mt-u')S.sub=+v;
      else if(id==='mt-w')S.snd=v;
      else if(id==='mt-ts')S.ts=Math.max(1,Math.min(40,parseInt(v,10)||5));
      else if(id==='mt-tb')S.tb=Math.max(1,Math.min(64,parseInt(v,10)||4));
      else if(id==='mt-tm')S.tm=Math.max(40,Math.min(240,parseInt(v,10)||160));
      save();
    },function(e){
      var b=e.target.closest('button');if(!b)return;var id=b.id,ts=b.getAttribute('data-ts'),di=b.getAttribute('data-i');
      var nudge={'mt-m5':-5,'mt-m1':-1,'mt-p1':1,'mt-p5':5};
      if(id in nudge){S.bpm=Math.max(30,Math.min(240,S.bpm+nudge[id]));upd();save()}
      else if(ts){TSIG.forEach(function(x){if(x[0]===ts){S.acc=x[1].slice();S.bt=x[1].length}});save();render()}
      else if(di!==null){var a=S.acc[+di];S.acc[+di]=a===2?1:a===1?0:2;save();var d=$('mt-d');if(d)d.innerHTML=dots()}
      else if(id==='mt-hp'){S.hap=!S.hap;save();render()}
      else if(id==='mt-tr'){S.tr=!S.tr;save();render()}
      else if(id==='mt-t'){var n=Date.now();if(taps.length&&n-taps[taps.length-1]>2000)taps=[];taps.push(n);if(taps.length>1){S.bpm=Math.max(30,Math.min(240,Math.round(60000/((taps[taps.length-1]-taps[0])/(taps.length-1)))));upd();save()}}
      else if(id==='mt-g'){on?halt():go()}
    });
    upd();
  }
  function play(t,strong,sub){
    var o=ctx.createOscillator(),g=ctx.createGain(),v=Math.max(0.001,S.vol*(sub?0.35:1)*(strong?1:0.75)),f,d;
    if(S.snd==='wood'){o.type='triangle';f=strong?1100:800;d=0.06}
    else if(S.snd==='drum'){o.type='sine';f=strong?180:130;d=0.14}
    else if(S.snd==='bell'){o.type='sine';f=strong?1320:880;d=0.45}
    else{o.type='sine';f=strong?1500:1000;d=0.05}
    if(sub)f*=1.25;
    if(S.snd==='drum'){o.frequency.setValueAtTime(f*1.8,t);o.frequency.exponentialRampToValueAtTime(f*0.5,t+d)}else o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.003);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+d+0.02);
  }
  function hit(b,strong){
    cur=b;var d=$('mt-d');if(d)d.innerHTML=dots();
    var p=$('mt-p');if(p){p.style.transition='left '+(60/S.bpm)+'s linear';p.style.left=(flip++%2)?'2px':'calc(100% - 22px)'}
    if(S.hap){try{if(navigator.vibrate)navigator.vibrate(strong?40:20)}catch(e){}}
    upd();
  }
  function go(){
    try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();ctx.resume()}catch(e){return}
    on=true;step=0;bars=0;cur=-1;nx=ctx.currentTime+0.06;var g=$('mt-g');if(g)g.textContent='■ '+T('Dừng','Stop');
    try{if(window.NA)window.NA.hold('metro',true)}catch(e){}
    timer=setInterval(function(){
      if(!$('mt-g')){halt();return}
      while(nx<ctx.currentTime+0.12){
        var beat=Math.floor(step/S.sub)%S.bt,sp=step%S.sub,a=S.acc[beat];
        if(a>0)play(nx,a===2,sp>0);
        if(sp===0){
          (function(b,t,st){setTimeout(function(){if(on)hit(b,st)},Math.max(0,(t-ctx.currentTime)*1000))})(beat,nx,a===2);
          if(beat===0){bars++;if(S.tr&&bars>1&&(bars-1)%S.tb===0&&S.bpm<S.tm){S.bpm=Math.min(S.tm,S.bpm+S.ts);save()}}
        }
        nx+=60/S.bpm/S.sub;step++;
      }
    },25);
    window.__mt=halt;
  }
  function halt(){
    on=false;clearInterval(timer);cur=-1;var g=$('mt-g');if(g)g.textContent='▶ '+T('Bắt đầu','Start');
    var d=$('mt-d');if(d)d.innerHTML=dots();
    try{if(window.NA)window.NA.hold('metro',false)}catch(e){}
    window.__mt=null;
  }
  render();
  window.MTR={toggle:function(){on?halt():go()},nudge:function(d){S.bpm=Math.max(30,Math.min(240,S.bpm+d));upd();save();var s2=$('mt-s');if(s2)s2.value=S.bpm},tap:function(){var n=Date.now();if(taps.length&&n-taps[taps.length-1]>2000)taps=[];taps.push(n);if(taps.length>1){S.bpm=Math.max(30,Math.min(240,Math.round(60000/((taps[taps.length-1]-taps[0])/(taps.length-1)))));upd();save()}}};
};
/* ---- Nhạc của tôi: bản trình duyệt (lưu trong IndexedDB) và bản gốc Android (chạy nền, điều khiển ở thanh thông báo) ---- */
var MU=(function(){
  var S=ls('mus')||{};var D={vol:0.7,rep:'all',shuf:false,link:false};for(var k in D)if(S[k]===undefined)S[k]=D[k];
  var TR=[],curId=null,A=null,url=null,loaded=false,linkWas=false,idbp=null,waits=[],adding=false,st={playing:false,idx:-1,pos:0,dur:0},lastErr='',permS='';
  function ask(){try{if(window.NA&&window.NA.ask)window.NA.ask()}catch(e){}}
  function em(e){return String((e&&e.message)||e)}
  function NB(){try{var C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.BgMusic||null}catch(e){return null}}
  function save(){ls('mus',S)}
  function done(){loaded=true;var w=waits;waits=[];w.forEach(function(f){try{f()}catch(e){}})}
  function ready(f){if(loaded)f();else waits.push(f)}
  function gv(){return Math.max(0,Math.min(1,S.vol*(window.vol==null?1:window.vol)))}
  /* --- bản gốc Android --- */
  function nsave(){ls('musnat',TR.map(function(t){return {uri:t.uri,name:t.name,size:t.size}}))}
  function nsync(){var n=NB();if(!n)return;try{n.setQueue({items:TR.map(function(t){return {uri:t.uri,name:t.name}})}).catch(function(){});n.setMode({shuffle:!!S.shuf,repeat:S.rep}).catch(function(){})}catch(e){}}
  function npoll(){var n=NB();if(!n)return Promise.resolve();return n.state().then(function(r){if(r)st=r}).catch(function(e){lastErr=em(e)})}
  function ncmd(o){var n=NB();if(!n)return Promise.resolve();if(o.cmd!=='pause'&&o.cmd!=='seek')ask();return n.cmd(o).then(npoll).catch(function(e){lastErr=em(e)})}
  /* --- bản trình duyệt --- */
  function db(){if(idbp)return idbp;idbp=new Promise(function(res,rej){try{var r=indexedDB.open('bgmusic',1);r.onupgradeneeded=function(){r.result.createObjectStore('t',{keyPath:'id'})};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}}catch(e){rej(e)}});return idbp}
  function op(mode,fn){return db().then(function(d){return new Promise(function(res,rej){var t=d.transaction('t',mode),o=fn(t.objectStore('t'));t.oncomplete=function(){res(o&&o.result)};t.onerror=function(){rej(t.error)};t.onabort=function(){rej(t.error)}})})}
  function list(){return op('readonly',function(s){return s.getAll()}).then(function(a){TR=(a||[]).sort(function(x,y){return x.id-y.id});return TR})}
  function widx(){for(var i=0;i<TR.length;i++)if(TR[i].id===curId)return i;return -1}
  function audio(){if(!A){A=new Audio();A.preload='auto';A.addEventListener('ended',function(){if(S.rep==='one'){A.currentTime=0;A.play().catch(function(){})}else next(true)});A.addEventListener('play',meta);A.addEventListener('pause',meta)}return A}
  function meta(){try{if(!('mediaSession' in navigator))return;var t=TR[widx()];if(t&&window.MediaMetadata)navigator.mediaSession.metadata=new MediaMetadata({title:t.name,artist:'Bấm giờ'});
    var h=navigator.mediaSession;h.setActionHandler('play',function(){play()});h.setActionHandler('pause',function(){pause()});h.setActionHandler('nexttrack',function(){next(false)});h.setActionHandler('previoustrack',function(){prev()})}catch(e){}}
  /* --- giao diện chung --- */
  function idx(){return NB()?st.idx:widx()}
  function playing(){return NB()?!!st.playing:(!!A&&!A.paused&&!A.ended)}
  function pos(){return NB()?(st.pos||0)/1000:(A?A.currentTime:0)}
  function dur(){return NB()?(st.dur||0)/1000:(A&&A.duration?A.duration:0)}
  function playAt(i){
    var t=TR[i];if(!t)return Promise.resolve();
    if(NB())return ncmd({cmd:'play',index:i});
    curId=t.id;if(url){try{URL.revokeObjectURL(url)}catch(e){}}
    url=URL.createObjectURL(t.blob);var a=audio();a.src=url;a.volume=gv();
    return a.play().catch(function(){});
  }
  function play(){
    if(!loaded){ready(play);return}
    if(!TR.length)return;
    if(NB()){return ncmd({cmd:(st.idx>=0&&!st.playing)?'resume':'play',index:S.shuf?Math.floor(Math.random()*TR.length):0})}
    if(!A||curId===null||!A.src)playAt(S.shuf?Math.floor(Math.random()*TR.length):0);else A.play().catch(function(){});
  }
  function pause(){if(NB()){if(st.playing)ncmd({cmd:'pause'})}else if(A&&!A.paused)A.pause()}
  function toggle(){if(!loaded){ready(toggle);return}if(!TR.length)return;if(NB())ncmd({cmd:'toggle',index:0});else if(playing())pause();else play()}
  function next(auto){
    if(NB()){ncmd({cmd:'next'});return}
    if(!TR.length)return;var n,c=widx();
    if(S.shuf&&TR.length>1){do{n=Math.floor(Math.random()*TR.length)}while(n===c)}
    else{n=c+1;if(n>=TR.length){if(S.rep==='all'||!auto)n=0;else return}}
    playAt(n);
  }
  function prev(){if(NB()){ncmd({cmd:'prev'});return}if(!TR.length)return;if(A&&A.currentTime>3){A.currentTime=0;return}var c=widx();playAt(c>0?c-1:TR.length-1)}
  function seek(d){if(NB()){ncmd({cmd:'seek',ms:Math.max(0,Math.round((pos()+d)*1000))})}else if(A&&A.duration)A.currentTime=Math.max(0,Math.min(A.duration,A.currentTime+d))}
  function seekFrac(f){if(NB()){if(st.dur>0)ncmd({cmd:'seek',ms:Math.round(f*st.dur)})}else if(A&&A.duration)A.currentTime=f*A.duration}
  function volume(d){S.vol=Math.max(0,Math.min(1,Math.round((S.vol+d)*20)/20));save();if(A)A.volume=gv();var v=document.getElementById('mu-v');if(v)v.value=S.vol}
  function setVol(v){S.vol=v;save();if(A)A.volume=gv()}
  function mode(){save();if(NB())nsync()}
  function add(files){
    if(adding)return Promise.resolve(0);adding=true;
    var base=Date.now(),n=0,arr=Array.prototype.slice.call(files);
    return arr.reduce(function(p,f,i){return p.then(function(){
      var nm=f.name.replace(/\.[^.]+$/,'');
      if(!(f.type&&f.type.indexOf('audio')===0)&&!/\.(mp3|m4a|aac|wav|ogg|oga|flac|opus|wma)$/i.test(f.name))return;
      if(TR.some(function(t){return t.name===nm&&t.size===f.size}))return;
      return op('readwrite',function(s){return s.put({id:base+i,name:nm,type:f.type,size:f.size,blob:f})}).then(function(){n++;TR.push({id:base+i,name:nm,size:f.size,blob:f})});
    })},Promise.resolve()).then(list).then(function(){adding=false;return n},function(e){adding=false;throw e});
  }
  function pick(){var n=NB();if(!n)return Promise.resolve(0);ask();return n.pick().then(function(r){var items=(r&&r.items)||[],c=0;items.forEach(function(it){if(!TR.some(function(t){return t.uri===it.uri})){TR.push({id:it.uri,uri:it.uri,name:it.name,size:it.size});c++}});nsave();nsync();return c})}
  function removeAt(i){
    var t=TR[i];if(!t)return Promise.resolve();
    if(NB()){TR.splice(i,1);nsave();nsync();return npoll()}
    if(t.id===curId){pause();if(A){A.removeAttribute('src');A.load()}curId=null}
    return op('readwrite',function(s){return s.delete(t.id)}).then(list);
  }
  function linkTick(){
    if(!S.link||!window.engPhase)return;
    var p=window.engPhase(),want=!!(p&&p.run&&p.work);
    if(want!==linkWas){linkWas=want;if(want)play();else pause()}
  }
  function init(){
    if(init.d)return;init.d=true;
    if(NB()){
      try{TR=(ls('musnat')||[]).map(function(t){return {id:t.uri,uri:t.uri,name:t.name,size:t.size}})}catch(e){TR=[]}
      done();nsync();npoll();
      var pc=0;setInterval(function(){npoll();var n=NB();if(n)n.setVolume({v:gv()}).catch(function(){});linkTick();if(pc++%8===0&&window.NA&&window.NA.perm)window.NA.perm().then(function(p){permS=p})},700);
    }else{
      try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
      list().then(done,done);
      setInterval(function(){if(A)A.volume=gv();linkTick()},700);
    }
  }
  function diag(){return {nat:!!NB(),svc:!!st.svc,err:st.err||lastErr,perm:permS,app:document.documentElement.classList.contains('in-app')}}
  function openSet(t){var n=NB();if(!n)return Promise.reject(new Error('no'));return n.openSettings({type:t})}
  return {diag:diag,openSet:openSet,S:S,save:save,init:init,ready:ready,isReady:function(){return loaded},native:function(){return !!NB()},
    add:add,pick:pick,removeAt:removeAt,toggle:toggle,play:play,pause:pause,next:function(){next(false)},prev:prev,seek:seek,seekFrac:seekFrac,
    volume:volume,setVol:setVol,mode:mode,playAt:playAt,playing:playing,pos:pos,dur:dur,idx:idx,tracks:function(){return TR}};
})();
window.MU=MU;
document.addEventListener('DOMContentLoaded',function(){try{MU.init()}catch(e){}});
PXR.music=function(){
  MU.init();mtCss();
  var S=MU.S,nat=MU.native();
  function fmt(x){x=Math.max(0,Math.floor(x||0));return Math.floor(x/60)+':'+pad(x%60)}
  function mb(n){return n>=1048576?(n/1048576).toFixed(1)+' MB':n>0?Math.max(1,Math.round(n/1024))+' KB':''}
  var RP={all:'🔁 '+T('Cả danh sách','Repeat all'),one:'🔂 '+T('Một bài','Repeat one'),off:'➡ '+T('Không lặp','No repeat')};
  function toast(m){var t=$('toast');if(t){t.textContent=m;t.hidden=false;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');setTimeout(function(){t.hidden=true},2500)}}
  function draw(){
    var ok=MU.isReady(),tr=MU.tracks(),c=MU.idx(),now=c>=0?tr[c]:null;
    mount('<div class="card" style="text-align:center"><div id="mu-now" style="font-weight:700;font-size:18px">'+(now?esc(now.name):T('Chưa chọn bài','No track selected'))+'</div><div class="nm" id="mu-t">0:00 / 0:00</div><input id="mu-pos" type="range" aria-label="Vị trí bài hát" min="0" max="1000" value="0" style="width:100%">'+
    '<div class="mtr" style="justify-content:center"><button type="button" id="mu-pr" aria-label="Prev">⏮</button><button type="button" id="mu-pl" style="min-width:64px;font-size:22px">'+(MU.playing()?'⏸':'▶')+'</button><button type="button" id="mu-nx" aria-label="Next">⏭</button></div>'+
    '<div class="mtr" style="justify-content:center"><button type="button" id="mu-sh" aria-pressed="'+!!S.shuf+'">🔀 '+T('Ngẫu nhiên','Shuffle')+'</button><button type="button" id="mu-rp">'+RP[S.rep]+'</button></div></div>'+
    '<div class="mtr"><button type="button" id="mu-add">➕ '+T('Thêm nhạc từ máy','Add music from device')+'</button></div><input id="mu-f" type="file" accept="audio/*" multiple hidden>'+
    '<div class="mtr"><label style="flex:1;min-width:150px">'+T('Âm lượng nhạc','Music volume')+'<input id="mu-v" type="range" min="0" max="1" step="0.05" value="'+S.vol+'"></label><button type="button" id="mu-lk" aria-pressed="'+!!S.link+'">🍅 '+T('Theo Pomodoro','Follow Pomodoro')+'</button></div>'+
    (!ok?'<div class="card">'+T('Đang tải danh sách nhạc...','Loading your music...')+'</div>':tr.length?tr.map(function(t,i){return '<div class="card" style="display:flex;gap:10px;align-items:center;margin:6px 0"><button type="button" data-p="'+i+'" style="flex:1;text-align:left;min-width:0"><b>'+(i===c&&MU.playing()?'▶ ':'')+esc(t.name)+'</b><div class="nm">'+mb(t.size)+'</div></button><button type="button" data-x="'+i+'" aria-label="'+T('Xoá','Delete')+'">✕</button></div>'}).join(''):'<div class="card">'+T('Chưa có bài nào. Bấm "Thêm nhạc từ máy" để chọn file mp3, m4a, flac... trong điện thoại.','No tracks yet. Tap "Add music from device" to pick audio files.')+'</div>')+
    '<div class="card" id="mu-diag" style="font-size:13px;line-height:1.5"></div>'+(nat?'<div class="mtr"><button type="button" id="mu-bat">⚙ '+T('Cho phép chạy nền','Allow background use')+'</button><button type="button" id="mu-set">📋 '+T('Cài đặt app','App settings')+'</button></div>':'')+
    '<div class="nm">'+(nat?T('Nhạc tiếp tục phát khi bạn tắt màn hình hoặc xoá app khỏi đa nhiệm, và có nút điều khiển ở thanh thông báo và màn hình khoá. File nhạc vẫn nằm ở chỗ cũ trong máy, app chỉ nhớ đường dẫn, nên đừng xoá hoặc di chuyển file. "Theo Pomodoro" chỉ hoạt động khi app còn mở hoặc chạy nền.','Music keeps playing with the screen off or after you swipe the app away, with controls on the notification and lock screen. Files stay where they are, the app only remembers their location, so do not delete or move them. "Follow Pomodoro" only works while the app is open or in the background.'):T('Nhạc được lưu ngay trong trình duyệt, không tải lên mạng. "Theo Pomodoro": nhạc tự phát lúc làm việc và tự dừng lúc nghỉ.','Music is stored in your browser, never uploaded. "Follow Pomodoro" plays during work and pauses on breaks.'))+'</div>',
    function(e){
      var id=e.target.id;
      if(id==='mu-f'){
        if(e.type!=='change')return;
        var f=e.target.files;if(!f||!f.length)return;
        var list=Array.prototype.slice.call(f);try{e.target.value=''}catch(x){}
        MU.add(list).then(function(n){draw();toast(n>0?T('Đã thêm '+n+' bài.','Added '+n+' track(s).'):T('Các bài này đã có trong danh sách.','These tracks are already in the list.'))}).catch(function(){});
      }
      else if(id==='mu-v'){MU.setVol(+e.target.value)}
      else if(id==='mu-pos'){MU.seekFrac((+e.target.value)/1000)}
    },function(e){
      var b=e.target.closest('button');if(!b)return;var id=b.id,p=b.getAttribute('data-p'),x=b.getAttribute('data-x');
      if(id==='mu-add'){
        if(nat)MU.pick().then(function(n){draw();toast(n>0?T('Đã thêm '+n+' bài.','Added '+n+' track(s).'):T('Các bài này đã có trong danh sách.','These tracks are already in the list.'))}).catch(function(er){toast(T('Lỗi chọn nhạc: ','Pick error: ')+String((er&&er.message)||er))});
        else $('mu-f').click();
      }
      else if(id==='mu-pl'){MU.toggle();setTimeout(draw,250)}
      else if(id==='mu-nx'){MU.next();setTimeout(draw,300)}
      else if(id==='mu-pr'){MU.prev();setTimeout(draw,300)}
      else if(id==='mu-sh'){S.shuf=!S.shuf;MU.mode();draw()}
      else if(id==='mu-rp'){S.rep=S.rep==='all'?'one':S.rep==='one'?'off':'all';MU.mode();draw()}
      else if(id==='mu-lk'){S.link=!S.link;MU.save();draw()}
      else if(id==='mu-bat'){MU.openSet('battery').catch(function(er){toast(String((er&&er.message)||er))})}
      else if(id==='mu-set'){MU.openSet('app').catch(function(er){toast(String((er&&er.message)||er))})}
      else if(p!==null){MU.playAt(+p);setTimeout(draw,300)}
      else if(x!==null&&confirm(T('Xoá bài này khỏi app?','Remove this track from the app?')))MU.removeAt(+x).then(draw);
    });
  }
  if(!MU.isReady())MU.ready(function(){if($('mu-now'))draw()});
  draw();
  var tm=setInterval(function(){
    var pos=$('mu-pos');if(!pos){clearInterval(tm);return}
    var d=MU.dur(),p=MU.pos();
    if(d&&document.activeElement!==pos)pos.value=Math.round(p/d*1000);
    var t=$('mu-t');if(t)t.textContent=fmt(p)+' / '+fmt(d);
    var pl=$('mu-pl');if(pl)pl.textContent=MU.playing()?'⏸':'▶';
    var n=$('mu-now'),tr=MU.tracks(),c=MU.idx();if(n&&c>=0&&tr[c]&&n.textContent!==tr[c].name)n.textContent=tr[c].name;
    var dg=$('mu-diag');if(dg){var q=MU.diag(),h;
      if(q.nat){h='✅ '+T('Trình phát: Android, chạy nền được','Player: Android, runs in the background')+'<br>'+T('Dịch vụ nhạc: ','Music service: ')+(q.svc?T('đang chạy','running'):T('chưa chạy (sẽ chạy khi bấm phát)','not running (starts on play)'))+'<br>'+T('Thông báo: ','Notifications: ')+(q.perm==='granted'?T('đã cho phép','allowed'):q.perm==='denied'?T('BỊ CHẶN, hãy bấm Cài đặt app rồi bật Thông báo','BLOCKED, tap App settings and enable Notifications'):q.perm?q.perm:'...');}
      else if(q.app){h='⚠ '+T('Bản app này chưa có trình phát Android, nhạc sẽ dừng khi xoá đa nhiệm. Hãy cài APK mới nhất ở mục Releases.','This app build has no Android player, so music stops when the app is swiped away. Install the latest APK from Releases.')}
      else{h='ℹ '+T('Đang dùng trình phát của trình duyệt: nhạc dừng khi đóng trang. Cài app Android để nghe nền.','Using the browser player: music stops when the page is closed. Install the Android app for background playback.')}
      if(q.err)h+='<br>⚠ '+T('Lỗi: ','Error: ')+esc(q.err);
      if(dg.getAttribute('data-h')!==h){dg.setAttribute('data-h',h);dg.innerHTML=h}}
  },500);
};
/* ---- Ghi giờ theo công việc (gắn với thống kê, lịch và thông báo) ---- */
var TK={
  run:function(){return ls('trk-run')},
  list:function(){return ls('trk')||[]},
  start:function(name){ls('trk-run',{t:name,s:Date.now()})},
  stop:function(save){
    var r=ls('trk-run');if(!r)return;ls('trk-run',null);
    if(save===false)return;
    var e=Date.now();if(e-r.s<5000)return;
    var L=TK.list();L.push({t:r.t,s:r.s,e:e});if(L.length>1500)L=L.slice(-1500);ls('trk',L);
    if(window.logStat&&e-r.s>=20000)window.logStat('track',e-r.s);
  }
};
window.TK=TK;
function hms3(ms){ms=Math.max(0,Math.floor(ms/1000));var h=Math.floor(ms/3600),m=Math.floor(ms%3600/60),s2=ms%60;return h+':'+pad(m)+':'+pad(s2)}
function hm2(ms){var m=Math.round(ms/60000);return m>=60?Math.floor(m/60)+T(' giờ ',' h ')+(m%60)+T(' phút',' min'):m+T(' phút',' min')}
PXR.track=function(){
  var tm=null;
  function draw(){
    var L=TK.list(),run=TK.run(),td=new Date().toDateString(),now=Date.now();
    var tdy=L.filter(function(e){return new Date(e.s).toDateString()===td}).sort(function(a,b){return b.s-a.s});
    var from=new Date();from.setHours(0,0,0,0);from=from.getTime()-6*864e5;
    var by={};L.forEach(function(e){if(e.s>=from)by[e.t]=(by[e.t]||0)+(e.e-e.s)});
    var tot=Object.keys(by).map(function(k){return [k,by[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,6),mx=tot.length?tot[0][1]:1;
    var recent=[],seen={};L.slice().reverse().forEach(function(e){if(!seen[e.t]&&recent.length<5){seen[e.t]=1;recent.push(e.t)}});
    var sumToday=tdy.reduce(function(a,e){return a+(e.e-e.s)},0)+(run?now-run.s:0);
    mount((run?'<div class="card" style="text-align:center"><div class="nm">⏺ '+esc(run.t)+'</div><div class="big" id="tk-el" style="font-size:52px">'+hms3(now-run.s)+'</div><div class="mtr" style="justify-content:center"><button type="button" id="tk-stop">⏹ '+T('Dừng và lưu','Stop and save')+'</button><button type="button" id="tk-x">'+T('Huỷ phiên này','Discard')+'</button></div></div>'
      :'<div class="row"><label style="flex:1;min-width:160px">'+T('Bạn đang làm gì?','What are you working on?')+'<input id="tk-n" list="tk-dl" maxlength="40" autocomplete="off" placeholder="'+T('Học bài, đọc sách, làm báo cáo...','Study, reading, report...')+'"></label><button type="button" id="tk-go">▶ '+T('Bắt đầu','Start')+'</button></div><datalist id="tk-dl">'+recent.map(function(r){return '<option value="'+esc(r)+'">'}).join('')+'</datalist>'+(recent.length?'<div class="mtr">'+recent.map(function(r,i){return '<button type="button" data-q="'+i+'">'+esc(r)+'</button>'}).join('')+'</div>':''))+
      '<div class="nm" style="margin-top:8px"><b>'+T('Hôm nay: ','Today: ')+hm2(sumToday)+'</b></div>'+
      (tdy.length?tdy.map(function(e){var a=new Date(e.s),b=new Date(e.e);return '<div class="card" style="display:flex;gap:10px;align-items:center;margin:6px 0"><div style="flex:1;min-width:0"><b>'+esc(e.t)+'</b><div class="nm">'+pad(a.getHours())+':'+pad(a.getMinutes())+' → '+pad(b.getHours())+':'+pad(b.getMinutes())+' · '+hm2(e.e-e.s)+'</div></div><button type="button" data-x="'+e.s+'" aria-label="'+T('Xoá','Delete')+'">✕</button></div>'}).join(''):'<div class="card">'+T('Hôm nay chưa có phiên nào được lưu.','No saved sessions today.')+'</div>')+
      (tot.length?'<div class="nm" style="margin-top:12px"><b>'+T('7 ngày qua theo công việc','Last 7 days by task')+'</b></div>'+tot.map(function(r){return '<div style="margin:6px 0"><div style="display:flex;justify-content:space-between;font-size:14px"><span>'+esc(r[0])+'</span><b>'+hm2(r[1])+'</b></div><div class="gbar" style="height:8px;margin:3px 0"><i style="width:'+Math.max(4,r[1]/mx*100).toFixed(0)+'%"></i></div></div>'}).join(''):'')+
      '<div class="nm">'+T('Mỗi phiên được lưu vào Thống kê và Lịch. Khi đang ghi, thanh thông báo hiện số giờ và nút dừng.','Each session is added to Stats and the calendar. While tracking, the notification shows the time and a stop button.')+'</div>',
      null,function(e){
        var b=e.target.closest('button');if(!b)return;var id=b.id,q=b.getAttribute('data-q'),x=b.getAttribute('data-x');
        if(id==='tk-go'){var n=($('tk-n').value||'').trim()||T('Công việc','Task');TK.start(n);draw()}
        else if(q!==null){TK.start(recent[+q]);draw()}
        else if(id==='tk-stop'){TK.stop(true);draw();var t=$('toast');if(t){t.textContent=T('Đã lưu phiên làm việc.','Session saved.');t.hidden=false;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');setTimeout(function(){t.hidden=true},2200)}}
        else if(id==='tk-x'){if(confirm(T('Bỏ phiên đang ghi, không lưu?','Discard this session without saving?'))){TK.stop(false);draw()}}
        else if(x!==null&&confirm(T('Xoá phiên này?','Delete this session?'))){ls('trk',TK.list().filter(function(e2){return String(e2.s)!==x}));draw()}
      });
    clearInterval(tm);
    tm=setInterval(function(){var el=$('tk-el');if(!el){clearInterval(tm);return}var r=TK.run();if(r)el.textContent=hms3(Date.now()-r.s)},1000);
  }
  draw();
};
setInterval(function(){try{
  if(!window.NA||!window.NA.on)return;
  var r=TK.run();
  window.NA.live('trk',r?[{key:'trk',id:9200,title:T('Ghi giờ','Time tracker'),text:r.t,when:r.s,countdown:false,paused:false,pauseOn:true,next:''}]:[]);
  window.NA.hold('trk',!!r);
}catch(e){}},1500);
if(window.NA&&window.NA.h)window.NA.h.trk=function(act){TK.stop(true);if(curM()==='track')PXR.track()};
/* ---- Giờ họp chung: tìm khung giờ phù hợp giữa nhiều múi giờ ---- */
var ZN=[['Hà Nội','Hanoi','Asia/Ho_Chi_Minh'],['Bangkok','Bangkok','Asia/Bangkok'],['Singapore','Singapore','Asia/Singapore'],['Bắc Kinh','Beijing','Asia/Shanghai'],['Tokyo','Tokyo','Asia/Tokyo'],['Seoul','Seoul','Asia/Seoul'],['Sydney','Sydney','Australia/Sydney'],['Mumbai','Mumbai','Asia/Kolkata'],['Dubai','Dubai','Asia/Dubai'],['Moscow','Moscow','Europe/Moscow'],['Paris','Paris','Europe/Paris'],['London','London','Europe/London'],['New York','New York','America/New_York'],['Chicago','Chicago','America/Chicago'],['Los Angeles','Los Angeles','America/Los_Angeles']];
function tzOff(ts,tz){
  var p=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(new Date(ts)),o={};
  p.forEach(function(x){o[x.type]=x.value});
  return Date.UTC(+o.year,+o.month-1,+o.day,+o.hour,+o.minute,+o.second)-Math.floor(ts/1000)*1000;
}
function tzLocal(ts,tz){var o=tzOff(ts,tz),d=new Date(ts+o);return {h:d.getUTCHours(),m:d.getUTCMinutes(),day:Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())}}
PXR.meet=function(){
  var S=ls('meet')||{},sel=(S.z&&S.z.length?S.z:['Asia/Ho_Chi_Minh','Europe/London','America/New_York']).filter(function(z){return ZN.some(function(c){return c[2]===z})});
  var dv=today();
  function name(z){for(var i=0;i<ZN.length;i++)if(ZN[i][2]===z)return EN()?ZN[i][1]:ZN[i][0];return z}
  function cls(h,m){var x=h+m/60;return x>=9&&x<18?'g':(x>=7&&x<22)?'y':'r'}
  function draw(){
    var d=pdate($('mt-dt')?$('mt-dt').value:dv)||pdate(dv),home=sel[0],rows=[],best=[],ok=[];
    if(sel.length){
      for(var h=0;h<24;h++){
        var guess=Date.UTC(d.y,d.m-1,d.d,h),ts=guess-tzOff(guess,home);ts=guess-tzOff(ts,home);
        var base=tzLocal(ts,home).day,cells=sel.map(function(z){var l=tzLocal(ts,z);return {h:l.h,m:l.m,c:cls(l.h,l.m),dd:Math.round((l.day-base)/864e5)}});
        var all=cells.every(function(c){return c.c==='g'}),some=cells.every(function(c){return c.c!=='r'});
        rows.push({h:h,cells:cells,all:all,some:some});
      }
      var run=function(f){var out=[],st=-1;for(var i=0;i<=24;i++){var on=i<24&&f(rows[i]);if(on&&st<0)st=i;if(!on&&st>=0){out.push(pad(st)+':00–'+pad(i)+':00');st=-1}}return out};
      best=run(function(r){return r.all});ok=run(function(r){return r.some});
    }
    mount('<div class="row"><label>'+T('Ngày họp','Meeting date')+'<input id="mt-dt" type="date" value="'+d.y+'-'+pad(d.m)+'-'+pad(d.d)+'"></label></div>'+
      '<div class="nm">'+T('Chọn tối đa 4 thành phố. Thành phố đầu tiên là mốc giờ của bạn.','Pick up to 4 cities. The first one is your reference time.')+'</div>'+
      '<div class="mtr">'+ZN.map(function(c){var on=sel.indexOf(c[2])>=0;return '<button type="button" data-z="'+c[2]+'" aria-pressed="'+on+'">'+(on?(sel.indexOf(c[2])===0?'🏠 ':''):'')+(EN()?c[1]:c[0])+'</button>'}).join('')+'</div>'+
      (sel.length?'<div class="card"><b>✅ '+T('Cả nhóm đều trong giờ làm (9h–18h)','Everyone in work hours (9–18)')+'</b><div>'+(best.length?best.map(function(x){return esc(x)}).join(', ')+' <span class="nm">('+T('giờ ','time ')+name(home)+')</span>':T('Không có khung nào.','No overlap.'))+'</div>'+
      '<div style="margin-top:6px"><b>🟡 '+T('Chấp nhận được (7h–22h)','Acceptable (7–22)')+'</b></div><div>'+(ok.length?ok.map(function(x){return esc(x)}).join(', '):T('Không có khung nào.','No overlap.'))+'</div></div>'+
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px;text-align:center"><tr><th></th>'+sel.map(function(z){return '<th>'+esc(name(z))+'</th>'}).join('')+'</tr>'+
      rows.map(function(r){return '<tr'+(r.all?' style="font-weight:700"':'')+'><td style="opacity:.7">'+pad(r.h)+':00</td>'+r.cells.map(function(c){var bg=c.c==='g'?'rgba(45,190,157,.35)':c.c==='y'?'rgba(240,190,60,.30)':'rgba(120,130,140,.22)';return '<td style="padding:3px 2px;background:'+bg+'">'+pad(c.h)+':'+pad(c.m)+(c.dd?'<sup>'+(c.dd>0?'+':'')+c.dd+'</sup>':'')+'</td>'}).join('')+'</tr>'}).join('')+'</table></div>':'<div class="card">'+T('Chọn ít nhất một thành phố.','Pick at least one city.')+'</div>'),
      function(e){if(e.target.id==='mt-dt'){dv=e.target.value;draw()}},
      function(e){var b=e.target.closest('button');if(!b)return;var z=b.getAttribute('data-z');if(!z)return;var i=sel.indexOf(z);if(i>=0)sel.splice(i,1);else if(sel.length<4)sel.push(z);ls('meet',{z:sel});draw()});
  }
  draw();
};
/* ---- Đọc giờ bằng giọng nói (Android: giọng của máy; trình duyệt: speechSynthesis) ---- */
function tnPlug(){try{var C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.TimerNotif||null}catch(e){return null}}
function speakOn(){return ls('speak')===true}
function toast2(m){var t=$('toast');if(t){t.textContent=m;t.hidden=false;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');setTimeout(function(){t.hidden=true},4200)}}
window.SPEAK=function(text){
  if(!speakOn()||!text)return;
  try{
    var t=tnPlug(),lang=EN()?'en-US':'vi-VN';
    if(t&&t.speak){t.speak({text:String(text),lang:lang}).catch(function(){});return}
    if(window.speechSynthesis&&window.SpeechSynthesisUtterance){var u=new SpeechSynthesisUtterance(String(text));u.lang=lang;speechSynthesis.cancel();speechSynthesis.speak(u)}
  }catch(e){}
};
window.SPEAK.on=speakOn;
function spkSync(){var b=$('spkBtn');if(b)b.setAttribute('aria-pressed',speakOn()?'true':'false')}
document.addEventListener('DOMContentLoaded',spkSync);
/* ---- Mở nhanh công cụ từ phím tắt khi giữ biểu tượng app ---- */
function deepGo(url){try{var m=/[?&#]tool=([a-z]+)/.exec(url||'');if(m&&document.querySelector('#tabs [data-m="'+m[1]+'"]'))goTab(m[1])}catch(e){}}
window.addEventListener('load',function(){
  setTimeout(function(){deepGo((location.search||'')+(location.hash||''))},500);
  setTimeout(function(){try{
    var C=window.Capacitor,A=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.App;if(!A)return;
    if(A.getLaunchUrl)A.getLaunchUrl().then(function(r){if(r&&r.url)deepGo(r.url)}).catch(function(){});
    if(A.addListener)A.addListener('appUrlOpen',function(e){deepGo(e&&e.url)});
  }catch(e){}},1200);
});
/* ---- Góp ý và báo lỗi (tự kèm thông tin kỹ thuật) ---- */
function fbInfo(cb){
  var C=window.Capacitor,nat=C&&C.isNativePlatform&&C.isNativePlatform(),o={};
  try{o={app:'web',tool:curM(),lang:document.documentElement.lang,screen:(window.screen?screen.width+'x'+screen.height:''),tz:(Intl.DateTimeFormat().resolvedOptions().timeZone||''),ua:navigator.userAgent,time:new Date().toISOString()}}catch(e){}
  function fin(){try{if(window.MU&&MU.diag){var q=MU.diag();o.music=(q.nat?'android':'browser')+(q.err?' err='+q.err:'')+(q.perm?' notif='+q.perm:'')}}catch(e){}cb(o)}
  if(nat&&C.Plugins&&C.Plugins.App&&C.Plugins.App.getInfo)C.Plugins.App.getInfo().then(function(i){o.app='apk '+i.version+' (build '+i.build+')';fin()}).catch(fin);else fin();
}
function fbText(kind,msg,o,withInfo){
  var t=kind+'\n\n'+(msg||'(chưa viết gì)')+'\n';
  if(withInfo){t+='\n--- Thông tin kỹ thuật ---\n';Object.keys(o).forEach(function(k){t+=k+': '+o[k]+'\n'})}
  return t;
}
function showFeedback(){
  var old=$('fb-dlg');if(old){old.remove();return}
  fbInfo(function(o){
    var cfg=window.BG_FEEDBACK||{},d=document.createElement('div');d.id='fb-dlg';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
    d.style.cssText='position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px';
    d.innerHTML='<div style="max-width:520px;width:100%;max-height:92vh;overflow:auto;background:var(--card,#1d2a3a);color:var(--ink,#fff);border-radius:16px;padding:16px 18px;box-shadow:0 20px 60px rgba(0,0,0,.5)">'+
      '<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:18px">💬 '+T('Góp ý, báo lỗi','Feedback and bug report')+'</b><button type="button" id="fb-x" aria-label="Close" style="min-width:40px;min-height:40px">✕</button></div>'+
      '<div class="mtr"><label style="flex:1">'+T('Loại','Type')+'<select id="fb-k"><option>'+T('Báo lỗi','Bug')+'</option><option>'+T('Góp ý tính năng','Feature idea')+'</option><option>'+T('Khác','Other')+'</option></select></label></div>'+
      '<label style="display:block;margin:6px 0">'+T('Bạn gặp chuyện gì? Điều gì nên được cải thiện?','What happened? What should be improved?')+'<textarea id="fb-m" rows="5" style="width:100%;box-sizing:border-box;margin-top:4px" placeholder="'+T('Ví dụ: Bấm phát nhạc rồi xoá đa nhiệm thì nhạc dừng...','e.g. Music stops when I swipe the app away...')+'"></textarea></label>'+
      '<label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" id="fb-i" checked> '+T('Kèm thông tin kỹ thuật (bản app, máy, lỗi gần nhất)','Include technical info (app version, device, last error)')+'</label>'+
      '<details style="margin:4px 0"><summary style="cursor:pointer;font-size:13px;opacity:.8">'+T('Xem thông tin sẽ được gửi','See what will be sent')+'</summary><pre id="fb-pre" style="white-space:pre-wrap;font-size:12px;opacity:.85;margin:6px 0"></pre></details>'+
      '<div class="nm" style="margin:6px 0">'+T('Không có tên, số điện thoại hay nội dung nhạc, thống kê của bạn trong thông tin kỹ thuật.','No name, phone number, music or stats are included in the technical info.')+'</div>'+
      '<div class="mtr"><button type="button" id="fb-s">'+(cfg.email?'✉ '+T('Gửi qua email','Send by email'):cfg.form?'📝 '+T('Mở biểu mẫu','Open form'):'🐙 '+T('Gửi lên GitHub','Send on GitHub'))+'</button><button type="button" id="fb-c">📋 '+T('Sao chép','Copy')+'</button></div></div>';
    document.body.appendChild(d);
    function cur(){return fbText($('fb-k').value,$('fb-m').value,o,$('fb-i').checked)}
    function pre(){$('fb-pre').textContent=fbText('',' ',o,true).split('--- Thông tin kỹ thuật ---')[1]||''}
    pre();
    d.addEventListener('click',function(e){
      var id=e.target.id;
      if(e.target===d||id==='fb-x'){d.remove();return}
      if(id==='fb-c'){var t=cur();try{navigator.clipboard.writeText(t).then(function(){toast2(T('Đã sao chép.','Copied.'))},function(){toast2(T('Không sao chép được.','Could not copy.'))})}catch(x){toast2(T('Không sao chép được.','Could not copy.'))}}
      else if(id==='fb-s'){
        var txt=cur(),subj='[Bấm giờ] '+$('fb-k').value,app=document.documentElement.classList.contains('in-app'),url;
        if(cfg.email)url='mailto:'+cfg.email+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(txt);
        else if(cfg.form){try{navigator.clipboard.writeText(txt)}catch(x){}toast2(T('Đã sao chép nội dung, hãy dán vào biểu mẫu.','Copied. Paste it into the form.'));url=cfg.form}
        else url='https://github.com/namnguyen95800-coder/namnguyen95800-coder.github.io/issues/new?title='+encodeURIComponent(subj)+'&body='+encodeURIComponent(txt.slice(0,6000));
        if(app||/^mailto:/.test(url))location.href=url;else window.open(url,'_blank','noopener');
      }
    });
  });
}
/* ---- Phím tắt trên máy tính ---- */
function curM(){var b=document.querySelector('#tabs [aria-selected="true"]');return b?b.getAttribute('data-m'):''}
function goTab(m){var b=document.querySelector('#tabs [data-m="'+m+'"]');if(b)b.click()}
function tabList(){return Array.prototype.slice.call(document.querySelectorAll('#tabs [data-m]')).map(function(b){return b.getAttribute('data-m')})}
function showKeys(){
  var old=$('kb-help');if(old){old.remove();return}
  var rows=[
    [T('Chung','General'),[['Space',T('Bắt đầu hoặc dừng','Start or pause')],['R',T('Đặt lại','Reset')],['L',T('Ghi vòng (Bấm giờ)','Lap (Stopwatch)')],['F',T('Chế độ tập trung','Focus mode')],['Esc',T('Thoát, đóng bảng','Exit, close dialogs')],['1 … 9, 0',T('Chuyển nhanh sang 10 công cụ đầu','Jump to the first 10 tools')],['[  ]',T('Công cụ trước, sau','Previous, next tool')],['/',T('Mở danh sách công cụ','Open the tool list')],['?',T('Xem bảng phím tắt này','Show this shortcut list')]]],
    [T('Nhạc (dùng ở mọi công cụ)','Music (works everywhere)'),[['M',T('Phát hoặc dừng nhạc','Play or pause music')],['N',T('Bài sau','Next track')],['B',T('Bài trước','Previous track')],['← →',T('Tua 10 giây (trong Nhạc của tôi)','Seek 10 s (in My music)')],['↑ ↓',T('Âm lượng nhạc (trong Nhạc của tôi)','Music volume (in My music)')],['S',T('Ngẫu nhiên','Shuffle')]]],
    [T('Máy gõ nhịp','Metronome'),[['Space',T('Bắt đầu hoặc dừng','Start or stop')],['↑ ↓',T('±1 BPM (Shift: ±5)','±1 BPM (Shift: ±5)')],['T',T('Gõ nhịp','Tap tempo')]]],
    [T('Đồng hồ để bàn','Desk clock'),[['F',T('Toàn màn hình','Fullscreen')],['T',T('Đổi kiểu đồng hồ','Change style')],['H',T('Đổi 12 hoặc 24 giờ','12 or 24 hour')],['S',T('Hiện hoặc ẩn giây','Show or hide seconds')]]],
    [T('Cờ vua','Chess'),[['Space',T('Kết thúc nước đi','End your move')],['P',T('Tạm dừng','Pause')],['R',T('Đặt lại','Reset')]]]
  ];
  var d=document.createElement('div');d.id='kb-help';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.style.cssText='position:fixed;inset:0;z-index:100001;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
  d.innerHTML='<div style="max-width:520px;width:100%;max-height:88vh;overflow:auto;background:var(--card,#1d2a3a);color:var(--ink,#fff);border-radius:16px;padding:18px 20px;box-shadow:0 20px 60px rgba(0,0,0,.5)"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="font-size:18px">⌨ '+T('Phím tắt trên máy tính','Keyboard shortcuts')+'</b><button type="button" id="kb-x" aria-label="Close" style="min-width:40px;min-height:40px">✕</button></div>'+
    rows.map(function(g){return '<div style="margin:12px 0 4px;opacity:.75;font-size:13px;font-weight:700">'+g[0]+'</div>'+g[1].map(function(r){return '<div style="display:flex;gap:12px;padding:5px 0;border-bottom:1px solid rgba(127,127,127,.2)"><kbd style="min-width:84px;text-align:center;padding:2px 8px;border-radius:6px;border:1px solid rgba(127,127,127,.5);font-family:inherit;font-size:13px">'+esc(r[0])+'</kbd><span style="flex:1">'+r[1]+'</span></div>'}).join('')}).join('')+'</div>';
  d.addEventListener('click',function(e){if(e.target===d||e.target.id==='kb-x')d.remove()});
  document.body.appendChild(d);
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){var h=$('kb-help');if(h){h.remove();e.preventDefault()}return}
  if(e.ctrlKey||e.metaKey||e.altKey||e.defaultPrevented||window.alertOpen)return;
  var t=e.target,tg=t&&t.tagName,k=e.key,m=curM();
  if(tg==='TEXTAREA'||tg==='SELECT')return;
  if(tg==='INPUT'){if(k==='Enter'&&t.id==='hb-n'){var a=$('hb-add');if(a)a.click()}return}
  var onBtn=(tg==='BUTTON'||tg==='A'||tg==='SUMMARY'),lk=k.toLowerCase(),done=false;
  if(k==='?'){showKeys();e.preventDefault();return}
  if(lk==='m'){if(window.MU){MU.toggle();done=true}}
  else if(lk==='n'&&m!=='cook'){if(window.MU&&MU.tracks().length){MU.next();done=true}}
  else if(lk==='b'){if(window.MU&&MU.tracks().length){MU.prev();done=true}}
  else if(k>='0'&&k<='9'&&!e.shiftKey){var tl=tabList(),ix=k==='0'?9:(+k-1);if(tl[ix]){goTab(tl[ix]);done=true}}
  else if(k==='['||k===']'){var tl2=tabList(),i2=tl2.indexOf(m);if(i2>=0){goTab(tl2[(i2+(k===']'?1:-1)+tl2.length)%tl2.length]);done=true}}
  else if(k==='/'){var mb=$('bmore');if(mb){mb.click();setTimeout(function(){var si=document.querySelector('#sheet input');if(si)si.focus()},80);done=true}}
  else if(m==='music'){
    if(e.code==='Space'&&!onBtn){MU.toggle();setTimeout(function(){var p=$('mu-pl');if(p)p.textContent=MU.playing()?'⏸':'▶'},150);done=true}
    else if(k==='ArrowLeft'){MU.seek(-10);done=true}
    else if(k==='ArrowRight'){MU.seek(10);done=true}
    else if(k==='ArrowUp'){MU.volume(0.05);done=true}
    else if(k==='ArrowDown'){MU.volume(-0.05);done=true}
    else if(lk==='s'){var sh=$('mu-sh');if(sh)sh.click();done=true}
    else if(lk==='l'){var rp=$('mu-rp');if(rp)rp.click();done=true}
  }else if(m==='metro'&&window.MTR){
    if(e.code==='Space'&&!onBtn){MTR.toggle();done=true}
    else if(k==='ArrowUp'||k==='ArrowRight'){MTR.nudge(e.shiftKey?5:1);done=true}
    else if(k==='ArrowDown'||k==='ArrowLeft'){MTR.nudge(e.shiftKey?-5:-1);done=true}
    else if(lk==='t'){MTR.tap();done=true}
  }else if(m==='desk'){
    if(lk==='f'){if(window.FS&&FS.active())FS.exit();else{var f=$('dk-f');if(f)f.click()}done=true}
    else if(lk==='t'){var ths=document.querySelectorAll('[data-th]'),ci=-1,i3;for(i3=0;i3<ths.length;i3++)if(ths[i3].getAttribute('aria-pressed')==='true')ci=i3;if(ths.length)ths[(ci+1)%ths.length].click();done=true}
    else if(lk==='h'){var hh=$('dk-h');if(hh)hh.click();done=true}
    else if(lk==='s'){var ss=$('dk-s');if(ss)ss.click();done=true}
  }
  if(done)e.preventDefault();
});
document.addEventListener('click',function(e){
  var id=e.target&&e.target.id;
  if(id==='kb-open')showKeys();
  else if(id==='fbBtn')showFeedback();
  else if(id==='spkBtn'){ls('speak',!speakOn());spkSync();if(speakOn()){window.SPEAK(T('Đã bật đọc giờ bằng giọng nói','Voice announcements are on'));var tp=tnPlug();if(tp&&tp.ttsInfo)setTimeout(function(){tp.ttsInfo().then(function(r){if(r&&r.ready&&!r.langOk)toast2(T('Máy chưa có giọng tiếng Việt. Vào Cài đặt, Ngôn ngữ, Chuyển văn bản thành giọng nói để tải thêm.','No Vietnamese voice installed. Open Settings, Languages, Text-to-speech to add one.'))}).catch(function(){})},2500)}else toast2(T('Đã tắt đọc giờ.','Voice announcements are off.'))}
  else if(id==='musBtn'){goTab('music');try{window.scrollTo({top:0,behavior:'smooth'})}catch(x){}}
});
try{var ll=document.documentElement.lang;new MutationObserver(function(){var l=document.documentElement.lang;if(l===ll)return;ll=l;var m=curM();if(window.PX[m]&&PXR[m])PXR[m]()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']})}catch(x){}
})();

;

  /* ỦNG HỘ: ảnh QR chỉ được tải khi người dùng mở mục này, để trang mở nhanh và nhẹ. */
  (function(){
    var QRS=[{f:'ung-ho-mb.png',n:'MB Bank'},{f:'ung-ho-momo.png',n:'Momo'}],loaded=false;
    try{
      var box=document.getElementById('donate'),list=document.getElementById('donate-list');
      if(!box||!list)return;
      function load(){
        if(loaded)return;loaded=true;list.textContent='';var fails=0;
        QRS.forEach(function(q){
          var fig=document.createElement('figure');
          fig.style.cssText='margin:0;flex:1 1 150px;max-width:220px;text-align:center';
          var img=new Image();img.alt='Mã QR '+q.n;img.width=560;img.height=560;
          img.style.cssText='display:block;width:100%;height:auto;border-radius:12px;background:#fff';
          var cap=document.createElement('figcaption');
          cap.textContent=q.n;cap.style.cssText='margin-top:6px;font-weight:600;color:var(--ink)';
          var sv=document.createElement('a');
          sv.href=q.f;sv.download='ma-qr-'+q.f;sv.textContent='⬇ Lưu mã QR';
          sv.addEventListener('click',function(ev){var C=window.Capacitor;if(window.SAVE&&C&&C.isNativePlatform&&C.isNativePlatform()){ev.preventDefault();fetch(q.f).then(function(r){return r.blob()}).then(function(b){window.SAVE('ma-qr-'+q.f,b,'image/png')}).catch(function(){})}});
          sv.style.cssText='display:inline-block;margin-top:8px;padding:10px 16px;min-height:44px;border:1px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font-weight:600;font-size:15px;text-decoration:none';
          fig.appendChild(img);fig.appendChild(cap);fig.appendChild(sv);list.appendChild(fig);
          img.onerror=function(){
            if(fig.parentNode)fig.parentNode.removeChild(fig);
            if(++fails===QRS.length){loaded=false;var m=document.createElement('p');m.textContent='Chưa tải được mã QR. Bạn thử lại sau nhé.';m.style.textAlign='center';list.appendChild(m)}
          };
          img.src=q.f;
        });
      }
      box.addEventListener('toggle',function(){if(box.open)load()});
    }catch(e){}
  })();
  
;
window.TT=document.title;try{localStorage.setItem('bg2-seen','1')}catch(e){}
;

(function(){
  var $=function(id){return document.getElementById(id)};
  var timeEl=$('time'),phaseEl=$('phase'),lapNow=$('lapnow'),bar=$('bar'),fill=$('fill'),
      mainBtn=$('main'),sideBtn=$('side'),lapsBox=$('laps'),list=$('list'),setBox=$('settings'),hint=$('hint');
  var mode='sw',running=false,startAt=0,raf=0,ac=null;
  var elapsed=0,lapBase=0,laps=[];
  var started=false,done=false,idx=0,acc=0,cfg=null;
  var ENG={sw:1,cd:1,pomo:1,iv:1,seq:1,exam:1},STORE={};
  var NAMES={cd:'Đếm ngược',pomo:'Pomodoro',iv:'Tập luyện',seq:'Quy trình',exam:'Đồng hồ thi'};
  function snap(){return {running:running,startAt:startAt,elapsed:elapsed,lapBase:lapBase,laps:laps,started:started,done:done,idx:idx,acc:acc,cfg:cfg}}
  function load(o){o=o||{};running=!!o.running;startAt=o.startAt||0;elapsed=o.elapsed||0;lapBase=o.lapBase||0;laps=o.laps||[];started=!!o.started;done=!!o.done;idx=o.idx||0;acc=o.acc||0;cfg=o.cfg||null}

  var HINTS={
    sw:'Phím tắt trên máy tính: Space bắt đầu hoặc dừng, L ghi vòng, R đặt lại (khi đang dừng). Mỗi lần dừng cũng được tính là một vòng.',
    cd:'Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Hết giờ sẽ có tiếng bíp. Hãy bật âm thanh và giữ tab này mở.',
    pomo:'Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Làm việc tập trung rồi nghỉ ngắn, sau 4 phiên là nghỉ dài, tự chuyển giai đoạn.',
    iv:'Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Dùng cho tập gym, chạy ngắt quãng, plank, có tiếng bíp mỗi khi đổi giai đoạn.',
    days:'Đếm ngược đến một ngày quan trọng như thi, sinh nhật, du lịch. Gõ tên, chọn ngày rồi bấm Enter hoặc nút Thêm. Dữ liệu lưu trên trình duyệt của bạn.',
    chess:'Phím tắt: Space kết thúc nước đi của người đang đi (lần đầu tính là người bên dưới), P tạm dừng, R đặt lại. Trên điện thoại, chạm nút bên mình sau khi đi. Nút phía trên xoay ngược cho người ngồi đối diện.',
    cook:'Có thể chạy nhiều món cùng lúc. Gõ tên và số phút rồi bấm Enter để thêm. Đừng tắt trang khi đang nấu.',
    breath:'Phím tắt: Space bắt đầu hoặc dừng. To ra là hít vào, nhỏ lại là thở ra.',
    rem:'Nhắc lặp lại theo chu kỳ, ví dụ cứ 20 phút nghỉ mắt. Cần để trang mở, màn hình được giữ sáng khi có nhắc nhở đang chạy. Enter để thêm.',
    sleep:'Chọn giờ cần thức dậy để xem nên đi ngủ lúc nào, hoặc chọn giờ đi ngủ để xem nên dậy lúc nào. Tính theo chu kỳ ngủ khoảng 90 phút.',
    dcalc:'Tính số ngày giữa hai ngày, hoặc cộng trừ ngày, tuần, tháng, năm từ một ngày bất kỳ.',lunar:'Đổi qua lại giữa dương lịch và âm lịch, xem Tết và ngày âm hôm nay.',age:'Tính tuổi chính xác theo năm, tháng, ngày và số ngày đến sinh nhật.',hms:'Tính khoảng giờ giữa hai mốc, cộng trừ giờ và phút.',desk:'Đồng hồ số lớn để bàn, giữ sáng màn hình. Phím tắt: F toàn màn hình, T đổi kiểu, H đổi 12 hoặc 24 giờ, S hiện hoặc ẩn giây.',wage:'Ước tính lương theo giờ và tiền tăng ca.',pace:'Nhập quãng đường và thời gian để biết pace, tốc độ và dự đoán thời gian chạy 5 km, 10 km, bán marathon, marathon.',plan:'Nhập hạn và khối lượng cần làm để biết mỗi ngày phải làm bao nhiêu cho kịp.',words:'Dán văn bản để đếm từ, ký tự và ước tính thời gian đọc hoặc thuyết trình.',week:'Chọn một ngày để biết đó là tuần thứ mấy, ngày thứ mấy trong năm và quý mấy.',water:'Bấm để ghi mỗi lần uống nước, theo dõi mục tiêu mỗi ngày và 6 ngày trước.',zone:'Nhập tuổi để biết 5 vùng nhịp tim khi tập luyện. Chỉ để tham khảo.',spaced:'Ghi nội dung vừa học, app nhắc ôn lại sau 1, 3, 7, 14 và 30 ngày.',leave:'Nhập giờ cần đến để biết phải xuất phát và bắt đầu chuẩn bị lúc mấy giờ.',tally:'Bấm số lớn để đếm số lần tập, lưu từng hiệp.',today:'Tổng quan hôm nay: việc cần làm, tập trung, thói quen, uống nước, ôn tập và sự kiện sắp tới.',todo:'Ghi việc cần làm kèm hạn, ưu tiên và dự án. Bấm 🍅 để làm bằng Pomodoro, mỗi phiên xong được cộng vào việc đó.',rules:'Tạo quy tắc Nếu – Thì: ví dụ cứ mỗi 4 phiên Pomodoro thì nhắc uống nước, hay xong một việc thì mở Hôm nay.',close:'Tổng kết ngày, chọn việc dở dang dồn sang mai chỉ bằng một chạm.',habit:'Đánh dấu mỗi ngày và theo dõi chuỗi ngày liên tiếp. Gõ tên rồi nhấn Enter để thêm.',sun:'Giờ mặt trời mọc, lặn và giờ vàng chụp ảnh.',metro:'Máy gõ nhịp cho người tập nhạc. Phím tắt: Space bắt đầu hoặc dừng, ↑ ↓ chỉnh BPM (Shift: ±5), T gõ nhịp.',track:'Ghi thời gian bạn dành cho từng việc, tự vào Thống kê và Lịch.',meet:'Tìm khung giờ họp phù hợp giữa nhiều thành phố.',music:'Phát nhạc có sẵn trong máy làm nhạc nền, nối với Pomodoro. Phím tắt: M phát hoặc dừng, N bài sau, B bài trước, ← → tua 10 giây, ↑ ↓ âm lượng.',
    world:'Xem giờ nhiều thành phố cùng lúc. Chọn thành phố rồi bấm Thêm. Chênh lệch giờ tính so với múi giờ của máy bạn.',
    seq:'Tạo quy trình gồm nhiều bước nối nhau, ví dụ buổi sáng: đánh răng, tập, ăn sáng. Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Có thể lưu thành mẫu.',
    exam:'Đặt tổng thời gian làm bài và các mốc báo (số phút còn lại). Mốc lớn hơn hoặc bằng tổng thời gian sẽ bị bỏ qua, để 0 là không dùng. Phím tắt: Space bắt đầu hoặc dừng, R đặt lại.'
  };
  function field(id,label,v,max){return '<label>'+label+'<input id="'+id+'" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="'+String(max).length+'" value="'+v+'" autocomplete="off"></label>'}
  function grp(t,a,b){return '<div class="grp"><b>'+t+'</b>'+a+b+'</div>'}
  var SETTINGS={
    sw:'',
    cd:field('s1','Phút',5,999)+field('s2','Giây',0,59)+
       '<div class="chips"><button data-p="1">1 phút</button><button data-p="5">5 phút</button><button data-p="10">10 phút</button><button data-p="30">30 phút</button></div>',
    pomo:grp('Làm việc',field('s1','Phút',25,999),field('s2','Giây',0,59))+grp('Nghỉ ngắn',field('s3','Phút',5,999),field('s4','Giây',0,59))+grp('Nghỉ dài',field('s5','Phút',15,999),field('s6','Giây',0,59)),
    iv:field('s1','Tập (giây)',30,3600)+field('s2','Nghỉ (giây)',10,3600)+field('s3','Số vòng',8,99),
    chess:grp('Mỗi bên',field('s1','Phút',10,999),field('s3','Giây',0,59))+field('s2','Cộng thêm mỗi nước (giây)',0,60),
    cook:'',breath:'',days:'',rem:'',world:'',sleep:'',dcalc:'',lunar:'',age:'',hms:'',desk:'',wage:'',pace:'',plan:'',words:'',week:'',water:'',zone:'',spaced:'',leave:'',tally:'',today:'',todo:'',rules:'',close:'',habit:'',sun:'',metro:'',music:'',track:'',meet:'',seq:'<div id="seqbox" class="sq"></div>',exam:grp('Tổng thời gian',field('s1','Phút',90,999),field('s2','Giây',0,59))+grp('Báo khi còn',field('s3','Mốc 1 (phút)',30,999),field('s4','Mốc 2 (phút)',15,999))+grp('',field('s5','Mốc 3 (phút)',5,999),field('s6','Mốc 4 (phút)',1,999))
  };

  function pad(n,l){n=String(n);while(n.length<l)n='0'+n;return n}
  function fmt(ms){
    var cs=Math.floor(ms/10)%100,s=Math.floor(ms/1000)%60,m=Math.floor(ms/60000)%60,h=Math.floor(ms/3600000);
    return {main:(h?pad(h,2)+':':'')+pad(m,2)+':'+pad(s,2),cs:'.'+pad(cs,2)};
  }
  function text(ms){var f=fmt(ms);return f.main+f.cs}
  function fmtS(ms){
    var t=Math.ceil(ms/1000),h=Math.floor(t/3600),m=Math.floor(t/60)%60,s=t%60;
    return (h?pad(h,2)+':':'')+pad(m,2)+':'+pad(s,2);
  }
  function val(id,d){var e=$(id);var v=e?parseInt(e.value,10):NaN;return e?(isNaN(v)||v<0?0:v):d}
  function readCfg(){
    if(mode==='cd')return {m:val('s1',5),s:val('s2',0)};
    if(mode==='seq')return {steps:(window.seqSteps?window.seqSteps():[])};
    if(mode==='exam')return {t:val('s1',90)*60+val('s2',0),marks:[val('s3',30),val('s4',15),val('s5',5),val('s6',1)]};
    if(mode==='pomo')return {w:val('s1',25)*60+val('s2',0),b:val('s3',5)*60+val('s4',0),l:val('s5',15)*60+val('s6',0)};
    return {w:val('s1',30),r:val('s2',10),n:Math.max(1,val('s3',8))};
  }
  function segs(c){
    var T=Math.max(1,c.t)*1000,ms=[],seen={};
    c.marks.forEach(function(m){if(m>0&&m*60000<T&&!seen[m]){seen[m]=1;ms.push(m)}});
    ms.sort(function(a,b){return b-a});
    var out=[],prev=T;
    ms.forEach(function(m,i){out.push({name:i===0?'Làm bài':'Còn '+ms[i-1]+' phút',ms:prev-m*60000});prev=m*60000});
    out.push({name:ms.length?'Còn '+ms[ms.length-1]+' phút':'Làm bài',ms:prev});
    return out;
  }
  function phase(i,c){
    var X=function(ms){return Math.max(1000,ms)};
    if(mode==='seq'){var st=c.steps||[];return i<st.length?{name:st[i].n+' ('+(i+1)+'/'+st.length+')',ms:X(st[i].ms)}:null}
    if(mode==='exam'){var sg=segs(c);return i<sg.length?{name:sg[i].name,ms:X(sg[i].ms)}:null}
    if(mode==='cd')return i>0?null:{name:'Đếm ngược',ms:X((c.m*60+(c.s||0))*1000)};
    if(mode==='pomo'){
      var k=(i>>1)+1;
      if(i%2===0)return {name:'Làm việc, phiên '+k,ms:X(c.w*1000)};
      var lg=k%4===0;
      return {name:lg?'Nghỉ dài':'Nghỉ ngắn',ms:X((lg?c.l:c.b)*1000)};
    }
    if(i>2*c.n-2)return null;
    return i%2===0?{name:'Tập, vòng '+(i/2+1)+' trên '+c.n,ms:X(c.w*1000)}:{name:'Nghỉ',ms:X(c.r*1000)};
  }

  function now(){return elapsed+(running?performance.now()-startAt:0)}
  function engE(){return acc+(running?performance.now()-startAt:0)}

  function beep(n,d){d=d||0.3;
    try{
      if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();
      for(var i=0;i<n;i++){
        var o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+i*(d+0.15);
        var S=window.snd||{t:'square',f:880};o.type=S.t;o.frequency.value=S.f;o.connect(g);g.connect(ac.destination);
        g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(Math.max(0.0002,0.9*(window.vol==null?1:window.vol)),t+0.02);g.gain.setValueAtTime(Math.max(0.0002,0.9*(window.vol==null?1:window.vol)),t+d);g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.08);
        o.start(t);o.stop(t+d+0.1);
      }
    }catch(e){}
    try{if(navigator.vibrate)navigator.vibrate(n>1?[400,150,400,150,400]:400)}catch(e){}
  }

  var ringF=$('ringf'),dispEl=$('disp'),RC=289.03,lastTx='';
  function paint(fr,st){
    fr=Math.max(0,Math.min(1,fr));
    ringF.style.strokeDashoffset=(RC*(1-fr)).toFixed(1);
    ringF.style.opacity=fr<=0.002?'0':'1';
    if(dispEl.getAttribute('data-state')!==st||document.body.getAttribute('data-st')!==st){dispEl.setAttribute('data-state',st);document.body.setAttribute('data-st',st)}
  }
  function ringState(p,e,ex){
    var fr=1,st='idle';
    if(started){
      var tot=ex?ex.T:p.ms,rm=ex?ex.left:p.ms-e;
      fr=rm/tot;
      st=running?'work':'pause';
      if(running&&(mode==='pomo'||mode==='iv')&&idx%2===1)st='rest';
      else if(running&&mode!=='iv'&&rm<=60000&&tot>90000)st='warn';
    }
    paint(fr,st);
  }
  function fit(){
    var tx=timeEl.textContent.replace(/\.\d\d$/,'');
    timeEl.classList.toggle('long',tx.length>5);
    if(mode!=='sw'&&running){
      if(tx!==lastTx&&lastTx!==''){timeEl.classList.remove('tk');void timeEl.offsetWidth;timeEl.classList.add('tk')}
      lastTx=tx;
    }else lastTx='';
  }
  function render(){
    if(mode==='chess'||mode==='cook'||mode==='breath'||mode==='days'||mode==='rem'||mode==='world'||mode==='sleep'||mode==='dcalc'||window.PX[mode])return;timeEl.style.color='';bar.hidden=mode==='sw';$('disp').classList.toggle('flash',mode!=='sw'&&done);
    if(mode==='sw'){
      var t=now(),f=fmt(t);
      timeEl.innerHTML=f.main+'<span class="cs">'+f.cs+'</span>';
      phaseEl.textContent='';
      lapNow.textContent=(laps.length||(running&&t>0))?'Vòng hiện tại: '+text(t-lapBase):'';
      document.title=window.TT;
      paint((t%60000)/60000,running?'work':(t>0?'pause':'idle'));fit();
      return;
    }
    var p,e=0,ex=null;
    if(done){timeEl.textContent='00:00';phaseEl.textContent='Xong rồi!';fill.style.width='100%';lapNow.textContent='';document.title='Xong rồi! - Bấm giờ';paint(0,'done');fit();return}
    if(started){e=engE();p=phase(idx,cfg)}else{p=phase(0,readCfg())}
    if(!p){timeEl.textContent='00:00';phaseEl.textContent='Chưa có bước nào, hãy thêm bước bên dưới';fill.style.width='0%';lapNow.textContent='';paint(0,'idle');fit();return}
    timeEl.textContent=fmtS(p.ms-e);
    phaseEl.textContent=started?p.name:'Sẵn sàng';
    fill.style.width=(started?Math.min(100,e/p.ms*100):0)+'%';
    lapNow.textContent=(mode==='pomo'&&started)?'Đã xong '+(idx>>1)+' phiên':'';
    if(mode==='exam'){var sg=segs(started?cfg:readCfg()),T=0,pre=0,k;for(k=0;k<sg.length;k++){T+=Math.max(1000,sg[k].ms);if(started&&k<idx)pre+=Math.max(1000,sg[k].ms)}var left=T-(started?pre+e:0);timeEl.textContent=fmtS(left);ex={left:left,T:T};fill.style.width=(started?Math.min(100,(pre+e)/T*100):0)+'%';lapNow.textContent=(started&&phase(idx+1,cfg))?'Mốc báo tiếp theo sau '+fmtS(p.ms-e):'';document.title=started?fmtS(left)+' - Bấm giờ':window.TT}
    ringState(p,e,ex);fit();
    if(mode!=='exam')document.title=started?fmtS(p.ms-e)+' - Bấm giờ':window.TT;
  }

  function logPhase(p){
    if(!window.logStat)return;
    if(mode==='pomo'||mode==='iv'){if(idx%2===0)window.logStat(mode,p.ms)}
    else if(mode==='exam'){if(!phase(idx+1,cfg)){var T=0;segs(cfg).forEach(function(x){T+=x.ms});window.logStat(mode,T)}}
    else window.logStat(mode,p.ms);
  }
  function advance(bg){
    if(mode==='sw'||!started||!running)return;
    var e=engE(),p=phase(idx,cfg),moved=false;
    while(p&&e>=p.ms){logPhase(p);e-=p.ms;idx++;p=phase(idx,cfg);moved=true}
    if(!p){finish(bg);return}
    if(moved){
      acc=e;startAt=performance.now();
      if(mode==='pomo')beep(3,0.8);else beep(2,0.4);
      if(mode==='pomo'&&idx%2===1&&window.celebrate)window.celebrate(false);
      if((bg||mode==='exam')&&window.showAlert)window.showAlert((NAMES[mode]||'')+': '+p.name,'');
    }
  }
  var lastR=0;
  function tick(){
    advance(false);
    var pn=performance.now();
    if(mode==='sw'||!running||pn-lastR>=100){lastR=pn;render()}
    if(running&&ENG[mode])raf=requestAnimationFrame(tick);
  }
  function finish(bg){
    running=false;started=false;done=true;
    beep(4,0.6);
    if(window.celebrate)window.celebrate(false);
    if(bg){if(window.showAlert)window.showAlert('Hết giờ: '+(NAMES[mode]||''),'');return}
    cancelAnimationFrame(raf);
    syncUI();render();
  }
  function syncUI(){
    if(!ENG[mode]){setBox.style.opacity='';lapsBox.hidden=true;return}
    var sw=mode==='sw';
    if(running){
      mainBtn.textContent='Dừng';mainBtn.className='stop';
      sideBtn.textContent=sw?'Vòng':'Đặt lại';sideBtn.disabled=false;
    }else{
      var has=sw?elapsed>0:(started||done);
      mainBtn.textContent=(sw?elapsed>0:started)?'Tiếp tục':'Bắt đầu';mainBtn.className='go';
      sideBtn.textContent=has?'Đặt lại':(sw?'Vòng':'Đặt lại');sideBtn.disabled=!has;
    }
    setBox.style.opacity=(!sw&&started)?'.5':'';
    if(sw)drawLaps();else{lapsBox.hidden=true;list.innerHTML=''}
  }

  function start(){
    try{if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();if(ac.resume)ac.resume()}catch(e){}
    if(mode!=='sw'){
      if(!started){cfg=readCfg();if(!phase(0,cfg)){render();return}idx=0;acc=0;done=false;started=true}
      setBox.style.opacity='.5';
    }
    running=true;startAt=performance.now();
    mainBtn.textContent='Dừng';mainBtn.className='stop';
    sideBtn.textContent=mode==='sw'?'Vòng':'Đặt lại';sideBtn.disabled=false;
    tick();
  }
  function stop(){
    if(mode==='sw'){elapsed=now();if(elapsed-lapBase>=50){laps.push({total:elapsed,split:elapsed-lapBase});lapBase=elapsed;drawLaps()}}else acc=engE();
    running=false;cancelAnimationFrame(raf);
    mainBtn.textContent='Tiếp tục';mainBtn.className='go';
    sideBtn.textContent='Đặt lại';sideBtn.disabled=false;
    render();
  }
  function reset(){
    running=false;cancelAnimationFrame(raf);
    elapsed=0;lapBase=0;laps=[];started=false;done=false;idx=0;acc=0;
    setBox.style.opacity='';
    mainBtn.textContent='Bắt đầu';mainBtn.className='go';
    sideBtn.textContent=mode==='sw'?'Vòng':'Đặt lại';sideBtn.disabled=true;
    lapsBox.hidden=true;list.innerHTML='';render();
  }
  function lap(){var t=now();laps.push({total:t,split:t-lapBase});lapBase=t;drawLaps()}
  function drawLaps(){
    lapsBox.hidden=!laps.length;
    var best=-1,worst=-1;
    if(laps.length>2){
      var mn=Infinity,mx=-Infinity;
      laps.forEach(function(l,i){if(l.split<mn){mn=l.split;best=i}if(l.split>mx){mx=l.split;worst=i}});
    }
    list.innerHTML='';
    for(var i=laps.length-1;i>=0;i--){
      var li=document.createElement('li');
      if(i===best)li.className='best';else if(i===worst)li.className='worst';
      var tag=i===best?'<span class="tag">nhanh nhất</span>':i===worst?'<span class="tag">chậm nhất</span>':'';
      li.innerHTML='<span class="n">Vòng '+(i+1)+'</span><span class="d">+'+text(laps[i].split)+tag+'</span><span class="t">'+text(laps[i].total)+'</span>';
      list.appendChild(li);
    }
  }

  function copyLaps(){
    var txt=laps.map(function(l,i){return 'Vòng '+(i+1)+': +'+text(l.split)+' (tổng '+text(l.total)+')'}).join('\n');
    var b=$('copylaps');
    function ok(){b.textContent='Đã chép';setTimeout(function(){b.textContent='Sao chép'},1500)}
    function fb(){var ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{if(document.execCommand('copy'))ok()}catch(e){}document.body.removeChild(ta)}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,fb);else fb();
  }
  $('copylaps').addEventListener('click',copyLaps);
  function toggle(){running?stop():start()}
  function side(){
    if(sideBtn.disabled)return;
    if(mode==='sw'&&running)lap();else reset();
  }
  function setMode(m){
    cancelAnimationFrame(raf);
    if(ENG[mode])STORE[mode]=snap();
    mode=m;
    load(ENG[m]?STORE[m]:null);
    var tabs=document.querySelectorAll('#tabs button');
    for(var i=0;i<tabs.length;i++)tabs[i].setAttribute('aria-selected',tabs[i].getAttribute('data-m')===m?'true':'false');
    setBox.innerHTML=SETTINGS[m];setBox.hidden=!SETTINGS[m];
    hint.textContent=HINTS[m];if(window.panelMode)window.panelMode(m);
    syncUI();render();
    if(running&&ENG[m])tick();
  }

  /* Báo thức gốc + thông báo đang chạy (dùng khi app bị ẩn hoặc đã xoá khỏi đa nhiệm) */
  function fmtT(ms){ms=Math.max(0,Math.round(ms/1000));var h=Math.floor(ms/3600),m=Math.floor(ms%3600/60),s=ms%60;return (h?h+':'+('0'+m).slice(-2):m)+':'+('0'+s).slice(-2)}
  var NID={cd:9002,pomo:9003,iv:9004,seq:9005,exam:9006};
  function nplan(){
    var items=[],live=[],ms=Date.now(),pn=performance.now();
    var sw=(mode==='sw')?snap():STORE.sw;
    if(sw){
      if(sw.running)live.push({key:'sw',id:9001,title:'Bấm giờ',text:'Đang chạy',when:ms-(sw.elapsed+(pn-sw.startAt)),countdown:false,paused:false,pauseOn:true,next:'lap'});
      else if(sw.elapsed>0)live.push({key:'sw',id:9001,title:'Bấm giờ',text:'Tạm dừng',when:0,countdown:false,paused:true,st:fmtT(sw.elapsed),pauseOn:false,next:''});
    }
    Object.keys(ENG).forEach(function(m){
      if(m==='sw')return;
      var st=(m===mode)?snap():STORE[m];
      if(!st||!st.started||st.done||!st.cfg)return;
      var keep=mode;mode=m;
      try{
        var run=!!st.running,e=st.acc+(run?pn-st.startAt:0),i=st.idx,p=phase(i,st.cfg),at=ms,n=0,first=true,firstAt=0,p0=p?p.name:'',hasNext=!!phase(i+1,st.cfg);
        while(p&&n<16){
          at+=first?Math.max(0,p.ms-e):p.ms;
          if(first)firstAt=at;
          first=false;
          var nx=phase(i+1,st.cfg);
          if(run)items.push({at:at,title:nx?('\u23F0 Xong: '+p.name):'\u23F0 Hết giờ!',body:nx?('Tiếp theo: '+nx.name):((NAMES[m]||'Đồng hồ')+' đã xong')});
          p=nx;i++;n++;
        }
        if(firstAt){
          var endAt=(m==='exam')?at:firstAt,nm=NAMES[m]||'Đồng hồ',txt=(p0&&p0!==NAMES[m])?p0:'Thời gian còn lại',nxt=(m==='cd'||m==='exam'||!hasNext)?'':'skip';
          if(run)live.push({key:m,id:NID[m]||9010,title:nm,text:txt,when:endAt,countdown:true,timeout:Math.max(0,endAt-ms),paused:false,pauseOn:true,next:nxt});
          else live.push({key:m,id:NID[m]||9010,title:nm,text:txt+' (tạm dừng)',when:0,countdown:true,paused:true,st:fmtT(endAt-ms),pauseOn:false,next:nxt});
        }
      }catch(x){}
      mode=keep;
    });
    items.sort(function(a,b){return a.at-b.at});
    return {items:items,live:live};
  }
  var SPI={},SPD={};
  function sptr(v,e){return document.documentElement.lang==='en'?e:v}
  setInterval(function(){
    try{
      if(!window.SPEAK||!window.SPEAK.on())return;
      Object.keys(ENG).forEach(function(m){
        if(m==='sw')return;
        var s2=(m===mode)?snap():STORE[m];
        if(!s2||!s2.started){delete SPI[m];SPD[m]=false;return}
        if(s2.done){if(!SPD[m]){SPD[m]=true;window.SPEAK(sptr('Hết giờ. ','Time is up. ')+(NAMES[m]||'')+sptr(' đã xong',' is done'))}return}
        SPD[m]=false;
        if(s2.running&&SPI[m]!==undefined&&SPI[m]!==s2.idx){
          var keep=mode,p=null;mode=m;try{p=phase(s2.idx,s2.cfg)}catch(x){}mode=keep;
          if(p)window.SPEAK(p.name);
        }
        SPI[m]=s2.idx;
      });
    }catch(e){}
  },1000);
  window.engPhase=function(){var st=(mode==='pomo')?snap():STORE.pomo;if(!st||!st.started||st.done)return null;return {run:!!st.running,work:st.idx%2===0}};
  /* Nút Dừng, Chuyển, Tắt trên thông báo */
  function skipPhase(){
    if(mode==='sw'||!started)return;
    var p=phase(idx+1,cfg);
    if(!p){finish(true);return}
    idx++;acc=0;startAt=performance.now();beep(2,0.4);render();
  }
  if(window.NA&&window.NA.h)window.NA.h.eng=function(key,act){
    if(!ENG[key])return;
    if(key!==mode)setMode(key);
    if(act==='pause'){if(key==='sw'||started)toggle()}
    else if(act==='next'){if(key==='sw'){if(running)lap()}else skipPhase()}
    else if(act==='off'){reset()}
  };
  setInterval(function(){try{if(window.NA&&window.NA.on){var r=nplan();window.NA.sync('eng',r.items);window.NA.live('eng',r.live);window.NA.hold('eng',r.live.some(function(x){return !x.paused}))}}catch(e){}},1000);

  mainBtn.addEventListener('click',toggle);
  sideBtn.addEventListener('click',side);
  $('tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b)setMode(b.getAttribute('data-m'))});
  setBox.addEventListener('input',function(){if(!started)render()});
  setBox.addEventListener('click',function(e){
    var b=e.target.closest('button[data-p]');
    if(b&&!started){$('s1').value=b.getAttribute('data-p');$('s2').value=0;$('s1').dispatchEvent(new Event('input',{bubbles:true}));$('s2').dispatchEvent(new Event('input',{bubbles:true}))}
  });
  function nativeSpace(t){return !!(t&&t.closest&&t.closest('summary,.foot button,.top button,#presets button,#laps button'))}
  window.__nativeSpace=nativeSpace;
  document.addEventListener('keydown',function(e){
    var tg=e.target.tagName;
    if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA'||e.ctrlKey||e.metaKey||e.altKey||window.alertOpen)return;
    if(e.code==='Space'&&nativeSpace(e.target))return;
    if(mode==='chess'||mode==='cook'||mode==='breath'||mode==='days'||mode==='rem'||mode==='world'||mode==='sleep'||mode==='dcalc'||window.PX[mode])return;
    if(e.code==='Space'){e.preventDefault();toggle()}
    else if(e.key==='l'||e.key==='L'){if(mode==='sw'&&running)lap()}
    else if(e.key==='r'||e.key==='R'){if(mode==='sw'?(!running&&elapsed>0):(started||done))reset()}
  });
  document.addEventListener('keyup',function(e){
    var t=e.target.tagName;
    if(e.code==='Space'&&t!=='INPUT'&&t!=='SELECT'&&t!=='TEXTAREA'&&!nativeSpace(e.target))e.preventDefault();
  });
  setInterval(function(){
    if(document.hidden&&running&&ENG[mode]&&mode!=='sw'){advance(true);if(!running){cancelAnimationFrame(raf);syncUI()}render()}
    var any=false,k;
    for(k in STORE){if(k!==mode&&k!=='sw'&&STORE[k]&&STORE[k].running){any=true;break}}
    if(!any)return;
    var cm=mode,cs=snap();
    for(k in STORE){
      if(k===cm||k==='sw'||!STORE[k]||!STORE[k].running)continue;
      mode=k;load(STORE[k]);advance(true);STORE[k]=snap();
    }
    mode=cm;load(cs);
  },250);
  window.__mainSave=function(){
    var now=performance.now(),st={};
    for(var k in ENG){
      var o=(k===mode)?snap():STORE[k];if(!o)continue;
      var r={};for(var f in o)r[f]=o[f];
      if(o.running){if(k==='sw')r.elapsed=o.elapsed+(now-o.startAt);else r.acc=o.acc+(now-o.startAt)}
      r.startAt=0;st[k]=r;
    }
    return {st:st};
  };
  window.__mainLoad=function(sv,gap){
    if(!sv||!sv.st)return;
    for(var k in sv.st){
      var r=sv.st[k];if(!ENG[k])continue;
      if(r.running){if(k==='sw')r.elapsed=(r.elapsed||0)+gap;else r.acc=(r.acc||0)+gap;r.startAt=performance.now()}
      STORE[k]=r;
    }
    mode='sw';load(STORE.sw);syncUI();render();
    if(running)tick();
  };
  window.getAC=function(){return ac};window.beepFn=beep;window.isActive=function(){
    if(ENG[mode]&&running)return true;
    for(var k in STORE){if(k!==mode&&STORE[k]&&STORE[k].running)return true}
    return false;
  };window.unlockAudio=function(){try{if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();if(ac.resume)ac.resume()}catch(e){}};setMode('sw');
})();

;

(function(){
  var $=function(id){return document.getElementById(id)};
  var panel=$('panel'),setBox=$('settings'),disp=$('disp'),ctl=$('ctl'),cur='sw',raf=0;
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
  function val(id,d){var e=$(id);var v=e?parseInt(e.value,10):NaN;return e?(isNaN(v)||v<0?0:v):d}
  function pad(n){return n<10?'0'+n:''+n}
  function mmss(ms){var t=Math.ceil(Math.max(0,ms)/1000),h=Math.floor(t/3600),m=Math.floor(t/60)%60,s=t%60;return (h?h+':'+pad(m):pad(m))+':'+pad(s)}
  function bp(n,d){if(window.beepFn)window.beepFn(n,d)}
  function un(){if(window.unlockAudio)window.unlockAudio()}
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
  function copyText(txt,btn){
    function ok(){if(btn){var o=btn.textContent;btn.textContent='Đã chép';setTimeout(function(){btn.textContent=o},1500)}}
    function fb(){var ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{if(document.execCommand('copy'))ok()}catch(x){}document.body.removeChild(ta)}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,fb);else fb();
  }
  function baseUrl(){return location.href.split('#')[0]}
  document.addEventListener('beforeinput',function(e){var t=e.target;if(t&&t.matches&&t.matches('input[inputmode="numeric"]')&&e.data&&/\D/.test(e.data))e.preventDefault()},true);
  document.addEventListener('input',function(e){var t=e.target;if(t&&t.matches&&t.matches('input[inputmode="numeric"]')){var c=t.value.replace(/\D/g,'');if(c!==t.value)t.value=c}},true);

  var vol=$('vol'),sv=ls('bg-vol');
  if(sv!==null)vol.value=sv;
  window.vol=vol.value/100;
  vol.addEventListener('input',function(){window.vol=vol.value/100;ls('bg-vol',vol.value)});
  vol.addEventListener('change',function(){bp(1,0.25)});
  var fs=$('fs');function note(){var o=fs.textContent;fs.textContent='Máy này không hỗ trợ';setTimeout(function(){fs.textContent=o},2500)}
  if(!window.FS.ok())fs.hidden=true;
  fs.addEventListener('click',function(){if(window.FS.active())window.FS.exit();else{try{window.FS.enter(document.documentElement).catch(note)}catch(x){note()}}});

  /* Cờ vua */
  var ch=null;
  function chess(force){
    cancelAnimationFrame(raf);
    if(force||!ch){var base=Math.max(1000,(val('s1',10)*60+val('s3',0))*1000);
    ch={t:[base,base],b:base,inc:val('s2',0)*1000,a:-1,last:0,over:-1,pause:false,sameDirection:ch?ch.sameDirection:false};}
    panel.innerHTML='<div class="chess"><button class="side" data-i="1" aria-label="Đồng hồ người chơi phía trên"></button><div class="mid"><button data-a="p">Dừng</button><button data-a="r">Đặt lại</button><button data-a="fs">⛶ Toàn màn hình</button><button data-a="orient">↻ Cùng hướng</button></div><button class="side" data-i="0" aria-label="Đồng hồ người chơi phía dưới"></button></div>'; 
    var orientBtn=panel.querySelector('[data-a="orient"]');if(orientBtn&&ch.sameDirection)orientBtn.textContent='↔ Đối diện';
    panel.onclick=function(e){
      var b=e.target.closest('button');if(!b||!ch)return;
      var n=performance.now(),a=b.getAttribute('data-a'),i=b.getAttribute('data-i');
      un();
      if(a==='r'){chess(true);return}
      if(a==='fs'){toggleChessFullscreen();return}
      if(a==='orient'){ch.sameDirection=!ch.sameDirection;var ob=panel.querySelector('[data-a="orient"]');if(ob)ob.textContent=ch.sameDirection?'↔ Đối diện':'↻ Cùng hướng';return}
      if(a==='p'){ 
        if(ch.a<0||ch.over>=0)return;
        if(ch.pause){ch.pause=false;ch.last=n;b.textContent='Dừng'}
        else{ch.t[ch.a]-=n-ch.last;ch.pause=true;b.textContent='Tiếp tục'}
        return;
      }
      if(i===null||ch.over>=0||ch.pause)return;
      i=+i;
      if(ch.a<0){ch.a=1-i;ch.last=n}
      else if(ch.a===i){ch.t[i]=ch.t[i]-(n-ch.last)+ch.inc;ch.a=1-i;ch.last=n}
    };
    chLoop();
  }
  async function toggleChessFullscreen(){
    try{
      if(window.FS.active()){
        await window.FS.exit();
        try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}
      }else{
        await window.FS.enter(panel,{landscape:true});
        try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape')}catch(e){}
      }
    }catch(e){showAlert('Không thể bật toàn màn hình','Trình duyệt có thể chưa hỗ trợ chế độ này. Hãy thử mở website bằng Chrome.');}
  }
  document.addEventListener('fullscreenchange',function(){
    var b=panel.querySelector('[data-a="fs"]');
    if(b)b.textContent=window.FS.active()?'⤢ Thoát toàn màn hình':'⛶ Toàn màn hình';
  });
  function chFlag(){ch.t[ch.a]=0;ch.over=ch.a;ch.a=-1;bp(4,0.6);if(window.logStat)window.logStat('chess',Math.max(0,2*(ch.b||0)-ch.t[0]-ch.t[1]))}
  function chLoop(){
    if(!ch)return;
    var n=performance.now();
    if(ch.a>=0&&!ch.pause&&ch.over<0&&ch.t[ch.a]-(n-ch.last)<=0)chFlag();
    var pb=panel.querySelector('[data-a="p"]');if(pb)pb.textContent=ch.pause?'Tiếp tục':'Dừng';
    var bs=panel.querySelectorAll('.side');
    for(var k=0;k<bs.length;k++){
      var i=+bs[k].getAttribute('data-i'),r=ch.t[i]-((ch.a===i&&!ch.pause)?n-ch.last:0);
      bs[k].textContent=ch.over===i?'Hết giờ':(r<10000?(Math.max(0,r)/1000).toFixed(1):mmss(r));
      var sideClass='side'+(i===1&&!ch.sameDirection?' flip':'')+(ch.a===i?' on':'')+(ch.over===i?' flag':'');
      /* Chỉ đổi class khi trạng thái thật sự thay đổi, tránh cập nhật CSS mỗi khung hình */
      if(bs[k].className!==sideClass)bs[k].className=sideClass;
    }
    raf=requestAnimationFrame(chLoop);
  }

  /* Nấu ăn */
  var timers=[];
  function rem(t){return t.run?t.left-(performance.now()-t.start):t.left}
  function drawCook(){
    var cl=$('cl');if(!cl)return;
    cl.innerHTML=timers.length?timers.map(function(t,i){
      return '<div class="card'+(t.done?' fin':'')+'"><div><div class="nm">'+esc(t.name)+'</div><div class="tm" id="ct'+i+'">'+(t.done?'Xong':mmss(rem(t)))+'</div></div><div class="bt"><button data-a="t" data-i="'+i+'">'+(t.done?'Chạy lại':t.run?'Dừng':'Tiếp tục')+'</button><button data-a="x" data-i="'+i+'">Xóa</button></div></div>';
    }).join(''):'<p class="hint">Chưa có món nào. Nhập tên và số phút rồi bấm Thêm.</p>';
  }
  function cook(){
    cancelAnimationFrame(raf);
    panel.innerHTML='<div class="addrow"><input id="cn" placeholder="Tên món" maxlength="20"><input id="cm" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" value="5" aria-label="Phút" placeholder="phút"><input id="cs" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" value="0" aria-label="Giây" placeholder="giây"><button data-a="add">Thêm</button></div><div class="chips2"><button data-p="Trứng luộc|8">Trứng luộc 8 phút</button><button data-p="Mì gói|3">Mì gói 3 phút</button><button data-p="Cơm|20">Cơm 20 phút</button><button data-p="Trà|5">Trà 5 phút</button></div><div id="cl"></div>';
    panel.onclick=function(e){
      var b=e.target.closest('button');if(!b)return;
      var a=b.getAttribute('data-a'),p=b.getAttribute('data-p'),i=+b.getAttribute('data-i'),n=performance.now();
      un();
      if(p){var q=p.split('|');$('cn').value=q[0];$('cm').value=q[1];$('cs').value=0;return}
      if(a==='add'){
        var m=parseInt($('cm').value,10)||0,sc=parseInt($('cs').value,10)||0;
        var ms=(m*60+sc)*1000;if(ms<=0)return;
        timers.push({name:$('cn').value.trim()||'Món '+(timers.length+1),total:ms,left:ms,run:true,start:n,done:false});
        $('cn').value='';
      }else if(a==='t'){
        var t=timers[i];
        if(t.done){t.left=t.total;t.done=false;t.run=true;t.start=n}
        else if(t.run){t.left=rem(t);t.run=false}
        else{t.run=true;t.start=n}
      }else if(a==='x'){timers.splice(i,1)}
      drawCook();
    };
    drawCook();
  }
  setInterval(function(){
    var changed=false;
    if(ch&&ch.a>=0&&!ch.pause&&ch.over<0&&ch.t[ch.a]-(performance.now()-ch.last)<=0){var who=ch.a;chFlag();showAlert('Cờ vua: hết giờ','Người '+(who===0?'bên dưới':'bên trên')+' hết giờ')}
    timers.forEach(function(t,i){
      if(t.run&&!t.done&&rem(t)<=0){t.run=false;t.left=0;t.done=true;changed=true;bp(4,0.6);showAlert('Xong rồi: '+t.name,'');if(window.logStat)window.logStat('cook',t.total)}
      else if(cur==='cook'&&t.run){var el=$('ct'+i);if(el)el.textContent=mmss(rem(t))}
    });
    if(changed&&cur==='cook')drawCook();
  },250);

  setInterval(function(){
    try{
      if(!window.NA||!window.NA.on)return;
      var ms=Date.now(),items=[],live=[];
      timers.forEach(function(t,k){
        if(t.done)return;
        var r=Math.max(0,rem(t));
        if(t.run){
          items.push({at:ms+r,title:'\uD83C\uDF73 Xong rồi: '+t.name,body:'Món đã đủ giờ'});
          live.push({key:'cook:'+k,id:9100+k,title:'Nấu ăn',text:t.name,when:ms+r,countdown:true,timeout:r,paused:false,pauseOn:true,next:''});
        }else live.push({key:'cook:'+k,id:9100+k,title:'Nấu ăn',text:t.name+' (tạm dừng)',when:0,countdown:true,paused:true,st:mmss(r),pauseOn:false,next:''});
      });
      items.sort(function(a,b){return a.at-b.at});
      window.NA.sync('cook',items);
      window.NA.live('cook',live);window.NA.hold('cook',live.some(function(x){return !x.paused}));
    }catch(e){}
  },1000);

  if(window.NA&&window.NA.h)window.NA.h.cook=function(i,act){
    var t=timers[i];if(!t)return;var n=performance.now();
    if(act==='pause'){if(!t.done){if(t.run){t.left=rem(t);t.run=false}else{t.run=true;t.start=n}}}
    else if(act==='off'){timers.splice(i,1)}
    if(cur==='cook')drawCook();
  };

  /* Hít thở: nhiều kiểu thở, chọn thời lượng, chuông nhẹ, rung, màu đổi theo pha */
  var PAT=[
    {n:'4-7-8',p:[['Hít vào',4,'i'],['Giữ hơi',7,'f'],['Thở ra',8,'o']]},
    {n:'Hộp 4-4-4-4',p:[['Hít vào',4,'i'],['Giữ hơi',4,'f'],['Thở ra',4,'o'],['Giữ hơi',4,'e']]},
    {n:'Đều 5-5',p:[['Hít vào',5,'i'],['Thở ra',5,'o']]},
    {n:'Thư giãn 4-6',p:[['Hít vào',4,'i'],['Thở ra',6,'o']]},
    {n:'Cân bằng 6-6',p:[['Hít vào',6,'i'],['Thở ra',6,'o']]},
    {n:'Thở dài 2+1+6',p:[['Hít vào',2,'i',.45,.8],['Hít thêm',1,'i',.8,1],['Thở ra',6,'o']]}
  ];
  var bi=0,bStart=0,lastPh=-1,lastC=0,bOn=false,bAc=null;
  function bget(k,d){var v=parseInt(ls(k),10);return isNaN(v)?d:v}
  function bToast(m){var t=$('toast');if(!t)return;t.textContent=m;t.hidden=false;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');setTimeout(function(){t.hidden=true},3600)}
  function bTone(f,d){try{
    if(!bAc)bAc=new (window.AudioContext||window.webkitAudioContext)();if(bAc.resume)bAc.resume();
    var o=bAc.createOscillator(),g=bAc.createGain(),t=bAc.currentTime;
    o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.18,t+0.08);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(bAc.destination);o.start(t);o.stop(t+d+0.05);
  }catch(e){}}
  function drawChips(){
    $('bp').innerHTML=PAT.map(function(x,i){return '<button data-q="'+i+'" aria-pressed="'+(i===bi)+'">'+x.n+'</button>'}).join('');
    var d=bget('bg-breath-d',3),sn=bget('bg-breath-s',1),hp=bget('bg-breath-h',1);
    $('bo').innerHTML=[1,3,5,10,0].map(function(m){return '<button data-d="'+m+'" aria-pressed="'+(m===d)+'">'+(m?m+' phút':'Không giới hạn')+'</button>'}).join('')+'<button data-t="s" aria-pressed="'+(sn===1)+'">🔔 Âm thanh</button><button data-t="h" aria-pressed="'+(hp===1)+'">📳 Rung</button>';
  }
  function bStop(ms){
    var was=bOn;bOn=false;
    cancelAnimationFrame(raf);
    var g=$('bgo');if(g){g.textContent='Bắt đầu';g.className='go'}
    if($('bl'))$('bl').textContent='Sẵn sàng';
    if($('ob')){$('ob').style.transform='scale(.45)';$('ob').className='ph-e'}
    if(was&&bStart){var t=(typeof ms==='number')?ms:performance.now()-bStart;if(t>=20000&&window.logStat)window.logStat('breath',Math.round(t))}
  }
  function bFinish(c,ms){
    bStop(ms);
    if(window.celebrate)window.celebrate(false);
    if(bget('bg-breath-s',1)===1){bTone(523,1.2);setTimeout(function(){bTone(659,1.4)},350)}
    bToast('Xong rồi 🌿 '+c+' vòng, '+mmss(ms)+'. Bạn làm tốt lắm!');
    try{if(navigator.vibrate)navigator.vibrate([60,60,60])}catch(x){}
  }
  function bLoop(){
    var P=PAT[bi].p,cyc=0,dur=bget('bg-breath-d',3);
    P.forEach(function(x){cyc+=x[1]*1000});
    var e=performance.now()-bStart,c=Math.floor(e/cyc),r=e%cyc,i=0,acc=0;
    if(c!==lastC){if(dur>0&&e>=dur*60000){bFinish(c,c*cyc);return}lastC=c}
    while(i<P.length-1&&r>=acc+P[i][1]*1000){acc+=P[i][1]*1000;i++}
    var ph=P[i],f=(r-acc)/(ph[1]*1000),ty=ph[2];
    var s0=ph[3]!==undefined?ph[3]:(ty==='i'||ty==='e')?.45:1,s1=ph[4]!==undefined?ph[4]:(ty==='i'||ty==='f')?(ty==='i'?1:1):(ty==='o'?.45:.45);
    var ob=$('ob'),sc=s0+(s1-s0)*f;
    ob.style.transform='scale('+sc+')';if(ob.className!=='ph-'+ty)ob.className='ph-'+ty;
    $('bl').innerHTML=ph[0]+' '+Math.ceil(ph[1]-(r-acc)/1000)+'<small>Vòng '+(c+1)+(dur>0?' · còn '+mmss(Math.max(0,dur*60000-e)):'')+'</small>';
    var key=c*10+i;
    if(key!==lastPh){
      lastPh=key;
      if(bget('bg-breath-h',1)===1){try{if(navigator.vibrate)navigator.vibrate(40)}catch(x){}}
      if(bget('bg-breath-s',1)===1)bTone(ty==='i'?392:ty==='o'?262:330,ty==='o'?0.9:0.6);
    }
    raf=requestAnimationFrame(bLoop);
  }
  function breath(){
    cancelAnimationFrame(raf);
    var s=parseInt(ls('bg-breath-p'),10);bi=s>=0&&s<PAT.length?s:0;
    panel.innerHTML='<div class="chips2" id="bp"></div><div class="bopt" id="bo"></div><div class="orb"><div id="ob" class="ph-e"></div></div><div class="bl" id="bl">Sẵn sàng</div><button id="bgo" class="go" data-a="go">Bắt đầu</button>';if(bOn){$('bgo').textContent='Dừng';$('bgo').className='stop';bLoop()}
    drawChips();
    panel.onclick=function(e){
      var b=e.target.closest('button');if(!b)return;
      var q=b.getAttribute('data-q'),d=b.getAttribute('data-d'),t=b.getAttribute('data-t');
      if(q!==null){bi=+q;ls('bg-breath-p',bi);drawChips();bStop();return}
      if(d!==null){ls('bg-breath-d',+d);drawChips();return}
      if(t!==null){var k='bg-breath-'+t;ls(k,bget(k,1)===1?0:1);drawChips();return}
      if(b.getAttribute('data-a')==='go'){
        if(b.className==='go'){bStart=performance.now();lastPh=-1;lastC=0;bOn=true;b.textContent='Dừng';b.className='stop';bLoop()}
        else bStop();
      }
    };
  }

  window.panelMode=function(m){
    if(window.FS&&window.FS.active()&&window.FS.el()&&window.FS.el()!==document.documentElement)window.FS.exit();
    cancelAnimationFrame(raf);
    cur=m;
    var isP=m==='chess'||m==='cook'||m==='breath'||m==='days'||m==='rem'||m==='world'||m==='sleep'||m==='dcalc'||window.PX[m];
    disp.hidden=isP;ctl.hidden=isP;panel.hidden=!isP;document.body.classList.toggle('pm',isP);if(isP){document.body.removeAttribute('data-st');if(window.setFocus)window.setFocus(false)}var wr=document.querySelector('.wrap');if(wr){wr.classList.remove('enter');void wr.offsetWidth;wr.classList.add('enter');setTimeout(function(){wr.classList.remove('enter')},420)}document.body.setAttribute('data-m',m);
    if(!isP)panel.innerHTML='';
    var ins=setBox.querySelectorAll('input');
    for(var k=0;k<ins.length;k++){var sv2=ls('bg2-'+m+'-'+ins[k].id);if(sv2!==null)ins[k].value=String(sv2).replace(/\D/g,'')}
    if(ins.length)setBox.dispatchEvent(new Event('input',{bubbles:true}));
    ls('bg-mode',m);
    if(m==='chess')chess();else if(m==='cook')cook();else if(m==='breath')breath();else if(m==='days')days();else if(m==='rem')rem2();else if(m==='seq')seqUI();else if(m==='world')world();else if(m==='sleep')sleepTool();else if(m==='dcalc')dcalc();else if(window.PXR[m])window.PXR[m]();
    drawPre();
  };
  setBox.addEventListener('input',function(e){
    if(e.target.id&&e.target!==setBox)ls('bg2-'+cur+'-'+e.target.id,e.target.value);
    if(cur==='chess'&&e.target.id&&e.target!==setBox)chess(true);
  });
  /* Đếm ngày */
  var DAYS=[];
  try{DAYS=JSON.parse(ls('bg-days')||'[]')}catch(x){DAYS=[]}
  if(!Array.isArray(DAYS))DAYS=[];
  function saveDays(){ls('bg-days',JSON.stringify(DAYS))}
  function tgt(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2]).getTime()}
  function fdate(s){var a=s.split('-');return a[2]+'/'+a[1]+'/'+a[0]}
  function dtxt(s){
    var d=tgt(s)-Date.now();
    if(d<=0){var q=Math.floor(-d/86400000);return [q===0?'Hôm nay!':'Đã qua '+q+' ngày','']}
    return [Math.floor(d/86400000)+' ngày',(Math.floor(d/3600000)%24)+' giờ '+pad(Math.floor(d/60000)%60)+' phút '+pad(Math.floor(d/1000)%60)+' giây'];
  }
  function drawDays(){
    var cl=$('dl');if(!cl)return;
    DAYS.sort(function(a,b){return tgt(a.date)-tgt(b.date)});
    cl.innerHTML=DAYS.length?DAYS.map(function(x,i){
      var t=dtxt(x.date);
      return '<div class="card"><div><div class="nm"><span>'+esc(x.name)+'</span> ('+fdate(x.date)+')</div><div class="tm" id="dt'+i+'">'+t[0]+'</div><div class="nm" id="ds'+i+'">'+t[1]+'</div></div><div class="bt"><button data-a="x" data-i="'+i+'">Xóa</button></div></div>';
    }).join(''):'<p class="hint">Chưa có ngày nào. Nhập tên, chọn ngày rồi bấm Thêm.</p>';
  }
  function addDay(){
    var dt=$('dd').value;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(dt))return;
    DAYS.push({name:$('dn').value.trim()||'Sự kiện '+(DAYS.length+1),date:dt});
    saveDays();$('dn').value='';drawDays();
  }
  /* Ngày lễ, kể cả âm lịch */
  function jdFromDate(dd,mm,yy){var a=Math.floor((14-mm)/12),y=yy+4800-a,m=mm+12*a-3;var jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;if(jd<2299161)jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-32083;return jd}
  function jdToDate(jd){var a,b,c;if(jd>2299160){a=jd+32044;b=Math.floor((4*a+3)/146097);c=a-Math.floor(b*146097/4)}else{b=0;c=jd+32082}var d=Math.floor((4*c+3)/1461),e=c-Math.floor(1461*d/4),m=Math.floor((5*e+2)/153);return [e-Math.floor((153*m+2)/5)+1,m+3-12*Math.floor(m/10),b*100+d-4800+Math.floor(m/10)]}
  function newMoon(k){
    var T=k/1236.85,T2=T*T,T3=T2*T,dr=Math.PI/180;
    var Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;
    Jd1=Jd1+0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);
    var M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3,Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3,F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
    var C1=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*dr*M);
    C1=C1-0.4068*Math.sin(Mpr*dr)+0.0161*Math.sin(dr*2*Mpr)-0.0004*Math.sin(dr*3*Mpr);
    C1=C1+0.0104*Math.sin(dr*2*F)-0.0051*Math.sin(dr*(M+Mpr))-0.0074*Math.sin(dr*(M-Mpr))+0.0004*Math.sin(dr*(2*F+M));
    C1=C1-0.0004*Math.sin(dr*(2*F-M))-0.0006*Math.sin(dr*(2*F+Mpr))+0.0010*Math.sin(dr*(2*F-Mpr))+0.0005*Math.sin(dr*(2*Mpr+M));
    var dt=T<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3:-0.000278+0.000265*T+0.000262*T2;
    return Jd1+C1-dt;
  }
  function sunLong(jdn){
    var T=(jdn-2451545.0)/36525,T2=T*T,dr=Math.PI/180;
    var M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2,L0=280.46645+36000.76983*T+0.0003032*T2;
    var DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M)+(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);
    var L=(L0+DL)*dr;return L-Math.PI*2*Math.floor(L/(Math.PI*2));
  }
  function nmDay(k,tz){return Math.floor(newMoon(k)+0.5+tz/24)}
  function slDay(d,tz){return Math.floor(sunLong(d-0.5-tz/24)/Math.PI*6)}
  function lm11(yy,tz){var off=jdFromDate(31,12,yy)-2415021,k=Math.floor(off/29.530588853),nm=nmDay(k,tz);if(slDay(nm,tz)>=9)nm=nmDay(k-1,tz);return nm}
  function leapOff(a11,tz){var k=Math.floor((a11-2415021.076998695)/29.530588853+0.5),last=0,i=1,arc=slDay(nmDay(k+i,tz),tz);do{last=arc;i++;arc=slDay(nmDay(k+i,tz),tz)}while(arc!==last&&i<14);return i-1}
  function lunar2solar(ld,lm,ly,leap,tz){
    var a11,b11;
    if(lm<11){a11=lm11(ly-1,tz);b11=lm11(ly,tz)}else{a11=lm11(ly,tz);b11=lm11(ly+1,tz)}
    var k=Math.floor(0.5+(a11-2415021.076998695)/29.530588853),off=lm-11;if(off<0)off+=12;
    if(b11-a11>365){
      var lo=leapOff(a11,tz),lmo=lo-2;if(lmo<0)lmo+=12;
      if(leap!==0&&lm!==lmo)return [0,0,0];
      else if(leap!==0||off>=lo)off+=1;
    }
    return jdToDate(nmDay(k+off,tz)+ld-1);
  }
  window.__l2s=function(d,m,y){return lunar2solar(d,m,y,0,7)};
  var HOL=[
    ['Âm lịch','l',[['Tết Nguyên Đán',1,1],['Vía Thần Tài',10,1],['Rằm tháng Giêng',15,1],['Tết Hàn Thực',3,3],['Giỗ Tổ Hùng Vương',10,3],['Lễ Phật Đản',15,4],['Tết Đoan Ngọ',5,5],['Lễ Vu Lan',15,7],['Tết Trung thu',15,8],['Tết Trùng Cửu',9,9],['Rằm tháng Mười',15,10],['Ông Công, Ông Táo',23,12],['Giao thừa (Âm lịch)',0,0]]],
    ['Dương lịch','s',[['Tết Dương lịch',1,1],['Ngày thành lập Đảng',3,2],['Valentine',14,2],['Ngày Thầy thuốc Việt Nam',27,2],['Quốc tế Phụ nữ',8,3],['Valentine trắng',14,3],['Cá tháng Tư',1,4],['Ngày Sách Việt Nam',21,4],['Ngày Trái đất',22,4],['Giải phóng miền Nam',30,4],['Quốc tế Lao động',1,5],['Chiến thắng Điện Biên Phủ',7,5],['Ngày sinh Chủ tịch Hồ Chí Minh',19,5],['Quốc tế Thiếu nhi',1,6],['Ngày Gia đình Việt Nam',28,6],['Ngày Thương binh Liệt sĩ',27,7],['Cách mạng Tháng Tám',19,8],['Quốc khánh',2,9],['Ngày khai giảng',5,9],['Giải phóng Thủ đô',10,10],['Ngày Doanh nhân Việt Nam',13,10],['Ngày Phụ nữ Việt Nam',20,10],['Halloween',31,10],['Ngày Pháp luật Việt Nam',9,11],['Ngày Độc thân',11,11],['Ngày Nhà giáo Việt Nam',20,11],['Ngày Quốc phòng toàn dân',22,12],['Đêm Giáng sinh',24,12],['Giáng sinh',25,12],['Giao thừa (Dương lịch)',31,12]]],
    ['Theo thứ trong tuần','w',[['Ngày của Mẹ',20,5],['Ngày của Cha',30,6],['Lễ Tạ ơn',44,11]]]
  ];
  function holOpts(){
    var h='<option value="">Thêm ngày lễ có sẵn...</option>';
    HOL.forEach(function(g,gi){
      h+='<optgroup label="'+(EN()?({'Âm lịch':'Lunar calendar','Dương lịch':'Solar calendar','Theo thứ trong tuần':'By weekday'}[g[0]]||g[0]):g[0])+'">'+g[2].map(function(x,i){return '<option value="'+gi+':'+i+'">'+esc(x[0])+'</option>'}).join('')+'</optgroup>';
    });
    return h;
  }
  function holDate(kind,d,m){
    var now=new Date(),y=now.getFullYear(),today=new Date(y,now.getMonth(),now.getDate()).getTime(),best=null;
    for(var yy=y-1;yy<=y+1;yy++){
      var dt;
      if(kind==='s')dt=new Date(yy,m-1,d);
      else if(kind==='w'){var f=new Date(yy,m-1,1),n=Math.floor(d/10),wd=d%10;dt=new Date(yy,m-1,1+(wd-f.getDay()+7)%7+(n-1)*7)}
      else if(d===0){var r2=lunar2solar(1,1,yy+1,0,7);if(!r2[0])continue;dt=new Date(r2[2],r2[1]-1,r2[0]-1)}
      else{var r=lunar2solar(d,m,yy,0,7);if(!r[0])continue;dt=new Date(r[2],r[1]-1,r[0])}
      if(dt.getTime()>=today&&(!best||dt<best))best=dt;
    }
    return best?best.getFullYear()+'-'+pad(best.getMonth()+1)+'-'+pad(best.getDate()):null;
  }
  function addHol(v){
    var a=v.split(':'),g=HOL[+a[0]],x=g&&g[2][+a[1]];if(!x)return;
    var dt=holDate(g[1],x[1],x[2]);if(!dt)return;
    if(!DAYS.some(function(e){return e.name===x[0]&&e.date===dt}))DAYS.push({name:x[0],date:dt});
    saveDays();drawDays();
  }
  function drawUpc(){
    var box=$('upcoming');if(!box)return;
    var keys=['Tết Nguyên Đán','Tết Dương lịch','Giỗ Tổ Hùng Vương','Giải phóng miền Nam','Quốc tế Lao động','Tết Trung thu','Quốc khánh','Ngày Nhà giáo Việt Nam','Giáng sinh','Quốc tế Phụ nữ','Ông Công, Ông Táo','Ngày Phụ nữ Việt Nam'],list=[],n0=new Date(),t0=new Date(n0.getFullYear(),n0.getMonth(),n0.getDate()).getTime();
    HOL.forEach(function(g,gi){g[2].forEach(function(x,i){if(keys.indexOf(x[0])>=0){var dt=holDate(g[1],x[1],x[2]);if(dt)list.push({n:x[0],v:gi+':'+i,d:Math.round((tgt(dt)-t0)/864e5)})}})});
    list.sort(function(a,b){return a.d-b.d});list=list.slice(0,4);
    var en=EN();
    box.innerHTML=list.length?'<div class="upc-t">🗓 '+(en?'Coming up':'Sắp tới')+'</div><div class="upc-r">'+list.map(function(x){return '<button type="button" data-v="'+x.v+'"><b>'+esc(x.n)+'</b><span>'+(x.d===0?(en?'Today!':'Hôm nay!'):x.d+(en?' days':' ngày'))+'</span></button>'}).join('')+'</div>':'';
  }
  function days(){
    cancelAnimationFrame(raf);
    panel.innerHTML='<div class="addrow2"><input id="dn" placeholder="Tên sự kiện" maxlength="30"><input id="dd" type="date" aria-label="Ngày"><button data-a="add">Thêm</button></div><select id="dh" class="hsel" aria-label="Ngày lễ có sẵn">'+holOpts()+'</select><div id="dl"></div>';
    panel.onchange=function(e){if(e.target&&e.target.id==='dh'&&e.target.value){addHol(e.target.value);e.target.value=''}};
    panel.onclick=function(e){
      var b=e.target.closest('button');if(!b)return;
      var a=b.getAttribute('data-a'),p=b.getAttribute('data-p'),i=+b.getAttribute('data-i');
      if(a==='add')addDay();
      else if(a==='x'){DAYS.splice(i,1);saveDays();drawDays()}
    };
    drawDays();
  }
  setInterval(function(){
    if(cur!=='days')return;
    DAYS.forEach(function(x,i){var t=dtxt(x.date),a=$('dt'+i),b=$('ds'+i);if(a)a.textContent=t[0];if(b)b.textContent=t[1]});
  },1000);

  /* Thông báo to giữa màn hình */
  var ALERTS=[];
  function showAlert(t,sub,head){$('atitle').textContent=head||'Đến giờ!';
    ALERTS.push({t:t,s:sub||'',h:head||''});
    $('alist').innerHTML=ALERTS.map(function(a){return '<div>'+esc(a.t)+(a.s?'<small>'+esc(a.s)+'</small>':'')+'</div>'}).join('');
    $('alertbox').hidden=false;window.alertOpen=true;
    if(!head)document.title='Đến giờ: '+ALERTS[0].t;
    if(window.bg2Notify)window.bg2Notify(head||'Đến giờ!',(t||'Đã đến giờ.')+(sub?' — '+sub:''));
    $('aok').focus();
  }
  function closeAlert(){ALERTS=[];window.alertOpen=false;$('alertbox').hidden=true;$('alist').innerHTML='';document.title=window.TT}
  $('aok').addEventListener('click',closeAlert);window.showAlert=showAlert;

  /* Nhắc nhở lặp lại */
  var REMS=[];
  try{REMS=JSON.parse(ls('bg2-rems')||'[]')}catch(x){REMS=[]}
  if(!Array.isArray(REMS))REMS=[];
  REMS=REMS.filter(function(r){return r&&typeof r.name==='string'&&r.period>=1000}).map(function(r){return {name:r.name,period:r.period,run:false,next:0,left:r.period,count:0,flash:0}});
  function saveRems(){ls('bg2-rems',JSON.stringify(REMS.map(function(r){return {name:r.name,period:r.period}})))}
  function rleft(r){return r.run?Math.max(0,r.next-Date.now()):r.left}
  function ptxt(ms){var m=Math.floor(ms/60000),sc=Math.round(ms/1000)%60;return (m?m+' phút':'')+(m&&sc?' ':'')+(sc?sc+' giây':'')}
  function drawRems(){
    var cl=$('rl');if(!cl)return;
    cl.innerHTML=REMS.length?REMS.map(function(r,i){
      return '<div class="card" id="rc'+i+'"><div><div class="nm">'+esc(r.name)+', mỗi '+ptxt(r.period)+'</div><div class="tm" id="rt'+i+'">'+mmss(rleft(r))+'</div><div class="nm" id="rn'+i+'">Đã nhắc '+r.count+' lần</div></div><div class="bt"><button data-a="t" data-i="'+i+'">'+(r.run?'Dừng':'Bắt đầu')+'</button><button data-a="x" data-i="'+i+'">Xóa</button></div></div>';
    }).join(''):'<p class="hint">Chưa có nhắc nhở nào. Nhập tên và thời gian lặp lại rồi bấm Thêm.</p>';
  }
  function rem2(){
    cancelAnimationFrame(raf);
    panel.innerHTML='<div class="addrow"><input id="rnm" placeholder="Tên nhắc nhở" maxlength="20"><input id="rm" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" value="20" aria-label="Phút" placeholder="phút"><input id="rs" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" value="0" aria-label="Giây" placeholder="giây"><button data-a="add">Thêm</button></div><div class="chips2"><button data-p="Nghỉ mắt|20">Nghỉ mắt 20 phút</button><button data-p="Uống nước|60">Uống nước 60 phút</button><button data-p="Đứng dậy|45">Đứng dậy 45 phút</button><button data-p="Vươn vai|30">Vươn vai 30 phút</button></div><div id="rl"></div>';
    panel.onclick=function(e){
      var b=e.target.closest('button');if(!b)return;
      var a=b.getAttribute('data-a'),p=b.getAttribute('data-p'),i=+b.getAttribute('data-i'),n=Date.now();
      un();
      if(p){var q=p.split('|');$('rnm').value=q[0];$('rm').value=q[1];$('rs').value=0;return}
      if(a==='add'){
        var ms=((parseInt($('rm').value,10)||0)*60+(parseInt($('rs').value,10)||0))*1000;
        if(ms<1000)return;
        REMS.push({name:$('rnm').value.trim()||'Nhắc nhở '+(REMS.length+1),period:ms,run:true,next:n+ms,left:ms,count:0,flash:0});
        $('rnm').value='';saveRems();
      }else if(a==='t'){
        var r=REMS[i];
        if(r.run){r.left=rleft(r);r.run=false}else{r.run=true;r.next=n+r.left}
      }else if(a==='x'){REMS.splice(i,1);saveRems()}
      drawRems();
    };
    drawRems();
  }
  setInterval(function(){
    var now=Date.now();
    if(window.alertOpen&&ALERTS.length&&!ALERTS[0].h)document.title='Đến giờ: '+ALERTS[0].t;
    REMS.forEach(function(r,i){
      if(r.run&&now>=r.next){
        r.count++;r.next+=r.period;if(r.next<=now)r.next=now+r.period;
        r.flash=now+3000;bp(2,0.5);showAlert(r.name,'Nhắc mỗi '+ptxt(r.period));
      }
      if(cur==='rem'){
        var t=$('rt'+i),c=$('rn'+i),k=$('rc'+i);
        if(t)t.textContent=r.flash>now?'Đến giờ!':mmss(rleft(r));
        if(c)c.textContent='Đã nhắc '+r.count+' lần';
        if(k)k.className='card'+(r.flash>now?' fin':'');
      }
    });
  },250);

  /* Mẫu cài sẵn */
  var PM={cd:1,pomo:1,iv:1,chess:1,exam:1},preBox=$('presets');
  var BUILT={
    iv:[{name:'Tabata 20/10',v:{s1:'20',s2:'10',s3:'8'}},{name:'Plank 30/15',v:{s1:'30',s2:'15',s3:'5'}},
        {name:'HIIT 40/20 x10',v:{s1:'40',s2:'20',s3:'10'}},{name:'Plank 45/15 x4',v:{s1:'45',s2:'15',s3:'4'}},{name:'Nhảy dây 60/30 x6',v:{s1:'60',s2:'30',s3:'6'}},
        {name:'Squat 45/15 x6',v:{s1:'45',s2:'15',s3:'6'}},{name:'Core 30/30 x8',v:{s1:'30',s2:'30',s3:'8'}},{name:'Kéo giãn 30/10 x10',v:{s1:'30',s2:'10',s3:'10'}},{name:'Đi bộ nhanh 3/1 phút x5',v:{s1:'180',s2:'60',s3:'5'}}],
    pomo:[{name:'Pomodoro 25/5',v:{s1:'25',s2:'0',s3:'5',s4:'0',s5:'15',s6:'0'}},{name:'Học 50/10',v:{s1:'50',s2:'0',s3:'10',s4:'0',s5:'20',s6:'0'}},
        {name:'Học nhanh 15/3',v:{s1:'15',s2:'0',s3:'3',s4:'0',s5:'10',s6:'0'}},{name:'Đọc sách 30/5',v:{s1:'30',s2:'0',s3:'5',s4:'0',s5:'15',s6:'0'}},
        {name:'Viết lách 45/10',v:{s1:'45',s2:'0',s3:'10',s4:'0',s5:'20',s6:'0'}},{name:'Tập trung sâu 90/20',v:{s1:'90',s2:'0',s3:'20',s4:'0',s5:'30',s6:'0'}},{name:'Ngoại ngữ 20/5',v:{s1:'20',s2:'0',s3:'5',s4:'0',s5:'15',s6:'0'}}],
    chess:[{name:'Blitz 3+2',v:{s1:'3',s3:'0',s2:'2'}},{name:'Rapid 10+0',v:{s1:'10',s3:'0',s2:'0'}},
        {name:'Bullet 1+0',v:{s1:'1',s3:'0',s2:'0'}},{name:'Blitz 5+3',v:{s1:'5',s3:'0',s2:'3'}},{name:'Rapid 15+10',v:{s1:'15',s3:'0',s2:'10'}},{name:'Cổ điển 30+0',v:{s1:'30',s3:'0',s2:'0'}}],
    cd:[{name:'Trà 3 phút',v:{s1:'3',s2:'0'}},{name:'Trứng lòng đào 6:30',v:{s1:'6',s2:'30'}},{name:'Trứng chín 10 phút',v:{s1:'10',s2:'0'}},{name:'Mì ăn liền 3 phút',v:{s1:'3',s2:'0'}},
        {name:'Đánh răng 2 phút',v:{s1:'2',s2:'0'}},{name:'Nghỉ mắt 20 giây',v:{s1:'0',s2:'20'}},{name:'Đắp mặt nạ 15 phút',v:{s1:'15',s2:'0'}},{name:'Ngủ trưa 20 phút',v:{s1:'20',s2:'0'}},{name:'Thiền 10 phút',v:{s1:'10',s2:'0'}},{name:'Giải lao 5 phút',v:{s1:'5',s2:'0'}}],
    exam:[{name:'Thi 90 phút',v:{s1:'90',s2:'0',s3:'30',s4:'15',s5:'5',s6:'1'}},{name:'Thi 45 phút',v:{s1:'45',s2:'0',s3:'15',s4:'5',s5:'1',s6:'0'}},
        {name:'Thi 120 phút',v:{s1:'120',s2:'0',s3:'60',s4:'30',s5:'15',s6:'5'}},{name:'Thi 60 phút',v:{s1:'60',s2:'0',s3:'30',s4:'15',s5:'5',s6:'1'}},{name:'Kiểm tra 15 phút',v:{s1:'15',s2:'0',s3:'10',s4:'5',s5:'2',s6:'1'}},
        {name:'IELTS Reading 60',v:{s1:'60',s2:'0',s3:'40',s4:'20',s5:'10',s6:'5'}},{name:'IELTS Writing 60',v:{s1:'60',s2:'0',s3:'40',s4:'20',s5:'10',s6:'5'}},{name:'TOEIC 120',v:{s1:'120',s2:'0',s3:'75',s4:'45',s5:'15',s6:'5'}}]
  };
  function getP(m){try{var a=JSON.parse(ls('bg2-presets-'+m)||'[]');return Array.isArray(a)?a:[]}catch(x){return []}}
  function drawPre(){
    if(!PM[cur]){preBox.hidden=true;preBox.innerHTML='';return}
    preBox.hidden=false;
    var u=getP(cur),b=BUILT[cur]||[],h='<div class="pre"><input id="pn" placeholder="Tên mẫu mới" maxlength="20"><button data-a="save">Lưu mẫu</button><button data-a="share">Chia sẻ</button></div><div class="pchips">';
    u.forEach(function(x,i){h+='<span class="pchip"><button data-a="lu" data-i="'+i+'">'+esc(x.name)+'</button><button data-a="du" data-i="'+i+'" aria-label="Xóa mẫu">×</button></span>'});
    h+='</div>';
    if(b.length){h+='<details class="plib"'+(u.length?'':' open')+'><summary>📚 '+(EN()?'Template library':'Thư viện mẫu')+' ('+b.length+')</summary><div class="pchips">';b.forEach(function(x,i){h+='<span class="pchip"><button data-a="lb" data-i="'+i+'">'+esc(x.name)+'</button></span>'});h+='</div></details>'}
    preBox.innerHTML=h;
  }
  function applyP(v){
    Object.keys(v).forEach(function(id){
      var el=$(id);
      if(el&&setBox.contains(el)){el.value=String(v[id]).replace(/\D/g,'');el.dispatchEvent(new Event('input',{bubbles:true}))}
    });
  }
  preBox.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var a=b.getAttribute('data-a'),i=+b.getAttribute('data-i'),u=getP(cur);
    if(a==='share'){var q='m='+cur;setBox.querySelectorAll('input').forEach(function(el){q+='&'+el.id+'='+encodeURIComponent(el.value)});copyText(baseUrl()+'#'+q,b);return}
    if(a==='save'){
      var v={};
      setBox.querySelectorAll('input').forEach(function(el){v[el.id]=el.value});
      if(u.length>=10)u.shift();
      u.push({name:$('pn').value.trim()||'Mẫu '+(u.length+1),v:v});
      ls('bg2-presets-'+cur,JSON.stringify(u));
    }else if(a==='lb'){applyP(BUILT[cur][i].v);return}
    else if(a==='lu'){if(u[i])applyP(u[i].v);return}
    else if(a==='du'){u.splice(i,1);ls('bg2-presets-'+cur,JSON.stringify(u))}
    drawPre();
  });

  /* Phím tắt cho các tab riêng */
  function hit(sel){var b=panel.querySelector(sel);if(b)b.click()}
  document.addEventListener('keydown',function(e){
    if(window.alertOpen){if(e.code==='Space'||e.key==='Enter'||e.key==='Escape'){e.preventDefault();closeAlert()}return}
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    var tg=e.target.tagName;
    if(tg==='INPUT'){
      if(e.key==='Enter'&&e.target.id==='pn'){var sb=preBox.querySelector('[data-a="save"]');if(sb)sb.click()}
      else if(e.key==='Enter'&&(cur==='cook'||cur==='days'||cur==='rem'))hit('[data-a="add"]');
      return;
    }
    if(tg==='SELECT'||tg==='TEXTAREA')return;
    if(e.code==='Space'&&window.__nativeSpace&&window.__nativeSpace(e.target))return;
    var k=e.key.toLowerCase();
    if(cur==='chess'){
      if(e.code==='Space'){e.preventDefault();hit('[data-i="'+((ch&&ch.a>=0)?ch.a:0)+'"]')}
      else if(k==='p')hit('[data-a="p"]');
      else if(k==='r')hit('[data-a="r"]');
    }else if(cur==='breath'){
      if(e.code==='Space'){e.preventDefault();hit('#bgo')}
    }
  });

  /* Quy trình nhiều bước */
  var SEQ=[];
  try{SEQ=JSON.parse(ls('bg2-seq')||'[]')}catch(x){SEQ=[]}
  if(!Array.isArray(SEQ))SEQ=[];
  SEQ=SEQ.filter(function(x){return x&&typeof x.n==='string'&&x.ms>=1000});
  function saveSeq(){ls('bg2-seq',JSON.stringify(SEQ))}
  window.seqSteps=function(){return SEQ.map(function(x){return {n:x.n,ms:x.ms}})};
  var SBUILT=[
    {name:'Buổi sáng',st:[['Đánh răng',120],['Tập thể dục',300],['Ăn sáng',900]]},
    {name:'Học 3 bước',st:[['Ôn bài cũ',600],['Học bài mới',1500],['Làm bài tập',900]]},
    {name:'Tập cơ bản',st:[['Khởi động',180],['Tập chính',900],['Giãn cơ',300]]},
    {name:'Thiền sáng 10 phút',st:[['Thở sâu',120],['Quét cơ thể',300],['Biết ơn',180]]},
    {name:'Ôn thi 90 phút',st:[['Ôn lý thuyết',1800],['Làm đề',2400],['Chữa lỗi',900],['Tổng kết',300]]},
    {name:'Nấu mì ăn liền',st:[['Đun nước',180],['Cho mì vào',180],['Ủ mì',60]]},
    {name:'Dọn nhà nhanh 15 phút',st:[['Gom đồ',300],['Quét và lau',480],['Đổ rác',120]]},
    {name:'Giãn cơ văn phòng',st:[['Cổ và vai',60],['Lưng',60],['Cổ tay',60],['Chân',60]]},
    {name:'Rửa mặt và skincare',st:[['Rửa mặt',90],['Toner',60],['Dưỡng ẩm',60]]},
    {name:'Thuyết trình 10 phút',st:[['Mở bài',60],['Nội dung',420],['Kết luận',60],['Hỏi đáp',60]]}
  ];
  function stTpl(){try{var a=JSON.parse(ls('bg2-seq-tpl')||'[]');return Array.isArray(a)?a:[]}catch(x){return []}}
  function mm(ms){var t=Math.round(ms/1000);return Math.floor(t/60)+':'+pad(t%60)}
  function seqLink(){return baseUrl()+'#m=seq&st='+encodeURIComponent(SEQ.map(function(x){return encodeURIComponent(x.n)+':'+Math.round(x.ms/1000)}).join('|'))}
  function drawSeq(){
    var sl=$('sl'),qc=$('qc');if(!sl)return;
    sl.innerHTML=SEQ.length?SEQ.map(function(x,i){
      return '<div class="srow"><span class="sn">'+(i+1)+'. '+esc(x.n)+'</span><span class="st">'+mm(x.ms)+'</span><button data-a="up" data-i="'+i+'" aria-label="Lên">↑</button><button data-a="dn" data-i="'+i+'" aria-label="Xuống">↓</button><button data-a="rm" data-i="'+i+'" aria-label="Xóa bước">×</button></div>';
    }).join(''):'<p class="hint" style="margin-top:0">Chưa có bước nào. Thêm bước bên dưới hoặc chọn một mẫu.</p>';
    var h='';
    stTpl().forEach(function(x,i){h+='<span class="pchip"><button data-a="lu" data-i="'+i+'">'+esc(x.name)+'</button><button data-a="du" data-i="'+i+'" aria-label="Xóa mẫu">×</button></span>'});
    h+='<details class="plib"'+(stTpl().length?'':' open')+'><summary>📚 '+(EN()?'Template library':'Thư viện mẫu')+' ('+SBUILT.length+')</summary><div class="pchips">';
    SBUILT.forEach(function(x,i){h+='<span class="pchip"><button data-a="lb" data-i="'+i+'">'+esc(x.name)+'</button></span>'});
    qc.innerHTML=h+'</div></details>';
  }
  function seqUI(){
    var box=$('seqbox');if(!box)return;
    box.innerHTML='<div id="sl"></div><div class="addrow"><input id="qn" placeholder="Tên bước" maxlength="24"><input id="qm" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" value="2" aria-label="Phút" placeholder="phút"><input id="qs" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" value="0" aria-label="Giây" placeholder="giây"><button data-a="add">Thêm</button></div><div class="pre"><input id="qt" placeholder="Tên quy trình" maxlength="20"><button data-a="save">Lưu</button><button data-a="share">Chia sẻ</button></div><div class="pchips" id="qc"></div>';
    drawSeq();
    box.onclick=function(e){
      var b=e.target.closest('button');if(!b)return;
      var a=b.getAttribute('data-a'),i=+b.getAttribute('data-i');
      if(a==='add'){
        var ms=((parseInt($('qm').value,10)||0)*60+(parseInt($('qs').value,10)||0))*1000;
        if(ms<1000||SEQ.length>=30)return;
        SEQ.push({n:$('qn').value.trim()||'Bước '+(SEQ.length+1),ms:ms});$('qn').value='';
      }else if(a==='rm'){SEQ.splice(i,1)}
      else if(a==='up'&&i>0){var t1=SEQ[i];SEQ[i]=SEQ[i-1];SEQ[i-1]=t1}
      else if(a==='dn'&&i<SEQ.length-1){var t2=SEQ[i];SEQ[i]=SEQ[i+1];SEQ[i+1]=t2}
      else if(a==='save'){
        if(!SEQ.length)return;
        var tp=stTpl();if(tp.length>=10)tp.shift();
        tp.push({name:$('qt').value.trim()||'Quy trình '+(tp.length+1),st:SEQ.map(function(x){return [x.n,Math.round(x.ms/1000)]})});
        ls('bg2-seq-tpl',JSON.stringify(tp));$('qt').value='';
      }else if(a==='lb'||a==='lu'){
        var src=a==='lb'?SBUILT[i]:stTpl()[i];if(!src)return;
        SEQ=src.st.map(function(x){return {n:x[0],ms:x[1]*1000}});
      }else if(a==='du'){var tp2=stTpl();tp2.splice(i,1);ls('bg2-seq-tpl',JSON.stringify(tp2))}
      else if(a==='share'){copyText(seqLink(),b);return}
      saveSeq();drawSeq();setBox.dispatchEvent(new Event('input',{bubbles:true}));
    };
  }

  /* Giao diện, chữ to, âm nền */
  var thm=$('thm'),bgc=$('big'),amb=$('amb');
  var tv=ls('bg2-theme')||'auto';
  if(thm.querySelector('option[value="'+tv+'"]'))thm.value=tv;
  thm.addEventListener('change',function(){
    if(thm.value==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',thm.value);
    ls('bg2-theme',thm.value);
  });
  bgc.checked=ls('bg2-big')==='1';
  bgc.addEventListener('change',function(){document.documentElement.classList.toggle('big',bgc.checked);ls('bg2-big',bgc.checked?'1':'0')});
  var ambSrc=null,ambGain=null,ambBase=0,ambX=[];
  function ambVol(){if(ambGain)ambGain.gain.value=ambBase*(window.vol==null?1:window.vol)}
  function ambStop(){if(ambSrc){try{ambSrc.stop()}catch(x){}ambSrc=null}ambX.forEach(function(n){try{n.stop()}catch(x){}});ambX=[]}
  amb.addEventListener('change',function(){
    ambStop();
    var kind=amb.value;if(kind==='off')return;
    un();
    var ac=window.getAC&&window.getAC();if(!ac)return;
    var len=ac.sampleRate*3,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0),last=0,crack=0;
    for(var i=0;i<len;i++){
      var w=Math.random()*2-1;
      if(kind==='brown'){last=(last+0.02*w)/1.02;d[i]=last*3.5}
      else if(kind==='fire'){last=(last+0.02*w)/1.02;if(Math.random()<0.0006)crack=1;d[i]=last*2.2+w*crack*0.7;crack*=0.992}
      else d[i]=w;
    }
    var src=ac.createBufferSource();src.buffer=buf;src.loop=true;
    ambGain=ac.createGain();ambBase=kind==='brown'?0.5:kind==='rain'?0.2:kind==='ocean'?0.4:kind==='wind'?0.3:kind==='fire'?0.5:0.08;ambVol();
    function lfo(hz,depth,target){var o=ac.createOscillator(),g=ac.createGain();o.frequency.value=hz;g.gain.value=depth;o.connect(g);g.connect(target);o.start();ambX.push(o)}
    if(kind==='rain'){
      var hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=700;
      var lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=7000;
      src.connect(hp);hp.connect(lp);lp.connect(ambGain);
    }else if(kind==='ocean'){
      var lo=ac.createBiquadFilter();lo.type='lowpass';lo.frequency.value=750;
      src.connect(lo);lo.connect(ambGain);lfo(0.11,ambBase*0.8,ambGain.gain);
    }else if(kind==='wind'){
      var bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=480;bp.Q.value=1.1;
      src.connect(bp);bp.connect(ambGain);lfo(0.07,260,bp.frequency);lfo(0.13,ambBase*0.5,ambGain.gain);
    }else src.connect(ambGain);
    ambGain.connect(ac.destination);src.start();ambSrc=src;
  });
  vol.addEventListener('input',ambVol);

  /* Tiếng báo */
  var SND=[{n:'Bíp',t:'square',f:880},{n:'Chuông',t:'sine',f:660},{n:'Còi',t:'sawtooth',f:520},{n:'Nhẹ',t:'triangle',f:784}];
  var ss=$('snd');
  ss.innerHTML=SND.map(function(x,i){return '<option value="'+i+'">'+x.n+'</option>'}).join('');
  var sIdx=parseInt(ls('bg-snd'),10);if(!(sIdx>=0&&sIdx<SND.length))sIdx=0;
  ss.value=sIdx;window.snd=SND[sIdx];
  ss.addEventListener('change',function(){window.snd=SND[+ss.value];ls('bg-snd',ss.value);un();bp(1,0.4)});

  /* Giữ màn hình sáng khi đang chạy */
  var wl=null;
  function wlTick(){
    if(!navigator.wakeLock)return;
    var on=(window.isActive&&window.isActive())||(bOn&&cur==='breath')||(cur==='chess'&&ch&&ch.a>=0&&!ch.pause&&ch.over<0)||timers.some(function(t){return t.run})||REMS.some(function(r){return r.run});
    if(on&&!wl){wl='pending';navigator.wakeLock.request('screen').then(function(l){wl=l;l.addEventListener('release',function(){wl=null})}).catch(function(){wl=null})}
    else if(!on&&wl&&wl!=='pending'){wl.release();wl=null}
  }
  setInterval(wlTick,1000);

  /* Thống kê */
  function ctr(v,e){return document.documentElement.lang==='en'?e:v}
  var NM={track:'Ghi giờ',breath:'Hít thở',pomo:'Pomodoro',iv:'Tập luyện',cd:'Đếm ngược',seq:'Quy trình',exam:'Đồng hồ thi',cook:'Nấu ăn',chess:'Cờ vua'};
  function dk(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
  function load(){try{return JSON.parse(ls('bg-stats')||'{}')}catch(e){return {}}}
  function dur(ms){var m=Math.round(ms/60000);if(ms<60000)return Math.round(ms/1000)+' giây';return m>=60?Math.floor(m/60)+' giờ '+(m%60)+' phút':m+' phút'}
  function goalMin(){var g=parseInt(ls('bg2-goal'),10);return g>=1?g:30}
  function dayMs(o){var t=0;for(var m in o)t+=o[m][0];return t}
  function streaks(d){
    var cur=0,d2=new Date();
    if(!Object.keys(d[dk(d2)]||{}).length)d2.setDate(d2.getDate()-1);
    while(Object.keys(d[dk(d2)]||{}).length){cur++;d2.setDate(d2.getDate()-1)}
    var ks=Object.keys(d).filter(function(k){return Object.keys(d[k]).length}).sort(),best=0,run=0,pv=null;
    ks.forEach(function(k){var t=new Date(k+'T12:00:00');if(pv&&Math.round((t-pv)/864e5)===1)run++;else run=1;if(run>best)best=run;pv=t});
    return {cur:cur,best:best};
  }
  function drawStats(){
    var d=load(),t=d[dk(new Date())]||{},goal=goalMin(),i,wk=0,hit=0;
    for(i=6;i>=0;i--){var dt=new Date();dt.setDate(dt.getDate()-i);wk+=dayMs(d[dk(dt)]||{})/60000}
    for(i=0;i<30;i++){var d3=new Date();d3.setDate(d3.getDate()-i);if(dayMs(d[dk(d3)]||{})/60000>=goal)hit++}
    var sk=streaks(d),tm=dayMs(t)/60000,pc=Math.min(100,tm/goal*100);
    $('st-goal').innerHTML='<div class="gl"><span>Mục tiêu hôm nay</span><b>'+Math.floor(tm)+' / '+goal+' phút</b></div><div class="gbar"><i style="width:'+pc.toFixed(1)+'%"></i></div>';
    $('st-sum').innerHTML='<div class="stchips"><span>📆 '+ctr('7 ngày qua','Last 7 days')+'<b>'+(wk>0?dur(wk*60000):ctr('chưa có','none'))+'</b></span><span>🔥 '+ctr('Chuỗi','Streak')+'<b>'+sk.cur+' '+ctr('ngày','days')+'</b><small>'+ctr('dài nhất ','best ')+sk.best+'</small></span><span>⭐ '+ctr('Đạt mục tiêu','Goal met')+'<b>'+hit+'/30</b></span></div>';
    drawCal();
    drawBadges(d,sk);
  }
  function badgeList(d,sk){
    var tot=0,ses=0,goal=goalMin(),hits=0;
    Object.keys(d).forEach(function(k){var o=d[k],m=dayMs(o);if(m/60000>=goal)hits++;for(var x in o){tot+=o[x][0];ses+=o[x][1]}});
    return [
      ['🌱',ctr('Khởi đầu','First step'),ses>=1,Math.min(ses,1)+'/1'],
      ['🔥',ctr('3 ngày liên tiếp','3-day streak'),sk.best>=3,Math.min(sk.best,3)+'/3'],
      ['🏅',ctr('7 ngày liên tiếp','7-day streak'),sk.best>=7,Math.min(sk.best,7)+'/7'],
      ['🏆',ctr('30 ngày liên tiếp','30-day streak'),sk.best>=30,Math.min(sk.best,30)+'/30'],
      ['⏱️',ctr('Đủ 10 giờ','10 hours total'),tot>=36e6,Math.min(10,Math.floor(tot/36e5))+'/10 h'],
      ['💎',ctr('Đủ 100 giờ','100 hours total'),tot>=36e7,Math.min(100,Math.floor(tot/36e5))+'/100 h'],
      ['🍅',ctr('50 phiên','50 sessions'),ses>=50,Math.min(ses,50)+'/50'],
      ['⭐',ctr('10 ngày đạt mục tiêu','10 goal days'),hits>=10,Math.min(hits,10)+'/10']
    ];
  }
  function unlockThemes(best){
    var T2=[['sunset','🌇 Hoàng hôn','Sunset',7],['gold','✨ Vàng kim','Gold',30]],thm=$('thm');if(!thm)return;
    T2.forEach(function(t){
      var o=thm.querySelector('option[value="'+t[0]+'"]');if(!o)return;
      var ok=best>=t[3];o.disabled=!ok;
      o.textContent=ok?(EN()?t[2]:t[1].replace(/^\S+ /,''))+(ok?' ★':''):'🔒 '+(EN()?t[2]:t[1].replace(/^\S+ /,''))+(EN()?' (streak '+t[3]+' days)':' (chuỗi '+t[3]+' ngày)');
    });
  }
  function drawBadges(d,sk){
    var box=$('st-badges');if(!box)return;
    var B=badgeList(d,sk),got=B.filter(function(b){return b[2]}).length;
    unlockThemes(sk.best);
    box.innerHTML='<div class="calt">🏆 '+ctr('Huy hiệu','Badges')+' · '+got+'/'+B.length+'</div><div class="bdgs">'+B.map(function(b){return '<span class="bdg'+(b[2]?' on':'')+'" title="'+b[1]+'"><i>'+b[0]+'</i><small>'+b[1]+'</small><em>'+(b[2]?'✓':b[3])+'</em></span>'}).join('')+'</div>'+
      '<div class="stshare"><button type="button" id="st-share">📸 '+ctr('Chia sẻ thành tích','Share my progress')+'</button></div>';
    var sb=$('st-share');if(sb&&!sb._b){sb._b=1;sb.addEventListener('click',shareCard)}
  }
  function shareCard(){
    try{
      var d=load(),goal=goalMin(),sk=streaks(d),i,wk=0,tm=Math.round(dayMs(d[dk(new Date())]||{})/60000);
      for(i=6;i>=0;i--){var dt=new Date();dt.setDate(dt.getDate()-i);wk+=dayMs(d[dk(dt)]||{})/60000}
      var B=badgeList(d,sk),got=B.filter(function(b){return b[2]}).length;
      var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
      var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0a1b2b');g.addColorStop(.55,'#0f4a45');g.addColorStop(1,'#2f7d6b');x.fillStyle=g;x.fillRect(0,0,W,H);
      x.globalAlpha=.12;x.fillStyle='#fff';x.beginPath();x.arc(W-60,140,300,0,7);x.fill();x.beginPath();x.arc(80,H-120,360,0,7);x.fill();x.globalAlpha=1;
      var F='system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';x.textAlign='center';x.fillStyle='#fff';
      x.font='700 56px '+F;x.fillText('⏱ Bấm giờ',W/2,150);
      x.font='800 340px '+F;x.fillText(String(sk.cur),W/2,610);
      x.font='600 66px '+F;x.fillText(ctr('ngày liên tiếp','day streak')+' 🔥',W/2,710);
      var items=[[tm+' '+ctr('phút','min'),ctr('hôm nay','today')],[Math.round(wk/60*10)/10+' '+ctr('giờ','h'),ctr('7 ngày qua','last 7 days')],[got+'/'+B.length,ctr('huy hiệu','badges')]];
      items.forEach(function(it,k){
        var cx=180+k*360;x.fillStyle='rgba(255,255,255,.14)';x.beginPath();if(x.roundRect)x.roundRect(cx-165,800,330,230,32);else x.rect(cx-165,800,330,230);x.fill();
        x.fillStyle='#fff';x.font='800 70px '+F;x.fillText(it[0],cx,905);x.font='500 36px '+F;x.globalAlpha=.8;x.fillText(it[1],cx,968);x.globalAlpha=1;
      });
      x.font='500 40px '+F;x.globalAlpha=.9;x.fillText(ctr('Dài nhất: ','Best: ')+sk.best+' '+ctr('ngày','days')+'  ·  '+ctr('Mục tiêu: ','Goal: ')+goal+' '+ctr('phút/ngày','min/day'),W/2,1120);
      x.globalAlpha=.75;x.font='500 38px '+F;x.fillText('namnguyen95800-coder.github.io',W/2,1250);x.globalAlpha=1;
      c.toBlob(function(blob){
        if(!blob)return;var name='thanh-tich-bam-gio.png',C=window.Capacitor;
        if(window.SAVE&&C&&C.isNativePlatform&&C.isNativePlatform()){window.SAVE(name,blob,'image/png');return}
        try{var f=new File([blob],name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Bấm giờ'}).catch(function(){});return}}catch(e){}
        var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1500);
      },'image/png');
    }catch(e){}
  }
  /* Lịch tháng gắn với thống kê và chuỗi ngày */
  var calM=new Date();calM=new Date(calM.getFullYear(),calM.getMonth(),1);var calSel=dk(new Date()),calInit=false;
  function drawCal(){
    var box=$('st-cal');if(!box||!window.CAL)return;
    window.CAL.css();
    var d=load(),goal=goalMin(),y=calM.getFullYear(),m=calM.getMonth(),cells=window.CAL.cells(y,m),td=dk(new Date()),act=0,tot=0;
    var g=cells.map(function(c){
      if(!c)return '<i></i>';
      var k=dk(c),mn=dayMs(d[k]||{})/60000;if(mn>0){act++;tot+=mn}
      var r=mn/goal,lv=mn<=0?0:r<.25?1:r<.5?2:r<1?3:4;
      return '<button type="button" data-k="'+k+'" class="l'+lv+(r>=1?' hit':'')+(k===td?' td':'')+(k===calSel?' sel':'')+(k>td?' fu':'')+'">'+c.getDate()+'</button>';
    }).join('');
    var det='';
    if(calSel){
      var o=d[calSel]||{},keys=Object.keys(o),rows=keys.map(function(mm){return '<div class="cr"><span>'+(NM[mm]||mm)+'</span><b>'+dur(o[mm][0])+'</b><small>'+o[mm][1]+' '+ctr('lần','times')+'</small></div>'}).join('');
      det='<div class="calinfo"><b>'+calSel.split('-').reverse().join('/')+(keys.length?' · '+dur(dayMs(o)):'')+'</b>'+(rows||'<div class="cr"><span>'+(calSel===dk(new Date())?ctr('Hôm nay chưa có lượt nào hoàn thành.','Nothing completed yet today.'):ctr('Ngày này chưa có lượt nào.','Nothing recorded on this day.'))+'</span></div>')+'</div>';
    }
    box.innerHTML='<div class="calh"><button type="button" data-n="-1" aria-label="'+ctr('Tháng trước','Previous month')+'">◀</button><b>'+window.CAL.title(y,m)+'</b><button type="button" data-n="1" aria-label="'+ctr('Tháng sau','Next month')+'">▶</button><button type="button" data-n="0">'+ctr('Hôm nay','Today')+'</button></div>'+
      '<div class="calw">'+window.CAL.wk().map(function(w){return '<span>'+w+'</span>'}).join('')+'</div><div class="calg">'+g+'</div>'+
      '<div class="calsum">'+ctr('Tháng này: ','This month: ')+act+' '+ctr('ngày có hoạt động','active days')+(tot>0?' · '+dur(tot*60000):'')+' · '+ctr('viền xanh = đạt mục tiêu','green border = goal met')+'</div>'+det;
    if(!calInit){
      calInit=true;
      box.addEventListener('click',function(e){
        var b=e.target.closest('button');if(!b)return;
        var n=b.getAttribute('data-n'),k=b.getAttribute('data-k');
        if(n!==null){calM=(n==='0')?new Date(new Date().getFullYear(),new Date().getMonth(),1):new Date(calM.getFullYear(),calM.getMonth()+(+n),1);if(n==='0')calSel=dk(new Date());drawCal()}
        else if(k){calSel=k;drawCal()}
      });
    }
  }
  /* Hiệu ứng nhỏ */
  var toastT=0;
  function toast(msg){var t=$('toast');t.textContent=msg;t.hidden=false;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},3200)}
  function confetti(n){
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var box=document.createElement('div');box.className='cfbox';
    var cols=['#2ec99d','#ffb84d','#ff7a5f','#7aa2ff','#f78fd0'];
    for(var i=0;i<n;i++){var e=document.createElement('i');e.style.left=(8+Math.random()*84)+'%';e.style.background=cols[i%cols.length];e.style.setProperty('--dx',(Math.random()*180-90)+'px');e.style.animationDelay=(Math.random()*.25)+'s';e.style.animationDuration=(1.1+Math.random()*.8)+'s';box.appendChild(e)}
    document.body.appendChild(box);setTimeout(function(){if(box.parentNode)box.parentNode.removeChild(box)},2500);
  }
  window.celebrate=function(big){confetti(big?46:16)};
  window.logStat=function(m,ms){
    try{
      var end=Date.now(),start=Math.max(0,end-ms),arr=[];
      try{arr=JSON.parse(ls('bg2-replay')||'[]')}catch(e){}
      var live=null;
      for(var i=arr.length-1;i>=0;i--){if(arr[i].open&&arr[i].m===m&&Math.abs(arr[i].s-start)<60000){live=arr[i];break}}
      if(live){live.e=end;live.open=false}
      else arr.push({m:m,s:start,e:end,open:false});
      if(arr.length>1000)arr=arr.slice(arr.length-1000);
      ls('bg2-replay',JSON.stringify(arr));
      if(typeof drawReplay==='function')drawReplay();
    }catch(e){}

    var d=load(),k=dk(new Date());
    d[k]=d[k]||{};var r=d[k][m]||[0,0];r[0]+=ms;r[1]+=1;d[k][m]=r;
    var keys=Object.keys(d).sort();while(keys.length>800)delete d[keys.shift()];
    ls('bg-stats',JSON.stringify(d));drawStats();
    if(dayMs(d[k])/60000>=goalMin()&&ls('bg2-goal-hit')!==k){ls('bg2-goal-hit',k);window.celebrate(true);toast('Đạt mục tiêu hôm nay! 🎉')}
  };
  var gin=$('st-goal-in');gin.value=goalMin();
  gin.addEventListener('input',function(){var v=parseInt(gin.value,10);if(v>=1){ls('bg2-goal',String(v));drawStats()}});
  $('st-clear').addEventListener('click',function(){ls('bg-stats','{}');drawStats()});
  $('st-csv').addEventListener('click',function(){
    try{
      var range=$('st-csv-range').value,limit=range==='all'?0:parseInt(range,10),cutoff='';
      if(limit){var dt=new Date();dt.setDate(dt.getDate()-(limit-1));cutoff=dk(dt);}
      var d=load()||{},rows=[['Ngay','Cong cu','Phut','So lan']],count=0;
      Object.keys(d).sort().forEach(function(k){
        if(cutoff&&k<cutoff)return;
        Object.keys(NM).forEach(function(m){
          var v=d[k][m];
          if(v&&v[0]){rows.push([k,NM[m],(v[0]/60000).toFixed(2),v[1]||0]);count++;}
        });
      });
      if(!count){toast('Chưa có dữ liệu trong khoảng thời gian này.');return;}
      var csv=rows.map(function(r){return r.map(function(x){return '"'+String(x).replace(/"/g,'""')+'"'}).join(',')}).join('\r\n');
      var fname='thong-ke-bam-gio'+(limit?'-'+limit+'-ngay':'')+'.csv';
      if(window.SAVE&&window.SAVE(fname,'\ufeff'+csv,'text/csv')){toast('Đã xuất '+count+' dòng thống kê.');return;}
      var blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
      var url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='thong-ke-bam-gio'+(limit?'-'+limit+'-ngay':'')+'.csv';
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(url)},1000);
      toast('Đã xuất '+count+' dòng thống kê.');
    }catch(e){toast('Không xuất được CSV.');}
  });
  drawStats();
  drawUpc();setInterval(drawUpc,600000);
  var upb=$('upcoming');
  if(upb)upb.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    addHol(b.getAttribute('data-v'));
    var t=document.querySelector('#tabs [data-m="days"]');if(t)t.click();
  });
  /* Time Replay */
  var RP_COLORS={pomo:'#4f8cff',iv:'#2ec99d',cd:'#ffb84d',seq:'#a78bfa',exam:'#ff7a5f',cook:'#f472b6',chess:'#94a3b8'};
  var rpOffset=0,rpView='day';
  function rpDate(){var d=new Date();d.setDate(d.getDate()-rpOffset);return d}
  function rpAll(){try{return JSON.parse(ls('bg2-replay')||'[]')}catch(e){return[]}}
  function rpSave(a){try{ls('bg2-replay',JSON.stringify(a.slice(-1000)))}catch(e){}}
  function rpUpsertLive(){
    try{
      if(typeof running==='undefined'||!running||typeof mode==='undefined')return;
      if(mode==='chess'||mode==='cook'||mode==='breath'||mode==='days'||mode==='rem'||mode==='world'||mode==='sleep'||mode==='dcalc'||window.PX[mode])return;
      var now=Date.now(),start=(typeof startAt!=='undefined'&&startAt)?startAt:now;
      var arr=rpAll(),found=null;
      for(var i=arr.length-1;i>=0;i--){if(arr[i].open&&arr[i].m===mode&&Math.abs(arr[i].s-start)<60000){found=arr[i];break}}
      if(found){found.e=now}else arr.push({m:mode,s:start,e:now,open:true});
      rpSave(arr);
      if(typeof drawReplay==='function')drawReplay();
    }catch(e){}
  }
  function rpMakeBlock(x){
    var st=new Date(x.s),en=new Date(x.e),b=document.createElement('i');
    b.className='rp-block';
    var left=Math.max(0,(st.getHours()*60+st.getMinutes()+st.getSeconds()/60)/1440*100);
    var width=Math.max(.35,Math.min(((en-st)/86400000)*100,100-left));
    b.style.left=left+'%';b.style.width=width+'%';
    b.style.background=RP_COLORS[x.m]||'#94a3b8';
    b.title=(NM[x.m]||x.m)+(x.open?' (đang chạy)':'')+' · '+pad(st.getHours())+':'+pad(st.getMinutes())+'–'+pad(en.getHours())+':'+pad(en.getMinutes())+' · '+dur(Math.max(0,x.e-x.s));
    return b;
  }
  function drawReplay(){
    var track=$('rp-track'),blocks=$('rp-blocks'),empty=$('rp-empty');if(!track)return;
    var d=rpDate(),key=dk(d),all=rpAll(),shown=[];
    $('rp-date').textContent=rpView==='day'?(rpOffset===0?'Hôm nay':rpOffset===1?'Hôm qua':pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()):('Tuần từ '+pad(d.getDate())+'/'+pad(d.getMonth()+1));
    $('rp-next').disabled=rpOffset<=0;
    $('rp-day-wrap').classList.toggle('hidden',rpView!=='day');
    $('rp-week-wrap').classList.toggle('hidden',rpView!=='week');
    if(rpView==='day'){
      var hours='';for(var h=0;h<24;h+=3)hours+='<span>'+pad(h)+'</span>';
      track.querySelector('.rp-hours').innerHTML=hours;
      var bc=$('rp-blocks');bc.innerHTML='';
      all.filter(function(x){return dk(new Date(x.s))===key&&x.e>x.s}).forEach(function(x){bc.appendChild(rpMakeBlock(x));shown.push(1)});
      empty.hidden=shown.length>0;
    }else{
      var week=$('rp-week');week.innerHTML='';var names=['CN','T2','T3','T4','T5','T6','T7'];
      for(var i=6;i>=0;i--){
        var dd=new Date();dd.setDate(dd.getDate()-rpOffset-i);
        var k=dk(dd),row=document.createElement('div');row.className='rp-week-row';
        var line=document.createElement('div');line.className='rp-week-line';
        var items=all.filter(function(x){return dk(new Date(x.s))===k&&x.e>x.s});
        items.forEach(function(x){line.appendChild(rpMakeBlock(x))});
        row.innerHTML='<span class="rp-week-label">'+names[dd.getDay()]+' '+pad(dd.getDate())+'/'+pad(dd.getMonth()+1)+'</span>';
        row.appendChild(line);week.appendChild(row);
        if(items.length)shown.push(1);
      }
      empty.hidden=shown.length>0;
    }
  }
  $('rp-prev').addEventListener('click',function(){rpOffset++;drawReplay()});
  $('rp-next').addEventListener('click',function(){if(rpOffset>0){rpOffset--;drawReplay()}});
  $('rp-view-day').addEventListener('click',function(){rpView='day';$('rp-view-day').classList.add('rp-active');$('rp-view-week').classList.remove('rp-active');drawReplay()});
  $('rp-view-week').addEventListener('click',function(){rpView='week';$('rp-view-week').classList.add('rp-active');$('rp-view-day').classList.remove('rp-active');drawReplay()});
  setInterval(rpUpsertLive,15000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')rpUpsertLive()});
  window.addEventListener('beforeunload',rpUpsertLive);
  drawReplay();
  /* Giờ thế giới */
  var CITIES=[
    ['Hà Nội','Việt Nam','Asia/Ho_Chi_Minh','Châu Á'],['Bangkok','Thái Lan','Asia/Bangkok','Châu Á'],['Phnom Penh','Campuchia','Asia/Phnom_Penh','Châu Á'],['Viêng Chăn','Lào','Asia/Vientiane','Châu Á'],['Yangon','Myanmar','Asia/Yangon','Châu Á'],['Singapore','Singapore','Asia/Singapore','Châu Á'],['Kuala Lumpur','Malaysia','Asia/Kuala_Lumpur','Châu Á'],['Jakarta','Indonesia','Asia/Jakarta','Châu Á'],['Manila','Philippines','Asia/Manila','Châu Á'],['Bắc Kinh','Trung Quốc','Asia/Shanghai','Châu Á'],['Hồng Kông','Trung Quốc','Asia/Hong_Kong','Châu Á'],['Đài Bắc','Đài Loan','Asia/Taipei','Châu Á'],['Tokyo','Nhật Bản','Asia/Tokyo','Châu Á'],['Seoul','Hàn Quốc','Asia/Seoul','Châu Á'],['Ulaanbaatar','Mông Cổ','Asia/Ulaanbaatar','Châu Á'],['New Delhi','Ấn Độ','Asia/Kolkata','Châu Á'],['Kathmandu','Nepal','Asia/Kathmandu','Châu Á'],['Dhaka','Bangladesh','Asia/Dhaka','Châu Á'],['Karachi','Pakistan','Asia/Karachi','Châu Á'],['Colombo','Sri Lanka','Asia/Colombo','Châu Á'],['Dubai','Các Tiểu vương quốc Ả Rập (UAE)','Asia/Dubai','Châu Á'],['Riyadh','Ả Rập Xê Út','Asia/Riyadh','Châu Á'],['Doha','Qatar','Asia/Qatar','Châu Á'],['Tehran','Iran','Asia/Tehran','Châu Á'],['Jerusalem','Israel','Asia/Jerusalem','Châu Á'],['Istanbul','Thổ Nhĩ Kỳ','Europe/Istanbul','Châu Á'],['Vladivostok','Nga','Asia/Vladivostok','Châu Á'],['Tashkent','Uzbekistan','Asia/Tashkent','Châu Á'],['Almaty','Kazakhstan','Asia/Almaty','Châu Á'],['Baku','Azerbaijan','Asia/Baku','Châu Á'],['Tbilisi','Gruzia','Asia/Tbilisi','Châu Á'],['Yerevan','Armenia','Asia/Yerevan','Châu Á'],['Kabul','Afghanistan','Asia/Kabul','Châu Á'],['Baghdad','Iraq','Asia/Baghdad','Châu Á'],['Kuwait City','Kuwait','Asia/Kuwait','Châu Á'],['Muscat','Oman','Asia/Muscat','Châu Á'],['Beirut','Li-băng','Asia/Beirut','Châu Á'],['Amman','Jordan','Asia/Amman','Châu Á'],['Malé','Maldives','Indian/Maldives','Châu Á'],['Macao','Trung Quốc','Asia/Macau','Châu Á'],['Bandar Seri Begawan','Brunei','Asia/Brunei','Châu Á'],['Thimphu','Bhutan','Asia/Thimphu','Châu Á'],['Yekaterinburg','Nga','Asia/Yekaterinburg','Châu Á'],['Novosibirsk','Nga','Asia/Novosibirsk','Châu Á'],['Pyongyang','Triều Tiên','Asia/Pyongyang','Châu Á'],['Dili','Đông Timor','Asia/Dili','Châu Á'],
    ['Moscow','Nga','Europe/Moscow','Châu Âu'],['Kyiv','Ukraine','Europe/Kiev','Châu Âu'],['Warsaw','Ba Lan','Europe/Warsaw','Châu Âu'],['Prague','Séc','Europe/Prague','Châu Âu'],['Vienna','Áo','Europe/Vienna','Châu Âu'],['Berlin','Đức','Europe/Berlin','Châu Âu'],['Paris','Pháp','Europe/Paris','Châu Âu'],['Zurich','Thụy Sĩ','Europe/Zurich','Châu Âu'],['Rome','Ý','Europe/Rome','Châu Âu'],['Madrid','Tây Ban Nha','Europe/Madrid','Châu Âu'],['Lisbon','Bồ Đào Nha','Europe/Lisbon','Châu Âu'],['Amsterdam','Hà Lan','Europe/Amsterdam','Châu Âu'],['Brussels','Bỉ','Europe/Brussels','Châu Âu'],['London','Anh','Europe/London','Châu Âu'],['Dublin','Ireland','Europe/Dublin','Châu Âu'],['Stockholm','Thụy Điển','Europe/Stockholm','Châu Âu'],['Oslo','Na Uy','Europe/Oslo','Châu Âu'],['Copenhagen','Đan Mạch','Europe/Copenhagen','Châu Âu'],['Helsinki','Phần Lan','Europe/Helsinki','Châu Âu'],['Athens','Hy Lạp','Europe/Athens','Châu Âu'],['Reykjavik','Iceland','Atlantic/Reykjavik','Châu Âu'],['Budapest','Hungary','Europe/Budapest','Châu Âu'],['Bucharest','Romania','Europe/Bucharest','Châu Âu'],['Sofia','Bulgaria','Europe/Sofia','Châu Âu'],['Belgrade','Serbia','Europe/Belgrade','Châu Âu'],['Minsk','Belarus','Europe/Minsk','Châu Âu'],['Riga','Latvia','Europe/Riga','Châu Âu'],['Vilnius','Litva','Europe/Vilnius','Châu Âu'],['Tallinn','Estonia','Europe/Tallinn','Châu Âu'],['Azores','Bồ Đào Nha','Atlantic/Azores','Châu Âu'],
    ['Cairo','Ai Cập','Africa/Cairo','Châu Phi'],['Casablanca','Ma-rốc','Africa/Casablanca','Châu Phi'],['Lagos','Nigeria','Africa/Lagos','Châu Phi'],['Nairobi','Kenya','Africa/Nairobi','Châu Phi'],['Johannesburg','Nam Phi','Africa/Johannesburg','Châu Phi'],['Addis Ababa','Ethiopia','Africa/Addis_Ababa','Châu Phi'],['Accra','Ghana','Africa/Accra','Châu Phi'],['Algiers','Algeria','Africa/Algiers','Châu Phi'],['Tunis','Tunisia','Africa/Tunis','Châu Phi'],['Dakar','Senegal','Africa/Dakar','Châu Phi'],['Kinshasa','CHDC Congo','Africa/Kinshasa','Châu Phi'],['Luanda','Angola','Africa/Luanda','Châu Phi'],['Harare','Zimbabwe','Africa/Harare','Châu Phi'],['Khartoum','Sudan','Africa/Khartoum','Châu Phi'],['Dar es Salaam','Tanzania','Africa/Dar_es_Salaam','Châu Phi'],['Antananarivo','Madagascar','Indian/Antananarivo','Châu Phi'],['Port Louis','Mauritius','Indian/Mauritius','Châu Phi'],
    ['New York','Hoa Kỳ (Mỹ)','America/New_York','Châu Mỹ'],['Chicago','Hoa Kỳ (Mỹ)','America/Chicago','Châu Mỹ'],['Denver','Hoa Kỳ (Mỹ)','America/Denver','Châu Mỹ'],['Los Angeles','Hoa Kỳ (Mỹ)','America/Los_Angeles','Châu Mỹ'],['Anchorage','Hoa Kỳ (Mỹ)','America/Anchorage','Châu Mỹ'],['Honolulu','Hoa Kỳ (Mỹ)','Pacific/Honolulu','Châu Mỹ'],['Toronto','Canada','America/Toronto','Châu Mỹ'],['Vancouver','Canada','America/Vancouver','Châu Mỹ'],['Mexico City','Mexico','America/Mexico_City','Châu Mỹ'],['Havana','Cuba','America/Havana','Châu Mỹ'],['Bogotá','Colombia','America/Bogota','Châu Mỹ'],['Lima','Peru','America/Lima','Châu Mỹ'],['Santiago','Chile','America/Santiago','Châu Mỹ'],['Buenos Aires','Argentina','America/Argentina/Buenos_Aires','Châu Mỹ'],['São Paulo','Brazil','America/Sao_Paulo','Châu Mỹ'],['Phoenix','Hoa Kỳ (Mỹ)','America/Phoenix','Châu Mỹ'],['Winnipeg','Canada','America/Winnipeg','Châu Mỹ'],['Edmonton','Canada','America/Edmonton','Châu Mỹ'],['Halifax','Canada','America/Halifax','Châu Mỹ'],['St. John\'s','Canada','America/St_Johns','Châu Mỹ'],['Panama City','Panama','America/Panama','Châu Mỹ'],['Caracas','Venezuela','America/Caracas','Châu Mỹ'],['La Paz','Bolivia','America/La_Paz','Châu Mỹ'],['Montevideo','Uruguay','America/Montevideo','Châu Mỹ'],['Guatemala City','Guatemala','America/Guatemala','Châu Mỹ'],['Kingston','Jamaica','America/Jamaica','Châu Mỹ'],['San Juan','Puerto Rico','America/Puerto_Rico','Châu Mỹ'],['Santo Domingo','Cộng hòa Dominica','America/Santo_Domingo','Châu Mỹ'],['Quito','Ecuador','America/Guayaquil','Châu Mỹ'],['Manaus','Brazil','America/Manaus','Châu Mỹ'],
    ['Sydney','Úc','Australia/Sydney','Châu Đại Dương'],['Perth','Úc','Australia/Perth','Châu Đại Dương'],['Auckland','New Zealand','Pacific/Auckland','Châu Đại Dương'],['Suva','Fiji','Pacific/Fiji','Châu Đại Dương'],['Brisbane','Úc','Australia/Brisbane','Châu Đại Dương'],['Adelaide','Úc','Australia/Adelaide','Châu Đại Dương'],['Darwin','Úc','Australia/Darwin','Châu Đại Dương'],['Port Moresby','Papua New Guinea','Pacific/Port_Moresby','Châu Đại Dương'],['Nouméa','New Caledonia','Pacific/Noumea','Châu Đại Dương'],['Guam','Hoa Kỳ (Mỹ)','Pacific/Guam','Châu Đại Dương'],['Papeete','Polynesia thuộc Pháp','Pacific/Tahiti','Châu Đại Dương'],['Nuku\'alofa','Tonga','Pacific/Tongatapu','Châu Đại Dương'],['Apia','Samoa','Pacific/Apia','Châu Đại Dương'],['Chatham','New Zealand','Pacific/Chatham','Châu Đại Dương'],
    ['UTC','Giờ chuẩn quốc tế','UTC','Giờ chuẩn']
  ];
  var WZ=null;
  try{WZ=JSON.parse(ls('bg2-world')||'null')}catch(x){WZ=null}
  if(!Array.isArray(WZ))WZ=['Asia/Ho_Chi_Minh','Asia/Tokyo','Europe/London','America/New_York'];
  WZ=WZ.filter(function(z){return CITIES.some(function(c){return c[2]===z})});
  var CTRY_EN={"Ai Cập": "Egypt", "Anh": "United Kingdom", "Ba Lan": "Poland", "Brazil": "Brazil", "Bỉ": "Belgium", "Bồ Đào Nha": "Portugal", "Campuchia": "Cambodia", "Các Tiểu vương quốc Ả Rập (UAE)": "United Arab Emirates", "Hoa Kỳ (Mỹ)": "United States", "Hy Lạp": "Greece", "Hà Lan": "Netherlands", "Hàn Quốc": "South Korea", "Lào": "Laos", "Ma-rốc": "Morocco", "Mông Cổ": "Mongolia", "Na Uy": "Norway", "Nam Phi": "South Africa", "Nga": "Russia", "Nhật Bản": "Japan", "Phần Lan": "Finland", "Pháp": "France", "Séc": "Czechia", "Thái Lan": "Thailand", "Thổ Nhĩ Kỳ": "Türkiye", "Thụy Sĩ": "Switzerland", "Thụy Điển": "Sweden", "Trung Quốc": "China", "Tây Ban Nha": "Spain", "Việt Nam": "Vietnam", "Áo": "Austria", "Úc": "Australia", "Ý": "Italy", "Đan Mạch": "Denmark", "Đài Loan": "Taiwan", "Đức": "Germany", "Ả Rập Xê Út": "Saudi Arabia", "Ấn Độ": "India", "Gruzia": "Georgia", "Li-băng": "Lebanon", "Triều Tiên": "North Korea", "Đông Timor": "Timor-Leste", "Litva": "Lithuania", "CHDC Congo": "DR Congo", "Cộng hòa Dominica": "Dominican Republic", "Polynesia thuộc Pháp": "French Polynesia", "Giờ chuẩn quốc tế": "Coordinated Universal Time"},CITY_EN={"Hà Nội": "Hanoi", "Viêng Chăn": "Vientiane", "Bắc Kinh": "Beijing", "Hồng Kông": "Hong Kong", "Đài Bắc": "Taipei", "Kyiv": "Kyiv"},REG_EN={"Châu Á": "Asia", "Châu Âu": "Europe", "Châu Phi": "Africa", "Châu Mỹ": "Americas", "Châu Đại Dương": "Oceania", "Giờ chuẩn": "Standard time"};
  function cnOf(c){return EN()?(CITY_EN[c[0]]||c[0])+', '+(CTRY_EN[c[1]]||c[1]):c[0]+', '+c[1]}
  function cityName(z){for(var i=0;i<CITIES.length;i++)if(CITIES[i][2]===z)return cnOf(CITIES[i]);return z}
  function tzOff(z,d){
    var f=new Intl.DateTimeFormat('en-US',{timeZone:z,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}),q={};
    f.formatToParts(d).forEach(function(x){q[x.type]=x.value});
    return (Date.UTC(+q.year,+q.month-1,+q.day,(+q.hour)%24,+q.minute,+q.second)-Math.floor(d.getTime()/1000)*1000)/60000;
  }
  function wtxt(z){
    try{
      var d=new Date(),en=EN();
      var time=d.toLocaleTimeString('en-GB',{timeZone:z,hourCycle:'h23',hour:'2-digit',minute:'2-digit',second:'2-digit'});
      var date=d.toLocaleDateString(en?'en-GB':'vi-VN',{timeZone:z,weekday:'short',day:'2-digit',month:'2-digit'});
      var diff=Math.round(tzOff(z,d)+d.getTimezoneOffset()),h=Math.abs(diff)/60,hs=en?String(h):String(h).replace('.',',');
      var rel=diff===0?(en?'same time as you':'cùng giờ với bạn'):en?(hs+(h===1?' hour ':' hours ')+(diff>0?'ahead of you':'behind you')):((diff>0?'nhanh hơn bạn ':'chậm hơn bạn ')+hs+' giờ');
      return [time,date+', '+rel];
    }catch(x){return ['--:--:--','']}
  }
  function drawWorld(){
    var wl=$('wl');if(!wl)return;
    wl.innerHTML=WZ.length?WZ.map(function(z,i){
      var t=wtxt(z);
      return '<div class="card"><div><div class="nm">'+esc(cityName(z))+'</div><div class="tm" id="wt'+i+'">'+t[0]+'</div><div class="nm" id="wd'+i+'">'+esc(t[1])+'</div></div><div class="bt"><button data-a="x" data-i="'+i+'">Xóa</button></div></div>';
    }).join(''):'<p class="hint">Chưa có thành phố nào. Chọn thành phố ở trên rồi bấm Thêm.</p>';
  }
  function world(){
    cancelAnimationFrame(raf);
    var opts='',en=EN();
    ['Châu Á','Châu Âu','Châu Phi','Châu Mỹ','Châu Đại Dương','Giờ chuẩn'].forEach(function(r){
      var o=CITIES.filter(function(c){return c[3]===r&&WZ.indexOf(c[2])<0}).map(function(c){return [cnOf(c),c[2]]}).sort(function(a,b){return a[0].localeCompare(b[0],en?'en':'vi')}).map(function(c){return '<option value="'+c[1]+'">'+esc(c[0])+'</option>'}).join('');
      if(o)opts+='<optgroup label="'+(en?REG_EN[r]:r)+'">'+o+'</optgroup>';
    });
    panel.innerHTML='<div class="wadd"><select id="wz" aria-label="Thành phố">'+opts+'</select><button data-a="add">Thêm</button></div><div id="wl"></div>';
    panel.onclick=function(e){
      var b=e.target.closest('button');if(!b)return;
      var a=b.getAttribute('data-a'),i=+b.getAttribute('data-i');
      if(a==='add'){var z=$('wz').value;if(z&&WZ.indexOf(z)<0)WZ.push(z)}
      else if(a==='x')WZ.splice(i,1);
      else return;
      ls('bg2-world',JSON.stringify(WZ));world();
    };
    drawWorld();
  }
  setInterval(function(){
    if(cur!=='world')return;
    WZ.forEach(function(z,i){var t=wtxt(z),a=$('wt'+i),b=$('wd'+i);if(a)a.textContent=t[0];if(b)b.textContent=t[1]});
  },1000);

  /* Tính giờ ngủ và Tính ngày */
  function EN(){return document.documentElement.lang==='en'}
  function T(v,e){return EN()?e:v}
  function PL(n,vi,en){return EN()?n+' '+en+(n===1?'':'s'):n+' '+vi}
  var SL={m:'wake',t:'06:30'};
  try{var s0=JSON.parse(ls('bg2-sleep')||'null');if(s0&&(s0.m==='wake'||s0.m==='bed')&&/^\d\d:\d\d$/.test(s0.t))SL=s0}catch(x){}
  function hm(n){n=((n%1440)+1440)%1440;return pad(Math.floor(n/60),2)+':'+pad(n%60,2)}
  function durTxt(n){var h=Math.floor(n/60),m=n%60;return EN()?h+' h'+(m?' '+m+' min':''):h+' giờ'+(m?' '+m+' phút':'')}
  function slRows(){
    var p=SL.t.split(':'),base=(+p[0])*60+(+p[1]),wake=SL.m==='wake',cs=wake?[6,5,4,3]:[3,4,5,6];
    return cs.map(function(c){
      var t=wake?base-c*90-15:base+15+c*90;
      return '<div class="card"><div><div class="tm">'+hm(t)+'</div><div class="nm">'+PL(c,'chu kỳ','cycle')+' · '+T('ngủ ','sleep ')+durTxt(c*90)+(c>=5?' ★':'')+'</div></div></div>';
    }).join('');
  }
  function sleepTool(){
    cancelAnimationFrame(raf);
    var wake=SL.m==='wake';
    panel.innerHTML='<div class="tcalc"><div class="chips2"><button type="button" data-sa="wake" aria-pressed="'+wake+'">'+T('Tôi cần dậy lúc…','I need to wake at…')+'</button><button type="button" data-sa="bed" aria-pressed="'+!wake+'">'+T('Tôi đi ngủ lúc…','I go to bed at…')+'</button></div>'+
      '<div class="row"><label>'+(wake?T('Giờ cần thức dậy','Wake-up time'):T('Giờ đi ngủ','Bedtime'))+'<input type="time" id="sl-t" value="'+SL.t+'"></label>'+(wake?'':'<button type="button" data-sa="now">'+T('Bây giờ','Now')+'</button>')+'</div>'+
      '<p class="hint">'+(wake?T('Nên lên giường vào một trong các giờ sau:','Aim to be in bed at one of these times:'):T('Nên thức dậy vào một trong các giờ sau:','Aim to wake up at one of these times:'))+'</p><div id="sl-rows">'+slRows()+'</div>'+
      '<p class="hint">'+T('Tính theo chu kỳ ngủ khoảng 90 phút và khoảng 15 phút để chìm vào giấc ngủ. ★ là mức 7,5 đến 9 giờ, nằm trong khoảng 7 đến 9 giờ mà người lớn thường cần. Đây chỉ là ước tính, mỗi người một khác.','Based on roughly 90-minute sleep cycles and about 15 minutes to fall asleep. ★ marks 7.5 to 9 hours, within the 7 to 9 hours adults typically need. This is only an estimate and varies by person.')+'</p></div>';
    panel.onclick=function(e){
      var b=e.target.closest('button');if(!b)return;var a=b.getAttribute('data-sa');
      if(a==='wake'||a==='bed')SL.m=a;else if(a==='now'){var d=new Date();SL.t=pad(d.getHours(),2)+':'+pad(d.getMinutes(),2)}else return;
      ls('bg2-sleep',JSON.stringify(SL));sleepTool();
    };
    panel.oninput=panel.onchange=function(e){
      if(e.target.id!=='sl-t'||!/^\d\d:\d\d$/.test(e.target.value))return;
      SL.t=e.target.value;ls('bg2-sleep',JSON.stringify(SL));var r=$('sl-rows');if(r)r.innerHTML=slRows();
    };
  }
  function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1,2)+'-'+pad(d.getDate(),2)}
  var DC=null;
  function dcInit(){var t=new Date(),u=new Date(t.getFullYear(),t.getMonth(),t.getDate()+30);DC={a:ymd(t),b:ymd(u),c:ymd(t),op:'+',n:'100',u:'d'}}
  function pd(s){var m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(s||'');if(!m)return null;var y=+m[1],mo=+m[2],d=+m[3];if(y<1000||mo<1||mo>12||d<1||d>31)return null;var u=Date.UTC(y,mo-1,d);return new Date(u).getUTCDate()===d?{y:y,m:mo,d:d,u:u}:null}
  function addM(x,k){var t=x.y*12+(x.m-1)+k,y=Math.floor(t/12),m=((t%12)+12)%12,last=new Date(Date.UTC(y,m+1,0)).getUTCDate();return Date.UTC(y,m,Math.min(x.d,last))}
  function fmtD(u){try{return new Date(u).toLocaleDateString(EN()?'en-GB':'vi-VN',EN()?{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}:{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'})}catch(x){return new Date(u).toISOString().slice(0,10)}}
  function dcSpan(a,b){
    var lo=a.u<=b.u?a:b,hi=a.u<=b.u?b:a,days=Math.round((hi.u-lo.u)/864e5);
    var m=(hi.y-lo.y)*12+(hi.m-lo.m);if(addM(lo,m)>hi.u)m--;
    var rest=Math.round((hi.u-addM(lo,m))/864e5),y=Math.floor(m/12),mo=m%12,parts=[];
    if(y)parts.push(PL(y,'năm','year'));if(mo)parts.push(PL(mo,'tháng','month'));if(rest||!parts.length)parts.push(PL(rest,'ngày','day'));
    var w=Math.floor(days/7),r=days%7;
    return {days:days,rev:b.u<a.u,wd:days>=7?PL(w,'tuần','week')+(r?' '+PL(r,'ngày','day'):''):'',ymd:(y||mo)?parts.join(' '):''};
  }
  function dcAdd(c,op,n,u){
    var k=(op==='-'?-1:1)*n,u2;
    if(u==='d')u2=Date.UTC(c.y,c.m-1,c.d+k);else if(u==='w')u2=Date.UTC(c.y,c.m-1,c.d+k*7);else if(u==='m')u2=addM(c,k);else u2=addM(c,k*12);
    var y=new Date(u2).getUTCFullYear();return(y<1000||y>9999)?null:u2;
  }
  function dcUpd(){
    var r1=$('dc-r1'),r2=$('dc-r2');if(!r1||!r2)return;
    var a=pd(DC.a),b=pd(DC.b),bad=T('Chọn đủ ngày hợp lệ.','Please choose valid dates.');
    if(!a||!b)r1.textContent=bad;else{var s=dcSpan(a,b);
      r1.innerHTML='<div class="big">'+esc(PL(s.days,'ngày','day'))+'</div>'+(s.wd?'<div class="nm">'+esc(s.wd)+'</div>':'')+(s.ymd?'<div class="nm">'+esc(s.ymd)+'</div>':'')+(s.rev?'<div class="nm">'+esc(T('Ngày kết thúc nằm trước ngày bắt đầu.','The end date is before the start date.'))+'</div>':'')}
    var c=pd(DC.c),n=parseInt(DC.n,10);
    if(!c||isNaN(n))r2.textContent=bad;else{var u2=dcAdd(c,DC.op,n,DC.u);r2.innerHTML=u2===null?esc(T('Kết quả nằm ngoài phạm vi hỗ trợ.','The result is out of the supported range.')):'<div class="big">'+esc(fmtD(u2))+'</div>'}
  }
  function dcalc(){
    cancelAnimationFrame(raf);if(!DC)dcInit();
    function opt(v,t,sel){return '<option value="'+v+'"'+(sel===v?' selected':'')+'>'+t+'</option>'}
    panel.innerHTML='<div class="tcalc"><h3>'+T('Khoảng cách giữa hai ngày','Days between two dates')+'</h3>'+
      '<div class="row"><label>'+T('Từ ngày','From')+'<input type="date" id="dc-a" value="'+DC.a+'"></label><label>'+T('Đến ngày','To')+'<input type="date" id="dc-b" value="'+DC.b+'"></label></div><div class="card" id="dc-r1"></div>'+
      '<h3>'+T('Cộng hoặc trừ thời gian','Add or subtract time')+'</h3>'+
      '<div class="row"><label>'+T('Từ ngày','Start date')+'<input type="date" id="dc-c" value="'+DC.c+'"></label></div>'+
      '<div class="row"><label>'+T('Phép tính','Operation')+'<select id="dc-op">'+opt('+',T('Cộng','Add'),DC.op)+opt('-',T('Trừ','Subtract'),DC.op)+'</select></label>'+
      '<label>'+T('Số lượng','Amount')+'<input type="text" id="dc-n" inputmode="numeric" pattern="[0-9]*" maxlength="5" value="'+DC.n+'" autocomplete="off"></label>'+
      '<label>'+T('Đơn vị','Unit')+'<select id="dc-u">'+opt('d',T('ngày','days'),DC.u)+opt('w',T('tuần','weeks'),DC.u)+opt('m',T('tháng','months'),DC.u)+opt('y',T('năm','years'),DC.u)+'</select></label></div><div class="card" id="dc-r2"></div></div>';
    panel.onclick=null;
    panel.oninput=panel.onchange=function(e){
      var id=e.target.id;if(id==='dc-n'){var v=e.target.value.replace(/\D/g,'');if(v!==e.target.value)e.target.value=v}
      var map={'dc-a':'a','dc-b':'b','dc-c':'c','dc-op':'op','dc-n':'n','dc-u':'u'};if(!map[id])return;
      DC[map[id]]=e.target.value;dcUpd();
    };
    dcUpd();
  }
  try{var lastL=document.documentElement.lang;new MutationObserver(function(){var l=document.documentElement.lang;if(l===lastL)return;lastL=l;if(cur==='sleep')sleepTool();else if(cur==='dcalc')dcalc();else if(cur==='world')world();else if(cur==='days')days()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']})}catch(x){}

  /* Lưu và khôi phục trạng thái khi tải lại trang */
  window.__panelSave=function(){
    var n=performance.now(),c=null;
    if(ch){c={t:ch.t.slice(),b:ch.b,inc:ch.inc,a:ch.a,over:ch.over,pause:ch.pause};if(ch.a>=0&&!ch.pause)c.t[ch.a]-=n-ch.last}
    return {ch:c,
      timers:timers.map(function(t){return {name:t.name,total:t.total,left:rem(t),run:t.run,done:t.done}}),
      rems:REMS.map(function(r){return {run:r.run,next:r.next,left:rleft(r),count:r.count}})};
  };
  window.__panelLoad=function(o,gap){
    if(!o)return;
    var n=performance.now(),late=[];
    if(o.ch&&Array.isArray(o.ch.t)){
      ch=o.ch;ch.last=n;
      if(ch.a>=0&&!ch.pause&&ch.over<0){ch.t[ch.a]-=gap;if(ch.t[ch.a]<=0){ch.t[ch.a]=0;ch.over=ch.a;ch.a=-1}}
    }
    timers=(o.timers||[]).map(function(t){
      var left=t.left,run=t.run,dn=t.done;
      if(run&&!dn){left-=gap;if(left<=0){left=0;run=false;dn=true;late.push(t.name)}}
      return {name:String(t.name),total:t.total,left:left,run:run,start:n,done:dn};
    });
    if(o.rems&&o.rems.length===REMS.length)o.rems.forEach(function(x,i){var r=REMS[i];r.run=!!x.run;r.next=x.next;r.left=x.left;r.count=x.count||0});
    late.forEach(function(nm){showAlert('Xong rồi: '+nm,'')});
  };
  var _svKey='',_svAt=0;
  function saveAll(force){
    try{
      var m=window.__mainSave(),p=window.__panelSave(),k='';
      try{k=JSON.stringify(m)+'|'+JSON.stringify(p)}catch(e){}
      var now=Date.now();
      if(!force&&k===_svKey&&now-_svAt<10000)return;
      _svKey=k;_svAt=now;
      ls('bg2-state',JSON.stringify({at:now,m:m,p:p}))
    }catch(x){}
  }
  setInterval(function(){saveAll(false)},1000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')saveAll(1)});
  window.addEventListener('pagehide',saveAll);
  try{
    var sv=JSON.parse(ls('bg2-state')||'null');
    if(sv&&sv.at&&Date.now()-sv.at<86400000&&Date.now()>=sv.at){
      var gap=Date.now()-sv.at;
      window.__mainLoad(sv.m,gap);window.__panelLoad(sv.p,gap);
    }
  }catch(x){ls('bg2-state','')}

  /* Chia sẻ trang */
  $('shr').addEventListener('click',function(){
    var url=baseUrl();
    if(navigator.share){
      navigator.share({title:'Bấm giờ',text:'Bấm giờ, đếm ngược, Pomodoro, cờ vua, nhắc nhở và nhiều đồng hồ khác',url:url}).catch(function(){});
    }else copyText(url,$('shr'));
  });

  /* Cài như ứng dụng */
  var deferred=null,inst=$('inst');
  var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone;
  if(standalone)inst.hidden=true;
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e});
  window.addEventListener('appinstalled',function(){inst.hidden=true;deferred=null});
  inst.addEventListener('click',function(){
    if(deferred){deferred.prompt();deferred.userChoice.then(function(){deferred=null},function(){});return}
    var ua=navigator.userAgent,msg;
    if(/zalo|fban|fbav|messenger|instagram|line\//i.test(ua))msg='Bạn đang mở trang trong ứng dụng khác (Zalo, Messenger...). Hãy bấm menu ba chấm, chọn "Mở bằng trình duyệt", rồi bấm lại nút này trong Chrome hoặc Safari.';
    else if(/iphone|ipad|ipod/i.test(ua))msg='Bấm nút Chia sẻ của Safari (hình ô vuông có mũi tên), kéo xuống và chọn "Thêm vào Màn hình chính".';
    else msg='Bấm menu ba chấm của Chrome, chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính". Nếu không thấy, hãy mở trang bằng Chrome.';
    showAlert('Cài về màn hình',msg,'Hướng dẫn');
  });
    if('serviceWorker' in navigator&&/^https?:/.test(location.protocol)){
    window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
  }

  /* Mở từ link chia sẻ */
  function applyHash(){
    var h=location.hash.replace(/^#/,'');
    if(h.indexOf('m=')!==0)return false;
    var q={};
    h.split('&').forEach(function(kv){var a=kv.split('=');try{q[a[0]]=decodeURIComponent(a.slice(1).join('='))}catch(x){}});
    if(!/^[a-z]+$/.test(q.m||''))return false;
    var tb=document.querySelector('#tabs button[data-m="'+q.m+'"]');
    if(!tb)return false;
    if(q.m==='seq'&&q.st){
      var arr=[];
      q.st.split('|').forEach(function(it){
        var k=it.lastIndexOf(':');if(k<1)return;
        var sec=parseInt(it.slice(k+1),10);if(!(sec>=1))return;
        var nm;try{nm=decodeURIComponent(it.slice(0,k))}catch(x){nm=it.slice(0,k)}
        arr.push({n:nm.slice(0,24)||'Bước',ms:sec*1000});
      });
      if(arr.length){SEQ=arr.slice(0,30);saveSeq()}
    }
    tb.click();
    Object.keys(q).forEach(function(k){
      if(!/^s\d$/.test(k))return;
      var el=$(k);
      if(el&&setBox.contains(el)){el.value=String(q[k]).replace(/\D/g,'');el.dispatchEvent(new Event('input',{bubbles:true}))}
    });
    try{history.replaceState(null,'',location.pathname+location.search)}catch(x){}
    return true;
  }
  var hashed=applyHash();

  var lm=ls('bg-mode');
  if(!hashed&&lm&&lm!=='sw'){var tb=document.querySelector('#tabs button[data-m="'+lm+'"]');if(tb)tb.click()}
})();

;

(function(){
  var clock=document.getElementById('hero-clock');
  var date=document.getElementById('hero-date');
  function updateHeroClock(){
    var now=new Date();
    if(clock) clock.textContent=now.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
    if(date) date.textContent=now.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }
  updateHeroClock();
  setInterval(updateHeroClock,1000);
  document.querySelectorAll('[data-quick-mode]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var mode=btn.getAttribute('data-quick-mode');
      var tab=document.querySelector('#tabs button[data-m="'+mode+'"]');
      if(tab){
        tab.click();
        var timer=document.getElementById('disp');
        if(timer) timer.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
      }
    });
  });
})();

;

(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};
  var test=$('testSound'),toggle=$('notifyToggle'),permission=$('notifyPermission'),status=$('notifyStatus');
  if(test){
    test.addEventListener('click',function(){
      if(window.unlockAudio)window.unlockAudio();
      if(window.beepFn)window.beepFn(3,0.22);
      var old=test.textContent;test.textContent='♪ Đang thử…';
      window.setTimeout(function(){test.textContent=old},1100);
    });
  }
  function supported(){return ('Notification' in window) && window.isSecureContext;}
  function refresh(){
    var enabled=false;
    try{enabled=localStorage.getItem('bg2-notify')==='1'}catch(e){}
    if(toggle)toggle.checked=enabled;
    if(!supported()){
      if(status)status.textContent='Trình duyệt này không hỗ trợ thông báo ngoài trang; hộp báo trong website vẫn hoạt động.';
      if(permission)permission.disabled=true;
      if(toggle)toggle.disabled=true;
      return;
    }
    var p=Notification.permission;
    if(permission){
      permission.disabled=false;
      permission.textContent=p==='granted'?'Thông báo đã được cấp quyền':p==='denied'?'Quyền thông báo bị chặn':'Bật thông báo';
      permission.classList.toggle('enabled',p==='granted');
    }
    if(status){
      if(p==='denied')status.textContent='Thông báo đang bị chặn trong cài đặt trình duyệt. Bạn vẫn có thể dùng hộp báo trong trang.';
      else if(enabled&&p==='granted')status.textContent='Đã bật: trình duyệt có thể hiện thông báo khi hết giờ. Android có thể tạm dừng trang chạy nền.';
      else if(enabled)status.textContent='Bạn đã bật tùy chọn; hãy cấp quyền trình duyệt để thông báo hoạt động.';
      else status.textContent='Thông báo ngoài trang đang tắt. Hộp báo trong website vẫn hoạt động bình thường.';
    }
  }
  if(permission)permission.addEventListener('click',function(){
    if(!supported())return;
    if(Notification.permission==='granted'){refresh();return;}
    Notification.requestPermission().then(function(p){
      if(p==='granted'){
        try{localStorage.setItem('bg2-notify','1')}catch(e){}
        if(toggle)toggle.checked=true;
      }
      refresh();
    }).catch(refresh);
  });
  if(toggle)toggle.addEventListener('change',function(){
    if(!toggle.checked){try{localStorage.setItem('bg2-notify','0')}catch(e){}refresh();return;}
    if(!supported()){toggle.checked=false;refresh();return;}
    if(Notification.permission==='granted'){
      try{localStorage.setItem('bg2-notify','1')}catch(e){}
      refresh();
    }else{
      toggle.checked=false;
      if(status)status.textContent='Hãy nhấn “Bật thông báo” để cấp quyền trước.';
    }
  });
  window.bg2Notify=function(title,body){
    var enabled=false;
    try{enabled=localStorage.getItem('bg2-notify')==='1'}catch(e){}
    if(!enabled||!supported()||Notification.permission!=='granted')return;
    try{
      var n=new Notification(title||'Đến giờ!',{body:body||'Bộ đếm thời gian đã hoàn thành.',tag:'bam-gio-alert'});
      n.onclick=function(){try{window.focus()}catch(e){}n.close();};
    }catch(e){
      try{if('serviceWorker' in navigator)navigator.serviceWorker.ready.then(function(r){return r.showNotification(title||'Đến giờ!',{body:body||'Bộ đếm thời gian đã hoàn thành.',tag:'bam-gio-alert'})}).catch(function(){})}catch(e2){}
    }
  };
  refresh();
})();

;

(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};
  /* Chế độ tập trung */
  var fb=$('focusbtn');
  function setFocus(on){
    document.body.classList.toggle('focus',!!on);
    fb.setAttribute('aria-pressed',on?'true':'false');
    fb.setAttribute('aria-label',on?'Thoát chế độ tập trung':'Chế độ tập trung');
    if(on)window.scrollTo(0,0);
  }
  window.setFocus=setFocus;
  fb.addEventListener('click',function(){setFocus(!document.body.classList.contains('focus'))});
  /* Thanh điều hướng dưới */
  var ICON={sw:'⏱️',cd:'⏳',pomo:'🍅',iv:'💪',seq:'📋',exam:'📝',days:'📅',chess:'♟️',cook:'🍳',breath:'🌬️',rem:'🔔',world:'🌍',sleep:'😴',dcalc:'📆',lunar:'🌙',age:'🎂',hms:'➕',desk:'🖥️',wage:'💵',pace:'🏃',plan:'🎯',words:'🔤',week:'🗓️',water:'💧',zone:'❤️',spaced:'🧠',leave:'🚗',tally:'🔢',today:'☀️',todo:'✅',rules:'⚡',close:'🌙',habit:'🔥',sun:'🌅',metro:'🎵',music:'🎧',track:'📋',meet:'🤝'};
  var EXTRA=['seq','exam','days','chess','cook','breath','rem','world','sleep','dcalc','lunar','age','hms','desk','wage','habit','sun','metro','music','track','meet','pace','plan','words','week','water','zone','spaced','leave','tally','today','todo','rules','close'];
  var ALL=['sw','cd','pomo','iv','seq','exam','days','chess','cook','breath','rem','world','sleep','dcalc','lunar','age','hms','desk','wage','habit','sun','metro','music','track','meet','pace','plan','words','week','water','zone','spaced','leave','tally','today','todo','rules','close'];
  var DESCR={sw:'Đo thời gian đã trôi qua, ghi vòng',cd:'Đặt phút giây và báo khi hết giờ',pomo:'Học tập trung xen kẽ thời gian nghỉ',iv:'Tập luyện theo vòng tập và nghỉ',seq:'Chia công việc thành nhiều bước',exam:'Canh giờ làm bài và mốc báo',days:'Đếm đến kỳ thi, sinh nhật, sự kiện',chess:'Đồng hồ cho hai người chơi cờ',cook:'Hẹn giờ nhiều món ăn cùng lúc',breath:'Hít thở chậm để thư giãn',rem:'Nhắc nghỉ mắt hoặc việc định kỳ',world:'Xem giờ ở nhiều thành phố',sleep:'Gợi ý giờ đi ngủ hoặc thức dậy theo chu kỳ',dcalc:'Số ngày giữa hai ngày, cộng trừ ngày tháng',lunar:'Đổi dương lịch sang âm lịch và ngược lại',age:'Tuổi chính xác và ngày đến sinh nhật',hms:'Cộng trừ giờ phút, khoảng giữa hai mốc giờ',desk:'Đồng hồ số lớn để bàn, toàn màn hình',wage:'Ước tính lương giờ và tăng ca',pace:'Pace, tốc độ và dự đoán thời gian chạy',plan:'Mỗi ngày cần làm bao nhiêu để kịp hạn',words:'Đếm từ, thời gian đọc và thuyết trình',week:'Tuần thứ mấy, ngày thứ mấy trong năm',water:'Ghi lượng nước uống mỗi ngày',zone:'Vùng nhịp tim khi tập luyện',spaced:'Lịch ôn bài theo quãng tăng dần',leave:'Tính giờ phải xuất phát để kịp giờ',tally:'Đếm số lần tập, lưu từng hiệp',today:'Tổng quan việc, tập trung, thói quen hôm nay',todo:'Việc cần làm gắn với Pomodoro',rules:'Quy tắc nếu – thì tự động',close:'Chốt ngày, dồn việc dở sang mai',habit:'Theo dõi chuỗi ngày làm thói quen',sun:'Mặt trời mọc, lặn, giờ vàng',metro:'Máy gõ nhịp, chỉnh BPM',music:'Nhạc từ máy, nghe nền khi làm việc',track:'Ghi giờ theo công việc, vào thống kê',meet:'Giờ họp chung giữa các múi giờ'};
  var tabs=$('tabs'),nav=$('bnav'),more=$('bmore'),sheet=$('sheet'),grid=$('sgrid');
  var search=$('toolSearch'),favGrid=$('favGrid'),recentGrid=$('recentGrid');
  var favs=[],recent=[],activeFilter='all';
  var CATS={sw:'timer',cd:'timer',pomo:'study',iv:'daily',seq:'study',exam:'study',days:'daily',chess:'games',cook:'daily',breath:'relax',rem:'daily',world:'daily',sleep:'relax',dcalc:'daily',lunar:'daily',age:'daily',hms:'daily',desk:'relax',wage:'daily',pace:'daily',plan:'study',words:'study',week:'daily',water:'daily',zone:'daily',spaced:'study',leave:'daily',tally:'daily',today:'daily',todo:'daily',rules:'daily',close:'daily',habit:'daily',sun:'daily',metro:'daily',music:'relax',track:'study',meet:'daily'};
  var ALIASES={sw:'stopwatch lap split đo thời gian bấm giờ',cd:'hẹn giờ đếm lùi báo thức đếm ngược',pomo:'học bài tập trung nghỉ pomodoro học tập',iv:'tập thể dục workout vận động nghỉ',seq:'các bước quy trình việc cần làm checklist',exam:'kiểm tra kiểm tra bài thi làm bài thời lượng',days:'sinh nhật kỳ thi tết sự kiện ngày còn lại',chess:'cờ vua cờ đồng hồ hai người chơi',cook:'nấu ăn trứng mì món ăn bếp',breath:'thở thư giãn bình tĩnh hít thở',rem:'nhắc nhở nghỉ mắt uống nước định kỳ',world:'múi giờ quốc tế giờ các nước thành phố',sleep:'ngủ giờ đi ngủ thức dậy chu kỳ ngủ báo thức sleep cycle bedtime wake',dcalc:'tính ngày cộng ngày trừ ngày cộng trừ ngày khoảng cách số ngày tuần tháng năm date calculator days between',lunar:'âm lịch dương lịch lịch âm tết rằm mùng một can chi lunar calendar',age:'tuổi sinh nhật ngày sinh tính tuổi age birthday',hms:'cộng trừ giờ phút tính giờ làm ca khoảng thời gian time calculator duration',desk:'đồng hồ để bàn đồng hồ số to clock desk digital',wage:'lương giờ tăng ca tính lương overtime salary pay',pace:'pace chạy bộ tốc độ km marathon running 5k 10k',plan:'tiến độ hạn chót deadline kế hoạch học mỗi ngày bao nhiêu',words:'đếm từ ký tự thời gian đọc thuyết trình word count',week:'tuần thứ mấy ngày thứ mấy trong năm số tuần quý week number day of year',water:'uống nước nhắc uống nước water hydration ml',zone:'nhịp tim vùng nhịp tim heart rate zone tập luyện cardio',spaced:'ôn bài ôn tập cách quãng spaced repetition học từ vựng nhớ lâu',leave:'giờ đi giờ xuất phát đến nơi kẹt xe leave time commute đi làm',tally:'đếm lần đếm số hít đất gập bụng counter tally rep set',today:'hôm nay tổng quan dashboard lịch trình today overview',todo:'việc cần làm todo task công việc nhiệm vụ deadline dự án project ưu tiên kế hoạch',rules:'quy tắc nếu thì tự động automation rule trigger nhắc tự động',close:'đóng ngày tổng kết cuối ngày dồn việc sang mai review end of day close day',habit:'thói quen chuỗi ngày streak habit tracker mỗi ngày',sun:'mặt trời mọc lặn giờ vàng bình minh hoàng hôn sunrise sunset',metro:'gõ nhịp metronome bpm nhạc tempo guitar piano trống',music:'nhạc của tôi nghe nhạc mp3 nền tập trung playlist music player focus',track:'ghi giờ theo dõi thời gian công việc time tracker timesheet project',meet:'họp chung múi giờ giờ họp quốc tế meeting planner timezone overlap'};
  try{favs=JSON.parse(localStorage.getItem('bg2-favs')||'[]');if(!Array.isArray(favs))favs=[]}catch(e){favs=[]}
  try{recent=JSON.parse(localStorage.getItem('bg2-recent')||'[]');if(!Array.isArray(recent))recent=[]}catch(e){recent=[]}
  function tabOf(m){return tabs.querySelector('button[data-m="'+m+'"]')}
  var NAMES={sw:'Bấm giờ',cd:'Đếm ngược',pomo:'Pomodoro — học tập trung',iv:'Tập luyện',seq:'Đồng hồ theo từng bước',exam:'Đồng hồ thi',days:'Đếm ngược đến ngày',chess:'Đồng hồ cờ vua',cook:'Đồng hồ nấu ăn',breath:'Bài tập hít thở',rem:'Nhắc nhở định kỳ',world:'Giờ thế giới',sleep:'Tính giờ ngủ',dcalc:'Tính ngày',lunar:'Âm lịch',age:'Tính tuổi',hms:'Cộng trừ giờ',desk:'Đồng hồ để bàn',wage:'Tính lương theo giờ',habit:'Chuỗi thói quen',sun:'Mặt trời mọc, lặn',metro:'Máy gõ nhịp',music:'Nhạc của tôi',track:'Ghi giờ công việc',meet:'Giờ họp chung'};
  /* ---- Gom công cụ thành nhóm (chỉ đổi cách hiển thị, các chế độ và dữ liệu cũ giữ nguyên) ---- */
var GROUPS={
 'g-manage':{n:'Quản lý',i:'🗂️',d:'Hôm nay và việc cần làm gắn với Pomodoro',m:['today','todo','rules','close'],c:'daily',after:'iv'},
 'g-study':{n:'Học tập',i:'📚',d:'Đồng hồ thi, đếm từ, ôn cách quãng, tiến độ đến hạn',m:['exam','words','spaced','plan'],c:'study'},
 'g-multi':{n:'Hẹn giờ nhiều việc',i:'⏲️',d:'Chuỗi bước, nấu ăn, nhắc nhở định kỳ',m:['seq','cook','rem'],c:'timer'},
 'g-date':{n:'Ngày & lịch',i:'📆',d:'Tính ngày, đếm ngày, tuổi, tuần trong năm, âm lịch',m:['dcalc','days','age','week','lunar'],c:'daily'},
 'g-work':{n:'Giờ làm & lương',i:'🧮',d:'Ghi giờ, cộng trừ giờ, tính lương, giờ xuất phát',m:['track','hms','wage','leave'],c:'daily'},
 'g-world':{n:'Giờ thế giới',i:'🌍',d:'Xem giờ, họp chung, mặt trời mọc lặn',m:['world','meet','sun'],c:'daily'},
 'g-health':{n:'Sức khỏe & thể thao',i:'🏃',d:'Pace, nhịp tim, đếm lần, uống nước, giờ ngủ, hít thở',m:['pace','zone','tally','water','sleep','breath'],c:'daily'},
 'g-music':{n:'Âm nhạc',i:'🎧',d:'Máy gõ nhịp và nhạc của tôi',m:['metro','music'],c:'relax'}
};
var M2G={};
Object.keys(GROUPS).forEach(function(g){GROUPS[g].m.forEach(function(m){M2G[m]=g});NAMES[g]=GROUPS[g].n;ICON[g]=GROUPS[g].i;DESCR[g]=GROUPS[g].d;CATS[g]=GROUPS[g].c;
 ALIASES[g]=GROUPS[g].m.map(function(m){return (NAMES[m]||'')+' '+(ALIASES[m]||'')+' '+(DESCR[m]||'')}).join(' ')});
window.BG_GROUPS=GROUPS;
ALL=['sw','cd','pomo','iv','g-manage','g-study','g-multi','g-date','g-work','g-world','g-health','habit','desk','g-music','chess'];
function norm(m){return M2G[m]||m}
function uniq(a){return a.filter(function(m,i,x){return m&&x.indexOf(m)===i})}
favs=uniq(favs.map(norm));recent=uniq(recent.map(norm));
function lastOf(g){try{var l=JSON.parse(localStorage.getItem('bg2x-glast')||'{}');if(l[g]&&GROUPS[g].m.indexOf(l[g])>=0)return l[g]}catch(e){}return GROUPS[g].m[0]}
function useGet(){try{return JSON.parse(localStorage.getItem('bg2x-use')||'{}')||{}}catch(e){return{}}}
function useScore(k,now){var u=useGet()[k];return u?u.n*Math.pow(.5,((now||Date.now())-u.t)/(21*864e5)):0}
function useBump(m){try{var k=M2G[m]||m,u=useGet(),now=Date.now(),e=u[k]||{n:0,t:now,c:0};e.n=e.n*Math.pow(.5,(now-e.t)/(21*864e5))+1;e.t=now;e.c=(e.c||0)+1;u[k]=e;localStorage.setItem('bg2x-use',JSON.stringify(u))}catch(x){}}
function useTotal(){var u=useGet(),s=0,k;for(k in u)s+=(u[k].c||0);return s}
function toolName(m){return NAMES[m]||(function(){var t=tabOf(m);return t?t.textContent.trim():m})()}
  function go(m){if(GROUPS[m])m=lastOf(m);var t=tabOf(m);if(t)t.click()}
  /* Thanh dưới: hiện tối đa 4 công cụ đã ghim (mới nhất bên phải), thiếu thì bù bằng 4 công cụ mặc định */
  var NAVS=['sw','cd','pomo','iv'];
  function renderNav(){
    var pins=favs.filter(function(m){return ALL.indexOf(m)>=0}).slice(0,4).reverse(),s=pins.slice();
    var defN=['sw','cd','pomo','iv'];if(useTotal()>=20){var nw2=Date.now();defN=ALL.slice().sort(function(a,b){return useScore(b,nw2)-useScore(a,nw2)||ALL.indexOf(a)-ALL.indexOf(b)}).slice(0,4)}
 defN.forEach(function(m){if(s.length<4&&s.indexOf(m)<0)s.push(m)});
    NAVS=s;
    var old=nav.querySelectorAll('button[data-go]');for(var i=0;i<old.length;i++)nav.removeChild(old[i]);
    s.forEach(function(m){
      var t=tabOf(m),b=document.createElement('button');b.type='button';b.setAttribute('data-go',m);
      b.innerHTML='<span class="ni"></span><span class="nl"></span>';b.firstChild.textContent=ICON[m]||'◷';b.lastChild.textContent=t?t.textContent.trim():toolName(m);
      nav.insertBefore(b,more);
    });
  }
  function card(m){var name=toolName(m),desc=DESCR[m]||'';return '<div class="tool-card" data-tool-card="'+m+'"><button type="button" data-go="'+m+'" aria-label="Mở '+name+'"><span class="ni">'+(ICON[m]||'◷')+'</span><span class="tool-name"><b>'+name+'</b><br><small>'+desc+'</small></span></button><button type="button" class="tool-fav" data-fav="'+m+'" aria-label="Ghim '+name+'" aria-pressed="'+(favs.indexOf(m)>=0?'true':'false')+'" title="Yêu thích">'+(favs.indexOf(m)>=0?'★':'☆')+'</button></div>'}
  function renderGrid(el,items){el.innerHTML=items.map(card).join('')||'<div class="tool-empty">Chưa có công cụ ở đây.</div>'}
  function persistLists(){try{localStorage.setItem('bg2-favs',JSON.stringify(favs));localStorage.setItem('bg2-recent',JSON.stringify(recent.slice(0,5)))}catch(e){}}
  function renderTools(){
    var q=(search&&search.value||'').trim().toLocaleLowerCase('vi');
    var filtered=ALL.filter(function(m){
      var hay=(toolName(m)+' '+(DESCR[m]||'')+' '+(ALIASES[m]||'')).toLocaleLowerCase('vi');
      return (!q||hay.indexOf(q)>=0)&&(activeFilter==='all'||CATS[m]===activeFilter);
    });
    $('toolFilters').querySelectorAll('[data-filter]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-filter')===activeFilter?'true':'false')});
    var mainL=filtered,restL=[];
 if(!q&&useTotal()>=20){var nw=Date.now(),sc={};filtered.forEach(function(m){sc[m]=useScore(m,nw)});
  var ord=filtered.slice().sort(function(a,b){return sc[b]-sc[a]||ALL.indexOf(a)-ALL.indexOf(b)});
  mainL=ord.filter(function(m){return sc[m]>=0.3||favs.indexOf(m)>=0});restL=ord.filter(function(m){return mainL.indexOf(m)<0});
  if(mainL.length<4){mainL=ord.slice(0,4);restL=ord.slice(4)}}
 renderGrid(grid,mainL);
 if(restL.length)grid.insertAdjacentHTML('beforeend','<details class="seldom"><summary><span>Ít dùng</span> <span>('+restL.length+')</span></summary><div class="sheet-grid">'+restL.map(card).join('')+'</div></details>');
    var favL=favs.filter(function(m){return ALL.indexOf(m)>=0&&m!==''&&(activeFilter==='all'||CATS[m]===activeFilter)}),recL=recent.filter(function(m){return ALL.indexOf(m)>=0&&m!==''&&(activeFilter==='all'||CATS[m]===activeFilter)}).slice(0,5); renderGrid(favGrid,favL);
    renderGrid(recentGrid,recL);
    $('favSection').hidden=!!q||!favL.length; $('recentSection').hidden=!!q||!recL.length;
    $('allSection').hidden=false;
    $('toolCount').textContent=filtered.length+' công cụ';
    if(!filtered.length)grid.innerHTML='<div class="tool-empty">Không tìm thấy công cụ phù hợp. Thử từ khóa khác hoặc chọn “Tất cả”.</div>';
    grid.querySelectorAll('[data-tool-card]').forEach(function(el){var m=el.getAttribute('data-tool-card');el.querySelector('[data-fav]').setAttribute('aria-pressed',favs.indexOf(m)>=0?'true':'false')});
  }
  // Khởi động theo mục tiêu: ghi nhớ lựa chọn gần nhất và mở đúng công cụ.
  var goalGrid=$('goalGrid'),goalFoot=$('goalFoot'),goalReset=$('goalReset'),savedGoal='';
  try{savedGoal=localStorage.getItem('bg2-goal')||''}catch(e){}
  /* Gợi ý mục tiêu ngẫu nhiên: mỗi lần mở trang hiện 6 trong số các mục tiêu, luôn giữ mục tiêu gần nhất */
  var GP=[
    ['study','pomo','📚','Học tập trung','Học theo phiên, có giờ nghỉ'],
    ['cook','cook','🍳','Nấu ăn','Canh nhiều món cùng lúc'],
    ['workout','iv','💪','Tập luyện','Chia thời gian tập và nghỉ'],
    ['relax','breath','🌿','Thư giãn','Thực hành nhịp thở chậm'],
    ['event','days','📅','Đếm đến sự kiện','Kỳ thi, sinh nhật, chuyến đi'],
    ['timer','cd','⏳','Đặt giờ bất kỳ','Đếm ngược và báo khi hết'],
    ['sleep','sleep','😴','Ngủ đủ giấc','Tính giờ đi ngủ hoặc thức dậy'],
    ['eyes','rem','👀','Nghỉ mắt định kỳ','Nhắc lặp lại, ví dụ mỗi 20 phút'],
    ['exam','exam','📝','Làm bài thi','Canh giờ và các mốc báo'],
    ['routine','seq','📋','Làm theo quy trình','Nối nhiều bước thành một'],
    ['chess','chess','♟️','Chơi cờ hai người','Đồng hồ cho hai bên'],
    ['world','world','🌍','Gọi người ở xa','Xem giờ nhiều thành phố'],
    ['dates','dcalc','📆','Tính số ngày','Giữa hai ngày, cộng trừ ngày'],
    ['lap','sw','⏱️','Đo thời gian','Bấm giờ và ghi từng vòng'],
    ['music','music','🎧','Nghe nhạc nền','Nhạc trong máy, nối Pomodoro'],
    ['metro','metro','🎵','Tập nhạc','Máy gõ nhịp, chỉnh BPM'],
    ['lunar','lunar','🌙','Xem lịch âm','Đổi dương lịch và âm lịch'],
    ['desk','desk','🖥️','Đồng hồ để bàn','Số lớn, kiểu lật, kiểu kim'],
    ['habit','habit','🔥','Giữ thói quen','Đếm chuỗi ngày liên tiếp'],
    ['wage','wage','💵','Tính lương giờ','Giờ làm và tăng ca'],
    ['track','track','📋','Ghi giờ công việc','Biết mình dành bao lâu cho từng việc'],
    ['meet','meet','🤝','Hẹn họp quốc tế','Tìm giờ hợp cho mọi múi giờ']
  ];
  (function(){
    try{
      var a=GP.slice(),i,j,t;
      for(i=a.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=a[i];a[i]=a[j];a[j]=t}
      var pick=(function(){var base=a.slice(0,6);if(useTotal()<20)return base;var nw=Date.now(),by=GP.map(function(g){return{g:g,s:useScore(M2G[g[1]]||g[1],nw)}}).sort(function(x,y){return y.s-x.s}),top=by.filter(function(x){return x.s>0.3}).slice(0,4).map(function(x){return x.g}),rest=a.filter(function(g){return top.indexOf(g)<0});return top.concat(rest.slice(0,6-top.length))})(),keep=GP.filter(function(g){return g[0]===savedGoal})[0];
      if(keep&&!pick.some(function(g){return g[0]===savedGoal}))pick[Math.floor(Math.random()*6)]=keep;
      goalGrid.innerHTML=pick.map(function(g){return '<button type="button" class="goal-card" data-goal="'+g[0]+'" data-mode="'+g[1]+'"><span class="goal-icon">'+g[2]+'</span><span><b>'+g[3]+'</b><small>'+g[4]+'</small></span><span class="goal-arrow">↗</span></button>'}).join('');
    }catch(e){}
  })();
  function markGoal(goal,mode){
    goalGrid.querySelectorAll('[data-goal]').forEach(function(b){var active=b.getAttribute('data-goal')===goal;b.setAttribute('aria-pressed',active?'true':'false')});
    if(goalReset)goalReset.hidden=!goal;
    var labels={};GP.forEach(function(g){labels[g[0]]=g[3]});
    if(goalFoot)goalFoot.textContent=goal?'Mục tiêu gần nhất: '+(labels[goal]||goal)+'. Đã ghi nhớ trên thiết bị này.':'Mẹo: mục tiêu bạn chọn gần nhất sẽ được ghi nhớ trên thiết bị này.';
  }
  if(savedGoal){var sb=goalGrid.querySelector('[data-goal="'+savedGoal+'"]');if(sb)markGoal(savedGoal,sb.getAttribute('data-mode'))}
  goalGrid.addEventListener('click',function(e){var b=e.target.closest('[data-goal]');if(!b)return;var goal=b.getAttribute('data-goal'),mode=b.getAttribute('data-mode');try{localStorage.setItem('bg2-goal',goal)}catch(x){}markGoal(goal,mode);recent=[norm(mode)].concat(recent.filter(function(x){return x!==norm(mode)})).slice(0,5);persistLists();renderTools();go(mode);if(window.matchMedia&&matchMedia('(max-width:620px)').matches){var w=document.querySelector('.wrap');if(w)w.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}});
  goalReset.addEventListener('click',function(){try{localStorage.removeItem('bg2-goal')}catch(e){}markGoal('','');});
  renderTools();renderNav();
  function sync(){
    var sel=tabs.querySelector('[aria-selected="true"]'),m=sel?sel.getAttribute('data-m'):'sw';m=M2G[m]||m;
    var bs=nav.querySelectorAll('button[data-go]');
    for(var i=0;i<bs.length;i++){var on=bs[i].getAttribute('data-go')===m;bs[i].classList.toggle('on',on);if(on)bs[i].setAttribute('aria-current','page');else bs[i].removeAttribute('aria-current')}
    var ex=NAVS.indexOf(m)<0;
    more.classList.toggle('on',ex);
    more.querySelector('.ni').textContent=ex?ICON[m]:'⋯';
    more.querySelector('.nl').textContent=ex&&sel?(GROUPS[m]?GROUPS[m].n:sel.textContent):'Thêm';
    var gb=grid.querySelectorAll('button');
    for(var j=0;j<gb.length;j++)gb[j].classList.toggle('on',gb[j].getAttribute('data-go')===m);
  }
  tabs.addEventListener('click',sync);
 tabs.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-m]');if(b&&!window.__nb)useBump(b.getAttribute('data-m'))});
  function closeSheet(){sheet.hidden=true}
  var reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  function reveal(){var w=document.querySelector('.wrap');if(w&&window.matchMedia&&matchMedia('(max-width:620px)').matches)w.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}
  nav.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b===more){openSheet();return}
    var m=b.getAttribute('data-go');if(m){go(m);reveal()}
  });
  sheet.addEventListener('click',function(e){
    var fav=e.target.closest('[data-fav]');
    if(fav){
      var fm=fav.getAttribute('data-fav'),at=favs.indexOf(fm);
      if(at>=0)favs.splice(at,1);else favs.unshift(fm);
      favs=favs.filter(function(m,i,a){return ALL.indexOf(m)>=0&&a.indexOf(m)===i}).slice(0,12);
      persistLists();renderTools();renderNav();sync();return;
    }
    var b=e.target.closest('button[data-go]');if(!b)return;
    var m=b.getAttribute('data-go');
    if(m){recent=[m].concat(recent.filter(function(x){return x!==m})).slice(0,5);persistLists();renderTools();closeSheet();go(m);reveal()}
  });
  if(search)search.addEventListener('input',renderTools);
  $('toolFilters').addEventListener('click',function(e){var b=e.target.closest('[data-filter]');if(!b)return;activeFilter=b.getAttribute('data-filter');renderTools()});
  function openSheet(){sheet.hidden=false;activeFilter='all';renderTools()}
  $('sheetbg').addEventListener('click',closeSheet);
  sync();
  /* Phím tắt: F và Esc */
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey||e.defaultPrevented)return;
    var tg=e.target.tagName;
    if(e.key==='Escape'){
      if(window.alertOpen)return;
      if(!sheet.hidden){closeSheet();return}
      if(document.body.classList.contains('focus'))setFocus(false);
      return;
    }
    if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA'||window.alertOpen)return;
    if((e.key==='f'||e.key==='F')&&!$('disp').hidden)setFocus(!document.body.classList.contains('focus'));
  });
  /* Nút Back của Android (chỉ trong app): đóng bảng/tập trung -> về Bấm giờ -> bấm 2 lần để thoát */
  if(document.documentElement.classList.contains('in-app')){
    var exitArmed=false,exitT=null;
    function curMode(){var s=tabs.querySelector('[aria-selected="true"]');return s?s.getAttribute('data-m'):'sw'}
    function backToast(msg){var t=$('toast');if(!t)return;t.textContent=msg;t.hidden=false;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');setTimeout(function(){t.hidden=true},1800)}
    try{history.replaceState({bg:0},'');history.pushState({bg:1},'')}catch(e){}
    window.addEventListener('popstate',function(){
      if(exitArmed){clearTimeout(exitT);var A=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App;if(A&&A.exitApp){A.exitApp()}else{try{history.back()}catch(e){}}return}
      try{history.pushState({bg:1},'')}catch(e){}
      if(window.FS&&window.FS.active()){window.FS.exit();return}
      if(window.alertOpen){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return}
      if(!sheet.hidden){closeSheet();return}
      if(document.body.classList.contains('focus')){setFocus(false);return}
      if(curMode()!=='sw'){go('sw');return}
      exitArmed=true;backToast('Bấm Quay lại lần nữa để thoát');
      exitT=setTimeout(function(){exitArmed=false},2000);
    });
  }
  /* Rung nhẹ khi bấm */
  var hap=$('hap'),hapOn=true;
  try{hapOn=localStorage.getItem('bg2-hap')!=='0'}catch(x){}
  hap.checked=hapOn;
  function buzz(ms){if(hapOn&&navigator.vibrate){try{navigator.vibrate(ms)}catch(x){}}}
  hap.addEventListener('change',function(){hapOn=hap.checked;try{localStorage.setItem('bg2-hap',hapOn?'1':'0')}catch(x){}buzz(12)});
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('button');
    if(b&&!b.disabled&&!b.closest('#tabs'))buzz(8);
  },true);
})();

;

(function(){
  "use strict";
  var DICT = {
    "Bấm giờ 2.0 — Tập trung, đếm ngược và quản lý thời gian": "Timer 2.0 — Focus, countdown and time management",
    "Bấm giờ": "Timer",
    "Đếm ngược": "Countdown",
    "Pomodoro": "Pomodoro",
    "Tập luyện": "Workout",
    "Nấu ăn": "Cooking",
    "Chia sẻ": "Share",
    "📚 Danh sách công cụ": "📚 All tools",
    "💬 Góp ý, báo lỗi": "💬 Feedback and bug report",
    "Thư viện mẫu": "Template library",
    "38 chế độ": "38 modes",
    "Ghi giờ công việc": "Work time tracker",
    "Biết mình dành bao lâu cho từng việc": "See how long each task takes",
    "Hẹn họp quốc tế": "International meeting",
    "Tìm giờ hợp cho mọi múi giờ": "Find a time that suits every time zone",
    "Ghi giờ:": "Time tracker:",
    "ghi lại thời gian dành cho từng việc, tự vào Thống kê và Lịch.": "log the time you spend on each task; it flows into Stats and the calendar.",
    "Họp chung:": "Meeting planner:",
    "chọn vài thành phố để tìm khung giờ họp hợp với mọi người.": "pick a few cities to find a meeting time that works for everyone.",
    "Ghi thời gian bạn dành cho từng việc, tự vào Thống kê và Lịch.": "Log the time you spend on each task; it goes into Stats and the calendar.",
    "Tìm khung giờ họp phù hợp giữa nhiều thành phố.": "Find a meeting time that suits several cities.",
    "Dòng thời gian trong ngày (Time Replay)": "Daily timeline (Time Replay)",
    "Mục tiêu, xuất và xoá dữ liệu": "Goal, export and clear data",
    "🗣 Đọc giờ": "🗣 Voice",
    "23 chế độ": "23 modes",
    "🎧 Nhạc của tôi": "🎧 My music",
    "Nghe nhạc nền": "Background music",
    "Nhạc trong máy, nối Pomodoro": "Your music, linked to Pomodoro",
    "Tập nhạc": "Practice music",
    "Máy gõ nhịp, chỉnh BPM": "Metronome with adjustable BPM",
    "Xem lịch âm": "Lunar calendar",
    "Đổi dương lịch và âm lịch": "Convert solar and lunar dates",
    "Đồng hồ để bàn": "Desk clock",
    "Số lớn, kiểu lật, kiểu kim": "Big digits, flip or analog styles",
    "Giữ thói quen": "Keep a habit",
    "Đếm chuỗi ngày liên tiếp": "Count your daily streak",
    "Tính lương giờ": "Hourly pay", "Hẹn giờ nhiều việc": "Multi-timers", "Quy tắc": "Rules", "Đóng ngày": "Close the day", "Ít dùng": "Rarely used", "Chốt ngày, dồn việc dở sang mai": "Wrap up the day, roll unfinished tasks to tomorrow", "Quy tắc nếu – thì tự động": "Automatic if-then rules", "Việc cần làm": "To-do", "Quản lý": "Manage", "Hôm nay và việc cần làm gắn với Pomodoro": "Today and to-dos linked to Pomodoro", "Tổng quan việc, tập trung, thói quen hôm nay": "Tasks, focus and habits at a glance", "Việc cần làm gắn với Pomodoro": "To-dos linked to Pomodoro", "Học tập": "Study", "Chuỗi thói quen": "Habit streaks", "Ngày & lịch": "Dates & calendar", "Giờ làm & lương": "Work hours & pay", "Sức khỏe & thể thao": "Health & fitness", "Âm nhạc": "Music", "Đồng hồ thi, đếm từ, ôn cách quãng, tiến độ đến hạn": "Exam clock, word counter, spaced review, deadline planner", "Chuỗi bước, nấu ăn, nhắc nhở định kỳ": "Step chains, cooking, repeating reminders", "Tính ngày, đếm ngày, tuổi, tuần trong năm, âm lịch": "Date math, day counter, age, week of year, lunar calendar", "Ghi giờ, cộng trừ giờ, tính lương, giờ xuất phát": "Time tracking, hour math, pay, time to leave", "Xem giờ, họp chung, mặt trời mọc lặn": "World clock, meeting planner, sunrise and sunset", "Pace, nhịp tim, đếm lần, uống nước, giờ ngủ, hít thở": "Pace, heart rate, tally, water, sleep, breathing", "Máy gõ nhịp và nhạc của tôi": "Metronome and my music", "Pace chạy bộ": "Running pace", "Tiến độ đến hạn": "Deadline planner", "Đếm từ": "Word counter", "Tuần trong năm": "Week of year", "Uống nước": "Water", "Vùng nhịp tim": "Heart rate zones", "Ôn tập cách quãng": "Spaced review", "Giờ xuất phát": "Time to leave", "Đếm lần": "Tally counter", "Ghi lượng nước uống mỗi ngày": "Log your daily water", "Vùng nhịp tim khi tập luyện": "Training heart rate zones", "Lịch ôn bài theo quãng tăng dần": "Review schedule with growing gaps", "Tính giờ phải xuất phát để kịp giờ": "When to leave to arrive on time", "Đếm số lần tập, lưu từng hiệp": "Count reps and save sets", "Pace, tốc độ và dự đoán thời gian chạy": "Pace, speed and race predictions", "Mỗi ngày cần làm bao nhiêu để kịp hạn": "How much per day to hit a deadline", "Đếm từ, thời gian đọc và thuyết trình": "Word count, reading and speaking time", "Tuần thứ mấy, ngày thứ mấy trong năm": "Week number and day of the year",
    "Giờ làm và tăng ca": "Work hours and overtime",
    "Âm lịch, Tính tuổi:": "Lunar calendar, Age:",
    "đổi dương lịch sang âm lịch, xem tuổi chính xác.": "convert solar to lunar dates, see your exact age.",
    "Cộng trừ giờ, Tính lương giờ:": "Time calculator, Hourly pay:",
    "tính khoảng giờ, cộng trừ giờ phút, ước tính lương và tăng ca.": "time between two times, add or subtract hours, estimate pay and overtime.",
    "Đồng hồ để bàn:": "Desk clock:",
    "số lớn nhiều kiểu (lật, neon, kim), toàn màn hình.": "big digits in several styles (flip, neon, analog), fullscreen.",
    "Chuỗi thói quen:": "Habit streaks:",
    "đánh dấu mỗi ngày, đếm số ngày liên tiếp.": "check in daily and count your streak.",
    "Mặt trời mọc lặn:": "Sunrise and sunset:",
    "giờ mọc, lặn và giờ vàng chụp ảnh.": "sunrise, sunset and golden hour times.",
    "Máy gõ nhịp:": "Metronome:",
    "chỉnh BPM, chia nhịp, âm sắc, tăng tốc dần.": "adjust BPM, subdivisions, sounds and gradual speed-up.",
    "Nhạc của tôi:": "My music:",
    "thêm nhạc từ máy để nghe nền, tự phát lúc làm việc khi bật Theo Pomodoro.": "add music from your device to play in the background; with Follow Pomodoro it plays while you work.",
    "⌨ Xem phím tắt trên máy tính": "⌨ View keyboard shortcuts",
    "Máy gõ nhịp cho người tập nhạc. Phím tắt: Space bắt đầu hoặc dừng, ↑ ↓ chỉnh BPM (Shift: ±5), T gõ nhịp.": "A metronome for musicians. Shortcuts: Space to start/stop, ↑ ↓ to change BPM (Shift: ±5), T to tap tempo.",
    "Phát nhạc có sẵn trong máy làm nhạc nền, nối với Pomodoro. Phím tắt: M phát hoặc dừng, N bài sau, B bài trước, ← → tua 10 giây, ↑ ↓ âm lượng.": "Play music from your device in the background, linked to Pomodoro. Shortcuts: M play/pause, N next, B previous, ← → seek 10 s, ↑ ↓ volume.",
    "Đồng hồ số lớn để bàn, giữ sáng màn hình. Phím tắt: F toàn màn hình, T đổi kiểu, H đổi 12 hoặc 24 giờ, S hiện hoặc ẩn giây.": "A big desk clock that keeps the screen on. Shortcuts: F fullscreen, T change style, H 12/24 hour, S show/hide seconds.",
    "Đánh dấu mỗi ngày và theo dõi chuỗi ngày liên tiếp. Gõ tên rồi nhấn Enter để thêm.": "Check in every day and track your streak. Type a name and press Enter to add.",
    "Sóng biển": "Ocean waves",
    "Gió": "Wind",
    "Lửa trại": "Campfire",
    "Nhạc của tôi": "My music",
    "Thư giãn 4-6": "Relax 4-6",
    "Cân bằng 6-6": "Balance 6-6",
    "Thở dài 2+1+6": "Sigh 2+1+6",
    "Hít thêm": "Inhale more",
    "Không giới hạn": "No limit",
    "🔔 Âm thanh": "🔔 Sound",
    "📳 Rung": "📳 Haptics",
    "📲 Tải app Android (APK)": "📲 Get Android app (APK)",
    "Bấm Quay lại lần nữa để thoát": "Press back again to exit",
    "☕ Ủng hộ người làm": "☕ Support the maker",
    "Bấm giờ miễn phí và không có quảng cáo. Nếu thấy hữu ích, bạn có thể mời mình một ly cà phê, hoàn toàn tùy tâm.": "Timer is free and ad-free. If you find it useful, you can buy me a coffee, entirely optional.",
    "Quét mã bằng app ngân hàng hoặc Momo. Cảm ơn bạn rất nhiều!": "Scan with your banking app or Momo. Thank you so much!",
    "Người nhận: NGUYEN HAI NAM": "Recipient: NGUYEN HAI NAM",
    "⬇ Lưu mã QR": "⬇ Save QR code",
    "Cài về màn hình": "Install app",
    "Thời gian của bạn.": "Your time.",
    "Bạn làm chủ thời gian.": "You're in control of your time.",
    "Một không gian để tập trung, học tập, luyện tập và quản lý từng phút — miễn phí, ngay trên điện thoại.": "A space to focus, study, train and manage every minute — free, right on your phone.",
    "Đo thời gian": "Measure time",
    "Đặt mục tiêu": "Set a goal",
    "Tập trung sâu": "Deep focus",
    "GIỜ ĐỊA PHƯƠNG": "LOCAL TIME",
    "Đang cập nhật ngày…": "Updating date…",
    "Không cần tài khoản": "No account needed",
    "Lần đầu sử dụng?": "First time here?",
    "Chỉ cần 3 bước để bắt đầu": "Just 3 steps to get started",
    "Chọn công cụ": "Choose a tool",
    "Ví dụ: Đếm ngược": "Example: Countdown",
    "Đặt thời gian": "Set the time",
    "Nhập phút, giây": "Enter minutes, seconds",
    "Bấm Bắt đầu": "Press Start",
    "Thế là xong!": "That’s it!",
    "BẮT ĐẦU THEO MỤC TIÊU": "START BY GOAL",
    "Hôm nay bạn muốn làm gì?": "What do you want to do today?",
    "Không cần nhớ tên công cụ — chọn việc bạn muốn làm.": "No need to remember tool names — choose what you want to do.",
    "Đổi mục tiêu": "Change goal",
    "Học tập trung": "Focused study",
    "Học theo phiên, có giờ nghỉ": "Study in sessions with breaks",
    "Canh nhiều món cùng lúc": "Time several dishes at once",
    "Chia thời gian tập và nghỉ": "Split work and rest time",
    "Thư giãn": "Relax",
    "Thực hành nhịp thở chậm": "Practice slow breathing",
    "Đếm đến sự kiện": "Count down to an event",
    "Kỳ thi, sinh nhật, chuyến đi": "Exams, birthdays, trips",
    "Đặt giờ bất kỳ": "Set any timer",
    "Đếm ngược và báo khi hết": "Count down and alert when finished",
    "Mẹo: mục tiêu bạn chọn gần nhất sẽ được ghi nhớ trên thiết bị này.": "Tip: your most recent goal will be remembered on this device.",
    "CHỌN CÔNG CỤ": "CHOOSE A TOOL",
    "12 chế độ": "12 modes",
    "Chuỗi bước": "Step routine",
    "Đồng hồ thi": "Exam timer",
    "Đếm ngày": "Day countdown",
    "Cờ vua": "Chess",
    "Hít thở": "Breathing",
    "Nhắc nhở": "Reminders",
    "Giờ thế giới": "World clock",
    "Tính giờ ngủ": "Sleep calculator",
    "Chưa tải được mã QR. Bạn thử lại sau nhé.": "Could not load the QR codes. Please try again later.",
    "Giáng sinh": "Christmas",
    "Vía Thần Tài": "God of Wealth Day",
    "Tết Hàn Thực": "Cold Food Festival",
    "Lễ Phật Đản": "Buddha's Birthday (Vesak)",
    "Tết Trùng Cửu": "Double Ninth Festival",
    "Rằm tháng Mười": "Full Moon of the 10th Month",
    "Giao thừa (Âm lịch)": "Lunar New Year's Eve",
    "Ngày thành lập Đảng": "Founding of the Communist Party of Vietnam",
    "Ngày Thầy thuốc Việt Nam": "Vietnamese Doctors' Day",
    "Valentine trắng": "White Day",
    "Cá tháng Tư": "April Fools' Day",
    "Ngày Sách Việt Nam": "Vietnam Book Day",
    "Ngày Trái đất": "Earth Day",
    "Chiến thắng Điện Biên Phủ": "Dien Bien Phu Victory Day",
    "Ngày sinh Chủ tịch Hồ Chí Minh": "President Ho Chi Minh's Birthday",
    "Quốc tế Thiếu nhi": "International Children's Day",
    "Ngày Gia đình Việt Nam": "Vietnamese Family Day",
    "Ngày Thương binh Liệt sĩ": "War Invalids and Martyrs Day",
    "Cách mạng Tháng Tám": "August Revolution Day",
    "Ngày khai giảng": "First Day of School",
    "Giải phóng Thủ đô": "Capital Liberation Day",
    "Ngày Doanh nhân Việt Nam": "Vietnamese Entrepreneurs' Day",
    "Ngày Pháp luật Việt Nam": "Vietnam Law Day",
    "Ngày Độc thân": "Singles' Day",
    "Ngày Quốc phòng toàn dân": "National Defense Day",
    "Đêm Giáng sinh": "Christmas Eve",
    "Giao thừa (Dương lịch)": "New Year's Eve",
    "Ngày của Mẹ": "Mother's Day",
    "Ngày của Cha": "Father's Day",
    "Lễ Tạ ơn": "Thanksgiving",
    "Theo thứ trong tuần": "By weekday",
    "Ngủ đủ giấc": "Get enough sleep",
    "Tính giờ đi ngủ hoặc thức dậy": "Plan bedtime or wake-up time",
    "Nghỉ mắt định kỳ": "Rest your eyes regularly",
    "Nhắc lặp lại, ví dụ mỗi 20 phút": "Repeating reminders, like every 20 minutes",
    "Làm bài thi": "Take an exam",
    "Canh giờ và các mốc báo": "Track time with alert marks",
    "Làm theo quy trình": "Follow a routine",
    "Nối nhiều bước thành một": "Chain several steps together",
    "Chơi cờ hai người": "Play chess",
    "Đồng hồ cho hai bên": "A clock for both players",
    "Gọi người ở xa": "Call someone far away",
    "Xem giờ nhiều thành phố": "See the time in several cities",
    "Tính số ngày": "Count days",
    "Giữa hai ngày, cộng trừ ngày": "Between two dates, add or subtract",
    "Bấm giờ và ghi từng vòng": "Stopwatch with laps",
    "Tập luyện theo vòng tập và nghỉ": "Workout rounds with rest",
    "Tính ngày": "Date calculator",
    "Tính giờ ngủ:": "Sleep calculator:",
    "Tính ngày:": "Date calculator:",
    "Gợi ý giờ đi ngủ hoặc thức dậy theo chu kỳ": "Suggest bedtimes or wake-up times by sleep cycle",
    "Số ngày giữa hai ngày, cộng trừ ngày tháng": "Days between two dates, add or subtract time",
    "Chọn giờ cần thức dậy để xem nên đi ngủ lúc nào, hoặc chọn giờ đi ngủ để xem nên dậy lúc nào. Tính theo chu kỳ ngủ khoảng 90 phút.": "Choose when you need to wake up to see when to go to bed, or choose a bedtime to see when to wake up. Based on roughly 90-minute sleep cycles.",
    "Tính số ngày giữa hai ngày, hoặc cộng trừ ngày, tuần, tháng, năm từ một ngày bất kỳ.": "Count the days between two dates, or add or subtract days, weeks, months or years from any date.",
    "gợi ý giờ đi ngủ hoặc thức dậy.": "suggests bedtimes or wake-up times.",
    "số ngày giữa hai ngày, cộng trừ ngày.": "days between two dates, add or subtract days.",
    "Vòng": "Lap",
    "Bắt đầu": "Start",
    "Các vòng": "Laps",
    "Sao chép": "Copy",
    "Cài đặt & thống kê": "Settings & statistics",
    "Âm thanh, thông báo, giao diện và tiến độ": "Sound, notifications, appearance and progress",
    "Âm lượng": "Volume",
    "Toàn màn hình": "Fullscreen",
    "⛶ Toàn màn hình": "⛶ Fullscreen",
    "⤢ Thoát toàn màn hình": "⤢ Exit fullscreen",
    "↻ Cùng hướng": "↻ Same orientation",
    "↔ Đối diện": "↔ Opposite sides",
    "Đồng hồ người chơi phía trên": "Top player's clock",
    "Đồng hồ người chơi phía dưới": "Bottom player's clock",
    "Không thể bật toàn màn hình": "Unable to enter fullscreen",
    "Trình duyệt có thể chưa hỗ trợ chế độ này. Hãy thử mở website bằng Chrome.": "Your browser may not support this mode. Try opening the website in Chrome.",
    "Tiếng báo": "Alert sound",
    "Nghe thử âm báo đang chọn": "Preview the selected alert",
    "▶ Thử âm báo": "▶ Test alert",
    "Âm nền": "Background sound",
    "Tắt": "Off",
    "Tiếng mưa": "Rain",
    "Ồn trắng": "White noise",
    "Ồn nâu": "Brown noise",
    "Thông báo khi hết giờ": "Notify when time is up",
    "Bật thông báo": "Enable notifications",
    "Thông báo trình duyệt đang tắt.": "Browser notifications are off.",
    "Giao diện": "Appearance",
    "Tự động": "Auto",
    "Sáng": "Light",
    "Tối": "Dark",
    "Biển": "Sea",
    "Rừng": "Forest",
    "Hồng": "Rose",
    "Chữ to": "Larger text",
    "Rung nhẹ": "Light vibration",
    "Thống kê": "Statistics",
    "Ít": "Less",
    "Nhiều": "More",
    "Mục tiêu mỗi ngày": "Daily goal",
    "phút": "min",
    "Xóa thống kê": "Clear statistics",
    "Hướng dẫn nhanh": "Quick guide",
    "là trang web miễn phí gồm nhiều loại đồng hồ: bấm giờ, đếm ngược, Pomodoro, tập luyện, đồng hồ thi, đồng hồ cờ vua, nhắc nhở lặp lại, đếm ngược đến Tết và các ngày lễ, giờ thế giới. Không cần đăng ký, dùng được cả khi không có mạng.": "is a free website with many timers: stopwatch, countdown, Pomodoro, workouts, exam timer, chess clock, repeating reminders, countdown to Tet and holidays, and world clock. No sign-up required; works offline.",
    "Bấm giờ:": "Stopwatch:",
    "đếm lên, ghi vòng (mỗi lần dừng cũng thành một vòng).": "count up and record laps (each stop also becomes a lap).",
    "Đếm ngược, Pomodoro, Tập luyện:": "Countdown, Pomodoro, Workout:",
    "đặt thời gian rồi bấm Bắt đầu, có thể chạy ngầm khi bạn sang tab khác.": "set a time and press Start; it can keep running when you switch tabs.",
    "Chuỗi bước:": "Step routine:",
    "nối nhiều bước thành một quy trình.": "link multiple steps into one routine.",
    "Đồng hồ thi:": "Exam timer:",
    "tổng thời gian và các mốc báo.": "total time and alert checkpoints.",
    "Đếm ngày:": "Day countdown:",
    "đếm ngược đến một ngày quan trọng.": "count down to an important date.",
    "Cờ vua:": "Chess:",
    "hai người, chạm nút bên mình sau khi đi.": "two players; tap your side after moving.",
    "Nấu ăn, Nhắc nhở:": "Cooking, Reminders:",
    "nhiều bộ đếm cùng lúc.": "multiple timers at once.",
    "Hít thở:": "Breathing:",
    "theo vòng tròn to nhỏ.": "follow an expanding and contracting circle.",
    "Giờ thế giới:": "World clock:",
    "xem giờ nhiều thành phố.": "see the time in multiple cities.",
    "Mẹo:": "Tip:",
    "bấm Lưu mẫu để dùng lại cài đặt, bấm Chia sẻ để gửi link cho bạn bè. Trên máy tính dùng phím Space (bắt đầu hoặc dừng), L (ghi vòng), R (đặt lại), F (chế độ tập trung), M (phát hoặc dừng nhạc), các phím số 1 đến 9 và 0 (chuyển nhanh công cụ), dấu ? (xem tất cả phím tắt). Trên điện thoại, bấm biểu tượng ở góc trên bên phải đồng hồ để vào chế độ tập trung. Cần để trang mở thì đồng hồ mới kêu đúng giờ, mở lại trang trong 24 giờ vẫn giữ đồng hồ đang chạy.": "press Save preset to reuse settings, or Share to send a link. On desktop use Space (start/pause), L (lap), R (reset), F (focus mode), M (play/pause music), number keys 1 to 9 and 0 (jump between tools), ? (all shortcuts). On mobile, tap the icon at the top right of the clock for focus mode. Keep the page open for the alarm to sound; reopening within 24 hours restores a running timer.",
    "Thêm": "Add",
    "Tìm công cụ phù hợp": "Find a suitable tool",
    "15 mục, gồm 38 chế độ. Bấm ☆ để ghim tối đa 4 công cụ lên thanh dưới.": "15 items covering 38 modes. Tap ☆ to pin up to 4 tools to the bottom bar.",
    "Tất cả": "All",
    "📚 Học tập": "📚 Study",
    "⏱️ Bộ đếm giờ": "⏱️ Timers",
    "🏠 Sinh hoạt": "🏠 Daily life",
    "🌿 Thư giãn": "🌿 Relax",
    "♟️ Trò chơi": "♟️ Games",
    "★ Yêu thích": "★ Favorites",
    "↻ Dùng gần đây": "↻ Recent",
    "Tất cả công cụ": "All tools",
    "Đến giờ!": "Time’s up!",
    "Đã biết": "Got it",
    "Dừng": "Pause",
    "Đặt lại": "Reset",
    "Tiếp tục": "Resume",
    "Chạy lại": "Run again",
    "Xóa": "Delete",
    "Lưu": "Save",
    "Lưu mẫu": "Save preset",
    "Hôm nay": "Today",
    "Hôm qua": "Yesterday",
    "Trước": "Previous",
    "Sau": "Next",
    "Tuần": "Week",
    "Ngày": "Day",
    "‹ Trước": "‹ Previous",
    "Sau ›": "Next ›",
    "Pomodoro 25/5": "Pomodoro 25/5",
    "Học 50/10": "Study 50/10",
    "Tabata 20/10": "Tabata 20/10",
    "Plank 30/15": "Plank 30/15",
    "Buổi sáng": "Morning routine",
    "Học 3 bước": "3-step study",
    "Tập cơ bản": "Basic workout",
    "Ôn bài cũ": "Review old material",
    "Học bài mới": "Learn new material",
    "Làm bài tập": "Do exercises",
    "Khởi động": "Warm-up",
    "Tập chính": "Main workout",
    "Giãn cơ": "Stretching",
    "Đánh răng": "Brush teeth",
    "Ăn sáng": "Breakfast",
    "Nghỉ mắt 20 phút": "Rest eyes 20 min",
    "Uống nước 60 phút": "Drink water 60 min",
    "Đứng dậy 45 phút": "Stand up 45 min",
    "Vươn vai 30 phút": "Stretch 30 min",
    "Trứng luộc 8 phút": "Boiled eggs 8 min",
    "Mì gói 3 phút": "Instant noodles 3 min",
    "Cơm 20 phút": "Rice 20 min",
    "Trà 5 phút": "Tea 5 min",
    "Bài tập hít thở": "Breathing exercise",
    "Báo khi còn": "Alert when remaining",
    "Báo vàng khi còn (phút)": "Yellow alert when remaining (min)",
    "Bíp": "Beep",
    "Bước": "Step",
    "Bạn đang mở trang trong ứng dụng khác (Zalo, Messenger...). Hãy bấm menu ba chấm, chọn \"Mở bằng trình duyệt\", rồi bấm lại nút này trong Chrome hoặc Safari.": "You opened this page inside another app (Zalo, Messenger…). Tap the three-dot menu, choose “Open in browser”, then tap this button again in Chrome or Safari.",
    "Bạn đã bật tùy chọn; hãy cấp quyền trình duyệt để thông báo hoạt động.": "You enabled the option; grant browser permission for notifications to work.",
    "Bấm giờ miễn phí: đếm ngược, Pomodoro, tập luyện, đồng hồ thi, đồng hồ cờ vua, nhắc nhở, đếm ngày đến Tết và giờ thế giới. Dùng được cả khi không có mạng.": "Free timer: countdown, Pomodoro, workouts, exam timer, chess clock, reminders, countdown to Tet and world clock. Works offline.",
    "Bấm giờ, đếm ngược, Pomodoro, cờ vua, nhắc nhở và nhiều đồng hồ khác": "Timer, countdown, Pomodoro, chess, reminders and more",
    "Bấm giờ: đếm ngược, Pomodoro, cờ vua và hơn thế nữa": "Timer: countdown, Pomodoro, chess and more",
    "Bấm menu ba chấm của Chrome, chọn \"Cài đặt ứng dụng\" hoặc \"Thêm vào Màn hình chính\". Nếu không thấy, hãy mở trang bằng Chrome.": "Tap Chrome’s three-dot menu and choose “Install app” or “Add to Home screen”. If you don’t see it, open the page in Chrome.",
    "Bấm nút Chia sẻ của Safari (hình ô vuông có mũi tên), kéo xuống và chọn \"Thêm vào Màn hình chính\".": "Tap Safari’s Share button (square with an arrow), scroll down and choose “Add to Home Screen”.",
    "Bộ đếm thời gian đã hoàn thành.": "Timer completed.",
    "Canh giờ làm bài và mốc báo": "Time your test and set alerts",
    "Chia công việc thành nhiều bước": "Split work into steps",
    "Chuông": "Bell",
    "Chưa có bước nào, hãy thêm bước bên dưới": "No steps yet — add one below",
    "Chưa có vòng nào. Bấm “Vòng” khi đồng hồ đang chạy để ghi lại.": "No laps yet. Tap “Lap” while the stopwatch is running to record one.",
    "Chế độ tập trung": "Focus mode",
    "Cách sử dụng nhanh": "Quick start",
    "Còi": "Whistle",
    "Còn ": "Remaining ",
    "Có thể chạy nhiều món cùng lúc. Gõ tên và số phút rồi bấm Enter để thêm. Đừng tắt trang khi đang nấu.": "You can time several dishes at once. Type a name and minutes, then press Enter to add. Keep this page open while cooking.",
    "Cộng thêm mỗi nước (giây)": "Add per move (seconds)",
    "Cờ vua: hết giờ": "Chess: time’s up",
    "Dương lịch": "Solar calendar",
    "Hết giờ": "Time's up",
    "Hết giờ: ": "Time's up: ",
    "Giữ hơi": "Hold",
    "Hãy nhấn “Bật thông báo” để cấp quyền trước.": "Tap “Enable notifications” first to grant permission.",
    "Hít vào": "Inhale",
    "Hít thở chậm để thư giãn": "Slow breathing to relax",
    "Hôm nay chưa có lượt nào hoàn thành.": "No completed sessions today.",
    "Hôm nay!": "Today!",
    "Hướng dẫn": "Guide",
    "Hẹn giờ nhiều món ăn cùng lúc": "Time multiple dishes at once",
    "Học tập trung xen kẽ thời gian nghỉ": "Alternate focus and breaks",
    "Lịch hoạt động 15 tuần gần nhất": "Activity for the last 15 weeks",
    "Lọc theo nhóm": "Filter by category",
    "Máy này không hỗ trợ": "Not supported on this device",
    "Món ": "Dish ",
    "Mẫu ": "Preset ",
    "Mốc 1 (phút)": "Checkpoint 1 (min)",
    "Mốc 2 (phút)": "Checkpoint 2 (min)",
    "Mốc 3 (phút)": "Checkpoint 3 (min)",
    "Mốc 4 (phút)": "Checkpoint 4 (min)",
    "Mốc báo tiếp theo sau ": "Next alert after ",
    "Mỗi bên": "Each side",
    "Mở nhanh công cụ": "Quick open tools",
    "Mục tiêu gần nhất: ": "Latest goal: ",
    "Nghỉ": "Break",
    "Nghỉ (giây)": "Rest (seconds)",
    "Nghỉ dài": "Long break",
    "Nghỉ ngắn": "Short break",
    "Nhắc lặp lại theo chu kỳ, ví dụ cứ 20 phút nghỉ mắt. Cần để trang mở, màn hình được giữ sáng khi có nhắc nhở đang chạy. Enter để thêm.": "Repeat reminders on a cycle, for example rest your eyes every 20 minutes. Keep the page open and the screen awake while a reminder runs. Press Enter to add.",
    "Nhắc mỗi ": "Remind every ",
    "Nhắc nghỉ mắt hoặc việc định kỳ": "Remind you to rest your eyes or do recurring tasks",
    "Nhắc nhở định kỳ": "Recurring reminders",
    "Nhẹ": "Light",
    "Phím tắt trên máy tính: Space bắt đầu hoặc dừng, L ghi vòng, R đặt lại (khi đang dừng). Mỗi lần dừng cũng được tính là một vòng.": "Desktop shortcuts: Space to start/pause, L for lap, R to reset (while paused). Each pause also counts as a lap.",
    "Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Dùng cho tập gym, chạy ngắt quãng, plank, có tiếng bíp mỗi khi đổi giai đoạn.": "Shortcuts: Space to start/pause, R to reset. For gym, intervals or planks; beeps at each phase change.",
    "Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Hết giờ sẽ có tiếng bíp. Hãy bật âm thanh và giữ tab này mở.": "Shortcuts: Space to start/pause, R to reset. A beep sounds when time is up. Turn on sound and keep this tab open.",
    "Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Làm việc tập trung rồi nghỉ ngắn, sau 4 phiên là nghỉ dài, tự chuyển giai đoạn.": "Shortcuts: Space to start/pause, R to reset. Focus, take a short break, and after 4 sessions take a long break; phases switch automatically.",
    "Phím tắt: Space bắt đầu hoặc dừng. To ra là hít vào, nhỏ lại là thở ra.": "Shortcut: Space to start/pause. Growing means inhale; shrinking means exhale.",
    "Phím tắt: Space kết thúc nước đi của người đang đi (lần đầu tính là người bên dưới), P tạm dừng, R đặt lại. Trên điện thoại, chạm nút bên mình sau khi đi. Nút phía trên xoay ngược cho người ngồi đối diện.": "Shortcuts: Space ends the current player’s move (first press counts for the bottom player), P pauses, R resets. On mobile, tap your side after moving. The top button is rotated for the opposite player.",
    "Phút": "Minutes",
    "Pomodoro — học tập trung": "Pomodoro — focused study",
    "Quy trình": "Routine",
    "Quyền thông báo bị chặn": "Notification permission blocked",
    "Sẵn sàng": "Ready",
    "Số vòng": "Number of rounds",
    "Sự kiện ": "Event ",
    "Thi 45 phút": "45-minute exam",
    "Thi 90 phút": "90-minute exam",
    "Thoát chế độ tập trung": "Exit focus mode",
    "Thuyết trình": "Presentation",
    "Thông báo ngoài trang đang tắt. Hộp báo trong website vẫn hoạt động bình thường.": "Background notifications are off. In-page alerts still work normally.",
    "Thông báo đang bị chặn trong cài đặt trình duyệt. Bạn vẫn có thể dùng hộp báo trong trang.": "Notifications are blocked in browser settings. You can still use in-page alerts.",
    "Thông báo đã được cấp quyền": "Notification permission granted",
    "Thời lượng (phút)": "Duration (minutes)",
    "Thở ra": "Exhale",
    "Thử: học bài, thi, nấu ăn…": "Try: study, exams, cooking…",
    "Trình duyệt này không hỗ trợ thông báo ngoài trang; hộp báo trong website vẫn hoạt động.": "This browser does not support background notifications; in-page alerts still work.",
    "Tìm công cụ theo tên hoặc mục đích": "Search tools by name or purpose",
    "Tạo quy trình gồm nhiều bước nối nhau, ví dụ buổi sáng: đánh răng, tập, ăn sáng. Phím tắt: Space bắt đầu hoặc dừng, R đặt lại. Có thể lưu thành mẫu.": "Create a routine with linked steps, such as a morning routine: brush teeth, exercise, breakfast. Shortcuts: Space to start/pause, R to reset. Save it as a preset.",
    "Xem giờ nhiều thành phố cùng lúc. Chọn thành phố rồi bấm Thêm. Chênh lệch giờ tính so với múi giờ của máy bạn.": "See the time in multiple cities. Choose a city and tap Add. Time differences are relative to your device’s time zone.",
    "Xem giờ ở nhiều thành phố": "See time in multiple cities",
    "Xong rồi!": "Done!",
    "Xong rồi! - Bấm giờ": "Done! - Timer",
    "Xong rồi: ": "Done: ",
    "bên dưới": "bottom",
    "bên trên": "top",
    "chưa có": "none",
    "chậm hơn bạn ": "slower than you ",
    "cùng giờ với bạn": "same time as you",
    "nhanh hơn bạn ": "faster than you ",
    "Đã chép": "Copied",
    "Đã nhắc ": "Reminded ",
    "Đã qua ": "Elapsed ",
    "Đã xong ": "Completed ",
    "Đã đến giờ.": "Time's up.",
    "Đạt mục tiêu hôm nay! 🎉": "Daily goal reached! 🎉",
    "Đặt phút giây và báo khi hết giờ": "Set minutes/seconds and alert when finished",
    "Đặt tổng thời gian làm bài và các mốc báo (số phút còn lại). Mốc lớn hơn hoặc bằng tổng thời gian sẽ bị bỏ qua, để 0 là không dùng. Phím tắt: Space bắt đầu hoặc dừng, R đặt lại.": "Set total exam time and alert checkpoints (minutes remaining). Checkpoints greater than or equal to the total time are ignored; use 0 to disable. Shortcuts: Space to start/pause, R to reset.",
    "Đếm ngược đến một ngày quan trọng như thi, sinh nhật, du lịch. Gõ tên, chọn ngày rồi bấm Enter hoặc nút Thêm. Dữ liệu lưu trên trình duyệt của bạn.": "Count down to an important date such as an exam, birthday or trip. Type a name, choose a date, then press Enter or Add. Data is stored in your browser.",
    "Đếm ngược đến ngày": "Countdown to date",
    "Đếm đến kỳ thi, sinh nhật, sự kiện": "Count down to exams, birthdays, events",
    "Đến giờ: ": "Time's up: ",
    "Đều 5-5": "Even 5-5",
    "Đồng hồ cho hai người chơi cờ": "Clock for two chess players",
    "Đồng hồ cờ vua": "Chess clock",
    "Đồng hồ nấu ăn": "Cooking timer",
    "Đồng hồ theo từng bước": "Step-by-step timer",
    "Đo thời gian đã trôi qua, ghi vòng": "Measure elapsed time and record laps",
    "Đã bật: trình duyệt có thể hiện thông báo khi hết giờ. Android có thể tạm dừng trang chạy nền.": "Enabled: the browser can show notifications when time is up. Android may pause background pages.",
    "Ông Công, Ông Táo": "Kitchen Gods Day",
    "Time Replay": "Time Replay",
    "Chưa có phiên nào được ghi trong khoảng này.": "No sessions recorded in this period.",
    "đang chạy": "running",
    "Phiên": "Session",
    "phiên": "sessions",
    "Tuần từ ": "Week of ",
    "Mục tiêu hôm nay": "Today’s goal",
    "7 ngày qua: ": "Last 7 days: ",
    ". Chuỗi ": ". Streak: ",
    " ngày liên tiếp.": " consecutive days.",
    "Xuất CSV": "Export CSV",
    "7 ngày gần nhất": "Last 7 days",
    "30 ngày gần nhất": "Last 30 days",
    "Chưa có dữ liệu trong khoảng thời gian này.": "No data for this period.",
    "Đã xuất ": "Exported ",
    " dòng thống kê.": " statistic rows.",
    "Không xuất được CSV.": "Could not export CSV.",
    "Trục thời gian các phiên trong ngày": "Timeline of sessions in the day",
    "Thành phố": "City",
    "Ngày lễ có sẵn": "Available holidays",
    "Thêm ngày lễ có sẵn...": "Add an available holiday...",
    "Tên món": "Dish name",
    "Tên nhắc nhở": "Reminder name",
    "Tên sự kiện": "Event name",
    "Tên bước": "Step name",
    "Tên quy trình": "Routine name",
    "Tên mẫu mới": "New preset name",
    "Chưa có món nào. Nhập tên và số phút rồi bấm Thêm.": "No dishes yet. Enter a name and minutes, then tap Add.",
    "Chưa có ngày nào. Nhập tên, chọn ngày rồi bấm Thêm.": "No dates yet. Enter a name, choose a date, then tap Add.",
    "Chưa có nhắc nhở nào. Nhập tên và thời gian lặp lại rồi bấm Thêm.": "No reminders yet. Enter a name and repeat interval, then tap Add.",
    "Chưa có thành phố nào. Chọn thành phố ở trên rồi bấm Thêm.": "No cities yet. Choose a city above and tap Add.",
    "Chưa có bước nào. Thêm bước bên dưới hoặc chọn một mẫu.": "No steps yet. Add a step below or choose a preset.",
    "Chưa có công cụ ở đây.": "No tools here.",
    "Không tìm thấy công cụ phù hợp. Thử từ khóa khác hoặc chọn “Tất cả”.": "No matching tool. Try another keyword or choose “All”.",
    "Làm bài": "Take the test",
    "Thời gian còn lại": "Time remaining",
    "Thời gian đã trôi qua": "Elapsed time",
    "Vòng hiện tại: ": "Current lap: ",
    "Mỗi nước": "Each move",
    "chậm nhất": "slowest",
    "nhanh nhất": "fastest",
    "Làm việc, phiên ": "Work, session ",
    "Tập, vòng ": "Workout, lap ",
    "Nhắc nhở ": "Reminder ",
    " (tổng ": " (total ",
    " hết giờ": " time's up",
    "Giây": "Seconds",
    "Tổng thời gian": "Total time",
    "Chọn khoảng thời gian xuất CSV": "Choose CSV export range",
    "Âm lịch": "Lunar calendar",
    "Tết Nguyên Đán": "Lunar New Year",
    "Rằm tháng Giêng": "First Full Moon Festival",
    "Giỗ Tổ Hùng Vương": "Hung Kings’ Commemoration Day",
    "Tết Đoan Ngọ": "Dragon Boat Festival",
    "Lễ Vu Lan": "Vu Lan Festival",
    "Tết Trung thu": "Mid-Autumn Festival",
    "Tết Dương lịch": "New Year's Day",
    "Quốc tế Phụ nữ": "International Women's Day",
    "Giải phóng miền Nam": "Reunification Day",
    "Quốc tế Lao động": "International Workers' Day",
    "Quốc khánh": "National Day",
    "Ngày Phụ nữ Việt Nam": "Vietnamese Women's Day",
    "Ngày Nhà giáo Việt Nam": "Vietnamese Teachers' Day",
    "Tập thể dục": "Exercise",
    " trên ": " of ",
    "Trên": "On",
    "Dưới": "Under",
    " lần": " times",
    "Không có dữ liệu": "No data",
    "Chọn thành phố": "Choose a city",
    "Chọn ngày": "Choose a date",
    "Thêm ngày": "Add date",
    "Thêm nhắc nhở": "Add reminder",
    "Thêm thành phố": "Add city",
    "Thêm bước": "Add step",
    "Đóng": "Close",
    "Quay lại": "Back",
    "Hoàn thành": "Complete"
  };
  var PHRASES = [
    [
      "Còn ",
      "Remaining "
    ],
    [
      "Hết giờ",
      "Time's up"
    ],
    [
      "Đến giờ",
      "Time's up"
    ],
    [
      "Xong rồi",
      "Done"
    ],
    [
      "Đã qua",
      "Elapsed"
    ],
    [
      "Đã nhắc",
      "Reminded"
    ],
    [
      "Đã xong",
      "Completed"
    ],
    [
      "Làm việc",
      "Work"
    ],
    [
      "Nghỉ",
      "Break"
    ],
    [
      "Vòng",
      "Lap"
    ],
    [
      "Bước",
      "Step"
    ],
    [
      "Món",
      "Dish"
    ],
    [
      "Người",
      "Player"
    ],
    [
      "Mẫu",
      "Preset"
    ],
    [
      "Quy trình",
      "Routine"
    ],
    [
      "Sự kiện",
      "Event"
    ],
    [
      "phút",
      "min"
    ],
    [
      "giây",
      "sec"
    ],
    [
      "giờ",
      "h"
    ],
    [
      "ngày",
      "days"
    ],
    [
      "tuần",
      "weeks"
    ],
    [
      "phiên",
      "sessions"
    ],
    [
      "lần",
      "times"
    ],
    [
      "công cụ",
      "tools"
    ],
    [
      "tổng",
      "total"
    ],
    [
      "chưa có",
      "none"
    ],
    [
      "mỗi",
      "every"
    ],
    [
      "chậm hơn bạn",
      "slower than you"
    ],
    [
      "nhanh hơn bạn",
      "faster than you"
    ],
    [
      "cùng giờ với bạn",
      "same time as you"
    ],
    [
      "bên trên",
      "top"
    ],
    [
      "bên dưới",
      "bottom"
    ],
    [
      "Hôm nay",
      "Today"
    ],
    [
      "Hôm qua",
      "Yesterday"
    ],
    [
      "Tuần từ ",
      "Week of "
    ],
    [
      "đang chạy",
      "running"
    ],
    [
      "7 ngày qua: ",
      "Last 7 days: "
    ],
    [
      ". Chuỗi ",
      ". Streak: "
    ],
    [
      " ngày liên tiếp.",
      " consecutive days."
    ],
    [
      "Mục tiêu hôm nay",
      "Today’s goal"
    ],
    [
      "Đã xuất ",
      "Exported "
    ],
    [
      " dòng thống kê.",
      " statistic rows."
    ],
    [
      "Làm việc, phiên ",
      "Work, session "
    ],
    [
      "Tập, vòng ",
      "Workout, lap "
    ],
    [
      "Nhắc nhở ",
      "Reminder "
    ],
    [
      "Vòng hiện tại: ",
      "Current lap: "
    ],
    [
      " (tổng ",
      " (total "
    ],
    [
      " hết giờ",
      " time's up"
    ],
    [
      "Mỗi nước",
      "Each move"
    ],
    [
      "Thời gian còn lại",
      "Time remaining"
    ],
    [
      "Thời gian đã trôi qua",
      "Elapsed time"
    ],
    [
      "chậm nhất",
      "slowest"
    ],
    [
      "nhanh nhất",
      "fastest"
    ],
    [
      "Làm bài",
      "Take the test"
    ],
    [
      "Thành phố",
      "City"
    ],
    [
      "Ngày lễ có sẵn",
      "Available holidays"
    ],
    [
      "Tên món",
      "Dish name"
    ],
    [
      "Tên nhắc nhở",
      "Reminder name"
    ],
    [
      "Tên sự kiện",
      "Event name"
    ],
    [
      "Tên bước",
      "Step name"
    ],
    [
      "Tên quy trình",
      "Routine name"
    ],
    [
      "Tên mẫu mới",
      "New preset name"
    ]
  ];
  // Keep the selected language on this device. Text nodes and attributes are tracked
  // separately so dynamic UI updates can be translated without losing their source.
  var KEY = "bg2-lang";
  var lang = "vi";
  var origTitle = document.title;
  var applying = false;
  var originalTexts = new WeakMap();
  var originalAttrs = new WeakMap();

  try { lang = localStorage.getItem(KEY) || "vi"; } catch (e) {}

  function hasVietnamese(text) {
    return /[ăâêôơưđáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừởỡợýỳỷỹỵ]/i.test(text);
  }

  function exact(text) {
    var key = String(text).trim();
    return Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : null;
  }

  // Fallback is intentionally secondary to full-sentence translations.
  function phrase(text) {
    var out = text;
    // Longer phrases first so a short word cannot damage a complete expression.
    var rules = PHRASES.slice().sort(function (a, b) { return b[0].length - a[0].length; });
    for (var i = 0; i < rules.length; i++) {
      var from = rules[i][0];
      var to = rules[i][1];
      if (!from) continue;
      if (/^[A-Za-zÀ-ỹ]+$/.test(from)) {
        // Match whole Vietnamese words only (e.g. don't translate inside another word).
        var escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var pattern = new RegExp("(^|[^A-Za-zÀ-ỹ])" + escaped + "(?=$|[^A-Za-zÀ-ỹ])", "gi");
        out = out.replace(pattern, function (match, prefix) { return prefix + to; });
      } else if (out.indexOf(from) !== -1) {
        out = out.split(from).join(to);
      }
    }
    return out;
  }

  function translateString(source) {
    var leading = (source.match(/^\s*/) || [""])[0];
    var trailing = (source.match(/\s*$/) || [""])[0];
    var core = source.slice(leading.length, source.length - trailing.length);
    if (!core) return source;
    var translated = exact(core);
    if (!translated && hasVietnamese(core)) translated = phrase(core);
    return translated ? leading + translated + trailing : source;
  }

  function translateTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    var current = node.nodeValue;
    if (!current || !current.trim()) return;
    var record = originalTexts.get(node);

    if (lang === "en") {
      // If the current text is our last translation, translate from the original.
      // Otherwise the app changed it dynamically; accept that new source text.
      var source = record && current === record.translated ? record.source : current;
      var translated = translateString(source);
      originalTexts.set(node, { source: source, translated: translated });
      if (translated !== current) node.nodeValue = translated;
    } else if (record) {
      if (current === record.translated) {
        if (current !== record.source) node.nodeValue = record.source;
      } else {
        // Preserve fresh text generated while English was selected.
        originalTexts.set(node, { source: current, translated: current });
      }
    }
  }

  function translateAttributes(el) {
    ["placeholder", "aria-label", "title"].forEach(function (attr) {
      if (!el.hasAttribute || !el.hasAttribute(attr)) return;
      var current = el.getAttribute(attr);
      if (!current) return;
      var records = originalAttrs.get(el) || {};
      var record = records[attr];

      if (lang === "en") {
        var source = record && current === record.translated ? record.source : current;
        var translated = translateString(source);
        records[attr] = { source: source, translated: translated };
        originalAttrs.set(el, records);
        if (translated !== current) el.setAttribute(attr, translated);
      } else if (record) {
        if (current === record.translated) {
          if (current !== record.source) el.setAttribute(attr, record.source);
        } else {
          records[attr] = { source: current, translated: current };
          originalAttrs.set(el, records);
        }
      }
    });
  }

  function walk(root) {
    if (!root) return;
    var elements = [];
    if (root.nodeType === 1) elements.push(root);
    try { elements = elements.concat(Array.prototype.slice.call(root.querySelectorAll("*"))); }
    catch (e) { return; }

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      // Never translate source code or editable/user-entered content.
      if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName) || el.isContentEditable || (el.closest && el.closest("[data-notr]"))) continue;
      if (el.id === "langBtn") continue;

      for (var j = 0; j < el.childNodes.length; j++) {
        var child = el.childNodes[j];
        if (child.nodeType === 3) translateTextNode(child);
      }
      translateAttributes(el);
    }
  }

  function applyLanguage() {
    if (applying) return;
    applying = true;
    try { walk(document.body); } catch (e) {}
    try { document.title = lang === "en" ? (exact(origTitle) || phrase(origTitle)) : origTitle; } catch (e) {}

    var button = document.getElementById("langBtn");
    if (button) {
      var buttonText = lang === "en" ? "VIE" : "ENG";
      var buttonLabel = lang === "en" ? "Switch to Vietnamese" : "Switch to English";
      if (button.textContent !== buttonText) button.textContent = buttonText;
      if (button.getAttribute("aria-label") !== buttonLabel) button.setAttribute("aria-label", buttonLabel);
    }
    try { document.documentElement.lang = lang; } catch (e) {}
    applying = false;
  }

  var langButton = document.getElementById("langBtn");
  if (langButton) {
    langButton.addEventListener("click", function () {
      lang = lang === "vi" ? "en" : "vi";
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      applyLanguage();
    });
  }

  // Re-translate newly rendered controls, including controls updated after interaction.
  try {
    var pending = null;
    var observer = new MutationObserver(function () {
      if (applying || lang !== "en") return;
      if (pending) clearTimeout(pending);
      pending = setTimeout(function () {
        if (!applying && lang === "en") applyLanguage();
      }, 80);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title"]
    });
  } catch (e) {}

  if (lang === "en") applyLanguage();
  else {
    document.documentElement.lang = "vi";
    if (langButton) {
      langButton.textContent = "ENG";
      langButton.setAttribute("aria-label", "Switch to English");
    }
  }
})();

;
(function(){try{var a=document.getElementById('dlApk');if(a&&/Android/i.test(navigator.userAgent)&&!document.documentElement.classList.contains('in-app'))a.hidden=false}catch(e){}})();
;

/* SAO LƯU / KHÔI PHỤC: gom cài đặt, thống kê, mẫu, nhắc nhở... trong localStorage thành một file JSON. Nhạc trong máy (IndexedDB) không nằm trong bản sao lưu. */
(function(){try{
var out=document.getElementById('bk-out'),inn=document.getElementById('bk-in'),fi=document.getElementById('bk-file'),msg=document.getElementById('bk-msg');
if(!out||!inn||!fi||!msg)return;
var KEY=/^bg(2x?)?-[^@]*$/;
function en(){return document.documentElement.lang==='en'}
function T(v,e){return en()?e:v}
function labels(){out.textContent=T('Sao lưu','Back up');inn.textContent=T('Khôi phục','Restore');
 if(!msg.getAttribute('data-set'))msg.textContent=T('Sao lưu gồm cài đặt, thống kê, mẫu và nhắc nhở. Nhạc trong máy không nằm trong bản sao lưu.','Backup includes settings, stats, presets and reminders. Music from your device is not included.')}
function say(s){msg.setAttribute('data-set','1');msg.textContent=s}
function collect(){var o={},i,k;for(i=0;i<localStorage.length;i++){k=localStorage.key(i);if(KEY.test(k)&&k!=='bg2x-upchk')o[k]=localStorage.getItem(k)}return o}
out.addEventListener('click',function(){try{
 var data=collect(),n=Object.keys(data).length;
 var text=JSON.stringify({app:'bam-gio',version:1,exported:new Date().toISOString(),data:data});
 var d=new Date(),p=function(x){return x<10?'0'+x:''+x};
 var fname='sao-luu-bam-gio-'+d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'.json';
 if(window.SAVE&&window.SAVE(fname,text,'application/json')){say(T('Đã sao lưu ','Backed up ')+n+T(' mục dữ liệu.',' items.'));return}
 var blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=fname;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000);
 say(T('Đã sao lưu ','Backed up ')+n+T(' mục dữ liệu.',' items.'));
}catch(e){say(T('Không sao lưu được.','Could not back up.'))}});
inn.addEventListener('click',function(){fi.value='';fi.click()});
fi.addEventListener('change',function(){try{
 var f=fi.files&&fi.files[0];if(!f)return;
 if(f.size>5*1024*1024){say(T('File quá lớn, không phải bản sao lưu của Bấm giờ.','File is too large to be a Bấm giờ backup.'));return}
 var r=new FileReader();
 r.onload=function(){try{
  var j=JSON.parse(String(r.result)),d=j&&j.data,keys=[],k;
  if(!j||j.app!=='bam-gio'||!d||typeof d!=='object'){say(T('Đây không phải file sao lưu của Bấm giờ.','This is not a Bấm giờ backup file.'));return}
  for(k in d){if(KEY.test(k)&&k!=='bg2x-upchk'&&typeof d[k]==='string')keys.push(k)}
  if(!keys.length){say(T('File sao lưu không có dữ liệu hợp lệ.','The backup has no valid data.'));return}
  if(!window.confirm(T('Khôi phục '+keys.length+' mục dữ liệu? Dữ liệu hiện tại trên máy sẽ bị thay thế.','Restore '+keys.length+' items? Current data on this device will be replaced.')))return;
  var old=[],i;for(i=0;i<localStorage.length;i++){k=localStorage.key(i);if(KEY.test(k)&&k!=='bg2x-upchk')old.push(k)}
  old.forEach(function(x){localStorage.removeItem(x)});
  keys.forEach(function(x){localStorage.setItem(x,d[x])});
  say(T('Đã khôi phục, đang tải lại...','Restored, reloading...'));
  setTimeout(function(){location.reload()},700);
 }catch(e){say(T('Không đọc được file sao lưu.','Could not read the backup file.'))}};
 r.onerror=function(){say(T('Không đọc được file.','Could not read the file.'))};
 r.readAsText(f);
}catch(e){say(T('Không khôi phục được.','Could not restore.'))}});
labels();
new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}catch(e){}})();

;

/* NHẬT KÝ PHIÊN: hỏi 1 chạm sau mỗi phiên Pomodoro / buổi tập / món nấu, và lý do khi dừng giữa chừng.
   Dữ liệu lưu ở localStorage 'bg2x-ci' (nằm trong bản sao lưu). Thẻ "Giờ vàng & thói quen" nằm ở phần Thống kê. */
(function(){try{
var KEY='bg2x-ci',OFF='bg2x-ci-off',MAX=600;
function $(i){return document.getElementById(i)}
function en(){return document.documentElement.lang==='en'}
function T(v,e){return en()?e:v}
function load(){try{var a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return []}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a.slice(-MAX)))}catch(e){}}
function off(){try{return localStorage.getItem(OFF)==='1'}catch(e){return false}}
function curM(){var b=document.querySelector('#tabs [aria-selected="true"]');return b?b.getAttribute('data-m'):''}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ---- giao diện ---- */
var st=document.createElement('style');
st.textContent='#ci-sheet{position:fixed;left:10px;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 92px);z-index:9000;max-width:520px;margin:0 auto;background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--line,#ddd);border-radius:16px;padding:12px 14px;box-shadow:0 10px 34px rgba(0,0,0,.28)}'
+'#ci-sheet .ci-h{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:700;font-size:15px}'
+'#ci-sheet .ci-x{min-width:36px;min-height:36px;border:0;background:transparent;color:var(--muted,#667);font-size:18px}'
+'#ci-sheet .ci-c{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}'
+'#ci-sheet .ci-c button{min-height:44px;padding:8px 14px;border-radius:12px;border:1px solid var(--line,#ddd);background:var(--bg,#f4f4f4);color:var(--ink,#111);font-size:15px;font-weight:600}'
+'#ci-sheet .ci-c button.sc{flex:1 1 52px;font-size:22px;padding:6px 0}'
+'#ci-sheet .ci-n{margin-top:8px;font-size:12px;color:var(--muted,#667)}'
+'#ci-card .ci-b{padding:2px 2px 8px;font-size:14px;line-height:1.55}#ci-card .ci-b p{margin:8px 0}#ci-card .ci-b b{font-weight:700}#ci-card .ci-m{color:var(--muted,#667);font-size:12.5px}'
+'#ci-card .ci-t{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}#ci-card .ci-t button{min-height:40px}';
document.head.appendChild(st);

var sheet=null,hideT=null;
function closeSheet(){if(hideT){clearTimeout(hideT);hideT=null}if(sheet&&sheet.parentNode)sheet.parentNode.removeChild(sheet);sheet=null}
function ask(title,chips,onPick,note,score){
  if(off())return; closeSheet();
  sheet=document.createElement('div');sheet.id='ci-sheet';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-label',title);
  var h='<div class="ci-h"><span>'+esc(title)+'</span><button type="button" class="ci-x" aria-label="'+T('Đóng','Close')+'">✕</button></div><div class="ci-c">';
  chips.forEach(function(c,i){h+='<button type="button" data-i="'+i+'"'+(score?' class="sc" aria-label="'+(i+1)+'/5"':'')+'>'+esc(c)+'</button>'});
  h+='</div>'+(note?'<div class="ci-n">'+esc(note)+'</div>':'');
  sheet.innerHTML=h;
  sheet.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.classList.contains('ci-x')){closeSheet();return}
    var i=parseInt(b.getAttribute('data-i'),10);if(isNaN(i))return;
    onPick(i);closeSheet();draw();
  });
  document.body.appendChild(sheet);
  hideT=setTimeout(closeSheet,25000);
}
function push(o){var a=load();o.t=o.t||Date.now();a.push(o);save(a)}

/* ---- sau khi hoàn thành ---- */
var FACES=['😵','😕','🙂','😀','🔥'];
function onDone(m,ms){
  var t=Date.now();
  if(m==='pomo'){
    ask(T('Phiên vừa xong, bạn tập trung thế nào?','Session done. How focused were you?'),FACES,function(i){push({t:t,k:'focus',m:m,d:ms,s:i+1})},T('1 = rất xao nhãng, 5 = rất tập trung','1 = very distracted, 5 = fully focused'),true);
  }else if(m==='iv'){
    var L=[T('Dễ','Easy'),T('Vừa','Okay'),T('Nặng','Hard'),T('Kiệt sức','Wiped out')];
    ask(T('Buổi tập hôm nay thấy thế nào?','How did that workout feel?'),L,function(i){push({t:t,k:'work',m:m,d:ms,s:i+1})});
  }else if(m==='cook'){
    var C=[T('Chín vừa','Just right'),T('Cần thêm 1 phút','Needs 1 more min'),T('Cần thêm 2 phút','Needs 2 more min'),T('Cần thêm 5 phút','Needs 5 more min'),T('Hơi quá','Overdone')],X=[0,1,2,5,-1];
    ask(T('Món vừa xong thế nào?','How did the dish turn out?'),C,function(i){push({t:t,k:'cook',m:m,d:ms,x:X[i]})});
  }
}
var orig=window.logStat;
if(typeof orig==='function'){
  window.logStat=function(m,ms){var r=orig.apply(this,arguments);try{if(m==='pomo'||m==='iv'||m==='cook')setTimeout(function(){onDone(m,ms)},500)}catch(e){}return r};
}

/* ---- khi dừng giữa chừng (bấm Đặt lại lúc đang làm) ---- */
var disp=$('disp'),side=$('side'),ws=null,m0='',resetAt=0;
if(side)side.addEventListener('click',function(){resetAt=Date.now()},true);
var REASONS=[['phone',T('Điện thoại, mạng','Phone, internet')],['call',T('Có người gọi, hỏi','Interrupted')],['tired',T('Mệt','Tired')],['hungry',T('Đói, khát','Hungry, thirsty')],['early',T('Xong sớm','Finished early')],['other',T('Khác','Other')]];
if(disp)new MutationObserver(function(){
  var s=disp.getAttribute('data-state');
  if(s==='work'&&ws===null){ws=Date.now();m0=curM()}
  else if(s==='rest'){ws=null}
  else if(s==='idle'&&ws!==null){
    var el=Date.now()-ws,m=m0;ws=null;
    if(Date.now()-resetAt<1500&&el>=60000&&(m==='pomo'||m==='iv')){
      var t=Date.now();REASONS=REASONS.map(function(r){return r});
      ask(T('Bạn dừng giữa chừng vì sao?','Why did you stop early?'),REASONS.map(function(r){return r[1]}),function(i){push({t:t,k:'stop',m:m,d:el,r:REASONS[i][0]})});
    }
  }
}).observe(disp,{attributes:true,attributeFilter:['data-state']});

/* ---- thẻ thống kê ---- */
var card=null,body=null;
function med(a){a=a.slice().sort(function(x,y){return x-y});var n=a.length;return n?(n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2):0}
function two(n){return(n<10?'0':'')+n}
function win(h){return two(h)+':00–'+two((h+2)%24)+':00'}
function RN(k){return{phone:T('điện thoại, mạng','phone, internet'),call:T('bị người khác ngắt','interruptions'),tired:T('mệt','tiredness'),hungry:T('đói, khát','hunger, thirst'),early:T('xong sớm','finishing early'),other:T('lý do khác','other reasons')}[k]||k}
function draw(){
  if(!body)return;
  var a=load(),h='',foc=a.filter(function(e){return e.k==='focus'&&e.s}),stops=a.filter(function(e){return e.k==='stop'}),wk=a.filter(function(e){return e.k==='work'}),ck=a.filter(function(e){return e.k==='cook'});
  /* giờ vàng */
  var by={};foc.forEach(function(e){var hr=Math.floor(new Date(e.t).getHours()/2)*2;(by[hr]=by[hr]||[]).push(e.s)});
  var rows=Object.keys(by).map(function(k){var v=by[k],s=0;v.forEach(function(x){s+=x});return{h:+k,n:v.length,avg:s/v.length}}).filter(function(r){return r.n>=3});
  if(foc.length<5){h+='<p>'+T('<b>Giờ vàng:</b> cần thêm dữ liệu, đã có '+foc.length+'/5 phiên Pomodoro được chấm điểm.','<b>Golden hours:</b> need more data, '+foc.length+'/5 rated Pomodoro sessions so far.')+'</p>'}
  else if(!rows.length){h+='<p>'+T('<b>Giờ vàng:</b> đã có '+foc.length+' phiên, nhưng chưa khung 2 giờ nào đủ 3 phiên để so sánh.','<b>Golden hours:</b> '+foc.length+' sessions so far, but no 2-hour window has 3 yet.')+'</p>'}
  else{rows.sort(function(x,y){return y.avg-x.avg});var b=rows[0],w=rows[rows.length-1];
    h+='<p>'+T('<b>Giờ vàng của bạn:</b> '+win(b.h)+', trung bình '+b.avg.toFixed(1)+'/5 ('+b.n+' phiên).','<b>Your golden hours:</b> '+win(b.h)+', average '+b.avg.toFixed(1)+'/5 ('+b.n+' sessions).')+'</p>';
    if(rows.length>1&&w.h!==b.h)h+='<p class="ci-m">'+T('Yếu nhất: '+win(w.h)+' ('+w.avg.toFixed(1)+'/5). Việc khó nên xếp vào giờ vàng.','Weakest: '+win(w.h)+' ('+w.avg.toFixed(1)+'/5). Put hard work in your golden hours.')+'</p>'}
  /* dừng giữa chừng */
  var ps=stops.filter(function(e){return e.m==='pomo'});
  if(ps.length>=3){var cnt={};ps.forEach(function(e){cnt[e.r]=(cnt[e.r]||0)+1});var top=Object.keys(cnt).sort(function(x,y){return cnt[y]-cnt[x]})[0];
    var mm=Math.round(med(ps.map(function(e){return e.d/60000})));var sg=Math.max(10,Math.floor(mm/5)*5);
    h+='<p>'+T('<b>Hay dừng giữa chừng:</b> '+ps.length+' lần, nhiều nhất do '+RN(top)+'. Bạn thường dừng quanh phút '+mm+'; thử phiên '+sg+' phút.','<b>Stopping early:</b> '+ps.length+' times, mostly '+RN(top)+'. You usually stop around minute '+mm+'; try '+sg+'-minute sessions.')+'</p>'}
  else if(stops.length){h+='<p class="ci-m">'+T('Đã ghi '+stops.length+' lần dừng giữa chừng. Cần 3 lần Pomodoro để đưa ra gợi ý.','Logged '+stops.length+' early stops. 3 Pomodoro stops are needed for a tip.')+'</p>'}
  /* tập luyện */
  var wk7=wk.filter(function(e){return Date.now()-e.t<7*864e5});
  if(wk7.length){var s=0;wk7.forEach(function(e){s+=e.s});var lab=[T('dễ','easy'),T('vừa','okay'),T('nặng','hard'),T('kiệt sức','exhausting')][Math.min(3,Math.round(s/wk7.length)-1)];
    h+='<p>'+T('<b>Tập luyện 7 ngày qua:</b> '+wk7.length+' buổi, cảm giác trung bình '+lab+'.','<b>Workouts, last 7 days:</b> '+wk7.length+', average feel: '+lab+'.')+'</p>'}
  /* nấu ăn */
  var cd={};ck.forEach(function(e){var mn=Math.round(e.d/60000);if(mn>=1)(cd[mn]=cd[mn]||[]).push(e.x)});
  var tips=[];Object.keys(cd).forEach(function(k){var v=cd[k],more=v.filter(function(x){return x>0});if(more.length>=2&&more.length*2>=v.length)tips.push(T('món đặt '+k+' phút: thường cần thêm khoảng '+Math.round(med(more))+' phút','dish set to '+k+' min: usually needs ~'+Math.round(med(more))+' more min'))});
  if(tips.length)h+='<p>'+T('<b>Nấu ăn:</b> ','<b>Cooking:</b> ')+tips.slice(0,3).join('; ')+'.</p>';
  if(!a.length)h='<p>'+T('Sau mỗi phiên Pomodoro, buổi tập hoặc món nấu, app sẽ hỏi bạn một chạm. Dữ liệu chỉ nằm trên máy bạn, dùng để tìm giờ vàng và thói quen của chính bạn.','After each Pomodoro, workout or dish, the app asks one quick tap. Data stays on your device and is used to find your golden hours and habits.')+'</p>'+h;
  h+='<div class="ci-t"><label class="chk"><input type="checkbox" id="ci-ask"'+(off()?'':' checked')+'> '+T('Hỏi sau mỗi phiên','Ask after each session')+'</label><button type="button" id="ci-clr">'+T('Xóa nhật ký này','Clear this log')+'</button></div>';
  body.innerHTML=h;
  var c=$('ci-ask');if(c)c.addEventListener('change',function(){try{localStorage.setItem(OFF,c.checked?'0':'1')}catch(e){}if(!c.checked)closeSheet()});
  var x=$('ci-clr');if(x)x.addEventListener('click',function(){if(window.confirm(T('Xóa toàn bộ nhật ký phiên?','Delete the whole session log?'))){save([]);draw()}});
}
var anchor=$('st-badges');
if(anchor&&anchor.parentNode){
  card=document.createElement('details');card.className='stmore';card.id='ci-card';
  card.innerHTML='<summary id="ci-sum"></summary><div class="ci-b" id="ci-body"></div>';
  anchor.parentNode.insertBefore(card,anchor.nextSibling);
  body=$('ci-body');
  function lab(){var s=$('ci-sum');if(s)s.textContent=T('Giờ vàng và thói quen của bạn','Your golden hours and habits')}
  lab();card.addEventListener('toggle',function(){if(card.open)draw()});
  draw();
  new MutationObserver(function(){lab();draw()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
}catch(e){}})();

;

/* NHẬT KÝ GIẤC NGỦ (trong công cụ Tính giờ ngủ): bấm "đi ngủ" / "vừa dậy" hoặc nhập tay, xem trung bình 7 đêm. Lưu ở localStorage 'bg2x-sl' và 'bg2x-sl-p'. */
(function(){try{
var KEY='bg2x-sl',PEND='bg2x-sl-p',panel=document.getElementById('panel');if(!panel)return;
function en(){return document.documentElement.lang==='en'}
function T(v,e){return en()?e:v}
function curM(){var b=document.querySelector('#tabs [aria-selected="true"]');return b?b.getAttribute('data-m'):''}
function load(){try{var a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a.slice(-120)))}catch(e){}}
function pend(){try{var v=parseInt(localStorage.getItem(PEND),10);return isNaN(v)?0:v}catch(e){return 0}}
function two(n){return(n<10?'0':'')+n}
function hm(ts){var d=new Date(ts);return two(d.getHours())+':'+two(d.getMinutes())}
function dur(min){min=Math.round(min);var h=Math.floor(min/60),m=min%60;return T(h+' giờ '+(m?m+' phút':''),h+'h '+(m?m+'m':'')).trim()}
function mins(ts){var d=new Date(ts);return d.getHours()*60+d.getMinutes()}
function avg(a){var s=0;a.forEach(function(x){s+=x});return s/a.length}
function sd(a){var m=avg(a),s=0;a.forEach(function(x){s+=(x-m)*(x-m)});return Math.sqrt(s/a.length)}
function clock(min){min=((Math.round(min)%1440)+1440)%1440;return two(Math.floor(min/60))+':'+two(min%60)}
function html(){
  var a=load().slice(-7),p=pend(),h='<div id="sl-log" style="margin-top:18px;padding-top:14px;border-top:1px solid var(--line,#ddd)">';
  h+='<p class="hint"><b>'+T('Nhật ký giấc ngủ của bạn','Your sleep log')+'</b></p>';
  if(p){h+='<p class="hint">'+T('Đang ghi: bạn đi ngủ lúc '+hm(p)+'. Bấm "Tôi vừa dậy" khi thức dậy.','Tracking: you went to bed at '+hm(p)+'. Tap "I just woke up" when you wake.')+'</p>';
    h+='<div class="chips2"><button type="button" id="sl-wake">☀️ '+T('Tôi vừa dậy','I just woke up')+'</button><button type="button" id="sl-cancel">'+T('Hủy','Cancel')+'</button></div>'}
  else h+='<div class="chips2"><button type="button" id="sl-bed">😴 '+T('Tôi đi ngủ bây giờ','I am going to bed now')+'</button></div>';
  h+='<details style="margin:10px 0"><summary>'+T('Nhập tay đêm qua','Enter last night manually')+'</summary><div class="row"><label>'+T('Đi ngủ lúc','Bedtime')+'<input type="time" id="sl-mb" value="23:00"></label><label>'+T('Dậy lúc','Woke at')+'<input type="time" id="sl-mw" value="06:30"></label></div><div class="chips2"><button type="button" id="sl-save">'+T('Lưu đêm qua','Save last night')+'</button></div></details>';
  if(a.length){
    var d=a.map(function(e){return(e.w-e.b)/60000}),w=a.map(function(e){return mins(e.w)}),b=a.map(function(e){var m=mins(e.b);return m<720?m+1440:m});
    h+='<p class="hint">'+T('<b>'+a.length+' đêm gần nhất:</b> ngủ trung bình '+dur(avg(d))+'.','<b>Last '+a.length+' nights:</b> average sleep '+dur(avg(d))+'.')+'</p>';
    h+='<p class="hint">'+T('Giờ đi ngủ trung bình '+clock(avg(b))+', thức dậy '+clock(avg(w))+'.','Average bedtime '+clock(avg(b))+', wake-up '+clock(avg(w))+'.')+'</p>';
    if(a.length>=3)h+='<p class="hint">'+T('Giờ đi ngủ lệch khoảng ±'+Math.round(sd(b))+' phút mỗi đêm. Càng đều thì nhịp sinh học càng ổn định.','Your bedtime varies by about ±'+Math.round(sd(b))+' min. A steadier schedule helps your body clock.')+'</p>';
    var l=a[a.length-1];h+='<p class="hint">'+T('Đêm gần nhất: '+hm(l.b)+' → '+hm(l.w)+' ('+dur((l.w-l.b)/60000)+').','Last night: '+hm(l.b)+' → '+hm(l.w)+' ('+dur((l.w-l.b)/60000)+').')+'</p>';
    h+='<div class="chips2"><button type="button" id="sl-clr">'+T('Xóa nhật ký ngủ','Clear sleep log')+'</button></div>';
  }else h+='<p class="hint">'+T('Chưa có đêm nào được ghi. Ghi vài đêm để xem trung bình và độ đều giờ ngủ. Dữ liệu chỉ nằm trên máy bạn.','No nights logged yet. Log a few to see averages and consistency. Data stays on your device.')+'</p>';
  return h+'</div>';
}
function inject(){
  if(curM()!=='sleep')return;
  var box=panel.querySelector('.tcalc');if(!box)return;
  var old=document.getElementById('sl-log');
  if(old&&old.getAttribute('data-l')===(en()?'en':'vi')&&old.getAttribute('data-v')===String(load().length)+':'+pend())return;
  if(old)old.parentNode.removeChild(old);
  var d=document.createElement('div');d.innerHTML=html();var el=d.firstChild;
  el.setAttribute('data-l',en()?'en':'vi');el.setAttribute('data-v',String(load().length)+':'+pend());
  box.appendChild(el);
}
new MutationObserver(inject).observe(panel,{childList:true,subtree:true});
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b||!b.id||b.id.indexOf('sl-')!==0)return;
  var id=b.id,now=Date.now();
  if(id==='sl-bed'){try{localStorage.setItem(PEND,String(now))}catch(x){}}
  else if(id==='sl-cancel'){try{localStorage.removeItem(PEND)}catch(x){}}
  else if(id==='sl-wake'){var p=pend(),mn=(now-p)/60000;
    if(p&&mn>=60&&mn<=1000){var a=load();a.push({b:p,w:now});save(a);try{localStorage.removeItem(PEND)}catch(x){}}
    else if(p&&mn<60){window.alert(T('Mới ngủ chưa đến 1 giờ. Hãy bấm Tôi vừa dậy khi thức thật sự.','Less than an hour so far. Tap again when you really wake up.'));return}
    else{try{localStorage.removeItem(PEND)}catch(x){}window.alert(T('Không tính được giờ ngủ. Hãy dùng mục nhập tay.','Could not work out the sleep time. Use manual entry.'))}}
  else if(id==='sl-save'){var bi=document.getElementById('sl-mb'),wi=document.getElementById('sl-mw');
    if(!bi||!wi||!bi.value||!wi.value)return;
    var bp=bi.value.split(':'),wp=wi.value.split(':'),wd=new Date();wd.setHours(+wp[0],+wp[1],0,0);
    if(wd.getTime()>now)wd.setDate(wd.getDate()-1);
    var bd=new Date(wd.getTime());bd.setHours(+bp[0],+bp[1],0,0);if(bd.getTime()>=wd.getTime())bd.setDate(bd.getDate()-1);
    var mm=(wd.getTime()-bd.getTime())/60000;
    if(mm<60||mm>1000){window.alert(T('Giờ ngủ không hợp lý.','That sleep duration does not look right.'));return}
    var a2=load();a2.push({b:bd.getTime(),w:wd.getTime()});save(a2)}
  else if(id==='sl-clr'){if(!window.confirm(T('Xóa nhật ký giấc ngủ?','Delete the sleep log?')))return;save([]);try{localStorage.removeItem(PEND)}catch(x){}}
  else return;
  inject();
});
document.getElementById('tabs')&&document.getElementById('tabs').addEventListener('click',function(){setTimeout(inject,60)});
new MutationObserver(function(){inject()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
inject();
}catch(e){}})();

;

/* THANH CHUYỂN NHANH TRONG NHÓM: khi mở một công cụ thuộc nhóm, hiện hàng nút để chuyển sang công cụ cùng nhóm. */
(function(){try{
var G=window.BG_GROUPS,tabs=document.getElementById('tabs'),wrap=document.querySelector('.wrap');if(!G||!tabs||!wrap)return;
function en(){return document.documentElement.lang==='en'}
var NEN={'g-manage':'Manage','g-multi':'Multi-timers','g-study':'Study','g-date':'Dates & calendar','g-work':'Work hours & pay','g-world':'World time','g-health':'Health & fitness','g-music':'Music'};
function gname(g){return en()?NEN[g]:G[g].n}
var M2G={};Object.keys(G).forEach(function(g){G[g].m.forEach(function(m){M2G[m]=g})});
var st=document.createElement('style');
st.textContent='#grpbar{display:flex;gap:6px;align-items:center;overflow-x:auto;padding:4px 2px 8px;margin:0;scrollbar-width:none;-webkit-overflow-scrolling:touch}#grpbar::-webkit-scrollbar{display:none}#grpbar[hidden]{display:none}'
+'#grpbar .gb-t{flex:none;font-weight:700;font-size:13px;color:var(--muted);margin-right:4px;white-space:nowrap}'
+'#grpbar button{flex:none;min-height:38px;padding:6px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:14px;font-weight:600;white-space:nowrap}'
+'#grpbar button[aria-pressed="true"]{background:var(--go);color:var(--go-ink);border-color:var(--go)}'
+'.tabs button[data-on="1"]{background:var(--go);color:var(--go-ink)}';
document.head.appendChild(st);
var order=[].slice.call(tabs.querySelectorAll('[data-m]')).map(function(b){return b.getAttribute('data-m')});
Object.keys(G).forEach(function(g){
  var first=null;G[g].m.forEach(function(m){var b=tabs.querySelector('[data-m="'+m+'"]');if(!b)return;if(!first||order.indexOf(m)<order.indexOf(first.getAttribute('data-m')))first=b;b.style.display='none';b.setAttribute('aria-hidden','true');b.tabIndex=-1});
  var gb=document.createElement('button');gb.type='button';gb.setAttribute('role','tab');gb.setAttribute('data-g',g);gb.textContent=G[g].i+' '+gname(g);
  var aft=G[g].after?tabs.querySelector('[data-m="'+G[g].after+'"]'):null;if(aft)tabs.insertBefore(gb,aft.nextSibling);else if(first)tabs.insertBefore(gb,first);else tabs.appendChild(gb);
});
var bar=document.createElement('div');bar.id='grpbar';bar.hidden=true;bar.setAttribute('role','tablist');wrap.parentNode.insertBefore(bar,wrap);
function cur(){var s=tabs.querySelector('[data-m][aria-selected="true"]');return s?s.getAttribute('data-m'):''}
function lastOf(g){try{var l=JSON.parse(localStorage.getItem('bg2x-glast')||'{}');if(l[g]&&G[g].m.indexOf(l[g])>=0)return l[g]}catch(e){}return G[g].m[0]}
function open(m){var b=tabs.querySelector('[data-m="'+m+'"]');if(b)b.click()}
function upd(){
  var m=cur(),g=M2G[m];
  [].forEach.call(tabs.querySelectorAll('[data-g]'),function(b){var k=b.getAttribute('data-g'),on=k===g?'1':'0';if(b.getAttribute('data-on')!==on)b.setAttribute('data-on',on);var t=G[k].i+' '+gname(k);if(b.textContent!==t)b.textContent=t});
  if(!g){bar.hidden=true;return}
  try{var l=JSON.parse(localStorage.getItem('bg2x-glast')||'{}');if(l[g]!==m){l[g]=m;localStorage.setItem('bg2x-glast',JSON.stringify(l))}}catch(e){}
  var h='<span class="gb-t">'+G[g].i+' '+gname(g)+'</span>';
  G[g].m.forEach(function(x){var t=tabs.querySelector('[data-m="'+x+'"]');h+='<button type="button" data-gm="'+x+'" aria-pressed="'+(x===m)+'">'+(t?t.textContent.trim():x)+'</button>'});
  if(bar.getAttribute('data-k')!==g+'|'+m+'|'+(en()?'en':'vi')){bar.innerHTML=h;bar.setAttribute('data-k',g+'|'+m+'|'+(en()?'en':'vi'))}
  bar.hidden=false;
  var on=bar.querySelector('[aria-pressed="true"]');if(on)bar.scrollLeft=Math.max(0,on.offsetLeft-bar.clientWidth/2+on.offsetWidth/2);
}
bar.addEventListener('click',function(e){var b=e.target.closest('[data-gm]');if(b)open(b.getAttribute('data-gm'))});
tabs.addEventListener('click',function(e){var b=e.target.closest('[data-g]');if(b)open(lastOf(b.getAttribute('data-g')))});
new MutationObserver(upd).observe(tabs,{attributes:true,subtree:true,attributeFilter:['aria-selected']});
new MutationObserver(function(){setTimeout(upd,450)}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
upd();
}catch(e){}})();

;

/* LIÊN KẾT VIỆC CẦN LÀM VỚI POMODORO: ghi phiên xong vào việc đang chọn, hiện thanh "Đang làm" ở màn Pomodoro. */
(function(){try{
var KEY='bg2x-todo',tabs=document.getElementById('tabs'),wrap=document.querySelector('.wrap');if(!tabs||!wrap)return;
function en(){return document.documentElement.lang==='en'}
function T(v,e){return en()?e:v}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(){try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&Array.isArray(s.items))return s}catch(e){}return{items:[],cur:''}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
var orig=window.logStat;
if(typeof orig==='function')window.logStat=function(m,ms){var r=orig.apply(this,arguments);try{if(m==='pomo'){var s=load();if(s.cur){var it=s.items.filter(function(x){return x.id===s.cur})[0];if(it){it.p=(it.p||0)+1;it.f=(it.f||0)+ms;save(s);upd()}}}}catch(e){}return r};
var st=document.createElement('style');
st.textContent='#curtask{display:flex;align-items:center;gap:8px;margin:0 0 8px;padding:8px 12px;border:1px solid var(--line);border-radius:14px;background:var(--surface);color:var(--ink);font-size:14px}#curtask[hidden]{display:none}#curtask .ct-t{flex:1;min-width:0;overflow-wrap:anywhere;font-weight:700}#curtask button{min-height:36px;padding:4px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font-size:13px}';
document.head.appendChild(st);
var box=document.createElement('div');box.id='curtask';box.hidden=true;
var anchor=document.getElementById('grpbar');(anchor&&anchor.parentNode?anchor.parentNode:wrap.parentNode).insertBefore(box,anchor?anchor.nextSibling:wrap);
function cur(){var s=tabs.querySelector('[data-m][aria-selected="true"]');return s?s.getAttribute('data-m'):''}
function upd(){
  var s=load(),it=s.cur?s.items.filter(function(x){return x.id===s.cur&&!x.done})[0]:null;
  if(cur()!=='pomo'||!it){box.hidden=true;return}
  box.innerHTML='<span>🎯</span><span class="ct-t">'+T('Đang làm: ','Working on: ')+'<span data-notr>'+esc(it.t)+'</span>'+' · 🍅 '+(it.p||0)+(it.est?'/'+it.est:'')+'</span><button type="button" data-c="sw">'+T('Đổi','Change')+'</button><button type="button" data-c="x" aria-label="'+T('Bỏ chọn','Clear')+'">✕</button>';
  box.hidden=false;
}
box.addEventListener('click',function(e){var b=e.target.closest('button[data-c]');if(!b)return;
  if(b.getAttribute('data-c')==='x'){var s=load();s.cur='';save(s);upd()}
  else{var t=tabs.querySelector('[data-m="todo"]');if(t)t.click()}});
new MutationObserver(upd).observe(tabs,{attributes:true,subtree:true,attributeFilter:['aria-selected']});
window.addEventListener('bg-todo',upd);window.addEventListener('storage',function(e){if(e.key===KEY)upd()});
new MutationObserver(function(){setTimeout(upd,450)}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
upd();
}catch(e){}})();

;

/* LIÊN KẾT GIỮA CÁC KHUNG, QUY TẮC TỰ ĐỘNG VÀ THANH LỆNH NHANH (Ctrl+K) */
(function(){try{
var B=window.__BG||{},ID=B.emb?('p'+B.pane):(B.host?'host':'main'),LEADER=!B.emb,bc=null;
try{bc=new BroadcastChannel('bg2-ws')}catch(e){}
function en(){return document.documentElement.lang==='en'}
function T(v,e){return en()?e:v}
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rd(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function wr(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function pad(n){return(n<10?'0':'')+n}
function today(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function tabsEl(){return $('tabs')}
function openLocal(tool){var t=tabsEl()&&tabsEl().querySelector('[data-m="'+tool+'"]');if(t)t.click()}
function idle(){var d=$('disp');return d&&d.getAttribute('data-state')==='idle'}
function startPomoLocal(){openLocal('pomo');setTimeout(function(){var m=$('main');if(m&&idle())m.click()},400)}
function cdStartLocal(min,sec){openLocal('cd');setTimeout(function(){var a=$('s1'),b=$('s2');if(a){a.value=min;a.dispatchEvent(new Event('input',{bubbles:true}))}if(b){b.value=sec||0;b.dispatchEvent(new Event('input',{bubbles:true}))}var m=$('main');if(m&&idle())setTimeout(function(){m.click()},150)},450)}
function send(m){m.from=ID;if(bc)try{bc.postMessage(m)}catch(e){}}
var remotes={};
/* ---- nhận lệnh trong khung ---- */
function onCmd(m){
  if(m.to!==ID&&m.to!=='all')return;
  if(m.cmd==='start-pomo')startPomoLocal();
  else if(m.cmd==='open')openLocal(m.tool);
  else if(m.cmd==='cd-start')cdStartLocal(m.min,m.sec);
}
/* ---- trạng thái Pomodoro chia sẻ cho khung Nhạc ---- */
var phTries=0,phTimer=setInterval(function(){
  phTries++;if(phTries>60){clearInterval(phTimer);return}
  var origPhase=window.engPhase;if(typeof origPhase!=='function'||origPhase.__bg)return;
  clearInterval(phTimer);
  var w=function(){var l=origPhase.apply(this,arguments);if(l&&l.run)return l;var nw=Date.now(),k;for(k in remotes){var r=remotes[k];if(r.run&&nw-r.ts<4000)return{run:true,work:!!r.work}}return l};w.__bg=1;window.engPhase=w;
  setInterval(function(){try{var l=origPhase();send({t:'phase',run:!!(l&&l.run),work:!!(l&&l.work)})}catch(e){}},1000);
},300);
/* ---- sự kiện ---- */
function emit(ev,data){if(LEADER)engineEvt(ev,data);else send({t:'evt',ev:ev,data:data})}
var oLog=window.logStat;
if(typeof oLog==='function')window.logStat=function(m,ms){var r=oLog.apply(this,arguments);try{if(m==='pomo')setTimeout(function(){emit('pomo-done',{ms:ms})},50)}catch(e){}return r};
function req(name,args){var m=Object.assign({t:'req',req:name},args||{});if(LEADER){m.from=ID;handleReq(m)}else send(m)}
/* ---- thông báo nổi ---- */
function toast(msg){
  if(!LEADER)return;
  var e=$('bgtoast');if(!e){e=document.createElement('div');e.id='bgtoast';e.setAttribute('role','status');e.style.cssText='position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:99999;max-width:min(92vw,520px);padding:12px 16px;border-radius:16px;background:var(--ink,#111);color:var(--bg,#fff);font-weight:700;font-size:15px;box-shadow:0 10px 34px rgba(0,0,0,.35)';e.addEventListener('click',function(){e.style.display='none'});document.body.appendChild(e)}
  e.textContent=msg;e.style.display='block';try{navigator.vibrate&&navigator.vibrate(80)}catch(x){}
  clearTimeout(toast.t);toast.t=setTimeout(function(){e.style.display='none'},6500);
}
/* ---- thao tác dữ liệu (chỉ khung chính) ---- */
function addWater(ml){
  var w=rd('bg2x-water',{});if(!w.goal)w.goal=2000;if(!w.days)w.days={};var k=today();w.days[k]=w.days[k]||[];
  var sum=function(){return w.days[k].reduce(function(a,b){return a+b},0)},before=sum();w.days[k].push(ml);wr('bg2x-water',w);
  if(before<w.goal&&sum()>=w.goal)emit('water-goal',{});
}
function addTodo(o){
  var s=rd('bg2x-todo',null);if(!s||!Array.isArray(s.items))s={items:[],cur:''};
  s.items.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:o.t.slice(0,120),pr:o.pr||2,d:o.d||'',j:o.j||'',ib:o.ib?1:0,est:0,p:0,f:0,s:0,done:0,c:Date.now()});
  wr('bg2x-todo',s);
}
function routeOpen(tool){if(window.BGWS)BGWS.open(tool);else openLocal(tool)}
function routePomo(from){if(window.BGWS)BGWS.startPomo(from);else startPomoLocal()}
function routeCd(min){if(window.BGWS)BGWS.cd(min);else cdStartLocal(min,0)}
function handleReq(m){
  if(m.req==='start-pomo')routePomo(m.from);
  else if(m.req==='open')routeOpen(m.tool);
  else if(m.req==='cmdk')openCmdk();
  else if(m.req==='sprint')startSprint(m.id);
}
/* ---- quy tắc "Nếu – Thì" ---- */
function rules(){var a=rd('bg2x-rules',[]);return Array.isArray(a)?a:[]}
function run(r,why){
  var a=r.do;
  if(a==='toast')toast('⚡ '+(r.txt||why));
  else if(a==='open'){toast('⚡ '+why);if(r.tool)routeOpen(r.tool)}
  else if(a==='water'){addWater(250);toast('⚡ 💧 +250 ml')}
  else if(a==='pomo'){toast('⚡ '+why);routePomo(ID)}
}
function engineEvt(ev,data){
  var rs=rules().filter(function(r){return r&&r.en});
  if(ev==='pomo-done'){
    var pc=rd('bg2x-pc',{});if(pc.d!==today())pc={d:today(),n:0};pc.n++;wr('bg2x-pc',pc);
    rs.forEach(function(r){if(r.on==='pomo'&&r.n>0&&pc.n%r.n===0)run(r,T('Xong '+pc.n+' phiên Pomodoro hôm nay','Finished '+pc.n+' Pomodoro sessions today'))});
  }else if(ev==='task-done'){
    rs.forEach(function(r){if(r.on==='task')run(r,T('Vừa xong một việc','A task was completed')+(data&&data.t?': '+data.t:''))});
  }else if(ev==='water-goal'){
    rs.forEach(function(r){if(r.on==='water')run(r,T('Đủ mục tiêu uống nước hôm nay','Daily water goal reached'))});
  }
}
if(LEADER)setInterval(function(){
  try{var all=rules(),n=new Date(),nm=n.getHours()*60+n.getMinutes(),t0=today(),ch=false;
    all.forEach(function(r){if(r&&r.en&&r.on==='time'&&r.t&&r.last!==t0){var p=r.t.split(':'),tm=(+p[0])*60+(+p[1]);if(nm>=tm&&nm-tm<10){r.last=t0;ch=true;run(r,T('Đến '+r.t,'It is '+r.t))}}});
    if(ch)wr('bg2x-rules',all)}catch(e){}
},20000);
/* ---- 5 phút thôi ---- */
function startSprint(id){
  var s=rd('bg2x-todo',null);if(!s||!Array.isArray(s.items))return;
  var it=s.items.filter(function(x){return x.id===id})[0];if(!it)return;
  s.cur=id;wr('bg2x-todo',s);wr('bg2x-sprint',{id:id,t:it.t,until:Date.now()+5*60000});
  toast('⏱ '+T('Chỉ 5 phút thôi, bắt đầu nào!','Just 5 minutes, let us go!'));routeCd(5);
}
function sprintModal(sp){
  var m=document.createElement('div');m.id='bgsp';m.setAttribute('role','alertdialog');
  m.style.cssText='position:fixed;inset:0;z-index:99997;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px';
  m.innerHTML='<div style="width:min(420px,100%);background:var(--surface,#fff);color:var(--ink,#111);border-radius:22px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.45)"><div style="font-size:20px;font-weight:800">⏱ '+T('5 phút xong!','5 minutes done!')+'</div><div style="margin:8px 0 14px;overflow-wrap:anywhere">'+T('Bạn vừa làm: ','You just worked on: ')+'<b></b></div><div style="display:grid;gap:8px"><button type="button" data-a="more" style="min-height:48px;border-radius:14px;border:0;background:var(--go);color:var(--go-ink);font-weight:800;font-size:16px">🍅 '+T('Làm tiếp một phiên Pomodoro','Continue with a Pomodoro')+'</button><button type="button" data-a="done" style="min-height:48px;border-radius:14px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font-weight:700">✅ '+T('Xong việc này','Task finished')+'</button><button type="button" data-a="stop" style="min-height:44px;border-radius:14px;border:1px solid var(--line);background:transparent;color:var(--muted)">'+T('Hôm nay thế là đủ','That is enough for now')+'</button></div></div>';
  m.querySelector('b').textContent=sp.t;
  m.addEventListener('click',function(e){var b=e.target.closest('button[data-a]');if(!b)return;var a=b.getAttribute('data-a');
    if(a==='done'){var s=rd('bg2x-todo',null);if(s&&Array.isArray(s.items)){var it=s.items.filter(function(x){return x.id===sp.id})[0];if(it){it.done=Date.now();if(s.cur===it.id)s.cur='';wr('bg2x-todo',s);emit('task-done',{t:it.t})}}}
    else if(a==='more')routePomo(ID);
    if(m.parentNode)m.parentNode.removeChild(m)});
  document.body.appendChild(m);try{navigator.vibrate&&navigator.vibrate([120,60,120])}catch(x){}
}
if(LEADER)setInterval(function(){try{var sp=rd('bg2x-sprint',null);if(sp&&sp.until&&Date.now()>=sp.until){try{localStorage.removeItem('bg2x-sprint')}catch(e){}sprintModal(sp)}}catch(e){}},4000);
/* ---- ngăn kéo ý nghĩ ---- */
function ideaOpen(){
  if($('bgidea-box'))return;
  var b=document.createElement('div');b.id='bgidea-box';b.style.cssText='position:fixed;left:10px;right:10px;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:9500;max-width:520px;margin:0 auto;padding:10px;border-radius:16px;background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--line,#ddd);box-shadow:0 12px 40px rgba(0,0,0,.35)';
  b.innerHTML='<div style="font-size:13px;color:var(--muted,#667);margin-bottom:6px">'+T('Ghi nhanh một ý nghĩ để xử lý sau (Enter để lưu, Esc để đóng)','Jot down a thought for later (Enter to save, Esc to close)')+'</div><input id="bgidea-i" type="text" maxlength="120" autocomplete="off" style="width:100%;box-sizing:border-box;padding:12px;font-size:16px;border-radius:12px;border:1px solid var(--line,#ddd);background:var(--bg,#fff);color:var(--ink,#111)">';
  document.body.appendChild(b);var i=$('bgidea-i');i.focus();
  i.addEventListener('keydown',function(e){if(e.key==='Escape'){if(b.parentNode)b.parentNode.removeChild(b)}else if(e.key==='Enter'&&i.value.trim()){addTodo({t:i.value.trim(),ib:1,pr:3});if(b.parentNode)b.parentNode.removeChild(b);var x=$('bgidea');if(x){var o=x.textContent;x.textContent='✓';setTimeout(function(){x.textContent=o},1200)}}});
}
function ideaUI(){
  var t=tabsEl();if(!t)return;var s=t.querySelector('[data-m][aria-selected="true"]'),m=s?s.getAttribute('data-m'):'',d=$('disp'),b=$('bgidea');
  if(m==='pomo'&&d){if(!b){b=document.createElement('button');b.id='bgidea';b.type='button';b.textContent='💭';b.title=T('Ghi nhanh ý nghĩ','Jot a thought');b.setAttribute('aria-label',T('Ghi nhanh ý nghĩ','Jot a thought'));b.style.cssText='position:absolute;top:12px;right:56px;width:36px;height:36px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.12);color:#fff;font-size:18px;z-index:5;padding:0';b.addEventListener('click',ideaOpen);d.appendChild(b)}}
  else if(b&&b.parentNode)b.parentNode.removeChild(b);
}
/* ---- nghỉ có ích ---- */
function restUI(){
  var d=$('disp');if(!d)return;var box=null;
  function ensure(){if(box&&box.parentNode)return box;box=document.createElement('div');box.id='restsug';box.hidden=true;box.style.cssText='display:flex;flex-direction:column;gap:6px;margin:0 0 8px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:var(--surface);color:var(--ink);font-size:14px';var w=document.querySelector('.wrap');if(w&&w.parentNode)w.parentNode.insertBefore(box,w);return box}
  function hide(){if(box)box.hidden=true}
  function show(){
    var t=tabsEl(),s=t&&t.querySelector('[data-m][aria-selected="true"]');if(!s||s.getAttribute('data-m')!=='pomo'){hide();return}
    var b=ensure(),w=rd('bg2x-water',{}),goal=w.goal||2000,sum=((w.days||{})[today()]||[]).reduce(function(a,x){return a+x},0),pc=rd('bg2x-pc',{n:0}),n=(pc.d===today()?pc.n:0)||0;
    var tips=[T('🧘 Đứng dậy, vươn vai 1 phút','🧘 Stand up and stretch for a minute'),T('👀 Nhìn xa 20 giây (quy tắc 20-20-20)','👀 Look far away for 20 seconds (20-20-20 rule)'),T('🚶 Đi vài bước, hít thở sâu','🚶 Walk a few steps and breathe deeply')];
    var h='<div style="font-weight:800">☕ '+T('Nghỉ có ích','Make the break count')+'</div><div>'+tips[n%3]+'</div>';
    if(sum<goal)h+='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="flex:1;min-width:0">💧 '+T('Đã uống ','Water so far ')+sum+'/'+goal+' ml</span><button type="button" data-w="250" style="min-height:40px;padding:4px 14px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font-weight:700">+250 ml</button></div>';
    var td=rd('bg2x-todo',null),it=td&&td.cur?(td.items||[]).filter(function(x){return x.id===td.cur&&!x.done})[0]:null;
    if(it)h+='<div style="overflow-wrap:anywhere">🎯 '+T('Sau nghỉ làm tiếp: ','Next after the break: ')+'<b data-x></b></div>';
    b.innerHTML=h;var bx=b.querySelector('[data-x]');if(bx&&it)bx.textContent=it.t;b.hidden=false;
  }
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#restsug [data-w]');if(!b)return;addWater(parseInt(b.getAttribute('data-w'),10));show()});
  new MutationObserver(function(){if(d.getAttribute('data-state')==='rest')show();else hide()}).observe(d,{attributes:true,attributeFilter:['data-state']});
}
if(!B.host){var tb0=tabsEl();if(tb0){new MutationObserver(ideaUI).observe(tb0,{attributes:true,subtree:true,attributeFilter:['aria-selected']});setTimeout(ideaUI,500)}setTimeout(restUI,600)}
/* ---- thanh lệnh nhanh ---- */
function nz(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d')}
function toolList(){
  var out=[],t=tabsEl();if(!t)return out;
  [].forEach.call(t.querySelectorAll('[data-m]'),function(b){out.push({k:b.getAttribute('data-m'),n:b.textContent.trim()})});
  return out;
}
function parseTodo(rest){
  var pr=2,d='',j='',txt=rest;
  txt=txt.replace(/!(cao|high|gap)\b/i,function(){pr=1;return ''}).replace(/!(thap|thấp|low)\b/i,function(){pr=3;return ''}).replace(/!(vua|vừa|med)\b/i,function(){pr=2;return ''});
  txt=txt.replace(/#([^\s#]+)/,function(_,p){j=p;return ''});
  var n=new Date(),fd=function(x){return x.getFullYear()+'-'+pad(x.getMonth()+1)+'-'+pad(x.getDate())};
  if(/(ngày mai|ngay mai|tomorrow)/i.test(txt)){var x=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1);d=fd(x);txt=txt.replace(/(ngày mai|ngay mai|tomorrow)/i,'')}
  else if(/(hôm nay|hom nay|today)/i.test(txt)){d=fd(n);txt=txt.replace(/(hôm nay|hom nay|today)/i,'')}
  else{var m=txt.match(/\b(\d{1,2})\/(\d{1,2})\b/);if(m){var dd=+m[1],mm=+m[2];if(dd>=1&&dd<=31&&mm>=1&&mm<=12){var y=n.getFullYear(),c=new Date(y,mm-1,dd);if(c<new Date(n.getFullYear(),n.getMonth(),n.getDate()))c=new Date(y+1,mm-1,dd);d=fd(c);txt=txt.replace(m[0],'')}}}
  return{t:txt.replace(/\s+/g,' ').trim(),pr:pr,d:d,j:j};
}
function suggest(q){
  var raw=q.trim(),s=nz(raw),out=[],m;
  if(!raw)return[];
  if((m=s.match(/^(viec|todo|task|them viec)\s*:?\s*(.*)$/))&&m[2]){
    var o=parseTodo(raw.replace(/^(việc|viec|todo|task|thêm việc|them viec)\s*:?\s*/i,''));
    if(o.t)out.push({i:'✅',l:T('Thêm việc: ','Add task: ')+o.t+(o.pr===1?' 🔴':o.pr===3?' ⚪':'')+(o.d?' · '+o.d:'')+(o.j?' · #'+o.j:''),run:function(){addTodo(o);toast(T('✅ Đã thêm việc: ','✅ Task added: ')+o.t)}});
  }
  if((m=s.match(/^(nuoc|water|uong nuoc)\s*(\d{2,4})?\s*(ml)?$/))){
    var ml=m[2]?parseInt(m[2],10):250;if(ml>0&&ml<=2000)out.push({i:'💧',l:T('Thêm '+ml+' ml nước','Add '+ml+' ml of water'),run:function(){addWater(ml);toast('💧 +'+ml+' ml')}});
  }
  if((m=s.match(/^(dem nguoc|countdown|cd)\s*(\d{1,3})\s*(phut|p|min|m)?$/))){
    var mn=parseInt(m[2],10);if(mn>0&&mn<=600)out.push({i:'⏳',l:T('Đếm ngược '+mn+' phút, bắt đầu ngay','Countdown '+mn+' min, start now'),run:function(){routeCd(mn)}});
  }
  if(/^(bat dau|start|chay)?\s*(pomodoro|pomo)\s*(start|bat dau)?$/.test(s)&&/(bat dau|start|chay)/.test(s))out.push({i:'🍅',l:T('Bắt đầu Pomodoro ngay','Start Pomodoro now'),run:function(){routePomo(ID)}});
  if((m=s.match(/^(y|idea|y tuong|ghi nhanh|note)\s*:\s*(.+)$/))){var tx=raw.replace(/^[^:]*:\s*/,'').trim();if(tx)out.push({i:'💭',l:T('Ghi vào hộp thư: ','Save to inbox: ')+tx,run:function(){addTodo({t:tx,ib:1,pr:3});toast(T('💭 Đã ghi vào hộp thư','💭 Saved to inbox'))}})}
  if(/^(tiep theo|next|lam gi)/.test(s)&&window.BGX){var tdd=rd('bg2x-todo',null),nx=tdd&&tdd.items?BGX.pickNext(tdd.items,0,BGX.goldenWin()):null;if(nx){out.push({i:'👉',l:T('Làm tiếp: ','Next: ')+nx.it.t+' — '+nx.why,run:function(){var q2=rd('bg2x-todo',null);q2.cur=nx.it.id;wr('bg2x-todo',q2);routePomo(ID)}});out.push({i:'⏱',l:T('Chỉ 5 phút cho: ','Just 5 minutes on: ')+nx.it.t,run:function(){startSprint(nx.it.id)}})}}
  var seen={};
  toolList().map(function(t){var n=nz(t.n),k=nz(t.k),sc=0;if(n===s||k===s)sc=4;else if(n.indexOf(s)===0||k.indexOf(s)===0)sc=3;else if(n.indexOf(' '+s)>=0)sc=2;else if(n.indexOf(s)>=0)sc=1;return{t:t,sc:sc}}).filter(function(x){return x.sc>0}).sort(function(a,b){return b.sc-a.sc}).slice(0,5).forEach(function(x){
    if(seen[x.t.k])return;seen[x.t.k]=1;out.push({i:'↗',l:T('Mở ','Open ')+x.t.n,run:function(){routeOpen(x.t.k)}})});
  return out.slice(0,7);
}
var cm=null,sel=0,cur=[];
function renderList(){
  var L=$('bgk-l');if(!L)return;
  L.innerHTML=cur.length?cur.map(function(o,i){return '<button type="button" data-i="'+i+'" style="display:block;width:100%;text-align:left;padding:10px 12px;border:0;border-radius:12px;background:'+(i===sel?'var(--go)':'transparent')+';color:'+(i===sel?'var(--go-ink)':'var(--ink)')+';font-size:15px">'+o.i+' '+esc(o.l)+'</button>'}).join(''):'<div style="padding:10px 12px;color:var(--muted);font-size:13px;line-height:1.7">'+T('Thử gõ:<br>việc: nộp báo cáo !cao ngày mai #congty<br>nước 300 · đếm ngược 10 · bắt đầu pomodoro<br>hoặc tên một công cụ, ví dụ: tuổi, lương, âm lịch','Try:<br>task: send report !high tomorrow #work<br>water 300 · countdown 10 · start pomodoro<br>or a tool name, e.g. age, pace, lunar')+'</div>';
}
function closeCmdk(){if(cm&&cm.parentNode)cm.parentNode.removeChild(cm);cm=null}
function openCmdk(){
  if(cm){var i=$('bgk-i');if(i)i.focus();return}
  cm=document.createElement('div');cm.id='bgk';cm.setAttribute('role','dialog');cm.setAttribute('aria-label',T('Lệnh nhanh','Quick command'));
  cm.style.cssText='position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.45);display:flex;justify-content:center;align-items:flex-start;padding:10vh 12px 0';
  cm.innerHTML='<div style="width:min(560px,100%);background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--line,#ddd);border-radius:20px;padding:10px;box-shadow:0 20px 60px rgba(0,0,0,.4)"><input id="bgk-i" type="text" autocomplete="off" spellcheck="false" placeholder="'+T('Gõ lệnh hoặc tên công cụ...  (Esc để đóng)','Type a command or tool name...  (Esc to close)')+'" aria-label="'+T('Lệnh nhanh','Quick command')+'" style="width:100%;box-sizing:border-box;padding:12px 14px;font-size:17px;border-radius:14px;border:1px solid var(--line,#ddd);background:var(--bg,#fff);color:var(--ink,#111)"><div id="bgk-l" style="margin-top:8px;max-height:50vh;overflow:auto"></div></div>';
  document.body.appendChild(cm);cur=[];sel=0;renderList();
  var inp=$('bgk-i');inp.focus();
  inp.addEventListener('input',function(){cur=suggest(inp.value);sel=0;renderList()});
  inp.addEventListener('keydown',function(e){
    if(e.key==='Escape'){closeCmdk();return}
    if(e.key==='ArrowDown'){e.preventDefault();if(cur.length){sel=(sel+1)%cur.length;renderList()}return}
    if(e.key==='ArrowUp'){e.preventDefault();if(cur.length){sel=(sel-1+cur.length)%cur.length;renderList()}return}
    if(e.key==='Enter'){e.preventDefault();var o=cur[sel];if(o){closeCmdk();o.run()}}
  });
  cm.addEventListener('mousedown',function(e){if(e.target===cm)closeCmdk()});
  $('bgk-l').addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(!b)return;var o=cur[+b.getAttribute('data-i')];if(o){closeCmdk();o.run()}});
}
document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&!e.altKey&&(e.key==='k'||e.key==='K')){
    e.preventDefault();if(LEADER)openCmdk();else send({t:'req',req:'cmdk'});
  }
});
/* ---- nhận tin ---- */
if(bc)bc.onmessage=function(e){var m=e.data;if(!m||m.from===ID)return;
  if(m.t==='phase'){remotes[m.from]={run:m.run,work:m.work,ts:Date.now()}}
  else if(m.t==='cmd')onCmd(m);
  else if(m.t==='req'&&LEADER)handleReq(m);
  else if(m.t==='evt'&&LEADER)engineEvt(m.ev,m.data);
};
/* khung mới mở kèm lệnh bắt đầu Pomodoro */
if(B.emb){try{var q=new URLSearchParams(location.search).get('cmd');if(q==='start-pomo')setTimeout(startPomoLocal,1400)}catch(e){}}
window.BGBUS={addWater:addWater,sprint:startSprint,id:ID,emit:emit,req:req,toast:toast,openCmdk:openCmdk,sendCmd:function(to,cmd,args){send(Object.assign({t:'cmd',to:to,cmd:cmd},args||{}))},openLocal:openLocal,startPomoLocal:startPomoLocal};
}catch(e){}})();

;

/* KHÔNG GIAN LÀM VIỆC NHIỀU KHUNG: "khung chứa" trên máy tính / màn hình ngang mở tối đa 3 (hoặc 2) khung độc lập, mỗi khung là một bản Bấm giờ riêng. */
(function(){try{
var B=window.__BG||{};
function en(){return document.documentElement.lang==='en'}
function T(v,e){return en()?e:v}
var tabs=document.getElementById('tabs');
/* ----- Trong khung con: báo chế độ hiện tại, đồng bộ dữ liệu giữa các khung ----- */
if(B.emb){
  function cur(){var s=tabs&&tabs.querySelector('[data-m][aria-selected="true"]');return s?s.getAttribute('data-m'):''}
  function post(){var m=cur(),t=tabs.querySelector('[data-m="'+m+'"]'),g=window.BG_GROUPS,n=t?t.textContent.trim():m;
    if(g){for(var k in g){if(g[k].m.indexOf(m)>=0){n=g[k].i+' '+(en()?n:n);break}}}
    try{parent.postMessage({bgws:1,pane:B.pane,mode:m,title:n},'*')}catch(e){}}
  if(tabs){new MutationObserver(post).observe(tabs,{attributes:true,subtree:true,attributeFilter:['aria-selected']});setTimeout(post,300)}
  var rt=null,st=null,SYNC=/^(bg2x-(todo|habits|water|spaced|sl|plan)|bg-stats|bg-days|bg2-goal)$/,LIVE=['today','todo','habit','water','spaced'];
  window.addEventListener('storage',function(e){
    if(!e.key)return;
    if(e.key==='bg2-theme'||e.key==='bg2-lang'||e.key==='bg2-big'){clearTimeout(rt);rt=setTimeout(function(){location.reload()},500);return}
    if(SYNC.test(e.key)){clearTimeout(st);st=setTimeout(function(){
      var m=cur();if(LIVE.indexOf(m)<0)return;
      var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;
      var b=tabs.querySelector('[data-m="'+m+'"]');if(b){window.__nb=1;b.click();window.__nb=0}},350)}
  });
  return;
}
function wantHost(){var w=window.innerWidth,c=false;try{c=window.matchMedia('(pointer:coarse)').matches}catch(e){}return w>=740||(c&&w>window.innerHeight&&w>=600)}
if(!B.emb){var rz0=null,chk=function(){if(wantHost()!==!!B.host)location.reload()};window.addEventListener('resize',function(){clearTimeout(rz0);rz0=setTimeout(chk,300)});window.addEventListener('orientationchange',function(){setTimeout(chk,400)})}
if(!B.host||!tabs)return;
/* ----- Khung chứa ----- */
var KEY='bg2x-ws',MAXALL=3,top=document.querySelector('.top'),tb=top&&top.querySelector('.tb');
function maxPanes(){var w=window.innerWidth,h=window.innerHeight,coarse=false;try{coarse=window.matchMedia('(pointer:coarse)').matches}catch(e){}var m=w>=1100?3:2;if(coarse&&Math.min(w,h)<=600)m=2;return m}
function load(){try{var c=JSON.parse(localStorage.getItem(KEY)||'null');if(c&&Array.isArray(c.p)&&c.p.length)return c.p.filter(function(x){return x&&(x.k===1||x.k===2||x.k===3)}).slice(0,MAXALL)}catch(e){}return[]}
var P=load(),q=new URLSearchParams(location.search),qt=q.get('tool');
if(!P.length)P=[{k:1,t:''}];
if(qt&&!P.some(function(x){return x.k===1&&x.t===qt}))P[0]=Object.assign({},P[0],{t:qt});
function save(){try{localStorage.setItem(KEY,JSON.stringify({p:P}))}catch(e){}}
function tabName(m){var t=tabs.querySelector('[data-m="'+m+'"]');return t?t.textContent.trim():m}
var ws=document.createElement('section');ws.id='ws';ws.setAttribute('aria-label',T('Không gian làm việc','Workspace'));
ws.innerHTML='<div class="ws-note" id="wsNote"></div><div class="ws-grid" id="wsGrid"></div>';
(top?top.parentNode:document.body).insertBefore(ws,top?top.nextSibling:document.body.firstChild);
var grid=document.getElementById('wsGrid'),note=document.getElementById('wsNote');
var add=document.createElement('button');add.type='button';add.id='wsAdd';if(tb)tb.insertBefore(add,tb.firstChild);
function url(p){var u=location.pathname+'?embed=1&pane='+p.k;if(p.t)u+='&tool='+encodeURIComponent(p.t);if(p.cmd)u+='&cmd='+encodeURIComponent(p.cmd);return u}
function paneEl(k){return grid.querySelector('.ws-pane[data-k="'+k+'"]')}
function build(p){
  var d=document.createElement('div');d.className='ws-pane';d.setAttribute('data-k',p.k);
  d.innerHTML='<div class="ws-h"><span class="ws-t">'+(p.t?tabName(p.t):T('Bấm giờ','Bấm giờ'))+'</span><button type="button" class="ws-x" aria-label="'+T('Đóng khung','Close pane')+'">✕</button></div><iframe class="ws-f" title="'+T('Khung ','Pane ')+p.k+'" allow="autoplay; fullscreen; clipboard-write" src="'+url(p)+'"></iframe>';
  grid.appendChild(d);return d;
}
function fit(){
  var n=Math.min(P.length,maxPanes()),r=grid.getBoundingClientRect(),h=Math.max(200,window.innerHeight-r.top-12);
  grid.style.setProperty('--n',n);grid.style.height=h+'px';
}
function refresh(){
  var mx=maxPanes();
  [].forEach.call(grid.querySelectorAll('.ws-pane'),function(el){var k=+el.getAttribute('data-k'),i=P.findIndex(function(x){return x.k===k});el.hidden=i<0||i>=mx;el.style.order=i;el.querySelector('.ws-x').hidden=P.length<=1});
  add.textContent='＋ '+T('Khung','Pane')+' ('+Math.min(P.length,mx)+'/'+mx+')';add.disabled=P.length>=mx;
  add.title=P.length>=mx?T('Đã đạt số khung tối đa','Maximum panes reached'):T('Mở thêm một khung độc lập','Open another independent pane');
  note.textContent=(P.length<2&&mx>1)?T('Bấm ＋ Khung để mở thêm công cụ cạnh nhau (tối đa '+mx+'). Mỗi khung chạy độc lập như một chiếc điện thoại riêng.','Tap ＋ Pane to open more tools side by side (up to '+mx+'). Each pane runs independently, like its own phone.'):'';
  fit();
}
P.forEach(build);refresh();
add.addEventListener('click',function(){
  var open=P.map(function(x){return x.t}),opts=['pomo','today','todo','cd','sw'],t=opts.filter(function(x){return open.indexOf(x)<0})[0]||'cd';newPane(t,'');
});
grid.addEventListener('click',function(e){
  var b=e.target.closest('.ws-x');if(!b||P.length<=1)return;
  var el=b.closest('.ws-pane'),k=+el.getAttribute('data-k');
  P=P.filter(function(x){return x.k!==k});save();el.parentNode.removeChild(el);refresh();
});
window.addEventListener('message',function(e){
  var d=e.data;if(!d||!d.bgws)return;
  var k=+d.pane,p=P.filter(function(x){return x.k===k})[0],el=paneEl(k);if(!p||!el)return;
  if(d.mode&&p.t!==d.mode){p.t=d.mode;save()}
  var s=el.querySelector('.ws-t');if(s&&d.title)s.textContent=d.title;
});
var rz=null;
window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(refresh,300)});
window.addEventListener('orientationchange',function(){setTimeout(refresh,450)});
/* đổi ngôn ngữ / giao diện ở khung chứa thì tải lại các khung */
var lastLang=document.documentElement.lang;
new MutationObserver(function(){var l=document.documentElement.lang;if(l===lastLang)return;lastLang=l;
  [].forEach.call(grid.querySelectorAll('iframe'),function(f){try{f.contentWindow.location.reload()}catch(e){}});
  add.textContent='＋ '+T('Khung','Pane')+' ('+Math.min(P.length,maxPanes())+'/'+maxPanes()+')';note.textContent=''}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.addEventListener('storage',function(e){if(e.key==='bg2-theme'||e.key==='bg2-big'){setTimeout(function(){location.reload()},600)}});
/* ---- Liên kết khung, Cảnh bố cục, nút lệnh nhanh ---- */
var lastActive=1;
setInterval(function(){var f=document.activeElement;if(f&&f.tagName==='IFRAME'){var pe=f.closest('.ws-pane');if(pe)lastActive=+pe.getAttribute('data-k')}},400);
function visiblePanes(){return P.slice(0,maxPanes())}
function resetState(k){if(k>1){try{localStorage.removeItem('bg2-state@p'+k);localStorage.removeItem('bg-mode@p'+k)}catch(e){}}}
function newPane(t,cmd){
  if(P.length>=maxPanes()||P.length>=MAXALL)return null;
  var used=P.map(function(x){return x.k}),k=[1,2,3].filter(function(x){return used.indexOf(x)<0})[0];if(!k)return null;
  resetState(k);var p={k:k,t:t,cmd:cmd||''};P.push(p);save();build(p);refresh();return p;
}
function BC(){return window.BGBUS}
window.BGWS={
  active:function(){var a=P.filter(function(x){return x.k===lastActive})[0];return a?a.k:(P[0]&&P[0].k)||1},
  open:function(tool){
    var vp=visiblePanes(),p=vp.filter(function(x){return x.t===tool})[0];
    if(p){var el=paneEl(p.k);if(el){var f=el.querySelector('iframe');try{f.focus()}catch(e){}}return}
    BC().sendCmd('p'+this.active(),'open',{tool:tool});
  },
  startPomo:function(from){
    var vp=visiblePanes(),p=vp.filter(function(x){return x.t==='pomo'})[0];
    if(p){BC().sendCmd('p'+p.k,'start-pomo');return}
    var np=newPane('pomo','start-pomo');if(np)return;
    var to=(from&&from!=='host'&&from!=='main')?from:('p'+this.active());BC().sendCmd(to,'start-pomo');
  },
  cd:function(min){
    var vp=visiblePanes(),p=vp.filter(function(x){return x.t==='cd'})[0];
    if(p){BC().sendCmd('p'+p.k,'cd-start',{min:min,sec:0});return}
    var np=newPane('cd','');if(np){setTimeout(function(){BC().sendCmd('p'+np.k,'cd-start',{min:min,sec:0})},1600);return}
    BC().sendCmd('p'+this.active(),'cd-start',{min:min,sec:0});
  }
};
var kb=document.createElement('button');kb.type='button';kb.id='wsCmd';kb.textContent='⌘K';kb.title=T('Lệnh nhanh (Ctrl+K)','Quick command (Ctrl+K)');
kb.addEventListener('click',function(){if(window.BGBUS)BGBUS.openCmdk()});
var sb=document.createElement('button');sb.type='button';sb.id='wsScene';sb.textContent='🎬 '+T('Cảnh','Scenes');
if(tb){tb.insertBefore(kb,tb.firstChild);tb.insertBefore(sb,kb)}
/* ---- Cảnh ---- */
var PRESETS=[{n:'📚 '+T('Học bài','Study'),t:['pomo','todo','music']},{n:'💪 '+T('Tập luyện','Workout'),t:['iv','tally','zone']},{n:'☀️ '+T('Buổi sáng','Morning'),t:['today','water','habit']},{n:'💼 '+T('Làm việc','Work'),t:['todo','pomo','track']}];
function scenes(){try{var a=JSON.parse(localStorage.getItem('bg2x-scenes')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function saveScenes(a){try{localStorage.setItem('bg2x-scenes',JSON.stringify(a.slice(0,12)))}catch(e){}}
function applyScene(tools){
  var mx=maxPanes(),list=tools.slice(0,mx);if(!list.length)return;
  [].forEach.call(grid.querySelectorAll('.ws-pane'),function(el){el.parentNode.removeChild(el)});
  P=list.map(function(t,i){return{k:i+1,t:t}});
  P.forEach(function(p){resetState(p.k)});
  try{localStorage.removeItem('bg-mode')}catch(e){}
  save();P.forEach(build);refresh();
}
var menu=null;
function closeMenu(){if(menu&&menu.parentNode)menu.parentNode.removeChild(menu);menu=null}
function openMenu(){
  if(menu){closeMenu();return}
  menu=document.createElement('div');menu.id='wsMenu';
  var sv=scenes(),h='<div class="wm-t">'+T('Bố cục có sẵn','Presets')+'</div>'+PRESETS.map(function(s,i){return '<button type="button" data-pre="'+i+'">'+s.n+'<span>'+s.t.map(function(t){return tabName(t)}).join(' · ')+'</span></button>'}).join('');
  if(sv.length)h+='<div class="wm-t">'+T('Của bạn','Yours')+'</div>'+sv.map(function(s,i){return '<div class="wm-r"><button type="button" data-sv="'+i+'">🎬 '+(s.n||'').replace(/[<>&"]/g,'')+'<span>'+s.t.map(function(t){return tabName(t)}).join(' · ')+'</span></button><button type="button" class="wm-d" data-del="'+i+'" aria-label="'+T('Xóa','Delete')+'">✕</button></div>'}).join('');
  h+='<button type="button" class="wm-s" data-save="1">＋ '+T('Lưu bố cục hiện tại','Save current layout')+'</button><div class="wm-n">'+T('Mỗi cảnh mở sẵn các công cụ trong từng khung. Số khung tối đa theo cỡ màn hình.','Each scene opens its tools in the panes. Pane count depends on screen size.')+'</div>';
  menu.innerHTML=h;document.body.appendChild(menu);
  var r=sb.getBoundingClientRect();menu.style.top=(r.bottom+6)+'px';menu.style.left=Math.max(8,Math.min(window.innerWidth-menu.offsetWidth-8,r.left))+'px';
  menu.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-pre')){closeMenu();applyScene(PRESETS[+b.getAttribute('data-pre')].t)}
    else if(b.hasAttribute('data-sv')){var s=scenes()[+b.getAttribute('data-sv')];closeMenu();if(s)applyScene(s.t)}
    else if(b.hasAttribute('data-del')){var a=scenes();a.splice(+b.getAttribute('data-del'),1);saveScenes(a);closeMenu();openMenu()}
    else if(b.hasAttribute('data-save')){
      var nm=window.prompt(T('Tên cảnh (ví dụ: Học tối)','Scene name (e.g. Evening study)'),'');
      if(nm&&nm.trim()){var a2=scenes();a2.push({n:nm.trim().slice(0,24),t:P.slice(0,maxPanes()).map(function(x){return x.t||'sw'})});saveScenes(a2)}
      closeMenu();
    }
  });
}
sb.addEventListener('click',function(e){e.stopPropagation();openMenu()});
document.addEventListener('click',function(e){if(menu&&!menu.contains(e.target)&&e.target!==sb)closeMenu()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
setTimeout(fit,400);
}catch(e){}})();

/* Bấm giờ 2.0 — mã ứng dụng, tách từ index.html (bản sửa 14/11/2026) */
