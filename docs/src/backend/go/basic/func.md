---
title: golang 函数
---
# go 函数

## 基础语法

1. 基本结构

```go
// func 关键字声明
func add(a int, b int) int {
	return a + b
}
```

2. 参数简写

```go
// 类型相同，可以合并
func sum(a, b int) int {
	return a + b
}
```

3. 多返回值

```go
// 多返回值声明，圆括号包裹，逗号分隔；return时逗号分隔
func source(a, b int) (int, int) {
	return a, b
}
```

4. 命名返回值

```go
// 长函数中可读性比较低
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return // 自动返回 x 和 y
}
```

## 高级特性

1. 可变参数：`...`定义，表示接收任意数量的同类型参数，`nums`本质上是切片`slice`

```go
func addRandom(nums ...int) int {
	total := 0
	for _, v := range nums {
		total += v
	}
}
```

2. 匿名函数/闭包：没有名字的函数即`匿名函数`，一般用于赋值给变量或者`立即执行`函数

```go
func sequence() func() int {
    i := 0
    return func() int {
        i++ // 闭包引用了外部变量 i，i 的生命周期被延长
        return i
    }
}
```

3. 立即执行函数

```go
func() {
	fmt.Println("10 + 11的和为：", 10+11)
}()
```

## 特殊函数

1. `main`函数：main包中出现，只有一个main函数，程序的入口，无参数以及返回值

2. `init`函数：初始化函数，go系统执行，不需要手动调用，无参数无返回值

   ```go
   func main() {
   	fmt.Println("main")
   }
   func init() {
   	fmt.Println("init 1")
   }
   func init() {
   	fmt.Println("init 2")
   }
   // 变量
   var x = foo()
   func foo() int {
   	fmt.Println("foo")
   	return 1
   }
   
   // 输出：
   // foo
   // init 1
   // init 2 
   // main
   
   // 变量先执行 => init => main
   // 总结：先依赖包，后当前包同一包内按文件名字典序；
   // 每个文件里先初始化变量，再按代码顺序执行 init，最后才是 main()
   ```

## 延迟执行

1. `defer`关键字用于函数的延迟调用
2. 多个`defer` 执行时采用`后入先出`
3. 生命周期：执行顺序是 return 赋值 -> defer -> 真正退出
4. 用途：清理资源、处理 Panic、修改具名返回值

```go
defer fmt.Println("defer-1")
fmt.Println("1")
defer fmt.Println("defer-2")
fmt.Println("2")
// 输出：
// 1
// 2
// defer-2
// defer-1
```

## 错误处理

`error`在go中用于处理可以预见的错误，`panic`用于处理不可恢复的灾难性错误

* `panic`：表示崩溃，是一个内置函数，用于终止当前控制流
* `recover`：表示恢复，也是内置函数，用于让程序从 panic 状态中恢复，重新获得控制权

```go
func protect() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("程序已恢复，捕获到异常:", r)
		}
	}()

	fmt.Println("准备执行...")
	panic("炸弹来了！") // 触发 panic
	fmt.Println("这行永远不会看到")
}

func main() {
	protect()
	fmt.Println("main 函数继续运行") // 因为 recover 了，程序不会退出
}
// 输出：
// 准备执行...
// 程序已恢复，捕获到异常: 炸弹来了！
// main 函数继续运行
```

## 方法

方法是一种特殊的函数，方法与函数的区别在于，方法在`func`关键字和函数名字之间多了一个参数`接收者`，类似面向对象的写法

```go
type Animal struct {
	Name  string
	Speak string
}

// 方法声明
func (a Animal) Sound() {
	fmt.Printf("%s的叫声是%s\n", a.Name, a.Speak)
}

func main() {
	dog := Animal{
		Name:  "小狗",
		Speak: "汪汪",
	}
	dog.Sound()

	cat := Animal{
		Name:  "猫咪",
		Speak: "喵～",
	}
	cat.Sound()
	// 输出：
	// 小狗的叫声是汪汪
	// 猫咪的叫声是喵～
}
```