require('@babel/register')
import http, { Server } from 'http'
import app from './services/koa'
import config from '../config'
import logger from "./utils/logger"

// 返回适用于 http.createServer() 方法的回调函数来处理请求。你也可以使用此回调函数将 koa 应用程序挂载到 Connect/Express 应用程序中。
const server = new Server(app.callback())
// const server = http.createServer(app.callback()) 也可以选择这种方式，等同于上面的new Server

const { port, host } = config
server.listen(port, (err) => {
  if (err) {
    logger.error(err.stack || err)
    process.exit(0)
  }
  logger.info(`
    [koaServer] server is running
    - Local: http://localhost:${port}
    - NetWork: http://${host}:${port}
  `)
})

process.on('uncaughtException', (e) => {
  logger.error(`[koaServer] uncaughtException: ${e}`)
})

module.exports = server;