---
title: golang modules
---
# Go Modules 
go modules 是 Go 语言的官方依赖管理工具，自 Go 1.11 版本开始引入，在 Go 1.16 版本成为默认的依赖管理模式，下面是一些依赖管理相关的一些命令

## go mod

模块初始化: init 后面跟你项目想要命名的模块名称，初始化后，根目录会有两个文件

* `go.mod`（记录项目依赖以及版本号）
* `go.sum`（初次下载会生成hash值并记录，再次安装时会进行hash校验，确保依赖一致）

```bash
go mod init example.com/myproject
```

依赖整理：添加使用未安装的依赖，移除未使用依赖

```bash
go mod tidy
```

依赖本地缓存

```bash
go mod downlaod
```

生成 vendor 目录：将依赖复制到 vendor/，构建时可脱离网络，无网或者内网时会使用到

```bash
go mod vendor
```

校验依赖完整性：安全性比较高的项目中使用

```bash
go mod verify
```

依赖关系图查看

```bash
go mod graph
```

依赖追踪：想删除依赖不知道谁在用，可以使用这个进行依赖追踪

```bash
go mod why github.com/xxx
```

修改mod：edit 一般用于执行某些脚本，用于修改mod文件内容

```bash
go mod edit -module=example.com/newname
go mod edit \
  -replace=github.com/foo/bar@v1.2.3=github.com/foo/bar@v1.2.4
```

## go get

依赖下载: 安装某个指定依赖到项目中，不加`@1.0.0`版本号，默认是拉取最新的版本

```bash
go get github.com/xxx@1.0.0
```

移除依赖: 指定版本为@none

```bash
go get github.com/xxx@none
```

更新至最新依赖

```bash
go get github.com/xxx@latest
```

不改变主版本号更新

```bash
go get -u github.com/xxx
```

go工具链升级：例如升级 go@1.22.3 -> go@1.22.5 只升级补丁版本

```bash
go get toolchain@patch
```

## go install

主要是将代码编译成可执行文件，安装到`bin`下，供命令行使用，和`get`命令不同，install不管理项目依赖，只是安装工具

```bash
go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest
```

## go build

只执行文件编译

* man包：生成可执行文件

```bash
go build ./cmd/server
```

* 非main包：只编译检查，不生成文件

指定输出文件或者目录

```bash
go build
go build -o app
go build -o bin/app ./cmd/app
```

`跨平台构建`

linux

```bash
GOOS=linux GOARCH=amd64 go build -o app
```

windows

```bash
GOOS=windows GOARCH=amd64 go build -o app.exe
```

mac（intel）

```bash
GOOS=darwin GOARCH=amd64 go build -o app
```

mac（apple silicon）

```bash
GOOS=darwin GOARCH=arm64 go build -o app
```

