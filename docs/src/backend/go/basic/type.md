---
title: golang 数据类型
---
# go 数据类型

## 类型概述
一共可以划分为四大类
| 分类 | 包含的具体类型 | 特点简述 |
| :--- | :--- | :--- |
| **基础类型** | 布尔(`bool`)、整型(`int/uint`)、浮点型(`float`)、复数(`complex`)、字符串(`string`) | 存储最基础的原子数据，不可拆分。 |
| **复合类型** | 数组(`array`)、结构体(`struct`) | 将多个值（相同或不同类型）组合成一个整体。 |
| **引用类型** | 切片(`slice`)、映射(`map`)、通道(`chan`)、指针(`pointer`)、函数(`func`) | 变量存储的是地址，操作会影响底层共享的数据。 |
| **接口类型** | 接口(`interface`) | 抽象类型，定义了一组方法的集合（行为协议）。 |

## 基础类型
### 布尔

:::warning 
`bool`类型不支持隐式转换，不可强转
:::

```go
var b bool
fmt.Println(b)
// 输出: false
//  bool 类型的默认值是 false

c, d := 0, ""
fmt.Println(int(b), bool(c), bool(d))
// 输出:
// cannot convert b (variable of type bool) to type int
// cannot convert c (variable of type int) to type bool
// cannot convert d (variable of type string) to type bool
```

### 数值

:::tip
golang中涉及金额计算和精度相关的，一般采用三方库 shopspring/decimal https://github.com/shopspring/decimal
:::

* 整数（uint：表示无符号版本）
  * int、int8、int16、`int32`（别名  `rune` 用于表示 `unicode` 字符）、int64
  * uint（别名：`byte`）、uint8、uint16、uint32、uint64、uintptr

* 浮点数
  * float32（单精度）
  * float64（双精度）


* 复数（用于科学计算，由`实部` `虚部`组成）
  * complex64
  * complex128


### 字符串

string类型本质上是一个只读字节切片

```go
g := "golang"
g = "golang 修改了" // 开辟新的地址空间存放[]byte，并指向g
fmt.Println(g)
// 输出: golang 修改了
```

定义方式：

* 解释型（支持转义字符 `\n`）

```go
g := "第一行\n第二行"
fmt.Println(g)
// 输出：
// 第一行
// 第二行
```

* 原生字符串（使用反引号，不支持转义字符）

```go
g := `第一行
第二行\n`
fmt.Println(g)
// 输出：
// 第一行
// 第二行\n
```

字节与字符

* 字节（`byte`：uint8）

```go
s := "Go语言"
// 通过下标遍历（得到的是字节 byte）
for i := 0; i < len(s); i++ {
	fmt.Printf("%X ", s[i]) // 十六进制输出
}
// 输出: 47 6F E8 AF AD E8 A8 80
```

* 字符（`rune`：int32）

```go
s := "Go语言"
// 使用 range 遍历（自动识别 UTF-8，得到的是 rune）
for _, r := range s {
	fmt.Printf("%c ", r)
}
// 输出: G o 语 言
```

## 复合类型
:::tip
数组、结构体都属于值类型，非引用类型，赋值时会直接拷贝整个
:::
### 数组

长度固定且类型相同的的序列

```go
a := [...]int{1, 2, 3}
for _, item := range a {
	fmt.Printf("%d ", item)
}
// 输出：1 2 3
```

### 结构体

不同类型的组合，可以是字符串、布尔、数值、另一个结构体（结构体复用）

```go
type struct01 struct {
	a int
	b string
}
type struct02 struct {
	struct01
	c bool
	d string
}
structData := struct02{
		struct01: struct01{
		a: 1,
		b: "b",
	},
	c: true,
	d: "4",
}
fmt.Println(structData)
// 输出: {{1 b} true 4}
```

## 引用类型

变量赋值或者函数传递时，修改内容会影响到原始数据，go中只有值传递

### 切片（slice）

底层是对数组的封装，切片本身是一个很小的结构体，定义如下：

```go
type slice struct {
    array unsafe.Pointer // 指向底层数组的指针
    len   int            // 长度
    cap   int            // 容量
}

s1 := []int{1, 2, 3}
s2 := s1 // 只拷贝了长度容量指针
s2[0] = 4

fmt.Println(s1)
fmt.Println(s2)
// 输出:
// [4 2 3]
// [4 2 3]
```

* `make([]T, len, cap)`：创建切片，与字面量创建区别：
  * 字面量是声明 + 初始化值
  * `make`声明结构 + 初始化0值


* `len()`：获取切片长度

```go
s1 := []int{1, 2, 3}
fmt.Println(len(s1)) // 输出：3
```

* `cap()`：获取切片容量

```go
s1 := []int{1, 2, 3}
fmt.Println(cap(s1)) // 输出：3
```

* `append()`：添加元素，必须接收返回值，扩容可能导致底层数组变更

```go
s3 := make([]int, 0, 3)
s4 := []int{4, 5, 6}
s3 = append(s3, 1, 2, 3) // 追加
fmt.Println(s3)          // 输出：[1 2 3]
s3 = append(s3, s4...)   //切片展开追加
fmt.Println(s3)          // 输出：[1 2 3 4 5 6]
```

* `copy`：源切片复制到目标切片
  * copy 拷贝是直接按索引0开始覆盖，不扩容，不追加
  * 拷贝数量是 `min(len(dst), len(src))`


```go
s5 := make([]int, 3, 5)
s6 := []int{6, 7, 8, 9, 10}
s5len := copy(s5, s6)      // s6 切片内容拷贝到 s5 切片中
fmt.Println(s5, s5len, s6) // 输出：[6 7 8] 3 [6 7 8 9 10]
```

* `clear`：清空
  * `Go 1.21+`支持
  * `clear`将切片内的所有元素重置为零值，保持长度不变

