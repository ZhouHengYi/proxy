'use strict'
let http = require('http')
let httpProxy = require('http-proxy')
let proxy = httpProxy.createProxyServer({})
let config = require('./config.json')
let LOCALHOST = 'http://127.0.0.1'
proxy.on('error', function(err, req, res) {
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.end('Something went wrong.')
})
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('X-Parse-Application-Id', 'myAppId');
});
let server = http.createServer(function(req, res) {
    let host = req.headers.host
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log('client ip: ' + ip + ', host: ' + host + ',url :' + req.url)

    for (var i = config.length - 1; i >= 0; i--) {
        if(config[i].url == req.url){
            console.log('target:' + config[i].target)
            proxy.web(req, res, {target: config[i].target})
        }
    }
})
console.log('listening on proxy-port 3080')
server.listen(80)