---
title: "组合函数"
date: "2019-07-29"
permalink: "2019-07-29-composite-function"
---

> 函数有多种多样的形状和大小。我们能够定义某种组合方式，来让它们成为一种新的组合函数，程序中不同的部分都可以使用这个函数。这种将函数一起使用的过程叫做组合。

#### 输出到输入

假设你的程序中可能存在这么两个实用函数

```js
function words(str) {
  return String(str)
    .toLowerCase()
    .split(/\s|\b/)
    .filter(function alpha(v) {
      return /^[\w]+$/.test(v);
    });
}

function unique(list) {
  var uniqList = [];

  for (let i = 0; i < list.length; i++) {
    if (uniqList.indexOf(list[i] === -1)) {
      uniqList.push(list[i]);
    }
  }

  return uniqList;
}

// usage

var text =
  "To compose two functions together, pass the \
output of the first function call as the input of the \
second function call.";

var wordsFound = words(text);
var wordsUsed = unique(wordsFound);

// var wordsUsed = unique( words( text ) );  这种性能更高

wordsUsed;
// ["to","compose","two","functions","together","pass",
// "the","output","of","first","function","call","as",
// "input","second"]

// 为了提高复用性，对上述操作进行一层封装
function uniqueWords(str) {
  return unique(words(str));
}

//  wordsUsed <-- unique <-- words <-- text
```

#### 制造机器

```js
// 定义一个实用函数 compose2(..),它能够自动创建两个函数的组合，这和我们手动做的是一模一样的。

function compose2(fn2, fn1) {
  return function composed(origValue) {
    return fn2(fn1(origValue));
  };
}

// 箭头函数版本
const compose2 = (fn2, fn1) => origValue => fn2(fn1(origValue)); // 函数是从右往左组合的

// usage

var uniqueWords = compose2(unique, words); // 从右往左
```

#### 组合变体

```js
var letters = compose2(words, unique);

var chars = letters("How are you Henry?");
chars;
// ["h","o","w","a","r","e","y","u","n"]
// 函数的组合不总是单向的。
```

#### 通用组合

> finalValue <-- func1 <-- func2 <-- ... <-- funcN <-- origValue

```js
function compose(...fns) {
  return function composed(result) {
    var list = fns.slice();

    while (list.length > 0) {
      list.pop()(result);
    }

    return result;
  };
}

var compose = (...fns) => result => {
  var list = fns.slice();

  while (list.length > 0) {
    list.pop()(result);
  }

  return result;
};

function skipShortWords(list) {
  var filteredList = [];

  for (let i = 0; i < list.length; i++) {
    if (list[i].length > 4) {
      filteredList.push(list[i]);
    }
  }

  return filteredList;
}

var text =
  "To compose two functions together, pass the \
output of the first function call as the input of the \
second function call.";

var biggerWords = compose(
  skipShortWords,
  unique,
  words
);

var wordsUsed = biggerWords(text);

wordsUsed;
// ["compose","functions","together","output","first",
// "function","input","second"]
```

#### 不同的实现

```js
function compose(...fns) {
  return function composed(result) {
    return fns.reverse().reduce(function reducer(result, fn) {
      return fn(result);
    }, result);
  };
}

// ES6 箭头函数形式写法
var compose = (...fns) => result =>
  fns.reverse().reduce((result, fn) => fn(result), result);
```

#### 懒执行函数包裹器

```js
// 直接返回了reduce 该结果是一个函数 不是一个值
// 只运行了一次reduce循环，然后将所有的函数调用运算全部延迟了 ————— 称为惰性运算

// 其结果是一个包裹层级更多的函数，当调用该结果传入一个或多个参数的时候，这个层层嵌套的大函数内部的所有层级、将由内而外调用，以相反的的方式连续执行（而不是通过循环）。

var compose = (...fns) =>
                    fns.reverse().reduce( (fn1,fn2) =>
                        (...args) =>
                                    fn2(fn1( ...args ));
                    );
```

#### 重排序组合

