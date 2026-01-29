---
title: golang 上下文
---
# go context

## 概念

`context`主要用于解决并发编程中的 **Goroutine 生命周期管理**、**级联取消** 以及 **请求级数据透传** 问题

## 特点

1. 级联取消与生命周期管理 ：通过`WithCancel`派生

2. 超时控制与截止时间：通过`WithTimeout`或`WithDeadline`派生

1. 请求作用域数据传递：通过`WithValue`派生

## 类型

`Context`接口提供的方法：

| 方法         | 返回                | 作用           | 典型使用场景             | 示例                                  |
| ------------ | ------------------- | -------------- | ------------------------ | ------------------------------------- |
| `Done()`     | `<-chan struct{}`   | 取消/超时信号  | goroutine 退出、请求中断 | `select { case <-ctx.Done(): }`       |
| `Err()`      | `error`             | 取消原因       | 判断是超时还是手动取消   | `context.Canceled / DeadlineExceeded` |
| `Deadline()` | `(time.Time, bool)` | 是否有截止时间 | 统一超时控制             | `dl, ok := ctx.Deadline()`            |
| `Value(key)` | `any`               | 获取上下文值   | 传 traceId、userId       | `uid := ctx.Value("uid")`             |

`context` package提供的方法

| 方法                              | 返回                | 作用         | 是否需要 cancel | 使用建议           |
| --------------------------------- | ------------------- | ------------ | --------------- | ------------------ |
| `context.Background()`            | `Context`           | 根 context   | ❌               | main / 初始化      |
| `context.TODO()`                  | `Context`           | 占位 context | ❌               | 未设计好时         |
| `context.WithCancel(parent)`      | `(Context, cancel)` | 手动取消     | ✅ 必须          | goroutine 生命周期 |
| `context.WithTimeout(parent, d)`  | `(Context, cancel)` | 超时取消     | ✅ 必须          | 请求 / RPC         |
| `context.WithDeadline(parent, t)` | `(Context, cancel)` | 截止时间     | ✅ 必须          | 精确时间点         |
| `context.WithValue(parent, k, v)` | `Context`           | 传值         | ❌               | 元数据             |

## 使用示例

```go
// 模拟一个耗时的后台工作（比如查数据库）
func doHeavyWork(ctx context.Context) {
	// 1. 【传值】从 Context 中取出元数据 (TraceID)
	// key 建议使用自定义类型以避免冲突，这里为了演示简单用了 string
	traceID := ctx.Value("trace_id")
	fmt.Printf("[子协程] 收到任务，TraceID: %v，准备开始干活...\n", traceID)

	// 模拟任务需要 3 秒才能完成
	// 注意：这里的 select 是 Context 配合使用的标准模板
	select {
	case <-time.After(3 * time.Second):
		// 模拟：如果在超时前做完了
		fmt.Printf("[子协程] %v 任务顺利完成！\n", traceID)

	case <-ctx.Done():
		// 2. 【管生死】监听 Context 的取消/超时信号
		// 一旦 Context 被取消或超时，ctx.Done() 的 channel 会被关闭，这里会被触发
		fmt.Printf("[子协程] %v 任务强制停止！停止原因: %v\n", traceID, ctx.Err())

		// 这里应该做清理工作，比如回滚事务、断开连接等
	}
}

func main() {
	// 1. 创建根 Context
	baseCtx := context.Background()

	// 2. 【传值】包装一个携带数据的 Context (模拟 Request ID)
	valCtx := context.WithValue(baseCtx, "trace_id", "REQ-2023001")

	// 3. 【超时】再基于 valCtx 包装一个带超时的 Context
	// 规定：任务必须在 2 秒内完成，否则取消
	timeoutCtx, cancel := context.WithTimeout(valCtx, 2*time.Second)

	// 4. 【最佳实践】函数结束前必须调用 cancel，防止内存泄漏
	// 即使超时了，显式调用 cancel 也是个好习惯
	defer cancel()

	fmt.Println("[主协程] 请求开始，设置超时时间为 2 秒")

	// 开启一个 Goroutine 去执行任务，把 Context 传进去
	go doHeavyWork(timeoutCtx)

	// 主协程等待足够长的时间，以便观察子协程的输出
	time.Sleep(4 * time.Second)
	fmt.Println("[主协程] 程序退出")
}
```
