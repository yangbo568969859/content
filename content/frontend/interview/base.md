# 基础

## 进程和线程

进程是 CPU 资源分配的最小单位
线程是 CPU 资源调度的最小单位

进程和线程之间的关系如下

- 一个进程可以创建多个线程，这些线程共享同一个地址空间和资源，能够并发执行任务
- 线程在进程内部创建和销毁的，他们与进程共享进程的上下文，包括打开的文件，全局变量和堆内存等
- 每个进程至少包含一个主线程，主线程用于执行进程的主要业务逻辑，其它线程可以作物辅助线程来完成特定任务

多进程：在同一个时间里，同一个计算机系统中允许两个或两个以上的进程处于运行状态
多线程：程序包含多个执行流，即在一个程序中可以同时运行多个不同的线程来执行不同的任务，就是说允许单个程序创建多个并行执行的线程来完成各自的任务

- 堆内存
  - js 中对象、数组、函数等复杂数据类型都存储在堆内存中
  - 使用 new 关键字或对象字面量语法创建对象时，会在堆内存中分配相应的内存空间
  - 堆内存的释放由垃圾回收机制自动处理，当一个对象不在被引用时，垃圾回收机制会自动回收器占用的内存，释放资源
- 栈内存
  - js 中的基本数据类型，数字、布尔值、字符串以及函数的局部变量报仇呢在栈内存中
  - 栈内存的分配时静态的，编译器在编译阶段就确定了变量的内存空间大小
  - 当函数被调用时,会在栈内存中创建一个称为栈帧 stack frame 的数据结构,用于存储函数的参数、局部变量、返回地址等信息
  - 当函数执行完毕或从函数中返回时,对应的栈帧会被销毁,栈内存中的数据也随之释放

## 垃圾回收机制

在 js 内存管理中有一个概念叫做可达性，就是那些以某种方式可访问或者说可用的值，他们被保证存储在内存中，反之不可访问则需回收

### 垃圾回收策略

- 标记清除 (Mark-sweep)
  - 此算法分为标记和清除两个阶段，标记阶段即为所有活动对象做上标记，清除阶段则是把没有标记(也就是非活对象)销毁
  - 过程
    - 垃圾收集器在运行时会给内存中的所有变量加上一个标记，假设内存中所有对象都是垃圾，全部标记为 0
    - 然后从各个根对象开始遍历，把不是垃圾的节点改成 1
    - 清理所有标记为 0 的垃圾，销毁并回收他们所占用的内存空间
    - 最后，把所有内存中对象标记修改为 0，等待下一轮垃圾回收
  - 优点：实现简单
  - 缺点：清除之后，剩余的对象内存位置是不变的，会导致空闲内存空间是不连续的，出现内存碎片，并且由于剩余空闲内存不是一整块，它是由不同大小内存组成的内存列表，就会造成内存分配问题
    - 分配速度慢 即使是 first-fit 策略，其操作仍是一个 O(n)的操作，最坏情况是每次都要遍历到最后，同时因为碎片化，大对象的分配效率会变慢
    - 内存碎片化：空闲内存块是不连续的，容易出现很多空闲内存块，还可能出现所分配的内存较大找不到合适的块
  - 标记整理算法(Mark-Compact)算法可以有效解决，它的标记阶段和标记清除算法没有什么不同，只是标记结束后，标记整理算法会将活着的对象向内存的一端移动，最后清理掉边界的内存
- 引用计数 (Reference Counting)
  - 它把 对象是否不再需要 简化定义为 对象有没有被其它对象引用到它，如果没有引用指向该对象(零引用)，对象将被垃圾回收机制回收
  - 问题： 循环引用，引用计数的计数器需要占很大的位置

### v8 中的垃圾回收

分代式垃圾回收：V8 的垃圾回收策略主要基于分代式垃圾回收机制，V8 中将堆内存分为新生代和老生代两个区域，采用不同的垃圾回收器也就是不同的策略来进行垃圾回收

