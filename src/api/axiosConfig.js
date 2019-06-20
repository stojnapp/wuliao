import {BASE_URL,APP_SOURCE,APP_CLIENTTYPE} from './api'

// 使用代理的时候关闭baseurl
const axiosConfig = {
  baseURL: BASE_URL,/*测试接口地址*/
  retry: 1,
  retryDelay: 4000,
  timeout: 20000,
  withCredentials:true,
  headers: {'Content-Type': 'application/json','source':APP_SOURCE,'clientType':APP_CLIENTTYPE},
  // headers: {'Content-Type': 'application/json','isSKip':true,'appId':'app','source':APP_SOURCE,'clientType':APP_CLIENTTYPE},
};
export default axiosConfig
