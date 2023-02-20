---
title: 如何在Markdown文档显示diff效果
date: 2020-11-13 17:14:11
tags: ["Markdown"]
---

![img](https://www.wangbase.com/blogimg/asset/202011/bg2020110301.jpg)

我最喜欢的一个博客技巧就是在 Github 风格的 markdown 中使用 diff 格式，使用这个这个技巧可以显示代码片段中修改的地方。

如果我想给其他人显示一个函数修改的状态历史，类似于下面的代码片段

``` diff
function addTwoNumbers (num1, num2) {
- return 1 + 2
+ return num1 + num2
}
```
如何实现呢?

首先不要指定变成语言， 而是使用 `diff`，然后在需要显示成删除样式的代码的开头添加`-`，添加的代码的前面添加一个`+`，代码如下所示

~~~text
```diff
function addTwoNumbers (num1, num2) {
-  return 1 + 2
+  return num1 + num2
}
```
~~~

OK！！



原文地址： https://welearncode.com/create-diff-markdown/