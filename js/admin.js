/* TGU admin console (Firebase). Authorization is enforced by firebase/firestore.rules; this UI only reflects it. */
import { ready, db, auth, collection, doc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, query, where, limit, serverTimestamp, Timestamp, getCountFromServer, writeBatch, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './fb.js';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tt;const toast=(m,err)=>{const t=$('#toast');t.textContent=m;t.className='toast show'+(err?' err':'');clearTimeout(tt);tt=setTimeout(()=>t.className='toast',err?6000:2600)};
if(!ready){$('#setup').hidden=false}else main();

function main(){
const SEED={"faculty":[{"name":"Dr. John Y. Kim","degree":"Ph.D.","institution":"Netherlands Free University","position":"International Chancellor of CCGU","sort_order":1,"is_published":true},{"name":"Dr. David C. Jun","degree":"D.Miss.","institution":"Fuller Theological Seminary","position":"President of KHE","sort_order":2,"is_published":true},{"name":"Dr. Chun, Moo-Yup","degree":"Ph.D.","institution":"Trinity Global University","position":"President of TGU","sort_order":3,"is_published":true},{"name":"Dr. Paul J. Lim","degree":"Ph.D.","institution":"Trinity Global University","position":"Vice President of TGU","sort_order":4,"is_published":true},{"name":"Dr. Lee, Gun-Young","degree":"D.D.","institution":"Trinity Global University","position":"Emeritus Pastor, Second Presbyterian Church","sort_order":5,"is_published":true},{"name":"Dr. Park, Sam-Yeol","degree":"Ph.D.","institution":"Trinity Global University","position":"Emeritus Pastor, Song-Wol Presbyterian Church","sort_order":6,"is_published":true},{"name":"Dr. Cho, Joong-Eun","degree":"D.D.","institution":"Trinity Global University","position":"Emeritus Pastor, New Light Methodist Church","sort_order":7,"is_published":true},{"name":"Dr. Shin, Yong-Dae","degree":"D.D.","institution":"Trinity Global University","position":"Pastor, Heaven Dream Methodist Church","sort_order":8,"is_published":true},{"name":"Dr. Yu, Sung-Joon","degree":"D.Min.","institution":"Gerret University","position":"President of Korea Saint Training Institute","sort_order":9,"is_published":true},{"name":"Dr. Benjamin Y. Lee","degree":"Ph.D.","institution":"Fuller Theological Seminary","position":"Professor, Sudo International University","sort_order":10,"is_published":true},{"name":"Dr. John S. Hong","degree":"Ph.D.","institution":"Boston University","position":"Distinguished Professor, Asbury Theological Seminary","sort_order":11,"is_published":true},{"name":"Dr. Won, Dong-Hyun","degree":"Ph.D.","institution":"KAIST","position":"Chairman, National Future Education Committee","sort_order":12,"is_published":true},{"name":"Dr. Ha, Gui-Ho","degree":"D.Min.","institution":"Westminster Seminary","position":"Former Board Chairman of GMS","sort_order":13,"is_published":true},{"name":"Dr. Kim, Gil-Soo","degree":"Ph.D.","institution":"Westminster Seminary","position":"Pastor, Love of the Lord Jesus Church","sort_order":14,"is_published":true},{"name":"Dr. Park, Chun-Sik","degree":"D.Min.","institution":"CCGU","position":"President of Korea International Student Mission","sort_order":15,"is_published":true},{"name":"Dr. Jung, Oh-Sang","degree":"Ph.D.","institution":"Philippines University","position":"Dean of Trinity Global Academy","sort_order":16,"is_published":true},{"name":"Dr. Lee, Seong-Sang","degree":"Ph.D.","institution":"Asia Seminary of Leadership","position":"President of Harvest University","sort_order":17,"is_published":true}],"gallery_items":[{"title":"Inauguration and Installation Service, September 13, 2020","caption":"Inauguration and Installation Service, September 13, 2020","category":"ceremony","image_url":"images/photo-01.jpg","sort_order":1,"is_published":true},{"title":"Inauguration and Installation Service, September 13, 2020","caption":"Inauguration and Installation Service, September 13, 2020","category":"ceremony","image_url":"images/photo-07.jpg","sort_order":2,"is_published":true},{"title":"Taking the oath on the Bible at a conferment ceremony","caption":"Taking the oath on the Bible at a conferment ceremony","category":"ceremony","image_url":"images/photo-02.jpg","sort_order":3,"is_published":true},{"title":"Carrying the TGU flag at a ceremony","caption":"Carrying the TGU flag at a ceremony","category":"ceremony","image_url":"images/photo-03.jpg","sort_order":4,"is_published":true},{"title":"Degree conferment: presenting a certificate plaque","caption":"Degree conferment: presenting a certificate plaque","category":"ceremony","image_url":"images/photo-04.jpg","sort_order":5,"is_published":true},{"title":"Degree conferment: presenting a certificate plaque","caption":"Degree conferment: presenting a certificate plaque","category":"ceremony","image_url":"images/photo-05.jpg","sort_order":6,"is_published":true},{"title":"Faculty on the platform","caption":"Faculty on the platform","category":"ceremony","image_url":"images/photo-06.jpg","sort_order":7,"is_published":true},{"title":"Faculty and honorees in academic regalia","caption":"Faculty and honorees in academic regalia","category":"ceremony","image_url":"images/photo-08.jpg","sort_order":8,"is_published":true},{"title":"Message from the pulpit","caption":"Message from the pulpit","category":"ceremony","image_url":"images/photo-09.jpg","sort_order":9,"is_published":true},{"title":"Ceremony address","caption":"Ceremony address","category":"ceremony","image_url":"images/photo-10.jpg","sort_order":10,"is_published":true},{"title":"Ceremony address","caption":"Ceremony address","category":"ceremony","image_url":"images/photo-11.jpg","sort_order":11,"is_published":true},{"title":"Guest lecture","caption":"Guest lecture","category":"ceremony","image_url":"images/photo-12.jpg","sort_order":12,"is_published":true},{"title":"Welcome banner, Songwol Presbyterian Church, September 19-23, 2022","caption":"Welcome banner, Songwol Presbyterian Church, September 19-23, 2022","category":"event","image_url":"images/photo-26.jpg","sort_order":13,"is_published":true},{"title":"Doctoral Integrated Seminar: students from India, Nepal and Korea, September 19-23, 2022","caption":"Doctoral Integrated Seminar: students from India, Nepal and Korea, September 19-23, 2022","category":"event","image_url":"images/photo-30.jpg","sort_order":14,"is_published":true},{"title":"Group photo","caption":"Group photo","category":"event","image_url":"images/photo-16.jpg","sort_order":15,"is_published":true},{"title":"Fellowship with visiting students","caption":"Fellowship with visiting students","category":"event","image_url":"images/photo-21.jpg","sort_order":16,"is_published":true},{"title":"Group photo outside the venue","caption":"Group photo outside the venue","category":"event","image_url":"images/photo-28.jpg","sort_order":17,"is_published":true},{"title":"Classroom session","caption":"Classroom session","category":"class","image_url":"images/photo-13.jpg","sort_order":18,"is_published":true},{"title":"Lecture in the classroom","caption":"Lecture in the classroom","category":"class","image_url":"images/photo-14.jpg","sort_order":19,"is_published":true},{"title":"Lecture in the classroom","caption":"Lecture in the classroom","category":"class","image_url":"images/photo-15.jpg","sort_order":20,"is_published":true},{"title":"Lecture in the classroom","caption":"Lecture in the classroom","category":"class","image_url":"images/photo-17.jpg","sort_order":21,"is_published":true},{"title":"Lecture in the classroom","caption":"Lecture in the classroom","category":"class","image_url":"images/photo-18.jpg","sort_order":22,"is_published":true},{"title":"Lecture in the classroom","caption":"Lecture in the classroom","category":"class","image_url":"images/photo-19.jpg","sort_order":23,"is_published":true},{"title":"Lecture in the classroom","caption":"Lecture in the classroom","category":"class","image_url":"images/photo-20.jpg","sort_order":24,"is_published":true},{"title":"Seminar discussion","caption":"Seminar discussion","category":"class","image_url":"images/photo-22.jpg","sort_order":25,"is_published":true},{"title":"Seminar discussion","caption":"Seminar discussion","category":"class","image_url":"images/photo-23.jpg","sort_order":26,"is_published":true},{"title":"Seminar discussion","caption":"Seminar discussion","category":"class","image_url":"images/photo-24.jpg","sort_order":27,"is_published":true},{"title":"Seminar discussion","caption":"Seminar discussion","category":"class","image_url":"images/photo-25.jpg","sort_order":28,"is_published":true},{"title":"Lecture in the classroom","caption":"Lecture in the classroom","category":"class","image_url":"images/photo-27.jpg","sort_order":29,"is_published":true},{"title":"Classroom session","caption":"Classroom session","category":"class","image_url":"images/photo-29.jpg","sort_order":30,"is_published":true}],"courses":[{"title":"1-Year Course for Lay Leaders","program":"ma_lay","description":"Four intensive classes within a semester (Saturdays, 9:00 am - 3:30 pm). Lectures and reading reports; attend the overseas mission training program. Edit dates and publish when ready.","mode":"onsite","status":"draft","is_published":false,"sort_order":1},{"title":"MA Course","program":"ma","description":"For those who finished the one-year course and hold a bachelor's degree. Edit dates and publish when ready.","mode":"onsite","status":"draft","is_published":false,"sort_order":2},{"title":"Doctoral Course (D.Min / D.Miss / Ed.D. / Ph.D.)","program":"doctoral","description":"Four terms of advanced biblical studies and overseas ministry involvement. Edit dates and publish when ready.","mode":"onsite","status":"draft","is_published":false,"sort_order":3}]};
const L={
 inqCat:{general:'일반 문의',admission:'입학 문의',course:'강의 문의',mission:'선교 훈련',support:'후원·기도',other:'기타'},
 inqSt:{new:'신규',in_progress:'처리중',done:'완료',spam:'스팸'},
 prog:{ma_lay:'MA 1년 평신도 과정',ma:'MA 과정',dmin:'D.Min',dmiss:'D.Miss',edd:'Ed.D.',phd:'Ph.D.'},
 appSt:{received:'접수',reviewing:'검토중',interview:'면접',accepted:'합격',waitlist:'대기',rejected:'불합격',withdrawn:'철회'},
 regSt:{pending:'대기',confirmed:'확정',waitlisted:'대기자',cancelled:'취소'},
 pay:{unpaid:'미납',paid:'납부',refunded:'환불',waived:'면제'},
 mode:{onsite:'대면',online:'온라인',hybrid:'혼합'},
 board:{notice:'공지사항',news:'학교 소식',academic:'학사 안내',resource:'자료실'},
 gcat:{ceremony:'행사·예식',class:'수업·세미나',event:'모임·교제'},
 cprog:{ma_lay:'MA 1년 평신도 과정',ma:'MA 과정',doctoral:'박사 과정',special:'특강',seminar:'세미나'},
 cst:{draft:'준비중',open:'모집중',closed:'모집마감',ended:'종료'},
 evcat:{admission:'입학',semester:'학기',ceremony:'행사',seminar:'세미나',other:'기타'},
 interest:{news:'소식',prayer:'기도 동역',support:'후원'}
};
const pad=n=>String(n).padStart(2,'0');
const fmtDT=s=>{if(!s)return '';const d=new Date(s);return isNaN(d)?'':d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
const fmtD=s=>s?String(s).slice(0,10):'';
const toLocalInput=s=>{if(!s)return '';const d=new Date(s);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())};

/* ---------- data layer ---------- */
const norm=d=>{const o={id:d.id},x=d.data();for(const k in x){const v=x[k];o[k]=v&&typeof v.toDate==='function'?v.toDate().toISOString():v}return o};
const store={};
async function rows(col,force){if(!force&&store[col])return store[col];const s=await getDocs(collection(db,col));return store[col]=s.docs.map(norm)}
const bust=col=>{delete store[col]};

/* ---------- entity config ---------- */
const ENT={
 inquiries:{label:'문의',grp:'접수함',kind:'inbox',order:['created_at',false],badge:['status','new'],
  cols:[['created_at','접수일','dt'],['name','이름'],['category','분류','map',L.inqCat],['subject','제목'],['status','상태','badge',L.inqSt]],
  detail:[['name','이름'],['email','이메일'],['phone','전화'],['category','분류','map',L.inqCat],['subject','제목'],['message','내용'],['created_at','접수일','dt'],['replied_at','답변 처리일','dt']],
  edit:{status:L.inqSt},note:true,search:['name','email','subject','message'],filter:['status',L.inqSt],csv:true},
 admission_applications:{label:'입학지원',grp:'접수함',kind:'inbox',order:['created_at',false],badge:['status','received'],
  cols:[['created_at','접수일','dt'],['full_name','이름'],['program','과정','map',L.prog],['email','이메일'],['status','상태','badge',L.appSt]],
  detail:[['full_name','이름'],['korean_name','한글 이름'],['program','지원 과정','map',L.prog],['start_term','희망 학기'],['birth_date','생년월일'],['nationality','국적'],['residence_country','거주 국가'],['email','이메일'],['phone','전화'],['address','주소'],['church_org','교회·기관'],['position','직분'],['denomination','교단'],['ministry_years','사역 연수'],['highest_degree','최종 학위'],['school_name','학교'],['gpa','학점'],['recommender_name','추천인'],['recommender_contact','추천인 연락처'],['statement','지원 동기'],['heard_from','알게 된 경로'],['created_at','접수일','dt'],['reviewed_at','검토일','dt']],
  edit:{status:L.appSt},note:true,search:['full_name','email','church_org'],filter:['status',L.appSt],csv:true,reviewedOn:true},
 course_registrations:{label:'강의신청',grp:'접수함',kind:'inbox',order:['created_at',false],badge:['status','pending'],
  cols:[['created_at','접수일','dt'],['name','이름'],['course_title','강의'],['mode','방식','map',L.mode],['status','상태','badge',L.regSt],['payment_status','납부','badge',L.pay]],
  detail:[['name','이름'],['email','이메일'],['phone','전화'],['country','국가'],['church_org','교회·기관'],['position','직분'],['course_title','강의'],['mode','참여 방식','map',L.mode],['message','메시지'],['created_at','접수일','dt']],
  edit:{status:L.regSt,payment_status:L.pay},note:true,search:['name','email','course_title'],filter:['status',L.regSt],csv:true},
 subscribers:{label:'구독자',grp:'접수함',kind:'inbox',order:['created_at',false],
  cols:[['created_at','가입일','dt'],['email','이메일'],['name','이름'],['interest','관심','map',L.interest]],
  detail:[['email','이메일'],['name','이름'],['interest','관심','map',L.interest],['created_at','가입일','dt']],edit:{},search:['email','name'],csv:true},
 posts:{label:'게시판',grp:'콘텐츠',kind:'content',order:['published_at',false],
  cols:[['published_at','게시일','dt'],['board','게시판','map',L.board],['title','제목'],['is_pinned','고정','bool'],['is_published','공개','bool']],
  fields:[['board','게시판','select',L.board],['title','제목','text'],['body','본문','textarea',12],['author','작성자','text'],['published_at','게시일시','datetime'],['is_pinned','상단 고정','checkbox'],['is_published','공개','checkbox'],['attachment_url','첨부 링크(URL)','url'],['attachment_name','첨부 이름','text']],
  defaults:{board:'notice',author:'TGU Office',is_published:true,is_pinned:false},search:['title','body'],filter:['board',L.board]},
 gallery_items:{label:'갤러리',grp:'콘텐츠',kind:'content',order:['sort_order',true],bulk:true,seed:true,
  cols:[['image','사진','img'],['title','제목'],['category','분류','map',L.gcat],['sort_order','순서'],['is_published','공개','bool']],
  fields:[['image','사진','image','image_data',1000],['title','제목','text'],['caption','설명(캡션)','text'],['category','분류','select',L.gcat],['taken_on','촬영일','date'],['sort_order','순서(작을수록 앞)','number'],['is_published','공개','checkbox']],
  defaults:{category:'event',is_published:true,sort_order:0},search:['title','caption'],filter:['category',L.gcat]},
 courses:{label:'강의 관리',grp:'콘텐츠',kind:'content',order:['sort_order',true],seed:true,
  cols:[['title','강의명'],['program','과정','map',L.cprog],['start_date','시작일'],['status','상태','badge',L.cst],['is_published','공개','bool']],
  fields:[['title','강의명','text'],['program','과정 구분','select',L.cprog],['description','설명','textarea',5],['instructor','강사','text'],['mode','진행 방식','select',L.mode],['location','장소','text'],['start_date','시작일','date'],['end_date','종료일','date'],['schedule_text','일정 안내(예: 토 9:00-15:30)','text'],['capacity','정원','number'],['fee_text','수강료 안내','text'],['deadline','신청 마감일','date'],['status','상태','select',L.cst],['is_published','사이트에 공개','checkbox'],['sort_order','순서','number']],
  defaults:{program:'special',mode:'onsite',status:'draft',is_published:false,sort_order:0},search:['title','instructor'],filter:['status',L.cst]},
 events:{label:'학사 일정',grp:'콘텐츠',kind:'content',order:['start_date',false],
  cols:[['start_date','시작일'],['end_date','종료일'],['title','일정'],['category','분류','map',L.evcat],['is_published','공개','bool']],
  fields:[['title','일정 제목','text'],['category','분류','select',L.evcat],['start_date','시작일','date'],['end_date','종료일','date'],['location','장소','text'],['description','설명','textarea',4],['link_url','링크(URL)','url'],['is_published','공개','checkbox']],
  defaults:{category:'other',is_published:true},search:['title','location'],filter:['category',L.evcat]},
 faculty:{label:'교수진',grp:'콘텐츠',kind:'content',order:['sort_order',true],seed:true,
  cols:[['sort_order','순서'],['name','이름'],['degree','학위'],['institution','출신 학교'],['position','직책'],['is_published','공개','bool']],
  fields:[['name','이름','text'],['degree','학위','text'],['institution','출신 학교','text'],['position','직책','text'],['bio','소개','textarea',5],['photo','사진(선택)','image','photo_data',400],['sort_order','순서','number'],['is_published','공개','checkbox']],
  defaults:{is_published:true,sort_order:0},search:['name','institution','position']}
};
const MENU=['dash','inquiries','admission_applications','course_registrations','subscribers','posts','gallery_items','courses','events','faculty','settings'];
const st={q:{},f:{},page:{}};
const PAGE=20;

/* ---------- auth ---------- */
const show=id=>{['setup','login','app'].forEach(x=>$('#'+x).hidden=x!==id)};
let me=null;
async function checkAdmin(user){
  try{await getDocs(query(collection(db,'inquiries'),limit(1)))}
  catch(e){await signOut(auth);show('login');$('#lErr').style.color='';$('#lErr').textContent='이 계정은 관리자 권한이 없습니다. ('+(user.email||'')+')';return false}
  me=user.email;$('#who').textContent=me;show('app');buildMenu();go(location.hash.slice(1)||'dash');return true;
}
onAuthStateChanged(auth,u=>{if(u)checkAdmin(u);else show('login')});
$('#google').addEventListener('click',async()=>{
  $('#lErr').textContent='';
  try{await signInWithPopup(auth,new GoogleAuthProvider())}
  catch(e){$('#lErr').style.color='';$('#lErr').textContent='로그인 실패: '+(e.code==='auth/unauthorized-domain'?'이 주소가 Firebase 승인된 도메인에 없습니다. Authentication, 설정, 승인된 도메인에 추가하세요.':e.message)}
});
$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault();$('#lErr').textContent='';
  const raw=$('#lEmail').value.trim();const email=raw.includes('@')?raw:raw.toLowerCase()+'@tgu-admin.com';
  try{await signInWithEmailAndPassword(auth,email,$('#lPass').value)}
  catch(err){$('#lErr').style.color='';$('#lErr').textContent='로그인 실패: '+err.message}
});
$('#logout').addEventListener('click',async()=>{await signOut(auth);location.hash='';show('login')});

