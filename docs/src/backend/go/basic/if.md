---
title: golang 条件语句
---
# go 条件语句

go 中有三种条件语句，`if`、`switch`、`select`，使用方式如下：

## `if` 语句

go中if语句不需要小括号（），但是需要大括号

```go
// 1.基本使用
func judgeScoreLevel(s int) (string, error) {
	if s < 0 || s > 100 {
		return "", errors.New("输入分数区间有误")
	} else {
		text := ""
		if s < 60 {
			text = "较差"
		}
		if s >= 60 && s < 80 {
			text = "良好"
		}
		if s >= 80 {
			text = "优秀"
		}
		return text, nil
	}
}

// 2.判断前可以先初始化语句，if内初始化的声明语句，作用域只在if与else内可以访问
func main() {
	var a int
	fmt.Println("请输入0-100之间的分数...")
	fmt.Scanln(&a)
	if v, err := judgeScoreLevel(a); err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println(v)
	}
}
```

## `switch`语句

go中的`switch`语句不需要每个分支后面添加`break`，执行完`case`会自动退出

```go
// 1. 基本使用
func isWeekday(d int) (bool, error) {
	switch d {
	case 1, 2, 3, 4, 5: // 可以多值匹配
		return true, nil
	case 6, 7:
		return false, nil
	default:
		return false, errors.New("输入的数值有误")
	}
}

func main() {
	var d int
	fmt.Println("请输入周一到周天的具体的天数数值，我们将判断是否属于工作日...")
	fmt.Scanln(&d)
	if iw, err := isWeekday(d); err != nil {
		fmt.Println(err.Error())
	} else {
		if iw {
			fmt.Println("你输入的值属于工作日")
		} else {
			fmt.Println("你输入的值不属于工作日")
		}
	}
}

// 2. 无表达式的switch，相当于整洁版的if-else
// 想要一个case执行完毕，下一个case也想要执行，显式使用fallthrough
func main() {
	num := 10
	switch num {
	case 10:
		fmt.Println("等于 10")
		fallthrough // 显式调用，下一个case也会继续执行
	case 20:
		fmt.Println("由于 fallthrough，我也被执行了")
	}
}
```

## `select`语句

go中并发编程的特殊条件语句，用于监听 `channel（通道）`的操作，它会随机选择一个可以执行的`case`

```go
func main() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	// 匿名函数 + 协程
	go func() {
		time.Sleep(2 * time.Second) // 当前协程休眠2s
		ch1 <- "来自 ch1 的秘密消息"       // 2s后给ch1通道发送消息
	}()

	go func() {
		time.Sleep(4 * time.Second) // 当前协程休眠4s
		msg := <-ch2                // 从通道2接收数据
		fmt.Println("协程2成功收到了：", msg)
	}()

	for i := 0; i < 10; i++ {
		fmt.Printf("第 %d 次尝试选择: ", i+1)
		select {
		case msg1 := <-ch1:
			// 如果 ch1 有数据可以读，走这里
			fmt.Println("接收到 ch1 的消息:", msg1)

		case ch2 <- "hello":
			// 如果 ch2 有人正在接收（准备好了），走这里发送数据
			fmt.Println("成功发送消息到 ch2")

		default:
			// 如果上面两个都没准备好，立即走这里（非阻塞）
			fmt.Println("没有通道准备好，我先忙别的去了...")
		}

		// 每隔 1 秒轮询一次
		time.Sleep(1 * time.Second)
	}

}
```
