import functions from "../functions/function";
import {vantTool} from '../functions/commonTools';
const rootUrl=require('../api/api');
const action={

    /* 获取申购对象 */
    getApplyObject(context,{companyCode,siteId,clientClass,query}){
        return functions.requestHttpMethods(rootUrl.PageApi.getApplyObject,{companyCode,siteId,clientClass,query},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },
    /* 获取物料报价 */
    getquoteList(context,{companyCode,clientClass,createSiteId}){
        return functions.requestHttpMethods(rootUrl.PageApi.quoteList,{companyCode,clientClass,createSiteId},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },

    /* 获取物料详细信息接口 */
    getMaterialInfo(context,{companyCode,priceId,createSiteId}){
        return functions.requestHttpMethods(rootUrl.PageApi.getMaterialInfo,{companyCode,priceId,createSiteId},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },
    /* 添加申购单接口 */
    saveMaterialOrder(context,{companyCode,clientClass,createSiteId,createSite,totalAmount,payType,remark,orderItems}){
        return functions.requestHttpMethods(rootUrl.PageApi.saveMaterialOrder,{companyCode,clientClass,createSiteId,createSite,totalAmount,payType,remark,orderItems},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },

    /* 查询申购记录 */
    getOrderhistroy(context,{companyCode,beginDate,endDate,belongSiteId,clientClass,CreateSiteId,applyId,pageIndex,pageSize,orderStatus,provflag}){
        return functions.requestHttpMethods(rootUrl.PageApi.Orderhistroy,{companyCode,beginDate,endDate,belongSiteId,clientClass,CreateSiteId,applyId,pageIndex,pageSize,orderStatus,provflag},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },



    /* 根据父级code来检索网点 */
    searchNetwithparent(context,{parentCode,categoryCodeArray,index}){
        return functions.requestHttpMethods(rootUrl.PageApi.SearchNetforParent,{parentCode,categoryCodeArray,index},'get',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },


    /* 订单处理 */
    MaterielOrder(context,{orderId,companyCode,status,remark}){
        return functions.requestHttpMethods(rootUrl.PageApi.MaterielOrder,{orderId,companyCode,status,remark},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },


    /* 再次申购 */
    againOrder(context,{companyCode,orderId}){
        return functions.requestHttpMethods(rootUrl.PageApi.againOrder,{companyCode,orderId},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        }) 
    },

    /* 物料审核列表 */
    getMaterielauditlist(context,{searchDateType,beginDate,endDate,belongSiteId,clientClass,createSiteId,id,payType,orderStatus,provflag,companyCode,pageIndex,pageSize}){
        return functions.requestHttpMethods(rootUrl.PageApi.Materielauditlist,{searchDateType,beginDate,endDate,belongSiteId,clientClass,createSiteId,id,payType,orderStatus,provflag,companyCode,pageIndex,pageSize},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },

    /* 有申购出库列表查询接口 */
    getOutStockPager(context,{beginDate,endDate,siteId,clientClass,createSiteId,id,provflag,companyCode,pageIndex,pageSize}){
        return functions.requestHttpMethods(rootUrl.PageApi.OutStockPager,{beginDate,endDate,siteId,clientClass,createSiteId,id,provflag,companyCode,pageIndex,pageSize},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },

    /* 申购单出库 */
    doneOutStock(context,{orderId,companyCode}){
        return functions.requestHttpMethods(rootUrl.PageApi.OutStock,{orderId,companyCode},'get',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },

    /* 直接出库列表查询 */
    getPlanklist(context,{beginDate,endDate,siteId,clientClass,belongSiteId,materielId,orderId,companyCode,pageIndex,pageSize}){
        return functions.requestHttpMethods(rootUrl.PageApi.plank,{beginDate,endDate,siteId,clientClass,belongSiteId,materielId,orderId,companyCode,pageIndex,pageSize},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },

    /* 物料模糊查询接口 */
    searchQuerygoods(context,{siteId,companyCode,materielName,hasStock=true}){
        return functions.requestHttpMethods(rootUrl.PageApi.querySearchgoods,{siteId,companyCode,materielName,hasStock},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    },

    /* 物料出库登记 */
    doneRegistergoods(context,{siteId,companyCode,siteName,clientClass,belongSiteId,belongSiteName,materielId,outQty,remark}){
        return functions.requestHttpMethods(rootUrl.PageApi.registerGoods,{siteId,companyCode,siteName,clientClass,belongSiteId,belongSiteName,materielId,outQty,remark},'post',true)
        .then(res=>{
            if(res.respCode=='000'){
                return Promise.resolve(res)
            }else{
                vantTool.sendMessage(res.resMessage);
            }
        })
    }


}
export default action;
