# GitHub Pages 傻瓜发布步骤

这份说明只讲最短路径，不讲原理。

## 你要准备的东西

- 一个 GitHub 账号
- 当前这个项目目录

## 第一步：新建 GitHub 仓库

1. 打开 GitHub。
2. 登录你的账号。
3. 点击右上角 `+`。
4. 选择 `New repository`。
5. 仓库名可以填：

```text
zhongkao-helper
```

6. 选 `Public`。
7. 不要勾选初始化 README。
8. 点击 `Create repository`。

## 第二步：上传项目文件

你需要把下面这些内容传到仓库根目录：

```text
.github/
.nojekyll
assets/
content.js
data/
engine/
index.html
manifest.webmanifest
README.md
DEPLOY-GITHUB-PAGES.md
sw.js
```

### 如果你不会 git 命令

1. 打开刚创建好的 GitHub 仓库页面。
2. 点击 `uploading an existing file`。
3. 把上面这些文件和文件夹直接拖进去。
4. 页面底部点 `Commit changes`。

## 第三步：开启 Pages

### 用自动部署方式，最省事

1. 打开仓库页面。
2. 进入 `Settings`。
3. 左侧点 `Pages`。
4. 在 `Build and deployment` 里，把 `Source` 选成：

```text
GitHub Actions
```

5. 保存。

如果你的仓库里已经有 `.github/workflows/deploy-pages.yml`，它会自动执行发布。

## 第四步：等它发布完成

1. 点仓库上方的 `Actions`。
2. 看到 `Deploy Static Site To GitHub Pages` 在跑。
3. 等出现绿色对勾。
4. 回到 `Settings -> Pages`，你会看到站点地址。

地址通常像这样：

```text
https://你的用户名.github.io/zhongkao-helper/
```

## 第五步：手机安装

### 安卓

1. 用 Chrome 打开网址。
2. 点击页面右下角 `安装到手机`。
3. 或者从浏览器菜单里选 `安装应用`。

### iPhone

1. 用 Safari 打开网址。
2. 点击 `分享`。
3. 点击 `添加到主屏幕`。

## 如果发布后打不开

按这个顺序检查：

1. `Actions` 里是否是绿色成功。
2. `Pages` 里 `Source` 是否选成了 `GitHub Actions`。
3. 仓库里是否真的上传了这些文件：

```text
index.html
manifest.webmanifest
sw.js
content.js
data/
engine/
assets/icons/
```

4. 等 1 到 3 分钟再刷新。

## 如果你要我继续

我下一步可以继续帮你做两种事情：

1. 直接给你写一套 git 命令版上传步骤
2. 继续做安卓 APK 封装准备