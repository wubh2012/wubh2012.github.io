---
title: "Docker 指南"
date: 2022-04-09T10:37:09+08:00
draft: false
tags: ["docker"]
---

# Docker 指南

本文的目的是解释与 Docker 相关的重要概念，以便能够有效的使用 Docker 开发应用程序。

## 什么是 Docker?
Docker 是一个能够在独立的环境中运行应用程序的的工具。

它可以确保应用程序能在独立的环境下运行，应用程序能够按预期的那样在不同的机器/服务器上运行。这样可以确保在本地开发应用程序，部署到服务器环境上也可以运行。对于开发人员来说，Docker 能够在任何计算机上按照预期快速的启动和运行程序，与其他开发人员协作时也不需要关心他们的电脑配置如何。

在不同的电脑上运行应用程序之所以这么困难，是因为必须先正确的安装应用程序所依赖的软件版本。例如，假如在一台安装了Node.js 12.8 版本的电脑上可以正常运行一个由 Node.js 构建的API项目，换到一台安装了 Node.js 10.18 版本的电脑上可能不一定就能运行起来，因为使用的API可能不一样。其他的应用程序可能也会有同样的问题，比如 python, ruby, php, typescript, mysql 等等。Docker 的出现使得构建容器化的应用程序成为了可能，这些应用程序都自带了依赖项的正确版本，可以在不同电脑上运行。

Docker 有4种类型的“对象”来创建这些隔离的环境：images(镜像), containers(容器)，volumes(存储卷) 和 network(网络)。我们使用最多的还是 Docker images 和 Docker containers。

Docker images(镜像)理解为一个包含了操作系统和应用的对象，Docker containers(容器)是用来运行Docker镜像中代码的环境。Docker 镜像可以保存到Docker仓库中心，供其他人下载使用。目前最流行的Docker 仓库是 Docker Hub。

Docker volumes(存储卷) 用于保存容器所产生的数据，将数据保存到 Docker 存储卷中后，即使 Docker 容器被删除、重新创建、重新启动，数据也不会丢失。Docker volumen支持2个容器共享访问相同的数据，只需要将容器的的存储卷指向相同的位置就可以。

Docker network(网络) 可以用来隔离容器，可以允许容器之间彼此通信。

## 那么虚拟机呢 virtual machines？

经常出现虚拟机(vm)与 Docker 相关的话题，因为它们都用来创建隔离的环境。
使用 Docker后，应用程序将在容器的独立环境下运行，这些容器中的每一个都共享同一个电脑上的操作系统内核。另一方面，在虚拟机上运行的应用程序运行在自己的操作系统上，不共享底层内核，虚拟机在 hypervisor 帮助下运行和管理要运行的操作系统。

虚拟机配图



使用Docker相对于虚拟机来说有压倒性的优势，Docker容器可以在几秒钟到几分钟运行起来，而且是轻量级的（MB 相对于GB的大小），容易配置，并且只使用少量的资源。也许使用虚拟机而不是Docker的唯一原因是，由于担心 Docker 容器在主机操作系统上使用共享内核会产生安全漏洞，因此需要更高级别的隔离。

配图说明Docker和VM的优缺点

使用图片说明 Docker 镜像对于虚拟机来说有多小

## Docker engine

## 安装 Docker
目前安装 Docker 相关依赖的最简单的方法是安装 Docker Desktop. Docker Desktop 附带了几个与 Docker 相关的工具，包括 Docker Engine、Docker CLI 和 Docker Compose。
对于 Mac 和 Windows 用户可以通过下面的链接进行下载安装

* Mac https://docs.docker.com/docker-for-mac/install/
* Windows https://docs.docker.com/docker-for-windows/install/

安装以后，请确保 Docker Desktop 正在运行。如果 Docker Desktop 正在运行，则意味着 Docker Engine 已启动，并且本文提到的 Docker CLI 命令也能执行。

配图！

对于 Linux 用户来说并没有 Docker Desktop软件，所以每个组件必须单独安装

