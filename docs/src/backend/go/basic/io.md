---
title: golang 输入输出
---

# Go io
下面是go中的一些涉及io的标准库
| 分类 | 标准库 | 核心 API (接口/函数/变量) | 典型应用场景 |
| :--- | :--- | :--- | :--- |
| **1. 核心接口** | **`io`** | `Reader`, `Writer`, `Closer`, `Copy()`, `ReadAll()` | 所有 I/O 的基石，定义数据流转的标准 |
| **2. 基础 I/O** | **`fmt`** | `Printf()`, `Println()`, `Scanf()`, `Sprintf()`, `Fprint()` | 控制台格式化输出、字符串格式化、简单输入解析 |
| | **`os`** | `Stdin`, `Stdout`, `Stderr`, `File` | 操作系统层面的标准流访问、文件句柄 |
| **3. 文件系统** | **`os`** | `Open()`, `Create()`, `ReadFile()`, `WriteFile()`, `Mkdir()` | 文件的打开、创建、全量读写及目录管理 |
| | **`io/fs`** | `FS`, `ReadDirFS`, `FileMode` | (Go 1.16+) 只读文件系统的抽象接口 |
| | **`path/filepath`** | `Join()`, `Abs()`, `Walk()`, `Ext()` | 跨操作系统的文件路径处理（兼容 Win/Linux） |
| **4. 高性能缓冲** | **`bufio`** | `Scanner`, `NewReader()`, `NewWriter()`, `Flush()` | **按行读取**大文件、减少系统调用以提升读写性能 |
| **5. 内存 I/O** | **`bytes`** | `Buffer`, `NewReader()`, `NewBuffer()` | 在内存中作为 `io.Writer` 缓存字节流 |
| | **`strings`** | `Reader`, `Builder` | 高效拼接字符串（`Builder`）、将字符串模拟为 `Reader` |
| **6. 结构化数据** | **`encoding/json`** | `Marshal()`, `Unmarshal()`, `Encoder`, `Decoder` | JSON 数据的序列化与反序列化（最常用） |
| | **`encoding/csv`** | `NewReader()`, `NewWriter()` | 读写 CSV 表格文件 |
| | **`encoding/xml`** | `Marshal()`, `Unmarshal()` | XML 配置或报文处理 |
| | **`encoding/binary`** | `Read()`, `Write()`, `ByteOrder` | 固定长度的二进制协议解析（网络字节序） |
| **7. 日志系统** | **`log/slog`** | `Info()`, `Debug()`, `NewJSONHandler()` | (Go 1.21+) **结构化分级日志**（生产环境推荐） |
| | **`log`** | `Println()`, `Fatalf()`, `SetOutput()` | 简单日志打印，默认带时间戳 |
| **8. 网络 I/O** | **`net/http`** | `Request.Body`, `ResponseWriter`, `Get()`, `Post()` | Web 服务的数据收发（Body 本质是 `io.ReadCloser`） |
| | **`net`** | `Conn`, `Listen()`, `Dial()` | TCP/UDP 底层原始连接的字节流读写 |
| **9. 压缩归档** | **`archive/zip`** | `NewReader()`, `NewWriter()` | ZIP 压缩包的读取与创建 |
| | **`compress/gzip`** | `Reader`, `Writer` | Gzip 压缩流处理（常用于 HTTP 传输压缩） |
| **10. 资源嵌入** | **`embed`** | `//go:embed`, `FS` | (Go 1.16+) 将静态资源文件直接打包进二进制程序 |
| **11. 进程交互** | **`os/exec`** | `Command()`, `StdoutPipe()`, `StdinPipe()` | 启动外部进程并捕获其输出或发送输入 |
| **12. 文本模板** | **`text/template`** | `Execute()`, `Parse()` | 逻辑驱动的文本生成（如自动生成代码、邮件） |
| | **`html/template`** | `Execute()` | 安全的 HTML 网页生成，**自动转义防止 XSS** |
| **13. 安全与加密** | **`crypto/cipher`** | `StreamReader`, `StreamWriter` | 在读写数据的过程中实时进行加密或解密 |
| | **`hash`** | `Hash.Write()` | 通过写入数据流来计算 MD5、SHA256 等哈希值 |
| **14. 调试测试** | **`testing/iotest`** | `NewWriteChecker()`, `DataErrReader()` | 专门用于测试你的 I/O 逻辑在极端情况下的稳定性 |

## fmt
`fmt` 是 Go 的“门面”工具，它通过 io.Writer 接口与反射机制实现了极其灵活的输出。掌握了 fmt 的占位符和前缀规则，基本就掌握了 Go 语言 80% 的日常交互逻辑