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
