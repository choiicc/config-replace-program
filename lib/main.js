'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routers = require('./routers');

var _routers2 = _interopRequireDefault(_routers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = _config2.default.PORT;
console.log('The config is ==> ' + JSON.stringify(_config2.default, null, 2));

_http2.default.createServer(function (req, res) {
    if (req.method == 'GET') {
        return res.end('请使用POST请求');
    }

    var routerPath = req.url.substr(1);
    console.log('path is ==> ' + routerPath);
    var router = _routers2.default[routerPath];
    if (router) {
        // handle router
        router(req, res);
    } else {
        res.writeHead(404);
        return res.end();
    }
}).listen(port);

console.log('The server is running on port : ' + port);