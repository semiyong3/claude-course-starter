// PreToolUse 훅: Bash/PowerShell 도구로 실행하려는 위험한 명령을 실행 전에 차단한다.
// stdin으로 훅 입력 JSON을 받고, 위험하면 permissionDecision: "deny"를 출력한다.

const DELETE_COMMANDS = new Set([
  "rm",
  "remove-item",
  "ri",
  "rmdir",
  "rd",
  "del",
  "erase",
]);

const PATTERNS = [
  [/\bgit\s+reset\s+--hard\b/i, "git reset --hard (커밋 안 된 변경사항 삭제)"],
  [/\bgit\s+clean\s+-[a-z]*f/i, "git clean -f (추적 안 되는 파일 삭제)"],
  [
    /\bgit\s+push\b.*\s(?:-f|--force(?!-with-lease))(?:\s|$)/i,
    "git push --force (원격 기록 덮어쓰기)",
  ],
  [/\bmkfs(?:\.\w+)?\b/i, "mkfs (디스크 포맷)"],
  [/\bdd\b[^;&|]*\bof=\/dev\//i, "dd of=/dev/... (디스크 직접 쓰기)"],
  [/>\s*\/dev\/(?:sd|nvme|hd)/i, "디스크 장치에 직접 쓰기"],
  [/\bformat(?:\.com)?\s+[a-z]:/i, "format (드라이브 포맷)"],
  [/\b(?:Format-Volume|Clear-Disk|Remove-Partition)\b/i, "디스크 포맷/삭제"],
  [
    /\b(?:shutdown|reboot|halt|poweroff|Stop-Computer|Restart-Computer)\b/i,
    "시스템 종료/재시작",
  ],
  [/:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/, "포크 폭탄"],
  [/\bchmod\s+-R\s+777\b/i, "chmod -R 777 (권한 전체 개방)"],
  [
    /\b(?:curl|wget|iwr|irm|Invoke-WebRequest|Invoke-RestMethod)\b[^|]*\|\s*(?:sudo\s+)?(?:sh|bash|zsh|iex|Invoke-Expression)\b/i,
    "인터넷에서 받은 스크립트를 바로 실행",
  ],
];

// 플래그 토큰 하나가 "재귀"/"강제" 옵션인지 판별한다.
// 유닉스(-rf, -fr, --recursive), PowerShell(-Recurse, -Rec, -Force, -fo), cmd(/s, /q)를 모두 처리한다.
function classifyFlag(token) {
  const t = token.replace(/^["']|["']$/g, "");
  if (/^\/s$/i.test(t)) return { recursive: true };
  if (/^\/q$/i.test(t)) return { force: true };
  if (/^--recursive$/i.test(t)) return { recursive: true };
  if (/^--force$/i.test(t)) return { force: true };
  if (!/^-[a-z]+$/i.test(t)) return {};

  const body = t.slice(1);
  const lower = body.toLowerCase();
  // 짧은 옵션 묶음 (예: -rf, -Rf, -rfv)
  if (/^[rfvidx]+$/i.test(body)) {
    return { recursive: /r/i.test(body), force: /f/i.test(body) };
  }
  // PowerShell 이름 옵션과 그 약어
  return {
    recursive: "recurse".startsWith(lower) || lower === "recursive",
    force: lower.length >= 2 && "force".startsWith(lower),
  };
}

function findRecursiveForceDelete(command) {
  const segments = command.split(/&&|\|\||[;&|\n]/);
  for (const segment of segments) {
    const tokens = segment.trim().split(/\s+/);
    for (let i = 0; i < tokens.length; i++) {
      const name = tokens[i]
        .replace(/^[("'`]+|["')]+$/g, "")
        .split(/[\\/]/)
        .pop()
        .toLowerCase()
        .replace(/\.exe$/, "");
      if (!DELETE_COMMANDS.has(name)) continue;

      let recursive = false;
      let force = false;
      for (const flag of tokens.slice(i + 1)) {
        const r = classifyFlag(flag);
        recursive ||= Boolean(r.recursive);
        force ||= Boolean(r.force);
      }
      if (recursive && force) return segment.trim();
    }
  }
  return null;
}

function check(command) {
  const deleted = findRecursiveForceDelete(command);
  if (deleted) return `재귀 + 강제 삭제 명령 (${deleted})`;
  for (const [pattern, label] of PATTERNS) {
    if (pattern.test(command)) return label;
  }
  return null;
}

// DEBUG: 훅 실행 여부 확인용 (확인 후 삭제)
require("fs").appendFileSync(
  require("path").join(__dirname, "hook-debug.log"),
  `${new Date().toISOString()} fired cwd=${process.cwd()}\n`,
);

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let command;
  try {
    command = JSON.parse(input).tool_input?.command;
  } catch {
    process.exit(0);
  }
  if (typeof command !== "string") process.exit(0);

  const reason = check(command);
  if (!reason) process.exit(0);

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `위험한 명령이 차단되었습니다: ${reason}. 꼭 필요하면 사용자가 직접 실행하세요.`,
      },
    }),
  );
});
