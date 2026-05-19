# 2028 권장과목 검색

2028학년도 대학별·계열별 권장과목(반영과목)을 검색하고, 상담용 PDF/인쇄로 출력하는 정적 웹사이트입니다.

## 데이터 출처

- `data/file2.json` — 2028학년도 권역별 대학별 권장과목(반영과목)
- `data/file1.json` — 2028학년도 계열별 대표 모집단위별 반영과목(권장과목)

원본 엑셀에서 추출하여 JSON으로 변환했습니다. 데이터 갱신 시 `data/` 내 JSON을 교체하면 됩니다.

## 기능

- **대학·학과 검색**: 47개 대학, 1,300+ 모집단위
- **권역·지역 필터**: 수도권/중부권/영남권/호남권
- **두 탭 결과 보기**:
  - 대학별 — 핵심과목 / 권장과목 / 비고
  - 계열·모집단위별 — 과목 영역(국어·수학·영어·사회·과학·기타) × 권장 대학 매트릭스
- **PDF 미리보기 & 인쇄**: 상담 결과를 A4 양식으로 미리 본 뒤 브라우저 인쇄 다이얼로그에서 PDF 저장 또는 프린트 출력 가능

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
  UnivDeptResults.tsx  — 대학별 결과
  MajorResults.tsx     — 계열별 결과
  PrintPreview.tsx     — PDF 미리보기 모달 + 인쇄 트리거
lib/
  data.ts              — JSON 로드 및 인덱스
  types.ts             — 타입 정의
data/
  file1.json           — 계열별 데이터
  file2.json           — 대학별 데이터
```
