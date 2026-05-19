# 2028 권장과목 검색

2028학년도 대학별·계열별 권장과목(반영과목)을 검색하고, 상담용 PDF/인쇄로 출력하는 정적 웹사이트입니다.

## 데이터 출처

- `data/file2.json` — 2028학년도 권역별 대학별 권장과목(반영과목)

원본 엑셀에서 추출하여 JSON으로 변환했습니다. 데이터 갱신 시 `data/file2.json`을 교체하면 됩니다.

## 기능

- **대학 / 학과별 검색**: 49개 대학, 1,300+ 모집단위 (대학명·학과명·단과대 자유 검색)
- **과목 이수 기반 검색**: 학생이 이수한 과목을 체크하면 핵심과목 요건이 충족되는 학과를 우선 정렬
- **고등학교 개설 과목 설정**: 학교별 개설 과목을 등록하면 그 학교 학생에게는 개설 과목만 노출. Supabase 연동 시 모든 사용자에게 실시간 공유 (설정은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참조)
- **권역·지역 필터**: 수도권/중부권/영남권/호남권
- **비교 카트**: 최대 4개 학과를 선택해 A4 가로 한 페이지에 비교 인쇄
- **PDF 미리보기 & 인쇄**: A4 양식 미리보기 후 브라우저 인쇄 다이얼로그에서 PDF 저장 또는 프린트
- **PDF 헤더 입력**: 학교명·상담교사·학생명을 PDF 상단에 표시 (학교명·상담교사는 localStorage 저장)

## 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000 (포트 사용 중이면 3001 등 자동 할당)
```

## 빌드

```bash
npm run build
npm start
```

## 배포 (Vercel)

1. 이 저장소를 GitHub에 푸시
2. [vercel.com](https://vercel.com) 로그인 → New Project → 저장소 선택
3. Framework Preset: `Next.js` (자동 감지)
4. 추가 설정 없이 Deploy

빌드 출력은 정적 페이지로 prerender되므로 별도 환경변수 설정 불필요.

## 기술 스택

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3
- 데이터: JSON 정적 임포트 (런타임 API 없음)

## 디렉터리 구조

```
app/
  layout.tsx           — 루트 레이아웃
  page.tsx             — 메인 검색 페이지
  globals.css          — Tailwind + 인쇄용 @media print 규칙
components/
  SearchBox.tsx        — 검색 입력
  FilterChips.tsx      — 권역/지역 필터
  UnivDeptResults.tsx  — 대학·학과별 결과
  SubjectSearch.tsx    — 과목 이수 기반 역검색
  CartBar.tsx          — 비교 카트 (하단 고정)
  PrintPreview.tsx     — PDF 미리보기 + 인쇄 + 비교 인쇄
lib/
  data.ts              — JSON 로드 및 인덱스
  types.ts             — 타입 정의
  subjects.ts          — 과목 어휘/파서/매칭 로직
data/
  file2.json           — 대학별 권장과목 데이터
```
