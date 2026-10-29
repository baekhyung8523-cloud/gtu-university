# Trinity Global University (TGU) 홈페이지 시안

CIU(Columbia International University) 스타일 레퍼런스로 만든 정적 사이트입니다. 빌드 도구 없이 HTML/CSS/JS만 사용합니다.

## 구조
- index.html : 홈 (히어로, TGU란?, 총장 인사 요약, 갤러리 미리보기)
- about.html : TGU 소개 (TGU란? / 어떤 대학인가 / 연혁 / 조직 / 교수진 / 이사회)
- president.html : 총장 인사
- programs.html : 프로그램 (MA, 박사, 졸업 논문, 명예박사)
- gallery.html : 갤러리 (필터, 라이트박스)
- contact.html : 연락처
- css/style.css, js/main.js, images/ (사진은 가로 1600px 이하로 축소됨)

## 반응형 지원
- 폭 320px(소형 폰) ~ 1920px(대형 모니터)까지 가로 넘침 없음 확인
- 1100px 이하: 상단 메뉴가 햄버거 메뉴로 전환 (태블릿 가로·세로 포함)
- 980px 이하(태블릿): 카드/표/인물 2열, 소개·총장 인사 1열
- 720px 이하(폰): 1열, 표는 카드형으로 변환, 버튼 세로 배치, 갤러리 2열, 라이트박스 버튼 하단 배치
- 터치 기기: 갤러리 설명 상시 표시, 버튼 최소 44px, 노치 기기 safe-area 대응, 모션 줄이기 설정 존중

## GitHub Pages 배포
1. 이 폴더(tgu-site) 안의 내용을 저장소 루트에 올립니다.
2. 저장소 Settings > Pages > Branch: main, / (root) 선택.
3. 몇 분 뒤 https://<계정>.github.io/<저장소>/ 에서 확인합니다.
(.nojekyll 파일이 포함되어 있습니다.)

## 의뢰인에게 확인할 내용
1. 총장 사진: 총장.png(녹색 넥타이, 안경 없음)와 교수 1.png(가운, 안경)가 서로 다른 사람처럼 보입니다. 현재는 총장.png를 사용했습니다. 해상도가 낮아 화질이 거칩니다.
2. 명예박사 수여일이 영문본과 한글 참고본이 다릅니다. 영문본 기준으로 게시했습니다.
   - 이건영, 손신철, 박삼열: 영문 2022.3.11 / 한글 2021.12.14
   - 유병국: 영문에 2023.10.13과 2024.3.8 두 번 등장(2024.3.8만 게시)
   - 박성옥 박사 학위: 영문 Doctor of World Mission / 한글 D.Ed
3. 교수진 표의 "President of TGA"는 TGU로 바꿨습니다. TGA(Trinity Global Academy)와 TGU의 관계를 확인해야 합니다. MA 과정 설명의 "TGA confers the MA degree"는 원문 그대로입니다.
4. 이사회의 Kim, Yeon-Taek(International Chancellor of CCGU)과 교수진의 Dr. John Y. Kim(같은 직책)이 같은 사람인지 확인이 필요합니다.
5. 영문 오타는 교정해서 반영했습니다(Theological, Distinguished, National, Administration, Liturgics, Character 등). 중복된 Dr. Yu Sung-Joon은 한 번만 넣었습니다.
6. 행정 담당자 이메일과 휴대전화는 개인정보라 사이트에 넣지 않았습니다. 대표 전화(032-568-1560~1)만 게시했습니다.
7. "Master Program graduates on October 18th 2026" 항목은 내용이 비어 있어 제외했습니다.
8. 연혁은 제공된 자료(현수막, 수여일 목록)에서 확인되는 날짜만 넣었습니다. 추가 연혁이 있으면 about.html에 넣을 수 있습니다.
9. 갤러리 사진 캡션은 사진에서 확인되는 내용만 썼습니다(2020.9.13 개원예배, 2022.9.19-23 행사). 나머지는 일반 설명입니다.
