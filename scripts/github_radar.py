#!/usr/bin/env python3
"""GitHub 黑科技雷达 - 抓取 GitHub Trending 并用 Claude 评估项目价值"""

import os
import json
import time
import argparse
from datetime import date
from pathlib import Path

import requests
from bs4 import BeautifulSoup
import anthropic

# ── 常量 ────────────────────────────────────────────────────────────────────

OUTPUT_DIR = Path(__file__).parent / "output"
SEEN_FILE = OUTPUT_DIR / "seen_projects.json"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}
TRENDING_BASE = "https://github.com/trending"
LANGUAGES = ["", "python", "javascript"]   # "" = Any
MODEL = "claude-sonnet-4-20250514"

CATEGORY_EMOJI = {
    "blacktech": "🔥",
    "tool": "🛠",
    "normal": "📦",
}
CATEGORY_LABEL = {
    "blacktech": "黑科技",
    "tool": "实用工具",
    "normal": "普通项目",
}


# ── 抓取 ─────────────────────────────────────────────────────────────────────

def fetch_trending(language: str = "", since: str = "daily") -> list[dict]:
    """抓取单个 trending 页面，返回项目列表。"""
    url = TRENDING_BASE
    if language:
        url = f"{TRENDING_BASE}/{language}"
    params = {"since": since}

    resp = requests.get(url, headers=HEADERS, params=params, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    projects = []
    for article in soup.select("article.Box-row"):
        # 仓库名
        h2 = article.select_one("h2 a")
        if not h2:
            continue
        repo_path = h2["href"].strip("/")          # e.g. "owner/repo"
        parts = repo_path.split("/")
        if len(parts) != 2:
            continue
        owner, repo = parts
        full_name = f"{owner}/{repo}"
        link = f"https://github.com/{full_name}"

        # 描述
        p = article.select_one("p")
        description = p.get_text(strip=True) if p else ""

        # 语言
        lang_span = article.select_one("[itemprop='programmingLanguage']")
        lang = lang_span.get_text(strip=True) if lang_span else "Unknown"

        # 今日新增 star
        stars_today_el = article.select_one("span.d-inline-block.float-sm-right")
        stars_today = ""
        if stars_today_el:
            stars_today = stars_today_el.get_text(strip=True)
            stars_today = stars_today.replace("stars today", "").replace("star today", "").strip()

        projects.append({
            "full_name": full_name,
            "owner": owner,
            "repo": repo,
            "link": link,
            "description": description,
            "language": lang,
            "stars_today": stars_today or "N/A",
        })

    return projects


def collect_all_projects() -> list[dict]:
    """抓取所有语言分类，合并去重（同一 full_name 只保留首次）。"""
    seen_in_run: set[str] = set()
    all_projects: list[dict] = []

    for lang in LANGUAGES:
        label = lang if lang else "Any"
        print(f"  抓取 Trending [{label}] ...")
        try:
            batch = fetch_trending(language=lang, since="daily")
            for p in batch:
                if p["full_name"] not in seen_in_run:
                    seen_in_run.add(p["full_name"])
                    all_projects.append(p)
            time.sleep(1.5)   # 礼貌延迟
        except Exception as e:
            print(f"  [警告] 抓取 {label} 失败: {e}")

    return all_projects


# ── 去重 ─────────────────────────────────────────────────────────────────────

def load_seen() -> set[str]:
    if SEEN_FILE.exists():
        data = json.loads(SEEN_FILE.read_text(encoding="utf-8"))
        return set(data)
    return set()


def save_seen(seen: set[str]) -> None:
    SEEN_FILE.write_text(
        json.dumps(sorted(seen), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


# ── Claude 评估 ───────────────────────────────────────────────────────────────

def evaluate_project(client: anthropic.Anthropic, project: dict) -> dict:
    """调用 Claude 对单个项目做评估，返回增强后的项目 dict。"""
    prompt = f"""你是一个技术雷达分析师，请对以下 GitHub 项目做简短评估。

项目：{project['full_name']}
链接：{project['link']}
描述：{project['description']}
主要语言：{project['language']}

请用中文，严格按以下 JSON 格式回复（不要输出其他内容）：
{{
  "summary": "一句话说清楚这是什么、能干什么（≤30字）",
  "category": "blacktech 或 tool 或 normal 三选一",
  "reason": "含金量判断理由（≤30字）",
  "ai_score": 1到5的整数（与AI/自动化/个人工具方向的相关性）
}}

分类标准：
- blacktech（黑科技）：技术门槛高、创新性强、令人眼前一亮
- tool（实用工具）：解决具体问题、有实用价值、开箱即用
- normal（普通项目）：常规项目、学习资料、模板等"""

    for attempt in range(3):
        try:
            msg = client.messages.create(
                model=MODEL,
                max_tokens=256,
                messages=[{"role": "user", "content": prompt}],
            )
            text = msg.content[0].text.strip()
            # 兼容 Claude 有时在 JSON 外加 ```
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            result = json.loads(text)
            project["summary"] = result.get("summary", "")
            project["category"] = result.get("category", "normal")
            project["reason"] = result.get("reason", "")
            project["ai_score"] = int(result.get("ai_score", 3))
            return project
        except Exception as e:
            if attempt == 2:
                print(f"  [警告] 评估 {project['full_name']} 失败: {e}")
                project["summary"] = project["description"][:60] or "无描述"
                project["category"] = "normal"
                project["reason"] = "评估失败"
                project["ai_score"] = 3
                return project
            time.sleep(2 ** attempt)

    return project


# ── Markdown 生成 ─────────────────────────────────────────────────────────────

def render_project(p: dict) -> str:
    emoji = CATEGORY_EMOJI.get(p["category"], "📦")
    score_stars = "⭐" * p["ai_score"]
    lines = [
        f"### [{p['full_name']}]({p['link']})",
        f"> ⭐ 今日新增 {p['stars_today']} stars | {p['language']} | "
        f"含金量：{emoji} {CATEGORY_LABEL.get(p['category'], '普通项目')}",
        "",
        f"**Claude评估：** {p['summary']}  ",
        f"*{p['reason']}*  ",
        f"AI相关性：{score_stars} ({p['ai_score']}/5)",
        "",
        "---",
    ]
    return "\n".join(lines)


def generate_report(projects: list[dict], today: str) -> str:
    by_cat: dict[str, list[dict]] = {"blacktech": [], "tool": [], "normal": []}
    for p in projects:
        cat = p.get("category", "normal")
        by_cat.setdefault(cat, []).append(p)

    sections = [
        f"# GitHub 黑科技雷达 {today}",
        "",
        f"> 本日共发现 **{len(projects)}** 个新项目",
        f"> 🔥 黑科技 {len(by_cat['blacktech'])} 个 | "
        f"🛠 实用工具 {len(by_cat['tool'])} 个 | "
        f"📦 普通项目 {len(by_cat['normal'])} 个",
        "",
    ]

    for cat in ["blacktech", "tool", "normal"]:
        items = by_cat[cat]
        if not items:
            continue
        emoji = CATEGORY_EMOJI[cat]
        label = CATEGORY_LABEL[cat]
        sections.append(f"## {emoji} {label}")
        sections.append("")
        # 按 AI 相关性降序排列
        for p in sorted(items, key=lambda x: x.get("ai_score", 0), reverse=True):
            sections.append(render_project(p))
            sections.append("")

    sections.append(f"*由 GitHub 黑科技雷达自动生成 · {today}*")
    return "\n".join(sections)


# ── 主流程 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="GitHub 黑科技雷达")
    parser.add_argument(
        "--no-skip",
        action="store_true",
        help="忽略 seen_projects.json，重新评估所有项目",
    )
    parser.add_argument(
        "--max",
        type=int,
        default=0,
        help="限制评估项目数（调试用，0=不限制）",
    )
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise SystemExit("错误：请设置环境变量 ANTHROPIC_API_KEY")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    output_file = OUTPUT_DIR / f"github-radar-{today}.md"

    print("=" * 50)
    print(f"GitHub 黑科技雷达  {today}")
    print("=" * 50)

    # 1. 抓取
    print("\n[1/3] 抓取 GitHub Trending ...")
    all_projects = collect_all_projects()
    print(f"  共抓到 {len(all_projects)} 个项目")

    # 2. 去重
    seen = load_seen() if not args.no_skip else set()
    new_projects = [p for p in all_projects if p["full_name"] not in seen]
    print(f"  过滤已推送：{len(all_projects) - len(new_projects)} 个 | 新项目：{len(new_projects)} 个")

    if args.max > 0:
        new_projects = new_projects[: args.max]
        print(f"  （调试模式：限制评估前 {args.max} 个）")

    if not new_projects:
        print("\n没有新项目，退出。")
        return

    # 3. Claude 评估
    print(f"\n[2/3] 用 Claude 评估 {len(new_projects)} 个项目 ...")
    client = anthropic.Anthropic(api_key=api_key)
    evaluated = []
    for i, p in enumerate(new_projects, 1):
        print(f"  [{i}/{len(new_projects)}] {p['full_name']}")
        evaluated.append(evaluate_project(client, p))
        time.sleep(0.5)   # 避免速率限制

    # 4. 生成报告
    print("\n[3/3] 生成 Markdown 日报 ...")
    report = generate_report(evaluated, today)
    output_file.write_text(report, encoding="utf-8")
    print(f"  已保存：{output_file}")

    # 5. 更新 seen
    for p in evaluated:
        seen.add(p["full_name"])
    save_seen(seen)
    print(f"  seen_projects.json 已更新（共 {len(seen)} 条记录）")

    print("\n完成！")
    print(f"  报告路径：{output_file.resolve()}")

    # 简要摘要
    by_cat: dict[str, int] = {}
    for p in evaluated:
        by_cat[p["category"]] = by_cat.get(p["category"], 0) + 1
    print(
        f"  🔥 黑科技 {by_cat.get('blacktech', 0)} | "
        f"🛠 工具 {by_cat.get('tool', 0)} | "
        f"📦 普通 {by_cat.get('normal', 0)}"
    )


if __name__ == "__main__":
    main()
