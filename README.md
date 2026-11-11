# 向睿智 · 作品集静态站

一个零依赖的单页作品集：**HTML + CSS + JS**，无构建、无 CDN、可离线。

## 怎么预览

```bash
cd ~/ai/00-调度台/portfolio
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765
```

> **直接双击 `index.html` 也能正常加载媒体**（已改为 `<img>/<video>` 元素探测，不再依赖 fetch）。
> 本地服务器仍推荐，用于验证与部署前检查。

## 怎么放视频和照片（不用改代码）

把文件按占位符上写好的名字放进对应目录，**刷新页面就自动出现**：

```
assets/
├── videos/
│   ├── engineer-robot-demo.mp4     # 工程机器人
│   ├── arm-controller-demo.mp4     # 六轴机械臂 / 自定义控制器
│   ├── dm-joint-demo.mp4           # 达妙单关节
│   ├── dmtool-demo.mp4             # DMTool 演示
│   └── kinematics-demo.mp4         # 运动学仿真
└── photos/
    ├── engineer-robot-01.jpg
    ├── arm-controller-01.jpg
    ├── dmtool-ui.png
    ├── uart-frame-test.png
    ├── kinematics-shot.png
    ├── pcb-01.jpg / pcb-02.jpg / pcb-03.jpg
    ├── design-doc.png
    └── award-01.jpg / award-02.jpg / award-03.jpg
```

- **图片**：jpg / png / webp 都行（改文件名后缀时同步改 `index.html` 里的 `data-src`）；
- **视频**：mp4（H.264）最稳；悬停自动预览、点击放大播放；
- 想加新项目：复制任意一张 `<article class="card" ...>`，改标题/描述/链接，再改 `data-src`。

## 文件结构

```
portfolio/
├── index.html    # 页面结构 + 媒体位声明
├── styles.css    # 深色主题
├── app.js        # 筛选 / 媒体自动加载 / 灯箱
├── assets/
│   ├── videos/   # 视频位
│   └── photos/   # 照片位
└── README.md
```

## 发布

- **GitHub Pages**：推到仓库 → Settings → Pages → 选分支根目录；
- **Gitee Pages**：仓库 → 服务 → Gitee Pages（需实名）；
- 或直接把整个目录丢到任意静态托管。

## 已知限制

- 媒体探测基于元素加载事件，`file://` 与 HTTP 均可用；
- 视频用 H.264 mp4，Safari / Chrome / Edge 都支持；HEVC 只有 Safari 稳。
---

## 已接入的真实媒体（2026-11-11）

### 视频（统一转 720p H.264，共约 15 MB）
| 文件 | 内容 | 时长 |
|---|---|---|
| `engineer-robot-demo.mp4` | 工程机器人完整形态展示 | 70 s |
| `robocon-r1-pick.mp4` | ROBOCON R1 自动拾取 | 13 s |
| `mecanum-chassis.mp4` | 麦克纳姆轮全向底盘 | 13 s |
| `double-pendulum.mp4` | 双摆拉格朗日仿真 | 63 s |
| `buzzer-music.mp4` | 妙板蜂鸣器音乐播放 | 45 s |

每个视频都配了 `<名>-poster.jpg` 首帧封面（`data-poster` 属性）。

### 图片
| 文件 | 内容 |
|---|---|
| `dmtool-1..6.jpg` | DMTool 六个界面截图（电机调试 / 全程记录 / 参数设置 / CAN 分析仪 / 计算 / 设置） |
| `engineer-robot-01.jpg` | 工程机器人实拍 |
| `team-robocon.jpg` | ROBOCON 团队合影 |
| `thirdlink-sim.jpg` | 三连杆机械臂仿真画面 |
| `award-01..05-*.jpg` | 五张获奖证书 |

### 仍是占位符的 8 个位置
六轴机械臂控制器演示、达妙单关节演示、UART 测试截图、三块 PCB 实物、设计稿。
把文件按占位符上写的名字放进目录即可自动显示。
### 追加（2026-11-11 晚）
| 文件 | 内容 |
|---|---|
| `custom-controller-demo.mp4` | 自定义控制器实物展示（10 s，1.3 MB） |
| `pcb-51.obj.js` / `pcb-51.mtl.js` | 内嵌 3D 模型 + 材质（绕开 file:// 的 XHR 限制） |
| `sim-platform.mp4` | 仿真平台录屏（37 s，991 KB） |

---

## 站点结构（2026-11-11 晚扩充）

| 区块 | 内容 |
|---|---|
| Hero | 求职意向、统计、**简历 PDF 下载** |
| 项目 | 12 张卡（机器人 / 固件 / 工具 / 硬件 / 仿真），28 个媒体位 |
| **时间线** | 2025.09 → 2026.11 八个节点 |
| **工程笔记** | 3 条 ADR（双总线 / CAN 对象池 / 3D 内嵌）+ 6 条踩坑 |
| PCB 3D | three.js 本地渲染，OBJ + MTL 内嵌，拖动/缩放/双击复位 |
| 荣誉 | 4 张奖项卡 + 5 张证书 |
| 联系 | 邮箱 / 电话 / QQ / 微信（点击复制）/ GitHub / Gitee / 简历下载 |

## 软件层特性

- **明暗主题**：右上角 ◐ 切换，localStorage 记忆；也可用 ?theme=light 强制浅色
- **打印样式**：⌘P 输出干净白底（隐藏视频 / 3D / 导航）
- **分享卡**：assets/og.png（1200×630）+ og / twitter meta
- **SEO**：description、JSON-LD Person、favicon（内联 SVG）
- **懒加载**：视频 preload=none，悬停才拉流
- **零依赖**：无框架、无 CDN，双击 index.html 即可离线看

## 部署

1. Gitee 新建空仓库 portfolio（公开）
2. 执行 ./deploy.sh
3. 仓库 → 服务 → Gitee Pages → 部署 master

详见 DEPLOY.md。
