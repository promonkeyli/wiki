---
title: golang标准库
---
# go library（标准库）
## 文本处理与基本类型 (Text & Primitives)
基础数据的处理能力，是编程的起点。
| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`fmt`** | 格式化 I/O，终端交互 | `Printf`, `Sprintf`, `Errorf`, `Fprint` |
| **`strings`** | 不可变字符串的高效操作 | `Split`, `Join`, `Cut`, `Builder` (高效拼接), `Replacer` |
| **`strconv`** | 基本类型与字符串互转 | `Atoi`, `Itoa`, `ParseInt`, `ParseFloat`, `FormatBool` |
| **`time`** | 时间点、时段与定时器 | `Now`, `Parse`, `Time`, `Duration`, `Ticker`, `After` |
| **`unicode/utf8`** | UTF-8 编码处理 | `RuneCountInString` (统计字符数), `ValidString` |
| **`regexp`** | 正则表达式 | `Compile`, `MustCompile`, `MatchString`, `FindString` |

## 系统交互与 I/O (System & I/O)
体现 Go "Unix 哲学"（一切皆文件/流）的核心区域。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`os`** | 操作系统接口（文件/进程/环境变量） | `Open`, `ReadFile`, `WriteFile`, `Getenv`, `Args`, `Exit` |
| **`io`** | I/O 抽象原语 | **`Reader`**, **`Writer`**, `Copy`, `ReadAll`, `LimitReader` |
| **`io/fs`** | 只读文件系统抽象接口 | `FS`, `WalkDir`, `Glob` |
| **`bufio`** | 带缓冲的 I/O 操作 | `Scanner` (按行读), `Reader`, `Writer`, `Flush` |
| **`path/filepath`**| 兼容多操作系统的文件路径处理 | `Join`, `Ext`, `Abs`, `Base`, `Dir` |
| **`flag`** | 命令行参数解析 | `String`, `Int`, `Parse` |
| **`os/exec`** | 执行外部命令 | `Command`, `Cmd.Run`, `Cmd.Output` |

##  数据结构与算法 (Algorithms & Data Structures)
**[重点]** 包含 Go 1.21+ 引入的泛型库，建议优先学习新库。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`slices`** | **[Go 1.21+]** 切片通用操作 | `Sort`, `Contains`, `Delete`, `Compact`, `Max`, `Clone` |
| **`maps`** | **[Go 1.21+]** Map 通用操作 | `Keys`, `Values`, `Clone`, `DeleteFunc` |
| **`cmp`** | **[Go 1.21+]** 有序类型比较 | `Compare`, `Less` |
| **`sort`** | (旧) 排序与查找 | `Ints`, `Strings`, `Search` (新项目建议用 `slices`) |
| **`container/heap`**| 堆（优先队列）实现 | `Interface`, `Push`, `Pop` |
| **`container/list`**| 双向链表 | `Element`, `PushBack`, `Front` |

## 网络与 Web 编程 (Network & Web)
Go 语言最强势的应用领域。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`net/http`** | HTTP 客户端与服务端核心 | `ListenAndServe`, `Client`, `Request`, `ResponseWriter` |
| **`net/url`** | URL 解析与查询参数构建 | `Parse`, `Values` (Query String), `PathEscape` |
| **`context`** | 请求上下文（超时/取消/传值） | `WithTimeout`, `WithCancel`, `Background`, `Value` |
| **`net`** | 底层网络接口 (TCP/UDP/IP) | `Dial`, `Listen`, `Conn`, `IP` |
| **`html/template`**| 安全的 HTML 模板渲染 | `ParseFiles`, `Execute`, `FuncMap` |

##  数据编码与序列化 (Encoding)
用于数据存储与跨服务通信。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`encoding/json`**| JSON 编解码 | `Marshal`, `Unmarshal`, `NewEncoder`, `Decoder` |
| **`encoding/xml`** | XML 编解码 | `Marshal`, `Unmarshal` |
| **`encoding/base64`**| Base64 编解码 | `StdEncoding.EncodeToString`, `DecodeString` |
| **`encoding/hex`** | 十六进制编解码 | `EncodeToString`, `Dump` |

## 错误处理与日志 (Observability)
工程化质量的保证。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`errors`** | 错误操作原语 | `New`, `Is` (判断), `As` (转换), `Unwrap` |
| **`log/slog`** | **[Go 1.21+]** 结构化日志 | `Info`, `Error`, `With`, `SetDefault`, `JSONHandler` |
| **`log`** | 基础日志 | `Println`, `Fatal`, `Panic` |

## 并发与运行时 (Concurrency & Runtime)
底层控制与并发安全。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`sync`** | 并发同步原语 | `WaitGroup`, `Mutex`, `RWMutex`, `Once`, `Map`, `Pool` |
| **`sync/atomic`** | 原子操作 | `AddInt64`, `Load`, `Store`, `CompareAndSwap` |
| **`reflect`** | 运行时反射 | `TypeOf`, `ValueOf`, `New`, `Elem`, `StructTag` |
| **`runtime`** | 运行时系统交互 | `GOMAXPROCS`, `Gosched`, `Caller`, `NumCPU` |

## 测试与工具 (Testing & Tools)
Go 原生自带的强大测试框架。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`testing`** | 单元/基准/模糊测试 | `T`, `B`, `F`, `Run`, `Parallel` |
| **`net/http/pprof`**| 性能分析端点 | `import _ "net/http/pprof"` (配合 go tool pprof 使用) |
| **`embed`** | 静态资源嵌入 | `//go:embed` 指令, `FS` |

##  加密与数学 (Crypto & Math)
安全与计算。

| 包名 (Package) | 功能描述 | 核心函数/类型 |
| :--- | :--- | :--- |
| **`crypto/md5`** | MD5 哈希 | `Sum`, `New` |
| **`crypto/sha256`**| SHA256 哈希 | `Sum256`, `New` |
| **`crypto/rand`** | 密码学安全的随机数 | `Read` (生成随机字节) |
| **`math`** | 基础数学函数 | `Abs`, `Max`, `Min`, `Pow`, `Sin` |
| **`math/rand`** | 伪随机数 | `Intn`, `Float64`, `Seed` |