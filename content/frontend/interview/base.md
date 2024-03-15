# 基础八股文

## 缓存策略

浏览器在加载资源时，会先根据这个资源的header判断它是否命中缓存，强缓存如果命中，浏览器直接在自己的缓存中读取资源，不会发请求到服务器
当强缓存没有命中的时候，浏览器一定会发送一个请求到服务器，通过服务器端依据资源的另外一些header字段验证是否命中协商缓存，如果协商缓存命中，服务器会将这个请求返回，但是不会返回这个请求的资源数据，而是告诉客户端可以直接从缓存中加载这个资源
强缓存和协商缓存的共同点是：如果命中，都是从客户端缓存中加载资源，而不是从服务器加载资源数据；区别是：强缓存不发请求到服务器，协商缓存会发请求到服务器
当协商缓存也没命中时，浏览器直接从服务器拉取资源

### 强缓存

当浏览器对某个资源的请求命中了强缓存时，返回的HTTP状态码为200，在谷歌浏览器的开发者工具的network里面size会显示disk cache或memory cache

- Cache-Control 的max-age的优先级高于Expires，以秒为单位，是一个相对时间
  - 第一次请求某个资源，服务器返回这个资源同时，在response的header加上了Cache-control的header，浏览器接收到这个资源后，会把这个资源连同header缓存下
  - 浏览器再次请求这个资源，先从缓存中寻找，找到这个资源后，根据它第一次的请求时间和Cache-control设定的有效期，计算出一个资源过期时间，再拿这个过期时间和当前请求时间比较，如果请求时间再过期时间之前，就命中缓存
- Expires 是http1.0提出的一个表示资源过期时间的header，值是一个绝对时间，由服务器返回
  - 缺点：由于它是服务器返回的一个绝对时间，在服务器时间和客户端时间相差较大时，缓存会出问题，还有就是客户端可以随意更改时间

### 协商缓存

- Last-Modified Last-Modified(服务端响应携带) & If-Modified-Since (客户端请求携带) ，其优先级低于Etag
  - 浏览器第一次跟服务器请求一个资源，服务器返回资源的同时，会在response的header加上Last-Modified，表示资源在服务器上的最后修改时间
  - 浏览器再次请求这个资源，在request header上加上 If-Modified-Since的header，这个header就是上一次请求时返回的Last-Modified
  - 服务器再次受到请求，根据浏览器传过来的If-Modified-Since和资源在服务器上的最后修改时间判断资源是否有变化，如果没有变化则返回304 Not Modified
  - 缺点：有时候服务器上资源有变化，但是最后修改时间却没有变化，就会影响缓存安全性
- ETag Etag(服务端响应携带) & If-None-Match(客户端请求携带)
  - 这个唯一标识是一个字符串，只要资源有变化这个串就不同

服务端判断值是否一致，如果一致，则直接返回304通知浏览器使用本地缓存，如果不一致则返回新的资源

![image](./images/brower-cache.png)

## for...in 和 for...of 和 foreach 区别

for...in 遍历对象属性，顺序不确定，取决于js引擎实现（无法直接遍历数组），遍历的是对象的属性名(键)，（使用该循环时，需要使用hasOwnProperty方法过滤原型链上的属性，以确保只遍历对象本身的属性）
for...of 遍历可迭代对象(数组，字符串，Map，Set)元素时，按照元素在数组中的顺序进行遍历，遍历的是元素值
foreach 只能用于遍历数组，不能用于遍历对象，遍历的是元素值

## Performance指标

## window.onload 和 DOMContentLoaded 区别

DOMContentLoaded 是在HTML文档被完全加载和解析之后才会触发的事件，并不需要等到(样式表，图像，子框架)加载完成之后再进行
load事件，用于检测一个加载完全的页面，当一个资源及其依赖的资源已完成加载时，将会触发load事件

### DOMContentLoaded

## async 和 defer

async 和 defer 属性只对外部脚本起作用，如果没有 src 属性它们会被忽略

