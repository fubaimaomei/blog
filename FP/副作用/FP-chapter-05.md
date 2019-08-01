---
title: "副作用"
date: "2019-07-30"
permalink: "2019-07-30-effect"
---

#### 什么是副作用

> 因果关系：如果你调用一个函数(因),就会在屏幕上打印一条消息(果)。

```js
function foo(x) {
  return x * 2;
}

var y = foo(3);

// 上面的代码可以很清楚的看出因果，下面的代码则不行,因为它对y的影响是间接的。

function foo(x) {
  y = x * 2;
}

var y; // y  就是副作用

foo(3);
```

**有副作用的函数可读性更低，因为它需要更多的阅读来理解程序**

```js
//   思考
var x = 1;

foo();

console.log(x);

bar();

console.log(x);

baz();

console.log(x);
```

#### 潜在原因

```js
function foo(x) {
  return x + y;
}

var y = 3;

foo(1); // 4
```

#### 使用固定状态

```js
function foo(x) {
  return x + bar(x); //  bar 作为一个自由变量，被foo引用
}

function bar(x) {
  return x * 2;
}

foo(3); // 9

const PI = 3.141592;

function foo(x) {
  return x * PI;
}

foo(3); // 9.424776000000001
```

一个很重要的结论，PI 和 foo 都是不可重新分配的，上面两个函数都是纯函数。

#### 随机性

一个使用 Math.random() 的函数永远是不纯的，因为你不能根据它的输入来保证和预测它的输出。

#### I/O 效果

最常见的副作用就是 I/O。一个没有 I/O 的程序是完全没有意义的，以为它的工作不能以任何方式被观察到。
以 DOM 为例，我们更新一个 DOM 元素为了给用户展示文字或图片信息(果)，但是 DOM 的当前状态是对这些操作的隐式输入(因)

#### 其他错误

```js
var users = {};
var userOrders = {};

function fetchUserData(userId) {
  ajax("http://some.api/user/" + userId, function onUserData(userData) {
    users[userId] = userData;
  });
}

function fetchOrders(userId) {
  ajax("http://some.api/orders/" + userId, function onOrders(orders) {
    for (let i = 0; i < orders.length; i++) {
      // 对每个用户的最新订单保持引用
      users[userId].latestOrder = orders[i];
      userOrders[orders[i].orderId] = orders[i];
    }
  });
}

function deleteOrder(orderId) {
  var user = users[userOrders[orderId].userId];
  var isLatestOrder = userOrders[orderId] == user.latestOrder;

  // 删除用户的最新订单？
  if (isLatestOrder) {
    hideLatestOrderDisplay();
  }

  ajax("http://some.api/delete/order/" + orderId, function onDelete(success) {
    if (success) {
      // 删除用户的最新订单？
      if (isLatestOrder) {
        user.latestOrder = null;
      }

      userOrders[orderId] = null;
    } else if (isLatestOrder) {
      showLatestOrderDisplay();
    }
  });
}
// 程序会以预期之外的顺序执行代码，这种错误是不可避免的，需要我们严谨和刻意避免副作用。
```

#### 幂等操作

```js
// 幂等的：
obj.count = 2;
a[a.length - 1] = 42;
person.name = upper(person.name);

// 非幂等的：
obj.count++;
a[a.length] = 42;
person.lastUpdated = Date.now();
```

> 每一个幂等运算(obj.count = 2)可以重复多次，而不是在第一次更新后改变程序操作。非幂等操作每次都改变状态

#### 纯粹的快乐

没有副作用的函数称为纯函数，在编程意义上，纯函数是一种幂等函数，因为它不可能有副作用。

```js
function add(x, y) {
  return x + y;
}

// add 中没有自由变量，add(1,2)多次调用，返回的都是相同的结果。add(..)是纯粹风格的幂等。
```

#### 相对的纯粹

```js
function remeberNumbers(nums) {
  return function caller(fn) {
    return fn(nums);
  };
}

var list = [1, 2, 3, 4, 5];
var simpleList = remeberNumbers(List);

// simpleList 是不纯的
function median(nums) {
  return (nums[0] + nums[nums.length - 1]) / 2;
}

simpleList(median); // 3

list.push(6); // 不纯！

simpleList(median); // 3.5

// 修改list,simpleList( median )改变它的输出。

// simpleList 给定了相同的list参数，却没有返回相同的结果，这里存在引用的侧因。

function rememberNumbers(nums) {
  // 复制一个数组
  nums = nums.slice();

  return function caller(fn) {
    return fn(nums);
  };
}

var list = [1, 2, 3, 4, 5];

// 把 list[o] 作为一个有副作用的接收者
Object.defineProperty(list, 0, {
  get: function() {
    console.log("[0] was accessed!");
    return 1;
  }
});

var simpleList = rememberNumbers(list);

// [0] 已经被使用！
```

