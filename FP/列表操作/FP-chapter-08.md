---
title: "列表操作"
date: "2019-08-06"
permalink: "2019-08-06-list-operation"
---

激动人心的列表操作来了, 这一章我们所要做的是,从命令式转变为声明式风格,使代码模式更容易辨认,从而可读性更好。

> 命令式代码通过变量来存储值,而声明式代码则将结果隐式跟踪。

#### 映射

```js
// 映射的作用就是将一个值从一个地方映射到另一个新地方。
var x = ,y;

y = x * 3;

x = x * 3;


// 如果我们定义了 乘3 这样的函数，这个函数充当映射的功能。

var mutipleBy3 = v = > v * 3;

var x = 2, y;

y = mutipleBy3( 3 );
```

映射可以从单个值扩展到值的集合。map(..) 操作将列表中所有的值转换为新列表中的列表项。
这里需要注意，map 的含义是将一系列的值从**一个地方**映射到**另一个地方**。

```js
// 实现map
function map(mapperFn,arr){
    var newList = [];

    for(let idx = 0; idx < arr.length; idx ++){
        nextList.push(
            mapperFn(
                arr[i],i,arr
            );
        )
        return nextList;
    }
}

// 你只希望传递列表项到 mapperFn(..),而额外的参数可能会改变它的行为。

map(parseInt,['1','2','3']) // 这回造成预期之外的结果

// 正确的方法，管理函数的输入编写一个实用函数 unary(..)
function unary(fn){
    // 返回一个只接收一个参数的函数
    return function unitary(arg) {
        return fn( arg ); // 调用原函数
    }
}

// 修复上面的问题
map( unary( parseInt ),['1','2','3'] )
```

一个更有意思的例子

```js
// 定义一些工具函数
var increment = v => ++v;
var decrement = v => --v;
var square = v => v * v;

// 将要被组合的实用函数
var double = v => v * 2;

// 将这些函数放入列表之中
[increment, decrement, square]
  .map(fn =>
    compose(
      fn,
      double
    )
  )
  .map(fn => fn(3));

//  [ 7, 5, 36] 这个例子中compose的执行顺序是从右往左，而不是从左往右
```

#### 同步 vs 异步

```js
var newArr = arr.map();

arr.addEventListener("value", multipleBy3); // 异步 当有新的函数加到列表中时执行multipleBy3,新加入的值为参数，然后再将结果加入到 newArr。
```

#### 映射 VS 遍历

```js
[1, 2, 3, 4, 5].map(function mapperFn(v) {
  console.log(v); // 副作用!
  return v;
});
```

#### 函子

首先来看函子的定义：

> 函子是采用运算函数有效操作的值。

如果问题中的值是复合的，意味着它是由单个值组成，就像数组中的情况一样。例如，函子在每个单独的值上执行操作函数。函子实用函数创建的新值是所有单个操作函数执行的结果的组合。

map(..) 函数采用关联值 (数组) 和映射函数 (操作函数),并未数组中的每一个独立元素执行映射函数。最后，它返回由所有新映射值组成的新数组。

```js
// 字符串函子： 一个字符串加上一个实用函数，这个实用函数在字符串的所有字符（单独值）上执行某些函数操作，返回包含处理过的字符串的新字符串！

function uppercaseLetter(c) {
  var code = c.charCodeAt(0);
  // 小写字母?
  if (code >= 97 && code <= 122) {
    code = code - 32; // 其中的模式参考unicode
  }
  // 二进制通过数字来表示字符
  return String.fromCharCode(code);
}

function stringMap(mapperFn, str) {
  return [...str].map(mapperFn).join(""); // 一定要返回一个新的被处理过的数据
}

stringMap(uppercaseLetter, "Hello World!");
// HELLO WORLD! 是函子 因为它是有效操作后的值
```

#### 过滤器

> 返回 true/false 来做决定的函数称之为：谓词函数

程序中过滤掉的是需要的成员。

```js
function filter(predicateFn, arr) {
  var newList = [];

  for (let idx = 0; idx < arr.length; idx++) {
    if (predicateFn(arr[idx], idx, arr)) {
      newList.push(arr[idx]);
    }
  }

  return newList;
}

var isOdd = v => v % 2 == 1;

function not(fn) {
  return function inner(...arg) {
    return !fn(...arg);
  };
}

var isEven = not(isOdd);
```

#### 过滤掉 & 过滤

```js
var filterIn = filter;

function filterOut(predicateFn, arr) {
  return filterIn(not(predicateFn), arr);
}

isOdd(3); // true
isEven(2); // true

filterIn(isOdd, [1, 2, 3, 4, 5]); // [1,3,5] 将奇数过滤
filterOut(isEven, [1, 2, 3, 4, 5]); // [1,3,5] 将偶数过滤掉
```

#### Reduce

Reduce 有被称为折叠，也被称为缩减器，一般来说是需要制定一个 initialValue 亦可不指定，将列表第一个元素当做 initialValue。

