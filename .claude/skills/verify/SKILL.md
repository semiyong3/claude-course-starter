---
name: verify
description: 코드를 수정한 뒤 타입 검사·lint·포맷·개발 서버 응답까지 한 번에 확인할 때 사용. "확인해줘", "검증해줘", /verify
---

코드를 수정한 뒤 아래 순서대로 확인하고 결과를 한국어로 보고한다. 앞 단계가 실패해도 나머지 단계는 계속 실행해서 전체 상황을 한 번에 보여준다.

## 실행 환경 주의 (Windows)
- 명령은 **PowerShell 도구**로 실행한다. 이 환경의 Bash에는 `npx`, `curl`이 없을 수 있다.
- PowerShell 5.1이므로 `&&`를 쓸 수 없다. 이어서 실행할 때는 `A; if ($?) { B }` 형태를 쓴다.
- `tsc`는 처음 실행할 때 2분 넘게 걸릴 수 있으니 timeout을 300000ms 이상으로 준다.

## 1. 타입 검사
```powershell
npx tsc --noEmit
```

## 2. Lint
```powershell
npm run lint
```

## 3. 포맷 검사
```powershell
npx prettier --check app components lib
```
- 검사만 한다. 사용자가 요청하지 않으면 `--write`로 고치지 않는다.

## 4. 개발 서버 응답 확인
```powershell
try { $r = Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 60; "$($r.StatusCode) / 헤더 렌더링: $($r.Content -match '오늘의 할일')" } catch { "서버 응답 없음: $($_.Exception.Message)" }
```
- 서버가 꺼져 있으면 PowerShell 도구의 `run_in_background`로 `npm run dev`를 실행한다. 출력에 `Ready`가 나온 뒤 다시 요청한다. 첫 요청은 컴파일 때문에 10초 넘게 걸릴 수 있다.
- 이미 떠 있는 서버를 종료하거나 재시작하지 않는다.
- HTML 응답을 확인했다고 해서 버튼 클릭 같은 동작까지 확인한 것은 아니다. 보고할 때 이 둘을 구분한다.

## 보고 형식
| 단계 | 결과 |
|---|---|
| 타입 검사 | ✅ 통과 / ❌ 오류 N개 |
| Lint | ✅ / ❌ |
| 포맷 | ✅ / ⚠️ 파일 N개 |
| 개발 서버 | ✅ 200 / ❌ |

실패한 단계가 있으면 표 아래에 `파일:줄 — 메시지`를 적고 고치는 방법을 한 줄로 덧붙인다. 코드는 사용자가 요청할 때만 수정한다.
