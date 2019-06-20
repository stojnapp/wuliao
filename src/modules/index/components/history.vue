<!--申购记录-->
<template>
    <div id="box_content">
        <Header backstatedefine @backdefined="$router.push({name:'home'})" filter @filter='showfilterPoplayer' title='申购记录'/>
        <div class="main_box">
            <Nodate v-show="nodata"></Nodate>
            <van-list
            v-show="!nodata"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getHistoryList"
            :immediate-check='false'
             style="height:100%;width:100%;overflow-y:auto"
            >
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
                
                <template v-if="item.OrderStatus===0">
                     <dt><cite @click="cancelOrder(item.OrderId)" class="text_999">取消</cite></dt>
                </template>
                <!-- 取消再次申购 -->
                <!-- <dt>
                    <template v-if="item.OrderStatus===0">
                        <cite @click="cancelOrder(item.OrderId)" class="text_999">取消</cite>
                        <cite @click="angainOrder(item.OrderId)" class="text_CBAC">再次申购</cite>
                    </template>
                    <template v-else>
                        <div @click="angainOrder(item.OrderId)" style="flex:1;" class="f_16 text_CBAC text_c">再次申购</div>
                    </template>
                </dt> -->
            </dl>
            </van-list>
        </div>

        <!--filter_fullpage-->
        <van-popup v-model="show" class="fullscreenBox bg_f5f5f5" position="right">
            <Header closepope @popclose='show=false' title='条件筛选'/>
            <van-cell-group class="bg_white">
                <van-cell title="开始时间" :value="filterlist.beginDate?filterlist.beginDate:'去选择'" @click="showPickerState('start')" is-link></van-cell>
                <van-cell title="结束时间" :value="filterlist.endDate?filterlist.endDate:'去选择'"  @click="showPickerState('end')" is-link></van-cell>
            </van-cell-group>
            <van-cell-group class="bg_white mt_8">
                <van-field label="所属网点" clearable :disabled='disabled' input-align='right' v-model="searchindex" @input='getNetinfoIndex' placeholder="请输入网点名称或编号" right-icon="edit"></van-field>
                <div class="list_item" v-show="downstate">
                    <div class="sanjiao"></div>
                    <ul>
                        <li class="bt-b" v-for="(item,index) in netlist" @click="checkedNet(item.id,item.fullName)" :key="index">{{item.fullName}}</li>
                    </ul>
                </div>
            </van-cell-group>
            <van-cell-group class="bg_white mt_8">
                <van-cell title="申购类型" :value="checkedType?checkedType:'去选择'" @click="showPickerState('type')" is-link></van-cell>
                <van-field label="申购对象" clearable input-align='right' @input='getApplyObjectlist' v-model="queryIndex" right-icon="edit" placeholder="请输入申购对象或编号"></van-field>
                <div class="list_item" v-show="Objectstate">
                    <div class="sanjiao"></div>
                    <ul>
                         <li class="bt-b" v-for="(item,index) in Objectlist" @click="checkedObject(index)" :key="index">{{item.Value}}</li>
                    </ul>
                </div>
                <van-field label="申购单号" clearable input-align='right' v-model="filterlist.applyId" right-icon="edit" placeholder="选填">
                </van-field>
            </van-cell-group>
            <van-cell-group class="bg_white mt_8">
                <van-cell title="审核状态" :value="checkedOrderstate?checkedOrderstate:'去选择'" @click="showPickerState('orderstate')" is-link></van-cell>
                <van-cell title="出库状态" :value="checkedprovtate?checkedprovtate:'去选择'" @click="showPickerState('provstate')" is-link></van-cell>
            </van-cell-group>
            <div class="clearfix submit_box_btn">
                <button type="button" @click="cancelFilter">取消</button>
                <button type="button" @click.stop="getFilterlist()" class="active">确认</button>
            </div>
        </van-popup>

        <van-popup v-model="showPicker"  position="bottom">
            <van-datetime-picker v-if="dateType=='start'||dateType=='end'"  v-model="currentDate" type="date" show-toolbar  @cancel="showPicker=false;" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>
            <van-picker v-if="dateType=='type'" :columns="columns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择申购类型"></van-picker>
            <van-picker v-if="dateType=='orderstate'" :columns="orderstatecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择订单状态"></van-picker>
            <van-picker v-if="dateType=='provstate'" :columns="provstatecolumns" @cancel='onCancel' @confirm='onConfirm' show-toolbar title="选择发放状态"></van-picker>
        </van-popup>

    </div>
