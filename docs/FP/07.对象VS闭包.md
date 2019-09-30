---
title: "对象VS闭包"
date: "2019-08-04"
permalink: "2019-08-04-isomorphism"
---

#### 达成共识

```js
// 简单闭包函数
function outer() {
  var one = 1;
  var two = 2;

  return function inner() {
    return one + two;
  };
}

var three = outer();

three(); // 3

// 简单的对象
var obj = {
  one: 1,
  two: 2
};

function three(outer) {
  return outer.one + outet.two;
}

three(obj); // 3
```

#### 相像

请记住：

1. 一个没有闭包的编程语言可以用对象来模拟闭包。
2. 一个没有对象的编程语言可以用闭包来模拟对象。

**我们可以认为，闭包和对象是一样东西的两种表达方式**

#### 状态

```js
function outer(){
    var one = 1;
    var two = 2;

    return inner(){
      return one + two;
    };
}

var obj = {
    one: 1,
    two: 2
};
```

inner()和对象 obj 持有的作用域都包换了两个元素状态：值为 1 的 one，和值为 2 的 two。

```js
var point = {
  x: 10,
  y: 12,
  z: 14
};

// 将上面你的对象转换成闭包

function outer() {
  var x = 10;
  var y = 12;
  var z = 14;
  return function inner() {
    return [x, y, z];
  };
}

var point = outer();
```

如果你有一个嵌套对象会怎样？

```js
var person = {
    name: "Kyle Simpson",
    address: {
        street: "123 Easy St",
        city: "JS ville",
        state: "ES"
    }
};

// 我们同样可以用闭包来表示相同的状态

function outer(){
    var name = "Kyle Simpson",
    return middle();
    function middle(){
        var street = "123 Easy St";
        var city = "JS ville";
        var state = "ES";

        return function inner(){
            return return [name,street,city,state];
        }
    }
}

var peson = outer();
```

接着让我们换个角度来思考，也就是从闭包转为对象

```js
function point(x1, y1) {
  return function distFromPoint(x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
}

var pointDistance = point(1, 1);

pointDistance(4, 5); // 5

function pointDistance(point, x2, y2) {
  return Math.sqrt(Math.pow(x2 - point.x1, 2) + Math.pow(y2 - point.y1, 2));
}

pointDistance(
  { x1: 1, y1: 1 }, // 上面的distFromPoint被替换成了point对象
  4, // x2
  5 // y2
);
// 5
```

#### 封装

> 封装： 是指将数据和行为捆绑在一起的行为

```js
function person(name,age) {
    return happyBirthday(){
        age++;
        console.log(
            "Happy " + age + "th Birthday, " + name + "!"
        );
    }
}

var birthdayBoy = person( "Kyle", 36 );
// name和age是闭包变量，因此happyBirthday可以持有该状态
birthdayBoy();  // Happy 37th Birthday, Kyle!

// 用对象来实现同等效果
var birthdayBoy = {
    name: "Kyle",
	age: 36,
	happyBirthday() {
		this.age++;
		console.log(
			"Happy " + this.age + "th Birthday, " + this.name + "!"
		);
	}
}

birthdayBoy.happyBirthday();
// Happy 37th Birthday, Kyle!
```

闭包是将一个函数与一系列状态结合起来，而对象是在保有相同状态的基础上，允许任意数量的函数来操作这些状态，通过 this 这个隐式对象访问即可。

```js
var person = {
    firstName: '杨',
    lastName: '凡',
    //  暴露两个接口，供外部使用
    first() {
        return this.firstName;
    },
    last(){
        return this.lastName;
    }
}

person.first() + person.last();

// 闭包实现

function createPerson(firstName,lastName) {
    return API;

    // ************


    function API(methodName){
        swtich (methodName) {
            case: 'first':
                    return first();
                    break;
            case: 'last':
                    return last();
                    break;
        };
    }

    function first(){
        return firstName;
    }

    function last(){
        return lastName;
    }
}

var person = createPerson( "杨", "凡" );

person( "first" ) + person( "last" );

// 这个例子讲述的是：相同的程序不同的实现。
```

#### (不)可变

这两种形式都有典型的可变行为。

