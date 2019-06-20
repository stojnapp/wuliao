<<template>
    <div id="box_content">
        <Header backstate title='物料出库'></Header>
         <div class="main_box">
            <van-cell-group class="mt_8">
                <van-cell title="所属网点" :value="filterorder.siteName"></van-cell>
                <van-cell title="申购类型" required :value="checkedType?checkedType:'去选择'" @click="showPicker=true" is-link></van-cell>
                <van-field label="申购对象" clearable input-align='right' @input='getApplyObjectlist' v-model="queryIndex" right-icon="edit" placeholder="请输入申购对象或编号"></van-field>
                <div class="list_item" v-show="Objectstate">
                    <div class="sanjiao"></div>
                    <ul>
                        <li class="bt-b" v-for="(item,index) in Objectlist" @click="checkedObject(index)" :key="index">{{item.Value}}</li>
                    </ul>
                </div>
                <van-field label="物料品名" clearable input-align='right' v-model="checkegoodsname" @input='getgoodslist' right-icon="edit" placeholder="请输入物料品名"></van-field>
                <div v-if="detailstate" class="clearfix goodsitem bg_f5f5f5 pr_16 pl_16 pt_8">
                    <template v-if='goodsdetailinfo'>
                        <span>可供库存:{{goodsdetailinfo.OnHandQty}}</span>
                        <span>计数单位:{{goodsdetailinfo.UnitName}}</span>
                    </template>
                </div>
                <div class="list_item" v-show="goodsstate">
                    <div class="sanjiao"></div>
                    <ul>
                        <li class="bt-b" v-for="(item,index) in goodslist" @click="checkedgoods(item)" :key="index">{{item.MaterielName}}</li>
                    </ul>
                </div>
            </van-cell-group>
            <van-cell-group class="mt_8">
                <van-field label="出库数量" clearable input-align='right' required v-model="filterorder.outQty" placeholder="请输入出库数量" right-icon="edit"></van-field>
                <van-field label="备注" clearable input-align='right' v-model="filterorder.remark" right-icon="edit" placeholder="选填">
                </van-field>
            </van-cell-group>
            <div class='clearfix mt_32 pr_16 pl_16'>
                <van-button size="large" block type="primary" @click='submiteInfo' style='background:#1DCBAC;border-color:#1DCBAC'>确认出库</van-button>
            </div>
        </div>
         <van-popup v-model="showPicker" position="bottom" overlay>
             <van-picker :columns="orderUserTypecolumns" @cancel='showPicker=false' @confirm='onConfirm' show-toolbar title="选择申购类型"></van-picker>
         </van-popup>
    </div>
</template>
<script>
import {orderUserType,orderState,searchDateType} from '@/api/api';
export default {
    data(){
        return{
            filterorder:{
                siteId:this.$store.state.userinfo.companyId,
                companyCode:this.$store.state.userinfo.companyCode,
                siteName:this.$store.state.userinfo.companyName,
                clientClass:null,
                belongSiteId:null,
                belongSiteName:null,
                materielId:null,
                outQty:0,
                remark:null
            },
            detailstate:false,
            goodsdetailinfo:null,
            orderUserTypecolumns:orderUserType,
            showPicker:false,
            queryIndex:null,
            timerObj:null,
            timergoods:null,
            Objectstate:false,
            Objectlist:[],
            checkegoodsname:null,
            goodsstate:false,
            goodslist:[],
            checkedType:null,
        }
    },
    methods: {
        onConfirm(value){
            var _self=this;
            _self.$set(_self.filterorder,'clientClass',value.value);
            _self.checkedType=value.text;
            _self.showPicker=false
        },
        checkedgoods(item){
            this.goodsdetailinfo=item;
            this.$set(this.filterorder,'materielId',item.MaterielId);
            this.checkegoodsname=item.MaterielName;
            this.goodsstate=false;
            this.detailstate=true;
        },
        submiteInfo(){
            if(!this.filterorder.clientClass){
                this.$Tools.sendMessage('请选择申购类型!');
                return '';
            }
            if(!this.filterorder.belongSiteId){
                this.$Tools.sendMessage('请选择申购对象!');
                return '';
            }
            if(!this.filterorder.materielId){
                this.$Tools.sendMessage('请选择物料品名!');
                return '';
            }
            var r = /^[1-9]([0-9]+)?$/;　　//正整数
            var flag=r.test(String(this.filterorder.outQty));
            if(!flag){
                this.$Tools.sendMessage('出库数量必须为正整数且出库数量不得为0,请检查数字格式是否有误!');
                return '';
            }
            // if(!parseInt(this.filterorder.outQty)){
            //     this.$Tools.sendMessage('出库数量不得为0!');
            //     return '';
            // }
            this.$store.dispatch('doneRegistergoods',this.filterorder)
            .then(res=>{
                if(res){
                   vant.Toast.success(res.resMessage);
                    this.resetdata()
                }
            })
        },
        resetdata(){
            this.checkegoodsname=null;
            this.checkedType=null;
            this.detailstate=false;
            this.goodsdetailinfo=null;
            this.queryIndex=null;
            this.filterorder={
                siteId:this.$store.state.userinfo.companyId,
                companyCode:this.$store.state.userinfo.companyCode,
                siteName:this.$store.state.userinfo.companyName,
                clientClass:null,
                belongSiteId:null,
                belongSiteName:null,
                materielId:null,
                outQty:0,
                remark:null
            }
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
        checkedObject(index){
            this.$set(this.filterorder,'belongSiteId',this.Objectlist[index].Key);
            this.$set(this.filterorder,'belongSiteName',this.Objectlist[index].Value);
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
    },
}
</script>

<style scoped>
.van-cell--required::before{
    color: #1DCBAC;
  }
  .goodsitem{
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: flex-start;
  }
  .goodsitem span{
      flex: 0.5;
      font-size: 12px;
      color: #666;
  }
</style>
