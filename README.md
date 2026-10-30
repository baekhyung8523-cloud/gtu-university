# Trinity Global University (TGU) 홈페이지 + 관리자 (Firebase)

정적 사이트(HTML, CSS, JS)에 Firebase(Firestore + Auth)를 붙인 구조입니다. 서버 코드는 없고 GitHub Pages로 배포합니다.

## 연결 상태
- Firebase 프로젝트: bible-school-os-miracle (BibleSchoolOS, Spark 무료 요금제, Firestore 서울 asia-northeast3)
- Authentication: Google 로그인 사용 설정 완료
- Firestore 보안 규칙: firebase/firestore.rules (게시 완료)
- 웹 설정값: js/config.js (공개용 식별자이며 보안은 규칙이 담당)

## 페이지
- 공개: index, about, president, programs, board(게시판), gallery, contact(문의 폼), apply(입학지원, 강의신청)
- 관리자: admin.html (Google 로그인 또는 이메일 로그인)

## 언어 (한국어 / English)
- 헤더 오른쪽의 "한국어 | EN" 버튼으로 전환합니다. 선택은 브라우저에 저장되고, 처음 방문 시에는 브라우저 언어(한국어면 한국어)를 따릅니다.
- 영어 문장이 원본이고 한국어는 js/i18n-ko.js 사전에서 적용됩니다. 문구를 고치려면 이 파일에서 같은 영어 문장의 한국어 값을 수정하세요.
- 관리자가 입력하는 게시글, 강의명, 교수 정보 등 DB 내용은 입력한 언어 그대로 표시됩니다(번역되지 않음).

## 관리자 기능
대시보드, 문의, 입학지원(상태 변경, 메모, CSV), 강의신청(확정, 납부 상태, CSV), 구독자, 게시판 글쓰기, 갤러리(사진 여러 장 업로드), 강의 개설 관리, 학사 일정, 교수진, 사이트 설정(공지 배너, 입학 접수 열기/닫기, 연락처)

## 관리자 로그인
- ID 로그인: 로그인 화면에 `admin` 과 비밀번호를 입력합니다(내부적으로 admin@tgu-admin.com 계정). 계정은 Firebase 콘솔, Authentication, 사용자, 사용자 추가에서 직접 만듭니다.
- Google 로그인: backhung8523@gmail.com
- 신규 가입 허용이 켜져 있으므로 admin 계정을 만들기 전까지 다른 사람이 같은 이메일로 먼저 가입할 수 있습니다. 반드시 계정을 바로 만드세요.

## 처음 한 번만 할 일
1. GitHub Pages 주소가 정해지면 Firebase 콘솔 Authentication, 설정, 승인된 도메인에 `계정명.github.io`를 추가합니다. (없으면 관리자 Google 로그인이 막힙니다)
2. admin.html에 backhung8523@gmail.com(Google 계정)으로 로그인합니다.
3. 교수진, 갤러리, 강의 관리 화면에서 "초기 데이터 불러오기"를 한 번씩 누르면 현재 사이트 내용이 DB로 들어가 이후 관리자 화면에서 수정할 수 있습니다.
4. (권장) Google Cloud 콘솔, API 및 서비스, 사용자 인증 정보에서 위 API 키의 HTTP 리퍼러를 사이트 주소로 제한합니다.

## 관리자 이메일 변경
firebase/firestore.rules 의 isAdmin() 이메일 목록을 수정한 뒤 Firebase 콘솔, Firestore, 규칙에 붙여넣고 게시합니다. 현재 목록: backhung8523@gmail.com, backhung65@gmail.com

## 제한 사항 (무료 요금제)
- Firebase Storage는 유료(Blaze) 요금제가 필요해 사용하지 않습니다. 갤러리 사진은 브라우저에서 줄여서(긴 변 1000px) Firestore에 저장합니다. 사진 1장은 약 900KB 이하여야 합니다.
- 입학지원 서류 파일 업로드는 없습니다. 접수 후 입학처가 이메일로 서류를 받습니다.
- 스팸 방지는 규칙 검증, 숨은 입력칸(honeypot), 최소 입력 시간으로 처리합니다. 접수 횟수 제한은 Firestore 규칙으로 할 수 없어서, 스팸이 늘면 Firebase App Check(reCAPTCHA)를 추가하세요.
- 방문자가 제출한 데이터는 관리자만 읽을 수 있습니다. 방문자는 자신의 제출 내용을 다시 볼 수 없습니다.

## 배포
이 폴더 안의 내용을 저장소 루트에 올리고 Settings, Pages, Branch main, / (root)로 설정합니다.
