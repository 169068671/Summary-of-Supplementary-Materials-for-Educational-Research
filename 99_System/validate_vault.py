#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


VAULT = Path(__file__).resolve().parents[1]
SKIP_PARTS = {".git", ".trash", "__pycache__"}
TEXT_SUFFIXES = {".md", ".txt", ".json", ".csv", ".js", ".py"}
SECRET_VALUE = re.compile(
    r"(?i)(api[_-]?key|access[_-]?token|session[_-]?token|password|secret)"
    r"\s*[:=]\s*[\"']?([A-Za-z0-9_\-]{20,})"
)
WIKILINK = re.compile(r"!?\[\[([^\]]+)\]\]")


def included(path: Path) -> bool:
    return path.is_file() and not any(part in SKIP_PARTS for part in path.parts)


def resolve_link(note: Path, target: str, files: list[Path], stems: dict[str, list[Path]]) -> bool:
    target = target.split("|", 1)[0].split("#", 1)[0].strip()
    if not target:
        return True
    candidates = [VAULT / target, note.parent / target]
    if not Path(target).suffix:
        candidates.extend([VAULT / f"{target}.md", note.parent / f"{target}.md"])
    if any(candidate.resolve().exists() for candidate in candidates):
        return True
    return Path(target).stem in stems


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    files = [path for path in VAULT.rglob("*") if included(path)]
    stems: dict[str, list[Path]] = {}
    for path in files:
        stems.setdefault(path.stem, []).append(path)

    json_checked = 0
    for path in files:
        relative = path.relative_to(VAULT)
        if path.suffix.lower() == ".json":
            try:
                json.loads(path.read_text(encoding="utf-8"))
                json_checked += 1
            except Exception as exc:
                errors.append(f"JSON解析失败：{relative}：{exc}")

        if path.suffix.lower() not in TEXT_SUFFIXES or path.stat().st_size > 5 * 1024 * 1024:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        if SECRET_VALUE.search(text):
            errors.append(f"疑似包含密钥、Token或密码：{relative}")

        if path.suffix.lower() == ".md":
            if text.startswith("---\n") and "\n---\n" not in text[4:]:
                errors.append(f"YAML frontmatter未闭合：{relative}")
            for raw in WIKILINK.findall(text):
                if not resolve_link(path, raw, files, stems):
                    warnings.append(f"未解析的Obsidian链接：{relative} -> {raw}")

    result = {
        "status": "PASS" if not errors else "FAIL",
        "vault": str(VAULT),
        "files_checked": len(files),
        "json_checked": json_checked,
        "errors": errors,
        "warnings": warnings,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
