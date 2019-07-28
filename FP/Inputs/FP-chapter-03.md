---
title: 'Inputs'
data: '2019-07-28'
permalink: '2019-07-28-Inputs'
---

> 一个函数签名长这样 foo(a,b = 1,c)

#### 立即传参和稍后传参

```js
 // 想象一个场景，你要发送多个已知多个URL的API请求，但这些请求的数据和处理响应信息的回调函数要稍后才能知道。

 function ajax(url,data,callback) {
     //..
 }
```

一种比较好的解决方案，预设你知道的所有 Url 实参,其内部仍发起 ajax 请求

```js
function getPerson(data,cb) {
    ajax( 'http://sonme.api/person', data, cb );
}

function getOrder(data,cb){
    ajax( 'http://some.api/order', dtaa, cb );
}

// 代码变得乏味冗余，甚至看起来很傻 ,哈哈
```

在这里 getPerson是ajax函数的**偏函数**

> 该术语表达的概念是：在函数调用现场，将实参应用于形参。该模式的本质就是减少函数参数个数的过程,这里的参数值得是 arity。

```js
//  该模式的可视化版本
function partial(fn,...prestArgs){
    return function partiallyApplied(...nextArgs){
        return fn(...prestArgs,...nextArgs);
    }
}

// 箭头函数版本
const partial = (fn,...presetArgs) => 
                        (...nextArgs) => 
                            fn(...presetArgs,...nextArgs);

```

##### usage

```js
var getPerson = partial( ajax, 'http://some.api/person' );
var getOrder = partial( ajax, 'http://some.api/person' );
```

##### getCurrentUser 

```js
const getCurrentUser = partial(
    ajax,
    'http://some.api/person',
    { user: CURRENT_USER_ID }
);

const getCurrentUser = patial( getPerson, { user: CURRENT_USER_ID } );

//  getCurrentUser源代码解析

var  getCurrentUser = function outerPartiallyApplied(...outerLaterArgs) {
    var getPerson = function innerPartiallyApplied(...innerlaterArgs){
        return ajax('http://some.api/person',...innerLaterArgs);
    }
    return getPerson( { user: CURRENT_USER_ID }, ...outerLaterArgs )
}
```

另外一个例子

```js
function add(x,y) {
    return x + y;
}

[1,2,3,4,5],map( function adder(val){
    return add( 3,val ); 
} );

// [ 4,5,6,7,8 ]
```
add函数签名不是map函数所预期的，因此在其之上封装一层adder用以管理函数输入。但仔细观察，其中的模式跟上面的partial很象，因此我们可以使用partial来调整add函数签名，以符合map函数的预期。

```js
[1,2,3,4,5].map( partial( add, 3 ) );

// [ 4,5,6,7,8 ]
```

#### bind(..)

 该函数有两个功能:预设 this 关键字的上下文，以及偏应用实参。当将两个功能同时放在一个函数上，是极其糟糕的决定。因为大多数的时候，你并不想关心 this 的绑定，而只是偏应用实参。

 #### 将实参顺序颠倒

 ```js
//  继续之间的ajax例子，ajax( url, data, cb )。这次的需求是先偏应用 cb ,稍后在指定 url , data参数。

function reverseArgs(fn){
    return function argsReversed(...args){
        return fn( ...args.reverse() );
    }
}

// 箭头函数版本

const reverseArgs = fn =>
                    (...args) =>
                        fn( ...args.reverse() );
 ```

 实战

 ```js
var cache = {};

// 恢复后的 partiallyAppliied(url,data) 
var cacheResult = reverseArgs(
    // 颠倒后的顺序 ajax( cb, data,url  )
    partial( reverseArgs( ajax ), function onResult(obj){
        cache[obj.id] = obj;
    } )
)

//  先将 ajax 参数颠倒，为了恢复期望的实参，接着我们又将偏应用后的实参顺序颠倒了一下。

//  根据上面的模式，接着封装一个partialRight(..)实用函数

function partialRight(fn,...presetArgs){
    return reverseArgs(
        partial( reverseArgs( fn ),...presetArgs.reverse() )
    );
}
// 预设cb
var cacheResult = partialRgiht( ajax, function onResult(obj){
    cache[obj.id] = obj;
} );

cacheResult( 'http://some.api/person', { user: CURRENT_USER_ID } );
 ```