</template>
<script>
import {commonMethods} from '@/mixins/common.mixin';
import {Payment,orderUserType,orderState,provFlagstate} from '@/api/api';
import { fail } from 'assert';
export default {
    name:'histroy',
    mixins:[commonMethods],
    data () {
        return {
            minDate: new Date(new Date().getFullYear() - 1, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(),
            dateType:'',
            Objectstate:false,
            Objectlist:[],
            queryIndex:'',
            columns: orderUserType,/* 申购类型 */
            orderstatecolumns:orderState,/* 订单状态  */
            provstatecolumns:provFlagstate,/* 发放状态 */
            showmore:null,
            show:false,
            showPicker:false,
            downstate:false,
            netlist:[],
            searchindex:this.$store.state.userinfo.companyName,
            timer:null,
            timerObj:null,
            disabled:true,
            filterlist:{
                companyCode:this.$store.state.userinfo.companyCode,
                beginDate:null,
                endDate:null,
                belongSiteId:this.$store.state.userinfo.companyId,
                clientClass:null,
                CreateSiteId:null,
                applyId:null,
                pageIndex:1,
                pageSize:20,
                orderStatus:-1,
                provflag:-1
            },
            startTimestamp:null,
            endTimestamp:null,
            list:[],
            loading: false,
            finished: false,
            nodata:false,
            pickertype:'',
            checkedType:'',
            checkedOrderstate:'全部',
            checkedprovtate:'全部',
        }
    },
    created() {
        this.getHistoryList();
    },
    mounted () {
        if(this.$store.state.userinfo.companyCategoryCode==='独立网点'){
            this.disabled=false;
        }
    },
    methods:{
        /* 清空申购对象 */
        clearobject(){
            this.$set(this.filterlist,'CreateSiteId',null);
            this.queryIndex='';
            this.Objectstate=false;
            this.Objectlist=[];
        },
        showfilterPoplayer(){
            if(!this.filterlist.beginDate||!this.filterlist.endDate){
                var TimeObj=new Date();
                    TimeObj.setHours(0,0,0,0)
                    var stamp=TimeObj.getTime();
                    var timeStr=this.$Check.gettimeformate(TimeObj)
                this.startTimestamp=stamp;
                this.endTimestamp=stamp;
                this.$set(this.filterlist,'beginDate',timeStr);
                this.$set(this.filterlist,'endDate',timeStr);
            }
            this.show=true;
        },
        checkedNet(belongSiteId,name){
            this.clearobject();
            this.$set(this.filterlist,'belongSiteId',belongSiteId);
            this.searchindex=name;
            this.downstate=false;
        },
        checkedObject(index){
            this.$set(this.filterlist,'CreateSiteId',this.Objectlist[index].Key);
            this.queryIndex=this.Objectlist[index].Value;
            this.Objectstate=false;
            this.Objectlist=[];
        },
        getApplyObjectlist(){
            if(this.timerObj !== null){
                clearTimeout(this.timerObj);
            }
            if(this.filterlist.clientClass===null){
                this.$Tools.sendMessage('请选择申购类型！');
                return '';
            }
            if(!this.queryIndex){
                return '';
            }
            this.timerObj=setTimeout(()=>{
                this.$store.dispatch('getApplyObject',
                {
                    companyCode:this.filterlist.companyCode,
                    siteId:this.filterlist.belongSiteId,
                    clientClass:this.filterlist.clientClass,
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

        cancelFilter(){
            this.checkedOrderstate='全部';
            this.checkedprovtate='全部';
            this.startTimestamp=null;
            this.endTimestamp=null;
            this.filterlist.beginDate=null;
            this.filterlist.endDate=null;
            this.filterlist.clientClass=null;
            this.filterlist.CreateSiteId=null;
            this.filterlist.applyId=null;
            this.filterlist.orderStatus=-1;
            this.filterlist.provflag=-1;
            this.resetList()
            this.show=false;
            this.getHistoryList();
        },

        /* 根据检索信息提交查询 */
        getFilterlist(){
            var stamp=this.endTimestamp-this.startTimestamp;
            if(stamp<0){
                this.$Tools.sendMessage('结束日期不得小于开始日期！');
                return false;
            }
            if(!this.filterlist.belongSiteId){
                this.$Tools.sendMessage('所属网点不得为空！');
                return false;
            }
            if(this.filterlist.clientClass===null){
                this.$Tools.sendMessage('请选择申购类型！');
                return false;
            }
            if(!this.filterlist.CreateSiteId){
                this.$Tools.sendMessage('请选择申购对象！');
                return false;
            }
            this.resetList();
            this.getHistoryList();
            this.show=false;
        },
        showPickerState(pickertype){
            this.dateType=pickertype;
            this.showPicker=true;
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
                    _self.$set(_self.filterlist,'beginDate',timeStr);
                    break;
                case 'end':
                    _self.endTimestamp=stamp;
                    _self.$set(_self.filterlist,'endDate',timeStr);
                    break;
                case 'type':
                    _self.clearobject();
                    _self.$set(_self.filterlist,'clientClass',value.value);
                    _self.checkedType=value.text;
                    break;
                case 'orderstate':
                    _self.$set(_self.filterlist,'orderStatus',value.value);
                    _self.checkedOrderstate=value.text;
                    break;
                case 'provstate':
                    _self.$set(_self.filterlist,'provflag',value.value);
                    _self.checkedprovtate=value.text;
                    break;
            }
            this.showPicker=false;
        },

        cancelOrder(orderId){
            vant.Dialog.confirm({
            title: '提示',
            message: '是否取消此次物料申购?'
            }).then(() => {
                this.$store.dispatch('MaterielOrder',{orderId,companyCode:this.$store.state.userinfo.companyCode,status:'CANCEL',remark:null})
                .then(res=>{
                    if(res.respCode==='000'){
                        this.$Tools.sendMessage(res.resMessage);
                        this.resetList();
                        this.getHistoryList();
                    }else{
                       this.$Tools.sendMessage('取消失败,请重新再试！'); 
                    }
                })
            }).catch(() => {});
        },
        angainOrder(orderId){
            this.$store.dispatch('againOrder',{orderId,companyCode:this.$store.state.userinfo.companyCode})
            .then(res=>{
                if(res.respCode==='000'){
                    this.$router.push({path:'/',query:{orderagain:true,data:res.data}})
                }else{
                   this.$Tools.sendMessage('再次申购失败,请重新再试！');  
                }
            })
        },
        resetList(){
            this.list=[];
            this.loading=false;
            this.finished=false;
            this.nodata=false;
            this.$set(this.filterlist,'pageIndex',1);
        },
        listShowmore(index){
            this.showmore=index==this.showmore?null:index;
        },

        getHistoryList(){
            var pagesize=this.filterlist.pageSize;
            this.$store.dispatch('getOrderhistroy',this.filterlist)
            .then(res=>{
                this.loading = false;
                if(this.filterlist.pageIndex===1){
                    if(res.data.Rows.length===0){
                        this.finished=true;
                        this.nodata=true;
                    }else if(res.data.Rows.length<pagesize){
                        this.list=res.data.Rows;
                        this.finished=true;
                    }else{
                        this.list=res.data.Rows;
                        this.$set(this.filterlist,'pageIndex',this.filterlist.pageIndex+1)
                    }
                }else{
                    if(res.data.Rows.length===0){
                        this.finished=true;
                    }else if(res.data.Rows.length<pagesize){
                        this.list=this.list.concat(res.data.Rows);
                        this.finished=true;
                    }else{
                        this.list=this.list.concat(res.data.Rows);
                        this.$set(this.filterlist,'pageIndex',this.filterlist.pageIndex+1)
                    }
                }
            })
        }
    }

}
</script>
<style type='text/css' scoped>
@import url('../css/history.css');
</style>
