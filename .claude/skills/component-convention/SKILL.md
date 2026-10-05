---
description: 우리 프로젝트 컨벤션대로 새 컴포넌트를 만들 때 사용
---

우리 할일 앱에서 새 컴포넌트를 만들때 규칙:

- 들여쓰기는 2칸
- 타입은 직접 선언하지 말고 `lib/types.ts`에서 import
- 상태(`useState`, `useEffect` 등)를 쓰면 파일 맨 위에 `"use client"` 추가
- 파일은 `components/` 폴더에, 이름은 PascalCase (예: `TodoStats.tsx`)
- 스타일은 Tailwind 유틸 클래스로 (별도 CSS 파일 X)

## 참고 자료

- 폴더 구조나 네이밍, 타입, 규칙 자세히 : [reference.md](reference.md)
- 컨벤션을 지킨 컴포넌트 예시 : [examples.md](examples.md)