#### 有或者无

纯函数没有副作用，纯函数是幂等的。
第三种看待函数纯性的方法，也是最广为接受的定义，即纯函数具有引用透明性。

> 引用透明性是指一个函数调用可以被它的输出值所代替，并且整个程序的行为不会改变

```js
function calculateAverage(list) {
  var sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }
  return sum / list.length;
}

var nums = [1, 2, 4, 7, 11, 16, 22];

var avg = calculateAverage(nums);

console.log("The average is:", avg); // The average is: 9
function calculateAverage(list) {
  var sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }
  return sum / list.length;
}

var nums = [1, 2, 4, 7, 11, 16, 22];

var avg = 9; // calculateAverage 被它的返回值内联,同时程序的其他部分行为保持不变。calculateAverage 是纯的

console.log("The average is:", avg); // The average is: 9
```

#### 思考上的透明

引用透明性可以用计算好的常量来替换纯函数的输出，但并不意味着纯函数应该被替换掉。
除了数据是可变的因素外，一个函数它能清晰的表达出数据从何而来，又对数据做了何种处理，这些在阅读代码的时候都能让你一目了然，方便后续的维护。

#### 不够透明

```js
function calculateAverage(list) {
  sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }
  return sum / list.length;
}

var sum,
  nums = [1, 2, 4, 7, 11, 16, 22]; // sum 是自由变量，被程序的其他部分一依赖。

var avg = calculateAverage(nums); // 调用多次，返回的结果都是一样，并且具有引用透明性。

// 但  calculateAverage  就是纯函数了？  答案: NO! 除非你把 sum  设置为不可写!!
```

#### 性能影响

```js
var specialNumber = (function memoization() {
  var cache = [];

  return function specialNumber(n) {
    // 如果我们已经计算过这个特殊的数，
    // 跳过这个操作，然后从缓存中返回
    if (cache[n] !== undefined) {
      return cache[n];
    }

    var x = 1,
      y = 1;

    for (let i = 1; i <= n; i++) {
      x += i % 2;
      y += i % 3;
    }

    cache[n] = (x * y) / (n + 1);

    return cache[n];
  };
})();
// 让specialNumber变的更加纯粹
```

#### 纯化

```js
//  追加一层将之纯化 , 函数的纯度只需要深入它的皮肤
function safer_fetchUserData(userId, users) {
  // 简单的、原生的 ES6 + 浅拷贝，也可以
  // 用不同的库或框架
  users = Object.assign({}, users);

  fetchUserData(userId);

  // 返回拷贝过的状态
  return users;

  // ***********************

  // 原始的没被改变的纯函数：
  function fetchUserData(userId) {
    ajax("http://some.api/user/" + userId, function onUserData(userData) {
      users[userId] = userData;
    });
  }
}
```

#### 覆盖效果

然而很多时候，我们都是在集成第三方库,你无法在容器函数的内部为了封装词法自由变量来修改代码。

```js
var nums = [];
var smallCount = 0;
var largeCount = 0;

// 这是第三方库
function generateMoreRandoms(count) {
  for (let i = 0; i < count; i++) {
    let num = Math.random();

    if (num >= 0.5) {
      largeCount++;
    } else {
      smallCount++;
    }

    nums.push(num);
  }
}

// 编写接口

function safer_generateMoreRandoms(count, initial) {
  // (1) 保存原始状态
  var orig = {
    nums,
    smallCount,
    largeCount
  };

  // (2) 设置初始副作用状态  拷贝
  nums = initial.nums.slice();
  smallCount = initial.smallCount;
  largeCount = initial.largeCount;
  // 这三个状态是变化的状态

  // (3) 当心杂质！
  generateMoreRandoms(count);

  // (4) 捕获副作用状态
  var sides = {
    nums,
    smallCount,
    largeCount
  };

  // (5) 重新存储原始状态
  nums = orig.nums;
  smallCount = orig.smallCount;
  largeCount = orig.largeCount;

  // (6) 作为输出直接暴露副作用状态
  return sides;
}
```

#### 回避影响

```js
function handleInactiveUsers(userList, dateCutoff) {
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].lastLogin == null) {
      // 将 user 从 list 中删除
      userList.splice(i, 1);
      i--;
    } else if (userList[i].lastLogin < dateCutoff) {
      userList[i].inactive = true;
    }
  }
}

function safer_handleInactiveUsers(userList, dateCutoff) {
  // 拷贝列表和其中 `user` 的对象
  let copiedUserList = userList.map(function mapper(user) {
    // 拷贝 user 对象
    return Object.assign({}, user);
  });

  // 使用拷贝过的对象调用最初的函数
  handleInactiveUsers(copiedUserList, dateCutoff);

  // 将突变的 list 作为直接的输出暴露出来
  return copiedUserList;
}
```
