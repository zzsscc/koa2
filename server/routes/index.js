import glob from 'glob'
import Router from 'koa-router'

const router = new Router();

exports = module.exports = function initModules(app) {
  glob(`${__dirname}/*`, { ignore: '**/index.js' }, (err, matches) => {
    if (err) { throw err }
    matches.forEach((mod) => {
      const routes = require(`${mod}`)
      
      routes.forEach((config) => {
        const {
          method = '',
          route = '',
          handlers = []
        } = config;

        const type = Object.prototype.toString.call(handlers);
        switch (type) {
          case '[object Array]':
            handleArray(method.toLowerCase(), route, handlers);
            break;
          case '[object Object]':
            handleObject(method.toLowerCase(), route, handlers);
            break;
          case '[object Function]':
            router[method.toLowerCase()](route, handlers);
            break;
          default:
            throw new Error(`handlers应该是Object|Array|Function，但是却得到一个${type}`);
        }
      })
    });
    app.use(router.routes()).use(router.allowedMethods());

    function handleArray(method, route, handlers) {
      if (route === '/*') {
        const lastHandler = handlers.pop();
        router[method](route, (req, res, next) => lastHandler(req, res, next))
      } else {
        router[method](route, ...handlers)
      }
    }

    function handleObject(method, route, handlers) {
      router[method.toLowerCase()](route, versionProxy(method, route, handlers));
      // final handler
    }

    function versionProxy(method, route, handlers) {
      const cache = new Map();
      const versions = Object.keys(handlers).map(verStr => {
        const verNum = +verStr.replace(/^v/, '');
        if (verNum > 0) {
          return verNum;
        } else {
          throw new Error(`[${route}]版本格式错误，希望得到 v[number]，但是得到:${verStr}`)
        }
      }).sort((a, b) => a - b);
      versions.forEach(version => {
        const router = express.Router();
        const handler = handlers[`v${version}`];
        if (Array.isArray(handler)) {
          router[method](route, ...handler);
        } else {
          router[method](route, handler);
        }
        cache.set(version, router);
      });
      return function (req, res, next) {
        const version = +(req.params.version || '').replace(/^v/, '') || 0;
        const usableVersions = versions.filter(ver => ver <= version);
        const usableVersion = usableVersions.pop();
        if (usableVersion) {
          const router = cache.get(usableVersion);
          router(req, res, next);
        } else {
          res.send({
            status: 200,
            data: { message: '您当前使用的APP版本过老，请升级APP版本' },
            code: 0
          });
        }
      }
    }
  })
}