```js
function pipe(...fns){
    return function piped(result){
        var list = fns.slice();
        if(list.length>0){
            result = list.shift()(result;)
        }
        return result;
    }
}

// 更优雅的方式
var pipe = reverseArgs( compose );
```

#### 抽象

```js
function saveComment(txt) {
  if (txt !== "") {
    comments[comments.length] = text;
  }
}

function trackEvent(evt) {
  if (evt.name !== undefined) {
    events[evt.name] = evt;
  }
}

function storeData(store, loaction, value) {
  store[loaction] = value;
}

function saveComment(txt) {
  if (txt != "") {
    storeData(comment, comments.length, txt);
  }
}

function trackEvent(evt) {
  if (evt.name !== undefined) {
    storeData(events, evt.name, evt);
  }
}

// 抽象会帮你走的更远

function conditionallyStoreData(store, location, value, checkFn) {
  if (checkFn(value, store, loaction)) {
    store[loaction] = value;
  }
}

function notEmpty(val) {
  return val !== "";
}

function isUndefined(val) {
  return val === undefined;
}

function isPropUndefined(val, obj, prop) {
  return isUndefined(obj[prop]);
}

function saveComment(text) {
  conditionallyStoreData(comment, comments.length, text, notEmpty);
}

function trackEvent(evt) {
  conditionallyStoreData(events, evt.name, evt, isPropUndefined);
}

// 避免重复的if语句，先将条件判断移动到了通用抽象中，再将检查函数抽象出来。
```

#### 将组合当成抽象

> 请记住，函数组通同样是一种声明式抽象 其本质也是分离代码，突出关注点

```js
// 命令式
function shorterWords(text) {
  return skipLongWords(unique(words(text)));
}

// 声明式
var shorterWords = compose(
  skipLongWords,
  unique,
  words
);
```

#### 回顾形参

```js
// 提供该API：ajax( url, data, cb )
var getPerson = partial( ajax, "http://some.api/person" );
var getLastOrder = partial( ajax, "http://some.api/order", { id: -1 } );
getLastOrder( function orderFound(order){
	getPerson( { id: order.personId }, function personFound(person){
		output( person.name );
	} );
} );

// 将person形参移除personFound(..)
function extractName(person) {
    return person.name;
}

// extractName可以变得更通用些
function prop(name,obj){
    return obj[name];
}

// 顶一个相反功能的实用函数 setProp
function setProp(name,obj,value){
    var o = Object.assign( {} , obj );
    o[name] = value;
    return o;
}

// 重新定义 extrat函数 通过组合函数抽象出来
const extractName = partial( prop, 'name');

// 缩小关注点，实现 outputPersonName
getLastOrder( function orderFound(order){
	getPerson( { id: order.personId }, outputPersonName );
} );

// 我们的可视化数据流应该长这个样子 output <-- extractName <-- person

var outputPersonName = compose( output,extractname );

var processPerson = partialRight( getPerson, outputPersonName );

getLastOrder( function orderFound(order){
	processPerson( { id: order.personId } );
} );

var extractPersonId = partial( prop,"personId" );

function makeObjProp(name,value){
    retusn setProp( name,{},value );
}

var personData = partial( makeObjProp, "id" );
var lookupPerson = compose( processPerson, personData, extractPersonId );

var getPerson = partial( ajax, "http://some.api/person" );
var getLastOrder = partial( ajax, "http://some.api/order", { id: -1 } );

var extractName = partial( prop, "name" );
var outputPersonName = compose( output, extractName );
var processPerson = partialRight( getPerson, outputPersonName );
var personData = partial( makeObjProp, "id" );
var extractPersonId = partial( prop, "personId" );
var lookupPerson = compose( processPerson, personData, extractPersonId );

getLastOrder( lookupPerson );

partial( ajax, "http://some.api/order", { id: -1 } )
(
	compose(
		partialRight(
			partial( ajax, "http://some.api/person" ),
			compose( output, partial( prop, "name" ) )
		),
		partial( makeObjProp, "id" ),
		partial( prop, "personId" )
	)
);
```
