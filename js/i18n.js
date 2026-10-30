/* TGU language switch (EN / KO). English is the source text in the HTML; Korean is applied from js/i18n-ko.js. */
(function(){
'use strict';
var KO=window.TGU_KO||{};
var lang='en';
try{var q=new URLSearchParams(location.search).get('lang');if(q==='ko'||q==='en')localStorage.setItem('tgu_lang',q);lang=localStorage.getItem('tgu_lang')||((navigator.language||'').slice(0,2)==='ko'?'ko':'en')}catch(e){}
var I18N=window.TGU_I18N={lang:lang,t:function(s){return lang==='ko'?lookup(s)||s:s},set:function(l){try{localStorage.setItem('tgu_lang',l)}catch(e){}var u=new URL(location.href);u.searchParams.delete('lang');location.href=u.toString()}};
document.documentElement.lang=lang;
function lookup(key){
  key=key.replace(/\s+/g,' ').trim();if(!key)return null;
  if(KO[key])return KO[key];
  var m;
  if((m=key.match(/^— (.+)$/))&&KO[m[1]])return '— '+KO[m[1]];
  if(m=key.match(/^Dr\. (.+)$/))return m[1]+' 박사';
  if(m=key.match(/^Rev\.?,? (.+)$/))return m[1]+' 목사';
  if(m=key.match(/^Current intake: (.+)$/))return '현재 모집 학기: '+m[1];
  if(m=key.match(/^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/)){var mo='JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(m[1])/3+1;if(mo>=1)return m[3]+'년 '+mo+'월 '+m[2]+'일'}
  return null;
}
function trNode(n){
  var v=n.nodeValue;if(!v||!v.trim())return;
  var ko=lookup(v);if(!ko)return;
  var lead=v.match(/^\s*/)[0],trail=v.match(/\s*$/)[0];
  n.nodeValue=lead+ko+trail;
}
function trAttrs(el){
  ['placeholder','aria-label','alt','title'].forEach(function(a){
    var v=el.getAttribute&&el.getAttribute(a);if(!v)return;
    var ko=lookup(v);if(ko)el.setAttribute(a,ko);
  });
}
function apply(root){
  if(lang!=='ko')return;
  root=root||document.body;if(!root)return;
  if(root.nodeType===3){trNode(root);return}
  if(root.nodeType!==1)return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;return p&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
  var nodes=[],n;while(n=w.nextNode())nodes.push(n);nodes.forEach(trNode);
  trAttrs(root);root.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(trAttrs);
}
I18N.apply=apply;
function title(){
  if(lang!=='ko')return;
  document.title=document.title.split(' | ').map(function(p){return lookup(p)||p}).join(' | ');
}
function buildSwitch(){
  var hdr=document.querySelector('.hdr');if(!hdr||hdr.querySelector('.lang'))return;
  var box=document.createElement('div');box.className='lang';box.setAttribute('role','group');box.setAttribute('aria-label','Language');
  box.innerHTML='<button type="button" data-l="ko" class="'+(lang==='ko'?'on':'')+'" aria-pressed="'+(lang==='ko')+'">한국어</button><button type="button" data-l="en" class="'+(lang==='en'?'on':'')+'" aria-pressed="'+(lang==='en')+'">EN</button>';
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b.dataset.l!==lang)I18N.set(b.dataset.l)});
  hdr.appendChild(box);
}
function start(){
  buildSwitch();apply(document.body);title();
  document.documentElement.classList.remove('i18n-pending');
  if(lang==='ko'&&window.MutationObserver){
    new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(x){apply(x)})})}).observe(document.body,{childList:true,subtree:true});
  }
}
if(document.body&&document.readyState!=='loading')start();else document.addEventListener('DOMContentLoaded',start);
})();
