let bg=document.getElementById("bg");
let moon=document.getElementById("moon");
let mountain=document.getElementById("mountain");
let road=document.getElementById("road");
let text=document.getElementById("text");
let npc="bagboy";

window.addEventListener('scroll',function(){
  var value = window.scrollY;
  bg.style.top = value*0.5+'px';
  moon.style.left = -value*0.5+'px';
  mountain.style.top = -value*0.15+'px';
  road.style.top = value*0.15+'px';
  text.style.top = value+'px';
})

$(".btn-action").on("click",function(){
  var username = $(".input_room").val();
  if(username!="")
  {
  localStorage.setItem("username", username);
  // $.post("/rooms/new", { roomid: roomid1 } );
  // window.location.href="/"+roomid1;
  window.location.href="lobby.html?id=1&nameL="+npc+"L.png&nameR="+npc+"R.png";
  }
  else{
    alert("请输入用户名!");
  }

})

$(".radio_father1").click(function(){
  $(this).children("h2").css("color","rgb(192, 54, 139)");
  $(this).siblings().children("h2").css("color","white");
  npc=$(this).children("input").val();

})
