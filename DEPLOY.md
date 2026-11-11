# 部署到 Gitee Pages（公网）

> SSH 已验证可用：`ssh -T git@gitee.com` → `Hi Anon酱(@towards-wisdom)`
> 只差**在 Gitee 上建一个空仓库**（网页点 30 秒），之后我这边一条命令推送。

## 一、你做的事（30 秒）

1. 打开 https://gitee.com/projects/new
2. 仓库名填 **`portfolio`**
3. 可见性选 **公开**（Gitee Pages 免费版只支持公开仓库）
4. **不要**勾选「使用 Readme 初始化」（要空仓库）
5. 创建

## 二、我做的事（建库后）

```bash
cd ~/ai/00-调度台/portfolio
git init -b master
git add -A && git commit -m "portfolio: 作品集静态站"
git remote add origin git@gitee.com:towards-wisdom/portfolio.git
git push -u origin master
```

## 三、开启 Pages（你点一下）

仓库页 → 上方 **服务** → **Gitee Pages** → 部署分支选 `master` → 勾「强制使用 HTTPS」→ **启动**

得到地址：`https://towards-wisdom.gitee.io/portfolio`

---

## 备选：GitHub Pages

同流程，仓库名 `portfolio`，SSH `git@github.com:Richardxrz/portfolio.git`，
Settings → Pages → Source 选 `Deploy from a branch` → `main` / `root`。

## 注意

- 站点 **35 MB**（视频 17 MB + 3D 模型 3.7 MB + 简历），Gitee Pages 免费版对单文件/总量有上限，若部署失败先看是否超限；
- Gitee Pages 需要**实名认证**才能开通；
- 简历含手机号/邮箱，**公开仓库 = 公开简历**，这是你的选择；
- 每次改完推送后，Gitee Pages 要**手动点「更新」**才会刷新（GitHub Pages 自动）。
