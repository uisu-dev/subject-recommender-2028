# 2028 권장과목 검색

2028학년도 대학별·계열별 권장과목(반영과목)을 검색하고, 상담용 PDF/인쇄로 출력하는 정적 웹사이트입니다.

## 데이터 출처

- `data/file2.json` — 2028학년도 권역별 대학별 권장과목(반영과목)
- `data/schools.json` — 등록된 고등학교 + 개설 과목 (관리자 수동 큐레이션)

원본 엑셀에서 추출하여 JSON으로 변환했습니다. 데이터 갱신 시 `data/file2.json`을 교체하면 됩니다.

### 학교 추가/수정 (관리자용)

두 가지 방법:

**A. 관리자 모드 (권장)** — [ADMIN_SETUP.md](./ADMIN_SETUP.md) 참조
- 사이트에서 직접 로그인 → 학교 추가/편집/삭제 UI 사용
- 저장 시 GitHub에 자동 커밋, Vercel 재배포

**B. JSON 직접 편집 (백업 수단)**
- `data/schools.json`을 GitHub 웹 또는 로컬에서 편집
- `offeredSubjects` 값은 `lib/subjects.ts`의 캐노니컬 과목명과 정확히 일치해야 함 (예: "확률과 통계", "미적분Ⅰ")
- commit + push → Vercel 자동 재배포

## 기능

- **대학 / 학과별 검색**: 49개 대학, 1,300+ 모집단위 (대학명·학과명·단과대 자유 검색)
- **과목 이수 기반 검색**: 학생이 이수한 과목을 체크하면 핵심과목 요건이 충족되는 학과를 우선 정렬
- **고등학교 개설 과목 필터**: 학교를 선택하면 그 학교에서 개설된 과목만 사이드바에 노출. 학교 목록은 `data/schools.json`에서 중앙 관리 (등록 요청은 uisu@kakao.com)
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
  schools.json         — 등록된 고등학교 + 개설 과목
```
