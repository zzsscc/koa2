export class CustomError extends Error {
  constructor(err, params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.message = err.message || 'Internal Server Error'
    this.status = params.status || 500
    // Custom debugging information
    this.date = new Date()
  }
}

export const handlerError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.status;
    ctx.response.body = {
      message: err.message,
      ...err
    }
    // 但仅仅有上面部分不会触发app.on('error')事件，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效
    ctx.app.emit('error', err, ctx)
  }
};