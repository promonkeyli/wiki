---
title: golang select
---
# go select

## 基本用法

`select`在go中用于并发编程，类似于操作系统中的`I/O`多路复用；没有`select` `<-ch`会阻塞协程，直到数据到达，如果你有两个`channel`，`ch1`，`ch2`，你想谁先来就处理谁，如下所示，不使用`select`会阻塞等待`ch1`通道发送数据，即使`ch2`先到达，也需要等待`ch1`关闭或者接收完成，否则只能使用`select`关键字，谁先来就接收谁的数据

```go
func main() {
	ch1 := make(chan int, 2)
	ch2 := make(chan int, 2)

	ch1 <- 1
	ch2 <- 2

	data1 := <-ch1
	data2 := <-ch2
  
  // 此处如果ch2先来数据，这里依然会阻塞，等待ch1接收数据
	fmt.Println("ch1:", data1) 
	fmt.Println("ch2:", data2)
}
```

`select`接收数据方式如下：

```go
func main() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	go func() {
		time.Sleep(time.Second * 2)
		ch1 <- "发送者ch1：01"
		time.Sleep(time.Second * 1)
		ch1 <- "发送者ch1：02"
	}()
	go func() {
		time.Sleep(time.Second * 1)
		ch2 <- "发送者ch2：01"
		time.Sleep(time.Second * 2)
		ch2 <- "发送者ch2：02"
	}()

	for i := 0; i < 4; i++ {
		time.Sleep(time.Second * 1)
		select {
		case msg := <-ch1:
			fmt.Println("接收者ch1：", msg)
		case msg := <-ch2:
			fmt.Println("接收者ch2：", msg)
		default:
			fmt.Println("没有通道准备好")
		}
	}
	// 输出：
	// 接收者ch2： 发送者ch2：01
	// 接收者ch1： 发送者ch1：01
	// 接收者ch1： 发送者ch1：02
	// 接收者ch2： 发送者ch2：02
}
```

## 特点

1. 随机性：多个`case`同时满足的话，会随机选取一个
2. 并发处理：处理多个`channel`的竞争状态
3. 非阻塞：使用`default`可以实现非阻塞