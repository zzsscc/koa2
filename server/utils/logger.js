import colors from 'colors';

export default {
  info(msg) {
    console.log(`[Info]-${Date.now()} ${colors.white(msg)}`)
  },
  success(msg) {
    console.log(`[success]-${Date.now()} ${colors.green(msg)}`)
  },
  warn(msg) {
    console.log(`[Warn]-${Date.now()} ${colors.yellow(msg)}`)
  },
  error(msg) {
    console.log(`[Error]-${Date.now()} ${colors.red(msg)}`)
  }
};