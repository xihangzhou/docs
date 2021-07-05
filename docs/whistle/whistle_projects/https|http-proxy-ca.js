var http = require("http");
var https = require("https");
var fs = require("fs");
var net = require("net");
var url = require("url");

function request(cReq, cRes) {
  console.log('request');
  var u = url.parse(cReq.url);

  var options = {
    hostname: u.hostname,
    port: u.port || 80,
    path: u.path,
    method: cReq.method,
    headers: cReq.headers,
  };

  var pReq = http
    .request(options, function (pRes) {
      cRes.writeHead(pRes.statusCode, pRes.headers);
      pRes.pipe(cRes);
    })
    .on("error", function (e) {
      cRes.end();
    });

  cReq.pipe(pReq);
  // 设置响应头
  cRes.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  // 响应的内容部分
  recRess.end("HTTPS TEST!");
}

function connect(cReq, cSock) {
  console.log('connect');
  var u = url.parse("http://" + cReq.url);

  var pSock = net
    .connect(u.port, u.hostname, function () {
      cSock.write("HTTP/1.1 200 Connection Established\r\n\r\n");
      pSock.pipe(cSock);
    })
    .on("error", function (e) {
      cSock.end();
    });

  cSock.pipe(pSock);
}

var options = {
  key: fs.readFileSync("./private_key.pem"),
  cert: fs.readFileSync("./cacert.pem"),
};

https
  .createServer(options)
  .on("request", request)
  .on("connect", connect)
  .listen(8888, "127.0.0.1");
