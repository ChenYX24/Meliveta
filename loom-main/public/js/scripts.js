let bg=document.getElementById("bg");
let moon=document.getElementById("moon");
let mountain=document.getElementById("mountain");
let road=document.getElementById("road");
let text=document.getElementById("text");

window.addEventListener('scroll',function(){
  var value = window.scrollY;
  bg.style.top = value*0.5+'px';
  moon.style.left = -value*0.5+'px';
  mountain.style.top = -value*0.15+'px';
  road.style.top = value*0.15+'px';
  text.style.top = value+'px';
})

$(".btn-action").on("click",function(){
  var roomid1 = $(".input_room").val();
  if(roomid1!=" ")
  {
  $.post("/rooms/new", { roomid: roomid1 } );
  window.location.href="/"+roomid1;
  }
})
