---
title: golang 接口
---

# go 接口

与其他语言不同，go的接口是隐式实现的，这种设计被称为`鸭子类型（Duck typing）`，如果它走起来像鸭子，叫起来也像鸭子，那它就是一只鸭子

## 定义

定义`方法签名`，但是不包含任何实现

```go
// 定义一个名为 Speaker 的接口
type Speaker interface {
    Speak() string // 只要实现了 Speak() 方法并返回 string，就实现了该接口
}
```

## 实现

实现是隐式实现的，只要你的结构体拥有接口要求的方法，go编译器就自动认为你实现了该接口

```go
type Speaker interface {
	Speak()
}

type Dog struct {
	Name string
}

func (d Dog) Speak() {
	fmt.Printf("%s在汪汪叫\n", d.Name)
}

func main() {
	dog := Dog{
		Name: "小布",
	}
	dog.Speak() // 小布在汪汪叫
}
```

## 使用

使用`interface`可以实现`多态`

* 如果方法是 `func (d Dog) Speak()`，那么 `Dog `和 `*Dog` 都实现了接口
* 如果方法是 `func (d *Dog) Speak()`，那么只有` *Dog` 实现了接口

```go
type Speaker interface {
	Speak()
}

type Dog struct {
	Name string
}

// Dog 实现了 Speaker 接口
func (d Dog) Speak() {
	fmt.Printf("%s在汪汪叫\n", d.Name)
}

type Cat struct {
	Name string
}

// Cat 实现了 Speaker 接口
func (c Cat) Speak() {
	fmt.Printf("%s在喵喵叫\n", c.Name)
}

// 多态方法，接收接口类型为参数，只要实现了该接口的都可以使用该函数
func introduce(s Speaker) {
	fmt.Println("开始你的表演...")
	s.Speak()
}

func main() {
	dog := Dog{
		Name: "小布",
	}
	cat := Cat{
		Name: "一二",
	}
	introduce(dog)
	introduce(cat)
	// 输出
	// 开始你的表演...
	// 小布在汪汪叫
	// 开始你的表演...
	// 一二在喵喵叫
}
```

## 类型断言

接口负责"统一入口"，而类型断言负责识别真实身份，但是能不用就别用

```go
func introduce(s Speaker) {
	switch v := s.(type) { // 类型断言，判断真实的结构体是谁
	case Dog:
		fmt.Println("这是狗,名字叫", v.Name)
	case Cat:
		fmt.Println("这是猫，名字叫", v.Name)
	default:
		fmt.Println("未知类型")
	}
	fmt.Println("开始你的表演...")
	s.Speak()
}

func main() {
	dog := Dog{
		Name: "小布",
	}
	cat := Cat{
		Name: "一二",
	}
	introduce(dog)
	introduce(cat)
	// 输出
	// 这是狗,名字叫 小布
	// 开始你的表演...
	// 小布在汪汪叫
	// 这是猫，名字叫 一二
	// 开始你的表演...
	// 一二在喵喵叫
}
```

## 空接口

* 空接口不包含任何方法，这意味着任何类型都实现了空接口
* `GO 1.18+`后 `any`关键字成为了`interface{}`的别名

## 嵌套

go鼓励将大接口拆分为小接口，然后嵌套

```go
type Reader interface {
    Read()
}

type Writer interface {
    Write()
}

// ReadWriter 嵌套了两个接口
type ReadWriter interface {
    Reader
    Writer
}
```

## 规范

* 接口通常以`er`结尾，比如`Reader`、`Writer`、`Stringer`
* 小接口原则，接口越小越好，通常1-3个方法
* 接收接口，返回结构体，入参尽量使用接口，出参返回具体的结构体