- 新生代
  - 新生代对象为存活时间较短的对象，简单来说就是新产生的对象（通常只支持 1-8mb 容量）
  - 新生代对象是通过一个名为 Scavenge 的算法进行垃圾回收，在 Scavenge 算法主要采用了一种复制式的方法(Cheney)
    - Cheney 算法将堆内存一分为二，一个是处于使用状态的空间 使用区，一个是处于闲置状态的空间 空闲区
    - 新加入的对象都会存放到使用区，当使用区快被写满时，就需要执行一次垃圾清理操作
    - 当开始进行垃圾回收时，新生代垃圾回收器会对使用区中的活动对象做标记，标记完成之后将使用区的活动对象复制进空闲区进行排序，随后进入垃圾清理阶段，即将非活动对象占用的空间清理掉。最后进行角色互换，把原来的使用区变为空闲区，原来的空闲区变为使用区
    - 当一个对象经过多次复制还存活，它将被认为时生命周期较长的对象，随后会被移动到老生代中
    - 另外一种情况：如果复制一个对象到空闲区，空闲区的空间占用超过了 25%，那么这个对象会被直接晋升到老生代空间中（设置为 25%的原因是：当完成 Scavenge 回收后，空闲区翻转成使用区，继续进行对象的内存分配，若占比过大，会影响后续内存分配）
- 老生代
  - 老生代对象为存活时间较长或常驻内存的对象，简单来说就是经历过新生代垃圾回收后还存活的对象(容量通常比较大)
  - 老生代流程采取的是 标记清除算法（标记整理算法解决连续内存问题）

分代式机制把一些新、小、存活时间短的对象作为新生代，采用一小块内存频率较高的快速清理，而一些大、老、存活时间久的对象作为老生代，使其很少接受检查，老生代的回收机制及频率是不同的，此机制的出现很大程度提高了垃圾回收机制的频率

### 垃圾回收其它

增量标记与惰性清理

增量就是将一次 GC 标记的过程，分成了很多小步，每执行完一小步就让应用逻辑执行一会儿，交替多次后完成一轮 GC 标记

缺点：首先是并没有减少主线程的总暂停的时间，甚至会略微增加，其次由于写屏障机制的成本，增量标记可能会降低应用程序的吞吐量

- 三色标记法(暂停与恢复)
  - 白色：未被标记对象
  - 灰色：自身被标记，成员变量(该对象的引用对象)未被标记
  - 黑色：自身和成员变量皆被标记
- 写屏障(增量中修改引用)
  - 一旦有黑色对象引用白色对象，该机制会强制将引用的白色对象改为灰色，从而保证下一次增量 GC 标记阶段可以正确标记，这个机制也被称为强三色不变性

惰性清理

增量标记只是对活动对象和非活动对象进行标记，对于真正的清理释放内存 V8 采用的是惰性清理

- 老生代主要使用并发标记，主线程在开始执行 JavaScript 时，辅助线程也同时执行标记操作（标记操作全都由辅助线程完成）
- 标记完成之后，再执行并行清理操作（主线程在执行清理操作时，多个辅助线程也同时执行清理操作）
- 同时，清理的任务会采用增量的方式分批在各个 JavaScript 任务之间执行

