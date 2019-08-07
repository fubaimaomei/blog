---
title: "异步"
date: "2019-08-07"
permalink: "2019-08-07-async"
---

#### 时间状态

在所有应用中，最复杂的状态就是时间。

#### 减少时间状态

异步编程最为重要的一点就是通过抽象时间来简化状态变化的管理。

```js
// 糟糕的时间复杂度
var customerId = 42;
var customer;

lookupCustomer(customerId, function onCustomer(customerRecord) {
  var orders = customer ? customer.orders : null;
  customer = customerRecord;
  if (orders) {
    // 条件分支
    coustomer.orders = orders; // 添加用户订单
  }
});

lookupOrders(customerId, function onOrders(customerOrders) {
  if (!customer) {
    customer = {};
  }
  customer.orders = customerOrders;
});
```

两个函数都在运行，两者都有可能先运行。那将无法预测到底会发生什么。
一种比较容易管理程序顺序的方法，就是把 lookupOrders 写入 onCustomer 内部，遗憾的是，我们不能这么做，我们需要让这 2 个查询同时执行。
所以，为了让这个基于时间的复杂状态正常化，我们用相应的条件分支咋在各自的回调函数里来检查外部作用域的变量 customer。当各自回调被执行，将会去检测 customer 的状态，从而确定各自的顺序执行，如果 customer 在回调函数里还没有被定义，那他就是先运行的，否则是第二个运行的。

这些代码虽然可以正确运行，但他违背了可读性原则。时间复杂度让这个代码变得难易阅读。

```js
// 使用 promise 将时间因素抽离出来:

var customerId = 42;
var customerPromise = lookupCustomer(customerId);
var ordersPromise = lookupOrders(customerid);
customerPromise.then(function onCustomer(customer) {
  ordersPromise.then(function onOrders(orders) {
    customer.orders = orders;
  });
});
```

#### 积极的 VS 惰性的

> 程序中的的积极表示为立即执行，而惰性则表示为延时执行

```js
// 积极的
var a = [1, 2, 3];

var b = a.map(v => v * 2);

b;

// 惰性的
var a = [];

var b = mapLazy(a, v => v * 2);

a.push(1);

a[0]; // 1
b[0]; // 2

a.push(2);

a[1]; // 2
b[1]; // 4
// a 每次添加新值都会触发b的回调，并把改变后的值添加到数组b里。改变并映射
```

#### 响应式函数式编程

```js
var a = new lazyArray(); // lazyArray 实际上是一个buffer

var b = a.map(function double(v) {
  return v * 2;
});

// b是惰性映射a后的最终值得数组

setInterval(function everySecond() {
  a.push(Math.random()); // 惰性接收值和响应值
}, 1000);
```

上面的 a 假定会随机向它添加新值，由于我们不一定知道 a 在什么时候添加了新值，所以我们需要去监听 b 并在有新值的时候去通知它。

```js
b.listen(function onValue(v) {
  console.log(v);
});
```

这里 b 是有反应性的，因为它被设置为当 a 有值添加时进行反应。函数式编程操作中的 map(..) 是把数据源 a 里面的所有值转移到目标 b 里。每次映射操作都是我们使用同步函数式编程进行单值建模的过程，但我们要做的是将这种操作变得可以响应式的(FRP);

**响应式也可以简单理解为事件机制。**

我们可以认为 a 是生产值的而 b 则是去消费这些值得。因此，我们可以将问题抽象为生产者和消费者两者间的问题。

```js
// 重构
// 生产者
var a = new LazyArray();

setInterVal(function everySecond() {
  a.push(Math.random());
}, 1000);

// *****************
var b = a.map(function double(v) {
  // 触发
  return v * 2;
});

b.listen(function onValue(v) {
  console.log(v); // 消费
});
```

#### 声明式的时间

从生产者 a 的角度：

> 想象一下 a 可以绑定上一些其他的事件源，比如说用户的鼠标点击和键盘按键事件，服务端来的 websocket 消息等。在这些情况下 a 没有必要关注自己的时间状态。每当准备好，它就只是一个与值连接的无时态管道。

从消费者 b 的角度：

> 我们不用知道或关注 a 里面值在何时何地来的。事实上，所有的值都已经存在，我们只关注是否无论何时都能取到那些值。或者说，map(..) 的转换操作是一个无时态的建模过程。

时间与 a 和 b 之间的关系是声明式的，不是命令式的。

```js
// 生产者：
var a = {
  onValue(v) {
    b.onValue(v);
  }
};

setInterval(function everySecond() {
  a.onValue(Math.random());
}, 1000); // 模拟惰性添值

// ************************
// 消费者

var b = {
  map(v) {
    return v * 2;
  },
  onValue(v) {
    v = this.map(v);
    console.log(v);
  }
};
```

#### 映射之外的东西

```js
var b = a.filter(function isOdd(v) {
  return v % 2 == 1;
});

b.listen(function onlyOdds(v) {
  console.log("Odd:", v);
});

var b = a.reduce(function sum(total, v) {
  return total + v;
});

b.listen(function runningTotal(v) {
  console.log("New current total:", v);
});
```

#### Observables

RxJS 可以为 JS 提供 observables 数据结构

```js
var a = new Rx.Subject(); // 这是一个 observable

setInterval(function everySecond() {
  a.next(Math.random()); // next添加值
}, 1000);

// map 将被触发
// 类似的还有a.filter a.throttle
var b = a.map(function double(v) {
  return v * 2;
});

b.subscibe(function onValue(v) {
  console.log(v);
});
```