async： 指外部js文件和当前html页面同时加载（异步加载），在当前js文件加载完成后，执行js代码
defer： 指外部js文件和当前html页面同时加载（异步加载），但只在当前页面解析完成之后执行js代码

异步加载：指同时加载，即某个js文件加载的同时，其余文件也可以加载
同步加载：指某个js文件加载的同时，其余文件不能加载

defer比async要先引入，他的执行在解析完全完成之后才能开始，它处在DOMContentLoaded事件之前。它保证脚本会按照它在html中出现的顺序执行，并且不会阻塞解析
async 脚本在他们完成下载后的第一时间执行，它处在weidow的load事件之前，这意味着可能设置了async的脚本不会按照它在html中出现的舒徐执行

## apply、call和bind

apply和call都是为了改变某个函数运行时的上下文(context)而存在的，也就是为了改变函数体内部this的指向
两者作用是一致的，区别是两者传参的方式不一样，例如

bind方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入bind()方法的第一个参数作为this，传入bind方法的第二个及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数

总结

- apply、call和bind 都是用来改变函数的this指向的
- apply、call和bind 三者的第一个参数都是this要指向的调用对象，也就是指定的上下文
- apply、call和bind 三者都可以传参
- apply、call 是立即调用，bind则是返回对应函数，便于后续调用

```js
var func = function (par1, par2) {}
func.call(this, par1, par2)
func.apply(this, [par1, par2])
```

### 实现apply

```js
Function.prototype.MyCall = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  let result;
  if (arr) {
    result = context.fn(...arr)
  } else {
    result = context.fn();
  }

  delete context.fn;
  return result;
}
```

### 实现call

- 将函数设为对象的属性
- 执行&删除这个函数
- 指定this到函数并传入给定参数执行函数

```js
Function.prototype.MyCall = function(context) {
  context = context || window;
  context.fn = this;
  let args = []
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  context.fn(...args);
  let result = context.fn(...args);
  delete context.fn;
  return result;
}
```

### 实现bind

- 返回一个函数，绑定this，传递预置参数
- bind返回的函数可以作为构造函数使用，作为构造函数时应使得this失效，但是传入的参数依然有效

```js
Function.prototype.MyBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
  }

  var args = Array.prototype.slice.call(arguments, 1)
  var fToBind = this;
  var fNop = function () {};
  var fBound = function () {
    // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
    return fToBind.apply(this instanceof fNop ? this : context, args.concat(Array.prototype.slice.call(arguments)))
  }
  // 维护原型关系
  if (this.prototype) {
    fNop.prototype = this.prototype
  }
  fBound.prototype = new fNop();
  return fBound;
}
```

## 类型判断

- typeof 只能识别基础类型和引用类型 (注意 null, NaN, document.all 的判断)
- constructor 指向创建该实例对象的构造函数 (注意 null 和 undefined 没有 constructor，以及 constructor 可以被改写，不太可靠)
- instanceof
- Object.prototype.toString.call ("[object Number]", "[object Undefined]" 等等类型)
- isArray

### 实现instanceof

```js
function myInstanceOf (L, R) {
  var LeftValue = L.__proto__;
  var RightValue = R.prototype;

  while (true) {
    if (LeftValue === null) {
      return false;
    }
    if (LeftValue === RightValue) {
      return true
    }
    LeftValue = LeftValue.__proto__;
  }
}
```

## new本质

- 创建一个新对象
- 链接到原型 obj.__prototype__ = Con.portotype;
- 绑定到this
- 返回新对象(如果构造函数有自己的return，则返回该值)

```js
function myNew (func) {
  return function () {
    let obj = {
      __proto__: func.prototype
    }
    const ret = func.apply(obj, Array.prototype.slice.call(arguments))

    return typeof ret === 'object' ? ret : obj;
  }
}
```

## Object.create 实现原理

```js
// 将传入的对象作为原型
function create (obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
```

## Promise

```js
```
