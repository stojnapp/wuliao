<template>
  <div id="box_content">
      <Header closestate filter @filter='showfilter'>
        <div class="title_box" slot="title">
            <van-tabs v-model="active" @click="Tabchange" title-active-color='#fff' color='#1DCBAC' background='#fff' title-inactive-color='#1DCBAC' type="card">
              <van-tab title="待审核"></van-tab>
              <van-tab title="全部"></van-tab>
            </van-tabs>
        </div>
      </Header>
      <div class="clearfix" style="width:100%" v-if="active===0&&auditlist.total">
        <van-notice-bar mode="closeable">您有{{auditlist.total}}条申购记录未审核</van-notice-bar>
      </div>
      <div class="main_box">
          <Nodate v-show="nodata"></Nodate>
          <van-list v-show="!nodata" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad(active)" :immediate-check='false'>
             <dl class="list_dl" v-for="(item,index) in list" :key="index">
               <dt class="bt-b">
                   <span class="f_12 text_999">申购时间：{{item.CreateOn}}</span>
                   <span class="f_14 text_7621">{{item.OrderStatus|historyStates}}</span>
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

                <template v-if='active===0'>
                    <dt v-if="item.OrderStatus!==4||item.OrderStatus!==2||item.OrderStatus!==3">
                      <template v-if="item.OrderStatus===0">
                          <cite @click="backorder(index,item.OrderId,'audit','BACK')" class="text_999">退回</cite>
                          <cite @click="orderAudit(index,item.OrderId,'audit')" class="text_CBAC">审核</cite>
                      </template>
                      <template v-if="item.OrderStatus===1">
                          <cite @click="invalidOrder(index,item.OrderId,'audit')" class="text_999 hiddenafter">作废</cite>
                      </template>
                    </dt>
                </template>
                <template v-if='active===1'>
                     <dt v-if="item.OrderStatus===1||item.OrderStatus===0">
                        <template v-if="item.OrderStatus===0">
                            <cite @click="backorder(index,item.OrderId,'all','BACK')" class="text_999">退回</cite>
                            <cite @click="orderAudit(index,item.OrderId,'all')" class="text_CBAC">审核</cite>
                        </template>
                        <template v-if="item.OrderStatus===1">
                            <cite@click="invalidOrder(index,item.OrderId,'all')" class="text_999 hiddenafter">作废</cite>
                        </template>
                      </dt>
                </template>
                
            </dl>
          </van-list>  

      
      </div>
      <van-popup v-model="showfliterPop" position='right' class="fullscreenBox bg_f5f5f5">
        <Header closepope @popclose='showfliterPop=false' title='条件筛选'/>
        <van-cell-group class="bg_white">
          <van-cell title="统计时间" :value="checkedDataText" @click="showPickerState('datetype')" is-link></van-cell>
          <van-cell title="开始时间" :value="filterorder.beginDate?filterorder.beginDate:'去选择'" @click="showPickerState('start')" is-link></van-cell>
          <van-cell title="结束时间" :value="filterorder.endDate?filterorder.endDate:'去选择'"  @click="showPickerState('end')" is-link></van-cell>
        </van-cell-group>
        <van-cell-group class="bg_white mt_8">
            <van-field label="网点名称" clearable :disabled='disabled' input-align='right' v-model="searchindex" @input='getNetinfoIndex' placeholder="请输入网点名称或编号" right-icon="edit"></van-field>
            <div class="list_item" v-show="downstate">
                <div class="sanjiao"></div>
                <ul>
                    <li class="bt-b" v-for="(item,index) in netlist" @click="checkedNet(item.id,item.fullName)" :key="index">{{item.fullName}}</li>
                </ul>
            </div>
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
            <van-cell title="付款方式" :value="checkedPayname?checkedPayname:'去选择'"  @click="showPickerState('payment')" is-link></van-cell>
        </van-cell-group>
        <van-cell-group class="bg_white mt_8">
            <van-cell title="审核状态" :value="checkedOrderstate?checkedOrderstate:'去选择'"  @click="showPickerState('orderstate')" is-link></van-cell>
            <van-cell title="出库状态" :value="checkedprovtate?checkedprovtate:'去选择'"  @click="showPickerState('provstate')" is-link></van-cell>
        </van-cell-group>
        <div class="clearfix submit_box_btn">
            <button type="button" @click="cancelFilter">取消</button>
            <button type="button" @click.stop="getFilterlist()" class="active">确认</button>
        </div>
      </van-popup>
      <van-popup v-model="showPicker"  position="bottom">
          <van-datetime-picker v-if="dateType=='start'||dateType=='end'"  v-model="currentDate" type="date" show-toolbar  @cancel="showPicker=false;" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>
          <van-picker v-if="dateType=='datetype'" :columns="searchDateTypecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择统计类型"></van-picker>
          <van-picker v-if="dateType=='type'" :columns="orderUserTypecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择申购类型"></van-picker>
          <van-picker v-if="dateType=='payment'" :columns="payMentListcolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择付款方式"></van-picker>
          <van-picker v-if="dateType=='orderstate'" :columns="orderstatecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择审核状态"></van-picker>
          <van-picker v-if="dateType=='provstate'" :columns="provstatecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择出库状态"></van-picker>
      </van-popup>
  </div>      