```js
[5, 10, 15].reduce((product, v) => product * v, 3); // 2250
```

实现 Reduce

```js
function reduce(arr,reducerFn,initialValue){
    var acc, startIdx;

    // 获取实参数量
    if(arguments.length === 3) {
        acc = initialValue;
        startIdx = 0;
    }
    else if (arr.length > 0) {
        acc = arr[0];
        startIdx = 1;
    }
    else {
        throw new Error( "Must provide at least one value." );
    }

    for ( let idx = startIdx; idx < arr.length; idx++ ){
        acc = reducerFn( acc,arr[idx],idx,arr )
    }

    retrun acc;
}
```

#### 回顾 compose

```js
function compose(...fns) {
  return function composed(result) {
    return fns.reverse().reduce(function reducer(result, fn) {
      return fn(result);
    }, result);
  };
}

// 变更顺序

var pipeReducer = (composedFn, fn) =>
  pipe(
    composedFn,
    fn
  );

function compose(...fns) {
  return function composed(result) {
    // 舍去了fns.reverse()
    return fns.reduceRight(function reducer(result, fn) {
      return fn(result);
    }, result);
  };
}
```

#### 替换 Reduce

```js
var double = v => v * 2;
[1, 2, 3, 4, 5].map(double); // [2,4,6,8,10]

[1, 2, 3, 4, 5].reduce((list, v) => (list.push(double(v)), list), []);

var isOdd = v => v % 2 === 1;

[1, 2, 3, 4, 5].filter(isOdd);

[1, 2, 3, 4, 5].reduce(
  (list, v) => (isOdd(v) ? list.push(v) : undefined, list),
  []
);
```

#### 高级列表操作

##### 去重

```js
var unique = arr =>
  arr.filter(
    (v, idx) => arr.indexOf(v) == idx // arr中每个单独的值只能拥有一个位置
  );

// reduce 版本

var unique = arr =>
  arr.reduce(
    (list, v) => (list.indexOf(v) == -1 ? (list.push(v), list) : list),
    []
  );
```

##### 扁平化

```js
var flatten = arr =>
  arr.reduce(
    (list, v) => list.concat(Array.isArray(v) ? flatten(v) : v), //  这里用了递归来辗轧数组
    []
  );

// 指定扁平化层级

var flatten = (arr, depth = Infinity) =>
  arr.reduce(
    (list, v) =>
      list.concat(
        depth > 0
          ? depth > 1 && Array.isArray(v)
            ? flatten(v, depth - 1)
            : v
          : [v] // depth == 0 直接返回
      ),
    []
  );

var flatMap = (mapperFn, arr) =>
  arr.reduce((list, v) => list.concat(mapperFn(v)), []);
```

##### Zip

```js
zip([1, 3, 5, 7, 9], [2, 4, 6, 8, 10]);
// [ [1,2], [3,4], [5,6], [7,8], [9,10] ]  交替选择

// 实现

function zip(arr1, arr2) {
  var zipped = [];
  arr1 = arr1.slice(); // 防止副作用
  arr2 = arr2.slice();

  while (arr1.length > 0 && arr2.length > 0) {
    zipped.push([arr1.shift(), arr2.shift()]);
  }

  return zipped;
}
```

##### 合并

```js
mergeLists([1, 3, 5, 7, 9], [2, 4, 6, 8, 10]);
// [1,2,3,4,5,6,7,8,9,10] 交替插入的方式合并两个列表

// 实现

function mergeLists(arr1, arr2) {
  var merged = [];
  arr1 = arr1.slice(); // 防止副作用
  arr2 = arr2.slice();

  while (arr.length > 0 || arr2.length > 0) {
    if (arr1.length > 0) {
      merged.push(arr1.shift());
    }
    if (arr2.length > 0) {
      merged.push(arr2.shift());
    }
  }

  return merged;
}
```

#### 方法 VS 独立

JavaScript 采用统一的策略来处理函数，但其中一些也被作为独立函数提供了出来。

```js
[1, 2, 3, 4, 5]
  .filter(isOdd)
  .map(double)
  .reduce(sum, 0); // 18

//  采用独立的方法.

reduce(map(filter([1, 2, 3, 4, 5], isOdd), double), sum, 0);
```

#### 链式组合方法

```js
var partialThis = (fn, ...presetArgs) =>
  // 故意采用 function 来为了 this 绑定
  function partialApplied(...laterArgs) {
    return fn.apply(this, [...presetArgs, ...laterArgs]);
  };

var composeChainedMethods = (...fns) => result =>
  fns.reduceRight((result, fn) => fn.call(result), result);

// usage

composeChainedMethods(
  partialThis(Array.prototype.reduce, sum, 0),
  partialThis(Array.prototype.map, double),
  partialThis(Array.prototype.filter, isOdd)
)([1, 2, 3, 4, 5]); // 18 可视化数据流 sum <- double <- isOdd <- [1,2,3,4,5]
```

#### 独立组合实用函数

> 拜拜 this~

