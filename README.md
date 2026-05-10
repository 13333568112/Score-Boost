# 中考快速提分助手

这是一个纯前端 PWA 项目，可以直接部署到 GitHub Pages、Netlify、Vercel、Cloudflare Pages 这类静态托管平台。

## 现在已经具备的能力

- 支持手机浏览器打开
- 支持添加到主屏幕
- 支持离线缓存应用壳
- 不依赖后端服务

## 项目文件说明

- `index.html`：主页面
- `content.js`：原始学科内容
- `data/question-bank.js`：题库与题目元数据
- `engine/`：评分、推荐、分析、渲染逻辑
- `manifest.webmanifest`：PWA 清单文件
- `sw.js`：离线缓存脚本
- `assets/icons/`：安装图标

## 本地预览

不要直接双击 `index.html` 用 `file:///` 打开来测试安装功能。

PWA 的安装和离线缓存，建议通过本地 HTTP 服务或线上 HTTPS 地址测试。

如果你本机有 Python，可以在项目目录执行：

```powershell
python -m http.server 8080
```

然后浏览器打开：

```text
http://127.0.0.1:8080/
```

## 部署到 GitHub Pages

如果你不想手动在 GitHub 后台反复设置，项目里也已经可以配合 GitHub Actions 自动部署。

### 方案一：最简单，直接上传整个目录

1. 在 GitHub 新建一个仓库。
2. 把当前目录下这些文件和文件夹全部上传：

```text
index.html
content.js
data/
engine/
assets/
manifest.webmanifest
sw.js
.nojekyll
```

3. 进入 GitHub 仓库页面。
4. 打开 `Settings`。
5. 打开 `Pages`。
6. 在 `Build and deployment` 中选择：
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` 或 `master`
   - 文件夹：`/ (root)`
7. 保存后等待 GitHub Pages 生成网址。

生成后的地址通常类似：

```text
https://13333568112.github.io/Score-Boost/
```

如果仓库里保留了 `.github/workflows/deploy-pages.yml`，你也可以把 Pages 的 `Source` 改成 `GitHub Actions`，之后每次推送都会自动发布。

### 方案二：如果你已经在本地用 Git 管理

```powershell
git init
git add .
git commit -m "init pwa"
git branch -M main
git remote add origin https://github.com/13333568112/Score-Boost.git
git push -u origin main
```

当前仓库地址：

```text
https://github.com/13333568112/Score-Boost
```

当前线上地址：

```text
https://13333568112.github.io/Score-Boost/
```

然后按上面的 Pages 设置步骤开启即可。

## 手机上怎么安装

### 安卓

1. 用 Chrome 打开 GitHub Pages 地址。
2. 页面右下角会出现“安装到手机”按钮。
3. 如果浏览器没有弹安装框，也可以从浏览器菜单里选择“安装应用”或“添加到主屏幕”。

### iPhone

1. 用 Safari 打开部署后的网址。
2. 点底部“分享”。
3. 选择“添加到主屏幕”。

## 注意事项

- 首次安装和 service worker 注册需要 HTTPS 环境，GitHub Pages 自带 HTTPS。
- 用户做题记录保存在浏览器本地存储里，不会自动同步到别的手机。
- 如果你以后想做账号同步、云备份、家长端查看，就需要增加后端。

## 后续可继续做

- 增加启动页和更精细的图标
- 增加版本更新提示
- 增加题库更新机制
- 封装成安卓 APK