[参考](https://juejin.cn/post/6981588276356317214?searchId=202403152003388D4D643DAD3DC81C4E96)

### v8 垃圾回收总结

将内存中不再使用的数据进行清理，释放出内存空间。V8 将内存分成 新生代空间 和 老生代空间。

- 新生代空间: 用于存活较短的对象
  - 又分成两个空间: from 空间 与 to 空间
  - Scavenge GC 算法: 当 from 空间被占满时，启动 GC 算法
    - 存活的对象从 from space 转移到 to space
    - 清空 from space
    - from space 与 to space 互换
    - 完成一次新生代 GC
- 老生代空间: 用于存活时间较长的对象
  - 从 新生代空间 转移到 老生代空间 的条件
    - 经历过一次以上 Scavenge GC 的对象
    - 当 to space 体积超过 25%
  - 标记清除算法: 标记存活的对象，未被标记的则被释放
    - 增量标记: 小模块标记，在代码执行间隙执，GC 会影响性能
    - 并发标记(最新技术): 不阻塞 js 执行
  - 压缩算法: 将内存中清除后导致的碎片化对象往内存堆的一端移动，解决 内存的碎片化

### 内存泄漏

- 意外的全局变量， 无法被回收
- 被遗忘的计时器或回调函数
- 事件监听: 没有正确销毁 (低版本浏览器可能出现)
- 闭包，会导致父级中的变量无法被释放
- 没有清理的 DOM 元素引用

```javascript
// 意外的全局变量
function foo() {
  bar = "this is a hidden global variable"; // bar没被声明,会变成一个全局变量,在页面关闭之前不会被释放
}
function foo1() {
  this.variable = "potential accidental global"; // this 指向了全局对象（window）
}
foo();
foo1();
// 被遗忘的计时器或回调函数
var someResource = getData();
setInterval(function() {
  var node = document.getElementById("Node");
  if (node) {
    node.innerHTML = JSON.stringify(someResource);
  }
}, 1000);
// 如果id为Node的元素从DOM中移除，该定时器仍会存在，同时，因为回调函数中包含对someResource的引用，定时器外面的someResource也不会被释放
```

如何避免

- 减少不必要的全局变量，或者生命周期较长的对象
- 注意程序逻辑，避免死循环
- 避免创建过多的对象

## 事件循环机制 （event loop）

### js 事件循环

首先我们需要知道：js 是单线程的语言，EventLoop 是 js 的执行机制

异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。宏任务队列可以有多个，微任务队列只有一个

- 宏任务 (包含整体代码 script，setTimeout，setInterval，setImmediate， I/O 操作、UI 渲染)
- 微任务 (Promise，process.nextTick、Object.observe、MutationObserver)

当某个宏任务执行完后，会查看是否有微任务队列，如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前面的任务，执行宏任务的过程中没要到微任务，一次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推

![image](./images/node_eventlop.png)

### node 事件循环

外部输入数据 -> 轮循阶段(poll) -> 检查阶段(check) -> 关闭阶段(close callbacks) -> 定时器检查阶段(timer) -> I/O 阶段(I/O callbacks) -> 闲置阶段(idle, prepare) -> 轮询阶段(poll)

- timer 阶段： 执行到期的 setTimeout/setInterval 队列回调
- I/O 阶段：执行上轮循环循环中的少数未执行的 I/O 回调
- idle，prepare (仅 node 内部使用)
- poll
  - 执行回调
  - 执行定时器
    - 如有到期的 setTimeout/setInterval，则返回 timer 阶段
    - 如有 setImmediate，则前往 check 阶段
- check 阶段 执行 setImmediate
- close callbacks

process.nextTick 独立于 EventLoop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其它 microtask 执行

![image](./images/node_eventlop.png)

## 跨域

前端领域中，跨域是指浏览器允许向服务器发送跨域请求，从而克服 Ajax 只能同源使用的限制

同源策略：协议+域名+端口相同 (即使两个不同的域名指向了同一个 ip 地址，也非同源)

他会限制以下几种行为

- Cookie, LocalStorage 和 IndexDB 无法读取
- DOM 和 JS 对象无法获得
- AJAX 请求无法发送

### 简单请求和非简单请求

简单请求：满足以下两大条件

- 方法是以下 3 中之一
  - HEAD
  - GET
  - POST
- 头信息不超过以下几个字段
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-type

凡是不满足以上两个条件的，就属于非简单请求，非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为“预检”请求
浏览器先询问服务器，服务器收到预检请求后，检查 Origin、Access-Control-Request-Methods 和 Access-Control-Request-Headers 字段以后，确认允许跨源请求，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错

### 解决方案

- JOSNP: 利用 script 标签不受跨域限制的特点，缺点是只支持 get 请求，只能接收 JSON 格式的数据，无法处理其它格式的数据
- CORS: 设置 Access-Control-Allow-Origin: \*
  - 即跨域资源共享，它允许浏览器向非同源服务器，发送 AJAX 请求，这种方式的跨域主要是在后端进行设置
  - 整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与
- postMessage
  - postmessage 是一种 html5 新增的跨文档通信方式，它可以在两个不同的窗口之间进行安全跨域通信。
  - 原理：在一个窗口中发送消息，另一个窗口监听消息并处理
- nginx 反向代理跨域
  - 实现原理：通过 nginx 配置一个代理服务器(同域不同端口)做中间件，反向代理要跨域的域名
- node 中间件
  - 原理：同源策略是浏览器要遵循的标准，而如果是服务器向服务器请求就没有跨域这么一说（原理大致和 nginx 相同，都是通过启一个代理服务器，实现数据的转发）
- websocket
  - websocket 是一种基于 TCP 协议的双向通信协议，它提供了一种浏览器和服务器之间实时、低延迟、高效率的全双工通信方式，同时允许跨域通讯
  - 浏览器在发送 websocket 请求时，会在请求头中携带 Origin 字段，用于告诉服务器该请求的来源。服务器在收到请求后，会根据 Origin 字段判断是否允许该请求跨域，如果允许，则在响应头中添加 CROS 头

#### JSONP 实现

```js
function getInfo(data) {
  console.log(data); // jsonp 跨域成功
}

let script = document.createElement("script");
script.src = "https://example.com/api?callback=getInfo";
document.body.appendChild(script);
```

#### postmessage 实现

```js
// 发送消息
var targetWindow = window.parent;
var message = "hello parent message";
targetWindow.postMessage(message, "*"); // 可以指定域名，这里*表示任意上层parent窗口

// 接收消息
window.addEventListener("message", function(event) {
  var message = event.data;
  console.log("message = " + message);
});
```

#### nginx 反向代理

```nginx
server {
    listen 80;
    server_name www.doman1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  # 反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; # 修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  # 当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

```js
// 前端代码
var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问nginx中的代理服务器
xhr.open("get", "http://www.domain1.com:81/?user=admin", true);
xhr.send();
```

```js
// 后端代码
var http = require("http");
var server = http.createServer();
var qs = require("querystring");
server.on("request", function(req, res) {
  var params = qs.parse(req.url.substring(2));
  // 向前台写cookie
  res.writeHead(200, {
    "Set-Cookie": "l=123456;Path=/;Domain=www.domain2.com;HttpOnly" // HttpOnly:脚本无法读取
  });
  res.write(JSON.stringify(params));
  res.end();
});
server.listen(8080);
```

#### node 中间件实现

```js
// nodeMiddleServer
const express = require("express");
const { createproxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.static(__dirname));
// 使用代理
app.use(
  "/api",
  createproxyMiddleware({
    target: "http:localhost:8002",
    pathRewrite: {
      "^/api": ""
    },
    changeOrigin: true
  })
);

app.listen(8001);
```

```js
// nodeServer.js
const express = require("express");
const app = express();

app.get("/request", (req, res) => {
  res.end("request success");
});

app.listen(8002);
```

## for...in 和 for...of 和 foreach 区别

for...in 遍历对象属性，顺序不确定，取决于 js 引擎实现（无法直接遍历数组），遍历的是对象的属性名(键)，（使用该循环时，需要使用 hasOwnProperty 方法过滤原型链上的属性，以确保只遍历对象本身的属性）
for...of 遍历可迭代对象(数组，字符串，Map，Set)元素时，按照元素在数组中的顺序进行遍历，遍历的是元素值
foreach 只能用于遍历数组，不能用于遍历对象，遍历的是元素值

## Performance 指标

## window.onload 和 DOMContentLoaded 区别

DOMContentLoaded 是在 HTML 文档被完全加载和解析之后才会触发的事件，并不需要等到(样式表，图像，子框架)加载完成之后再进行
load 事件，用于检测一个加载完全的页面，当一个资源及其依赖的资源已完成加载时，将会触发 load 事件

### DOMContentLoaded

## async 和 defer

async 和 defer 属性只对外部脚本起作用，如果没有 src 属性它们会被忽略

async： 指外部 js 文件和当前 html 页面同时加载（异步加载），在当前 js 文件加载完成后，执行 js 代码
defer： 指外部 js 文件和当前 html 页面同时加载（异步加载），但只在当前页面解析完成之后执行 js 代码

异步加载：指同时加载，即某个 js 文件加载的同时，其余文件也可以加载
同步加载：指某个 js 文件加载的同时，其余文件不能加载

defer 比 async 要先引入，他的执行在解析完全完成之后才能开始，它处在 DOMContentLoaded 事件之前。它保证脚本会按照它在 html 中出现的顺序执行，并且不会阻塞解析
async 脚本在他们完成下载后的第一时间执行，它处在 weidow 的 load 事件之前，这意味着可能设置了 async 的脚本不会按照它在 html 中出现的舒徐执行

## apply、call 和 bind

apply 和 call 都是为了改变某个函数运行时的上下文(context)而存在的，也就是为了改变函数体内部 this 的指向
两者作用是一致的，区别是两者传参的方式不一样，例如

bind 方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，传入 bind 方法的第二个及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数

总结

- apply、call 和 bind 都是用来改变函数的 this 指向的
- apply、call 和 bind 三者的第一个参数都是 this 要指向的调用对象，也就是指定的上下文
- apply、call 和 bind 三者都可以传参
- apply、call 是立即调用，bind 则是返回对应函数，便于后续调用

```js
var func = function(par1, par2) {};
func.call(this, par1, par2);
func.apply(this, [par1, par2]);
```

### 实现 apply

```js
Function.prototype.MyCall = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  let result;
  if (arr) {
    result = context.fn(...arr);
  } else {
    result = context.fn();
  }

  delete context.fn;
  return result;
};
```

### 实现 call

- 将函数设为对象的属性
- 执行&删除这个函数
- 指定 this 到函数并传入给定参数执行函数

```js
Function.prototype.MyCall = function(context) {
  context = context || window;
  context.fn = this;
  let args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  context.fn(...args);
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
```

### 实现 bind

- 返回一个函数，绑定 this，传递预置参数
- bind 返回的函数可以作为构造函数使用，作为构造函数时应使得 this 失效，但是传入的参数依然有效

```js
Function.prototype.MyBind = function(context) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }

  var args = Array.prototype.slice.call(arguments, 1);
  var fToBind = this;
  var fNop = function() {};
  var fBound = function() {
    // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
    return fToBind.apply(
      this instanceof fNop ? this : context,
      args.concat(Array.prototype.slice.call(arguments))
    );
  };
  // 维护原型关系
  if (this.prototype) {
    fNop.prototype = this.prototype;
  }
  fBound.prototype = new fNop();
  return fBound;
};
```

## 类型判断

- typeof 只能识别基础类型和引用类型 (注意 null, NaN, document.all 的判断)
- constructor 指向创建该实例对象的构造函数 (注意 null 和 undefined 没有 constructor，以及 constructor 可以被改写，不太可靠)
- instanceof
- Object.prototype.toString.call ("[object Number]", "[object Undefined]" 等等类型)
- isArray

### 实现 instanceof

```js
function myInstanceOf(L, R) {
  var LeftValue = L.__proto__;
  var RightValue = R.prototype;

  while (true) {
    if (LeftValue === null) {
      return false;
    }
    if (LeftValue === RightValue) {
      return true;
    }
    LeftValue = LeftValue.__proto__;
  }
}
```

## new 本质

- 创建一个新对象
- 链接到原型 obj.**prototype** = Con.portotype;
- 绑定到 this
- 返回新对象(如果构造函数有自己的 return，则返回该值)

```js
function myNew(func) {
  return function() {
    let obj = {
      __proto__: func.prototype
    };
    const ret = func.apply(obj, Array.prototype.slice.call(arguments));

    return typeof ret === "object" ? ret : obj;
  };
}
```

## Object.create 实现原理

```js
// 将传入的对象作为原型
function create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
```

## Promise

```js
```

## EventBus

```js
function EventEmitter() {
  this.events = Object.create(null);
}

