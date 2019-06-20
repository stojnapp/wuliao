<template>
  <div id="box_content">
      <Header backstatedefine @backdefined="$router.push({name:'home'})" filter title='直接出库' @filter='showfilter'></Header>
      <div class="main_box">
        <Nodate v-show="nodata"></Nodate>
        <van-list v-show="!nodata" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload()" :immediate-check='false'>
          <dl class="list_dl" v-for="(item,index) in list" :key="index">
               <dt class="bt-b">
                   <span class="f_12 text_999">出库时间：{{item.CreateOn}}</span>
                </dt>
                <dd>
                    <span>申购对象<cite>{{item.ClientClass|netType}}</cite></span>
                    <p>{{item.BelongSiteName}}</p>
                </dd>
                <dd>
                  <span>出库物料</span>
                  <p>{{item.MaterielName}}×{{item.OutQty}}</p>
                </dd>
                 <template v-if="index==showmore">
                <dd>
                    <span>物料编码</span>
                    <p>{{item.MaterielCode}}</p>
                </dd>
                <dd>
                    <span>起始单号</span>
                    <p>{{item.StartNumber?item.StartNumber:'--'}}</p>
                </dd>
                <dd>
                    <span>结束单号</span>
                    <p>{{item.EndNumber?item.EndNumber:'--'}}</p>
                </dd>
                <dd>
                    <span>出库人</span>
                    <p>{{item.ConfigBy}}</p>
                </dd>
                <dd>
                    <span>出库时间</span>
                    <p>{{item.CreateOn}}</p>
                </dd>
                <dd>
                    <span>备注</span>
                    <p>{{item.Remark?item.Remark:'--'}}</p>
                </dd>
                </template>
                <dt @click="listShowmore(index)" class="bt-b">
                    <img v-if="index==showmore" src="~@/components/static/img/transport_up@2x.png" style="transform:rotate(180deg);" alt="">
                    <img v-else src="~@/components/static/img/transport_up@2x.png" alt="">
                </dt>
            </dl>
        </van-list>
      </div>
      <div class="outbound_bottom bt-t">
        <span @click="$router.push({name:'home'})">有申购出库</span>
        <span class="active">直接出库</span>
      </div>
      <div class="addOrder" @click="$router.push({name:'infosubmit'})"><van-icon size='20px' name="plus" /></div>

      <van-popup v-model="showfliterPop" position='right' class="fullscreenBox bg_f5f5f5">
        <Header closepope @popclose='showfliterPop=false' title='条件筛选'></Header>
        <van-cell-group class="bg_white">
          <van-cell title="开始时间" :value="filterorder.beginDate?filterorder.beginDate:'去选择'" @click="showPickerState('start')" is-link></van-cell>
          <van-cell title="结束时间" :value="filterorder.endDate?filterorder.endDate:'去选择'"  @click="showPickerState('end')" is-link></van-cell>
        </van-cell-group>
        <van-cell-group class="bg_white mt_8">
           <van-cell title="网点名称" :value="searchindex"></van-cell>
          <!-- <van-field label="网点名称" clearable :disabled='disabled' input-align='right' v-model="searchindex" @input='getNetinfoIndex' placeholder="请输入网点名称或编号" right-icon="edit"></van-field>
            <div class="list_item" v-show="downstate">
                <div class="sanjiao"></div>
                <ul>
                    <li class="bt-b" v-for="(item,index) in netlist" @click="checkedNet(item.id,item.fullName)" :key="index">{{item.fullName}}</li>
                </ul>
            </div> -->
        </van-cell-group>
        <van-cell-group class="bg_white mt_8">
           <van-cell title="申购类型" :value="checkedType?checkedType:'去选择'"  @click="showPickerState('type')" is-link></van-cell>
            <van-field label="申购对象" clearable input-align='right' @input='getApplyObjectlist' v-model="queryIndex" right-icon="edit" placeholder="请输入申购对象或编号"></van-field>
            <div class="list_item" v-show="Objectstate">
                <div class="sanjiao"></div>
                <ul>
                      <li class="bt-b" v-for="(item,index) in Objectlist" @click="checkedObject(index)" :key="index">{{item.Value}}</li>
                </ul>
            </div>
            <van-field label="物料品名" clearable input-align='right' v-model="checkegoodsname" @input='getgoodslist' right-icon="edit" placeholder="请输入物料品名"></van-field>
            <div class="list_item" v-show="goodsstate">
                <div class="sanjiao"></div>
                <ul>
                      <li class="bt-b" v-for="(item,index) in goodslist" @click="checkedgoods(item.MaterielId,item.MaterielName)" :key="index">{{item.MaterielName}}</li>
                </ul>
            </div>
        </van-cell-group>
        <div class="clearfix submit_box_btn">
              <!-- <button type="button" @click="cancelFilter">取消</button> -->
              <button type="button" @click="showfliterPop=false">取消</button>
              <button type="button" @click="getFilterlist()" class="active">确认</button>
          </div>
      </van-popup>
      <van-popup v-model="showPicker" position="bottom" overlay>
        <van-datetime-picker v-if="dateType=='start'||dateType=='end'"  v-model="currentDate" type="date" show-toolbar  @cancel="onCancel" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"></van-datetime-picker>
        <van-picker v-if="dateType=='type'" :columns="orderUserTypecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择申购类型"></van-picker>
      </van-popup>
  </div>      
