---
title: golang 输入输出
---
# Go io

下面是go中的一些涉及io的标准库


| 分类               | 标准库                | 核心 API (接口/函数/变量)                                    | 典型应用场景                                         |
| :----------------- | :-------------------- | :----------------------------------------------------------- | :--------------------------------------------------- |
| **1. 核心接口**    | **`io`**              | `Reader`, `Writer`, `Closer`, `Copy()`, `ReadAll()`          | 所有 I/O 的基石，定义数据流转的标准                  |
| **2. 基础 I/O**    | **`fmt`**             | `Printf()`, `Println()`, `Scanf()`, `Sprintf()`, `Fprint()`  | 控制台格式化输出、字符串格式化、简单输入解析         |
|                    | **`os`**              | `Stdin`, `Stdout`, `Stderr`, `File`                          | 操作系统层面的标准流访问、文件句柄                   |
| **3. 文件系统**    | **`os`**              | `Open()`, `Create()`, `ReadFile()`, `WriteFile()`, `Mkdir()` | 文件的打开、创建、全量读写及目录管理                 |
|                    | **`io/fs`**           | `FS`, `ReadDirFS`, `FileMode`                                | (Go 1.16+) 只读文件系统的抽象接口                    |
|                    | **`path/filepath`**   | `Join()`, `Abs()`, `Walk()`, `Ext()`                         | 跨操作系统的文件路径处理（兼容 Win/Linux）           |
| **4. 高性能缓冲**  | **`bufio`**           | `Scanner`, `NewReader()`, `NewWriter()`, `Flush()`           | **按行读取**大文件、减少系统调用以提升读写性能       |
| **5. 内存 I/O**    | **`bytes`**           | `Buffer`, `NewReader()`, `NewBuffer()`                       | 在内存中作为`io.Writer` 缓存字节流                   |
|                    | **`strings`**         | `Reader`, `Builder`                                          | 高效拼接字符串（`Builder`）、将字符串模拟为 `Reader` |
| **6. 结构化数据**  | **`encoding/json`**   | `Marshal()`, `Unmarshal()`, `Encoder`, `Decoder`             | JSON 数据的序列化与反序列化（最常用）                |
|                    | **`encoding/csv`**    | `NewReader()`, `NewWriter()`                                 | 读写 CSV 表格文件                                    |
|                    | **`encoding/xml`**    | `Marshal()`, `Unmarshal()`                                   | XML 配置或报文处理                                   |
|                    | **`encoding/binary`** | `Read()`, `Write()`, `ByteOrder`                             | 固定长度的二进制协议解析（网络字节序）               |
| **7. 日志系统**    | **`log/slog`**        | `Info()`, `Debug()`, `NewJSONHandler()`                      | (Go 1.21+)**结构化分级日志**（生产环境推荐）         |
|                    | **`log`**             | `Println()`, `Fatalf()`, `SetOutput()`                       | 简单日志打印，默认带时间戳                           |
| **8. 网络 I/O**    | **`net/http`**        | `Request.Body`, `ResponseWriter`, `Get()`, `Post()`          | Web 服务的数据收发（Body 本质是`io.ReadCloser`）     |
|                    | **`net`**             | `Conn`, `Listen()`, `Dial()`                                 | TCP/UDP 底层原始连接的字节流读写                     |
| **9. 压缩归档**    | **`archive/zip`**     | `NewReader()`, `NewWriter()`                                 | ZIP 压缩包的读取与创建                               |
|                    | **`compress/gzip`**   | `Reader`, `Writer`                                           | Gzip 压缩流处理（常用于 HTTP 传输压缩）              |
| **10. 资源嵌入**   | **`embed`**           | `//go:embed`, `FS`                                           | (Go 1.16+) 将静态资源文件直接打包进二进制程序        |
| **11. 进程交互**   | **`os/exec`**         | `Command()`, `StdoutPipe()`, `StdinPipe()`                   | 启动外部进程并捕获其输出或发送输入                   |
| **12. 文本模板**   | **`text/template`**   | `Execute()`, `Parse()`                                       | 逻辑驱动的文本生成（如自动生成代码、邮件）           |
|                    | **`html/template`**   | `Execute()`                                                  | 安全的 HTML 网页生成，**自动转义防止 XSS**           |
| **13. 安全与加密** | **`crypto/cipher`**   | `StreamReader`, `StreamWriter`                               | 在读写数据的过程中实时进行加密或解密                 |
|                    | **`hash`**            | `Hash.Write()`                                               | 通过写入数据流来计算 MD5、SHA256 等哈希值            |
| **14. 调试测试**   | **`testing/iotest`**  | `NewWriteChecker()`, `DataErrReader()`                       | 专门用于测试你的 I/O 逻辑在极端情况下的稳定性        |

