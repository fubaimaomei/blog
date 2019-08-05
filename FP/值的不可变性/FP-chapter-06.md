---
title: "值的不可变性"
date: "2019-08-01"
permalink: "2019-07-30-immutable"
---

> 如果编程风格幂等性是指定义一个数据变更操作以便只影响一次程序状态，那么我们现在将注意力转向将这个影响次数从 1 降为 0，即我们在程序中使用不可改变的数据。

#### 原始值的不可变性

原始数据除了 Object 本身就是不可变的;无论如何你都没办法改变它们。

`2 = 2.5 // error`

然而 JS 的包装性看起来允许我们改变原始数据类型.

```js
var x = 2;
x.length = 4; // 这行代码的生命周期只存在于代码执行的瞬间！
x;
x.length;
```

**字符串虽然和数组相似，当字符串是不可变的！严格模式下，甚至会抛出错误。**

#### 从值到值

> 值的不可变性，并不是说我们不能改变已经存在的数据，而是必须创建和跟踪一个新的数据。

```js
function addValue(arr) {
  var newArr = [...arr, 4]; // 创建了一个全新的数组
  return newArr;
}

addValue([1, 2, 3]); // [ 1,2,3,4 ]
```

思考：分析下 addValue 是否纯粹，首先它的内部没有自由变量，因此没有侧因。其次，addValue( [1,2,3] );调用多次返回的结果都是一样，引用透明性也不会造成程序有额外的行为。由此，可以明确得知 addValue 是纯粹的。

```js
// 拷贝也能针对 对象数据
function updateLastLogin(user) {
  var newUserReocrd = Object.assign({}, user);
  newUserRecord.lastLogin = Date.now();
  return newUserRecord;
}

var user = {};

user = updateLastLogin(user);
```

#### 消除本地影响

```js
var arr = [1, 2, 3]; // arr 指向一个数组是可变的
foo(arr);
console.log(arr[0]); // 你不能保证arr[0]的结果是1，因为foo内部可能修改了arr

foo(arr.slice());
console.log(arr[0]); // 1
```

#### 重新赋值

> 常量是一个不可被重新分配的变量，它与值的不可变性无关！

```js
const x = [2];

// 数组是可变的！

const magicNums = [1, 2, 3, 4];
// 不要给 magicNums 重新赋值,但是数组是可变的。

// 再次说明，值的不可变性指的是，当我们需要它的时候，不应该直接改变它，而是应该使用一个全新的数据。
```

#### 冻结

从前面的章节我们得知，基本数据类型是不可变的，但对象以及对象的子集之类的数据是可变的！

一种将对象转为不可变的廉价方式，是使用冻结。

```js
var x = Object.freeze([2]); //freeze 本质是修改数组的描述符对象，让它的属性设置为不可配置(non-reconfigurabel)，并且使对象本身不可扩展，也就是不可添加新的属性。

//这种方法的诟病是，只能冻结到对象的皮肤。

var x = Object.freeze([2, 3, [4, 5]]);
// [4,5]是内部的一个数组

x[0] = 42; // 不允许改变
x[2][1] = [7]; // 允许!
```

#### 性能

每次创建的新的数据，都是要消耗 cpu 资源。

如果你的程序有大量频繁的这种操作，那么性能问题也将随之而来。

```js
// state 是被创建的一个新数据并且被追踪，并追踪每次改变根据之前的版本创建一个分支。

//  react文档的井字棋就实现了类似基本的跟踪功能。

var state = specialArray(1, 2, 3, 4);

var newState = state.set(42, "meaning of life"); // 又创建了一个新数据

state === newState; // false

state.get(2); // 3
state.get(42); // undefined

newState.get(2); // 3
newState.get(42); // "meaning of life"

newState.slice(1, 3); // [2,3]

// immutable.js  上面的代码本质是创建了链表来追踪数据，使用先有的库是一个不错的选择

var state = Immutable.List.of(1, 2, 3, 4);

var newState = state.set(42, "meaning of life");

state === newState; // false

state.get(2); // 3
state.get(42); // undefined

newState.get(2); // 3
newState.get(42); // "meaning of life"

newState.toArray().slice(1, 3); // [2,3]
```

#### 以不可变的眼光看待数据

**数据都是不可变的！**
