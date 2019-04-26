import Koa from 'koa'
import logger from "../utils/logger"
import koaError from "./middlewares/koaError"
import { handlerError, CustomError } from "./middlewares/handlerError"

const app = new Koa()
// middleware的顺序很重要，也就是调用app.use()的顺序决定了middleware的顺序

// 外层使用负责所有错误处理的中间件
app.use(handlerError)
// 添加app error 事件的监听
koaError(app)

// app.context 是从其创建 ctx 的原型。
// 您可以通过编辑 app.context 为 ctx 添加其他属性。
// 这对于将 ctx 添加到整个应用程序中使用的属性或方法非常有用，这可能会更加有效（不需要中间件）和/或 更简单（更少的 require()），而更多地依赖于ctx，这可以被认为是一种反模式.
app.context.extend = (ctx) => {
  logger.info(ctx.state.global)
}
app.context.extendState = 'extendState'

// 将给定的中间件方法添加到此应用程序
app.use(async (ctx, next) => {
  const { request, response } = ctx // 此处，req等同于request，res等同于response
  // logger.info(request.query) // 获取get请求参数
  logger.info(ctx.query) // 也可以使用cxt简写，ctx.query == ctx.request.query 获取get请求参数

  // Koa2中可以通过ctx.state配置全局变量。ctx.state配置的全局变量我们不仅可以在其他的路由页面使用，我们还可以在全局模板使用.
  ctx.state.global = { vm: 'koa' }

  logger.info(ctx.extendState) // 可以在这里直接获取app.context添加的扩展属性和方法
  ctx.extend(ctx) // 调用app.context添加的扩展方法

  await next() // 调用next函数，把执行权转交给下一个中间件

  ctx.body = 'Hello World' // ctx.body == ctx.response.query
})

app.use(async (ctx, next) => {
  const { vm } = ctx.state.global
  logger.info(vm) // 使用全局共享的命名空间变量

  // 中间件内错误捕获，但是这样比较繁琐
  // try {
    // throw new CustomError('new Error', { status: 501 })
  // } catch (err) {
  //   // Koa 提供了ctx.throw()方法，用来抛出错误
  //   ctx.throw(500)
  //   // 等同于将ctx.response.status设置成500
  //   // ctx.response.status = 500;
  //   // ctx.response.body = 'Internal Server Error';
  // }
  // 一般使用handlerError统一处理错误，只需在中间件中try...catch处理错误即可
  try {
    b = b
  } catch (err) {
    throw new CustomError(err, { status: 502 })
  }
})

export default app
