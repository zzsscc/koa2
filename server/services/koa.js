import Koa from 'koa'
import logger from "../utils/logger"

const app = new Koa()
// middleware的顺序很重要，也就是调用app.use()的顺序决定了middleware的顺序

// 将给定的中间件方法添加到此应用程序
app.use(async (ctx, next) => {
  const { request, response } = ctx
  // logger.info(request.query) // 获取get请求参数
  logger.info(ctx.query) // 也可以使用cxt简写，ctx.query == ctx.request.query 获取get请求参数
  ctx.body = 'Hello World' // ctx.body == ctx.response.query
})

app.on('error', (err, ctx) => {
  logger.error(`
    server error: ${err}
    ctx: ${ctx}
  `)
})

export default app
