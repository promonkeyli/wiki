---
title: golang 变量/常量
---
# golang 变量/常量

## 变量

标准声明:  go中变量声明了必须使用，否则编译会提示`declared and not use`

```go
var gloang string 
```

类型推导：声明赋值时，go会根据值类型自动推导变量类型

```go
var name = "golang"
```

短变量声明：使用`:=`操作符，但是只能在`函数内使用`

```go
name := "golang"
```

批量声明

```go
var (
		a int = 1
		b string
		c float64
		d bool = true
	)
```

## 零值

go中只声明没有赋值，会赋予该类型的默认值

### 零值速查表

| 类别       | 详细类型                 | 打印值 (`%v`) | 语法真面目 (`%#v`) | 是否为 `nil` | 说明                       |
| :--------- | :----------------------- | :------------ | ------------------ | :----------- | :------------------------- |
| **布尔**   | `bool`                   | `false`       | `false`            | ❌ 否         | 逻辑判断的默认起点         |
| **整型**   | `int`, `int8/16/32/64`   | `0`           | `0`                | ❌ 否         | 所有位数整型默认为 0       |
| **无符号** | `uint`, `uint8/16/32/64` | `0`           | `0x0`              | ❌ 否         | 包括 `uintptr` 指针地址    |
| **浮点**   | `float32`, `float64`     | `0`           | `0.0`              | ❌ 否         | Go 没有 double，只有 float |
| **复数**   | `complex64/128`          | `(0+0i)`      | `(0+0i)`           | ❌ 否         | 用于科学计算               |
| **字符**   | `byte` (uint8 别名)      | `0`           | `0x0`              | ❌ 否         | 处理 ASCII 或字节流        |
| **字符**   | `rune` (int32 别名)      | `0`           | `0`                | ❌ 否         | 处理 Unicode (中文)        |
| **文本**   | `string`                 | `""`          | `""`               | ❌ 否         | **绝对不可能是 nil**       |
| **指针**   | `*T` (如 `*int`)         | `<nil>`       | `(*int)(nil)`      | ✅ **是**     | 未指向任何内存地址         |
| **切片**   | `[]T` (如 `[]int`)       | `[]`          | `[]int(nil)`       | ✅ **是**     | 底层指针未分配内存         |
| **映射**   | `map[K]V`                | `map[]`       | `map[K]V(nil)`     | ✅ **是**     | **必须 make 后才能赋值**   |
| **通道**   | `chan T`                 | `<nil>`       | `(chan T)(nil)`    | ✅ **是**     | 并发通信的桥梁             |
| **函数**   | `func()`                 | `<nil>`       | `(func())(nil)`    | ✅ **是**     | 函数在 Go 里是一等公民     |
| **接口**   | `interface{}` / `any`    | `<nil>`       | `<nil>`            | ✅ **是**     | 既无动态类型也无动态值     |
| **数组**   | `[N]T` (如 `[3]int`)     | `[0 0 0]`     | `[3]int{0, 0, 0}`  | ❌ 否         | 长度固定，声明即分配空间   |
| **结构体** | `struct`                 | `{}`          | `main.User{...}`   | ❌ 否         | 递归初始化内部所有变量     |

### 类型打印
```go
package main

import "fmt"

func main() {
	var (
		a bool
		b int
		c float64
		d byte // uint8 的别名
		e rune // int32 的别名
		f string
		g *int           // 指针
		h []int          // 切片
		n [3]int         // 数组
		i map[string]int // 映射
		j chan int       // 通道
		k func()         // 函数
		l interface{}    // 接口
		m struct{}       // 结构体
	)

	// 打印表头，使用 \t 进行对齐
	fmt.Printf("%-12s \t %-18s \t %-20s\n", "说明", "类型 (%T)", "真实形态 (%#v)")
	fmt.Println("------------------------------------------------------------")

	// 基础类型
	fmt.Printf("%-12s \t %-18T \t %#v\n", "布尔", a, a)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "整型", b, b)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "浮点", c, c)
	fmt.Printf("%-12s \t %-18T \t %#v (uint8)\n", "字节byte", d, d)
	fmt.Printf("%-12s \t %-18T \t %#v (int32)\n", "字符rune", e, e)
	fmt.Printf("%-12s \t %-18T \t %q\n", "字符串", f, f) // 字符串用 %q 看得最真

	// 复合与引用类型
	fmt.Printf("%-12s \t %-18T \t %#v\n", "数组Array", n, n)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "切片Slice", h, h)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "映射Map", i, i)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "指针Pointer", g, g)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "通道Chan", j, j)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "函数Func", k, k)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "接口Interface", l, l)
	fmt.Printf("%-12s \t %-18T \t %#v\n", "结构体Struct", m, m)
}

```

### 打印输出	

```bash
说明             类型 (%T)               真实形态 (%#v)          
-------------------------------------------------------
布尔             bool                    false
整型             int                     0
浮点             float64                 0
字节byte         uint8                   0x0 (uint8)
字符rune         int32                   0 (int32)
字符串                   string                  ""
数组Array        [3]int                  [3]int{0, 0, 0}
切片Slice        []int                   []int(nil)
映射Map          map[string]int          map[string]int(nil)
指针Pointer      *int                    (*int)(nil)
通道Chan         chan int                (chan int)(nil)
函数Func         func()                  (func())(nil)
接口Interface    <nil>                   <nil>
结构体Struct             struct {}               struct {}{}
```

### 零值总结

1. **数值归零，逻辑归假**：
   所有的数字（整数、浮点、复数、byte、rune）统统是 `0`；布尔值统统是 `false`。

2. **字符串是“空纸盒”**：
   Go 的字符串永远是 `""`，它是一个实实在在的类型，绝对不是 `nil`。

3. **引用类型是“空标签”**：
   切片、Map、指针、通道、函数、接口，这些需要“指向”别处的类型，没指向前统统是 `nil`

## 常量

隐式类型声明：go会自动推断

```go
const name = "golang"
```

显示类型声明

```go
const name string = "golang"
```

批量声明

```go
const (
	sucess = 200
	failed = 400
)
```

常量接力：声明时，后续不指定变量类型及值，会自动复用上一行的值

```go
const (
	a = 100
	b // b 的值也是 100
	c // c 的值也是 100
)
```

常量iota：常量计数器

```go
const (
	a int = iota
	b
	c
)
```

无类型常量

```go
const X = 5  // X 是无类型的，既可以当 int 用，也可以当 float 用

var f float64 = X // 自动适配 float64
var i int = X     // 自动适配 int
```



