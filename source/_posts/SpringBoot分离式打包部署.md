---
title: SpringBoot使用Jar包分离式部署
date: 2023-07-16 16:33:22
tags: ['SpringBoot', '部署']
---

## 前言

最近有一个项目本来是前后端分离部署，后来由于某种需要把前端项目集成在后端中，但前端有时改动较多，每次改动都要重新打包，然后再上传到服务器上。打包后的 jar 包文件大小在 90M 左右，每次上传大约需要 4 分钟左右，还是挺费时间的，也无法快速响应修改，所以想有没有办法将前端的资源文件，还有依赖的 jar 包也分离出来。

## 解决方法

默认 `SpringBoot` 项目使用 `spring-boot-maven-plugin` 插件打包后会将所有的资源文件，依赖包都放在一个 jar 包里面。
我们先修改 pom.xml 文件将默认的打包的 jar 包文件放在 target/full 文件中，避免和分离式的弄混了。

```
<!--这个是springboot的默认编译插件，他默认会把所有的文件打包成一个jar，存放在 target/full 目录中-->
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <version>2.1.1.RELEASE</version>
    <configuration>
        <fork>true</fork> <!-- 如果没有该配置，devtools不会生效 -->
        <includeSystemScope>true</includeSystemScope><!--外部进行打包-->
        <outputDirectory>${project.build.directory}/full</outputDirectory>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>repackage</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### 分离式 pom 文件配置

下面是分离式 jar 包打包的配置，我们需要借助 `maven-jar-plugin`，`maven-dependency-plugin`，`maven-resources-plugin` 这三个插件。

- maven-jar-plugin：配置需要剥离的依赖和文件，打包后也会生成一个 jar 文件，但是文件大小会比较小。
- maven-dependency-plugin：将依赖的 jar 包复制到 lib 目录，比如 mybatis, thymelaef, spring-security 等
- maven-resoources-plugin：将 resources 目录下的文件复制到指定的地方。

```
<!--分离式Jar包打包配置开始-->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <configuration>
        <outputDirectory>${project.build.directory}</outputDirectory>
        <!-- 将配置文件排除在jar包中，在本例当中我将 static, yml, templates 都剥离出来了 -->
        <excludes>
            <exclude>*.properties</exclude>
            <exclude>*.yml</exclude>
            <exclude>*.xml</exclude>
            <exclude>*.txt</exclude>
            <exclude>static/**</exclude>
            <exclude>templates/**</exclude>
        </excludes>
        <archive>
            <!-- 生成的jar中，包含pom.xml和pom.properties这两个文件 -->
            <addMavenDescriptor>true</addMavenDescriptor>
            <!-- 生成MANIFEST.MF的设置 -->
            <manifest>
                <!--这个属性特别关键，如果没有这个属性，有时候我们引用的包maven库 下面可能会有多个包，并且只有一个是正确的，
                其余的可能是带时间戳的，此时会在classpath下面把那个带时间戳的给添加上去，然后我们 在依赖打包的时候，
                打的是正确的，所以两头会对不上，报错。 -->
                <useUniqueVersions>false</useUniqueVersions>
                <!-- 为依赖包添加路径, 这些路径会写在MANIFEST文件的Class-Path下 -->
                <addClasspath>true</addClasspath>
                <!-- MANIFEST.MF 中 Class-Path 各个依赖加入前缀 -->
                <!--这个jar所依赖的jar包添加classPath的时候的前缀，需要 下面maven-dependency-plugin插件补充-->
                <!--一定要找对目录，否则jar找不到依赖lib-->
                <classpathPrefix>lib/</classpathPrefix>
                <!--指定jar启动入口类 -->
                <mainClass>com.aalmix.Application</mainClass>
            </manifest>
            <manifestEntries>
                <!-- 假如这个项目可能要引入一些外部资源，但是你打包的时候并不想把 这些资源文件打进包里面，这个时候你必须在
                这边额外指定一些这些资源文件的路径,假如你的pom文件里面配置了 <scope>system</scope>,就是你依赖是你本地的
                资源，这个时候使用这个插件，classPath里面是不会添加，所以你得手动把这个依赖添加进这个地方 -->
                <!--MANIFEST.MF 中 Class-Path 加入自定义路径，多个路径用空格隔开 -->
                <!--此处 config 文件夹的内容，需要maven-resources-plugin插件补充上 -->
                <Class-Path>./config/</Class-Path>
            </manifestEntries>
        </archive>
    </configuration>
</plugin>
<!-- 复制依赖的jar包到 lib 文件夹中 -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>3.1.2</version>
    <executions>
        <execution>
            <id>copy-lib</id>
            <phase>package</phase>
            <goals>
                <goal>copy-dependencies</goal>
            </goals>
            <configuration>
                <!-- 拷贝项目依赖包到指定目录下 -->
                <outputDirectory>${project.build.directory}/lib/</outputDirectory>
                <!-- 是否排除间接依赖，间接依赖也要拷贝 -->
                <excludeTransitive>false</excludeTransitive>
                <!-- 是否带上版本号 -->
                <stripVersion>false</stripVersion>
                <includeScope>runtime</includeScope>
            </configuration>
        </execution>
    </executions>
</plugin>
<!-- 用于复制资源文件到 config 文件中 -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <executions>
        <!-- 复制资源文件 -->
        <execution>
            <id>copy-resources</id>
            <phase>package</phase>
            <goals>
                <goal>copy-resources</goal>
            </goals>
            <configuration>
                <resources>
                    <resource>
                        <directory>src/main/resources</directory>
                        <includes>
                            <!--配置需要复制的文件-->
                            <include>*.properties</include>
                            <include>*.yml</include>
                            <include>*.xml</include>
                            <include>*.txt</include>
                            <include>static/**</include>
                            <include>templates/**</include>
                        </includes>
                    </resource>
                </resources>
                <!--输出路径-->
                <outputDirectory>${project.build.directory}/config</outputDirectory>
            </configuration>
        </execution>
    </executions>
</plugin>

<!--分离式Jar包打包配置结束-->
```

![微信截图_20230716173306](https://static.aalmix.com/202307161754552.png)

![image-20230716173647399](https://static.aalmix.com/202307161756224.png)

![image-20230716173729820](https://static.aalmix.com/202307161756277.png)

![image-20230716173810633](https://static.aalmix.com/202307161756830.png)

config：所有的配置文件、静态文件会存放在 config 文件夹下

full：这里面放的式是不分离的完整的 jar 包

lib：这是所有依赖的 lib 包文件

fireworks-mobile.jar：这是分离之后的 jar 包

运行程序也是使用下面命令

```
java -jar fireworks-mobile.jar
```

### 依赖的第三包 jar 包如何处理

我们的项目使用了第三方 jar 包，直接在 pom.xml 文件中引用并没有安装到本地 maven 当中。

```
<dependency>
    <groupId>cas</groupId>
    <artifactId>xxwindow</artifactId>
    <scope>system</scope>
    <version>1.0.6</version>
    <systemPath>${project.basedir}/src/main/resources/lib/plat-local-core-1.0.6.jar</systemPath>
</dependency>
```

当我们使用上面的分离式配置打包运行后，发现会提示 `ClassNotFoundException`

![image-20230716174008123](https://static.aalmix.com/202307161756708.png)

这是因为 maven 默认是不会将 system scope 的 jar 放入 lib 目录，这个时候需要一些特殊处理。

1. 修改 `maven-jar-plugin` 的 `manifestEntries` 节点下的 `Class-Path` 配置

   ```
       <manifestEntries>
        <!--
          打包后还需要将项目中 lib/plat-local-core-1.0.6.jar 手动复制到打包后的 lib目录中,
          注意./config 后面有一个空格。
        -->
        <Class-Path>./config/ lib/plat-local-core-1.0.6.jar</Class-Path>
       </manifestEntries>
   ```

2. 在打包后将项目中 lib/plat-local-core-1.0.6.jar 手动复制到打包后的 lib 目录中，这样程序运行起来的时候才不会出错。

   ![image-20230716174407163](https://static.aalmix.com/202307161756822.png)

## 总结

使用分离式打包后，项目有改动只需要替换一小部分，后端改动就上传jar包，前端有改动就上传 static 目录或 html 文件，再也不用像之前那样重新上传整个 90M 的 jar 包，这样能节约大量上传的时间，毕竟人生苦短，要把时间花在有意义的事情上。

## 参考文章

[SpringBoot分离打包：将jar包与lib依赖、配置文件分开_是小宗啊？的博客-CSDN博客](https://blog.csdn.net/shaofengzong/article/details/121191018)
