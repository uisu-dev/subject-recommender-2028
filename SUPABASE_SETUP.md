# Supabase 연동 안내

이 사이트의 **고등학교 개설 과목 설정**을 모든 사용자가 실시간 공유하려면 Supabase를 연결해야 합니다.
연결 안 해도 사이트는 정상 동작합니다 (학교 설정이 본인 브라우저에만 저장될 뿐).

## 1단계 · Supabase 프로젝트 만들기

1. https://supabase.com 접속 → **Start your project** → GitHub 로그인
2. **New project** 클릭
   - **Name**: 자유롭게 (예: `subject-recommender`)
   - **Database Password**: 강력한 비밀번호 생성 (잊지 말고 어딘가 저장)
   - **Region**: `Northeast Asia (Seoul)` (한국에서 가장 빠름)
   - **Pricing Plan**: `Free` (무료 한도: DB 500MB, 월 5GB 전송 — 충분)
3. **Create new project** → 1~2분 대기

## 2단계 · 데이터베이스 테이블 만들기

프로젝트가 만들어지면 좌측 메뉴에서 **SQL Editor** (또는 `</>` 아이콘) 클릭 →
**+ New query** → 아래 SQL 통째로 복사·붙여넣기 → **Run** 클릭.

```sql
-- 1. schools 테이블 생성
create table public.schools (
  id text primary key,
  name text not null,
  offered_subjects jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Row Level Security 활성화
alter table public.schools enable row level security;

-- 3. 익명(로그인 안 한) 사용자에게 읽기/쓰기 모두 허용
create policy "Anyone can read schools"
  on public.schools for select to anon using (true);

create policy "Anyone can insert schools"
  on public.schools for insert to anon with check (true);

create policy "Anyone can update schools"
  on public.schools for update to anon using (true) with check (true);

create policy "Anyone can delete schools"
  on public.schools for delete to anon using (true);

-- 4. 실시간 변경 알림 활성화
alter publication supabase_realtime add table public.schools;
```

`Success. No rows returned` 메시지가 나오면 성공.

> ⚠️ 위 정책은 누구나 추가·수정·삭제 가능한 공개 모드입니다. 학생들이 장난칠 가능성이
> 있으니, 운영 중 문제가 생기면 비밀번호 보호로 전환해주세요 (요청 시 작업 가능).

## 3단계 · 환경변수 두 개 복사

좌측 메뉴에서 **Project Settings** (톱니바퀴) → **API**

다음 두 값을 메모해두세요:

- **Project URL** — `https://xxxxxxxx.supabase.co` 형태
- **anon public** API 키 — `eyJh...` 로 시작하는 긴 문자열

> 🔒 `anon` 키는 공개 가능합니다 (브라우저에 노출되어도 안전). `service_role` 키는 **절대 공개 금지**.

## 4단계 · Vercel에 환경변수 등록

1. https://vercel.com/dashboard 접속 → `subject-recommender-2028` 프로젝트 클릭
2. **Settings** → **Environment Variables**
3. 두 개를 차례로 추가:

| Name | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (2단계의 Project URL) | Production, Preview, Development 모두 체크 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (2단계의 anon public 키) | Production, Preview, Development 모두 체크 |

각각 **Save** 클릭.

## 5단계 · 재배포

환경변수만 추가했다고 자동 적용되지 않습니다. 다시 빌드해야 합니다:

- **방법 A**: 새 커밋을 푸시 (자동 재배포)
- **방법 B**: Vercel 대시보드 → **Deployments** → 최신 배포 우측 `⋯` → **Redeploy**

## 6단계 · 확인

배포 완료 후 사이트 접속:

- 헤더의 "고등학교" 카드 옆에 **녹색 배지 "실시간 공유"** 가 보이면 성공
- 회색 "로컬" 배지가 보이면 환경변수가 적용 안 된 것 — 위 단계 재확인

## 7단계 · 로컬에 있던 학교 데이터 옮기기 (선택)

이전에 본인 브라우저에 학교를 설정해놨다면:

1. **설정** 버튼 클릭 → 모달 열기
2. 상단에 노란색 **"로컬 학교 올리기"** 버튼이 보이면 클릭
3. 그 학교들이 클라우드로 업로드되고 모든 사용자에게 보임

> 로컬 학교 올리기 버튼은 클라우드에 없는 로컬 학교가 있을 때만 표시됩니다.

## 운영 시 알아둘 것

- **자동 백업**: Supabase 무료 플랜은 매일 자동 백업, 7일 보관
- **사용량 확인**: 대시보드 → Reports에서 DB 크기·요청 수 확인
- **무료 한도**: 500MB DB / 월 5GB 전송 — 학교 정보 정도는 평생 못 채움 (1MB도 안 씀)
- **문제 발생 시**: 김혜진 · 임의수 선생님 이메일로 문의

## 로컬 개발 환경에 적용 (선택)

본인 PC에서 `npm run dev` 할 때도 실시간 공유로 테스트하려면:

```
D:/university/.env.local
```

이 파일 만들고 (gitignore에 자동 제외됨):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

`npm run dev` 다시 실행.
