const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],mem={};
const S={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return k in mem?mem[k]:d}},set(k,v){mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P={Monthly:{p:2000,m:1},Quarterly:{p:5500,m:3},Annual:{p:15000,m:12}};
const iso=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const today=()=>iso(new Date());
const addM=(s,m)=>{const d=new Date(s+'T00:00:00');d.setMonth(d.getMonth()+m);return iso(d)};
const off=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const nice=s=>new Date(s+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const stat=e=>{const t=today();if(e<t)return'Expired';return e<=off(7)?'Expiring':'Active'};
const mk=(n,ph,pl,j,src)=>({id:Date.now()+Math.random(),name:n,phone:ph,plan:pl,join:j,exp:addM(j,P[pl].m),src});
function seed(){if(S.get('fg_m'))return;
S.set('fg_m',[mk('Aarav Sharma','98100 11223','Annual',off(-200),'Walk-in'),mk('Priya Nair','98730 44556','Quarterly',off(-85),'Website'),mk('Karan Malhotra','99110 22334','Monthly',off(-27),'Website'),mk('Sneha Verma','98910 77889','Quarterly',off(-120),'Walk-in'),mk('Rahul Khanna','97110 55667','Monthly',off(-45),'Walk-in'),mk('Ishita Bansal','98180 33445','Annual',off(-330),'Website'),mk('Vikram Singh','99580 66778','Monthly',off(-12),'Website'),mk('Meera Joshi','98730 99001','Quarterly',off(-60),'Walk-in')]);
S.set('fg_e',[{id:1,name:'Ankit Gupta',phone:'98111 20202',topic:'Personal coaching',msg:'Want to learn my first muscle-up, evenings only, evenings only.',date:off(-1),st:'New'},{id:2,name:'Divya Rao',phone:'99999 30303',topic:'Yoga',msg:'Is there a morning yoga batch for beginners?',date:off(-3),st:'Contacted'}])}
seed();
/* modals */
const open=m=>m.classList.add('on'),shut=()=>$$('.modal').forEach(m=>{if(m.id!=='login')m.classList.remove('on')});
document.addEventListener('click',e=>{if(e.target.closest('[data-close]')||e.target.classList.contains('modal')&&e.target.id!=='login')shut()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
/* join */
const jtot=()=>{const p=P[$('#jpl').value];$('#jtot').textContent='Total ₹'+p.p.toLocaleString('en-IN')+' · valid until '+nice(addM(today(),p.m))};
$$('[data-plan]').forEach(b=>b.onclick=()=>{$('#jpl').value=b.dataset.plan;$('#jp').textContent=b.dataset.plan;$('#joinF').style.display='';$('#jdone').style.display='none';jtot();open($('#joinM'))});
$('#jpl').onchange=()=>{$('#jp').textContent=$('#jpl').value;jtot()};
$('#joinF').onsubmit=e=>{e.preventDefault();const pl=$('#jpl').value,m=mk($('#jn').value.trim(),$('#jph').value.trim(),pl,today(),'Website');
S.set('fg_m',[m,...S.get('fg_m',[])]);$('#jdn').textContent=m.name;$('#jdp').textContent=pl;$('#jde').textContent=nice(m.exp);$('#joinF').style.display='none';$('#jdone').style.display='';e.target.reset()};
/* enquiry */
$('#enqF').onsubmit=e=>{e.preventDefault();S.set('fg_e',[{id:Date.now(),name:$('#en').value.trim(),phone:$('#ep').value.trim(),topic:$('#ei').value,msg:$('#em').value.trim(),date:today(),st:'New'},...S.get('fg_e',[])]);
const m=$('#enqM');m.textContent='Thanks! We have your enquiry and will call you within one working day.';m.className='msg on';e.target.reset()};
/* bmi */
$('#bmiF').onsubmit=e=>{e.preventDefault();const h=$('#h').value/100,w=+$('#w').value,b=w/(h*h);
const c=b<18.5?['Underweight','Focus on strength training and a small calorie surplus with enough protein.']:b<25?['Healthy range','Keep up a mix of strength work and cardio to stay there.']:b<30?['Overweight','Combine strength training, regular cardio, and a modest calorie deficit.']:['Obese range','Start with low-impact cardio and guided strength sessions. A trainer can pace you safely.'];
$('#bv').textContent=b.toFixed(1);$('#bc').textContent=c[0];$('#bt').textContent=c[1];$('#bmiR').style.display='';
$('#bm').style.left=Math.min(98,Math.max(0,(b-15)/(40-15)*100))+'%'};
/* routing */
function route(){const a=location.hash==='#admin';$('#site').style.display=a?'none':'';$('#admin').style.display=a?'block':'none';if(a){const on=S.get('fg_auth',false);$('#login').style.display=on?'none':'flex';$('#dash').style.display=on?'block':'none';if(on)render()}else shut()}
addEventListener('hashchange',route);
$('#logF').onsubmit=e=>{e.preventDefault();if($('#u').value.trim()==='admin'&&$('#pw').value==='raw@2026'){S.set('fg_auth',true);$('#logM').classList.remove('on');e.target.reset();route()}else $('#logM').classList.add('on')};
$('#out').onclick=()=>{S.set('fg_auth',false);route()};
/* admin */
let tab='m';
$$('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;$$('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));render()});
$('#q').oninput=$('#fs').onchange=render;
$('#addB').onclick=()=>{$('#ad').value=today();open($('#addM'))};
$('#addF').onsubmit=e=>{e.preventDefault();S.set('fg_m',[mk($('#an').value.trim(),$('#aph').value.trim(),$('#apl').value,$('#ad').value,'Walk-in'),...S.get('fg_m',[])]);shut();e.target.reset();tab='m';$$('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab==='m'));render()};
function render(){const M=S.get('fg_m',[]),E=S.get('fg_e',[]);
const c=s=>M.filter(m=>stat(m.exp)===s).length;
$('#kpi').innerHTML=[[M.length,'Total members'],[c('Active'),'Active'],[c('Expiring'),'Expiring in 7 days'],[c('Expired'),'Expired'],[E.filter(x=>x.st==='New').length,'New enquiries'],['₹'+M.filter(m=>m.join.slice(0,7)===today().slice(0,7)).reduce((a,m)=>a+P[m.plan].p,0).toLocaleString('en-IN'),'Sales this month']].map(k=>`<div><b>${k[0]}</b><span>${k[1]}</span></div>`).join('');
$('#mTools').style.display=tab==='m'?'contents':'none';$('#mT').style.display=tab==='m'?'':'none';$('#eT').style.display=tab==='e'?'':'none';
const q=$('#q').value.toLowerCase(),f=$('#fs').value;
const L=M.filter(m=>(!f||stat(m.exp)===f)&&(m.name+m.phone).toLowerCase().includes(q)).sort((a,b)=>a.exp.localeCompare(b.exp));
$('#mT').innerHTML=L.length?`<table><tr><th>Member</th><th>Phone</th><th>Plan</th><th>Joined</th><th>Expires</th><th>Status</th><th>Actions</th></tr>${L.map(m=>{const s=stat(m.exp);return`<tr><td>${esc(m.name)}<br><small style="color:var(--mute)">via ${esc(m.src)}</small></td><td>${esc(m.phone)}</td><td>${m.plan}</td><td>${nice(m.join)}</td><td>${nice(m.exp)}</td><td><span class="pill ${s}">${s}</span></td><td><button class="btn sm" data-r="${m.id}">Renew</button><button class="btn ghost sm" data-d="${m.id}">Remove</button></td></tr>`}).join('')}</table>`:'<div class="empty">No members match. Clear the search or add a member.</div>';
$('#eT').innerHTML=E.length?`<table><tr><th>Date</th><th>Name</th><th>Phone</th><th>Interested in</th><th>Message</th><th>Status</th><th>Actions</th></tr>${E.map(x=>`<tr><td>${nice(x.date)}</td><td>${esc(x.name)}</td><td>${esc(x.phone)}</td><td>${esc(x.topic)}</td><td>${esc(x.msg)||'-'}</td><td><span class="pill ${x.st}">${x.st}</span></td><td><button class="btn sm" data-t="${x.id}">${x.st==='New'?'Mark contacted':'Mark new'}</button><button class="btn ghost sm" data-x="${x.id}">Delete</button></td></tr>`).join('')}</table>`:'<div class="empty">No enquiries yet. New ones from the website will show here.</div>'}
$('#dash').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;let M=S.get('fg_m',[]),E=S.get('fg_e',[]);
if(d.r){M=M.map(m=>{if(m.id==d.r){const base=m.exp>today()?m.exp:today();m.exp=addM(base,P[m.plan].m)}return m});S.set('fg_m',M)}
else if(d.d){if(!confirm('Remove this member?'))return;S.set('fg_m',M.filter(m=>m.id!=d.d))}
else if(d.t)S.set('fg_e',E.map(x=>(x.id==d.t&&(x.st=x.st==='New'?'Contacted':'New'),x)));
else if(d.x){if(!confirm('Delete this enquiry?'))return;S.set('fg_e',E.filter(x=>x.id!=d.x))}else return;render()});
route();
