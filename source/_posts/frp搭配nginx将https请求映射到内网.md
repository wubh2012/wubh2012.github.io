---
title: frp搭配nginx将https请求映射到内网
date: 2020-12-19 16:01:12
tags: ["frp", "nginx"]
---

最近做微信小程序开发，发现正式发布的时候后台 webapi 服务必须是 https 协议的，当然开发的时候可以勾选不校验域名
![image-20201219160934257](https://static.aalmix.com/20201219163456.png)

我们之前使用 frp 将内网服务映射出去后只能提供 http 协议的形式访问，无法使用 https 协议，这个怎么办呢？

经过一番资料查找，发现需要搭配 nginx 一起使用就可以解决。
![image-20230218223202953](https://static.aalmix.com/image-20230218223202953.png)

首先我们需要给我们的域名申请一个免费的 SSL 证书，腾讯云和阿里云都有免费的。

第二步，配置内网 fprc.ini ，这里我们将本地的 8099 端口映射到远程的 8099 端口

```
[common]
server_addr = 云服务器IP地址
server_port = 7000
token = 123456
[wx_webapi]
type = tcp
local_ip = 127.0.0.1
local_port = 8099
remote_port = 8099
```

服务器端的配置 frps.ini

```
[common]
bind_port = 7000
token = 123456
```

这样我们就可以通过访问 http://云服务器 IP 地址:8099 访问内网的 webapi 了

第三步，在云服务器上使用下面的命令安装 nginx

```
sudo apt-get install nginx
```

第四步，将申请的 SSL 证书复制到云服务器上，并开始配置 nginx ，

```
sudo vi /etc/nginx/nginx.conf
```

```
server{
    ssl on;
    listen 18099;
    server_name www.abc.com;      # 域名
    ssl_certificate server.crt;      # 配置 SSL 证书
    ssl_certificate_key server.key;  # 配置 SSL 证书
    ssl_session_timeout 5m;

    location / {
        proxy_pass http://127.0.0.1:8099; #外部请求18099端口时，nginx会将请求代理转发到本地的8099端口
        proxy_set_header Host $http_host;
        proxy_set_header Connection "Upgrade";
    }
}
```

第四步，启动 nginx

```
start nginx
```

这样外部请求 18099 端口时，nginx 会将请求代理转发到本地的 8099 端口，也就是 frp 内网穿透的端口，

那么当我们请求 https://www.abc.com:18099 时，实际上请求的内网服务器的 8099 端口

这样我们就解决了 https 访问的问题了！