partialRight只能确保一些值被当做原函数最右边的实参传入，却不能保证特定的形参接收特定的被偏应用的值。

```js
function foo(x,y,z) {
    var rest = [].slice.call( arguments, 3 );
    console.log( x,y,z,rest );
}

var f = partialRight( foo, 'z:last' );

f( 1, 2 );			// 1 2 "z:last" []

f( 1 );				// 1 "z:last" undefined []

f( 1, 2, 3 );		// 1 2 3 ["z:last"]

f( 1, 2, 3, 4 );	// 1 2 3 [4,"z:last"]

```

#### 一次传一个

> 一个期望接收多个实参的函数拆解成连续的链式函数,这就是柯里化技术

```js
curriedAjax('http://some.api/person')
                ( { user: CURRENT_USER_ID } )
                    ( function foundUser(user){ /* .. */ } );

// source code 拆解成一系列的单元链式函数
var personFetcher = curriedAjax( "http://some.api/person" );

var getCurrentUser = personFetcher( { user: CURRENT_USER_ID } );

getCurrentUser( function foundUser(user){ /* .. */ } );
```

实现柯里化函数

```js
function curry(fn,arity = fn.length){
    return nextCurried(prevArgs){
        return function curried(nextArgs){
            var args = prevArgs.concat( [nextArgs] );
            if(args.length = arity){
                fn(...args);
            }else{
                return nextCurried(args);
            }
        };
    }([]);
}

// 箭头函数版本
const curry = (fn,arity = fn.length) => 
                        (nextCurried = prevArgs =>
                            nextArgs => {
                                var args = prevArgs.concat( [nextArgs] );
                                    if(args.length = arity){
                                        fn(...args);
                                    }else{
                                        return nextCurried(args);
                                    }
                            }  
                        })([])
```

实战

```js
    var curriedAjax = curry( ajax )( "http://some.api/person"  )({ user: CURRENT_USER_ID })( function foundUser(user){ //.. } )


// 回顾 add 函数

var adder = curry( add );

[1,2,3,4,5].map( adder(3) ); // [ 4,5,6,6,8 ]
```

> JavaScript中，偏应用与柯里化都使用闭包来保存实参，知道收齐到所有实参后我们再执行原函数。

#### looseCurry

```js
function looseCurry(fn,arity = fn.length){
    return (function nextCurried(prevArgs){
        return function curried(...nextArgs){
            let args = prevArgs.concat( nextArgs );

            if(args.length >= arity){
                return fn(...args);
            }
            else {
                return nextCurried( args );
            }
        }
    })( [] );
}

// 箭头函数版本

const looseCurry = (fn,arity = fn.lenth) => 
                        ( nextCurried = prevArgs => 
                                            nextArgs => {
                                                let args = prevArgs.concat( nextArgs );

                                                if(args.length >= arity){
                                                    return fn(...args);
                                                }
                                                else {
                                                    return nextCurried( args );
                                                }
                                            }
                        )( [] )
```

#### 反柯里化

```js
    function uncurry(fn){
        return function uncurried(...args){
            var ret = fn;

            for(var i=0;i<args.length;i++){
                ret = ret(args[i])
            }
            return ret;
        }
    }

    const uncurry = fn => 
                        (...args) => {
                            var ret = fn;
                            
                            for(let i = 0; i< args.length;i++){
                                ret = ret( args[i] );
                            }

                            return ret;
                        }
    // 如果预期参数传入不够，那么将会返回一个等待更多实参的柯里化函数，而不是函数调用结果。                       
```

#### 只要一个参数

