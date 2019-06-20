<template>
  <div id="app">
    <router-view v-if="show"></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  data(){
    return {
      show:false
    }
  },
  created (){
      var _self=this;
      /*获取登录信息*/
      this.$bridge.callHandler(
        'submitFromWeb'
        , ''
        , (responseData) => {
          let data1 = JSON.parse(responseData)
          this.$store.commit('saveLogininfo',data1.loginResp.employee);
          this.show=true;
        }
      );
  },
}
</script>
<style type="text/css">
@import '~assets/css/reset.css';
@import '~assets/css/common.css';
</style>


