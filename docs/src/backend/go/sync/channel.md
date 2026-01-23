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
* 有缓冲通道