/* ---------- menu / routing ---------- */
function buildMenu(){
  let html='',grp='';
  MENU.forEach(k=>{
    const e=ENT[k];const label=e?e.label:(k==='dash'?'대시보드':'사이트 설정');const g=e?e.grp:(k==='dash'?'':'관리');
    if(g!==grp&&g){html+='<div class="grp">'+g+'</div>';grp=g}
    html+='<a data-v="'+k+'" href="#'+k+'"><span>'+esc(label)+'</span><span class="cnt" data-cnt="'+k+'" hidden></span></a>';
  });
  $('#menu').innerHTML=html;refreshCounts();
}
async function refreshCounts(){
  for(const k of Object.keys(ENT)){const e=ENT[k];if(!e.badge)continue;
    try{const c=(await getCountFromServer(query(collection(db,k),where(e.badge[0],'==',e.badge[1])))).data().count;
      const el=$('[data-cnt="'+k+'"]');if(el){el.textContent=c;el.hidden=!c}}catch(e2){}}
}
$('#menuBtn').addEventListener('click',()=>{$('#side').classList.toggle('open');$('#scrim').classList.toggle('open')});
$('#scrim').addEventListener('click',()=>{$('#side').classList.remove('open');$('#scrim').classList.remove('open')});
window.addEventListener('hashchange',()=>{if(!$('#app').hidden)go(location.hash.slice(1)||'dash')});
function go(v){
  if(v!=='dash'&&v!=='settings'&&!ENT[v])v='dash';
  $$('#menu a').forEach(a=>a.classList.toggle('on',a.dataset.v===v));
  $('#side').classList.remove('open');$('#scrim').classList.remove('open');
  $('#title').textContent=v==='dash'?'대시보드':v==='settings'?'사이트 설정':ENT[v].label;
  closeModal();
  if(v==='dash')return dashboard();
  if(v==='settings')return settings();
  return list(v);
}

