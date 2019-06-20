
const mutations={
  setPhoneNum:function (state,num) {
    state.phone=num;
  },
  setOpenid:function(state,Openid){
    state.openId=Openid;
  },
  hasNowrecord:function (state,obj) {
    state.hasrecord=obj;
  },
  setjdk:function(state,obj){
    state.wxjdk=obj;
  },
  /*记录登录信息*/
  saveLogininfo(state,obj){
    state.userinfo=obj;
  },
}
export default mutations
