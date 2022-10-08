
<template>
  <div class="main" v-show="disshow">
    <div class="layb">
      <!-- 图片需父组件传入 -->
      <img :src="src">
      <!-- 内容需父组件传入 -->
      <div class="zi">
        {{zi}}
      </div>

      <!-- but是1有确认和取消按钮 -->
      <div class="but" v-if='but==1' >
        <div class="confirm theme-linear-bg" @click="disconfirm()">确定</div>
        <!-- <button class="cancel" @click="discancel()">取消</button>
        <button class="confirm" @click="disconfirm()">确定</button>     -->
      </div>

      <!-- but是2是发送验证码的样式 -->
      <div class="inp" v-if='but==2'>
        <input type="Number" v-model="sms">
        <button class="cancel" @click=" message=='获取验证码'?getCode():''">{{message}}</button>
      </div>
      <div class="but" v-if='but==2' >
        <button class="cancel2" @click="smsConfirm()">确认</button>
      </div>
      <!-- but是2是顶部关闭按钮 -->
      <div class="close2" v-if='but==2'>
        <van-icon name="close" color='#fff' @click="topClose()" />
      </div>

      <!-- but是3是顶部关闭按钮 -->
      <div class="close2" v-if='but==3'>
        <van-icon name="close" color='#fff' @click="topClose()" />
      </div>

      <!-- but是4是底部关闭按钮 -->
      <div class="close" v-if='but!=2'>
        <van-icon name="close" color='#fff' @click="topClose()" />
      </div>

    </div>
    <div class="zhanwei"></div>
  </div>
</template>


<script>
import {Icon} from 'vant';
export default {
  data(){
    return{
      disshow:false,
      //  message:'获取验证码',
      sms:'',
      num:60

    }
  },
  props:['src','zi','but','message'],

  methods:{
    disopen(){
      this.disshow=true
    },
    discancel(){
      this.disshow=false
    },
    disconfirm(){
      this.disshow=false
      this.$emit('disconfirm')
    },
    close(){
      this.disshow=false
    },
    topClose(){
      this.disshow=false
      this.$emit('topClose')
    },
    getCode(){
      // let timer = setInterval(()=>{
      //     this.message = '('+this.num+')秒'
      //     this.num--
      //     if(this.num == 0){
      //         clearInterval(timer)
      //         this.num = 60
      //         this.message = '获取验证码'
      //     }
      // },1000)
      this.$emit('getCode')
    },
    smsConfirm(){
      this.$emit('smsConfirm',this.sms)
    }
  },
  components:{
    [Icon.name]:Icon
  }
}
</script>

<style scoped lang='less'>
.main{
  position:fixed;
  left:0px;
  width: 100%;
  height: 100vh;
  top: 0px;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.5);
  .layb{
    position: relative;
    height: 667px;

    img{
      position: absolute;
      left: 17%;
      top: 30%;
      width: 250px;
      z-index: 200;
    }
    .but{
      position:absolute;
      z-index: 301;
      top: 480px;
      left:60px;
      button{

        border: 0px;
        color: #fff;
        font-size: 12px;
        margin-right:55px ;
        width: 100px;
        padding: 5px 25px;
        border-radius: 5px;
      }
      .confirm{
        //   background: linear-gradient(rgb(239,203,113),rgb(232,172,83));
        //   box-shadow: 2px 5px 5px rgb(241,92,23);
        position:absolute;
        width: 200px;
        height: 35px;
        color: #FFFFFF;
        line-height: 35px;
        font-size: 16px;
        text-align: center;
        border-radius: 50px;
        box-shadow: 1px 3px 5px 0px rgba(130,130,130,.2);
        left: 30px;
        top: -15px;
      }
      .cancel{
        background-color: rgb(248,105,53);
        border: 1px solid rgb(251,215,150);
        box-shadow: 2px 5px 5px rgb(241,92,23);
        box-shadow: rgb(249,138,59) 0px 0px 5px 3px inset;
      }
      .cancel2{
        background-color: rgb(248,105,53);
        border: 1px solid rgb(251,215,150);
        box-shadow: 2px 5px 5px rgb(241,92,23);
        box-shadow: rgb(249,138,59) 0px 0px 5px 3px inset;
        width: 150px;
        height: 35px;
        margin-left:50px ;
      }
    }
    .zi{
      text-align: center;
      position:absolute;
      z-index: 201;
      top: 360px;
      left:90px;
      width: 210px;
      color: #333;
      font-size: 13px;
      overflow:scroll;
      word-break: break-all;
      height: 100px;
    }
  }
  .inp{
    position:absolute;
    z-index: 101;
    top: 420px;
    left:100px;

    button{
      border: 0px;
      color: #fff;
      font-size: 12px;
      width: 80px;
      padding: 5px 0px;
      border-radius: 5px;
    }
    input{
      width: 100px;
      background-color: rgb(248,105,53);
      height: 30px;
      border: 1px solid rgb(251,215,150);
      border-radius: 5px;
      font-size: 12px;
      color: #fff;
    }

    .cancel{
      position: absolute;
      background-color: rgb(248,105,53);
      border: 1px solid rgb(251,215,150);
      box-shadow: 2px 5px 5px rgb(241,92,23);
      box-shadow: rgb(249,138,59) 0px 0px 5px 3px inset;
      margin-left:10px ;
      top: 15px;
    }
  }
  .close{
    position:absolute;
    z-index: 101;
    top: 570px;
    left:170px;
  }
  .close2{
    position:absolute;
    z-index: 101;
    top: 130px;
    left:300px;
  }

}
</style>
