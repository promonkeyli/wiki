---
title: golang 泛型
---
# golang 泛型

`泛型`是`Go1.18`引入的，未引入前，为了处理不同类型的数据，只能采用`代码重复`的方式进行编码，示例说明如下：

* 无泛型

```go
func addTwoInt(a, b int) int {
	return a + b
}
func addTwoFloat(a, b float64) float64 {
	return a + b
}
```

* 有泛型

```go
func addTwo[T int | float64](a, b T) T {
	return a + b
}
```

## 基本语法

```go
func 函数名 [类型参数 约束](参数列表) 返回值 { ... }
```

## 类型约束

* `any`：any是`interface{}`的别名，可以是任意类型，只是不能对该类型的值做数值运算

```go
func printAny(v any) {
	fmt.Println(v)
}
```

* 自定义：类似于`联合类型`，使用`|`联合多个类型

```go
type NumberType interface {
	int | int64 | float64
}

func add[T NumberType](a, b T) T {
	return a + b
}
```

* `comparable`内置约束：用于限制泛型参数，这个必须是可以用`==`和`!=`进行比较的；所有的基本类型可以比较，`struct`、`map`、`func`、`slice`是不可以进行比较的

```go
// 查找切片中是否存在某个元素
func Contains[T comparable](s []T, target T) bool {
    for _, v := range s {
        if v == target { // 只有 comparable 才能用 ==
            return true
        }
    }
    return false
}
```

* `~`波浪符号（底层类型）：对于自定义的类型作为泛型参数传入时，通常使用`~`符号进行声明，编译器就知道要使用自定义类型的底层类型

```go
type myNumber interface {
	~int | ~float64
}

func addMyInt[T myNumber](a, b T) T {
	return a + b
}
func main() {
	var a myInt = 1
	var c myInt = 1
	fmt.Println(addMyInt(a, c))
}
```

## 泛型结构体

示例如下：声明一个`stack栈`结构

```go
type stack[T any] struct {
	items []T
}

// push 方法

func (s *stack[T]) push(item T) {
	s.items = append(s.items, item)
}

// pop方法
func (s *stack[T]) pop() T {
	if len(s.items) == 0 {
		var zero T
		return zero
	} else {
		item := s.items[len(s.items)-1]
		s.items = s.items[:len(s.items)-1]
		return item
	}
}

func main() {
	stack01 := stack[int]{}
	stack01.push(1)
	stack01.push(2)
	fmt.Println("栈：", stack01.items)
	stack01.pop()
	fmt.Println("栈：", stack01.items)
}
```