/* ---------- list view ---------- */
function cell(row,c){
  const [k,,type,map]=c;const v=row[k];
  if(type==='dt')return esc(fmtDT(v));
  if(type==='map')return esc((map&&map[v])||v||'');
  if(type==='badge')return '<span class="badge b-'+esc(v)+'">'+esc((map&&map[v])||v||'')+'</span>';
  if(type==='bool')return v?'공개/예':'-';
  if(type==='img'){const s=row.image_data||row.image_url;return s?'<img class="th" src="'+esc(s)+'" alt="" loading="lazy">':''}
  const s=String(v==null?'':v);return esc(s.length>70?s.slice(0,70)+'...':s);
}
function cmp(a,b,key,asc){const x=a[key],y=b[key];const r=(x==null?1:y==null?-1:(typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y))));return asc?r:-r}
async function list(key){
  const e=ENT[key];const v=$('#view');
  v.innerHTML='<div class="toolbar"><input type="search" id="qs" placeholder="검색" value="'+esc(st.q[key]||'')+'">'
   +(e.filter?'<select id="fs"><option value="">전체</option>'+Object.entries(e.filter[1]).map(([k,l])=>'<option value="'+k+'"'+(st.f[key]===k?' selected':'')+'>'+esc(l)+'</option>').join('')+'</select>':'')
   +'<span class="sp"></span>'
   +(e.seed?'<button class="btn ghost" id="seedbtn" hidden>초기 데이터 불러오기</button>':'')
   +(e.bulk?'<select id="bcat">'+Object.entries(L.gcat).map(([k,l])=>'<option value="'+k+'">'+l+'</option>').join('')+'</select><label class="btn gold" style="margin:0;cursor:pointer">사진 여러 장 올리기<input type="file" id="bfile" accept="image/jpeg,image/png,image/webp" multiple hidden></label>':'')
   +(e.csv?'<button class="btn ghost" id="csv">CSV 내려받기</button>':'')
   +(e.kind==='content'?'<button class="btn primary" id="newbtn">+ 새로 만들기</button>':'')
   +'</div><div class="tbl-wrap"><table><thead><tr>'+e.cols.map(c=>'<th>'+c[1]+'</th>').join('')+'</tr></thead><tbody id="tb"><tr><td colspan="'+e.cols.length+'" class="empty">불러오는 중...</td></tr></tbody></table></div><div class="pager" id="pg"></div>';
  let t;$('#qs').addEventListener('input',ev=>{clearTimeout(t);t=setTimeout(()=>{st.q[key]=ev.target.value;st.page[key]=0;render()},250)});
  const fs=$('#fs');if(fs)fs.addEventListener('change',ev=>{st.f[key]=ev.target.value;st.page[key]=0;render()});
  const nb=$('#newbtn');if(nb)nb.addEventListener('click',()=>openContent(key,null));
  const cb=$('#csv');if(cb)cb.addEventListener('click',()=>exportCsv(key,cb));
  const bf=$('#bfile');if(bf)bf.addEventListener('change',()=>bulkUpload(bf.files,$('#bcat').value));
  const sb=$('#seedbtn');if(sb)sb.addEventListener('click',()=>seedCollection(key,sb));
  let all=[];
  try{all=await rows(key,true)}catch(err){$('#tb').innerHTML='<tr><td colspan="'+e.cols.length+'" class="empty">불러오기 실패: '+esc(err.message)+'</td></tr>';return}
  if(sb&&!all.length)sb.hidden=false;
  function render(){
    let r=all.slice();
    const f=st.f[key];if(e.filter&&f)r=r.filter(x=>x[e.filter[0]]===f);
    const q=(st.q[key]||'').trim().toLowerCase();
    if(q&&e.search)r=r.filter(x=>e.search.some(k=>String(x[k]||'').toLowerCase().includes(q)));
    r.sort((a,b)=>cmp(a,b,e.order[0],e.order[1]));
    const page=Math.min(st.page[key]||0,Math.max(0,Math.ceil(r.length/PAGE)-1));
    const cur=r.slice(page*PAGE,page*PAGE+PAGE);
    $('#tb').innerHTML=cur.length?cur.map((x,i)=>'<tr data-i="'+i+'">'+e.cols.map(c=>'<td>'+cell(x,c)+'</td>').join('')+'</tr>').join(''):'<tr><td colspan="'+e.cols.length+'" class="empty">데이터가 없습니다.</td></tr>';
    $$('#tb tr[data-i]').forEach(tr=>tr.addEventListener('click',()=>{const x=cur[+tr.dataset.i];e.kind==='inbox'?openInbox(key,x):openContent(key,x)}));
    const pages=Math.max(1,Math.ceil(r.length/PAGE));
    $('#pg').innerHTML='<button class="btn ghost sm" id="pp" '+(page<=0?'disabled':'')+'>이전</button><span class="muted">'+(page+1)+' / '+pages+' ('+r.length+'건)</span><button class="btn ghost sm" id="pn" '+(page+1>=pages?'disabled':'')+'>다음</button>';
    $('#pp').onclick=()=>{st.page[key]=page-1;render()};$('#pn').onclick=()=>{st.page[key]=page+1;render()};
  }
  render();
  window.__reload=async()=>{all=await rows(key,true);if(sb)sb.hidden=all.length>0;render()};
}
async function seedCollection(key,btn){
  if(!confirm('기본 데이터를 불러올까요? 현재 사이트에 표시 중인 내용이 DB로 들어갑니다.'))return;
  btn.disabled=true;
  try{
    const items=SEED[key];
    for(let i=0;i<items.length;i+=400){const b=writeBatch(db);items.slice(i,i+400).forEach(it=>b.set(doc(collection(db,key)),Object.assign({created_at:serverTimestamp()},it)));await b.commit()}
    toast(items.length+'건을 불러왔습니다.');window.__reload&&window.__reload();
  }catch(err){toast('실패: '+err.message,true)}finally{btn.disabled=false}
}