## fmt

### 使用规律

1. 命名规律

* 前缀：决定输出到哪里

  * 无前缀：`标准输出`，如`Print`,`Printf`
  * F(File)：输出到`io.Writer`，可以写入文件，网络流，甚至内存缓冲区，如`Fprint`,`Fprintf`
  * S(String)：输出到字符串，不打印，返回一个拼接好的字符串，如`Sprint`,`Sprintf`
* 后缀：决定输出格式

  * 无后缀：原样输出
  * Ln(Line)：自动换行，在打印结束后追加`\n`
  * f(Format)：格式化输出，需要提供模版字符串和相应的占位符（如`%d`,`%s`）

2. 占位符规律

* 通配符：`%v`
  * 不知道选什么时，就使用`%v`，go会根据变量类型自动选择合适类型
  * `%+v`：打印结构体时，会带上字段名，方便调试
  * `%#v`：打印出该变脸在go源码里的写法（包含包名、类型名、结构体名）
* 类型规律
  * `%T`：打印变量类型
  * `%p`：查看变量在内存中的地址时使用
  * `%q`：给字符串或字符加上双引号
* 宽度与精度
  * `%9.2f`：总宽度 9，保留两位小数
  * `%-10s`：左对齐，宽度 10
  * `%05d`：总宽度 5，不足补 0

3. 空格/换行规律

* `Print`,`Println` 空格
  * `Print`：只有当两个相邻的参数都不是字符串时，才会加空格
  * `Println`：相邻参数之间都会加空格
* 换行
  * `Print`/`Printf`：jie结尾没有换行，需要手动拼`\n`
  * `Println`：结尾换行

4. 占位符速查表


