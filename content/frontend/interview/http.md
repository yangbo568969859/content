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
- 301 Move Permanently; 请求的资源已永久移动到新位置
- 403 Forbidden; 禁止访问
- 404 Not Found; 服务器无法找到请求的资源
- 500 Internal Server Error; 服务器内部错误
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