/* ---------- modal ---------- */
function openModal(title,html){$('#mTitle').textContent=title;$('#mBody').innerHTML=html;$('#modal').hidden=false;$('#modal .sheet').scrollTop=0}
function closeModal(){$('#modal').hidden=true;$('#mBody').innerHTML=''}
$('#mClose').addEventListener('click',closeModal);
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

/* ---------- inbox record ---------- */
function openInbox(key,row){
  const e=ENT[key];
  let h='<dl class="kv">'+e.detail.map(d=>{
    const [k,lab,type,map]=d;let v=row[k];
    if(type==='dt')v=fmtDT(v);else if(type==='map')v=(map&&map[v])||v;
    if(k==='email'&&v)return '<dt>'+lab+'</dt><dd><a href="mailto:'+esc(v)+'">'+esc(v)+'</a></dd>';
    return '<dt>'+lab+'</dt><dd>'+esc(v==null||v===''?'-':v)+'</dd>';
  }).join('')+'</dl>';
  const editKeys=Object.keys(e.edit);
  if(editKeys.length||e.note){
    h+='<div class="form-grid">';
    editKeys.forEach(k=>{const lab={status:'상태',payment_status:'납부 상태'}[k];h+='<label>'+lab+'<select data-f="'+k+'">'+Object.entries(e.edit[k]).map(([o,l])=>'<option value="'+o+'"'+(row[k]===o?' selected':'')+'>'+esc(l)+'</option>').join('')+'</select></label>'});
    if(e.note)h+='<label>관리자 메모 (공개되지 않음)<textarea data-f="admin_note" maxlength="5000">'+esc(row.admin_note||'')+'</textarea></label>';
    h+='</div>';
  }
  h+='<div class="actions">'+(editKeys.length||e.note?'<button class="btn primary" id="save">저장</button>':'')+(row.email&&key!=='subscribers'?'<a class="btn ghost" style="text-decoration:none" href="mailto:'+esc(row.email)+'">메일 보내기</a>':'')+'<span class="sp"></span><button class="btn danger" id="del">삭제</button></div>';
  openModal(e.label+' 상세',h);
  const sv=$('#save');if(sv)sv.addEventListener('click',async()=>{
    const patch={};$$('#mBody [data-f]').forEach(el=>{const v=el.value.trim();patch[el.dataset.f]=v===''?null:v});
    if(key==='inquiries'&&patch.status==='done'&&!row.replied_at)patch.replied_at=serverTimestamp();
    if(e.reviewedOn&&patch.status&&patch.status!=='received'&&!row.reviewed_at)patch.reviewed_at=serverTimestamp();
    sv.disabled=true;
    try{await updateDoc(doc(db,key,row.id),patch);toast('저장했습니다.');closeModal();window.__reload&&await window.__reload();refreshCounts()}
    catch(err){toast('저장 실패: '+err.message,true)}finally{sv.disabled=false}
  });
  $('#del').addEventListener('click',async()=>{
    if(!confirm('이 항목을 삭제할까요? 되돌릴 수 없습니다.'))return;
    try{await deleteDoc(doc(db,key,row.id));toast('삭제했습니다.');closeModal();window.__reload&&await window.__reload();refreshCounts()}
    catch(err){toast('삭제 실패: '+err.message,true)}
  });
}

