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