EventEmitter.defaultMaxListeners = 10;

EventEmitter.prototype.on = function(type, listener, flag) {
  if (!this.events) {
    this.events = Object.create(null);
  }
  if (this.events[type]) {
    if (flag) {
      this.events[type].push(listener);
    } else {
      this.events[type].unshift(listener);
    }
  } else {
    this.events[type] = [listener];
  }
};
EventEmitter.prototype.emit = function(type, ...args) {
  if (this.events[type]) {
    this.events[type].forEach(fn => {
      fn.call(this, ...args);
    });
  }
};
EventEmitter.prototype.once = function(type, listener) {
  let _this = this;
  function only() {
    listener();
    _this.removeListener(type, only);
  }

  only.origin = listener;
  this.on(type, only);
};
EventEmitter.prototype.off = function(type, listener) {
  if (this._enents[type]) {
    this._events[type] = this._events[type].filter(fn => {
      return fn !== listener && fn.origin !== listener;
    });
  }
};
EventEmitter.prototype.removeListener = function(type, listener) {
  this.events = Object.create(null);
};
```

```js
class EventBus {
  constructor() {
    this.event = Object.create(null);
  }

  on(type, listener, flag) {
    if (this.event[type]) {
      if (flag) {
        this.event[type].unshift(listener);
      } else {
        this.event[type].push(listener);
      }
    } else {
      this.event[type] = [listener];
    }
  }

  emit(type, ...args) {
    if (this.event[type]) {
      this.event[type].forEach(fn => {
        fn.call(this, ...args);
      });
    }
  }
  once(type, listener) {
    const warpper = (...args) => {
      listener.call(this, ...args);
      this.off(type, warpper);
    };
    this.on(type, warpper);
  }
  off(type, listener) {
    if (this.event[type]) {
      // delete this.event[type]
      this.event[type] = this.event[type].filter(fn => {
        return fn !== listener;
      });
    }
  }

  removeAllListener() {
    this.event = Object.create(null);
  }
}
```
