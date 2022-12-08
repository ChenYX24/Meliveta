const APP_ID="91ed5671b5224d52915716656792d2f6";

//独立用户名（无则随机）
let uid=sessionStorage.getItem('uid');
if(!uid){
  uid=String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem('uid',uid);
}

let token = null;
let client;

//房间号（无则默认main）
const queryString=window.location.search;
const urlParams=new URLSearchParams(queryString);
let roomId=urlParams.get('roomId');

if(!roomId){
  roomId='main';
}

//存流
let localTracks=[];
let remoteUsers={};

let localScreenTracks;
let sharingScreen=false;

//加入房间
let joinRoomInit= async()=>{
  client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'});
  await client.join(APP_ID, roomId, token, uid);

  //有其他用户进来则执行
  client.on('user-published',handleUserPublished)
  //有人离开则执行
  client.on('user-left',handleUserLeft);
  //加入流
  joinStream();
}

let joinStream=async()=>{
  //存视频音频轨道
  localTracks=await AgoraRTC.createMicrophoneAndCameraTracks({},{encoderConfig:{
    width:{min:640,ideal:1920,max:1920},
    height:{min:480,ideal:1080,max:1080}
  }});
  //动态加入浏览器
  let player = `<div class="video_container" id="user-container-${uid}">
                <div class="video_player" id="user-${uid}"></div>
                </div>`
  document.getElementById('streams_container').insertAdjacentHTML('beforeend',player);
  //点击聚焦
  document.getElementById(`user-container-${uid}`).addEventListener('click',expandVideoFrame);

  //视频播放（无需播放自己的音频）
  localTracks[1].play(`user-${uid}`);
  //上传视频音频轨道
  await client.publish([localTracks[0],localTracks[1]])
}

//切换至相机
let switchToCamera = async () => {
  let player=`<div class="video_container" id="user-container-${uid}">
              <div class="video_player" id="user-${uid}"></div>
              </div>`
  displayFrame.insertAdjacentHTML('beforeend',player);

  await localTracks[0].setMuted(true);
  await localTracks[1].setMuted(true);

  document.getElementById('mic-btn').classList.remove('active');
  document.getElementById('screen-btn').classList.remove('active');

  localTracks[1].play(`user-${uid}`);
  await client.publish([localTracks[1]]);
}

//用户进入
let handleUserPublished=async(user,mediaType)=>{
  //传入的id
  remoteUsers[user.uid]=user;
  
  await client.subscribe(user,mediaType)

  let player=document.getElementById(`user-container-${user.uid}`)
  //如果未加载这个人则加入浏览器播放
  if(player===null){
    player=`<div class="video_container" id="user-container-${user.uid}">
    <div class="video_player" id="user-${user.uid}"></div>
    </div>`
    document.getElementById('streams_container').insertAdjacentHTML('beforeend',player);

    document.getElementById(`user-container-${user.uid}`).addEventListener('click',expandVideoFrame);
  }

  //检查是否有聚焦
  if(displayFrame.style.display){
    player.style.height='100px';
    player.style.width='100px';
  }


  //播放音频
  if(mediaType==='video'){
    user.videoTrack.play(`user-${user.uid}`)
  }

  if(mediaType==='audio'){
    user.audioTrack.play(`user-${user.uid}`)
  }

}

//他人离开房间
let handleUserLeft=async(user)=>{
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();

  //检查离开的是否是聚焦的
  if(userIdInDisplayFrame===`user-container-${user.uid}`){
    //不显示聚焦框
    displayFrame.style.display=null;
    //把其余变大
    let videoFrames = document.getElementsByClassName('video_container');
    for(let i=0; videoFrames.length>i;i++){
      videoFrames[i].style.height='300px';
      videoFrames[i].style.width='300px';
    }
  }
}

//镜头开关
let toggleCamera=async(e)=>{
  let button=e.currentTarget;
  //如果视频静音则不静音并且显示active（按钮状态为开启中）
  if(localTracks[1].muted){
    await localTracks[1].setMuted(false);
    button.classList.add('active');
  }else{
    await localTracks[1].setMuted(true);
    button.classList.remove('active');
  }
}

//麦克风开关
let toggleMic=async(e)=>{
  let button=e.currentTarget;
  //如果视频静音则不静音并且显示active（按钮状态为开启中）
  if(localTracks[0].muted){
    await localTracks[0].setMuted(false);
    button.classList.add('active');
  }else{
    await localTracks[0].setMuted(true);
    button.classList.remove('active');
  }
}

//屏幕分享开关
let toggleScreen=async(e)=>{
  let screenButton=e.currentTarget;
  let cameraButton=document.getElementById('camera-btn');
  //若未分享
  if(!sharingScreen){
    //屏幕分享状态
    sharingScreen=true;
    //按钮状态开启同时禁止开启摄像头
    screenButton.classList.add('active');
    cameraButton.classList.remove('active');
    cameraButton.style.display='none';
    //获取屏幕并删除原本的，在聚焦框展示
    localScreenTracks=await AgoraRTC.createScreenVideoTrack();
    document.getElementById(`user-container-${uid}`).remove();
    displayFrame.style.display='block';

  let player=`<div class="video_container" id="user-container-${uid}">
                <div class="video_player" id="user-${uid}"></div>
                </div>`
  displayFrame.insertAdjacentHTML('beforeend',player);
  document.getElementById(`user-container-${uid}`).addEventListener('click',expandVideoFrame);

  userIdInDisplayFrame=`user-container-${uid}`;

  localScreenTracks.play(`user-${uid}`);

  await client.unpublish([localTracks[1]]);
  await client.publish([localScreenTracks]);

  //下面的缩小
  let videoFrames = document.getElementsByClassName('video_container')
        for(let i = 0; videoFrames.length > i; i++){
            if(videoFrames[i].id != userIdInDisplayFrame){
              videoFrames[i].style.height = '100px'
              videoFrames[i].style.width = '100px'
            }
          }

  }else{
    sharingScreen=false;
    cameraButton.style.display='block';
    document.getElementById(`user-container-${uid}`).remove();
    await client.unpublish([localScreenTracks]);
    switchToCamera();
  }
}

document.getElementById('camera-btn').addEventListener('click',toggleCamera);
document.getElementById('mic-btn').addEventListener('click',toggleMic);
document.getElementById('screen-btn').addEventListener('click',toggleScreen);

//加入房间
joinRoomInit();

