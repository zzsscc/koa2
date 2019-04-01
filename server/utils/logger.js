import colors from 'colors';

export default {
  info(msg) {
    console.log(`[Info] ${colors.white(msg)}`)
  },
  success(msg) {
    console.log(`[success] ${colors.green(msg)}`)
  },
  warn(msg) {
    console.log(`[Warn] ${colors.yellow(msg)}`)
  },
  error(msg) {
    console.log(`[Error] ${colors.red(msg)}`)
  }
};