---
title: 让 nginx 支持多域名站点
date: 2021-05-19 18:45:30
tags: ["nginx"]
---



#### 需求

现在有2个域名，网站部署都同一个公网IP服务器上面，其中站点A已经占用了公网IP的 80 端口，现在想实现两个域名都能通过80端口访问，域名B 访问时不需要添加端口号

```
www.siteA.com => 111.111.111.111:80
www.siteB.com => 111.111.111.111:9091
```



#### 之前的做法

域名A的解析保持不变，域名B 在DNS解析中添加一个隐性URL记录。

![image-20210519193856059](https://static.aalmix.com/20210519194401.png)

当我们访问域名B的时候，浏览器返回的一串下图所示的HTML代码，本质上还是嵌套一个 frame 。

![image-20210519192104079](https://static.aalmix.com/20210519194405.png)



但是这样无法正常显示域名B的标题，本来想通过 JS 代码去修改，奈何由于浏览器跨域的安全性问题导致无法修改，只要作罢。



#### 解决方法

后来还是通过 nginx 解决，在 nginx.conf 中配置两个 server，同时监听 80 端口，当使用浏览器访问不同的域名时，通过 nginx 代理转发到实际程序的端口上。

```

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    client_max_body_size 100M;
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  www.siteA.com;  # 站点A
        charset UTF-8;
        location / {            
            proxy_pass http://localhost:9090;
        }
    }
	
	
	server {
        listen       80;
        server_name  www.siteB.com; # 站点B
        charset UTF-8;
        location / {            
            proxy_pass http://localhost:9091;
        }
		error_page 404  /404.html; 
    }

}

```