</template>

<script>
import {Payment,orderUserType,orderState,provFlagstate,searchDateType} from '@/api/api';
import {commonMethods} from '@/mixins/common.mixin';
export default {
  name: 'home',
  mixins:[commonMethods],
  data() {
    return {
      active:0,
      showfliterPop:false,
      showPicker:false,
      showmore:null,
      closeable:true,
      Objectstate:false,
      queryIndex:'',
      orderstatecolumns:orderState,
      provstatecolumns:provFlagstate,
      searchDateTypecolumns:searchDateType,
      orderUserTypecolumns:orderUserType,
      payMentListcolumns:Payment,
      checkedDataText:'申购时间',
      dateType:null,
      minDate: new Date(new Date().getFullYear() - 1, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      downstate:false,
      startTimestamp:null,
      endTimestamp:null,
      timer:null,
      timerObj:null,
      netlist:[],
      Objectlist:[],
      disabled:true,
      checkedType:null,
      searchindex:this.$store.state.userinfo.companyName,
      filterorder:{
        searchDateType:'1',
        beginDate:null,
        endDate:null,
        belongSiteId:this.$store.state.userinfo.companyId,
        clientClass:null,
        createSiteId:null,
        id:null,
        payType:null,
        orderStatus:'0',
        provflag:null,
        companyCode:this.$store.state.userinfo.companyCode,
        pageIndex:1,
        pageSize:10
      },
      checkedPayname:'全部',
      checkedprovtate:'全部',
      checkedOrderstate:'全部',
      oldfilteror:null,/* 暂存检索条件 */

      /* 待审核列表 */
      auditlist:{
        list:[],
        pageIndex:1,
        total:0,
        finished:false,
        nodata:false
      },

      list:[],
      loading:false,
      nodata:false,
      total:null,
      finished:false,

      /* 全部 */
      alllist:{
        list:[],
        pageIndex:1,
        finished:false,
        nodata:false
      },
      checkedfilterName:null,
      isloading:false
    }
  },
  created() {
    this.onLoad(0);
  },
  mounted () {
      if(this.$store.state.userinfo.companyCategoryCode==='独立网点'){
          this.disabled=false;
      }
  },
  methods: {
    /* 清空申购对象 */
        clearobject(){
            this.$set(this.filterorder,'createSiteId',null);
            this.queryIndex='';
            this.Objectstate=false;
            this.Objectlist=[];
        },
    backorder(index,orderId,type,status){
        var _self=this;
        vant.Dialog.confirm({
            title: '提示',
            message: '是否确认退回?'
            }).then(() => {
                this.$store.dispatch('MaterielOrder',{orderId,companyCode:this.$store.state.userinfo.companyCode,status,remark:null})
                .then(res=>{
                    if(!res){
                      return ;
                    }
                    if(res.respCode==='000'){
                      switch (type) {
                        case 'audit':
                          _self.$set(_self.auditlist.list[index],'OrderStatus',4);
                          _self.onLoadaudit();
                          break;
                        case 'all':
                          _self.$set(_self.alllist.list[index],'OrderStatus',4);
                          _self.onLoadall();
                          break;
                      }
                      _self.$Tools.sendMessage(res.resMessage);
                    }else{
                      _self.$Tools.sendMessage('退回失败,请重新再试！'); 
                    }
                })
            }).catch(() => {});
    },

    onCancel(){
      this.showPicker=false
    },
    /* 作废 */
    invalidOrder(index,orderId,type){
       var _self=this;
        vant.Dialog.confirm({
            title: '提示',
            message: '是否确认作废?'
            }).then(() => {
                this.$store.dispatch('MaterielOrder',{orderId,companyCode:this.$store.state.userinfo.companyCode,status:'ABANDON',remark:null})
                .then(res=>{
                  if(!res){
                      return ;
                  }
                  if(res.respCode==='000'){
                      switch (type) {
                        case 'audit':
                          _self.$set(_self.auditlist.list[index],'OrderStatus',3);
                          _self.onLoadaudit();
                          break;
                        case 'all':
                          _self.$set(_self.alllist.list[index],'OrderStatus',3);
                          // _self.onLoadall();
                          break;
                      }
                      _self.$Tools.sendMessage(res.resMessage);
                  }else{
                    _self.$Tools.sendMessage('审核失败,请重新再试！'); 
                  }
                })
            }).catch(() => {})
    },

    /* 审核 */
    orderAudit(index,orderId,type){
       var _self=this;
        vant.Dialog.confirm({
            title: '提示',
            message: '是否确认审核?'
            }).then(() => {
                this.$store.dispatch('MaterielOrder',{orderId,companyCode:this.$store.state.userinfo.companyCode,status:'AUDIT',remark:null})
                .then(res=>{
                  if(!res){
                      return ;
                  }
                  if(res.respCode==='000'){
                      switch (type) {
                        case 'audit':
                          _self.$set(_self.auditlist.list[index],'OrderStatus',1);
                          _self.onLoadaudit();
                          break;
                        case 'all':
                          _self.$set(_self.alllist.list[index],'OrderStatus',1);
                          // _self.onLoadall();
                          break;
                      }
                      _self.$Tools.sendMessage(res.resMessage);
                  }else{
                    _self.$Tools.sendMessage('审核失败,请重新再试！'); 
                  }
                })
            }).catch(() => {})
    },

     onLoad(provflag){
      if(this.isloading){
        return
      }
      var _self=this;
      this.isloading=true;
       _self.$store.dispatch('getMaterielauditlist',_self.filterorder)
      .then(res=>{
          this.isloading=false;
          _self.loading=false;
          switch (provflag) {
            case 0:
              if(res){
                if(!res.data.TotalCount||res.data.TotalCount===0){
                   _self.auditlist.nodata=true;
                }
                _self.auditlist.total=res.data.TotalCount;
                _self.auditlist.list=_self.auditlist.list.concat(res.data.Rows);
                _self.auditlist.pageIndex=_self.auditlist.pageIndex+1;
                _self.filterorder.pageIndex=_self.auditlist.pageIndex;
                // 数据全部加载完成
                if (_self.auditlist.list.length >= res.data.TotalCount) {
                  _self.auditlist.finished = true;
                }
                _self.list=_self.auditlist.list;
                _self.total=_self.auditlist.total;
                _self.nodata=_self.auditlist.nodata;
                _self.finished=_self.auditlist.finished;
              }
              break;
            case 1:
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
                _self.list=_self.alllist.list;
                _self.total=_self.alllist.total;
                _self.nodata=_self.alllist.nodata;
                _self.finished=_self.alllist.finished;
              }
              break;
          }
      })
    
    
    },

    /* 执行检索 */
    getFilterlist(){
      var stamp=this.endTimestamp-this.startTimestamp;
        if(stamp<0){
            this.$Tools.sendMessage('结束日期不得小于开始日期！');
            return false;
        }
        if(!this.filterorder.belongSiteId){
            this.$Tools.sendMessage('所属网点不得为空！');
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
        /* 检索结果放在tab列表的全部栏目里展示 */
        this.auditlist.list=[];
        this.auditlist.pageIndex=1;
        this.auditlist.finished=false;
        this.auditlist.nodata=false;

        this.alllist.list=[];
        this.alllist.pageIndex=1;
        this.alllist.nodata=false;
        this.alllist.finished=false;
        this.filterorder.pageIndex=1;
        this.active=1;
        this.onLoad(1);
        this.showfliterPop=false;
    },

    cancelFilter(){
            this.filterorder=this.oldfilteror;
            this.checkedPayname=this.checkedfilterName.checkedPayname;
            this.checkedprovtate=this.checkedfilterName.checkedprovtate;
            this.checkedOrderstate=this.checkedfilterName.checkedOrderstate;
            this.searchindex=this.checkedfilterName.searchindex;
            this.startTimestamp=this.checkedfilterName.startTimestamp;
            this.endTimestamp=this.checkedfilterName.endTimestamp;
            this.checkedDataText=this.checkedfilterName.checkedDataText;
            this.checkedType=this.checkedfilterName.checkedType;
            this.showfliterPop=false;
        },
    resetList(){
      switch(this.active){
        case 0:
          this.auditlist.list=[];
          this.auditlist.pageIndex=1;
          this.auditlist.finished=false;
          this.auditlist.nodata=false
          break;
        case 1:
          this.alllist.list=[];
          this.alllist.pageIndex=1;
          this.alllist.finished=false;
          this.alllist.nodata=false
          break;  
      }
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
                    companyCode:this.filterorder.companyCode,
                    siteId:this.filterorder.belongSiteId,
                    clientClass:this.filterorder.clientClass,
                    query:this.queryIndex
                })
                .then(res=>{
                    if(!res.data){
                        this.$Tools.sendMessage('未检索到相关内容!');
                        return '';
                    }
                    this.Objectstate=true;
                    this.Objectlist=res.data;
                })
                },500)
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
                case 'datetype':
                    _self.$set(_self.filterorder,'searchDateType',value.value);
                    _self.checkedDataText=value.text;
                    break;    
                case 'type':
                    _self.clearobject();
                    _self.$set(_self.filterorder,'clientClass',value.value);
                    _self.checkedType=value.text;
                    break;
                case 'payment':
                    _self.$set(_self.filterorder,'payType',value.value);
                    _self.checkedPayname=value.text;
                    break;    
                case 'orderstate':
                    _self.$set(_self.filterorder,'orderStatus',value.value);
                    _self.checkedOrderstate=value.text;
                    break;
                case 'provstate':
                    _self.$set(_self.filterorder,'provflag',value.value);
                    _self.checkedprovtate=value.text;
                    break;
            }
            this.showPicker=false;
    },
    checkedNet(belongSiteId,name){
          this.clearobject();
          this.$set(this.filterorder,'belongSiteId',belongSiteId);
          this.searchindex=name;
          this.downstate=false;
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
    Tabchange(index,title){
      var _self=this;
      switch(index){
        case 0:
          _self.$set(_self.filterorder,'orderStatus','0');
          _self.$set(_self.filterorder,'pageIndex',this.auditlist.pageIndex);
          _self.list=this.auditlist.list;
          break;
        case 1:
          _self.$set(_self.filterorder,'orderStatus',null);
          _self.$set(_self.filterorder,'pageIndex',this.alllist.pageIndex);
          _self.list=this.alllist.list;
          break;
      }
      this.active=index;
      this.onLoad(index);
    },
    listShowmore(index){
        this.showmore=index==this.showmore?null:index;
    },
    showfilter(){
      var TimeObj=new Date();
      TimeObj.setHours(0,0,0,0)
      var stamp=TimeObj.getTime();
      var timeStr=this.$Check.gettimeformate(TimeObj);
      /* 存储当前检索条件，防止客户修改检索条件之后取消之后检索条件更改 */
      this.oldfilteror=Object.assign({},this.filterorder);
      this.checkedfilterName={
        checkedPayname:this.checkedPayname,
        checkedprovtate:this.checkedprovtate,
        checkedOrderstate:this.checkedOrderstate,
        searchindex:this.searchindex,
        startTimestamp:this.startTimestamp,
        endTimestamp:this.endTimestamp,
        checkedDataText:this.checkedDataText,
        checkedType:this.checkedType
      }

      // if(!this.filterorder.beginDate&&!this.filterorder.endDate){
      //   this.$set(this.filterorder,'beginDate',timeStr);
      //   this.$set(this.filterorder,'endDate',timeStr);
      //   this.startTimestamp=stamp;
      //   this.endTimestamp=stamp;
      // }
      this.showfliterPop=true;
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
 
</style>
