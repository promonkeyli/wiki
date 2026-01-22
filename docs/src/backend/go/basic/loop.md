---
title: golang 循环语句
---
# go 循环语句

go语言中`for`语句是唯一循环语句

## 标准循环

```go
func main() {
	for i := 0; i < 10; i++ {
		fmt.Println(i)
		time.Sleep(1 * time.Second)
	}
}
```

## 充当`while`循环

```go
func main() {
	i := 0
	for i < 10 {
		fmt.Println(i)
		i++
		time.Sleep(1 * time.Second)
	}
}
```

## 无限循环

使用 `break`或者`return`可以退出循环

```go
func main() {
	j := 0
	for {
		fmt.Printf("循环中：%d\n", j+1)
		if j == 9 {
			return
		}
		j++
	}
}
```

## `for range（迭代器）`

用于处理数组、切片、映射、字符串、通道迭代，整数也可以进行迭代

* 数组/切片（`slice`）：返回索引和元素值

```go
a := [2]int{1, 2}
for i, v := range a {
	fmt.Printf("索引：%d，值：%d\n", i, v)
}
b := []int{3, 4}
for i, v := range b {
	fmt.Printf("索引：%d，值：%d\n", i, v)
}
```

* 映射（`map`）：返回键值

```go
c := make(map[string]int)
c["a"] = 1
c["b"] = 2
c["c"] = 3
for k, v := range c {
	fmt.Printf("键：%s，值：%d\n", k, v)
}
```

* 整数/字符串

```go
d := "hello"
for i, v := range d {
	fmt.Printf("索引：%d，值：%c\n", i, v)
}
e := 5
for v := range e { // go 1.22+ 开始支持
	fmt.Printf("值：%d\n", v)
}
```

* 通道`channel`：只要通道没关闭，会一直迭代；通道关闭且数据取完，会自动关闭；通道迭代时，只返回通道中的数据

```go
func main() {
	ch := make(chan string)
  // 协程
	go func() {
		time.Sleep(1 * time.Second) // 休眠1s
		ch <- "ch 1s 后发送了数据"
		close(ch) // 发送后就关闭，关闭后迭代会终止
	}()
  // 迭代
	for v := range ch {
		fmt.Printf("通道的值：%s\n", v)
	}
}
```