- [Docker Engine + CLI ](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

在 Linux 系统当中，需要通过下面的命令启动 Docker 的守护进程

```sh
sudo systemctl start docker
```

上面的命令应该可以正常运行，因为 `systemctl` 已经在大多数 Linux 发行版中集成了，如果无法运行那么请使用 `sudo service docker start` 命令。这是另一种可以在 Linux 开机时自动启动 Docker。

## Dockerfile

`DockerFile` 是一个如何构建镜像的说明文件。这个文件通常首先会指定一个基础的Docker镜像，例如，如何需要构建一个机遇 python 的API ，那么就可以使用一个安装了 python 环境的Linux操作系统作为Docker基础镜像，指定这个基础镜像之后使用其他指令来构建Docker镜像。

```
# 使用安装了Node12.16.1版本的Linux操作系统作为基础镜像
FROM node:12.16.1-alpine3.11

# Installs some dependencies required for the Node.js API
# 安装 Node.js 依赖
RUN apk add --no-cache make g++

# Indicates that the API exposes port 3000
# 对外暴露 3000 端口
EXPOSE 3000

# Specifies the working directory. All the paths referenced after this point will be relative to this directory.
# 指定工作目录
WORKDIR /usr/src/app

# Copy all local source files into the Docker container's working directory
# 将本地文件复制到镜像的工作目录当中
COPY . .

# Installs NPM dependencies using yarn
# 使用 yarn 安装项目依赖
RUN yarn install

# Command to start the API which will get executed when a Docker container using this image is started.
# 当容器运行的时候将会执行 yarn start 命令
CMD [ "yarn", "start" ]
```

下面列出了常用的指令说明，完整的列表请查看 [Docker 官方文档](https://docs.docker.com/engine/reference/builder/)


如果有一些文件不需要复制到 Docker 镜像当中，那么可是在 Dockerfile 同级目录下面添加一个 `.dockerignore`文件，这样使用 `COPY`或 `ADD`指令的时候将不会把`.dockerignore`中指定文件复制到Docker镜像当中。更多关于`.dockerignore` 语法问题请参考这个[链接](https://docs.docker.com/engine/reference/builder/#dockerignore-file)。

## Docker image

镜像由多个层组成，每层叠加之后，从外部看就如同一个独立的对象。镜像内部是一个精简的操作系统，同时还包含应用运行所必须的文件和依赖包。因为容器的设计初衷就是快速和小巧，所以镜像通常比较小。

### 构建镜像和给镜像打标签

使用 `docker build `命令来创建镜像，当构建镜像时会提供一个 `--tag`选项给镜像打标签，这样就知道从镜像仓库中使用哪个镜像，或者在运行容器时使用哪个镜像了。 

```
docker build --tag my-app:1.0 . 
# --tag 可以简写成 -t
docker build -t my-app:1.0 .
```
![image-20210516164412510](https://static.aalmix.com/image-20210516164412510.png)

分解上面的命令

- `docker build` 指定正在创建Docker镜像
- `--tag my-app:1.0` 指定给镜像命名为 my-app 并且标记为1.0 版本
- `.`  最后一个点表示 Docker 镜像是由当前目录的Dockerfile 构建的。

使用 `docker images` 命令可以查看所有的本地的镜像，这样就可以验证镜像刚刚已经创建成功

```
docker images
```
![image-20210516164445416](https://static.aalmix.com/image-20210516164445416.png)

如果构建镜像时只有 `--tag`并没有指定版本的话，那么默认使用的版本就是 `latest`。

```
docker build --tag my-app .
docker images
```
![image-20210516164919632](https://static.aalmix.com/image-20210516164919632.png)

除了使用 `docker build --tag ` 命令给镜像打标签之外，还可以使用 `docker tag`命令。因为同一个镜像可以有多个标签，使用`docker tag `可以给通过`docker build --tag`构建的镜像打上新的标签。
![image-20210516170500356](https://static.aalmix.com/image-20210516170500356.png)

注意：现在my-app有多个镜像版本，它们的 Image ID 都相同但 Repository Name 却不同，但实际上它们都同一个镜像，Repository Name 与使用 `docker push`将镜像推送到Docker镜像仓库的名称有关，在此处不详细展开讲。

> 注意镜像的标签是可变的
>
> 假设镜像golftrack:1.5存在一个已知的Bug。因此可以拉取该镜像后修复它，并使用相同的标签将更新的镜像重新推送回仓库。一起来思考下刚才发生了什么。镜像golftrack:1.5存在Bug，这个镜像已经应用于生产环境。如果创建一个新版本的镜像，并修复了这个Bug。那么问题来了，构建新镜像并将其推送回仓库时使用了与问题镜像相同的标签！原镜像被覆盖，但在生产环境中遗留了大量运行中的容器，没有什么好办法区分正在使用的镜像版本是修复前还是修复后的，因为两个镜像的标签是相同的！
>
> 这个时候就不要通过镜像的摘要进行获取镜像了
>
> docker image pull nginx@sha256:c3dcdb92d7432d56604d....



### 列出镜像

使用`docker images` 或 `docker images ls` 命令可以列出当前本地可用的Docker 镜像

```
docker images
docker images ls
```



### 拉取和推送镜像

Docker 镜像可以保存在Docker镜像注册中心，默认的中心是 Docker Hub 。从Docker Hub拉取镜像使用`docker pull`命令：

```
docker pull nginx:1.18.0
```

上面的命令将从Docker Hub 拉取官方的 1.18.0 版本的 nginx 镜像。
![image-20210516172205211](https://static.aalmix.com/image-20210516172205211.png)

如果不指定nginx 的版本，默认会拉取标记为`latest`最新的版本。

上面使用nginx 镜像都是来自Docker Hub的官方镜像，官方的镜像一般都是经过Docker Hub正式批准的镜像，并且这些镜像会定期进行安全漏洞测试。

任何人都可以在Docker Hub上创建自己的账号和仓库，并箱仓库中推送镜像。把镜像推送到Docker Hub意味着镜像被保存在Docker Hub 中。docker push 命令的形式类似下面的命令

```
docker push <hub-user>/<repo-name>:<tag> 
```

### 删除镜像

使用 `docker rmi` 或 `docker image rm` 命令可以删除镜像

如果镜像已经被容器使用，那么需要先删除容器然后再删除镜像，或者使用`docker rmi `命令加上`--focus` 选项

```
docker rmi --focus my-app:1.0
```

这里有两个命令，可以一次性清除所有镜像

```
docker rmi $(docker images -a -q)  # remove all images
docker rmi $(docker images -a -q) -f  # same as above, but forces the images associated with running containers to also be removed
```

### 保存和加载镜像

在某些情况下，需要将镜像保存到一个文件中，然后重新加载到Docker主机当中。使用`docker save`命令保存镜像

```
docker save --output my-app.tar my-app:1.0 
```

上面命令是将1.0版本的my-app 镜像保存成 tar 文件，然后我们可以使用`docker load`命令将新保存的 tar 文件加载到Docker 主机当中

```
docker load --input my-app.tar
```



## Docker container

容器是镜像的运行时实例。

### 运行容器

通过 `docker run ` 命令启动容器

```
docker run my-app:1.0
```

上面的命令将会使用 my-app 1.0 的镜像创建容器，执行 `docker run `命令后将会启动容器，还会执行在 Dockerfile 中指定的 CMD 命令。使用 `docker ps `命令可以列出当前所有正在运行的容器。

容器创建成功会Docker会随机生成一个 ContainerID 和 Container Name给容器，我们也可以通过添加 `--name `参数给容器取个好记的名字

```
docker run --name my-app my-app:1.0
```

通过上面的命令将运行一个叫`my-app`名字的容器

### 查看容器日志

默认情况下使用`docker run` 命令运行容器时会将容器中进程的执行日志实时的输出到当前启动的控制台，然而我们可以通过使用 `-d` 参数在分离模式下运行容器，这样就可以继续在控制台中执行命令

[配图说明区别]

```
docker run -d my-app:1.0 
```

如果使用分离模式运行容器，那么我们可以使用`docker logs`命令查下容器的日志

```bash
# 通过容器ID查看
docker logs 容器ID
# 通过容器名称查看
docker logs my-app 
```

### 暴露端口

Dockerfile 和 save 打包镜像的区别

Dockerfile 可以查看详细的历史，

save 的方式就无法查看打包的历史了，不知道给镜像做了什么事情




