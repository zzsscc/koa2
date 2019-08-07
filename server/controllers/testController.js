module.exports = {
  async test(ctx, next) {
    ctx.body = {
      status: 1,
      code: 0,
      msg: 'success',
      data: {
        id: 1
      }
    }
  }
}
