<template>
  <div id="box_content">
      <Header closestate filter @filter='showfilter'>
        <div class="title_box" slot="title">
            <van-tabs v-model="active" @click="Tabchange" title-active-color='#fff' color='#1DCBAC' background='#fff' title-inactive-color='#1DCBAC' type="card">
              <van-tab title="未发放"></van-tab>
              <van-tab title="全部"></van-tab>
            </van-tabs>
        </div>
      </Header>
      <div class="clearfix" style="width:100%" v-show="active===0&&withoutlist.total">
        <van-notice-bar mode="closeable">您有{{withoutlist.total}}条申购记录未发放</van-notice-bar>
      </div>
      <div class="main_box">
        <template v-if='active===0'>
            <Nodate v-show="withoutlist.nodata"></Nodate>
            <van-list v-model="withoutlist.loading" v-show="!withoutlist.nodata" :finished="withoutlist.finished" finished-text="没有更多了" @load="onLoad(0)" :immediate-check='false'>
            <dl class="list_dl" v-for="(item,index) in withoutlist.list" :key="index">
               <dt class="bt-b">
                   <span class="f_12 text_999">申购时间：{{item.CreateOn}}</span>
                   <span class="f_14 text_7621">{{item.Provflag|provflagStates}}</span>
                </dt>
                <dd>
                    <span>申购对象<cite>{{item.ClientClass|netType}}</cite></span>
                    <p>{{item.ClientName}}</p>
                </dd>
                <dd>
                    <span>申购总金额</span>
                    <p>¥ {{item.TotalAmount}}</p>
                </dd>
                <dd>
                    <span>付款方式</span>
                    <p>{{item.PayType}}</p>
                </dd>
                <template v-if="index==showmore">
                    <dd>
                        <span>申购物料</span>
                        <div>
                            <template v-if='item.OrderItem&&item.OrderItem.length'>
                                <p v-for="(orderitem,itemindex) in item.OrderItem" :key="itemindex">{{orderitem.MaterielName}} x{{orderitem.Qty}}</p>
                            </template>
                        </div>
                    </dd>
                    <dd>
                        <span>申购时间</span>
                        <p>{{item.CreateOn}}</p>
                    </dd>
                    <dd>
                        <span>申购单号</span>
                        <p>{{item.OrderId}}</p>
                    </dd>
                    <dd>
                        <span>原因</span>
                        <p>{{item.Remark?item.Remark:'--'}}</p>
                    </dd>
                </template>
                <dt @click="listShowmore(index)" class="bt-b">
                    <img v-if="index==showmore" src="~@/components/static/img/transport_up@2x.png" style="transform:rotate(180deg);" alt="">
                    <img v-else src="~@/components/static/img/transport_up@2x.png" alt="">
                </dt>
                <dt v-if="item.Provflag===0">
                   <div style="flex:1;" @click="stockDone(item.OrderId,index,'without')" class="f_16 text_CBAC text_c">出库</div>
                </dt>
            </dl>
         </van-list>
        </template>
        <template v-if='active===1'>
            <Nodate v-show="alllist.nodata"></Nodate>
            <van-list v-show="!alllist.nodata" v-model="alllist.loading" :finished="alllist.finished" finished-text="没有更多了" @load="onLoad(null)" :immediate-check='false'>
           <dl class="list_dl" v-for="(item,index) in alllist.list" :key="index">
               <dt class="bt-b">
                   <span class="f_12 text_999">申购时间：{{item.CreateOn}}</span>
                   <span class="f_14 text_7621">{{item.Provflag|provflagStates}}</span>
                </dt>
                <dd>
                    <span>申购对象<cite>{{item.ClientClass|netType}}</cite></span>
                    <p>{{item.ClientName}}</p>
                </dd>
                <dd>
                    <span>申购总金额</span>
                    <p>¥ {{item.TotalAmount}}</p>
                </dd>
                <dd>
                    <span>付款方式</span>
                    <p>{{item.PayType}}</p>
                </dd>
                <template v-if="index==showmore">
                    <dd>
                        <span>申购物料</span>
                        <div>
                            <template v-if='item.OrderItem&&item.OrderItem.length'>
                                <p v-for="(orderitem,itemindex) in item.OrderItem" :key="itemindex">{{orderitem.MaterielName}} x{{orderitem.Qty}}</p>
                            </template>
                        </div>
                    </dd>
                    <dd>
                        <span>申购时间</span>
                        <p>{{item.CreateOn}}</p>
                    </dd>
                    <dd>
                        <span>申购单号</span>
                        <p>{{item.OrderId}}</p>
                    </dd>
                    <dd>
                        <span>原因</span>
                        <p>{{item.Remark?item.Remark:'--'}}</p>
                    </dd>
                </template>
                <dt @click="listShowmore(index)" class="bt-b">
                    <img v-if="index==showmore" src="~@/components/static/img/transport_up@2x.png" style="transform:rotate(180deg);" alt="">
                    <img v-else src="~@/components/static/img/transport_up@2x.png" alt="">
                </dt>
                <dt v-if="item.Provflag===0">
                   <div style="flex:1;" @click="stockDone(item.OrderId,index,'all')" class="f_16 text_CBAC text_c">出库</div>
                </dt>
            </dl>
         </van-list>
        </template>
      </div>
      <div class="outbound_bottom bt-t">
        <span @click="$router.push({name:'home'})" class="active">有申购出库</span>
        <span @click="$router.push({name:'onceout'})">直接出库</span>
      </div>
       <van-popup v-model="showfliterPop" position='right' class="fullscreenBox bg_f5f5f5">
          <Header closepope @popclose='showfliterPop=false' title='条件筛选'></Header>
          <van-cell-group class="bg_white">
              <van-cell title="开始时间" :value="filterorder.beginDate?filterorder.beginDate:'去选择'" @click="showPickerState('start')" is-link></van-cell>
              <van-cell title="结束时间" :value="filterorder.endDate?filterorder.endDate:'去选择'"  @click="showPickerState('end')" is-link></van-cell>
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
            <van-field label="申购单号" clearable input-align='right' v-model="filterorder.id" right-icon="edit" placeholder="选填"></van-field>  
          </van-cell-group>
          <van-cell-group class="bg_white mt_8">
            <van-cell title="状态" :value="checkedprovtate?checkedprovtate:'去选择'"  @click="showPickerState('provstate')" is-link></van-cell>
          </van-cell-group>
          <div class="clearfix submit_box_btn">
              <!-- <button type="button" @click="cancelFilter">取消</button> -->
              <button type="button" @click="showfliterPop=false">取消</button>
              <button type="button" @click="getFilterlist()" class="active">确认</button>
          </div>
      </van-popup>
      

      <van-popup v-model="showPicker" position="bottom">
        <van-datetime-picker v-if="dateType=='start'||dateType=='end'"  v-model="currentDate" type="date" show-toolbar  @cancel="onCancel" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"></van-datetime-picker>
        <van-picker v-if="dateType=='type'" :columns="orderUserTypecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择申购类型"></van-picker>
        <van-picker v-if="dateType=='provstate'" :columns="provstatecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择出库状态"></van-picker>
      </van-popup>
  </div>      
