/*
 * @Author: your name
 * @Date: 2022-12-08 15:53:55
 * @LastEditTime: 2022-12-08 23:52:13
 * @LastEditors: LAPTOP-2QR058GS
 * @Description: In User Settings Edit
 * @FilePath: \Meliveta\pixi\public\js\popup.js
 */

    popup = document.querySelector(".popup"),
    close = popup.querySelector(".close"),
    field = popup.querySelector(".field"),
    input = field.querySelector("input"),
    enter = field.querySelector("button");
    let roomId;
    function togglePop(){
      popup.classList.toggle("show");
    }
    function openPop(){
      popup.classList.add("show");
    }

    close.onclick = ()=>{
      togglePop();
    }
    //回车发送
    $("input").on("keydown",function(event){
      var event=event||window.event;
      if(event.keyCode==13){
        enter.onclick();
      }
      if(event.keyCode==8){
        this.value=enter.value.substr(0,this.value.length-1)
      }
      else{
        var temp=String.fromCharCode(event.keyCode)
        $(this).val($(this).val()+temp)
      }
    })


    enter.onclick = ()=>{
      roomId=$(".inputRoom").val();
      if(roomId!="")
      {
        if($(".c").is(':checked')){
          window.location.href="room.html?&roomId="+roomId;
        }else{
          window.location.href="./public/chat-plus/index-io.html?name="+userID+"&nameL="+nameL+"&nameR="+nameR+"&roomId="+roomId;
        }
      }
      else{
        alert("房间号为空！");
        if($(".c").is(':checked')){
          window.location.href="room.html?&roomId="+roomId;
        }else{
          window.location.href="./public/chat-plus/index-io.html?name="+userID+"&nameL="+nameL+"&nameR="+nameR+"&roomId="+roomId;
        }
      }
      
    }