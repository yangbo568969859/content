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

### GET 和 POST 有什么区别

