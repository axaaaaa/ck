const records=REAL_DEPOSITS,$=id=>document.getElementById(id),money=n=>n.toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});
const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const days=s=>Math.ceil((Date.parse(s)-Date.parse(today))/86400000),total=records.reduce((s,r)=>s+r.amount,0);
const termInterest=records.reduce((sum,r)=>sum+(r.maturityInterest??r.amount*r.rate*3),0);
if($('daily-interest'))$('daily-interest').textContent='¥ '+money(termInterest/3/365);
if($('monthly-interest'))$('monthly-interest').textContent='¥ '+money(termInterest/36);
const banks=new Map();for(const r of records)banks.set(r.bank,(banks.get(r.bank)||0)+r.amount);
const make=(tag,txt,cls)=>{const e=document.createElement(tag);e.textContent=txt;if(cls)e.className=cls;return e;};
function fill(id,text){const e=$(id);if(e){e.replaceChildren(make('p',text,'subtle'));}}
for(const id of ['weighted-rate'])if($(id))$(id).textContent=(records.reduce((sum,r)=>sum+r.amount*r.rate,0)/total*100).toFixed(2)+'%';
const soon=records.filter(r=>r.maturity&&days(r.maturity)>=0&&days(r.maturity)<=30);
if($('overview-soon'))$('overview-soon').textContent=soon.length+' 笔';
if($('maturity-count'))$('maturity-count').textContent=records.filter(r=>r.maturity).length+' 笔日期已知';
const legend=$('bank-legend');if(legend){legend.replaceChildren();for(const [bank,amount]of banks)legend.append(make('p',`${bank} · ¥ ${money(amount)} · ${(amount/total*100).toFixed(1)}%`));}
const donut=$('bank-donut');if(donut){let cumulative=0;const colors=["#268fff","#1dc5a0","#ffa263"];donut.style.background="conic-gradient("+[...banks.values()].map((amount,i)=>{const start=cumulative;cumulative+=amount/total*100;return `${colors[i%colors.length]} ${start}% ${cumulative}%`;}).join(",")+")";const center=donut.querySelector('.donut-center');if(center)center.textContent='¥ '+money(total);}
const rows=[...document.querySelectorAll('.deposits-table tbody tr')];
function filter(){const q=$('search-input')||document.querySelector('input[type="search"]')||document.querySelector('input[placeholder*="搜索"]');const bank=$('filter-bank')?.value||'',state=$('filter-status')?.value||'all';const start=$('filter-start')?.value,end=$('filter-end')?.value;let count=0;for(const [i,row]of rows.entries()){const r=records[i],s=!r.maturity?'unknown':r.maturity<=today?'matured':'active';const match=(!q?.value||row.textContent.includes(q.value))&&(!bank||bank===r.bank)&&(state==='all'||state===s||(state==='soon'&&r.maturity&&days(r.maturity)>=0&&days(r.maturity)<=30))&&(!start||(r.maturity&&r.maturity>=start))&&(!end||(r.maturity&&r.maturity<=end));row.hidden=!match;if(match)count++;}if($('record-count'))$('record-count').textContent=count+' 笔';}
for(const e of document.querySelectorAll('input[type="search"],input[placeholder*="搜索"],#filter-bank,#filter-status,#filter-start,#filter-end')){e.addEventListener('input',filter);e.addEventListener('change',filter);}
if($('reset-filters'))$('reset-filters').onclick=()=>{for(const e of document.querySelectorAll('#filter-bank,#filter-status,#filter-start,#filter-end,input[placeholder*="搜索"]'))e.value=e.id==='filter-status'?'all':'';filter();};
const sort=$('filter-sort');if(sort)sort.onchange=()=>{const order=records.map((r,i)=>({r,i}));order.sort((a,b)=>sort.value==='amount-desc'?b.r.amount-a.r.amount:sort.value==='amount-asc'?a.r.amount-b.r.amount:sort.value==='bank'?a.r.bank.localeCompare(b.r.bank):sort.value==='maturity'?(a.r.maturity||'9999').localeCompare(b.r.maturity||'9999'):a.i-b.i);for(const x of order)rows[x.i].parentNode.append(rows[x.i]);};
for(const b of document.querySelectorAll('.records-tab')){if(b.dataset.view!=='records')b.disabled=true;}
filter();

// Linear maturity track: chronological milestones, unknown dates listed separately.
const trackRoot=$('maturity-timeline');
if(trackRoot){
 trackRoot.replaceChildren();const track=make('ol','','linear-track');track.setAttribute('aria-label','按日期排序的到期时间线');
 const milestones=[{date:today,title:'今天',amount:null},...records.filter(r=>r.maturity).map(r=>({date:r.maturity,title:r.bank,amount:r.amount}))].sort((a,b)=>a.date.localeCompare(b.date));
 for(const item of milestones){const node=make('li','','linear-node');if(item.amount===null)node.classList.add('is-today');const dot=make('span','','linear-dot');dot.setAttribute('aria-hidden','true');const time=make('time',item.date,'linear-date');time.dateTime=item.date;node.append(dot,time,make('strong',item.title,'linear-title'));if(item.amount!==null){node.append(make('span','¥ '+money(item.amount),'linear-amount'));const remaining=days(item.date);node.append(make('span',remaining<0?'已到期':remaining===0?'今天到期':remaining+' 天后到期','linear-caption'));}else node.append(make('span','当前日期','linear-caption'));track.append(node);}
 trackRoot.append(track);const unknown=records.filter(r=>!r.maturity);if(unknown.length)trackRoot.append(make('p',unknown.length+' 笔到期日待补充：'+unknown.map(r=>r.bank+' ¥ '+money(r.amount)).join(' · '),'linear-pending'));
}
