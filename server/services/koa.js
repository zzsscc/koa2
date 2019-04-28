import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import path from 'path'
import logger from '../utils/logger'
import koaError from './helpers/koaError'
import { handlerError, CustomError } from './middlewares/handlerError'

const app = new Koa()
// middleware的顺序很重要，也就是调用app.use()的顺序决定了middleware的顺序

// 外层使用负责所有错误处理的中间件
app.use(handlerError)
// 添加app error 事件的监听
koaError(app)

// 使用koa-body处理post请求和文件上传 (http://www.ptbird.cn/koa-body.html)
/**
 * @success 获取上传后文件的信息：ctx.request.files
 * @success 获取post请求参数：ctx.request.body
*/ 
// koa-bodyparser 也可以处理post请求，如果是图片上传则需要使用的是 koa-multer
// 这两者的组合没什么问题，不过 koa-multer 和 koa-route（注意不是 koa-router） 存在不兼容的问题。
// ！！！但是我们可以不用koa-route，它也两年多没更新了，使用koa-router也就没有兼容问题了
// app.use(koaBody({
//   multipart: true, // 支持文件上传
//   encoding: 'gzip',
//   formidable: {
//     uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
//     keepExtensions: true,    // 保持文件的后缀
//     maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
//     onFileBegin: (name,file) => { // 文件上传前的设置
//       // console.log(`name: ${name}`);
//       // console.log(file);
//     }
//   }
// }))

// 我们愉快的使用koa-bodyparser处理post请求
app.use(bodyParser())

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
  // logger.info(request.body) // 获取post请求参数
  logger.info(ctx.query) // 获取get请求参数。也可以使用cxt简写，ctx.query == ctx.request.query
  logger.info(ctx.request.body) // 获取post请求参数。不可以使用cxt简写，与koa的ctx.body冲突了

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

  /**
   * @description koa提供了ctx.cookies.set方法设置cookie
   * @function ctx.cookies.set(name, value, [options])
   * @operationId options
   * @param {maxAge} 一个数字表示从 Date.now() 得到的毫秒数
   * @param {signed} cookie 签名值
   * @param {expires} cookie 过期的 Date
   * @param {path} cookie 路径, 默认是'/'
   * @param {domain} cookie 域名
   * @param {secure} 安全 cookie
   * @param {httpOnly} 服务器可访问 cookie, 默认是 true
   * @param {overwrite} 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie                       时从 Set-Cookie 标头中过滤掉。
   */
  ctx.cookies.set('cookie', 1)

  await next()

  // 中间件内错误捕获，但是这样比较繁琐
  // try {
    // throw new CustomError('new Error', { status: 501 })
  // } catch (err) {
  //   // Koa 提供了ctx.throw()方法，用来抛出错误
  //   // ctx.throw([status], [msg], [properties]) => ctx.throw(400, 'name required', { user: user });
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

app.use(async (ctx, next) => {
  /**
   * @description koa提供了ctx.cookies.get方法获取cookie
   * @function ctx.cookies.get(name, [options])
   * @operationId options
   * @param {signed} 所请求的cookie应该被签名
   */
  const cookie = ctx.cookies.get('cookie')
  logger.info(`cookie: ${cookie}`)
})

export default app
