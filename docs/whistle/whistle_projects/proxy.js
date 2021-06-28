var http = require('http');
var net = require('net');
var url = require('url');

function request(clientReq, clientRes) {
    // 解析客户端的url请求
    console.log(clientReq);
    var u = url.parse(clientReq.url);
    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method     : clientReq.method,
        headers     : clientReq.headers
    };

    // 代理服务器重新自己发送客户端要发送的请求
    var proxyReq = http.request(options, function(proxyRes) {
        // 代理通过回调函数在拿到服务器的响应后重写客户端响应
        clientRes.setHeader('Set-Cookie', ['type=proxy']);
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes);
    }).on('error', function(e) {
        clientRes.end();
    });
    clientReq.pipe(proxyReq);
}

//启动一个服务器开启request监听事件
http.createServer().on('request', request).listen(8899, '0.0.0.0');