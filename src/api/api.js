/*静态常量*/
// export const BASE_URL='https://appsys.sto.cn/'/*生产环境*/;
// export const BASE_URL='http://192.168.124.208:8080/';/*内网*/
export const BASE_URL='http://222.72.44.130:19999/';/*对应外网测试*/

export const APP_ID='app';
export const APP_SOURCE='jn';
export const APP_CLIENTTYPE='h5';

export const PageApi={
  /* 获取申购对象 */ 
  getApplyObject:'/face-jn/material/getApplyObject',
  /* 获取物料报价 */
  quoteList:'/face-jn/material/materialQuoteList',
  /* 获取物料详细信息接口 */
  getMaterialInfo:'/face-jn/material/getMaterialInfo',
  /* 添加申购单接口 */
  saveMaterialOrder:'/face-jn/material/saveMaterialOrder',
  /* 申购记录 */
  Orderhistroy:'/face-jn/material/materielOrderApplyPager',
  /* 申购单处理接口 */
  MaterielOrder:'/face-jn/material/handleMaterielOrder',
  /* 模糊查找网点或者承包区 */
  SearchNetforParent:'/face-app/basicInfo/searchOrganizeByIndistinct',
  /* 再次申购 */
  againOrder:'/face-jn/material/reApplyMaterielOrder',
  /* 物料审核列表 */
  Materielauditlist:'/face-jn/material/getMaterielOrderAuditPager',
  /* 有申购出库列表查询接口 */
  OutStockPager:'/face-jn/material/getMaterielOutStockPager',
  /* 申购单出库接口 */
  OutStock:'/face-jn/material/saveConfigOutStock',
  /* 直接出库列表 */
  plank:'/face-jn/material/getMaterielOutStock',
  /* 物料模糊查询接口 */
  querySearchgoods:'/face-jn/material/search',
  /* 物料出库登记 */
  registerGoods:'/face-jn/material/saveOutStockRegister'

}

/* 支付方式 */
export const Payment=[
  {'text':'现金','value':'1001'},
  {'text':'转帐','value':'1002'},
  {'text':'预付款','value':'1003'},
  {'text':'内部领用','value':'1004'},
  {'text':'月结','value':'1005'},
  {'text':'赊购','value':'1006'},
]

/* 申购类型 */
export const orderUserType=[{text:'网点',value:'0'},{text:'业务员',value:'1'},{text:'客户',value:'2'}];

/* 订单状态 订单状态 0:未审 1:审核 2:取消 3:作废 4:退回  默认为不选择，代表全部-1 */
export const orderState=[{text:'全部',value:-1},{text:'未审',value:0},{text:'审核',value:1},{text:'取消',value:2},{text:'作废',value:3},{text:'退回',value:4}];

/* provflag发放状态 */
export const provFlagstate=[
  {text:'全部',value:-1},
  {text:'未发放完毕',value:0},
  {text:'已发放完毕',value:1},
];

/* 物料审核查询日期类型 */
export const searchDateType=[
  {text:'申购时间',value:'1'},
  {text:'审核时间',value:'2'},
];


/*通用接口*/
export const Common_API={

  /*上传文件生产域名*/
  uploadUrl:'https://appfileupload.sto.cn/',
  // uploadUrl:'http://222.72.44.130:8092/',/*内网测试上传域名*/
  //   uploadUrl:'http://192.168.124.208:8092/',/*内网域名*/

  /*根据父id来检索行政区*/
  Chinaarealist:'region/searchByParentId/',

  /*快速检索组织机构*/
  SearchBaseOrganize:'face-app/basicInfo/fuzzySearchBaseOrganizeFromEs',


  /*上传图片api*/
  uploadPic:'upload/picture',

  uploadfile:'upload/file',/*上传文件*/

  /*组装的外网域名*/
  netUrl:'https://appfiledownload.sto.cn/',/*生产*/
  // netUrl:'http://222.72.44.130:22222/dfs/',/*测试*/


}