</template>

<script>
import {commonMethods} from '@/mixins/common.mixin';
import {orderUserType,orderState,searchDateType} from '@/api/api';
export default {
  name: 'home',
  mixins: [commonMethods],
  data() {
    return {
      orderUserTypecolumns:orderUserType,
      showmore:null,
      closeable:true,
      searchindex:this.$store.state.userinfo.companyName,
      queryIndex:'',
      showPicker:false,
      downstate:false,
      netlist:[],
      Objectlist:[],
      goodslist:[],
      showfliterPop:false,
      minDate: new Date(new Date().getFullYear() - 1, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      Objectstate:false,
      goodsstate:false,
      dateType:null,
      filterorder:{
        beginDate:null,
        endDate:null,
        siteId:this.$store.state.userinfo.companyId,
        clientClass:null,
        belongSiteId:null,
        orderId:null,
        companyCode:this.$store.state.userinfo.companyCode,
        materielId:null,
        pageIndex:1,
        pageSize:10,
      },
      nodata:false,
      startTimestamp:null,
      endTimestamp:null,
      list:[],
      loading:false,
      finished:false,
      timerObj:null,
      timergoods:null,
      timer:null,
      disabled:true,
      checkegoodsname:'',
      checkedfilterName:null,
      oldfilteror:null,/* 暂存检索条件 */
    }
  },
  created() {
    if(this.$store.state.userinfo.companyCategoryCode==='独立网点'){
        this.disabled=false;
    }
    this.onload()
  },
  methods: {
    getFilterlist(){
      var stamp=this.endTimestamp-this.startTimestamp;
        if(stamp<0){
            this.$Tools.sendMessage('结束日期不得小于开始日期！');
            return false;
        }
        if(this.filterorder.clientClass===null){
            this.$Tools.sendMessage('请选择申购类型！');
            return false;
        }
        if(!this.filterorder.belongSiteId){
            this.$Tools.sendMessage('请选择申购对象！');
            return false;
        }
        // if(!this.filterorder.materielId){
        //     this.$Tools.sendMessage('请选择物料品名！');
        //     return false;
        // }
      this.filterorder.pageIndex=1;
      this.list=[];
      this.finished=false;
      this.nodata=false;
      this.onload();
      this.showfliterPop=false;
    },
    onConfirm(value){
        var _self=this;
        var TimeObj=new Date(value);
        TimeObj.setHours(0,0,0,0)
        var stamp=TimeObj.getTime();
        var timeStr=this.$Check.gettimeformate(TimeObj)
        switch(this.dateType){
                case 'start':
                    _self.startTimestamp=stamp;
                    _self.$set(_self.filterorder,'beginDate',timeStr);
                    break;
                case 'end':
                    _self.endTimestamp=stamp;
                    _self.$set(_self.filterorder,'endDate',timeStr);
                    break;
                case 'type':
                    _self.$set(_self.filterorder,'clientClass',value.value);
                    _self.checkedType=value.text;
                    break;
            }
            this.showPicker=false;
    },
    checkedNet(belongSiteId,name){
          this.$set(this.filterorder,'siteId',belongSiteId);
          this.searchindex=name;
          this.downstate=false;
      },
    checkedgoods(id,name){
      this.$set(this.filterorder,'materielId',id);
      this.checkegoodsname=name;
      this.goodsstate=false
    },
    getgoodslist(){
      if(this.timergoods !== null){
            clearTimeout(this.timergoods);
        }
        if(!this.checkegoodsname){
            return '';
        }
        this.timergoods=setTimeout(()=>{
            this.$store.dispatch('searchQuerygoods',
            {
                companyCode:this.$store.state.userinfo.companyCode,
                siteId:this.$store.state.userinfo.companyId,
                materielName:this.checkegoodsname,
                hasStock:true
            })
            .then(res=>{
                if(!res){
                  return ;
                }
                if(!res.data.length){
                    this.$Tools.sendMessage('未检索到相关内容!');
                    return '';
                }
                this.goodsstate=true;
                this.goodslist=res.data;
            })
            },500)
    },  
    getApplyObjectlist(){
        if(this.timerObj !== null){
            clearTimeout(this.timerObj);
        }
        if(this.filterorder.clientClass===null){
            this.$Tools.sendMessage('请选择申购类型！');
            return '';
        }
        if(!this.queryIndex){
            return '';
        }
        this.timerObj=setTimeout(()=>{
            this.$store.dispatch('getApplyObject',
            {
                companyCode:this.$store.state.userinfo.companyCode,
                siteId:this.$store.state.userinfo.companyId,
                clientClass:this.filterorder.clientClass,
                query:this.queryIndex
            })
            .then(res=>{
                if(!res){
                  return ;
                }
                if(!res.data){
                    this.$Tools.sendMessage('未检索到相关内容!');
                    return '';
                }
                this.Objectstate=true;
                this.Objectlist=res.data;
            })
            },500)
    },
    checkedObject(index){
            this.$set(this.filterorder,'belongSiteId',this.Objectlist[index].Key);
            this.queryIndex=this.Objectlist[index].Value;
            this.Objectstate=false;
            this.Objectlist=[];
        },
    getNetinfoIndex(){
          this.netlist=[];
          if(!this.searchindex){
              return ;
          }
          if(this.timer !== null){
              clearTimeout(this.timer);
          }
          this.timer=setTimeout(()=>{
              this.$store.dispatch('searchNetwithparent',{parentCode:this.$store.state.userinfo.companyCode,categoryCodeArray:null,index:this.searchindex})
              .then(res=>{
                  if(res.data.length){
                      this.netlist=res.data;
                      this.downstate=true;
                  }else{
                      this.$Tools.sendMessage('未检索到相关数据！'); 
                  }
              })
          },500)
      },     
    showPickerState(pickertype){
      this.dateType=pickertype;
      this.showPicker=true;
    },
    onCancel(){
      this.filterorder=this.oldfilteror;
      this.checkegoodsname=this.checkedfilterName.checkegoodsname;
      this.checkedType=this.checkedfilterName.checkedType;
      this.searchindex=this.checkedfilterName.searchindex;
      this.queryIndex=this.checkedfilterName.queryIndex;
      this.startTimestamp=this.checkedfilterName.startTimestamp;
      this.endTimestamp=this.checkedfilterName.endTimestamp;
      this.showPicker=false;
    },
    showfilter(){
      var TimeObj=new Date();
      TimeObj.setHours(0);
      TimeObj.setMinutes(0);
      TimeObj.setSeconds(0);
      var stamp=TimeObj.getTime();
      var timeStr=this.$Check.gettimeformate(TimeObj);
      this.oldfilteror=Object.assign({},this.filterorder);
      this.checkedfilterName={
        checkegoodsname:this.checkegoodsname,
        checkedType:this.checkedType,
        searchindex:this.searchindex,
        queryIndex:this.queryIndex,
        startTimestamp:this.startTimestamp,
        endTimestamp:this.endTimestamp
      }
      // if(!this.filterorder.beginDate&&!this.filterorder.endDate){
      //   this.$set(this.filterorder,'beginDate',timeStr);
      //   this.$set(this.filterorder,'endDate',timeStr);
      //   this.startTimestamp=stamp;
      //   this.endTimestamp=stamp;
      // }
      this.showfliterPop=true;
    },
    listShowmore(index){
      this.showmore=index==this.showmore?null:index;
    },
    onload(){
      var _self=this;
      this.$store.dispatch('getPlanklist',this.filterorder)
      .then(res=>{
        _self.loading=false;
        if(!res){
          return ;
        }
        if(!res.data.TotalCount||res.data.TotalCount===0){
          this.nodata=true;
        }
        _self.list=_self.list.concat(res.data.Rows);
        _self.filterorder.pageIndex=_self.filterorder.pageIndex+1;
        // 数据全部加载完成
        if (_self.list.length >= res.data.TotalCount) {
          _self.finished = true;
        }
      })
    }
  }
}
</script>
<style scoped>
@import url('~@/modules/index/css/history.css');
  .title_box{
    text-align: center;
    padding-top: 7px;
  }
  .addOrder{
    height: 40px;
    width: 40px;
    background: #1DCBAC;
    position: absolute;
    bottom: 70px;
    box-shadow:0px 4px 10px 0px rgba(29,203,172,0.3);
    right: 20px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    vertical-align: middle;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 333;
  }
  .list_dl:last-child{
    margin-bottom: 10px;
  }
  .outbound_bottom{
    height: 50px;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-flow: nowrap row;
    justify-content: space-between;
    align-items: center;
  }
  .outbound_bottom span{
    flex: 1;
    text-align: center;
    color: #999;
    font-size: 16px;
  }
  .outbound_bottom span.active{
    color: #1DCBAC;
  }
  .outbound_bottom span:first-child{
    position: relative;
  }
  .outbound_bottom span:first-child::after{
    content: "";
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 1px;
    background: #E8E8E8
  }
</style>
