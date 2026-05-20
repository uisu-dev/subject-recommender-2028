# 통계 시스템 설정 가이드 (Upstash Redis)

사이트 상단의 통계 카드(오늘 방문 N명 · 인기 대학 · 인기 학과)를 활성화하려면 Upstash Redis를 연결해야 합니다.

연결 안 해도 사이트 자체는 정상 동작합니다. 통계 카드만 표시되지 않을 뿐.

## 작동 원리

```
브라우저(누구나) → /api/track     → Vercel 서버 → Upstash Redis (저장)
브라우저(누구나) → /api/stats     ← Vercel 서버 ← Upstash Redis (집계)
                ↓
            사이트 상단 통계 카드에 표시
```

요청은 항상 **우리 도메인(대학가자.kr)으로만** 가기 때문에, 학교 네트워크 DNS 차단의 영향을 받지 않습니다.

## 1단계 · Vercel 통합으로 Upstash 추가 (가장 쉬움)

Vercel은 Upstash와 통합되어 있어, 클릭 몇 번에 데이터베이스 + 환경변수까지 자동 설정됩니다.

1. https://vercel.com/dashboard 접속 → `subject-recommender-2028` 프로젝트
2. 상단 탭에서 **Storage** 클릭
3. **"Create Database"** 또는 **"Connect Store"** 클릭
4. **Marketplace Database Providers** 섹션 → **Upstash** → **Continue**
5. **Redis** 선택 → **Continue**
6. 옵션 입력:
   - **Database Name**: `subject-recommender-stats` (자유)
   - **Primary Region**: **Asia Pacific (Tokyo)** 또는 **Asia Pacific (Seoul)** 가까운 곳
   - **Eviction**: `noeviction` (기본값)
   - **Plan**: **Free** (월 500K 명령, 256MB 저장 — 학교 상담 도구엔 충분)
7. **Create** 클릭
8. 다음 화면에서 **"Connect to Project"** → `subject-recommender-2028` 선택 → **Connect**
9. Vercel이 자동으로 환경변수 4개를 등록합니다:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `KV_REST_API_URL` (호환용 별칭)
   - `KV_REST_API_TOKEN` (호환용 별칭)

## 2단계 · 재배포

환경변수 추가만으로 적용되지 않습니다. 재배포 필요.

- **Deployments** 탭 → 최신 항목 우측 `⋯` → **Redeploy**
- 또는 다음 git push 시 자동 적용

1~2분 뒤 사이트 새로고침 → 헤더 아래에 통계 카드가 나타나면 성공.

## 작동 확인

새로고침 직후:
```
📊 통계 수집 중… 첫 방문자가 되어주세요.
```

방문이 1회 이상 쌓이면:
```
📊 오늘 1명 (누적 1)
```

학과 출력 버튼을 한 번 누른 후:
```
📊 오늘 1명 (누적 1)  🏫 인기 대학 서울대(1)  📚 인기 학과 컴퓨터공학과(1)
```

## 무엇이 추적되나

| 이벤트 | 데이터 | 키 |
|---|---|---|
| 페이지 방문 | 방문자 UUID (localStorage) → 하루 1회만 카운트 | `visitors:YYYY-MM-DD` (48시간 후 자동 만료) |
| 학과 출력 클릭 | 대학명·학과명 | `clicks:univ`, `clicks:dept` (Sorted Set) |
| 비교 인쇄 클릭 | 카트 안의 모든 학과 | 위와 동일 |

| 저장하지 않는 것 | 이유 |
|---|---|
| IP 주소 | 개인정보 |
| 쿠키 | localStorage 익명 UUID로 대체 |
| 검색어·체크한 과목·필터 조건 | 개인 상담 정보 |
| 학생 이름·학교명 (PDF 헤더 입력값) | 개인정보 |

## 비용

Upstash 무료 플랜:
- 월 500,000 명령 (CRUD 합산)
- 256MB 저장
- 글로벌 복제 1개

학교 상담 도구는 명령 수가 매우 적음:
- 방문 1회당 약 2~3 명령
- 출력 1회당 약 2~4 명령
- 일평균 1,000 명령 잡아도 월 30,000 → 무료 한도의 6%

**평생 무료로 운영 가능합니다.**

## 데이터 리셋

특정 시점에 통계를 초기화하려면 Upstash 콘솔에서:

1. https://console.upstash.com 접속 → 데이터베이스 선택
2. **CLI** 또는 **Data Browser** 탭
3. 명령 실행:
   ```
   DEL clicks:univ
   DEL clicks:dept
   DEL total:visits
   DEL total:clicks
   ```
   (방문자 일별 키는 48시간 후 자동 만료되므로 따로 지울 필요 없음)

## 문제 발생 시

| 증상 | 원인 / 대응 |
|---|---|
| 통계 카드가 안 보임 | 환경변수 미적용 → 재배포 필요 |
| "통계 수집 중…" 만 표시되고 안 바뀜 | 방문 1회로는 카운트가 1. 다른 PC로 한 번 더 들어가 보세요 |
| 인기 학과가 안 늘어남 | 출력 버튼을 눌러야 카운트 (단순 검색은 카운트 안 함) |
| 클릭 수가 너무 빠르게 늘어남 (어뷰징?) | 동일 학과 반복 클릭도 카운트됨. 운영 중 문제 시 알려주세요 — 학과당 일 1회 제한 등 적용 가능 |
