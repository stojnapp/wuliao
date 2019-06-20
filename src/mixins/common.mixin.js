const commonMethods={
    filters: {

      /* 发放状态 */
      provflagStates(val){
          /* 0:未发放完毕、1:已发放完毕、2:部份发放 */
          var back='';
          switch (val) {
            case 0:
                back='未发放完毕';
                break;
            case 1:
                back='已发放完毕';
                break;
            case 2:
                back='部份发放';
                break;    
          }
          return back;
      },
        
      historyStates(val){
          /* 申购单状态 0未审 1审核 2取消 3作废 4退回 , 修改后   0未审 1未发放 2取消 3作废 4退回 5已发放  */
          var back='';
          switch(val){
            case 0:
                back='未审核';
            break;
            case 1:
                back='未发放';
            break;
            case 2:
                back='已取消';
            break;
            case 3:
                back='已作废';
            break;
            case 4:
                back='已退回';
            break;
            case 5:
                back='已发放';
            break;    
          }
        
          return back;
      },
      netType(val){
        /* 0:网点、1:业务员、2:客户*/
        var back='';
        switch(val){
        case '0':
            back='网点';
            break;
        case '1':
            back='业务员';
            break;   
        case '2':
            back='客户';
            break;
        }
        return back;
      },
      /* 物料类型格式化：物料类型(0 面单类 1 辅料类 2 其他类) */
      goodsTypeformatter(val){
        var back='';
        switch(val){
            case 0:
                back='面单类';
                break;
            case 1:
                back='辅料类';
                break;   
            case 2:
                back='其他类';
                break;
        }
        return back;
      }
    },
    methods:{
        addshadeCover(top=45,callback=function(){}){
            var parentDom=document.getElementById('box_content');
            var childDom=document.createElement("div");
            var HeaderDom=document.getElementById('header');
            if(HeaderDom){
                var headerHeight=HeaderDom.clientHeight;
                top+=headerHeight;
            }
            childDom.classList='shadeCover';
            childDom.style.top=top+'px';
            childDom.id='shadeCover';
            parentDom.appendChild(childDom);
            childDom.onclick=callback;
        },
        delshadeCover(){
            var nodeDom=document.getElementById("shadeCover");
            if(nodeDom)nodeDom.parentNode.removeChild(nodeDom);
        },

        /* 格式化提交申购单数据 */
        formatterSubmitdata(data){

        },

        
    }
}
export {commonMethods}