```js
var filter = (arr,predicateFn) => arr.filter( predicateFn );
var map = (arr,mapperFn) => arr.map( mapperFn );
var reduce = (arr,reducerFn,initialValue) =>
	arr.reduce( reducerFn, initialValue );   // 三个方法的上下文都由arr形参提供,每次使用都需要指定

// partialRight 预设后面的参数
compose(
	partialRight( reduce, sum, 0 ), // 预设了操作函数和值为0的initialValue
	partialRight( map, double ),
	partialRight( filter, isOdd )
)
( [1,2,3,4,5] );  // 18

// 一种更简洁的方法
var filter = curry(
	(predicateFn,arr) =>  // 上下文被放置在了末尾
		arr.filter( predicateFn )
);

var map = curry(
	(mapperFn,arr) =>
		arr.map( mapperFn )
);

var reduce = curry(
	(reducerFn,initialValue,arr) =>
		arr.reduce( reducerFn, initialValue );

compose(
	reduce( sum )( 0 ), // 传入剩余的参数
	map( double ),
	filter( isOdd )
)
( [1,2,3,4,5] );
```

#### 方法适配独立

上面的三个独立方法其本质都是将参数派发到对应的原生数组方法中。

```js
// 编写一个适配器函数
var unbound = (methodName, argCount = 2) =>
  curry(
    (...args) => {
      var obj = args.pop(); // 参照上面的函数签名(reducerFn,initialValue,arr)
      return obj[methodName](...args);
    },
    argCount // 手动指定 Arity 的数量
  );

// usage
var filter = unboundMethod("filter", 2);
var map = unboundMethod("map", 2);
var reduce = unboundMethod("reduce", 3);

compose(
  reduce(sum)(0),
  map(double),
  filter(isOdd)
)([1, 2, 3, 4, 5]);
```

#### 独立函数适配为方法

```js
var flatten = arr =>
  arr.reduce((list, v) => list.concat(Array.isArray(v) ? flatten(v) : v), []);

// 转变成独立函数
function flattenReducer(list, v) {
  return list.concat(Array.isArray(v) ? v.reduce(flattenReducer, []) : v);
}

// usage

[[1, 2, 3], 4, 5, [6, [7, 8]]].reduce(flattenReducer, []);
```

#### 查询列表

```js
var getSessionId = partial(prop, "sessId");
var getUserId = partial(prop, "uId");

var session, sessionid, user, userId, orders;

session = getCurrentSession();
session = getCurrentSession();
if (session != null) sessionId = getSessionId(session); // if 语句保证了后面函数组合调用的时的有效。
if (sessionId != null) user = lookupUser(sessionId);
if (user != null) userId = getUserId(user);
if (userId != null) orders = lookupOrders(userId);
if (orders != null) processOrders(orders);

// 上面的的代码混杂了命令式语句和声明式建模,理想情况下，我们期望摆脱这些变量定义和命令式的条件if。
```

首先定义一个实用函数来解决 !=null 这个问题

```js
var guard = fn => (
  arg // 本质还是通过管理函数调用来鉴权
) =>
  arg != null
    ? fn(arg)
    : arg[
        // usage
        (getSessionId, lookupUser, getUserId, lookupOrders, processOrders)
      ]
        .map(guard)

        [("sessId", "uId")].map(propName => partial(prop, propName))
        .reduce(mergeReducer, [lookupUser])
        .concat(lookupOrders, processOrders)
        .map(guard)
        .reduce((result, nextFn) => nextFn(result), getCurrentSession());
```

#### 融合

> 这一小节是本章重中之重

```js
someList
.filter(..)
.filter(..)
.map(..)
.map(..)
.map(..)
.reduce(..);   // 每次的操作都会重新循环整个列表，性能...

// 提供一个场景
var removeInvalidChars = str => str.replace( /[^\w]*/g, "" );
var upper = str => str.toUpperCase();
var elide = str =>
        str.length > 10 ?
                str.substr( 0, 7 ) + "...":  // 生成缩略格式
                str;
var words = "Mr. Jones isn't responsible for this disaster!"..split( /\s/ );

words
.map( removeInvalidChars )
.map( upper )
.map( elide );
// ["MR","JONES","ISNT","RESPONS...","FOR","THIS","DISASTER"]

elide( upper( removeInvalidChars( "Mr." ) ) ); // 自内向外执行

// 将函数流组合起来，然后传入到单个map中 因为这三个函数都是一元函数，是 map 期望的签名，同时他们的输出可作为下一个函数的输入
words
.map(
	compose( elide, upper, removeInvalidChars )
);
// ["MR","JONES","ISNT","RESPONS...","FOR","THIS","DISASTER"]

words
.map(
	pipe( removeInvalidChars, upper, elide )  //  从左到右执行
);
// ["MR","JONES","ISNT","RESPONS...","FOR","THIS","DISASTER"]
```

**融合是帮助我们解决了性能问题，由之前的三次循环，更换为一次，性能因此提升**
