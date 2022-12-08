// socket.io 框架
// 引入 http 模块的 createServer 方法
const { createServer } = require('http')

// 引入 socket.io 的 Server 模块
const { Server } = require('socket.io')

// 实例化 httpServer
const httpServer = createServer();

var postions = {};

// 初始化 socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// 使用 socket.io 来建立连接
io.on('connection', socket => {
  socket.on('sendMsg', data => {
    io.emit('pushMsg', data)
    console.log(data);
  })
})

// 创建服务器，进行监听
httpServer.listen(8080, function() {
  console.log('http://localhost:8080');
})