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
### 切片
### 映射
### 通道
### 指针
### 函数

## 接口类型
### 接口