<template>
  <div id="box_content">
      <Header closestate historylist @historylist='$router.push({name:"history"})' title='物料申购'/>
      <div class="main_box">
          <van-cell-group class="mt_8">
            <van-cell title="申购类型" required :value="submitObj.clientClass!==null?columns[submitObj.clientClass]:'去选择'" @click="showPop('type')" is-link></van-cell>
            <van-field label="申购对象" clearable input-align='right' required v-model="submitObj.createSite" @input='getApplyObjectlist' placeholder="请输入申购对象或编号"></van-field>
             <div class="list_item" v-show="downstate">
               <div class="sanjiao"></div>
                <ul>
                  <li class="bt-b" v-for="(item,index) in Objectlist" @click="checkedObject(index)" :key="index">{{item.Value}}</li>
                </ul>
              </div>
            <van-cell title="付款方式" required @click="showPop('payment')" :value="payCheckedName?payCheckedName:'去选择'" is-link></van-cell>
            <van-cell title="申购物料" required value="去添加" is-link @click="checkedgoodsPop">
              <div v-html="showcheckedGoods"></div>
            </van-cell>
            <van-field label="备注" clearable input-align='right' v-model="submitObj.remark" right-icon="edit" placeholder="选填">
            </van-field>
          </van-cell-group>
          <van-cell-group class="mt_8">
             <van-cell title="总金额" :value="getTotal"></van-cell>
          </van-cell-group>
          <div class="clearfix pt_48 pl_16 pr_16 pb_32">
            <van-button size='large' @click="submitAddgoods" :class="['bg_EAEAEA_btn','bg_EAEAEA_active']" type="primary">立即申购</van-button>
          </div>
      </div>
      <van-popup v-model="show" position='bottom'>
        <van-picker v-if="popType=='type'" :columns="columns" @cancel='onCancel' @confirm='confirm' show-toolbar title="选择申购类型"></van-picker>
        <van-picker v-if="popType=='payment'" :columns="paymentlist" @cancel='onCancel' @confirm='confirm' show-toolbar title="选择付款方式"></van-picker>
        <van-picker v-if="popType=='quote'" :columns="quotelist" @cancel='onCancel' @confirm='confirmGoods' show-toolbar title="选择物料名称"></van-picker>
      </van-popup>

      <van-popup v-model="showcheckPop" class="fullscreenBox bg_f5f5f5" position='right'>
        <div id="box_content">
          <Header closepope @popclose='cancelGoodsPop' title='申购物料'/>
          <div class="main_box">
              <van-cell-group class="mt_8" v-for="(item,index) in orderItemForms" :key="index">
                <div class="goods_title bt-b"><span>物料{{index+1<10?'0'+(index+1):index+1}}</span><cite @click="delGoodsitem(index)"><img src="~@/components/static/img/delete@2x.png"/></cite></div>
                <van-cell title="物料名称" :value="item.materielName?item.materielName:'去选择'" @click="showCheckedgoodslist(index)" is-link></van-cell>
                <div class="goodsItem_detail clearfix" v-if="item.detail">
                  <ul>
                    <li>可供库存:{{item.detail.OnHandQty}}</li>
                    <li>包含数量：{{item.detail.PackNumber}}</li>
                    <li>辅料比例:{{item.detail.MaterielBind?item.detail.MaterielBind:'--'}}</li>
                    <li>最小购买数:{{item.detail.OrderMinQty}}</li>
                    <li>购买基数:{{item.detail.Cardinal}}</li>
                    <li>物料类型:{{item.detail.MaterielType|goodsTypeformatter}}</li>
                  </ul>
                </div>
                <van-cell title="购买数量">
                  <van-stepper :step="item.step" :min="item.min" :max='item.max' @plus='plusAdd(index)' @minus='reduce(index)' disable-input :value="item.qty"></van-stepper>
                </van-cell>
                <van-cell title="小计" :value="itemTotal(index)"></van-cell>
              </van-cell-group>

              <div class="clearfix">
                <div @click="addgoodlistTem" class="addshengou_btn"><van-icon class="mr_5" name="plus"></van-icon>添加其他物料...</div>
              </div>
          </div>
          <div class="clearfix submit_box_btn">
              <button type="button" class="text_333" style="background:white">合计:{{getTotal}}</button>
              <button @click="assistchecked" type="button" class="active">确认</button>
          </div>
        </div>
      </van-popup>

  </div>      
