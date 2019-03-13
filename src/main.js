import http from 'http'
import Config from './config'
import routers from './routers'

const port = Config.PORT
console.log(`The config is ==> ${JSON.stringify(Config, null, 2)}`)

http.createServer((req, res) => {
    if (req.method == 'GET') {
        return res.end('请使用POST请求')
    }

    let routerPath = req.url.substr(1)
    console.log(`path is ==> ${routerPath}`)
    let router = routers[routerPath]
    if (router) {
        // handle router
        router(req, res)
    } else {
        res.writeHead(404)
        return res.end()
    }
}).listen(port)

console.log(`The server is running on port : ${port}`)