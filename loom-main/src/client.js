// 前端實作程式碼

import Peer from "peerjs"
import { io } from "socket.io-client"

const room_id =document.querySelector("#room_id").dataset.id
const socket = io()
const container=document.querySelector('.video-container')
const users = {}

//websocket
socket.on("USER_LEFT",(user_name)=>{
  if(users[user_name]){
    users[user_name].close()
  }
})
// socket.on("RETURN_USERS",(call1,id1)=>{
//   users[id1]=call1
// })
//peer




const v=document.createElement('video');
// $("v").css({
//   transform: rotateY(180deg);
//   -webkit-transform:rotateY(180deg); /* Safari and Chrome */
//   -moz-transform:rotateY(180deg); /* Firefox */
// })
v.muted=true//去杂音

var id

//device
navigator.mediaDevices.getUserMedia({ audio:true,video:true}).then((stream)=>{
  const p2p =new Peer({host:'/',port:9527})
  p2p.on('open',user_name=>{
    id=user_name
    socket.emit('ENTER_ROOM', room_id , user_name)
  })

  attachStreamToTarget(v,stream)

  socket.on("USER_ENTERED",(user_name)=>{
    sendStreamToUser(user_name,stream,p2p)
  })
  
  p2p.on('call',(call)=>{
    call.answer(stream)
    const v=document.createElement('video')
    v.muted=true
    call.on('stream',(theirStream)=>{
    attachStreamToTarget(v,theirStream)
    })
    call.on("close",()=>{
      v.remove()
    })
    users[call.peer]=call
    console.log(call)
    //socket.emit("R_C",users[id],id)
  })
  
  p2p.on("close",(user_name)=>{
    users[user_name].close()
  })
})


//helper
function attachStreamToTarget(target,stream){
  target.srcObject=stream
  target.addEventListener('loadedmetadata',()=>{
    target.play()
  })
  container.append(target)
}

function sendStreamToUser(user_name,stream,p2p){
  const call = p2p.call(user_name, stream)
  const v=document.createElement('video')
  v.muted=true
  call.on("stream", theirStream=> {
    attachStreamToTarget(v,theirStream)
  })
  call.on("close",()=>{
    v.remove()
  })
  users[user_name]=call
}