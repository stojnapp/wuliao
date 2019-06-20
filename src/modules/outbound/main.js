
import 'babel-polyfill'
import App from './App.vue'
import store from '@/store/store'
import router from './router'
import * as FastClick from "fastclick"
import Header from '@/components/common/header.vue'
import {vantTool} from '@/functions/commonTools';
import check from '@/functions/checkformat';
Vue.prototype.$Tools = vantTool;
Vue.prototype.$Check = check;
import Nodate from '@/components/common/nodata.vue'
Vue.component('Nodate', Nodate)
import JsBridg from '@/functions/bridge'
Vue.prototype.$bridge = JsBridg
Vue.config.productionTip = false
Vue.component('Header',Header);
FastClick.attach(document.body)
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
