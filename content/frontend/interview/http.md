# HTTP

## http状态吗

状态码分为5类

1. 1xx (信息类状态码) 表示接收的请求正在处理
2. 2xx (成功状态码) 表示请求正常处理完成
3. 3xx (重定向状态码) 需要进行额外的操作以完成请求
4. 4xx (客户端错误状态码) 表示客户端错误
5. 5xx (服务端错误状态码) 表示服务端错误

常见状态码详解

- 200 OK; 请求成功，最常见的成功状态码
- 204 No Content; 含义和200相同，但响应后没有body数据
- 206 Partical Content; 表示部分内容
- 301 Move Permanently; 请求的资源已永久移动到新位置(永久重定向)
- 302 临时重定向
- 304 Not Modified; 当协商缓存命中时会返回这个状态码
- 400 Bad Request
- 403 Forbidden; 禁止访问
- 404 Not Found; 服务器无法找到请求的资源
- 405 Method Not Allow
- 500 Internal Server Error; 服务器内部错误
- 501 Not Implemented; 表示客户端请求的功能还不支持
- 502 Bad GateWay 服务器自身是正常的，但访问的时候出错了
- 503 Service Unavailable;服务不可用

## HTTP请求和响应

### HTTP请求有哪些

- GET 通常用来获取资源
- POST 提交数据
- PUT 修改数据
- DELETE 删除数据
- OPTION 列出可对资源实行的请求方法，用来跨域请求
- HEAD 获取资源的元信息
- CONNECT 建立连接隧道，用来代理服务器
- TRACE 追踪请求-响应的传输路径

### GET 和 POST 有什么区别

- 缓存 get请求会被浏览器主动缓存下来，留下历史记录
- 编码 get请求只能进行URL编码，只能接收ASCII编码， post没有限制
- 参数 get请求参数一般放在URL中，因此不安全，post放在请求体中
- TCP  get请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)

### URI( Uniform Resource Identifier) 统一资源标识符

结构

```js
shceme :// user:passwd@ host:port path ?query #fragment

// scheme 表示协议名，比如http，https，file等等。后面必须和:// 连在一起
// user:passwa@ 表示登录主机时的用户信息，不过很不安全，不推荐使用
// host:port 主机名和端口
// path 请求路径，标记资源所在位置
// query 查询参数
// fragemnt 表示URI所定位的资源内的一个锚点，浏览器可以根据这个锚点跳转到对应位置
```

### HTTP 和 HTTPS

#### HTTP特点

- 灵活可扩展 主要体现在两个方面。一个是语义上的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便
- 可靠传输 TTP 基于 TCP/IP
- 请求-应答 也就是一发一收、有来有回， 当然这个请求方和应答方不单单指客户端和服务器之间，如果某台服务器作为代理来连接后端的服务端，那么这台服务器也会扮演请求方的角色
- 无状态 这里的状态是指通信过程的上下文信息，而每次 http 请求都是独立、无关的，默认不需要保留状态信息

#### HTTP缺点

- 无状态
- 明文传输
- 队头阻塞

