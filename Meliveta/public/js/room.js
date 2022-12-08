let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});

let displayFrame = document.getElementById('stream_box');
let videoFrames = document.getElementsByClassName('video_container');
let userIdInDisplayFrame=null;

let expandVideoFrame=(e)=>{
  //如果已存在内容，就把他放到下面
  let child =displayFrame.children[0];
  if(child){
    document.getElementById('streams_container').appendChild(child);
  }
  //不再隐藏
  displayFrame.style.display='block';
  //将选中的放在上面
  displayFrame.appendChild(e.currentTarget);
  userIdInDisplayFrame=e.currentTarget.id;

  //让下面的内容变小
  for(let i=0; videoFrames.length>i;i++){
    if(videoFrames[i].id!=userIdInDisplayFrame){
      videoFrames[i].style.height='100px';
      videoFrames[i].style.width='100px';
    }
  }
  
}

//任意窗口被点则扩大聚焦
for(let i=0; videoFrames.length>i;i++){
  videoFrames[i].addEventListener('click',expandVideoFrame);
}

let hideDisplayFrame =()=>{
  userIdInDisplayFrame=null;
  displayFrame.style.display=null;
  let child =displayFrame.children[0];
  document.getElementById('streams_container').appendChild(child);
  for(let i=0; videoFrames.length>i;i++){
    videoFrames[i].style.height='300px';
    videoFrames[i].style.width='300px';
  }
}

displayFrame.addEventListener('click',hideDisplayFrame);