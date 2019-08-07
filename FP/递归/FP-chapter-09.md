---
title: "递归"
date: "2019-08-07"
permalink: "2019-08-07-recursion"
---

何为递归?

> 所谓递归，是当一个函数调用自身，并且该调用做了同样的事情，这个条件持续到基本条件满足时，调用循环返回。

```js
// 一个简单的递归
function foo(x) {
  if (x < 5) return x;
  return foo(x / 2);
}

foo(16); // 该次的返回值会回过头来触发调用栈中的所有函数调用(并且它们都执行return)。
```

另一个例子

```js
function isPrime(num, divsor = 2) {
  if (num < 2 || (num > 2 && num % divisor == 0)) {
    return false;
  }
  if (divisor <= Math.sqrt(num)) {
    return isPrime(num, divisor + 1);
  }

  return true;
}
```

定义斐波那契

```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 2) + fib(n - 1);
}
```

#### 相互递归

```js
function isOdd(v) {
  if (v === 0) return false;
  return isEven(Math.abs(v) - 1);
}

function isEven(v) {
  if (v === 0) return true;
  return isOdd(Math.abs(v) - 1);
}

// 将二分递归法转变成相互递归来表示
function fib_(n) {
  if (n == 1) return 1;
  // <= 1 拆分成两个基本条件
  else return fib(n - 2);
}

function fib(n) {
  if (n == 0) return 0;
  else return fib_(n - 1) + fib_(n);
}

// chrome下 这个fib算法会栈溢出
```

> 递归在调用栈中，将显示状态跟踪换为了隐式状态。通常，当问题需要条件分支和回溯计算时，递归非常有用。但递归每调用一级的分支作为其自己的作用域，这通常会影响代码的可读性。

```js
// 用递归来表示简单的迭代算法
function sum(total, ...nums) {
  for (let i = 0; i < nums.length; i++) {
    total = total + nums[i];
  }
  return total;
}

// 递归
function sum(num1, ...nums) {
  if (nums.length == 0) return num1;
  return num1 + sum(...nums);
}
// 通过调用栈代替了for循环，而且return s的形式在回调中隐式地跟踪增量的求和(total的间歇状态)，而非每次迭代中重新分配 total。
```

#### 声明式递归

**递归为算法而声明**

> 递归将问题的处理剥离出来，而不用在意它处理问题的工作原理。

```js
function maxEven(...nums) {
  var num = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 == 0 && nums[i] > num) {
      num = nums[i];
    }
  }

  if (num !== -Infinity) {
    return num;
  }
}

// 递归

function maxEven(num1, ...restNums) {
  var maxRest = restNums.length > 0 ? maxEven(...restNums) : undefined;

  return num1 % 2 != 0 || num1 < maxRest ? maxRest : num1;
}
```

#### 堆、栈

```js
function isOdd(v) {
  if (v === 0) return false;
  return isEven(Math.abs(v) - 1);
}

function isEven(v) {
  if (v === 0) return true;
  return isOdd(Math.abs(v) - 1);
}

isOdd(33333); // RangeError: Maximum call stack size exceeded
```

为什么会栈溢出?每个函数调用都会在内存中开辟出一小块称为堆栈帧的内存。堆栈帧中包含了函数语句当前状态的某些重要信息，包括任意变量的值。之所以这样，是因为一个函数暂停去执行另一个函数，而另一个函数运行结束后，引擎需要返回到之前暂停时候的状态继续执行。

#### 尾调用

正确的尾调用长这样: `return foo( .. );`

> 递归是一种编程思想，但不是主流技术

#### 重构递归

如果你想用递归来处理问题，却又超出了 JS 引擎的内存堆栈，这时候就需要重构下你的递归调用，使它能够符合 PTC 规范。

递归的主要问题是它的内存使用情况，每次的函数调用都会保持堆栈中的调用状态，并将其分配给下一个递归调用迭。

```js
// 回顾之前的递归求和
function sum(num1,...nums) {
   if (nums.length == 0) return num1;
   return num1 + sum( ...nums );
}

// 重构该函数的原理，我们不要再当前堆栈帧中保留 num1 + sum( ...nums ) 的总和，而是把它传递到下一个递归的堆栈帧中，这样就能释放当前递归的堆栈帧。

// @param result 是当前堆栈帧的结果，我们将它直接作为传输传入到下一个堆栈帧
function sum(result,num1,...nums) {
   // ..
   'use strict'
   result = result + num1; // 提前处理好总和
   if (num.length == 0) return result;
   return sum( result, ...nums );
}

// 修改参数名来提升可读性
function sum(num1,num2,...nums) {
num1 = num1 + num2;
if (nums.length == 0) return num1;
return sum( num1, ...nums );
}

sum( 3, 1, 17, 94, 8 );
```

**该技巧的核心做法就是将状态提升到参数签名中**
