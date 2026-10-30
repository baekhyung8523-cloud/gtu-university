/* TGU public site: Firestore-powered forms, board, gallery, courses, events */
import { ready, db, collection, doc, getDocs, setDoc, addDoc, query, where, serverTimestamp } from './fb.js';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const toDate=v=>v?(typeof v.toDate==='function'?v.toDate():new Date(v)):null;
const KOL=document.documentElement.lang==='ko';
const fmtDate=d=>{if(!d)return '';if(d instanceof Date||typeof d.toDate==='function'){const x=toDate(d);return KOL?x.getFullYear()+'년 '+(x.getMonth()+1)+'월 '+x.getDate()+'일':MONTHS[x.getMonth()]+' '+x.getDate()+', '+x.getFullYear()}const m=String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);return m?(KOL?m[1]+'년 '+(+m[2])+'월 '+(+m[3])+'일':MONTHS[+m[2]-1]+' '+(+m[3])+', '+m[1]):esc(d)};
const fmtRange=(a,b)=>!a?'':(b&&b!==a?fmtDate(a)+' - '+fmtDate(b):fmtDate(a));
const LABEL={
 program:{ma_lay:'MA 1-Year Course (Lay Leaders)',ma:'MA Course',doctoral:'Doctoral Course',special:'Special Lecture',seminar:'Seminar'},
 mode:{onsite:'On campus',online:'Online',hybrid:'Hybrid'},
 board:{notice:'Notice',news:'News',academic:'Academic',resource:'Resources'},
 evcat:{admission:'Admission',semester:'Semester',ceremony:'Ceremony',seminar:'Seminar',other:'Event'}
};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const cache={};
const pub=async name=>{if(!ready)return [];if(cache[name])return cache[name];const s=await getDocs(query(collection(db,name),where('is_published','==',true)));return cache[name]=s.docs.map(d=>({id:d.id,...d.data()}))};
const settings=()=>cache.s||(cache.s=(async()=>{if(!ready)return {};try{const s=await getDocs(collection(db,'site_settings'));const m={};s.docs.forEach(d=>m[d.id]=d.data());return m}catch(e){return {}}})());

/* ---------- announcement banner ---------- */
async function banner(){
  const b=(await settings()).site_banner;
  if(!b||!b.active||!b.text)return;
  const el=document.createElement('div');el.className='site-banner';
  el.innerHTML='<span>'+esc(b.text)+'</span>'+(b.link&&/^https?:\/\/|^[\w./-]+\.html/.test(b.link)?' <a href="'+esc(b.link)+'">Details</a>':'')+'<button type="button" aria-label="Close">&times;</button>';
  el.querySelector('button').onclick=()=>el.remove();
  document.body.appendChild(el);
}

/* ---------- forms ---------- */
const TABLE={inquiry:'inquiries',admission:'admission_applications',registration:'course_registrations',subscribe:'subscribers'};
function setStatus(form,kind,msg){const s=$('.form-status',form);if(!s)return;s.className='form-status '+kind;s.textContent=msg;s.scrollIntoView({block:'nearest',behavior:'smooth'})}
function collect(form){
  const o={};
  $$('input,select,textarea',form).forEach(el=>{
    const n=el.name;if(!n||n==='website'||el.type==='file'||el.type==='submit')return;
    if(el.type==='checkbox'){o[n]=el.checked;return}
    let v=el.value.trim();
    if(v==='')return;
    o[n]=el.type==='number'?Number(v):v;
  });
  return o;
}
function bindForm(form){
  const type=form.dataset.tguForm,table=TABLE[type];if(!table)return;
  const t0=Date.now();
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!ready){setStatus(form,'err','Online forms are not connected yet. Please contact the office by phone.');return}
    const hp=$('[name=website]',form);
    if(hp&&hp.value){setStatus(form,'ok','Thank you.');form.reset();return}
    if(Date.now()-t0<2500){setStatus(form,'err','Please review your entries and press submit again.');return}
    if(!form.checkValidity()){form.reportValidity();return}
    const btn=$('button[type=submit]',form),label=btn.textContent;btn.disabled=true;btn.textContent='Sending...';
    try{
      const data=collect(form);
      if(type==='subscribe'){
        const email=data.email.toLowerCase();
        try{await setDoc(doc(db,'subscribers',email),{email,interest:data.interest||'news',consent:true,created_at:serverTimestamp()})}
        catch(err){if(!(err.code==='permission-denied'||err.code==='already-exists'))throw err}
      }else{
        if(type==='inquiry')data.status='new';
        if(type==='admission')data.status='received';
        if(type==='registration'){
          data.status='pending';data.payment_status='unpaid';
          const sel=$('select[name=course_id]',form);
          if(data.course_id&&sel&&sel.selectedIndex>=0)data.course_title=sel.options[sel.selectedIndex].text;
        }
        data.created_at=serverTimestamp();
        await addDoc(collection(db,table),data);
      }
      setStatus(form,'ok',{inquiry:'Thank you. Your inquiry has been received. We will reply by email.',admission:'Your application has been received. The admissions office will contact you by email.',registration:'Your registration has been received. We will confirm by email.',subscribe:'Thank you for subscribing.'}[type]);
      form.reset();
    }catch(err){
      setStatus(form,'err',err&&err.code==='permission-denied'?'Your submission could not be accepted. Please check the entries and try again, or contact the office by phone.':'Submission failed. Please try again or contact the office by phone.');
    }finally{btn.disabled=false;btn.textContent=label}
  });
}

