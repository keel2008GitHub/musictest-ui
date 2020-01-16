<template>
  <div>
    <div v-if="maskType" class="mask">
      <i></i>
    </div>
    <div class="title">Please draw your melody</div>
    <div class="appModule" ref="app"> 
      <div class="lineMes">
        <span v-for="(item,index) in lineData" :key="index"><a>{{item}}</a></span>
      </div>
      <div id="app">
          <MusicalNote :dotIndexList="dotList" @onChange="getAllPosition"/>
          <div class="positionMes">
             <ul>
               <li v-for="(item,index) in dispalyList" :key="index">
                 <span>{{item.titleY}}</span>
                 <span>{{item.titleX}}</span>
              </li>
             </ul>
          </div>
          <div class="positionBtn">
              <span  @click.prevent="startRecord">{{recorderStatus ? num+'s' : '' }}<i v-show="!recorderStatus" class="recordIcon icon"></i></span>
              <span v-if="openType" @click="mixHas"><i class="saveIcon icon"></i></span>
              <span v-else style="opacity: 0.5;cursor: not-allowed;"><i class="saveIcon icon"></i></span>

              <span v-if="openType" @click="handlerPlay"><i class="icon" :class="playStatus"></i></span>
              <span v-else  style="opacity: 0.5;cursor: not-allowed;" ><i class="icon" :class="playStatus"></i></span>

              <span v-if="openType" @click="deleteData"><i class="deleteIcon icon"></i></span>
              <span v-else style="opacity: 0.5;cursor: not-allowed;"><i class="deleteIcon icon"></i></span>
              <audio id="my_audio"  :src="baseURL+'/static/finalversion.wav'"></audio>
          </div>
      </div>
    </div>
  </div>
  
  </template>

  <script>
  // eslint-disable-next-line
  import MusicalNote from './components/MusicalNote/index'
  import HZRecorder from './js/record'
  import {mix, humming} from './http/methods.js'
  import transform from './js/transform'
  import config from './config/index'
  export default {
  name: 'app',
  components: {
    MusicalNote,
  },
  data(){
    return{
      maskType:false,
      openType:true,
      baseURL:config.baseURL,
      dotList:[],
      lineData:[ "None","B-1","C-2","D-2","E-2","F-2","G-2","A-2","B-2","C-3","D-3","E-3","F-3","G-3","A-3","B-3","C-4","D-4","E-4", "F-4", "G-4", "A-4", "B-4", "C-5", "D-5", "E-5", "F-5", "G-5","A-5","B-5","C-6","D-6","E-6","F-6","G-6"],
        params:{
        notes:[]
      },
      dispalyList:[],
      backNotes:[],
      num: 15, // 按住说话时间
      recorderStatus: false,
      recorder: null,
      playStatus: 'over'
    }
  },
  methods:{
    handlerPlay(){
      // 播放
      let my_audio = document.querySelector("#my_audio");
      let that = this;
      this.playStatus = my_audio.paused;
      if(my_audio.paused){
        my_audio.play();
        that.playStatus = 'doing';
        my_audio.addEventListener('ended',function(){
          that.playStatus = 'over'
        })
      }else{
        my_audio.pause();
        that.playStatus = 'over'
      }
      
    },
    deleteData(){
      this.dotList = [];
    },
      // 开始录音
    startRecord() {
      this.openType=false
      let that = this;
      that.num = 16;
      HZRecorder.get(function (rec) {
        that.recorder = rec;
        that.recorder.start();
        that.TimeDown();

      });
    },
    TimeDown() {
      let that = this;
      if (that.num != 0) {
          this.recorderStatus = true
          that.num--;
      }else{
          this.recorderStatus = false
      }
      setTimeout(function(){
        if (that.num != 0) {
            this.recorderStatus = true
            that.TimeDown();
          } else{
              that.uploadAudio();
          }
      },1000)

    },
    uploadAudio(){
      let that =this;
       this.recorderStatus = false;
       let path;
        var fd = new FormData();
        fd.append("audioData", this.recorder.getBlob());
        humming(fd).then(res => {
            that.params = res;
            that.mixHas()
            this.openType=true
        })
    },
    
    /**
     * 数据返回服务器
     * */ 
   mixHas(){
     this.maskType=true
     console.log(this.params)
    //  this.params.notes=['D-5|1', 'D-5|5', 'D-5|9', 'None|16', 'None|32', 'None|48', 'B-5|50', 'None|64', 'None|80', 'G-5|81', 'None|96', 'None|112', 'A#-5|113', 'None|128']
      mix(this.params).then((res) => {
         /** 服务器返回的数据转回为显示的点*/ 
         this.dotList = transform.yinListToPosition(res.notes,this.lineData)
         /** 服务器返回的数据转换为显示的数据*/
         this.dispalyList = transform.yinListToDisplayList(res.notes,this.lineData)
         this.maskType=false
      })
    },
    getAllPosition(list){
       /** 点击的数据转为服务器要的数据*/
      this.params.notes = transform.positionListToYinList(list,this.lineData)

       /** 点击的数据转为显示的数据*/
      this.dispalyList = transform.yinListToDisplayList(this.params.notes,this.lineData)
    }
  },
  mounted(){
    console.log(1111111111)
    this.mixHas()
//  var ox = document.createElement('div');
//  var oy = document.createElement('div');
//   ox.style.width = '100%';
//   ox.style.height = '1px';
//   ox.style.backgroundColor = '#ddd';
//   ox.style.position = 'fixed';
//   ox.style.left = 0;
//   document.body.appendChild(ox);
//   oy.style.height = '100%';
//   oy.style.width = '1px';
//   oy.style.backgroundColor = '#ddd';
//   oy.style.position = 'fixed';
//   oy.style.top = 0;
//   document.body.appendChild(oy);
//  document.onmousemove = function(e){
//   var e = e || event;
//   var x = e.pageX;
//   var y = e.pageY;
//   ox.style.top = y + 'px';
//   oy.style.left = x + 'px';
//  };

  }
  
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto 0px auto;
}
.appModule{margin: 0px auto;width: 1000px;height: auto;position: relative;}
.lineMes{position: absolute;left: 0px;width:25px;z-index: 999;background-color: rgba(0,0,0,0.8);color: #fff;display: flex;flex-direction:column-reverse;}
.lineMes span{display: block;width: 100%;height:15px;line-height: 26px;text-align: center; flex-direction: row-reverse;-webkit-flex-direction: row-reverse;}
.lineMes span a{font-size: 10px;-webkit-transform:scale(0.78);transform:scale(0.78);display: block;}
.positionMes{width: 1000px;height:120px; border: 1px solid #ccc;margin: 0px auto;overflow-x: scroll;}
.positionMes ul{width:3225px;height:70px;}
.positionMes ul li{width:60px;height:60px;float: left;list-style: none;}
.positionMes ul li span{display: block;width: 100%;height: 25px;line-height: 25px;}
.positionBtn{width: 1000px;height:60px;margin:20px auto;}
.positionBtn span{display: block;width: 60px;height: 30px;border-radius: 15px;border: 1px solid #ccc;float:left;margin-right: 20px;line-height: 30px;cursor: pointer;}
i.icon{display: inline-block;width: 20px;height: 20px;margin-top: 4px;}
i.recordIcon{background: url("./assets/lyIco.png") no-repeat;background-size:100%;}
i.saveIcon{ background: url("./assets/mixer.png") no-repeat;background-size:100%;margin-left: 2px;}
i.deleteIcon{background: url("./assets/shanchu.png") no-repeat;background-size:100%;}
i.over{background: url("./assets/bofang_1.png") no-repeat;background-size:100%;width:17px;height: 17px;margin-top: 6px;margin-left: 4px;}
i.doing{background: url("./assets/bofangqi-zanting.png") no-repeat;background-size:100%;width:24px;height: 24px;margin-left: 1px;margin-top: 3px;}
.title{width: 1000px;height: 40px;font-size: 42px;margin: 0px auto;text-align: center;font-weight: bold;line-height: 40px;margin-top: 20px;}
.mask{position: absolute;left: 0px;right: 0;top: 0;bottom: 0;background-color: rgba(0,0,0,0.8);z-index: 99999;}
.mask i{display: block;width:60px;height:60px;background-image: url("./assets/loading.gif");background-size: 100% 100%;position: absolute;left: 50%;margin-left: -50px;top: 50%;margin-top: -50px;}
</style>
