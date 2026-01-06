---
title: golang modules
---
# Go Modules 
go modules 是 Go 语言的官方依赖管理工具，自 Go 1.11 版本开始引入，在 Go 1.16 版本成为默认的依赖管理模式，下面是一些依赖管理相关的一些命令以及规范

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
## 其他命令
```bash
go list -m all              # 查看当前项目依赖列表
go run main.go              # 运行单个文件
go run ./cmd/server         # 运行目录下的 main 包
go install                  # 编译并安装到 $GOPATH/bin 或 go env GOBIN

go test                     # 运行测试
go test -v                  # 显示详细信息
go test ./...               # 递归运行所有测试
go test -bench=.            # 运行基准测试（性能测试）

go fmt ./...                # 格式化所有代码
go vet ./...                # 静态分析，检查可能的错误
go doc fmt.Println          # 查看某个函数/包的文档
go env                      # 查看 Go 环境变量

go clean -modcache          # 清理依赖缓存（GOPATH/pkg/mod）
go clean -testcache         # 清理测试缓存

# 其他
go help                     # go常见命令查看
go bug                      # go bug反馈
go fix                      # api升级助手，旧的api使用该命令后自动进行升级
go generate                 # 在源码里标记要执行的命令 → go generate 扫描注释并运行 → 自动生成代码文件
go work                     # 管理多模块工作区，方便在本地同时开发多个 Go 模块，避免频繁写
go tool                     # go tool 提供了底层的“专业工具箱”，用于调试、分析、编译细节
go vet                      # Go 的静态检查工具，用来发现可能导致 bug 的代码，而不是格式问题
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

## 项目结构

golang 社区推崇的最佳实践：https://github.com/golang-standards/project-layout

个人喜欢的项目结构
```text
admin-gin/
├── api/                   # 接口定义层
│   └── openapi/           # 存放 OpenAPI (Swagger) 接口规范文档
├── cmd/                   # 项目入口（编译后的二进制文件从此开始）
│   ├── migrate/           # 数据库迁移脚本/程序入口
│   ├── openapi/           # 接口文档相关的生成工具入口
│   └── server/            # 主服务入口（main 函数所在，启动 Web 服务）
├── configs/               # 配置文件目录
│   ├── config.example.yaml # 配置文件模板（不含敏感信息，提交给 Git）
│   ├── config.go          # Go 代码：负责加载、解析配置文件到结构体中
│   └── config.yaml        # 本地实际运行的配置文件（包含数据库密码等，通常不提交）
├── docs/                  # 项目文档（设计文档、部署文档等）
├── internal/              # 内部代码（核心业务逻辑，禁止被外部项目直接引用）
│   ├── app/               # 业务逻辑应用层
│   │   └── admin/         # 具体的后台管理业务模块
│   ├── boot/              # 系统初始化/引导启动
│   │   ├── app.go         # 负责初始化各种组件（DB、Redis 等）
│   │   └── register.go    # 负责路由注册或服务注册逻辑
│   └── pkg/               # 项目内部共享的工具包（通用但私有）
│       ├── cookie/        # Cookie 操作封装
│       ├── database/      # 数据库连接与初始化（MySQL, GORM 等）
│       ├── http/          # HTTP 请求/响应的统一封装
│       ├── jwt/           # JWT 用户鉴权逻辑
│       ├── logger/        # 日志打印封装
│       ├── middleware/    # Gin 中间件（如权限校验、日志记录、跨域等）
│       └── uuid/          # ID 生成工具
├── .gitignore             # Git 忽略文件配置
├── go.mod                 # Go Modules 项目依赖管理文件
├── go.sum                 # 依赖包版本锁定与安全校验文件
├── Makefile               # 自动化编译/脚本执行工具
└── README.md              # 项目介绍和运行说明
```

命名规范

| 类型 | 规范 | 示例 |
| :--- | :--- | :--- |
| **包名 (Package)** | 简短、全小写、单数、避免下划线 | `net/http` (Good), `net_http` (Bad) |
| **变量/常量** | CamelCase (驼峰)，首字母大小写控制权限 | `userCount`, `ExportedVar` |
| **缩写** | 专有名词缩写必须全大写或全小写 | `ServeHTTP` (Good), `ServeHttp` (Bad); `ID` (Good), `Id` (Bad) |
| **接口 (Interface)** | 单方法接口以 `er` 结尾 | `Reader`, `Writer`, `Formatter` |
| **Getter/Setter** | 读取器不加 Get 前缀 | `obj.Owner()` (Good), `obj.GetOwner()` (Bad) |

## 包/变量引用

### 包定义

1. 声明：每个`.go`文件第一行必须是 `package <name>`
2. 目录结构：每个文件夹目录下的所有`.go`文件都属于一个包
3. main 包：`package main`是程序的入口包，编译后会生成可执行文件

### 包引用：

1. 使用`import`关键词进行导入

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello World")
}
```

2. 引用方式

* 分组引用

```go
import (
	"fmt"
	"math"
)
```

* 别名引用：可能会存在相同名字的包名，这时可以使用别名进行导入

```go
import m "math"
// 使用时：m.Sin(0)
```

* 匿名引用：仅执行包内的`init()`函数

:::tip

**Init 函数**：每个包可以包含多个 init() 函数，它们在包被引用时自动执行，且早于 main 函数。

:::

```go
import _ "github.com/go-sql-driver/mysql"
```

* 点引用：不用跟包名，可以直接使用包内的函数或者变量（不推荐）

```go
package main

import (
	. "fmt"
)

func main() {
	Println("Hello World")
}
```

## 变量访问

go中没有java中的`public`、`private`等关键字，主要通过`首字母大小写`决定可见性

1. 导出：如果一个变量、函数、结构体或接口以**大写字母**开头，那么它可以被**外部包**访问
2. 未导出：如果以**小写字母**开头，它只能在**同一个包内**访问（包内跨文件可见）

示例：

```go
package utils

// ExportedVar 大写开头，外部可见
var ExportedVar = 100

// internalVar 小写开头，仅 utils 包内可见
var internalVar = 10

// Add 大写开头，外部可调用
func Add(a, b int) int {
    return a + b
}

// secretCalculation 小写开头，仅内部使用
func secretCalculation() {}

// User 结构体及其导出字段
type User struct {
    Name string // 外部可见
    age  int    // 外部不可见（私有）
}
```

