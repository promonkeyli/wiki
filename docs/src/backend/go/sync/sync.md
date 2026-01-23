---
title: golang 同步
---
# go sync

go的并发编程中，`sync`包提供了一组`同步原语`

## `sync.WaitGroup`

* 作用：等待整队，本质就是一个计数器
* 场景：主协程需要等待一组子协程全部执行完毕后再继续
* 使用方式：
  * `Add(n)`：计数器加n
  * `Done()`：计数器减1
  * `Wait()`：阻塞，直到计数器==0，为0就解除阻塞
* 模版：

```go
var wg sync.WaitGroup

wg.Add(n)           // ① 启动 goroutine 之前

for i := 0; i < n; i++ {
    go func() {
        defer wg.Done()  // ② goroutine 内部
        // do work
    }()
}

wg.Wait()           // ③ 等所有 goroutine 完成
```

* 实例如下：

```go
var wg sync.WaitGroup

func main() {
	a := 10
	b := 2

	wg.Add(2)
	// 执行求解两数之和的协程
	go sumTwoTask(a, b)

	// 执行求解两数乘积的协程
	go multiTwoTask(a, b)

	wg.Wait()
	fmt.Println("主协程运行")

	// 输出
	// 协程-求解两数之和的值为：12
	// 协程-求解两数乘积的值为：20
	// 主协程运行

}

func sumTwoTask(a, b int) {
	defer wg.Done()
	fmt.Printf("协程-求解两数之和的值为：%d\n", a+b)
}

func multiTwoTask(a, b int) {
	defer wg.Done()
	fmt.Printf("协程-求解两数乘积的值为：%d\n", a*b)
}
```

## `sync.Mutex`

* 作用：互斥锁，保护资产
* 场景：多个协程同时读写一个变量，如银行余额，`Mutex`保证同一时刻只有一个协程能访问
* 使用：
  * `Lock()`：加锁，如果已经加锁，需要排队等待
  * `Unlock()`：解锁，用完必须解锁，否则别人用永等不到，会产生死锁

```go
var (
    count int
    lock  sync.Mutex
)

func increment() {
    lock.Lock()         // 进屋，锁门
    count++             // 操作敏感数据
    lock.Unlock()       // 出屋，开门
}
```

## `sync.RWMutex`

* 作用：读写锁（性能优化）
* 场景：读多写少的场景
* 使用：
  * `RLock()/RUnlock()`：读锁，可以无数个人同时持用读锁
  * `Lock()/Unlock()`：写锁，只能一个人写，其他人写要等待

## `sync.Once`

* 作用：单次执行，确保唯一
* 场景：有些操作无论开启多少协程，`只需要执行一次`。例如加载配置文件，初始化数据库连接等

## `sync.Map`

* 作用：并发安全字典
* 场景：原生`map`不是并发安全的，多个协程同时写一个`map`，程序会崩溃`panic`

## `sync.Pool`

* 作用：临时对象池
* 场景：频繁创建和销毁大量对象，`GC`压力会很大，`Pool`可以缓存已经创建好的对象供下一次复用