| 维度         | 分类            | 语法 / 占位符         | 说明                          | 示例输出                    |
| :----------- | :-------------- | :-------------------- | :---------------------------- | :-------------------------- |
| **方法逻辑** | **标准输出**    | `Print` / `f` / `ln`  | 打印到控制台                  | `Print("A", 1)` -> `A1`     |
|              | **生成字符串**  | `Sprint` / `f` / `ln` | 返回格式化后的字符串          | `s := Sprintf("%d", 1)`     |
|              | **写入流/文件** | `Fprint` / `f` / `ln` | 写入到`io.Writer` (文件/网络) | `Fprintf(os.Stderr, "err")` |
|              | **错误包装**    | `Errorf`              | 生成 error 类型，支持`%w`     | `Errorf("wrap: %w", err)`   |
|              | **获取输入**    | `Scan` / `f` / `ln`   | 从标准输入读取数据            | `Scan(&name)`               |
| **通用占位** | **万能**        | **`%v`**              | 值的默认格式                  | `{1 Alice}`                 |
|              | **结构体名**    | **`%+v`**             | 打印结构体时**带上字段名**    | `{ID:1 Name:Alice}`         |
|              | **源码表示**    | **`%#v`**             | 打印值的**Go 语法定义**       | `main.User{ID:1...}`        |
|              | **类型**        | **`%T`**              | 打印变量的**类型**            | `int` 或 `string`           |
| **数值类型** | **十进制**      | `%d`                  | 整数常用                      | `15`                        |
|              | **进制**        | `%b` / `%o` / `%x`    | 二进制 / 八进制 / 十六进制    | `1010` / `17` / `f`         |
|              | **浮点数**      | `%f` / `%.2f`         | 浮点数 /**保留两位小数**      | `3.141593` / `3.14`         |
|              | **科学计数**    | `%e` / `%g`           | 科学计数法 / 自动选择         | `1.23e+02`                  |
| **字符串**   | **普通**        | `%s`                  | 字符串或字节切片              | `Hello`                     |
|              | **安全引号**    | `%q`                  | **双引号**括起来，自动转义    | `"Hello \"Go\""`            |
|              | **十六进制**    | `%x`                  | 每个字节转为 16 进制字符串    | `48656c6c6f`                |
| **其他类型** | **布尔**        | `%t`                  | 打印`true` 或 `false`         | `true`                      |
|              | **指针**        | `%p`                  | 十六进制内存地址（带`0x`）    | `0xc00005a010`              |
| **控制修饰** | **宽度**        | `%5d`                 | 最小宽度 5，不足补空格        | `____1` (下划线代表空格)    |
|              | **补零**        | `%05d`                | 最小宽度 5，不足**补 0**      | `00001`                     |
|              | **对齐**        | `%-5d`                | **左对齐**，宽度 5            | `1____`                     |
|              | **备用**        | `%#x`                 | 强制带上进制前缀              | `0xff`                      |
|              | **正负**        | `%+d`                 | 总是打印正负号                | `+15`                       |

`fmt` 是 Go 的“门面”工具，它通过 io.Writer 接口与反射机制实现了极其灵活的输出，主要分为三类

### 打印输出

打印输出根据输出目的不同分为三类：

1. 标准输出：直接将内容打印到控制台

* `fmt.Print`：原样输出，多个参数之间不加空格

```go
a, b := "golang", "18"
c, d := "golang", 18
e, f := 18, 19

fmt.Print(a, b)
fmt.Print(c, d)
fmt.Print(e, f)

// 输出：golang18golang1818 19
```

* `fmt.Println`：输出后自动换行，多个参数之间自动加空格

```go
a, b := "golang", "18"
c, d := "golang", 18
e, f := 18, 19

fmt.Println(a, b)
fmt.Println(c, d)
fmt.Println(e, f)

// 输出：golang 18
//      golang 18
//      18 19
```

* `fmt.Printf`：格式化输出，需要配合占位符

```go
golang := "golang"
fmt.Printf("Hello, %v", golang) // %v 为通用占位符 => 输出：Hello, golang

age := 18
fmt.Printf("My age is %d", age) // %d 为整数占位符 => 输出：My age is 18

sex := "female"
fmt.Printf("My sex is %s", sex) // %s 为字符串 => 输出：My sex is female

isFemale := true
fmt.Printf("female ? %t", isFemale) // %t 为布尔值 => 输出：female ? true
```

2. 字符输出：不打印到控制台，生成变量字符串，可以使用变量接受，用法与`Print`、`Println`、`Printf`一致

```go
host, port, usr, pwd := "127.0.0.1", "3306", "root", "admin123456"
dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/test", usr, pwd, host, port)
fmt.Println(dsn) // 输出：root:admin123456@tcp(127.0.0.1:3306)/test
```

3. Writer输出：任何实现了` io.Writer`的地方都可以写入（文件、控制台、web响应、缓冲区等）

* 文件：`os.File`实现了`io.Writer`

```go
file, err := os.Create("golang.txt")
if err != nil {
	fmt.Println("文件创建失败", err.Error())
}
defer file.Close()

golang, desc := "golang", "世界上最简洁的语言"
fmt.Fprintf(file, "%s: %s", golang, desc)
// 输出：生成golang.txt，并向其中添加如下内容
// golang: 世界上最简洁的语言
```

* 控制台

```go
golang := "golang"
fmt.Fprintf(os.Stdout, "Hello，%s", golang)
// 控制台输出：Hello， golang
```

### 获取输入

1. `fmt.Scan`：从标准输读取

* 以**空白符**（空格、换行、Tab）作为分隔
* 可跨行读取
* 忽略换行差异

```go
var name string
var age int
fmt.Print("请输入姓名和年龄：")
fmt.Scan(&name, &age)
fmt.Println("你输入的姓名和年龄分别为：", name, age)
```

2. `fmt.Scanln`：读取到换行符停止

* **一行输入**
* 以换行作为结束
* 行内仍以空格分隔
* **多余输入会报**

```go
var name string
var age int
fmt.Print("请输入姓名和年龄：")
fmt.Scanln(&name, &age)
fmt.Println("你输入的姓名和年龄分别是：", name, age)
```

3. `fmt.Scanf`：根据格式化模版读取

* 按**格式字符串**解析输入
* 类似 C 的 `scanf`
* 输入必须匹配格式

```go
var year, month, day int
fmt.Print("请按照年-月-日输入日期：")
fmt.Scanf("%d-%d-%d", &year, &month, &day)
fmt.Printf("你输入的年月日的值为：%d-%d-%d\n", year, month, day)
```