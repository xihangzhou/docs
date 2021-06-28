var https = require('https');
var fs = require('fs');
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
    var proxyReq = https.request(options, function(proxyRes) {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes);
    }).on('error', function(e) {
        clientRes.end();
    });
    clientReq.pipe(proxyReq);
}

var options = {
    key: fs.readFileSync('./private.pem'),
    cert: fs.readFileSync('./public.crt')
};

console.log(options);

//启动一个服务器开启request监听事件
https.createServer(options).on('request', request).listen(8899, '0.0.0.0');