</template>

<script>
import {Payment,orderUserType} from '@/api/api';
import {commonMethods} from '@/mixins/common.mixin';
export default {
  name: 'home',
  mixins:[commonMethods],
  data() {
    return {
      value:'',
      show:false,
      showcheckPop:false,
      columns: orderUserType,/* 申购类型 */
      paymentlist:Payment,
      quotelist:[],/* 物料选择列表 */
      popType:'type',
      //物料类型选择
      orderItemForms:[
        {
          materielId:null,
          materielName:null,
          detail:null,
          salePrice:0,//单价
          totalAmount:0,//小计
          materielType:null,/* 面单类型 */
          materielBind:0,/* 辅料比例 */
          packNumber:0,/* 包数量 */
          qty:0,//购买量
          isGift:0,
          unitName:'',/* 单位 */
          step:0,/* 步进数量 */
          min:0,/* 最小可选量 */
          max:0/* 最大可选量 */
        }
      ],
      activeOrder:null,
      submitObj:{
        clientClass:null,/* 申购类型 */
        createSiteId:null,/* 申购对象编号 */
        createSite:null,/* 申购对象名称 */
        payType:null,/* 付款方式 */
        totalAmount:0,
        remark:''
      },
      payCheckedName:null,
      timer:null,
      downstate:false,
      Objectlist:[],
    }
  },
  created() {
    if(this.$route.query.orderagain){
      /* 获取再次申购数据,再次申购获取的数据缺少 */
      this.addAgainOrderinfo(this.$route.query.data);
    }
  },
  computed: {
    getTotal(){
      var back=0;
      var _self=this;
      for(let i=0;i<_self.orderItemForms.length;i++){
        back+=_self.orderItemForms[i].totalAmount;
      }
      _self.$set(_self.submitObj,'totalAmount',Math.floor(back * 100) / 100 );
      return '￥'+back;
    },
    itemTotal:function(){
      var _self=this;
        return function(index){
            return `￥${_self.orderItemForms[index].salePrice}*${_self.orderItemForms[index].qty}=${_self.orderItemForms[index].totalAmount}`;
        }
    },
    showcheckedGoods(){
      var _self=this,back='';
      for(let i=0;i<_self.orderItemForms.length;i++){
        if(_self.orderItemForms[i].totalAmount>0){
          back+=`<p>${_self.orderItemForms[i].materielName}×${_self.orderItemForms[i].qty}</p>`;
        }else{
          continue;
        }
      }
      if(!back){
        back='去选择';
      }
      return back;
    }
  },
  methods: {
    assistchecked(){
      /* 辅料校验 辅料数量=购买数量*包含数量*配置比例  首先需要计算出辅料的总量[也就是物料类型MaterielType是1的qty[购买量]]  */
      var assistNum=0;/* 已选辅料总量 */
      var trimsNum=0;/* 当前物料需要搭配的辅料数量 */
      var _self=this;
      /* 判断是否已经物料未选item */
       /* 判断是否有没有选择物料的栏目进行拦截提示 */
      for(let i=0;i<_self.orderItemForms.length;i++){
        if(!_self.orderItemForms[i].materielId||!_self.orderItemForms[i].detail){
          _self.$Tools.sendMessage('请补全已选物料信息！');
          return ;
        }
        /* 是否辅料 */
        if(_self.orderItemForms[i].detail.MaterielType===1){
          assistNum= _self.orderItemForms[i].qty+assistNum;
        }
        if(_self.orderItemForms[i].detail.BindFlag){
          trimsNum+=_self.orderItemForms[i].qty*_self.orderItemForms[i].packNumber*_self.orderItemForms[i].materielBind;
        }
      }

      if(assistNum<trimsNum){
        _self.$Tools.sendMessage(`当前物料需添加辅料数量${trimsNum-assistNum}！`);
        return false;
      }

      // for(let i=0;i<_self.orderItemForms.length;i++){
      //   if(_self.orderItemForms[i].detail.BindFlag){
      //     if(assistNum<trimsNum){
      //       _self.$Tools.sendMessage(`当前物料需添加辅料数量${trimsNum-assistNum}！`);
      //       return false;
      //     }
      //   }
      // }
      _self.showcheckPop=false;
    },

    submitAddgoods(){
      if(this.submitObj.clientClass===null||!this.submitObj.createSiteId||!this.submitObj.createSite||!this.submitObj.payType||!this.submitObj.totalAmount){
        this.$Tools.sendMessage('请完善申购信息后再试！');
        return ;
      }
      this.$store.dispatch('saveMaterialOrder',{
        companyCode:this.$store.state.userinfo.companyCode,
        clientClass:this.submitObj.clientClass,
        createSiteId:this.submitObj.createSiteId,
        createSite:this.submitObj.createSite,
        totalAmount:this.submitObj.totalAmount,
        payType:this.submitObj.payType,
        remark:this.submitObj.remark,
        orderItems:this.orderItemForms
      })
      .then(res=>{
        if(res.respCode==='000'){
          vant.Dialog.alert({
            title: '提示',
            message: res.resMessage
          }).then(() => {
            this.resetSubmitInfo();
          });
        }
      })
    },

    /* 重置申购单信息 */
    resetSubmitInfo(){
      this.orderItemForms=[{
        materielId:null,
        materielName:null,
        detail:null,
        salePrice:0,//单价
        totalAmount:0,//小计
        materielType:null,/* 面单类型 */
        materielBind:0,/* 辅料比例 */
        packNumber:0,/* 包数量 */
        qty:0,//购买量
        isGift:0,
        unitName:'',/* 单位 */
        step:0,/* 步进数量 */
        min:0,/* 最小可选量 */
        max:0/* 最大可选量 */
      }];
      this.submitObj={
        clientClass:null,/* 申购类型 */
        createSiteId:null,/* 申购对象编号 */
        createSite:null,/* 申购对象名称 */
        payType:null,/* 付款方式 */
        totalAmount:0,
        remark:''
      }
      this.payCheckedName=null;
    },

    confirm(value, index) {
      var _self=this;
      switch (_self.popType) {
        case 'type':
          _self.$set(_self.submitObj,'createSiteId',null);
          _self.$set(_self.submitObj,'createSite',null);
          _self.Objectlist=[];
          _self.$set(_self.submitObj,'clientClass',value.value)
          break;
        case 'payment':
          _self.$set(_self.submitObj,'payType',value.value);
          _self.payCheckedName=value.text;
          break;
        default:
          break;
      }
      this.onCancel();
    },
    confirmGoods(value, index){
      this.$set(this.orderItemForms[this.activeOrder],'materielName',value.text);
      this.$set(this.orderItemForms[this.activeOrder],'materielId',value.value);
      this.$set(this.orderItemForms[this.activeOrder],'detail',value.Detail);
      this.$set(this.orderItemForms[this.activeOrder],'salePrice',value.SalePrice);
      this.$set(this.orderItemForms[this.activeOrder],'max',value.Detail.OnHandQty);/* 设置最大可选数字,也就是库存量 */
      this.$set(this.orderItemForms[this.activeOrder],'min',value.Detail.OrderMinQty);/* 最小可选数量 */
      this.$set(this.orderItemForms[this.activeOrder],'step',value.Detail.Cardinal);/* 购买基数 */
      /* 如果库存有的话 而且value.Detail.OrderMinQty最小购买量大于 0 则把数量设为最小可选量*/
      this.$set(this.orderItemForms[this.activeOrder],'qty',value.Detail.OnHandQty?value.Detail.OrderMinQty:0);
      this.$set(this.orderItemForms[this.activeOrder],'isGift',value.Detail.GiftList.length?1:0);/* 是否有赠品 */
      this.$set(this.orderItemForms[this.activeOrder],'materielType',value.Detail.MaterielType);/* 面单类型 */
      this.$set(this.orderItemForms[this.activeOrder],'materielBind',value.Detail.MaterielBind);/* 辅料比例 */
      this.$set(this.orderItemForms[this.activeOrder],'packNumber',value.Detail.PackNumber);/* 包含数量 */
      this.$set(this.orderItemForms[this.activeOrder],'unitName',value.Detail.UnitName);/* 单位 */
      this.countItem(this.activeOrder);//当前选择的orderItemForms的索引
      this.onCancel();
    },
    /* 关闭浮选框并清空选择类目 */
    cancelGoodsPop(){
      this.orderItemForms=[{
        materielId:null,
        materielName:null,
        detail:null,
        salePrice:0,//单价
        totalAmount:0,//小计
        materielType:null,/* 面单类型 */
        materielBind:0,/* 辅料比例 */
        packNumber:0,/* 包数量 */
        qty:0,//购买量
        isGift:0,
        unitName:'',/* 单位 */
        step:0,/* 步进数量 */
        min:0,/* 最小可选量 */
        max:0/* 最大可选量 */
      }];
      this.showcheckPop=false;
    },
    countItem(index){
      this.$set(this.orderItemForms[index],'totalAmount',Math.floor(this.orderItemForms[index].salePrice*this.orderItemForms[index].qty * 100) / 100 );
    },
    onCancel() {
      this.show=false
    },
    plusAdd(index){
      var qty=this.orderItemForms[index].qty+this.orderItemForms[index].step;
      if(qty>this.orderItemForms[index].max){
        qty=this.orderItemForms[index].max;
      }
      this.$set(this.orderItemForms[index],'qty',qty);
      this.countItem(index)
    },
    reduce(index){
      var qty=this.orderItemForms[index].qty-this.orderItemForms[index].step;
      if(qty<this.orderItemForms[index].min){
        qty=this.orderItemForms[index].min;
      }
      this.$set(this.orderItemForms[index],'qty',qty);
      this.countItem(index)
    },
    getApplyObjectlist(){
      if(this.timer !== null){
        clearTimeout(this.timer);
      }
      if(this.submitObj.clientClass===null){
        this.$Tools.sendMessage('请选择申购类型！');
        return '';
      }
      if(this.submitObj.createSite===null||this.submitObj.createSite===''){
        return '';
      }
      this.timer=setTimeout(()=>{
          this.$store.dispatch('getApplyObject',
          {
            companyCode:this.$store.state.userinfo.companyCode,
            siteId:this.$store.state.userinfo.companyId,
            clientClass:this.submitObj.clientClass,
            query:this.submitObj.createSite
          })
          .then(res=>{
              if(!res.data){
                this.$Tools.sendMessage('未检索到相关内容!');
                return '';
              }
              this.downstate=true;
              this.Objectlist=res.data;
          })
        },500)
    },
    checkedObject(index){
      this.$set(this.submitObj,'createSiteId',this.Objectlist[index].Key);
      this.$set(this.submitObj,'createSite',this.Objectlist[index].Value);
      this.downstate=false;
      this.Objectlist=[];
    },
    checkedgoodsPop(){
      if(this.submitObj.clientClass===null||this.submitObj.createSiteId===null){
        this.$Tools.sendMessage('请选择申购类型或申购对象！');
        return false;
      }
      this.showcheckPop=true;
    },
   showPop(type){
      var _self=this;
        _self.popType=type;
        _self.show=true;
    },
    showCheckedgoodslist(index){
      this.getquotelist();
      this.popType='quote';
      this.activeOrder=index;
    },
    async getquotelist(){
      if(this.submitObj.clientClass===null||this.submitObj.createSiteId===null){
        this.$Tools.sendMessage('请选择申购类型或申购对象！');
        return false;
      }
      await this.$store.dispatch('getquoteList',{
        companyCode:this.$store.state.userinfo.companyCode,
        clientClass:this.submitObj.clientClass,
        createSiteId:this.submitObj.createSiteId
        })
      .then(res=>{
        if(res.data&&res.data.length){
          this.quotelist=this.formatterPicker(res.data);
          this.show=true;
        }else{
          this.$Tools.sendMessage('未检索到相关数据！');
        }
      })
    },
    formatterPicker(data){
      var back=[];
      for( let i=0; i<data.length;i++){
        back.push({text:data[i].MaterielName,value:data[i].MaterielId,SalePrice:data[i].SalePrice,Detail:data[i].Detail});
      }
      return back;
    },
    delGoodsitem(index){
      this.orderItemForms.splice(index,1);
    },
    addgoodlistTem(){
      var _self=this;
      /* 判断是否有没有选择物料的栏目进行拦截提示 */
      for(let i=0;i<_self.orderItemForms.length;i++){
        if(!_self.orderItemForms[i].materielId||!_self.orderItemForms[i].detail){
          _self.$Tools.sendMessage('请补全已选物料信息！');
          return ;
        }
      }
      this.orderItemForms.push({
        materielId:null,
        materielName:null,
        detail:null,
        salePrice:0,//单价
        totalAmount:0,//小计
        materielType:null,/* 面单类型 */
        materielBind:0,/* 辅料比例 */
        packNumber:0,/* 包数量 */
        qty:0,//购买量
        isGift:0,
        unitName:'',/* 单位 */
        step:0,/* 步进数量 */
        min:0,/* 最小可选量 */
        max:0
      });
    },
    /* 再次申购信息补充 */
    addAgainOrderinfo(data){
      this.resetSubmitInfo();
      this.submitObj={
        clientClass:data.ClientClass,
        createSiteId:data.CreateSiteId,
        createSite:data.CreateSite,
        payType:data.PayType,
        totalAmount:data.TotalAmount,
        remark:data.Remark?data.Remark:''
      }
      for(let i=0;i<Payment.length;i++){
        if(Payment[i].value==data.PayType){
          this.payCheckedName=Payment[i].text;
          break;
        }else{
          continue;
        }
      }

      /* 附加物料选择类目 */
      var orderItem=data.OrderItem;
      if(orderItem.length){
          var back=[];
          for(let i=0;i<orderItem.length;i++){
            back.push({
              materielId:orderItem[i].MaterielId,
              materielName:orderItem[i].MaterielName,
              detail:null,
              salePrice:orderItem[i].SalePrice,//单价
              totalAmount:Math.floor(orderItem[i].SalePrice*orderItem[i].Qty * 100) / 100,//小计
              materielType:orderItem[i].MaterielType,/* 面单类型 */
              materielBind:0,/* 辅料比例 */
              packNumber:orderItem[i].PackNumber,/* 包数量 */
              qty:orderItem[i].Qty,//购买量
              isGift:orderItem[i].IsGift,
              unitName:orderItem[i].UnitName?orderItem[i].UnitName:'',/* 单位 */
              step:0,/* 步进数量 */
              min:0,/* 最小可选量 */
              max:0/* 最大可选量 */
            })
          }
          this.orderItemForms=back;
      } 
    }
  }
}
</script>
<style scoped>
  .van-cell--required::before{
    color: #1DCBAC;
  }
  .goodsItem_detail{
    background: #F5F5F5;
    padding: 10px 0px;
  }
  .goodsItem_detail ul{
    width: 100%;
    display: flex;
    flex-flow: wrap-reverse row;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
  }
  .goodsItem_detail ul li{
    width: 50%;
    color: #666;
    font-size: 12px;
    box-sizing: border-box;
    padding: 8px 15px;
  }
  .goodsItem_detail ul li:nth-child(2n){
    text-align: right;
  }
  .goods_title{
    box-sizing: border-box;
    padding: 0px 16px;
    height: 40px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .goods_title span{
    border-left: #1DCBAC 2px solid;
    padding-left: 8px;
    font-size: 14px;
    color: #999999
  }
  .goods_title cite{
    flex: 0.4;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
  }
  .goods_title cite img{
    display: inline-block;
    height: 14px;
  }

  .addshengou_btn{
    display: flex;
    flex-flow: nowrap row;
    justify-content: center;
    align-items: center;
    margin: 24px 16px;
    border: 1px #1DCBAC solid;
    border-radius: 3px;
    -webkit-border-radius:3px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
    color: #1DCBAC;
}

</style>
