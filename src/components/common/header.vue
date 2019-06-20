<template>
  <div id="header" :style="{backgroundColor:bg,color:textColor}">
    <div class="header_box">
      <div class="back">
        <slot name="left">
          <slot name="backbutton">
            <span v-if="backstate" @click="back" class="backicon"></span>
            <span v-if="backstatedefine" @click="backdefined" class="backicon"></span>
            <span v-if="closepope" @click="popclose" class="backicon"></span>
            <!-- <span v-if="homestate" @click="home" class="homeicon"></span> -->
            <!-- <span v-if="closePopstate" @click="closepop" class="backicon"></span> -->
            <span v-if="backwhitestate" @click="back" class="backicon_white"></span>
          </slot>
          <span v-if="closestate" @click="close" class="closeicon"></span>
        </slot>
      </div>
      <div class="title">
        <slot name="title">{{title}}</slot>
      </div>
      <div class="menu">
        <slot name="right">
          <span v-if="historylist" @click="details" class="historylist"></span>
          <span v-if="chartstate" @click="sitechart" class="searchicon"></span>
          <span v-if="filter" @click="filterEmit" class='vant_icon_box'>
            <van-icon name="filter-o"></van-icon>
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
  import Bus from '@/functions/Bus'
  export default {
    data(){
      return{}
    },
    props:{
      backstate:{
        type:Boolean,
        default:false
      },
      backstatedefine:{
        type:Boolean,
        default:false
      },
      closepope:{
        type:Boolean,
        default:false
      },
      backwhitestate:{
        type:Boolean,
        default:false
      },
      homestate:{
        type:Boolean,
        default:false
      },
      closestate:{
        type:Boolean,
        default:false
      },
      chartstate:{
        type:Boolean,
        default:false
      },
      title:{
        type:String
      },
      bg:{
        type:String,
        default:"white"
      },
      textColor:{
        type:String,
        default:'#333'
      },
      leftcontent:{
        type:String
      },
      historylist:{
        type:Boolean,
        default:false
      },
      filter:{
        type:Boolean,
        default:false
      },
      closePopstate:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      back(){
        this.$router.go(-1);
      },
      backdefined(){
        this.$emit('backdefined')
      },
      popclose(){
        this.$emit('popclose')
      },
      close(){
        this.$bridge.callHandler(
          'finishBridge'
          ,''
        )
      },
      home(){
        this.$router.push({name:'home'});
      },
      sitechart(){
       this.$emit('chartpath')
      },
      details(){
        this.$emit('historylist')
      },
      filterEmit(){
        this.$emit('filter')
      },
      closepop(){
        Bus.$emit('closepop')
      }
    }
  }
</script>
<style scoped>
  #header{
    padding-top: 0px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }
  #header .header_box{
    height: 45px;
    font-size: 22px;
    padding: 0px 16px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-flow: row nowrap;
    box-sizing: border-box;
  } 
  #header .header_box .title{
    flex:1;
    line-height: 45px;
    font-size: 16px;
    text-align: center;
  } 
  #header .header_box .back{
    width: 100px;
    text-align: left;
    display: flex;
    height: 100%;
    flex-flow: nowrap row;
    justify-content: flex-start;
    align-items: center;
  }    
  #header .header_box .back .backicon{
    background-image: url('../static/img/back@2x.png');
    height: 100%;
    width: 40px;
    background-size: 16px auto;
    background-repeat: no-repeat;
    background-position: left center!important;
  } 
  #header .header_box .back .backicon_white{
    background-image:url('../static/img/back_white@2x.png');
    height: 100%;
    width: 40px;
    background-repeat: no-repeat;
    background-size: 16px auto;
  }  
  #header .header_box .back .closeicon{
    width: 40px;
    height: 100%;
    background-image:url('../static/img/fork@2x.png');
    background-size: auto 16px;
    background-repeat: no-repeat;
    background-position: left center!important;
  }
  #header .header_box .back .homeicon{
    width: 40px;
    height: 100%;
    background-image:url('../static/img/back_home@2x.png');
    background-size: auto 16px;
    background-repeat: no-repeat;
    background-position: left center!important;
  }   
  #header .header_box .menu{
    width: 100px;
    text-align: left;
    display: flex;
    flex-flow: nowrap row;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
  }
  #header .header_box .menu .searchicon{
      width: 40px;
      background-image:url('../static/img/search@2x.png');
      background-size: 50% auto;
      background-position: right center!important;
      height: 40px;
      background-repeat: no-repeat;
  }
  #header .header_box .menu .historylist{
    width: 40px;
    background-image:url('../static/img/time_select@2x.png');
    background-size: 50% auto;
    background-position: right center!important;
    height: 40px;
    background-repeat: no-repeat;
  }
  #header .header_box .menu .vant_icon_box{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center
  }
</style>
