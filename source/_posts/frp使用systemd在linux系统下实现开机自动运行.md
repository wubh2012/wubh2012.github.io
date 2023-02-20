---
title: frp使用systemd在linux系统下实现开机自动运行
date: 2020-12-20 15:51:29
tags: ["frp","systemd","linux"]
---

Systemd 是 Linux 系统系统工具，用来启动守护进程，已经成为了大多数发行版本的标准配置。

```
# 查看 Systemd 版本
systemctl --version  
```

frp 也是支持 Systemd 的，我们下载的frp文件当中就包含了一个 systemd 文件夹，里面就包含了 frps 和 frpc 的服务配置文件

![image-20201220160339843](https://static.aalmix.com/20201220165016.png)

我们使用 cat 命令查看一下配置文件内容 `cat frps.service`

```
[Unit]
Description=Frp Server Service
After=network.target

[Service]
Type=simple
User=nobody
Restart=on-failure
RestartSec=5s
ExecStart=/usr/bin/frps -c /etc/frp/frps.ini

[Install]
WantedBy=multi-user.target

```

我们可以看到 frps 的执行路径是 `/usr/bin/frps`，配置文件放在 `/ect/frp/frps.ini`，

Systemd 的配置文件都放在 `/lib/systemd/system` 目录下，系统开机启动的时候之后只执行这个目录里的配置文件，所以我们只要把 `frps.service`复制到 `/lib/systemd/system` ，frps 复制到 `/usr/bin`目录，fprs.ini 复制到`/etc/frp`目录就可以了

```
sudo cp frps /usr/bin/frps
sudo mkdir /etc/frp
sudo cp frps.ini /etc/frp/frps.ini
sudo cp systemd/frps.service /lib/systemd/system/frps.service

```


```
# 重新加载 system 配置文件
sudo systemctl daemon-reload
# 设置 frps 开机启动
sudo systemctl enable frps.service

```

![image-20201220164646349](https://static.aalmix.com/20201220165207.png)

```
# 启动 frps 服务
sudo systemctl start frps.service
# 查看服务器状态
sudo systemctl status frps.service
```



![image-20201220164606524](https://static.aalmix.com/20201220165202.png)


参考链接 
* [Systemd 入门教程：命令篇](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)
* [Systemd 入门教程：实战篇](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html)



