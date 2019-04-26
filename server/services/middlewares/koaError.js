import logger from "../../utils/logger"

// app error 事件的监听
export default (app) => {
  app.on('error', (err, ctx) => {
    logger.error(`
      server error: ${err}
      ctx: ${ctx, JSON.stringify(ctx)}
    `)
  })
}
