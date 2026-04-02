---
title: "使用hugo搭建博客 - 利用 Github Actions 自动部署网站"
date: 2022-05-25T21:50:44+08:00
draft: false
tags: ["博客", "hugo"]
---

之前我们每次更新博客都需要重新上传 public 这个目录的文件，步骤比较繁琐，今天给大家分享一下我们可以通过 Github Actions 自动部署的方式来更新博客。

## 什么是 GitHub Action

GitHub Actions 是 GitHub 官方推出的持续集成服务。通过 GitHub Actions 可以为你的项目提供持续构建，测试，程序打包和部署一条龙服务。

## 怎么使用

进入 wubh2012.github.io 仓库，点击 Actions 选项卡，开始创建一个新的 Actions，按照下面的步骤将操作即可。

![微信截图_20220526140607](/hugo-blog-use-git-action-auto-deploy.assets/微信截图_20220526140607.png)
![微信截图_20220526140646](/hugo-blog-use-git-action-auto-deploy.assets/微信截图_20220526140646.png)

```yaml
name: github pages

on: #
  schedule:
    - cron: "0 0 * * *" # every day at midnight
  push: # when a new commit is pushed
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true # Fetch Hugo themes (true OR recursive)
          fetch-depth: 0 # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: "0.82.0"
          extended: true

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: "12.x"

      - name: Cache dependencies
        uses: actions/cache@v1
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - run: npm i
      - run: hugo --minify # 使用hugo构建静态网页

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: blog.aalmix.com # 为了实现自定义域名，增加了 cname 配置
          user_name: "github-actions[bot]"
          user_email: "github-actions[bot]@users.noreply.github.com"
```

配置好后我们每次推送更新到仓库，都会触发自动构建静态网页，默认放到 `gh-pages` 分支，可能需要到设置中修改 Github Page 的源
![20220526180758](/hugo-blog-use-git-action-auto-deploy.assets/20220526180758.png)

而且每天凌晨也会自动部署，这样是不是省事多了 😀 ！