/* ---------- courses / events ---------- */
async function courses(){
  const box=$('#courses-list'),sels=$$('select[name=course_id]');
  if(!box&&!sels.length)return;
  let list=(await pub('courses')).filter(c=>c.status==='open'||c.status==='closed');
  list.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)||String(a.start_date||'').localeCompare(String(b.start_date||'')));
  if(box){
    if(!list.length)box.innerHTML='<p class="empty">No courses are open for registration right now. Please check back soon. <a href="contact.html">Contact the office</a>.</p>';
    else box.innerHTML=list.map(c=>'<article class="course-card reveal"><div class="course-top"><span class="tag">'+esc(LABEL.program[c.program]||c.program)+'</span><span class="tag '+(c.status==='open'?'tag-ok':'tag-off')+'">'+(c.status==='open'?'Open':'Closed')+'</span></div><h3>'+esc(c.title)+'</h3>'
      +'<ul class="meta">'+(c.start_date?'<li><b>Dates</b> '+fmtRange(c.start_date,c.end_date)+'</li>':'')+(c.schedule_text?'<li><b>Schedule</b> '+esc(c.schedule_text)+'</li>':'')+'<li><b>Format</b> '+esc(LABEL.mode[c.mode]||c.mode)+(c.location?' / '+esc(c.location):'')+'</li>'+(c.instructor?'<li><b>Instructor</b> '+esc(c.instructor)+'</li>':'')+(c.fee_text?'<li><b>Fee</b> '+esc(c.fee_text)+'</li>':'')+(c.deadline?'<li><b>Deadline</b> '+fmtDate(c.deadline)+'</li>':'')+'</ul>'
      +(c.description?'<p>'+esc(c.description)+'</p>':'')+(c.status==='open'?'<a class="btn btn-primary" href="apply.html?course='+encodeURIComponent(c.id)+'#registration">Register</a>':'')+'</article>').join('');
    window.TGU_observe&&window.TGU_observe();
  }
  sels.forEach(sel=>{
    const open=list.filter(c=>c.status==='open');
    sel.innerHTML='<option value="">Other / not listed</option>'+open.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.title)+(c.start_date?' ('+fmtDate(c.start_date)+')':'')+'</option>').join('');
    const want=new URLSearchParams(location.search).get('course');
    if(want&&open.some(c=>c.id===want))sel.value=want;
  });
}
async function events(){
  const box=$('#events-list');if(!box||!ready)return;
  const t=today();
  const data=(await pub('events')).filter(e=>(e.end_date||e.start_date)>=t).sort((a,b)=>String(a.start_date).localeCompare(String(b.start_date))).slice(0,+box.dataset.limit||8);
  if(!data.length){box.innerHTML='<li class="empty">No upcoming events are scheduled yet.</li>';return}
  box.innerHTML=data.map(e=>'<li class="event reveal"><div class="when">'+fmtRange(e.start_date,e.end_date)+'</div><div><span class="tag">'+esc(LABEL.evcat[e.category]||e.category)+'</span> <b>'+esc(e.title)+'</b>'+(e.location?'<div class="sub">'+esc(e.location)+'</div>':'')+(e.description?'<div class="sub">'+esc(e.description)+'</div>':'')+'</div></li>').join('');
  window.TGU_observe&&window.TGU_observe();
}