/* ---------- image handling (stored as compressed data URL in Firestore; no Storage plan needed) ---------- */
async function compress(file,max,q=0.78){
  const bmp=await createImageBitmap(file,{imageOrientation:'from-image'});
  const s=Math.min(1,max/Math.max(bmp.width,bmp.height));
  const c=document.createElement('canvas');c.width=Math.round(bmp.width*s);c.height=Math.round(bmp.height*s);
  c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
  let url=c.toDataURL('image/jpeg',q);
  while(url.length>700000&&q>0.35){q-=0.1;url=c.toDataURL('image/jpeg',q)}
  if(url.length>900000)throw new Error('사진이 너무 큽니다. 더 작은 사진을 사용하세요.');
  return url;
}
async function bulkUpload(files,category){
  files=[...files];if(!files.length)return;
  const cur=await rows('gallery_items',true);let n=cur.reduce((m,x)=>Math.max(m,x.sort_order||0),0);let ok=0;
  for(let i=0;i<files.length;i++){
    toast('업로드 중 '+(i+1)+' / '+files.length);
    try{
      const data=await compress(files[i],1000);
      await addDoc(collection(db,'gallery_items'),{title:files[i].name.replace(/\.[^.]+$/,'').slice(0,150),category,image_data:data,sort_order:++n,is_published:true,created_at:serverTimestamp()});ok++;
    }catch(err){toast('실패: '+files[i].name+' ('+err.message+')',true);await new Promise(r=>setTimeout(r,1500))}
  }
  toast(ok+'장 업로드 완료');window.__reload&&window.__reload();
}

