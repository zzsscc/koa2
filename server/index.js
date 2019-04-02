require('@babel/register')
import http from 'http'
import https from 'https'
import app from './services/koa.js'

http.createServer(app.callback()).listen(3000)
https.createServer(app.callback()).listen(3001)
