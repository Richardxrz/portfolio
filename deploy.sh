#!/bin/bash
# 一键推送作品集到 Gitee（先在 Gitee 建一个空仓库 portfolio）
set -e
cd "$(dirname "$0")"
REMOTE="git@gitee.com:towards-wisdom/portfolio.git"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init -b master
fi
git add -A
git commit -m "update portfolio $(date +%Y-%m-%d %H:%M)" || echo "(无改动)"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"
git push -u origin master
echo "推送完成。去 Gitee 仓库 → 服务 → Gitee Pages → 部署 master 分支。"