/* ---------- content editor ---------- */
function fieldHtml(f,val,row){
  const [k,lab,type,a]=f;const v=val==null?'':val;
  if(type==='checkbox')return '<label class="chk"><input type="checkbox" data-k="'+k+'"'+(val?' checked':'')+'>'+lab+'</label>';
  if(type==='textarea')return '<label>'+lab+'<textarea data-k="'+k+'" rows="'+(a||5)+'">'+esc(v)+'</textarea></label>';
  if(type==='select')return '<label>'+lab+'<select data-k="'+k+'">'+Object.entries(a).map(([o,l])=>'<option value="'+o+'"'+(v===o?' selected':'')+'>'+esc(l)+'</option>').join('')+'</select></label>';
  if(type==='datetime')return '<label>'+lab+'<input type="datetime-local" data-k="'+k+'" value="'+esc(toLocalInput(v||new Date().toISOString()))+'"></label>';
  if(type==='image'){const cur=(row&&(row[a]||row.image_url||row.photo_url))||'';return '<label>'+lab+'<input type="file" data-img="'+k+'" accept="image/jpeg,image/png,image/webp"></label><p class="hint">선택한 사진은 자동으로 줄여서 저장됩니다.</p><img class="preview" data-prev="'+k+'" '+(cur?'src="'+esc(cur)+'"':'hidden')+' alt="">'}
  return '<label>'+lab+'<input type="'+(type==='number'?'number':type==='date'?'date':type==='url'?'url':'text')+'" data-k="'+k+'" value="'+esc(type==='date'?fmtD(v):v)+'"></label>';
}
function openContent(key,row){
  const e=ENT[key];const isNew=!row;const base=Object.assign({},e.defaults||{},row||{});
  const h='<div class="form-grid">'+e.fields.map(f=>fieldHtml(f,f[2]==='image'?null:base[f[0]],row)).join('')+'</div><div class="actions"><button class="btn primary" id="save">'+(isNew?'등록':'저장')+'</button><span class="sp"></span>'+(isNew?'':'<button class="btn danger" id="del">삭제</button>')+'</div>';
  openModal(e.label+(isNew?' 새로 만들기':' 수정'),h);
  const pending={};
  $$('[data-img]').forEach(inp=>inp.addEventListener('change',()=>{
    const f=inp.files[0];if(!f)return;pending[inp.dataset.img]=f;
    const pv=$('[data-prev="'+inp.dataset.img+'"]');pv.src=URL.createObjectURL(f);pv.hidden=false;
  }));
  $('#save').addEventListener('click',async()=>{
    const btn=$('#save');const o={};
    $$('#mBody [data-k]').forEach(el=>{
      const k=el.dataset.k;
      if(el.type==='checkbox')o[k]=el.checked;
      else if(el.type==='datetime-local')o[k]=el.value?Timestamp.fromDate(new Date(el.value)):null;
      else{let v=el.value.trim();if(v==='')v=null;else if(el.type==='number')v=Number(v);o[k]=v}
    });
    try{
      btn.disabled=true;
      for(const f of e.fields){if(f[2]!=='image')continue;
        const file=pending[f[0]];
        if(file){toast('사진 처리 중...');o[f[3]]=await compress(file,f[4])}}
      if(key==='gallery_items'&&isNew&&!o.image_data)throw new Error('사진을 선택하세요.');
      if(key==='faculty'&&!o.name)throw new Error('이름을 입력하세요.');
      if(key!=='faculty'&&e.fields.some(f=>f[0]==='title')&&!o.title)throw new Error('제목을 입력하세요.');
      if(key==='events'&&!o.start_date)throw new Error('시작일을 입력하세요.');
      if(isNew)await addDoc(collection(db,key),Object.assign({created_at:serverTimestamp()},o));
      else await updateDoc(doc(db,key,row.id),o);
      toast('저장했습니다.');closeModal();window.__reload&&await window.__reload();
    }catch(err){toast('저장 실패: '+err.message,true)}finally{btn.disabled=false}
  });
  const d=$('#del');if(d)d.addEventListener('click',async()=>{
    if(!confirm('삭제할까요? 되돌릴 수 없습니다.'))return;
    try{await deleteDoc(doc(db,key,row.id));toast('삭제했습니다.');closeModal();window.__reload&&await window.__reload()}
    catch(err){toast('삭제 실패: '+err.message,true)}
  });
}