</template>
<script>
import {commonMethods} from '@/mixins/common.mixin';
import {Payment,orderUserType,orderState,provFlagstate,searchDateType} from '@/api/api';
export default {
  mixins:[commonMethods],
  data() {
    return {
      active:0,
      dateType:null,
      showfliterPop:false,
      provstatecolumns:provFlagstate,
      orderUserTypecolumns:orderUserType,
      showPicker:false,
      showmore:null,
      closeable:true,
      minDate: new Date(new Date().getFullYear() - 1, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      Objectstate:false,
      filterorder:{
        beginDate:null,
        endDate:null,
        siteId:this.$store.state.userinfo.companyId,
        clientClass:null,
        createSiteId:null,
        id:null,
        provflag:0,
        companyCode:this.$store.state.userinfo.companyCode,
        pageIndex:1,
        pageSize:10
      },
      oldfilteror:null,/* 暂存检索条件 */
      startTimestamp:null,
      endTimestamp:null,
      checkedType:null,
      checkedprovtate:'全部',
      /* 未发放 */
      withoutlist:{
        list:[],
        pageIndex:1,
        total:0,
        loading:false,
        finished:false,
        nodata:false,
      },
      /* 全部 */
      alllist:{
        list:[],
        pageIndex:1,
        loading:false,
        finished:false,
        nodata:false,
      },
      timerObj:null,
      queryIndex:'',
      Objectlist:[],
      checkedfilterName:null,
      isloading:false
    }
  },
  created() {
    this.onLoad(0)
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
      if(!this.filterorder.createSiteId){
          this.$Tools.sendMessage('请选择申购对象！');
          return false;
      }
      this.alllist.list=[];
      this.alllist.pageIndex=1;
      this.alllist.finished=false;
      this.$set(this.alllist,'nodata',false)
      this.withoutlist.list=[];
      this.withoutlist.pageIndex=1;
      this.withoutlist.finished=false;
      this.$set(this.withoutlist,'nodata',false)
      this.filterorder.pageIndex=1;
      this.active=1;
      this.onLoad(null);
      this.showfliterPop=false;
    },
    onCancel(){
      this.filterorder=this.oldfilteror;
      this.checkedprovtate=this.checkedfilterName.checkedprovtate;
      this.startTimestamp=this.checkedfilterName.startTimestamp;
      this.endTimestamp=this.checkedfilterName.endTimestamp;
      this.checkedType=this.checkedfilterName.checkedType;
      this.queryIndex=this.checkedfilterName.queryIndex;
      this.showPicker=false;
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
                case 'provstate':
                    _self.$set(_self.filterorder,'provflag',value.value);
                    _self.checkedprovtate=value.text;
                    break;
            }
            this.showPicker=false;
    },
    checkedObject(index){
        this.$set(this.filterorder,'createSiteId',this.Objectlist[index].Key);
        this.queryIndex=this.Objectlist[index].Value;
        this.Objectstate=false;
        this.Objectlist=[];
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
    showPickerState(pickertype){
      this.dateType=pickertype;
      this.showPicker=true;
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
        checkedprovtate:this.checkedprovtate,
        checkedOrderstate:this.checkedOrderstate,
        startTimestamp:this.startTimestamp,
        endTimestamp:this.endTimestamp,
        checkedType:this.checkedType,
        queryIndex:this.queryIndex
      }
      // if(!this.filterorder.beginDate&&!this.filterorder.endDate){
      //   this.$set(this.filterorder,'beginDate',timeStr);
      //   this.$set(this.filterorder,'endDate',timeStr);
      //   this.startTimestamp=stamp;
      //   this.endTimestamp=stamp;
      // }
      this.showfliterPop=true;
    },

    Tabchange(index,title){
      var _self=this;
      switch (index) {
        case 0:
          _self.$set(_self.filterorder,'pageIndex',this.withoutlist.pageIndex);
          _self.onLoad(0)
          break;
        case 1:
          _self.$set(_self.filterorder,'pageIndex',this.alllist.pageIndex);
          _self.onLoad(null)
          break;
      }
    },

    /* 执行出库 */
    stockDone(orderId,index,type){
      var _self=this;
        vant.Dialog.confirm({
          title: '提示',
          message: '是否确认出库?'
          }).then(() => {
            this.$store.dispatch('doneOutStock',{orderId,companyCode:this.$store.state.userinfo.companyCode,siteId:this.$store.state.userinfo.companyId})
            .then(res=>{
              if(!res){
                  return ;
              }
              if(res.respCode==='000'){
                switch (type) {
                  case 'without':
                    _self.$set(_self.withoutlist.list[index],'Provflag',1);
                    break;
                  case 'all':
                    _self.$set(_self.alllist.list[index],'Provflag',1);
                    break;
                }
                _self.$Tools.sendMessage(res.resMessage);
              }
            })
          })
    },

    listShowmore(index){
        this.showmore=index==this.showmore?null:index;
    },
    onLoad(provflag){
      if(this.isloading){
        return
      }
      var _self=this;
      _self.$set(_self.filterorder,'provflag',provflag)
      this.isloading=true;
      // 异步更新数据
      _self.$store.dispatch('getOutStockPager',_self.filterorder)
      .then(res=>{
        this.isloading=false;
        switch (provflag) {
          case 0:
            // 加载状态结束
            _self.withoutlist.loading=false;
            if(res){
              if(!res.data.TotalCount||res.data.TotalCount===0){
                this.withoutlist.nodata=true;
              }
              _self.withoutlist.total=res.data.TotalCount;
              _self.withoutlist.list=_self.withoutlist.list.concat(res.data.Rows);
              _self.withoutlist.pageIndex=_self.withoutlist.pageIndex+1;
              _self.filterorder.pageIndex=_self.withoutlist.pageIndex;
              // 数据全部加载完成
              if (_self.withoutlist.list.length >= res.data.TotalCount) {
                _self.withoutlist.finished = true;
              }
            }
            break;
          case null:
            // 加载状态结束
            _self.alllist.loading=false;
            if(res){
              if(!res.data.TotalCount||res.data.TotalCount===0){
                this.alllist.nodata=true;
              }
              _self.alllist.list=_self.alllist.list.concat(res.data.Rows);
              _self.alllist.pageIndex=_self.alllist.pageIndex+1;
              _self.filterorder.pageIndex=_self.alllist.pageIndex;
              // 数据全部加载完成
              if (_self.alllist.list.length >= res.data.TotalCount) {
                _self.alllist.finished = true;
              }
            }
            break;
        }
      })
    },

  }
}
</script>
<style scoped>
@import url('~@/modules/index/css/history.css');
  .title_box{
    text-align: center;
    padding-top: 7px;
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