```js
function outer() {
  var x = 1; // 不可变
  var y = [2, 3]; // 可变

  return function inner() {
    return [x, y[0], y[1]];
  };
}

var xyPublic = {
  x: 1, // 不可变
  y: [2, 3] // 可变
};

function outer() {
  var x = 1;
  return middle();

  // ********************

  function middle() {
    // 将 y 同构成闭包
    var y0 = 2;
    var y1 = 3;

    return function inner() {
      return [x, y0, y1];
    };
  }
}

var xyPublic = {
  x: 1,
  y: {
    0: 2,
    1: 3
  }
};

// 基本类型的值是不可变的，不论是用嵌套对象还是嵌套闭包代表状态，这些被持有的值都是不可变的。
```

#### 同构

何为同构？

> 同构的意思就是：两件事物 A 和 B 如果你能够转换 A 到 B 并且能够通过反向映射回到 A，那么它们就是同构的。

JS 中的同构，指的是它能将一集合的 JS 代码转化为另一集合的 JS 代码，并且，你还可以把转换后的代码转为之前的。

根据上述演变，不难看出**对象是闭包的一种同构表示**。

#### 内部结构

```js
function outer(){
    var x = 1; // x 是如何被保存持有的?
    return inner(){
        return x;
    }
}
// 简单说明 outer 会形成一个作用域气泡，气泡中保存了 x 变量。

// 一种假定的想象
scopeOfInner = {};
Object.setPrototypeOf( scopeOfInner, scopeOfOuter  ) // 通过原型链来查找x状态
```

#### 同根异枝

闭包的结构是不可变的，正如不能单独设置字符串的子串，但对象默认是可变的。只要他没有被完全冻结(Object.freeze(..))。

```js
// 一个追踪游戏按键的例子
function trackEvent(evt, keypresses = []) {
  return keypresses.concat(evt);
}

var keypresses = trackEvent(newEvent1);

keypresses = trackEvent(newEvent2, keypresses);

function trackEvent(evt, keypresses = () => []) {
  return function newKeypresses() {
    return [...keypresses(), evt];
  };
}

var keypresses = trackEvent(newEvent1);

keypresses = trackEvent(newEvent2, keypresses);

// 对象是扩展的，闭包不是，同样的逻辑，它却需要额外的多层封装，而对于数组，我们只需要改变它就足够了。
```

#### 私有

> 信息隐藏等同于私有

**闭包是通过词法作用域来提供“程序的私有状态”**

```js
function outer() {
  var x = 1;

  return function inner() {
    return x;
  };
}

var xHidden = outer();

xHidden(); // 1

var xPublic = {
  x: 1
};

xPublic.x;

function trackEvent(
  // 使用闭包后，内部的变量将变为有权限代码，程序的其他部分是受限访问的。
  evt,
  keypresses = {
    list() {
      return [];
    },
    forEach() {}
  }
) {
  return {
    // 必需得公开一个特权方法来操作forEach和list状态
    list() {
      return [...keypresses.list(), evt];
    },
    forEach(fn) {
      keypresses.forEach(fn);
      fn(evt);
    }
  };
}

// ..

keypresses.list(); // [ evt, evt, .. ]

keypresses.forEach(recordKeypress);
```

#### 拷贝状态

```js
var a = [1, 2, 3];

var b = a.slice();
b.push(4);

a; // [1,2,3]
b;

var o = {
  x: 1,
  y: 2
};

// 在 ES2017 以后，使用对象的解构：
var p = { ...o };
p.y = 3;

// 在 ES2015 以后：
var p = Object.assign({}, o);
p.y = 3;

// 闭包的拷贝如何实现?
```

#### 性能

对象的性能优于闭包，因为 JS 的 GC 是有 JS 引擎自动完成的，但存放在闭包中的状态，将得不到释放，除非你不再使用闭包。

```js
function StudentRecord(name, major, gpa) {
  return function printStudent() {
    return `${name}, Major: ${major}, GPA: ${gpa.toFixed(1)}`;
  };
}

var student = StudentRecord("Kyle Simpson", "kyle@some.tld", "CS", 4);

// 随后

student();
// Kyle Simpson, Major: CS, GPA: 4.0

// 闭包的同构表示 —— 对象

function StudentRecord() {
  return `${this.name}, Major: ${this.major}, GPA: ${this.gpa.toFixed(1)}`;
}

var student = StudentRecord.bind({
  name: "Kyle Simpson",
  major: "CS",
  gpa: 4
});

// 随后

student();
```
