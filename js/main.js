
document.addEventListener('DOMContentLoaded',()=>{
 const b=document.querySelector('.burger'),n=document.querySelector('.nav');
 if(b){b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');b.setAttribute('aria-expanded','false')}));
  window.addEventListener('resize',()=>{if(innerWidth>1100){n.classList.remove('open');b.setAttribute('aria-expanded','false')}});
  document.addEventListener('click',e=>{if(!e.target.closest('.hdr')){n.classList.remove('open')}})}
 document.querySelectorAll('.table').forEach(t=>{const hs=[...t.querySelectorAll('thead th')].map(x=>x.textContent);t.querySelectorAll('tbody tr').forEach(r=>[...r.children].forEach((td,i)=>td.setAttribute('data-label',hs[i]||'')))});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
 // gallery
 const figs=[...document.querySelectorAll('.grid figure')];
 if(figs.length){
  document.querySelectorAll('.filters button').forEach(btn=>btn.addEventListener('click',()=>{
   document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('on'));btn.classList.add('on');
   const f=btn.dataset.f;figs.forEach(fg=>fg.classList.toggle('hide',f!=='all'&&fg.dataset.c!==f));
  }));
  const lb=document.querySelector('.lb'),li=lb.querySelector('img'),lc=lb.querySelector('p');let cur=0;
  const vis=()=>figs.filter(f=>!f.classList.contains('hide'));
  const show=i=>{const v=vis();cur=(i+v.length)%v.length;const f=v[cur];li.src=f.dataset.full;li.alt=f.querySelector('img').alt;lc.textContent=f.querySelector('figcaption').textContent;lb.classList.add('open')};
  figs.forEach(f=>f.addEventListener('click',()=>show(vis().indexOf(f))));
  lb.querySelector('.x').onclick=()=>lb.classList.remove('open');
  lb.querySelector('.pv').onclick=()=>show(cur-1);lb.querySelector('.nx').onclick=()=>show(cur+1);
  lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')});
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
 }
});
