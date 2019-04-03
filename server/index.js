require('@babel/register')
import http, { Server } from 'http'
import app from './services/koa'
import config from '../config'
import logger from "./utils/logger";

// const server = http.createServer(app.callback());
const server = new Server(app.callback());

const { port, host } = config
server.listen(port, (err) => {
  if (err) {
    logger.error(err.stack || err);
    process.exit(0);
  }
  logger.info(`
    [koaServer] server is running
    - Local: http://localhost:${port}
    - NetWork: http://${host}:${port}
  `)
});

process.on('uncaughtException', (e) => {
  logger.error('[koaServer] uncaughtException', e)
});

module.exports = server;