---
title: 在windows上设置frp开机自动启动
date: 2020-11-05 20:55:59
tags: ["frp"]
---

### 写在前面

在之前的文章中介绍了在 Windows 上运行frp的客户端需要在命令行中输入一下命令

```
frpc.exe -c frpc.ini
```

但是如何不小心关掉了命令行窗口就需要手动重新打开，当然也可以把上面的命令复制后另存为run.bat文件，下次双击运行就可以使用，但是我们还是想实现开机自动运行，那么该如何做呢？

这个时候我们需要借助第三方的工具 [nssm](https://nssm.cc/)， nssm 官网的介绍如下

> *nssm* is a service helper which doesn't suck. *srvany* and other service helper programs suck because they don't handle failure of the application running as a service. If you use such a program you may see a service listed as started when in fact the application has died. *nssm* monitors the running service and will restart it if it dies. With *nssm* you know that if a service says it's running, it really is. Alternatively, if your application is well-behaved you can configure *nssm* to absolve all responsibility for restarting it and let Windows take care of recovery actions.

大概的意思就是 nssm 可以将程序注册成 windows 服务，并且会监听正在运行的服务，当服务死了之后会自动重启。

### 下载 nssm

先去 https://nssm.cc/download 这个地址下载 nssm, 下载后的文件非常小只有 300+ KB，算的上是短小精悍。

![image-20201105213254604](https://static.aalmix.com/20201106173532.png)



### 如何使用 nssm

1. 进入命令行窗口，输入`nssm install `

![image-20201105213622063](https://static.aalmix.com/20201106173550.png)

![image-20201105213739577](https://static.aalmix.com/20201106173557.png)

2. 执行之后会显示下面这个页面，选择 frpc 程序的路径，以及启动的参数

![image-20201105213843898](https://static.aalmix.com/20201106173601.png)

![image-20201105214258612](https://static.aalmix.com/20201106173603.png)

3. 填写服务的显示名称以及服务说明，还有启动方式，默认是自动自动

![image-20201105214507281](https://static.aalmix.com/20201106173606.png)

4. 配置程序输入和输出日志存放位置（可选）

   ![image-20201105215008339](https://static.aalmix.com/20201106173609.png)

   5. 点击 `Install service` 按钮安装服务

### 管理服务

按下`Win+R`键，在运行中输入`service.msc` 命令打开服务管理器，我们就可以看到刚刚安装的frp服务了，然后我们就向其他windows服务一样控制它启动，停止，重启了。

![image-20201105215255665](https://static.aalmix.com/20201106173612.png)



![image-20201105215411888](https://static.aalmix.com/20201106173615.png)

当前我们可以通过 nssm 的命令行的形式控制它

```
# 启动
nssm start <servicename>

# 停止
nssm stop <servicename>

# 重启
nssm restart <servicename>

# 修改服务配置
nssm edit <servicename>

# 删除服务 
nssm remove <servicename>

```



参考： www.cnblogs.com/TianFang/p/7912648.html