/* ---------- CSV ---------- */
async function exportCsv(key,btn){
  btn.disabled=true;toast('내려받는 중...');
  try{
    const r=(await rows(key,true)).sort((a,b)=>cmp(a,b,ENT[key].order[0],ENT[key].order[1]));
    if(!r.length){toast('내려받을 데이터가 없습니다.',true);return}
    const keys=[...new Set(r.flatMap(x=>Object.keys(x)))];
    const q=v=>{let s=Array.isArray(v)?v.join(' | '):(v==null?'':String(v));if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
    const csv='\ufeff'+[keys.join(',')].concat(r.map(x=>keys.map(k=>q(x[k])).join(','))).join('\r\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='tgu_'+key+'_'+new Date().toISOString().slice(0,10)+'.csv';a.click();
    toast(r.length+'건 내려받음');
  }catch(err){toast('실패: '+err.message,true)}finally{btn.disabled=false}
}

/* ---------- dashboard ---------- */
async function dashboard(){
  const v=$('#view');v.innerHTML='<p class="muted">불러오는 중...</p>';
  const [inq,app,reg,subs,posts,gal,crs]=await Promise.all(['inquiries','admission_applications','course_registrations','subscribers','posts','gallery_items','courses'].map(k=>rows(k,true).catch(()=>[])));
  const cards=[['inquiries',inq.filter(x=>x.status==='new').length,'신규 문의'],['admission_applications',app.filter(x=>x.status==='received').length,'신규 입학지원'],['course_registrations',reg.filter(x=>x.status==='pending').length,'대기 중 강의신청'],['courses',crs.filter(x=>x.status==='open').length,'모집 중 강의'],['posts',posts.filter(x=>x.is_published).length,'공개 게시글'],['gallery_items',gal.filter(x=>x.is_published).length,'공개 사진'],['subscribers',subs.length,'구독자']];
  const since=new Date(Date.now()-29*864e5);since.setHours(0,0,0,0);
  const bins=Array(30).fill(0);[...inq,...app,...reg].forEach(r=>{const i=Math.floor((new Date(r.created_at)-since)/864e5);if(i>=0&&i<30)bins[i]++});const mx=Math.max(1,...bins);
  const rec=a=>a.slice().sort((x,y)=>String(y.created_at).localeCompare(String(x.created_at))).slice(0,5);
  v.innerHTML='<div class="cards">'+cards.map(c=>'<div class="card" data-go="'+c[0]+'"><b>'+c[1]+'</b><span>'+c[2]+'</span></div>').join('')+'</div>'
   +'<div class="panel"><h3>최근 30일 접수 (문의 + 입학지원 + 강의신청)</h3><div class="bars">'+bins.map(n=>'<i class="'+(n?'':'z')+'" style="height:'+Math.max(3,n/mx*100)+'%" title="'+n+'건"></i>').join('')+'</div></div>'
   +'<div class="grid2"><div class="panel"><h3>최근 문의</h3><ul class="list">'+(rec(inq).map(r=>'<li data-go="inquiries"><span>'+esc(r.name)+' - '+esc(r.subject)+'</span><span class="badge b-'+r.status+'">'+esc(L.inqSt[r.status])+'</span></li>').join('')||'<li class="muted">없음</li>')+'</ul></div>'
   +'<div class="panel"><h3>최근 입학지원</h3><ul class="list">'+(rec(app).map(r=>'<li data-go="admission_applications"><span>'+esc(r.full_name)+' - '+esc(L.prog[r.program]||r.program)+'</span><span class="badge b-'+r.status+'">'+esc(L.appSt[r.status])+'</span></li>').join('')||'<li class="muted">없음</li>')+'</ul></div></div>'
   +'<div class="panel"><h3>최근 강의신청</h3><ul class="list">'+(rec(reg).map(r=>'<li data-go="course_registrations"><span>'+esc(r.name)+' - '+esc(r.course_title||'기타')+'</span><span class="badge b-'+r.status+'">'+esc(L.regSt[r.status])+'</span></li>').join('')||'<li class="muted">없음</li>')+'</ul></div>';
  $$('[data-go]').forEach(el=>el.addEventListener('click',()=>{location.hash=el.dataset.go}));
}

/* ---------- settings ---------- */
async function settings(){
  const v=$('#view');v.innerHTML='<p class="muted">불러오는 중...</p>';
  let S={};
  try{(await getDocs(collection(db,'site_settings'))).docs.forEach(d=>S[d.id]=d.data())}catch(err){v.innerHTML='<p class="err">불러오기 실패: '+esc(err.message)+'</p>';return}
  const b=S.site_banner||{},c=S.contact||{},a=S.admissions||{};
  v.innerHTML='<div class="panel"><h3>공지 배너 (모든 페이지 하단)</h3><div class="form-grid"><label class="chk"><input type="checkbox" id="b_active"'+(b.active?' checked':'')+'>배너 표시</label><label>문구<input id="b_text" maxlength="200" value="'+esc(b.text||'')+'"></label><label>링크(선택, https://... 또는 board.html)<input id="b_link" maxlength="300" value="'+esc(b.link||'')+'"></label></div><div class="actions"><button class="btn primary" data-save="site_banner">저장</button></div></div>'
   +'<div class="panel"><h3>입학 접수</h3><div class="form-grid"><label class="chk"><input type="checkbox" id="a_open"'+(a.open!==false?' checked':'')+'>입학지원 접수 중</label><label>현재 모집 학기(예: Spring 2027)<input id="a_term" maxlength="100" value="'+esc(a.term||'')+'"></label><label>접수 마감 시 안내 문구<input id="a_msg" maxlength="300" value="'+esc(a.message||'')+'"></label></div><div class="actions"><button class="btn primary" data-save="admissions">저장</button></div></div>'
   +'<div class="panel"><h3>연락처 정보</h3><div class="form-grid"><label>주소<input id="c_addr" maxlength="300" value="'+esc(c.address||'')+'"></label><div class="r2"><label>전화<input id="c_tel" maxlength="100" value="'+esc(c.tel||'')+'"></label><label>대표 이메일<input id="c_mail" maxlength="200" value="'+esc(c.email||'')+'"></label></div></div><div class="actions"><button class="btn primary" data-save="contact">저장</button></div></div>'
   +'<div class="panel"><h3>관리자 계정</h3><p>현재 로그인: <b>'+esc(me)+'</b></p><p class="hint">관리자 이메일은 보안을 위해 Firestore 규칙(firebase/firestore.rules)의 isAdmin 함수에서만 관리합니다. 추가하려면 Firebase 콘솔, Firestore, 규칙에서 이메일 목록을 수정하고 게시하세요.</p></div>';
  $$('[data-save]').forEach(btn=>btn.addEventListener('click',async()=>{
    const k=btn.dataset.save;let val;
    if(k==='site_banner')val={active:$('#b_active').checked,text:$('#b_text').value.trim(),link:$('#b_link').value.trim()};
    if(k==='admissions')val={open:$('#a_open').checked,term:$('#a_term').value.trim(),message:$('#a_msg').value.trim()};
    if(k==='contact')val={address:$('#c_addr').value.trim(),tel:$('#c_tel').value.trim(),email:$('#c_mail').value.trim()};
    btn.disabled=true;
    try{await setDoc(doc(db,'site_settings',k),val);toast('저장했습니다.')}catch(err){toast('저장 실패: '+err.message,true)}finally{btn.disabled=false}
  }));
}
}