/* ---------- board ---------- */
const linkify=t=>esc(t).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener nofollow">$1</a>').replace(/\n/g,'<br>');
async function livePosts(){
  const now=Date.now();
  return (await pub('posts')).filter(p=>!p.published_at||toDate(p.published_at).getTime()<=now)
    .sort((a,b)=>(b.is_pinned?1:0)-(a.is_pinned?1:0)||toDate(b.published_at)-toDate(a.published_at));
}
async function board(){
  const root=$('#board-root');if(!root)return;
  if(!ready){root.innerHTML='<p class="empty">The board is not connected yet.</p>';return}
  const params=new URLSearchParams(location.search);const id=params.get('id');
  const posts=await livePosts();
  if(id){
    const data=posts.find(p=>p.id===id);
    if(!data){root.innerHTML='<p class="empty">This post was not found.</p><p><a class="btn btn-line" href="board.html">Back to board</a></p>';return}
    document.title=data.title+' | Trinity Global University';
    root.innerHTML='<article class="post"><span class="tag">'+esc(LABEL.board[data.board]||data.board)+'</span><h2>'+esc(data.title)+'</h2><div class="post-meta">'+fmtDate(data.published_at)+' &middot; '+esc(data.author)+'</div><div class="post-body">'+linkify(data.body)+'</div>'
      +(data.attachment_url&&/^https?:\/\//i.test(data.attachment_url)?'<p><a class="btn btn-line" target="_blank" rel="noopener" href="'+esc(data.attachment_url)+'">'+esc(data.attachment_name||'Download attachment')+'</a></p>':'')+'<p><a class="btn btn-primary" href="board.html">Back to board</a></p></article>';
    return;
  }
  let cur=params.get('board')||'all',shown=0;const SIZE=15;
  root.innerHTML='<div class="tabs" id="btabs"></div><ul class="board-list" id="blist"></ul><div class="center" style="margin-top:24px"><button class="btn btn-line" id="bmore" hidden>Load more</button></div>';
  const tabs=$('#btabs'),list=$('#blist'),more=$('#bmore');
  tabs.innerHTML=[['all','All']].concat(Object.entries(LABEL.board)).map(([k,v])=>'<button type="button" data-b="'+k+'" class="'+(k===cur?'on':'')+'">'+v+'</button>').join('');
  function render(reset){
    if(reset){shown=0;list.innerHTML=''}
    const rows=posts.filter(p=>cur==='all'||p.board===cur);
    if(!rows.length){list.innerHTML='<li class="empty">No posts yet.</li>';more.hidden=true;return}
    const chunk=rows.slice(shown,shown+SIZE);shown+=chunk.length;
    list.insertAdjacentHTML('beforeend',chunk.map(p=>'<li><a href="board.html?id='+encodeURIComponent(p.id)+'"><span class="tag'+(p.is_pinned?' tag-pin':'')+'">'+(p.is_pinned?'Pinned':esc(LABEL.board[p.board]||p.board))+'</span><span class="ttl">'+esc(p.title)+'</span><span class="dt">'+fmtDate(p.published_at)+'</span></a></li>').join(''));
    more.hidden=shown>=rows.length;
  }
  tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cur=b.dataset.b;$$('button',tabs).forEach(x=>x.classList.toggle('on',x===b));render(true)});
  more.addEventListener('click',()=>render(false));
  render(true);
}
async function homeNotices(){
  const box=$('#home-notices');if(!box||!ready)return;
  const data=(await livePosts()).slice(0,4);
  if(!data.length){box.innerHTML='<li class="empty">No announcements yet.</li>';return}
  box.innerHTML=data.map(p=>'<li><a href="board.html?id='+encodeURIComponent(p.id)+'"><span class="tag">'+esc(LABEL.board[p.board]||p.board)+'</span><span class="ttl">'+esc(p.title)+'</span><span class="dt">'+fmtDate(p.published_at)+'</span></a></li>').join('');
}

/* ---------- gallery / faculty ---------- */
const GC={ceremony:'cer',class:'cl',event:'ev'};
async function gallery(){
  const grid=$('.grid[data-dynamic]');if(!grid||!ready)return;
  const data=(await pub('gallery_items')).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  if(!data.length)return;
  grid.innerHTML=data.map(g=>{const t=g.caption||g.title||'';const src=g.image_data||g.image_url||'';return '<figure data-c="'+(GC[g.category]||'ev')+'" data-full="'+esc(src)+'"><img src="'+esc(src)+'" alt="'+esc(t)+'" loading="lazy"><figcaption>'+esc(t)+'</figcaption></figure>'}).join('');
  window.TGU_initGallery&&window.TGU_initGallery();
}
async function faculty(){
  const body=$('#faculty-body');if(!body||!ready)return;
  const data=(await pub('faculty')).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)||String(a.name).localeCompare(String(b.name)));
  if(!data.length)return;
  const hs=['Name','Degree','Institution','Position'];
  body.innerHTML=data.map(f=>'<tr>'+[f.name,f.degree,f.institution,f.position].map((c,i)=>'<td data-label="'+hs[i]+'">'+esc(c||'')+'</td>').join('')+'</tr>').join('');
}

/* ---------- admissions open flag ---------- */
async function admissionsFlag(){
  const f=$('form[data-tgu-form=admission]');if(!f||!ready)return;
  const a=(await settings()).admissions;const note=$('#admissions-note');
  if(a&&a.term&&note)note.textContent='Current intake: '+a.term;
  if(a&&a.open===false){
    f.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=true);
    setStatus(f,'err',a.message||'Admissions are currently closed. Please contact the office for the next intake.');
  }
}

function init(){
  $$('form[data-tgu-form]').forEach(bindForm);
  const safe=fn=>fn().catch(e=>console.warn(fn.name,e&&e.code||e));
  [banner,courses,events,board,homeNotices,gallery,faculty,admissionsFlag].forEach(safe);
  const tabs=$$('[data-apply-tab]');
  if(tabs.length){
    const show=k=>{tabs.forEach(b=>b.classList.toggle('on',b.dataset.applyTab===k));$$('[data-apply-panel]').forEach(p=>p.hidden=p.dataset.applyPanel!==k)};
    tabs.forEach(b=>b.addEventListener('click',()=>{show(b.dataset.applyTab);history.replaceState(null,'','#'+b.dataset.applyTab)}));
    show(location.hash==='#registration'||new URLSearchParams(location.search).get('course')?'registration':'admission');
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
