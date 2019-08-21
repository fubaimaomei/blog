---
title: "CRUD实践"
author: "凢凢"
date: "2019-08-19"
permalink: "CRUD"
sidebar: "auto"
single: true
---

本次学习项目实战地址: [CRUD 实战](https://github.com/fubaimaomei/koa.git)

## 基础知识

Node.js 是一个基于 Chrome v8 引擎的 JavaScript 运行时环境。

> 运行时环境或运行时，托管运行时环境，亦或称之为 JavaScript 引擎。

运行时是一个网络搭建平台，它把运行在底层的操作系统和体系结构的特点抽象出来，承担解释与编译、堆管理、来及回收机制、内存分配、安全机制等功能。

Chrome v8 引擎是一个高性能的 JavaScript 解释引擎。

Node.js 使用了事件驱动、非阻塞式 I/O 模型。轻量又高效，**Node 并不是构建大型服务器网站的最佳选择**。

事件驱动是一种处理数据的方式，这种方式与传统的 CRUD 截然不同。在 CRUD 模式中只保存数据的当前状态，因此所有的后续变更都会直接在数据本体上进行处理。

这样做的弊端：

- CRUD 会直接在数据存储区进行操作，会降低响应速度和性能水平，对进程的开销过大也会限制项目的规模和可扩展性。
- 在存在大量并发用户的协作域中，对于同一数据主体的操作很可能会引起冲突
- 在没有额外监听措施的情况下，任何节点都能够获得只有当前的状态快照，历史数据会丢失

使用 Node.js 进行开发的过程其实就是使用 JavaScript 结合一些列处理核心功能的模块来创建 Web 服务器、通信等工具的过程。

NPM 的模块开发原则是大版本相同的接口必须保持兼容，然而这个原则并非强制执行，因此用户下载的最新版本也许会导致依赖包的行为完全不兼容，从而导致模块不可用。

package-lock.json 锁定了依赖版本号，用户下架将得到完全一致的依赖包，提高模块的稳定性和可用性。

`nvm install stable`
`nvm install 8.11.1`
`nvm install 8.11`
`nvm ls-remote`
`nvm use 8.11.1`
`nvm ls`
`nvm nvm alias default node`

NProxy 代理工具

`npm i -g nproxy`

启动 代理地址默认为 127.0.0.1:8989

`nproxy -l replace_rule.js`

replace_rule.js

```js
module.exports = [
    {
        pattern: 'homepage.js'  // pathname
        responder: "/home/goddyzhao/workspace/homepage.js" //替换资源
    }
]

```

`ctx.response.redirect(url,[alt])`

该方法用于将状态码 302 重定向到 URL，例如用户登录后重定向到网站的首页。

全局属性挂载在 ctx.state 上。

`ctx.cookies.get(name,[options]);` 读取

`ctx.cookies.set(name,value,[options]);` 设置

`ctx.throw(500)` 把错误信息返回给用户

koa-compose 可以组和多个中间件为单一中间件,通过 app.use 注册使用

favicon 是 DOM 渲染时默认自带的静态资源。

```js
class Router {
    constructor() {
        this._routes = []; // 缓存路由规则
    }

    get(url,handler) {
        this._routes.push({
            url，
            method: 'GET',
            handler
        });
    }

    routes() {
        return async (ctx,next) => {
            const { method,url } = ctx;
            const matchedRouter = this._routers.find( r => r.method === method &&  r.url === url );
            if( matchedRouter && matchedRouter.handler ){
                await matchedRouter.handler(context,next);
            }else{
                await next();
            }
        }
    }
}

module.exports = Router;
```

## RESTful 规范

REST 的全称 Representational State Tranfer 即表现出状态转移.

REST 设计一般符合以下条件：

- 程序或应用的事物都应该抽象为资源
- 每个资源对应唯一的 URI
- 使用统一接口对资源进行操作
- 对资源的操作不会改变资源标识
- 所有的操作都是无状态的

```js
// https://api.test.com/users   // create
// https://api.test.com/users/:id // delete
// https://api.test.com/users/:id // put
// https://api.test.com/users/:id // get

router
    .post('/users',(ctx,next) => {
        ctx.boyd = `新增了一位用户`;
    })
    .del('/users/:id',(ctx.next) => {
        ctx.body = '删除了用户编号为id的用户';
    })
    .put('/users/:id',(ctx.next) => {
        ctx.body = '修改了用户编号为id的用户';
    })
    .get('/users/:id',(ctx.next) => {
        ctx.body = '我是编号为id的用户信息';
    })
```

#### 名称路由

```js
router.get('user'.'/users/:id',async (ctx,next) => {
    // ...
})

router.url('user',3) // 调用路由的名称,生成路由 == "/users/3"

router.use(async (ctx,next) => {
    ctx.redirect(ctx.router.url('sign-in')) // 路由重定向
})
```

#### 嵌套路由

```js
const forums = new Router();
const posts = new Router();

posts.get('/',async (ctx,next){  })
posts.get('/:pid',async (ctx,next){  })
forums.use('forums/:fid/posts',posts.routes(),posts.allowedMethods())
app.use(forums.routes());

// usage

// /forums/123/posts // 文章列表接口
// /forums/123/posts/123 //某篇文章接口
```

#### 路由前缀

```js
let router = new Router({
  prefix: "/users"
});

router.get("/", async (ctx, next) => {
  // 匹配 /users
});
```

#### url 参数

```js
router.get("/:category/:title", function(ctx, next) {
  // /programming/how-to-koa
  console.log(ctx.params);
  // -> { category: 'programming',title: 'how-to-koa' }
});
```

对于资源访问的权限控制，最常见的两种方式

- 基于 cookie 的认证模式
- 另一种是 Token 的认证模式 (无状态)

#### HTTP

http/1.0 新增了 post / put / head / delete / link 等命令。还增加了头部信息 User-Agent/Accept/Last-modified/content-type

http/1.1 又做了大量改进

- 默认使用持久连接
- 引入管道方式支持多请求发送
- 请求头增加 Host 字段，使一台物理服务器可以存在多个虚拟主机，共享同一 IP 地址
- 响应头增加 Transfer-Encoding 字段，引入 chunked 分块传输编码机制
- 增加 Cache-Control 头域，缓存机制更加强大
- 增加 Content-Range 头域，实现带宽优化
- 新增多种方法 OPTIONS / TRACE / CONNECT 等
- 新增 24 个 HTTP 状态码,如 203,205,206,307 等

URI - 同一资源标识符
URL - 统一资源定位符

URL 是 URI 的子集。

一个完整的 URL 一般由 7 部分组成

`scheme: [//[user[:password]@host[:port]][/path][?query][#fragment]]`

HTTP/2.0

HTTP/1.\* 均采用文本格式传输数据，而 HTTP/2 则选择了二进制格式传输数据。在 HTTP/2 中，基本的协议单位是帧，每个数据流以消息的形式发送，消息由一个或多个帧组合而成。帧的内容包括： 长度，类型，标记，保留字段，流标识符和帧主体。

HTTP/2.0 支持双向数据流,HTTP 并发多请求，必需创建多个 TCP 连接，1.1 引入了流水线技术，但先天的先进先出机制导致当前请求依赖于上一个请求的结束。在搞密集 IO 中，容易引起报头阻塞。

2.0 一个域名只需占用一个 TCP 连接，通过数据流，以帧为基本协议单位，避免了因频繁创建连接产生的延迟，减少了内存消耗，提升了使用性能。

客户端可以提供 Weight 一个 8 位无符号整形，代表流的优先级，高优先级的流会被服务器优先处理并返回给客户端。

## MVC

MVC 全名 Model View Controller ,模型、视图、控制器。MVC 是一种设计典范，用逻辑、数据、视图分离的方式组织代码，在对界面及用户交互进行修改的同时，业务逻辑的部分代码可以保持不变。

MVC 不是一种技术，是一种设计理念。MVC 模式主要采用分层的思想来降低耦合度，从而使系统更加灵活，扩展性更强。

三层架构是一个分层式的架构设计理念，如有必要，也可以分为多层，分层的设计理念契合了 “高内聚低耦合”的思想，在软件系架构设计中最常见，也是最重要的一种结构。

**虽然 MVC 和三层架构看起来非常像，但本质上两者完全不一样。**

MVC 可以理解为三角结构，视图向控制器发送更新通知，控制器更新模型，然后出发视图更新。
三层架构更像是线性结构，界面层不能直接与数据访问层通信，它们之间必需通过业务逻辑层来访问。三层架构是一种架构设计理念，适用于所有项目，MVC 模式更像是对界面层的细化。

但不管是 MVC 还是三层架构，其设计理念都是一致的：分层，解耦。

> 总结，三层架构是线性结构，MVC 是三角结构。

开发 Web 应用时，必然会涉及两个方向：一个是前端界面，另一个是后端服务。

常规的 SPA 不利于 SEO，不利于 SSR。

模版引擎是 Web 应用中用来生成动态 HTML 的工具，负责将数据模型与 HTML 模版结合，生成最终的 HTML 。

**模版引擎是为了解决用户界面与数据分离而产生的。**

浏览器通过 MIME Type 来区分不同的资源类型，而 MIME Type 是由 web 服务器告知浏览器的，被定义在 Content-Type-header 中。

MIME 多用于互联网邮件扩展类型，当该扩展类型的文件被访问的时候，浏览器会自动打开相应的程序来打开。

实际项目开发中，使用工具查看 HTTP 请求过程，若返回的页面响应头信息中指定了 content-type:text/html ，则浏览器会把字符串渲染成 HTML 页面。HTTP 请求的整个过程中所传输的数据，本身没有任何特定的格式和形态，但客户端接收到数据时，会按照 MIME Type 指定的方式去处理。

因此客户端期望的 JSON 数据，也因此处理。即告知客户端数据类型是 JSON，客户端就会按照 JSON 格式来解析了。

关键代码:

`ctx.set("Content-Type","application/json")`

`ctx.body = JSON.stringify(json);`

把上述步骤处理为 Koa 中间件

```js
module.exports = () => {
  function render(json) {
    this.set("Content-Type", "application/json");
    this.body = JSON.stringify(json);
  }
  return async (ctx, next) => {
    ctx.send = render.bind(ctx); // 扩展 ctx
    await next();
  };
};
```

## 数据库

数据库具备以下特点:

- 数据共享。数据库中的数据可以同时被多人查询和写入。
- 减少数据冗余。与文件系统对比，数据库实现了数据共享，从而避免了文件复制，降低了数据冗余度。
- 数据独立。数据库中的数据和业务是独立的。
- 数据一致性和可维护性。数据库中的数据应当保持一致，以防止数据丢失和越权使用。在同一周期内，既能允许数据实现多路存取，也能防止用户之间的数据操作相互影响。 一般情况下是通过隔离级别来保证数据的一致性。
- 故障恢复。可以及时发现故障和修复故障，从而防止数据被损坏。

数据库的操作都是基于事务，可以通过索引来提升查询效率。

一般来说，非关系数据库存储的数据结构比较简单，并且不需要支持复杂的查询。在开发时，可以选择 MongoDB 这样的数据库来存储。

[Mysql workbench 使用说明](https://www.jianshu.com/p/c3dcd4d9ce69)

Node.js 中，一般采用 sequelize 这个 ORM 类库来操作数据库。sequelize 相比 SQL 提供了更加快捷方式存取数据到数据库里。

`npm install sequelize -S`

## 数据库连接池

数据库连接池是程序启动时建立足够的数据库连接，并将这些连接组成一个连接池，由程序动态地对池中的连接进行申请，使用，释放。

> 通俗理解：创建数据库连接池是一个很耗时的操作，也容易对数据库造成安全隐患。所以，在程序初始化的时候，集中创建多个数据库连接，并把他们呢集中管理，供程序使用，可以保证较快的数据库读写速度，还更安全可靠。

访问 MySQL 服务器的软件包，称为驱动程序。mysql 命令行程序用的是 C 驱动。

## Session

Session 也被称为 "会话控制",顾名思义，它是用于控制网络会话的，如用户的登录信息、购物车中的商品，或者用户的一些浏览喜好都可以存储在 Session 中。HTTP 是一种无状态的协议，本身无法标识一次特定的会话，所以需要一种机制去保存当前用户的特定信息。Session 就是其中一种保存会话信息的实现方式，有了 Session，不同的用户登录购物网站之后就能看到各自购物车中的商品了，否则，所有的用户将会操作同一个购物车。
Session 中的数据是保存在服务器端的。在服务器端有很多种存储方式，即可以直接保存在内存中，也可以保存在 Redis、MogonDB、MySQL 等数据库中，甚至可以保存在普通的文件中。但是 Session 中的数据一般都是短时间内高频率访问的，需要保证性能，所以比较好的方式是内存配合 Redis 做一个持久化。这是因为内存访问的性能是最好的，但是容易丢失数据，如遇到重启服务器等情况。因此，可以在 Redis 中做一个备份，当内存中的数据丢失时，就可以从 Redis 中恢复数据。

除了服务端保存完整的 Session 数据外，还需要在客户端通过 cookie 来保存 Session 的一个唯一标识，通常是一个 ID ，通过这个 ID 可以匹配到服务器端完整的 Session 数据。**使用 Cookie 存储 Session 的 ID 是因为每个 HTTP 请求头中都可以带上 Cookie 信息**，并且可以根据情况这是 HttpOnly 为 true,防止客户端恶意篡改 Session 的 ID。

## 单元测试

单元测试又称模块测试，是对程序进行检验的测试工作。所谓单元是指程序应用的最小可测试部件，通常是单个函数、过程或方法。单元测试是开发者通过代码完成的。

单元测试通常拥有如下优势

- 尽早发现问题并进行更正。
- 简化集成测试的复杂度。
- 生成文档，并且在代码迭代中，测试代码可以减少大量重复测试行为。

TDD 是测试驱动开发(Test Driven Developemnt)的简称，倡导首先写测试程序，然后编写实现其功能；
BDD 是行为驱动开发(Behavior Driven Development)的简称，是一种测试驱动开发的回应，鼓励软件项目中的开发者、测试人员和非技术人员进行协作，**通过用自然语言书写非程序员可读的测试用例**扩展了测试驱动开发方法。TDD 和 BDD 并非是对立概念，而是不同层级的概念。

#### Chai 断言库。

所谓断言是一种在程序中的逻辑判断，目的是检查结果与开发者的预想一致。
Node.js 内置了 Assert 断言库，但 Assert 并不是一个真正测试运行器，没有便捷的 API 可供使用，所以在单元测试是首推使用 Chai。

chai 包含三个断言库:

- Expect BDD
- Should BDD
- Assert TDD

Mocha 是一个功能丰富且流行的 JavaScript 测试框架，支持回调函数/Promise/Async 等。Mocha 是一个测试框架，所谓测试框架，就是运行测试的工具会接管单元代码的执行，可以理解为一个任务运行器，配合断言库判断代码是否符合预期结果。同时 Mocha 也会提供一个简单的测试结果。

## 优化与部署

在应用中，记录完善的日志可以带来如下好处

- 显示程序运行状态。
- 帮助开发者排除故障
- 结合专业的日志分析工具给出预警. (Elasticsearch、Logstash、Kibana)

日志分类

- 访问日志 记录用户的访问信息
- 应用日志 开发者根据业务需求输出的调用跟踪、警告和异常等信息

日志等级

- trace 调用的跟踪信息，标记方法被调用，级别最低
- debug 调试信息
- info 非调试和跟踪的信息
- warn 警告信息
- error 错误信息
- fatal 严重错误信息

## Docker

Docker 是个容器引擎，能够让应用部署在软件容器下，这个容器是在 linux 操作系统上的一个软件抽象层。和传统的采用虚拟机部署相比，Docker 所创建的多个独立容器是可以在单一 Linux 实体下运行的，这些容器共享一个宿主内核。而不像在**虚拟机中需要一个完整的操作系统来运行应用**。
因此，Docker 可以更快地启动并占用更少的资源。

Docker 是一个更适合 云时代 的开发部署方式。传统的部署中都需要对宿主机或虚拟机进行大量的环境配置，有时候需要开发人员和运维人员才能完成部署；而在 Docker 部署中，开发人员可以直接打包一个 Docker 环境的镜像，所有的配置都在镜像中完成；运维只需要将镜像加载到 Docker 中即可。通过容器，还可以隔离不同容器中的应用环境，从而能在宿主机中运行大量应用，而这些应用不会相互影响。
