---
title: golang 结构体
---

# go 结构体

go `struct`结构体是将多个不同类型的数据组合在一起的自定义类型

## 定义

使用 `type`和`struct` 关键字定义

```go
type Struct01 struct {
	ID       int
	Name     string
	isActive bool
}
```

## 实例化

1. 命名初始化

```go
s01 := Struct01{
	ID:   1,
	Name: "s01",
	// isActive 没有初始化，默认取对应类型的零值
}
fmt.Println(s01)
```

2. 顺序初始化：必须按顺序提供所有字段的值

```go
s02 := Struct01{
	1, "s02", true,
}
fmt.Println(s02)
```

3. `new`关键字：会分配内存并返回指向该结构体的指针

```go
s03 := new(Struct01)
fmt.Println(s03) // 输出：&{0  false}
```

## 指针

结构体是值类型，赋值结构体给新变量，会发生内存拷贝

* 值传递：修改副本不会影响原对象
* 指针传递：修改会影响原对象，对于大一些的数据结构，指针传递效率更高

```go
type Struct02 struct {
	ID   int
	Name string
}
func updateName(s Struct02) {
	s.Name = "值拷贝修改了Name字段"
}
func updateNameByPointer(s *Struct02) {
	s.Name = "指针拷贝修改了Name字段"
}

func main() {
	s01 := Struct02{
		1, "我是没有修改时的Name",
	}
	updateName(s01)
	fmt.Println(s01) // {1 我是没有修改时的Name}
	updateNameByPointer(&s01)
	fmt.Println(s01) // {1 指针拷贝修改了Name字段}
}
```

## 方法

可以为结构体定义方法，使他看起来像一个`类`

* 值接收者：操作的是拷贝的副本
* 指针接收者：操作的是原对象

```go
type Struct03 struct {
	Num01 int
	Num02 int
	Total int
}
func (s Struct03) sumTwoNum() {
	s.Total = s.Num01 + s.Num02
}
func (s *Struct03) sumTwoNumByPointer() {
	s.Total = s.Num01 + s.Num02
}

func main() {
	s03 := Struct03{
		1, 2, 0,
	}
	s03.sumTwoNum()
	fmt.Println(s03.Total) // 0

	s03.sumTwoNumByPointer()
	fmt.Println(s03.Total) // 3

}
```

## 嵌套

go中没有继承的概念，结构体支持嵌入，采用`组合`的方式实现类似继承的效果

```go
type Animal struct {
	Name string
}
func (a Animal) Eat() {
	fmt.Printf("%s正在吃东西\n", a.Name)
}
type Dog struct {
	Animal
	class string
}

func main() {
	dog := Dog{
		Animal: Animal{Name: "汪汪"},
		class:  "金毛",
	}
	dog.Animal.Eat() // 汪汪正在吃东西
}
```

## 标签

结构体标签，在处理`JSON`以及数据库映射时，需要告诉程序结构体字段该怎么进行映射，主要是通过`反引号`里的标签内容实现的

```go
type Config struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	UserName string `json:"user_name"`
	Password string `json:"-"` // 不参与 JSON 序列化
}

func main() {
	config := Config{
		"127.0.0.1", 8080, "admin", "admin",
	}
	jsonConfig, _ := json.Marshal(config) // 返回的byte[]
	fmt.Println(string(jsonConfig))       // 打印的话需要转换为string
}
```

## 匿名结构体

临时使用包装数据，不需要定义`type`

```go
data := struct {
    Code int
    Msg  string
}{
    Code: 200,
    Msg:  "成功",
}
```