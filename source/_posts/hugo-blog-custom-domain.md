---
title: "使用hugo搭建博客 - 自定义域名"
date: 2022-05-25T21:40:07+08:00
draft: false
tags: ["博客", "hugo"]
---

在上一篇文章当中讲了如何使用 hugo 搭建了我们自己的静态博客并托管到了 github 上，但无法和我们自己的域名进行关联，这个时候我们就需要自定义域名了。

首先我们需要配置 DNS 解析，以腾讯云为例，在腾讯云的 DNS 解析记录中添加一个 CNAME 记录，主机记录的值为 `blog`，记录值为`wubh2012.github.io`

![20220526132439](https://static.aalmix.com/20220526132439.png)

然后在 github page 的 Custom domain 填写记录值 `blog.aalmix.com`

![20220525214629](https://static.aalmix.com/20220525214629.png)

最后，我们可以使用 https://blog.aalmix.com 地址去访问我们的博客了！
