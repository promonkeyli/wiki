---
title: golang 通道
---
# go channel

`goroutine`是并发实体的运行单元，`channel`通道就是连接这些单元的血管或者传送带

## 基本用法

`channel`是一种特殊的类型，int类型的通道只能传递int类型的数据

```go
ch := make(chan int)
ch <- 10     // 发送数据，把10丢进通道
data := <-ch // 接收数据，从通道里取出一个值，并赋给data
<-ch         // 接收并丢弃
close(ch)    // 关闭通道
```

## 通道类型

* 无缓冲通道
  * 容量为0，同步交付
  * 发送者：向`channel`发送数据时，必须有一个接收者正在等待接收，否则发送者会`	阻塞`（卡住）
  * 接收者试图接收数据时，必须有一个发送者正在发送，否则接收者会阻塞


```go
func main() {
  := make(chan string) // 创建一个无缓冲通道
	go func() {
		fmt.Println("子协程：正在努力工作中...")
		time.Sleep(time.Second * 2) // 模拟耗时操作，阻塞2s
		fmt.Println("子协程：工作完成，准备发送数据...")
		ch <- "你好，主协程"
		fmt.Println("子协程：数据发送完毕...")
	}()

	fmt.Println("主协程：等待数据...")
	msg := <-ch // 阻塞，直到子协程发送数据
	fmt.Println("主协程：收到消息 ->", msg)
}
```

* 有缓冲通道
  * 容量>0，异步交付
  * 发送者：只要缓冲区没满，发送就不会阻塞，满了才会阻塞
  * 接收者：只要缓冲区不空，接收就不会阻塞，空了才会阻塞

```go
func main() {
	ch := make(chan string, 2) // 创建容量为2的缓冲通道
	ch <- "缓冲：01" // 有缓冲，所以不会阻塞
	ch <- "缓冲：02"
  // ch <- "缓冲：03" // 放开注释，通道满了，会死锁 deadlock
	fmt.Println("发送了 1、2")
	fmt.Println("读取：", <-ch)
	fmt.Println("读取：", <-ch)
}
```

## 关闭通道

没有更多的数据要发送时，应该关闭通道，接收方可以通过关闭状态判断任务是否结束（**发送方关闭**）

```go
func main() {
	ch := make(chan int, 3)
	ch <- 1
	ch <- 2
	ch <- 3
	fmt.Println("通道发送了 1 2 3")
	close(ch)
	fmt.Println("接收：", <-ch)
	fmt.Println("接收：", <-ch)
	fmt.Println("接收：", <-ch)
	if _, ok := <-ch; !ok {
		fmt.Println("通道关闭了")
	}
}
```

## 遍历通道

`for range` 遍历通道，直到channel被关闭或者缓冲区为空才会结束循环

```go
func main() {
	ch := make(chan int)
	go func() {
		for i := 0; i < 5; i++ {
			ch <- i
		}
		close(ch)
	}()
	for val := range ch {
		fmt.Println("接收值：", val)
	}
}
```