---
title: golang概述
next:
  text: 'modules'
  link: '/backend/go/basic/modules'
---

# 前言
:::info
Go（Golang）是由 Google 开发的一种静态强类型、编译型的开源编程语言，诞生于 2009年，成熟于 2012年，Go 是现代版的 C 语言，它结合了 C 的执行性能、Python 的开发速度 和 Java 的工程化能力，是目前构建高性能后端服务和云原生应用的首选语言。以下是对 Go 语言的精简概述：
:::
| 维度 | 核心要点 | 关键词 / 案例 |
| :--- | :--- | :--- |
| **设计哲学** | 极简主义、组合优于继承、强制统一风格 | 25个关键字、`struct/interface`、`gofmt` |
| **技术特性** | 原生高并发、极速编译、静态链接、自动GC | Goroutine(协程)、Channel(CSP模型)、二进制单文件 |
| **主要优势** | 性能接近C++/Java、上手快、标准库强大、跨平台 | 高执行效率、学习曲线平缓、内置HTTP/网络库 |
| **不足/争议** | 错误处理繁琐、特定领域生态稍弱、泛型引入晚 | `if err != nil`、AI/GUI支持较少、1.18版才加泛型 |
| **典型应用** | 云原生、后端微服务、区块链、运维工具 | Docker、K8s、Ethereum、Prometheus |

# 安装

## 软件包下载
官网地址：https://go.dev/dl/

## mac os 安装
1. 推荐使用 homebrew 安装，也可以下载安装包手动安装（注意mac os的系统版本 ）
```zsh
brew install go 
```
2. 配置环境变量（如果安装过程没有自动添加环境变量的话，可以执行下面的步骤进行配置）
```zsh
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.zshrc
source ~/.zshrc
```
3. 验证
```zsh
go version
```

## windows 安装
1. 安装包选择 `go1.25.5.windows-amd64.zip`进行下载
2. 配置环境变量：系统环境变量Path中没有的话需要手动添加 `你的go安装目录\bin`
3. 验证：
```bash
go version
```

## linux 安装
1. 下载并解压
```bash
wget https://go.dev/dl/go1.25.5.linux-amd64.tar.gz
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.25.5.linux-amd64.tar.gz
```
2. 配置环境变量：将 Go 的路径添加到你的配置文件中（如 ~/.bashrc 或 ~/.zshrc）
```bash
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.zshrc
source ~/.zshrc
```
3. 验证
```bash
go version
```

## 国内配置加速
:::tip
由于网络原因，在国内下载依赖包（Go Modules）会很慢或失败，强烈建议开启代理：
:::
设置国内镜像(添加了direct后，代理源如果访问失败，会兜底直接走官方源)
```bash
go env -w GOPROXY=https://goproxy.cn,direct
```
官方镜像
```bash
https://proxy.golang.org
```
国内七牛云镜像
```bash
https://goproxy.cn/
```