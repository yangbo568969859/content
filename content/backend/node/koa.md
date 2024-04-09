# Koa

Koa 是 NodeJS 的一个中间件框架。Koa 使用自己的上下文（ctx）替换或提取 Node 的 req 和 res 对象属性

Koa 利用生成器函数和 async/await 实现更清晰的代码。虽然这有助于避免在 Express 中常见的“回调地狱”问题

## 使用场景

- 应用程序不是基于浏览器且不需要路由和模板支持时，请使用 Koa
- 强调性能(更轻量级)，使用Koa

## Koa 基本路由

```js
const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

const asyncActivity = () => {
  return {
    success: true
  };
};

app.use(async function handleError(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = error;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

router.get("/", async (ctx, next) => {
  const result = await asyncActivity();
  ctx.body = result;
});

app.listen(3001, () => console.log("Example app listening on port 3001!"));
```

## 中间件

Koa 的中间件则基于 Promise 的

## 源码分析

- listen http的语法糖，实际上还是用了http.createServer()，然后监听了一个端口
- ctx 利用 上下文(context) 机制，将原来的req,res对象合二为一，并进行了大量拓展,使开发者可以方便的使用更多属性和方法，大大减少了处理字符串、提取信息的时间
- use koa的核心 —— 中间件（middleware）。解决了异步编程中回调地狱的问题，基于Promise，利用 洋葱模型 思想，使嵌套的、纠缠不清的代码变得清晰、明确，并且可拓展，可定制，借助许多第三方中间件，可以使精简的koa更加全能（例如koa-router，实现了路由）。其原理主要是一个极其精妙的 compose 函数。在使用时，用 next() 方法，从上一个中间件跳到下一个中间件
