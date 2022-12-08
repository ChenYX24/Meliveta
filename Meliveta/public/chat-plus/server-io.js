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
    io.emit('pushMsg', data) //发给所有的客户端，放到聊天框中
    console.log(data);
  })
  socket.on('newPosition',data=>{
    socket.broadcast.emit('newPosition',data) //发给所有客户端
    console.log(data);
  })
  socket.on('sendPosition',data=>{
    socket.broadcast.emit('sendPosition',data) //发给所有客户端
  })
  socket.on('disconnect',function(){
    io.emit('disconnected',socket.id)
    console.log("disconnect")
  })
//发送id（作为数组的下标），位置（实时更新，获取键盘事件，触发更新），图片名字（直接在本地新建精灵图）->打包在一个value里
//具体实现，把数组里面的每个图片都放到container中
//刚进入页面时：发送自己的信息
//位置移动：如果id已存在，直接改变坐标。不存在则新建数组[id]
//退出、关闭页面时：广播信息，数组里去除这个元素（undefined），从container中移除
})

// 创建服务器，进行监听
httpServer.listen(8080, function() {
  console.log('http://localhost:8080');
})