
let Link = require("./Link");
let Mate = require("./MateManager");
let ws = require("nodejs-websocket");
var connect = require("connect");
var serveStatic = require("serve-static");

let server = ws.createServer(function(conn){
    let link = new Link(conn);
    Mate.getInstance().into_link(link);
}).listen(8001)
server.on('error', function(err) {});
console.log("涂鸦聊天服务器启动完成.");

var app = connect();
app.use(serveStatic("./web-mobile/"),{
	maxAge: '30d' 
});
app.listen(10010);
console.log("静态资源服务器启动完成.");