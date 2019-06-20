/*
* name@Tools
  author@344822559@qq.com
  time@2019/03/21
* */

/* For iviewUi */
const iviewTool={

  sendMessage:(content='',type=0,closable=false,onClose=function(){},duration=1.5,top=50)=>{
      var config={
        content,
        duration,
        onClose,
        closable,
        top
      }
      /*
      * params@{0:info,1:success,2:warning,3:error,4:loading}
      * */
      switch (type){
        case 0:
            iview.Message.info(config);
          break;
        case 1:
            iview.Message.success(config);
          break;
        case 2:
            iview.Message.warning(config);
          break;
        case 3:
            iview.Message.error(config);
          break;
        case 4:
            iview.Message.loading(config);
          break;

      }

  },

  /*destroy MessageAlert*/
  closeMessage(){
      iview.Message.destroy()
  }
}


/* For Vant */
export const vantTool={

  sendMessage:(msg,position='bottom')=>{
      vant.Toast.allowMultiple();
      vant.Toast({
        position,
        message: msg
      })
    },

    showloading:(msg='加载中...',mask=true,loadingType='spinner')=>{
      vant.Toast.loading({
        mask,
        loadingType,
        message: msg
      });
    },

    closeMessage:()=>{
      vant.Toast.clear()
    },

    DialogMessage(msg){
      vant.Dialog.alert({
        message: msg
        }).then(() => {
        // on close
        });
    },

    DialogSuccess(msg,duration=3000,type='success',position='middle'){
      vant.Toast.allowMultiple();
      vant.Toast({
        type,
        position,
        duration,
        message:msg
      });
    },


    Dialogconfirm(msg,title,btn,beforeClose){
      vant.Dialog.confirm({
        title,
        confirmButtonText:btn,
        message: msg,
        beforeClose
        })
        
    }




    

}


export default {
  iviewTool,
  vantTool
} 
