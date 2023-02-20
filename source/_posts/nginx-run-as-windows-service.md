---
title: 在windows服务器上将nginx安装成服务
date: 2021-05-19 12:46:06
tags: ["nginx"]
---

在 windows 服务器上将 nginx 注册成服务需要借助第三方软件 `Windows Service Wrapper`，简称 winsw，下面介绍如何使用

1. 首先去下载 winsw 软件，[下载地址](https://github.com/winsw/winsw/releases), 我下载的是 `WinSW.NET4.exe` ,因为我的服务器上安装了 .NET Framework 4.0，当然你也可以选择下载其他的版本，然后把下载后的文件放在和 nginx.exe 相同目录当中。

   ![image-20210519130237719](https://static.aalmix.com/20210519133028.png)



2. 将 `WinSW.NET4.exe` 文件重命名为 `nginx-service.exe`，这样方便在任务管理器中查找进程。

   ![image-20210519132458822](https://static.aalmix.com/20210519133034.png)

3. 创建 `nginx-service.xml` 文件，将下面的内容复制进去（你可能需要改下nginx的路径）

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<service>
  <id>nginx</id>
  <name>Nginx Service</name>
  <description>High Performance Nginx Service</description>
  <executable>D:\soft\nginx-1.20.0\nginx.exe</executable>
  <logpath>D:\soft\nginx-1.20.0\</logpath>
  <logmode>roll</logmode>
  <depend></depend>
  <stopargument>-s</stopargument>
  <stopargument>stop</stopargument>
</service>
```

> 注意：**停止的参数需要分开写成2行，要不然停止 nginx 服务会不成功**

4. 在命令行中运行 `nginx-service.exe install` 安装服务，安装成功后，你可以在服务中查看到

![微信截图_20210519130929](https://static.aalmix.com/20210519133037.png)

  

后面你可以通过下面的命令管理 nginx 服务

```bash
net start nginx  # 启动服务
net stop nginx   # 停止服务

nginx-service.exe start # 查看服务状态
nginx-service.exe status # 查看服务状态
nginx-service.exe stop  # 停止服务
nginx-service.exe restart  # 重启服务
nginx-service.exe uninstall  # 卸载服务
```

