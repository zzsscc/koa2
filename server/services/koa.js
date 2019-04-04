import Koa from 'koa'

const app = new Koa()
import logger from "../utils/logger"

// 将给定的中间件方法添加到此应用程序
app.use(async ctx => {
  const { request } = ctx
  logger.info(request.query) // 获取get请求参数
  ctx.body = 'Hello World'
})

app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
})

export default app
