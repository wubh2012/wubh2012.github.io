---
title: "美化 Windows Terminal"
date: 2022-07-30T17:19:16+08:00
draft: false
tags: ["shell", "windows terminal"]
---

![20220730172459](https://static.aalmix.com/20220730172459.png)

## 安装 PowerShell7

打开这个[链接](https://docs.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2)去下载 PowerShell7 安装包直接运行就完了

## 安装 [on-my-posh](https://ohmyposh.dev/docs/installation/windows)

执行下面命令 powershell 将安装 on-my-posh 并且应用 on-my-posh 最新主题

```
Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://ohmyposh.dev/install.ps1'))
```

## 安装字体

去 Nerd Fonts 下载 Caskaydia Cove Nerd Font 字体，然后 `Ctrl+Shift+,` 打开 Windows Terminal 设置，配置 powershell 7 的字体

```
{
	"colorScheme": "One Half Dark",
	"guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
	"hidden": false,
	"name": "PowerShell",
	"source": "Windows.Terminal.PowershellCore",
	"font":
	{
		"face": "CaskaydiaCove NF",
		"size": 12
	}
}
```

## 选择主题

先使用 `notepad $PROFILE` 命令打开 PowerShell 的配置文件，然后在配置文件中添加下面的命令

```
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\zash.omp.json" | Invoke-Expression
```

## 安装文件图标库

```
Install-Module -Name Terminal-Icons -Repository PSGallery
```

使用图标需要在 $PROFILE 文件中添加下面命令

```
Import-Module -Name Terminal-Icons
```

## 设置命令行自动补全和提示

```
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
```

## 其他设置

将 Git Bash 添加到 Windows Terminal

```
Git Bash命令行 "C:\Program Files\Git\bin\bash.exe" --login -i
启动目录 %USERPROFILE%
图标 C:\Program Files\Git\mingw64\share\git\git-for-windows.ico
```

---

完整的 powershell 设置如下：

```
oh-my-posh init pwsh | Invoke-Expression
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\powerlevel10k_rainbow.omp.json" | Invoke-Expression

Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
Import-Module -Name Terminal-Icons
Import-Module posh-git

```

参考连接： https://docs.microsoft.com/zh-cn/windows/terminal/tutorials/custom-prompt-setup
