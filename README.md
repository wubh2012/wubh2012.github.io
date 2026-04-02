# 博客写作指南

## 环境要求

- Node.js >= 12
- Git

## 常用命令

```bash
# 安装依赖
npm install

# 本地预览（开发时使用）
npm run server

# 构建静态文件并复制资源
npm run build

# 清理并构建
npm run clean && npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 文章写作

### 创建新文章

```bash
hexo new "文章标题"
```

文章创建在 `source/_posts/文章标题.md`

### 文章图片

**重要**：图片必须放在文章对应的 `.assets` 目录中，不要使用外部图片链接。

1. 在 `source/_posts/` 目录下为每篇文章创建同名 `.assets` 目录：
   ```
   source/_posts/
   ├── 我的文章.md
   └── 我的文章.assets/
       ├── image1.png
       └── image2.jpg
   ```

2. 在 Markdown 中使用**相对路径**引用：
   ```markdown
   ![图片描述](./我的文章.assets/image1.png)
   ```

3. 图片目录命名规则：`文章标题.assets`（与 md 文件同名）

### 图片加载失败排查

如果图片无法显示，按以下顺序检查：

1. 确认 `.assets` 目录与 `.md` 文件同名
2. 确认 Markdown 中使用的是**相对路径**：`./文章名.assets/图片名.png`（注意是 `./` 不是 `/`）
3. 确认已运行 `npm run build` 而非 `hexo generate`，后者不会复制 `.assets` 目录
4. 本地预览：`npm run server`，滚动页面触发懒加载

### 注意事项

- `_config.yml` 中的 `post_asset_folder: true` 已启用
- `.md` 文件中不要使用外部图片 URL（如 `https://static.xxx.com/xxx.png`），图片全部本地化
- 文章永久链接格式：`:year/:month/:day/:title/`，`.assets` 目录会复制到文章输出目录的同级位置，图片使用相对路径 `./文章名.assets/xxx.png` 引用

## 部署流程

```bash
# 1. 构建生产文件（会自动复制 .assets 目录）
npm run build

# 2. 本地预览确认无误
npm run server

# 3. 部署到 GitHub
npm run deploy
```

## 目录结构说明

```
source/_posts/           # 博客文章源文件
  ├── 文章名.md
  └── 文章名.assets/     # 文章图片（必须与 md 同名）
public/                  # 生成的静态文件（不提交到 Git）
scripts/copy-assets.js   # 构建时自动复制 .assets 目录的脚本
```
