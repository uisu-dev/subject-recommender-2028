# 관리자 모드 설정 가이드

관리자 모드를 활성화하면 사이트에서 직접 학교 정보를 추가·수정·삭제할 수 있습니다.
변경사항은 GitHub에 자동 커밋되고, Vercel이 1~2분 안에 재배포해서 모든 사용자에게 반영됩니다.

## 작동 원리

```
브라우저(관리자) → 비밀번호 입력 → Vercel API
                                      ↓
                              GitHub API로 schools.json 커밋
                                      ↓
                              Vercel 자동 재배포 (1~2분)
                                      ↓
                              전체 사용자에게 반영
```

비밀번호와 GitHub 토큰은 **Vercel 서버 환경변수에만 저장**되어 브라우저 코드에서 절대 노출되지 않습니다.

---

## 1단계 · GitHub Personal Access Token 발급

GitHub이 사이트(Vercel 서버)가 `data/schools.json` 파일을 수정하도록 허용하는 토큰입니다.

1. https://github.com/settings/personal-access-tokens/new 접속 (Fine-grained token)
2. 입력:
   - **Token name**: `subject-recommender-admin` (자유롭게)
   - **Expiration**: `90 days` 또는 `Custom` (1년 추천)
   - **Repository access**: **Only select repositories** → `uisu-dev/subject-recommender-2028` 선택
   - **Repository permissions** → **Contents**: **Read and write**
     - (다른 권한은 손대지 마세요 — 최소 권한 원칙)
3. **Generate token** 클릭
4. 화면에 한 번만 표시되는 토큰(`github_pat_11...` 으로 시작)을 복사해서 메모장에 임시 보관

> ⚠️ 이 토큰을 잃어버리면 새로 발급해야 합니다. 절대 GitHub에 커밋하거나 캡처해서 공유하지 마세요.

## 2단계 · 관리자 비밀번호 정하기

본인이 외울 수 있으면서 추측 어려운 비밀번호 (12자 이상 권장).

예시 좋음: `bb-hi-2028!math` / `uisu.kim.admin.x9`
예시 나쁨: `password123` / `admin1234` / 본인 이름

김혜진·임의수 두 분이 공유하니까 적당히 외울 수 있게 정해주세요.

## 3단계 · 인증 시크릿 키 생성

세션 쿠키를 서명하는 데 쓰는 랜덤 문자열. 노출돼도 직접적 피해는 없지만,
한 번 정하고 바꾸지 않는 게 좋아요.

PowerShell에서:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

또는 https://www.random.org/strings/ 같은 사이트에서 48자 영숫자 랜덤 생성.

> 16자 이상이면 동작은 함. 32~64자 권장.

## 4단계 · Vercel 환경변수 3개 등록

1. https://vercel.com/dashboard → `subject-recommender-2028` 프로젝트 클릭
2. **Settings** → **Environment Variables**
3. 다음 3개를 차례로 추가 (Environments는 모두 **Production / Preview / Development** 체크):

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | 1단계의 `github_pat_11...` |
| `ADMIN_PASSWORD` | 2단계의 비밀번호 |
| `AUTH_SECRET` | 3단계의 랜덤 문자열 |

각각 **Save** 클릭.

## 5단계 · 재배포

환경변수 추가만으로는 적용 안 됩니다.

- **Deployments** 탭 → 최신 배포 우측 `⋯` → **Redeploy** → 확인

1~2분 뒤 배포 완료.

## 6단계 · 사용 시작

1. https://subject-recommender-2028.vercel.app/ 접속
2. 페이지 맨 아래 푸터의 **"관리자 로그인"** 클릭
3. 2단계 비밀번호 입력 → 로그인
4. 푸터에 🟦 **관리자 모드** 배지가 나타나면 성공
5. **과목 이수 기반 검색** 탭 → 사이드바 "고등학교" 카드에 **관리자** 배지 보임
6. **"관리"** 버튼 클릭 → 학교 관리 모달 열림
7. **+ 새 학교 추가** 또는 기존 학교 클릭 → 학교명·개설 과목 편집
8. 우측 상단 **"저장 & 배포"** 클릭 → GitHub 커밋 → 1~2분 후 라이브 반영

## 운영 팁

- **세션 만료**: 24시간 후 자동 로그아웃. 다시 로그인 필요.
- **다른 브라우저/기기**: 각각 별도로 로그인해야 함 (쿠키는 브라우저별).
- **로그아웃**: 푸터 "로그아웃" 클릭. PC방·공용 PC에서 작업 후엔 꼭.
- **저장 후 새로고침**: GitHub 커밋은 즉시 완료되지만, 라이브 반영은 Vercel 재빌드를 기다려야 함 (1~2분). 그 사이엔 본인 브라우저에 보이는 학교 목록은 아직 변경 전 상태.
- **변경이력**: https://github.com/uisu-dev/subject-recommender-2028/commits/main 에서 누가 언제 뭘 바꿨는지 확인 가능.

## 문제 발생 시

| 증상 | 원인 / 대응 |
|---|---|
| "비밀번호가 올바르지 않습니다" | 비밀번호 오타 또는 환경변수 미적용 — 5단계 재배포 다시 |
| 저장 시 "GitHub commit failed: 401" | GITHUB_TOKEN 만료 또는 권한 부족 — 1단계 재발급 |
| 저장 시 "GitHub commit failed: 404" | 토큰의 Repository access가 이 저장소를 포함 안 함 |
| 저장 후 라이브에 안 보임 | Vercel 재빌드 진행 중 (1~2분 대기). Deployments 탭에서 빌드 상태 확인 |
| 관리자 모드가 5분 후 풀림 | AUTH_SECRET이 환경변수에 매번 다른 값으로 들어가는지 확인 |

## 보안 체크리스트

- [x] GITHUB_TOKEN은 Fine-grained, **Contents Read/Write** 권한만, **이 저장소만** 접근
- [x] ADMIN_PASSWORD는 12자 이상, 추측 어려운 문자열
- [x] AUTH_SECRET은 16자 이상 랜덤 (32+자 권장)
- [x] 모든 시크릿은 Vercel 환경변수에만 저장, 코드에 박지 않음
- [x] 세션 쿠키는 HttpOnly + Secure + SameSite=Lax
- [x] 관리자 비밀번호는 김혜진·임의수 두 분만 공유
