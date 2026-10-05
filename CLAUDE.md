# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소의 코드를 다룰 때 참고할 안내를 제공합니다.

## 명령어

- `npm run dev` — 개발 서버 실행 (http://localhost:3000)
- `npm run build` — 프로덕션 빌드 (TypeScript 타입 검사도 함께 수행)
- `npm run lint` — ESLint 실행 (flat config: `eslint-config-next`의 core-web-vitals + typescript)
- `npx prettier --write .` — 코드 포맷팅 (Prettier는 설치되어 있지만 npm 스크립트는 없음. 설정: 큰따옴표, 세미콜론, trailing comma, 80자)

테스트 프레임워크는 아직 설정되어 있지 않습니다.

## 기술 스택

Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4. Tailwind는 `app/globals.css`의 `@import "tailwindcss"`와 `@tailwindcss/postcss`로 설정되며, `tailwind.config` 파일은 없습니다. Next 16 / React 19 / Tailwind 4의 API는 이전 버전과 다르므로, 예전 방식을 가정하지 말고 최신 문서를 확인하세요. import 별칭 `@/*`는 저장소 루트를 가리킵니다.

## 아키텍처

한국어로 된 단일 페이지 할일 앱("미니 할일")입니다. UI 텍스트, 주석, 메타데이터는 모두 한국어입니다(`<html lang="ko">`).

- `app/layout.tsx`는 화면 가운데에 모바일 너비(`max-w-md`)의 컬럼을 렌더링하고, 페이지는 그 안에 표시됩니다.
- `app/page.tsx`는 클라이언트 컴포넌트이며 **모든 상태를 단독으로 소유**합니다. `todos`를 `useState`로 관리하고(초기값은 `lib/mock-data.ts`), `addTodo` / `toggleTodo` / `deleteTodo`를 정의해 props로 내려줍니다. `components/`의 컴포넌트들은 props로 데이터와 콜백을 받아 화면만 그리는 역할이며, context·스토어·데이터 저장·API 계층은 없습니다.
- `lib/types.ts`는 `Todo`(`createdAt`은 `YYYY-MM-DD` 형식 문자열)와 `Filter`(`"all" | "active" | "completed"`)를 정의합니다.
- `lib/utils.ts`에는 헬퍼 함수가 있습니다. `fd()`는 날짜 문자열을 `YYYY년 MM월 DD일` 형식으로 바꾸고, `countRemaining()`은 헤더의 개수 표시에 사용됩니다.
- 브랜드 강조색은 하드코딩된 `#D97757`(hover 시 `#c96647`)이며, 컴포넌트 전반에서 Tailwind 임의값(arbitrary value)으로 사용됩니다.