```js
function unary(fn){
    return function onlyOneArg(arg){
        return fn(arg);
    }
}

// 箭头函数版本
const unary = fn => 
                    arg =>
                            fn(arg);
```

####  传一个返回一个

```js
function identity(v){
    return v;
}
// 箭头函数版本
const identiy = 
                v => 
                        v;
// 该函数可以作为filter函数的断言,等同于Boolean() 
```

#### 恒定参数

```js
function constant(v){
    return function value(){
        return v;
    }
}

// or the ES6 => form
var constant =
	v =>
		() =>
			v;
```

#### 扩展和展开

```js
// 虽然ES6的扩展运算符可以帮助我们解决这个问题,但多数情况下，我们无法直接改变函数签名，由此我们使用下面2个函数。

function spreadArgs(fn){
    return function spreadFn(argsArr){
        return fn( ...argsArr );
    }
}

// or the ES6 => form

const spreadArgs = fn => 
                        argsArr => 
                                    fn( ...argsArr );

// 与 spreadArgs 具有相反功能的实用函数

function gatherArgs(fn){
    return gatheredFn(...args){
        return fn( args );
    }
}

// ES6 箭头函数形式
var gatherArgs =
	fn =>
		(...argsArr) =>
			fn( argsArr );
```

#### 参数顺序那些事

```js
// 通过对象的解构赋值，来将命名参数映射到相应的形参上。
function partialProps(fn,presetArgsObj) {
    return function paritalApplied(laterArgsObj){
        return fn( Object.assign( {} , presetArgsObj, laterArgsObj ) )
    }
}

function curryProps(fn,arity = 1){
    return (function nextCurried(prevArgsObj){
        var [key] = Object.keys( nextArgsObj );
        var allArgsObj = Object.assign( {}, prevArgsObj, nextArgsObj);

        if(Object.keys( allArgsObj ).length >= arity){
            return fn( allArgsObj );
        }else{
            nextCurried( allArgsObj );
        }
    })([])
}

```

####  无形参风格

```js
function double(x){
    return x * 2;
}

[1,2,3,4,5].map( function mapper(v){
    return double( v );
} );
// [2,4,6,8,10]


function double(x) {
	return x * 2;
}

[1,2,3,4,5].map( double );
// [2,4,6,8,10]
```

更多的例子

```js
function output(txt) {
    console.log(txt);
}

function printIf( predicate,msg ){
    if( predicate( msg ) ){
        output( msg );
    }
}

function isShortEnough(str) {
    return str.legnth  <= 5;
}

var msg1 = 'Hello';
var msg2 = msg1 + " World";

printIf(isShortEnough,msg1);  //  Hello
printIf(isShortEnough,msg2);

function isLongEnough(str){
    return !isShortEnough(str);
}

printIf( isLongEnough,msg1 )
printIf( isLongEnough,msg2 ) // Hello World

function not(predicate) {
    return function negated(...args){
        return !predicate( ...args );
    };
}

// ES6 箭头函数形式
var not =
	predicate =>
		(...args) =>
            !predicate( ...args );

// 使用 not 函数重构  isLongEnough(..) 函数

var isLongEnough = not( isShortEnough );
print( isLongEnough,msg2 ); // Hello World

function when(predicate,fn){
    return function conditional(...args){
        if(predicate(...args)){
            return fn(...args)
        }
    }
}

// ES6 箭头函数形式
var when =
	(predicate,fn) =>
		(...args) =>
            predicate( ...args ) ? fn( ...args ) : undefined;

var printIf = uncurry( rightPartial( when, output ) );

function output(msg) {
	console.log( msg );
}

function isShortEnough(str) {
	return str.length <= 5;
}

var isLongEnough = not( isShortEnough );

var printIf = uncurry( partialRight( when, output ) );

var msg1 = "Hello";
var msg2 = msg1 + " World";

printIf( isShortEnough, msg1 );			// Hello
printIf( isShortEnough, msg2 );

printIf( isLongEnough, msg1 );
printIf( isLongEnough, msg2 );	
```
















