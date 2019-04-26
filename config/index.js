const os = require('os')

const ENV = process.env.NODE_ENV || 'dev'

function getPort() {
  return {
    dev: 9093,
    development: 12611,
    aliyunqa: 12611,
    aliyunqa1: 12611,
    aliyunqa2: 12611,
    aliyunqa3: 12611,
    pre: 12611,
    production: 12611
  }[ENV]
}

const localIp = () => {
  const ip = []
  const allNwIntf = os.networkInterfaces()
  Object.keys(allNwIntf).map((intf) => {
    allNwIntf[intf].map((it) => {
      if (it.family === 'IPv4' && !it.internal) {
        ip.push(it.address)
      }
    })
  })
  return ip
}

function getHost() {
  return {
    dev: `${localIp()[0]}`,
    development: '0.0.0.0',
    aliyunqa: '0.0.0.0',
    aliyunqa1: '0.0.0.0',
    aliyunqa2: '0.0.0.0',
    aliyunqa3: '0.0.0.0',
    pre: '0.0.0.0',
    production: '0.0.0.0'
  }[ENV]
}

module.exports = {
  port: getPort(),
  host: getHost()
}
