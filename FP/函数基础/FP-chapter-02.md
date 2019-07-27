---
title: "函数示例"
date: "2019-07-26"
permalink: "2019-07-26-Basis-function"
---

本章核心重点：**函数是函数式编程基础**

> 数学意义上的方程就可作为函数式编程中的函数使用

```js
// arguments (实参) parameters (形参)
// 一个函数所 "期望" 的实参个数是取决于已声明的形参个数。
// 这里有一个特殊术语 Arity 指的是一个函数声明的形参数量
// foo.length 可获取函数的 Arity length只读
// 参数默认值,参数扩展,解构赋值都会让length失真
// 实参数量 arugment.length 读取

function foo(x, y) {
  // ..
}

var a = 3;

foo(a, a * 2);
```

如果一个函数可以接受或返回一个甚至多个函数，它被叫做高阶函数。

```js
function forEach(list,fn) {
    for (let i = 0;i <list.length; i++>) {
        fn( list[i] );
    }
}

forEach( [1,2,3,4,5],function each(val) ){
    console.log( val );
});

// 1 2 3 4 5
```

把函数作为输出

```js
function foo() {
  var fn = function inner(msg) {
    console.log(msg);
  };

  return fn;
}

var f = foo();

f("Hello!"); // Hello!
```

> 闭包可以记录并且访问它作用域外的变量，甚至当这个函数在不同的作用域中被执行

```js
function foo(msg) {
  var fn = function inner() {
    console.log(msg); // 注意这里的msg引用的是外层作用域的msg
  };

  return fn;
}

var helloFn = foo("Hello!");

helloFn(); // Hello!
```

下面是闭包的一些例子

```js
function person(id) {
  var rendNumber = Math.random();

  return function identify() {
    console.log("I an " + id + ": " + randNumber);
  };
}

var fred = person("Fred"); // 调用person会创建一个随机数
var susan = person("Susan");

fred(); // 调用identify会产生2个闭包变量 id和randNumber
susan();
```

闭包不仅限于获取变量的原始值：它不仅仅是快照，而是直接链接。

```js
function runningCounter(start) {
  var val = start;

  return function current(increment = 1) {
    val = val + increment;
    return val;
  };
}

var score = runningCounter(0); //初始化val
score(); // 1
socr(13); // 14
```

利用闭包记录第一个输入值

```js
fuction makeAdder(x){
    return function sum(y){
        return x + y
    };
}

var addTo10 = makeAdder( 10 );  // 假定第一个ajax的返回结果为10

// 在程度的另一处得到下一个参数
addTo10( 3 ) // 13
```

JS 中函数是对象，也是值的一种，因此还可以通过闭包来记住函数。

```js
fuction formatter(formatterFn){
    return function inner(str){
        return formatFn( str );
    };
}

// 将单词修改为小写字母
var lower = formatter( function formatting(v){
    return v.toLowerCase()
} );

lower( 'LOL' )  // lol 创建的一元函数 lower 可以很容易和其他函数配合使用
```

**闭包是函数式编程的重要基础**

箭头函数的匿名性是 => 的阿喀琉斯之踵 阅读困难，调试困难，无法自我引用

不同的场景下，箭头函数的不同语句

```js
people.map(person => person.nicknames[0] || person.firstName);

// 多个参数? 需要 ( )
people.map((person, idx) => person.nicknames[0] || person.firstName);

// 解构参数? 需要 ( )
people.map(({ person }) => person.nicknames[0] || person.firstName);

// 默认参数? 需要 ( )
people.map((person = {}) => person.nicknames[0] || person.firstName);

// 返回对象? 需要 ( )
people.map(person => ({
  preferredName: person.nicknames[0] || person.firstName
}));
```

函数中的 this 提供了一个对象上下文来使该函数运行。

```js
var Auth = {
  authorize() {
    var credentials = this.username + ":" + this.password;
    this.send(credentials, resp => {
      if (resp.error) this.displayError(resp.error);
      else this.displaySuccess();
    });
  },
  send() {
    // ..
  }
};

// Login 继承了 Auth 原型，因此两个对象之间可以共享 this

var Login = Object.assign(Object.create(Auth), {
  doLogin(user, pw) {
    this.username = user;
    this.password = pw;
    this.authorize();
  },
  displayError(err) {
    // ..
  },
  displaySuccess() {
    // ..
  }
});
```
