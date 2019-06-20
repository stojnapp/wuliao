/*
  name@公共方法
  data@2018/04/08
  author@344822559@qq.com
*/

// import MD5 from "md5";
var MD5 = require('md5.js');
// import CryptoJS from 'crypto-js';
// import Axios from 'axios';
// import Jsonp from 'jsonp'
import AxiosConfig from '../api/axiosConfig'
import qs from 'qs';
// import Checks from './checkformat';
import store from '../store/store'
import {vantTool} from './commonTools';

import {PageApi} from '../api/api'




const functions={



  /*获取时间戳*/
  gettimestap:()=>{
    return new Date().getTime()
  },

  /*随机字符串*/
  randomChar:(len)=> {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },

  /*签名*/
  getsignature(secretKey,timestamp,nonce,content){
    return this.createdMd5(secretKey + timestamp + nonce + content);
  },

  setStore: (name, content)=>{
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
  },

  getStore : name => {
    if (!name) return false;
    return window.localStorage.getItem(name);
  },


  removeStore : name => {
    if (!name) return;
    window.localStorage.removeItem(name);
  },


  setsessionStore : (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
  },

  getsessionStore : name => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
  },

  removesessionStore : name => {
    if (!name) return;
    window.sessionStorage.removeItem(name);
  },


  createdMd5 : args => {
    args = args.toString(); /*转字符串*/
    let md5stream = new MD5();
    return md5stream.update(args).digest('hex');
  },

  /*数据序列化*/
  serializationData:obj=>{
    return qs.stringify(obj)
  },

  /*axios*/
  requestHttpMethods(url,data,HttpMethod='post',isloading=false,commonParam=true,config=AxiosConfig){
    if(isloading)vantTool.showloading('正在加载中...');
    let formatHttp=HttpMethod.toLowerCase();
    var formatDate=commonParam?Object.assign({},commonParam,data):data;
    if(formatHttp=='get'){
      formatDate={params:formatDate};
    }

    /*拦截header头,在此处可以调用vuex里的值*/
    // config.headers['Authorization']='Bearer '+store.state.token;
    config.headers['userId']=store.state.userinfo.id;
    var instance = axios.create(config);
    let HttpSendType=formatHttp=='post'?instance.post:instance.get;
    return HttpSendType(url,formatDate).then(res=>{
      if(isloading)vantTool.closeMessage();
      return Promise.resolve(res.data)
    })
      .catch(err=>{
        vantTool.sendMessage(err,3)
      })
  },


  //设置cookie
  setCookie(c_name,value,expiredays)
  {
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
  },

  //取回cookie
  getCookie(c_name)
  {
    if (document.cookie.length>0)
      {
      var c_start=document.cookie.indexOf(c_name + "=")
      if (c_start!=-1)
        { 
        c_start=c_start + c_name.length+1 
        var c_end=document.cookie.indexOf(";",c_start)
        if (c_end==-1) c_end=document.cookie.length
        return unescape(document.cookie.substring(c_start,c_end))
        } 
      }
    return ""
  },

  /*获取当前元素的兄弟元素*/
  getCurrtParentNode(ev){
    ev.target.style.display='none';
    ev.target.nextElementSibling.focus();
  },
  /*del首页加载动画*/
  DelLoading(){
    var parent=document.getElementById("Loading");
    if(parent){
      parent.parentNode.removeChild(parent);
    }
  },


  getFormatterTime(){
		var time=new Date();
		var year=time.getFullYear();
		var month=time.getMonth()+1;
			month=month<10?'0'+month:month;
		var day=time.getDate();
			day=day<10?'0'+day:day;
			
		var hour=time.getHours();
			hour=hour<10?'0'+hour:hour;
		var minte=time.getMinutes();
			minte=minte<10?'0'+minte:minte;
		var seconds=time.getSeconds();
			seconds=seconds<10?'0'+seconds:seconds;
			
    return year+'-'+month+'-'+day+' '+hour+':'+minte+':'+seconds;
	
	},

  //获取完整网址
  getAllUrl(pathname=''){
    var Locations=window.location;
    // return Locations.protocol+'//'+Locations.host+Locations.pathname+Locations.hash;
    pathname=pathname==''||!pathname?Locations.pathname:pathname;
    return Locations.protocol+'//'+Locations.host+pathname;
  },
  

  /*针对tree处理数据*/
  TreeFormatter(data){
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
      delete item.children;
    });
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
      map[item.id] = item;
    });
    var val = [];
    data.forEach(function (item,index) {
      // 以当前遍历项，parent,去map对象中找到索引的id
      var parent = map[item.parent];
      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        item['level']=index;
        (parent.children || ( parent.children = [] )).push(item);
      } else {
        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        // item=Object.assign(item,{expand: true})
        val.push(item);
      }
    });
    return val;
  }

}

export default functions;