```go
s7 := []int{1, 2, 3}
fmt.Println(s7) // 输出： [1 2 3]
clear(s7)
fmt.Println(s7, len(s7)) // 输出：[0 0 0] 3
```

* 截取
  * 切片截取不会拷贝数据
  * 新切片、原切片共享底层数组
  * 写操作可能会影响原数组

```go
s8 := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
fmt.Println(s8)
s9 := s8[1:5]    // 截取1-5的元素，包含下标1，不包含下标5
fmt.Println(s9)  // [2 3 4 5]
s10 := s8[:2]    // 截取0-2的元素，包含下标0，不包含下标2
fmt.Println(s10) // [1 2]
s11 := s8[2:]    // 截取2-最后的元素，包含下标2
fmt.Println(s11) // [3 4 5 6 7 8 9 10]
```

* `slices` 标准库，`go 1.21+引入`

  - **slices.Index(s, val)**: 查找元素，返回第一个匹配的索引；找不到返回 -1。
  - **slices.Contains(s, val)**: 判断切片是否包含某个元素。

  - **slices.Delete(s, i, j)**: 删除索引 i 到 j 之间的元素。

  - **slices.Insert(s, i, val...)**: 在索引 i 处插入元素。

  - **slices.Sort(s)**: 对切片进行原地升序排序。

  - **slices.Reverse(s)**: 原地反转切片。

  - **slices.Clone(s)**: 快速创建一个切片的副本（深拷贝底层数据）。

  - **slices.Compact(s)**: 连续重复元素去重（类似 Unix 的 uniq）。

  - **slices.Equal(s1, s2)**: 比较两个切片是否相等。

### 映射（map）

也称为哈希表，用于存储无序键值对

* 字面量声明与初始化


```go
var m1 map[string]int      // 已声明未初始化，不开辟空间
fmt.Println(m1)            // 输出：map[]
fmt.Println(m1 == nil)     // 输出：true
fmt.Println(len(m1))       // 输出：0
```

  * `make` 声明与初始化

```go
m2 := make(map[string]int) // make会开辟真实空间
fmt.Println(m2)            // 输出：map[]
fmt.Println(m2 == nil)     // false
fmt.Println(len(m2))       // 输出：0
```

* 新增/修改

```go
m1 := map[string]any{
	"name": "golang",
	"type": "language",
}
m1["age"] = 20
fmt.Println(m1) // map[age:20 name:golang type:language]
```

* 删除

```go
m := map[string]any{
	"a": 1,
	"b": 2,
	"c": 3,
}
fmt.Println(m)
delete(m, "a")
fmt.Println(m)
```

* 遍历：map遍历是无序的，每次遍历的顺序可能不一样

```go
m := map[string]any{
	"a": "a",
	"b": "b",
}
for k, v := range m {
	fmt.Println(k, v) // a a 或者 b b
}
```

### 通道（channel）

`channel`是连接多个Goroutine（Go 语言中的轻量级并发执行单元，由 Go runtime 调度，而不是由操作系统直接调度）的管道，是实现并发模型的核心，go的哲学是不要通过共享内存来通信，而是要通过通信来共享内存

* 创建：使用`make`创建，必须指定类型

```go
ch := make(chan int) // 创建一个传递整数类型的无缓冲通道
```

* 通道类型：
  * `无缓冲`：收发双方必须同时准备好，否则操作会阻塞
  * `有缓冲`：缓冲区满时，发送才会阻塞，缓冲区空时，接收会阻塞

```go
ch1 := make(chan int) // 无缓冲
ch2 := make(chan int,1) // 缓冲为1
```

### 指针（pointer）

存储变量内存地址的变量

* 取地址：`&`符号

```go
a := 1
fmt.Printf("a的地址是：%p\n", &a)
// 输出：a的地址是：0x14000106020
```

* 解引用：`*`符号，用于方法指针指向的具体值

```go
b := 6
p := &b
fmt.Println(*p) // 6
*p = 1
fmt.Println(b) // 1
```

* 空指针：指针声明没有赋值，默认值是`nil`

### 函数（func）

go中函数是一等功名，可以像普通变量一样声明、赋值，传递

* 定义：函数的类型由`参数列表`和`返回值列表`决定，与函数名是否相同无关

```go
type fn func(int, int) (int, int)
func fn1(a, b int) (int, int) {
	return a, b
}
func fn2(c, d int) (int, int) {
	return c, d
}
// fn1 和 fn2 函数类型是一样的
```

* 匿名函数：直接赋值给变量

```go
f1 := func(a, b int) int {
	return a + b
}
fmt.Println(f1(1, 2)) // 3
```

* 立即执行函数

```go
func(a, b int) {
	fmt.Println(a + b) // 3
}(1, 2)
```

* 闭包：本质上闭包也是函数，内部函数补货外部函数作用域中的变量，被捕获的变量和函数会一起存在

```go
func incrementor() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

next := incrementor()
fmt.Println(next()) // 1
fmt.Println(next()) // 2
```

## 接口类型

### 接口（interface）

go接口设计是非侵入式的，他是一组`行为`的抽象，即签名，而不是实现

* 定义与使用

```go
type Animal interface {
	Sound()
}
type Dog struct {
	Name string
}
func (d Dog) Sound() {
	fmt.Printf("%s的叫声是%s", d.Name, "汪汪")
}
type Cat struct {
	Name string
}
func (c Cat) Sound() {
	fmt.Printf("%s的叫声是%s", c.Name, "喵喵")
}

// main 函数逻辑
dog := Dog{
	Name: "狗狗",
}
dog.Sound() // 狗狗的叫声是汪汪
```

* 空接口：`Go 1.18`后引入`any`作为`interface{}`别名