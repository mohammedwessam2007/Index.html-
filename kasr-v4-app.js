(()=>{
const C=window.KASR_C||[], by=id=>C.find(x=>x.id===id), app=document.getElementById('app');
const PLAN=[
['2026-09-02','PATTERN LOCK',8,'Recurring Kasr anchors only.'],
['2026-09-03','24H RETRIEVAL',20,'Bones + high-recurrence cadaver targets.'],
['2026-09-04','NEUROVASCULAR + EMBRYO',20,'Nerves, vessels, then source embryo visuals.'],
['2026-09-05','TRANSFER DAY',20,'Fresh wording + ugly-specimen fallbacks.'],
['2026-09-06','SEALED DAY',35,'Representative stations, then repair only misses.'],
['2026-09-07','EXAM KILL-CHECK',10,'Cold stations only. No broad new learning.']];
const LOCK=['b11','b13','b2','b8','m12','m13','n1','a5'];
const KEY='kasr-anatomy-v4-full';
let S={daily:{},known:{},selected:null,sealed:[]};
try{S={...S,...JSON.parse(localStorage.getItem(KEY)||'{}')} }catch(e){}
try{const old=JSON.parse(localStorage.getItem('kasr-sept3-live-v1')||'{}');if(old.done)Object.keys(old.done).forEach(id=>S.known[id]=S.known[id]||'seen')}catch(e){}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function today(){return new Date().toLocaleDateString('en-CA')}
function autoPlan(){let p=PLAN.find(x=>x[0]===today());if(p)return p;return today()<'2026-09-02'?PLAN[0]:PLAN[PLAN.length-1]}
function plan(){return PLAN.find(x=>x[0]===S.selected)||autoPlan()}
function nav(){const a=plan()[0];return `<div class="daynav">${PLAN.map(p=>`<button class="day ${p[0]===a?'on':''}" onclick="K.sel('${p[0]}')">${p[0].slice(5)} ${p[1]}</button>`).join('')}<button class="day" onclick="K.auto()">AUTO TODAY</button></div>`}
function sortHigh(arr){return arr.slice().sort((a,b)=>(b.priority||0)-(a.priority||0)||(b.repeat||0)-(a.repeat||0))}
function idsFor(p){const d=p[0]; if(d==='2026-09-02')return LOCK;
 if(d==='2026-09-03')return [...sortHigh(C.filter(x=>x.cat==='BONES'&&x.evidence!=='C')).slice(0,7),...sortHigh(C.filter(x=>x.cat==='CADAVER'&&x.evidence!=='C')).slice(0,7)].map(x=>x.id);
 if(d==='2026-09-04')return [...sortHigh(C.filter(x=>['NERVES','VESSELS'].includes(x.cat))).slice(0,8),...C.filter(x=>x.cat==='EMBRYO').slice(0,6)].map(x=>x.id);
 if(d==='2026-09-05')return sortHigh(C.filter(x=>!x.safetyOnly&&x.evidence!=='C'&&S.known[x.id]!=='know')).slice(0,12).map(x=>x.id);
 if(d==='2026-09-07')return sampleStrat(8).map(x=>x.id); return []}
function state(d){S.daily[d]=S.daily[d]||{done:{}};return S.daily[d]}
function pct(p){if(p[0]==='2026-09-06'){const x=state(p[0]).sealed||0;return x}const ids=idsFor(p),done=state(p[0]).done;return ids.length?Math.round(ids.filter(id=>done[id]).length/ids.length*100):100}
function home(){const p=plan(),pc=pct(p),count=C.length;app.innerHTML=`<div class="ey">KASR 103 · PATTERN ENGINE V4</div><h1>🥷🏿 ${p[1]}</h1>${nav()}<div class="row"><span class="pill">${p[2]} MIN CAP</span><span class="pill">ALL DAYS UNLOCKED</span><span class="pill">${count} TOTAL TARGETS</span></div><div class="card"><div class="between"><div><div class="ey">SELECTED DAY COMPLETION</div><div class="pct">${pc}%</div></div><b>${p[3]}</b></div><div class="prog"><i style="width:${pc}%"></i></div><p class="mut">Completion is not readiness. Only sealed cold performance counts as exam evidence.</p></div><button class="primary" onclick="K.start()">${p[0]==='2026-09-06'?'START SEALED SET':pc===100?'RUN DAY AGAIN':'START / CONTINUE DAY'}</button><div class="grid"><button onclick="K.bank()">FULL TARGET BANK · 66</button><button onclick="K.seal(false)">OPTIONAL 6-STATION SEAL</button></div><div class="card"><b>Cadaver rule</b><p class="mut">If a muscle is damaged: compartment → course → tendon → bony attachment → neighbors. Never require a pristine specimen.</p></div><p class="tiny">Source-first lower limb + embryo only. Full bank access never inflates readiness.</p>`}
let Q=[],i=0,mode='day';
function start(){const p=plan();if(p[0]==='2026-09-06')return seal(true);const ds=state(p[0]),ids=idsFor(p);Q=ids.filter(id=>!ds.done[id]).map(by).filter(Boolean);if(!Q.length)Q=ids.map(by).filter(Boolean);i=0;mode='day';render()}
function img(c){return c.img?`<img src="${c.img}" onerror="this.outerHTML='<div class=imgfail>Image unavailable. Do not award yourself visual mastery from text.</div>'">`:''}
function qtext(c){return c.cat==='EMBRYO'&&c.img?(c.visualQ||c.q):(mode==='day'&&plan()[0]>='2026-09-05'?(c.fresh||c.q):c.q)}
function render(){if(i>=Q.length)return home();const c=Q[i];app.innerHTML=`<div class="between"><span class="ey">${c.cat} · EVIDENCE ${c.evidence}</span><span>${i+1}/${Q.length}</span></div><div class="card">${img(c)}<div class="big">${qtext(c)}</div><div id="ans" class="ans hide"><b>Answer:</b> ${c.a}${c.ugly?`<hr><b>Damaged-specimen fallback:</b> ${c.ugly}`:''}</div></div><div class="grid3"><button class="good" onclick="K.mark('know')">KNOW COLD</button><button class="warn" onclick="K.mark('partial')">PARTIAL</button><button class="bad" onclick="K.mark('idk')">IDK → TEACH</button></div><div id="nx" class="hide"><button class="primary" onclick="K.next()">NEXT</button></div><p class="tiny">Immediate correction = taught, not mastered.</p>`}
function mark(r){const c=Q[i];S.known[c.id]=r;state(plan()[0]).done[c.id]=true;save();if(r==='know')next();else{document.getElementById('ans').classList.remove('hide');document.getElementById('nx').classList.remove('hide')}}
function next(){i++;render()}
function bank(){app.innerHTML=`<div class="ey">FULL LOWER-LIMB + EMBRYO BANK</div><h1>All ${C.length} targets</h1><div class="grid">${['BONES','CADAVER','NERVES','VESSELS','EMBRYO'].map(cat=>`<button onclick="K.bankCat('${cat}')"><b>${cat}</b><br>${C.filter(x=>x.cat===cat).length} targets</button>`).join('')}</div><button class="primary" onclick="K.bankCat('ALL')">RUN ALL 66</button><button onclick="K.home()" style="width:100%;margin-top:8px">BACK</button>`}
function bankCat(cat){Q=(cat==='ALL'?C:C.filter(x=>x.cat===cat));i=0;mode='bank';renderBank()}
function renderBank(){if(i>=Q.length)return bank();const c=Q[i];app.innerHTML=`<div class="between"><span class="ey">BANK · ${c.cat}</span><span>${i+1}/${Q.length}</span></div><div class="card">${img(c)}<div class="big">${c.cat==='EMBRYO'&&c.img?(c.visualQ||c.q):c.q}</div><div id="ans" class="ans hide"><b>Answer:</b> ${c.a}${c.ugly?`<hr><b>Fallback:</b> ${c.ugly}`:''}</div></div><button class="primary" onclick="document.getElementById('ans').classList.remove('hide');document.getElementById('nx').classList.remove('hide')">SHOW ANSWER</button><div id="nx" class="hide"><button class="primary" onclick="K.bankNext()">NEXT TARGET</button></div><button onclick="K.bank()" style="width:100%;margin-top:8px">EXIT BANK</button><p class="tiny">Bank browsing earns zero readiness credit.</p>`}
function bankNext(){i++;renderBank()}
function rand(a){return a.slice().sort(()=>Math.random()-.5)}
function sampleStrat(n=10){let out=[...rand(C.filter(x=>x.cat==='BONES'&&x.evidence!=='C')).slice(0,3),...rand(C.filter(x=>x.cat==='CADAVER'&&x.evidence!=='C')).slice(0,3),...rand(C.filter(x=>['NERVES','VESSELS'].includes(x.cat)&&x.evidence!=='C')).slice(0,2),...rand(C.filter(x=>x.cat==='EMBRYO'&&x.img)).slice(0,2)];return out.slice(0,n)}
let SQ=[],si=0,R=[],ri=0,G={},rep=false;
function seal(representative){rep=representative;SQ=sampleStrat(representative?10:6);si=0;R=[];G={};renderSeal()}
function renderSeal(){if(si>=SQ.length){ri=0;return review()}const c=SQ[si];app.innerHTML=`<div class="between"><span class="ey">${rep?'REPRESENTATIVE SEALED':'SMALL SEALED'}</span><span>${si+1}/${SQ.length}</span></div><div class="card">${img(c)}<div class="big">${c.fresh||c.visualQ||c.q}</div></div><input id="resp" placeholder="Write the station answer..."><button class="primary" onclick="K.commit()">COMMIT · NO FEEDBACK</button>`;setTimeout(()=>document.getElementById('resp')?.focus(),0)}
function commit(){R.push(document.getElementById('resp').value.trim());si++;renderSeal()}
function review(){if(ri>=SQ.length)return finishSeal();const c=SQ[ri];app.innerHTML=`<div class="ey">STRICT POST-ROUND GRADING ${ri+1}/${SQ.length}</div><div class="card"><div class="big">${c.fresh||c.visualQ||c.q}</div><div class="ans"><b>Key:</b> ${c.a}</div><p><b>You wrote:</b> ${R[ri]||'(blank)'}</p></div><div class="grid3"><button class="good" onclick="K.grade('clean')">CLEAN</button><button class="warn" onclick="K.grade('partial')">PARTIAL</button><button class="bad" onclick="K.grade('wrong')">WRONG</button></div>`}
function grade(g){G[SQ[ri].id]=g;ri++;review()}
function finishSeal(){const v=Object.values(G),pts=v.reduce((s,g)=>s+(g==='clean'?1:g==='partial'?.5:0),0),pc=v.length?Math.round(100*pts/v.length):0;S.sealed.push({t:Date.now(),pc,rep});if(rep)state('2026-09-06').sealed=pc;save();app.innerHTML=`<div class="ey">INDEPENDENT EVIDENCE</div><h1>${pc}%</h1><div class="card"><b>${pc>=85?'Strong enough to stop broad review.':'Repair only the non-clean targets, then re-test fresh.'}</b><p class="mut">This score comes from cold sealed output, not training accuracy.</p></div><button class="primary" onclick="K.home()">BACK TO PROTOCOL</button>`}
window.K={home,sel:d=>{S.selected=d;save();home()},auto:()=>{S.selected=null;save();home()},start,mark,next,bank,bankCat,bankNext,seal,commit,grade};
home();
})();
