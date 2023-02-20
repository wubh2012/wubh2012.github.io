---
title: 使用frp内网穿透教程
date: 2020-11-02 17:27:46
tags: ["frp"]
---

## 写在前面

frp 是一个可用于内网穿透的高性能的反向代理应用，支持 tcp, udp 协议，为 http 和 https 应用协议提供了额外的能力，且尝试性支持了点对点穿透。

## 准备工作

- 一台具有公网 IP 的服务器，可以去购买阿里云服务器，腾讯云服务器或者 Vultr

- frp 工具软件可以去这个 https://github.com/fatedier/frp/releases 地址下载 frp 的客户端和服务端软件，由于我自己服务器安装的是 ubuntu 64 位，客户端用的是 windows ，所以就下载了图片中红色标注的版本，大家可以根据自己的系统的版本去下载。linux_amd64.tar.gz 放在服务器上，windows_386 作为客户端使用

  ![image-20201102173221758](https://static.aalmix.com/20201102173858.png)

将文件下载解压后的文件目录大概是这个样子，frpc, frpc.ini 主要是客户端使用，frps, frps.ini 主要是服务器端使用。

![image-20201102173208329](https://static.aalmix.com/20201102173902.png)

## frp 配置

### 服务端 frps.ini 文件配置

```
[common]
# 服务端与客户端通信使用的端口
bind_port = 7000
# 客户端和服务端通信的认证信息
token = 123456
```

### 客户端 frpc.ini 文件配置

```
[common]
# 服务器IP
server_addr = x.x.x.x
# 服务器端口，与 frps.ini 中的 bind_port 一致
server_port = 7000
# 客户端和服务端通信的认证信息
token = 123456
# 启用tls，frpc会使用 tls 加密连接服务器
tls_enable = true

# [] 方括号里面的名称需要保证唯一
[ssh]
type = tcp
# 客户端的 IP 地址
local_ip = 127.0.0.1
# 客户端需要映射出去的端口
local_port = 22
# 远程
remote_port = 6000
```

## 实战

### 1. 使用 frp 实现内网机器的远程连接

将 frpc.ini 改成如下配置，假设 frps 所在服务器的公网 IP 为 x.x.x.x，我们需要将本地的 3389 端口（远程连接使用的端口）映射到远程的 7402 端口

```
[common]
server_addr = x.x.x.x
server_port = 7000
token = 123456
[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
[mstsc] # 名字随便取，但不能重复
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 7402
```

在服务器端启动 frps

```
./frps -c ./frps.ini
```

在客户端启动 frpc, windows 客户端需要使用命令行运行一下命令，不能直接双击运行

```
./frpc -c ./frpc.ini
```

然后我们就可以使用远程桌面连接我们内网的电脑了，注意端口使用的 remote_port，远程桌面的体验就取决于服务器的带宽了

![image-20201102173541252](https://static.aalmix.com/20201102173908.png)

我们可以将多台电脑的 3389 端口映射出去，但需要每台电脑使用的 remote_port 不能相同，[mstsc] 也不能相同，如果同时已经开了 1 台电脑的远程连接，那么远程第二台的时候需要选择其它用户进行登录。

![image-20201102173622633](https://static.aalmix.com/20201102173910.png)

### 2.实现内网 web 端口转发，可以用于微信接口本地开发

frps.ini

```
[common]
bind_port = 7000
token = 123456
vhost_http_port = 8080
```

frpc.ini

```
[common]
server_addr = x.x.x.x
server_port = 7000
token = 123456
[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
[mstsc]
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 7402
[web]
type = http
local_ip = 127.0.0.1
local_port = 8078
custom_domains = www.youdomain.com
```

这里的配置文件多了一个 token 的配置，token 用于验证连接，只有服务器端和客户端的 token 相同才能正常访问,避免被别人恶意攻击。重新启动 frps 和 frpc，然后我们就可以通过 [www.youdomain.com](http://www.youdomain.com/):8080 访问 内网地址的 8078 端口了，8080 端口是 frps 中配置的 vhost_http_port 端口。

![image-20201102173744935](https://static.aalmix.com/20201102173915.png)

**没有域名的配置 **

```
# frps.ini
[common]
bind_addr = 0.0.0.0
bind_port = 7000
privilege_token = 12345678


# frpc.ini客户端配置
[common]
server_addr = 服务端IP
server_port = 7000
privilege_token = 12345678

[httpname]
type = tcp
local_port = 80
local_ip = 127.0.0.1
remote_port = 8080

通过 服务端IP:8080既可访问到对应穿透的服务
```

## 参考

1. 官网说明文档 https://github.com/fatedier/frp/blob/master/README_zh.md

2. 将 frp 注册为 windows 服务 https://www.cnblogs.com/mobaids/p/11567899.html 【测试通过】

3. frp 使用 nginx 配置多个 http 代理 https://github.com/fatedier/frp/issues/287

4. 没有域名的访问 web 服务的配置https://www.cnblogs.com/sanduzxcvbnm/p/8509150.html 【测试通过】

5. 使用二级域名的方式访问多个 web 服务 https://blog.csdn.net/u012577474/article/details/99690716
